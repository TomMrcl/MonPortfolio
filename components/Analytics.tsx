"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const EXCLUDED = ["/admin", "/login"];

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (EXCLUDED.some((prefix) => pathname.startsWith(prefix))) return;

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
