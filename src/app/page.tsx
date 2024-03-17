import DistTable, { type Dist } from "@/components/DistTable";
import { getAllObjects } from "@/lib/aws/s3-client";

export const revalidate = 60; // revalidate the data every 60 seconds

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: { prefix?: string };
}>) {
  const bucketObjects = await getAllObjects(
    decodeURIComponent(searchParams.prefix ?? "")
  );

  const distsList: Dist[] = bucketObjects.map((object) => ({
    key: object.Key ?? object.Prefix ?? "",
    date: object.LastModified ?? new Date(),
    size: object.Size ?? 0,
    isDirectory: object.IsDirectory,
  }));

  if (searchParams.prefix && searchParams.prefix !== "") {
    distsList.unshift({
      name: "..",
      key: searchParams.prefix.replace(/[^/]+\/$/, ""),
      date: new Date(),
      size: 0,
      isDirectory: true,
    });
  }

  return <DistTable dists={distsList} />;
}
