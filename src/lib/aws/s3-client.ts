import { PRESIGNED_URL_EXPIRATION } from "@/consts";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  type _Object,
} from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

const schema = z.object({
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_RESOURCE_PREFIX: z.string(),
});

const env = schema.parse(process.env);
const bucketName = `${env.AWS_RESOURCE_PREFIX}-dist`;
const s3Client = new S3Client({
  credentials: fromEnv(),
  region: env.AWS_REGION,
});

interface S3Object extends _Object {
  IsDirectory: boolean;
  Prefix?: string;
}

export const getAllObjects = async (directory: string = "") => {
  const prefix =
    directory.endsWith("/") || directory.length === 0
      ? directory
      : `${directory}/`;

  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
    Delimiter: "/",
  });
  const data = await s3Client.send(command);
  const objects: S3Object[] = [];

  if (data.Contents) {
    for (const object of data.Contents) {
      if (object.Key === prefix) {
        continue;
      }

      const isDirectory = object.Key?.endsWith("/") ?? false;
      objects.push({ ...object, IsDirectory: isDirectory });
    }
  }

  if (data.CommonPrefixes) {
    for (const commonPrefix of data.CommonPrefixes) {
      objects.push({ ...commonPrefix, IsDirectory: true });
    }
  }

  return objects;
};

export const getObjectURL = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  return await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRATION,
  });
};
