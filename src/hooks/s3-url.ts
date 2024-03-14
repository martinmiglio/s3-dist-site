import { useState, useEffect, useCallback, useRef } from "react";

export default function useS3URL(key: string) {
  const [url, setURL] = useState<string | null>(null);
  const timeout = useRef<NodeJS.Timeout>();

  const refreshURL = useCallback(async () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    const res = await fetch(`/api/presign?key=${key}`);
    const data = await res.json();
    setURL(data.url);
    const maxAge = res.headers.get("cache-control")?.split("=")[1];
    if (maxAge) {
      timeout.current = setTimeout(refreshURL, parseInt(maxAge) * 1000);
    }
  }, [key]);

  useEffect(() => {
    refreshURL();
  }, [refreshURL]);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return { url, forceRefresh: refreshURL };
}
