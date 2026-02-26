"use client";

import { usePathname } from "next/navigation";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/play")) {
    return <>{children}</>;
  }

  return <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>;
}
