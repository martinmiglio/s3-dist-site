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
import { Download, Loader2, Folder } from "lucide-react";
import Link from "next/link";
import prettyBytes from "pretty-bytes";

export type Dist = {
  name?: string;
  key: string;
  date: Date;
  size: number;
  isDirectory?: boolean;
};

export default function DistTable({ dists }: Readonly<{ dists: Dist[] }>) {
  dists.sort((a, b) => b.date.getTime() - a.date.getTime());
  const readme = dists.find((dist) => dist.key.startsWith("README"));
  if (readme) {
    dists = dists.filter((dist) => !dist.key.startsWith("README"));
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
          <DistTableRow key={dist.key} dist={dist} />
        ))}
      </TableBody>
    </Table>
  );
}

function DistTableRow({ dist }: Readonly<{ dist: Dist }>) {
  return (
    <TableRow>
      <TableCell>{dist.name ?? dist.key}</TableCell>
      <TableCell>{dist.date.toLocaleDateString()}</TableCell>
      <TableCell>{prettyBytes(dist.size)}</TableCell>
      {dist.isDirectory ? (
        <DistDirectoryCell distKey={dist.key} />
      ) : (
        <DistDownloadCell distKey={dist.key} />
      )}
    </TableRow>
  );
}

function DistDirectoryCell({ distKey: key }: Readonly<{ distKey: string }>) {
  const url = `/?prefix=${encodeURIComponent(key)}`;
  return (
    <TableCell>
      <Link href={url}>
        <Folder className="h-6 w-6" />
      </Link>
    </TableCell>
  );
}

function DistDownloadCell({ distKey: key }: Readonly<{ distKey: string }>) {
  const { url: presignedUrl } = useS3URL(key);
  const url = presignedUrl;
  return (
    <TableCell>
      {url ? (
        <Link href={url} download target="_blank">
          <Download className="h-6 w-6" />
        </Link>
      ) : (
        <Loader2 className="h-6 w-6 animate-spin" />
      )}
    </TableCell>
  );
}
