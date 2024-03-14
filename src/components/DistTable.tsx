"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import useS3URL from "@/hooks/s3-url";
import { Download, Loader2 } from "lucide-react";
import Link from "next/link";
import prettyBytes from "pretty-bytes";

export type Dist = {
  name: string;
  key: string;
  date: Date;
  size: number;
};

export default function DistTable({ dists }: Readonly<{ dists: Dist[] }>) {
  dists.sort((a, b) => b.date.getTime() - a.date.getTime());
  const readme = dists.find((dist) => dist.name.startsWith("README"));
  if (readme) {
    dists = dists.filter((dist) => !dist.name.startsWith("README"));
    dists.unshift(readme);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Download</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dists.map((dist) => (
          <DistTableRow key={dist.name} dist={dist} />
        ))}
      </TableBody>
    </Table>
  );
}

function DistTableRow({ dist }: Readonly<{ dist: Dist }>) {
  const { url } = useS3URL(dist.key);
  return (
    <TableRow>
      <TableCell>{dist.name}</TableCell>
      <TableCell>{dist.date.toLocaleDateString()}</TableCell>
      <TableCell>{prettyBytes(dist.size)}</TableCell>
      <TableCell>
        {url ? (
          <Link href={url} download target="_blank">
            <Download className="h-6 w-6" />
          </Link>
        ) : (
          <Loader2 className="h-6 w-6 animate-spin" />
        )}
      </TableCell>
    </TableRow>
  );
}
