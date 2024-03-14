import { PRESIGNED_URL_EXPIRATION } from "@/consts";
import { getObjectURL } from "@/lib/aws/s3-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const objectKey = req.nextUrl.searchParams.get("key");

  if (!objectKey) {
    return NextResponse.json(
      { message: "Missing key query parameter" },
      { status: 400 },
    );
  }

  const preSignedURL = await getObjectURL(objectKey);

  return NextResponse.json(
    { url: preSignedURL },
    {
      headers: {
        "Cache-Control": `max-age=${PRESIGNED_URL_EXPIRATION}`,
      },
    },
  );
}
