"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AreaProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const area = pathname.startsWith("/lotto")
      ? "lotto"
      : pathname.startsWith("/blog") || pathname.startsWith("/korea")
      ? "korea"
      : pathname.startsWith("/tools")
      ? "tools"
      : "main";

    document.body.setAttribute("data-area", area);
  }, [pathname]);

  return null;
}
