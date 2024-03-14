import DistTable from "@/components/DistTable";
import { getAllObjects } from "@/lib/aws/s3-client";

export const revalidate = 60; // revalidate the data every 60 seconds

export default async function Page() {
  const bucketObjects = (await getAllObjects()).filter(
    (object) => !object.Key?.endsWith("/")
  );

  return (
    <DistTable
      dists={bucketObjects.map((object) => ({
        name: object.Key ?? "",
        key: object.Key ?? "",
        date: object.LastModified ?? new Date(),
        size: object.Size ?? 0,
      }))}
    />
  );
}
