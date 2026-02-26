"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNav() {
  const pathname = usePathname();

  // Hide site nav when inside the tutorial player
  if (pathname.startsWith("/play")) return null;

  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-primary">
          Viben
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Browse
        </Link>
        <Link
          href="/tutorials"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Tutorials
        </Link>
      </nav>
    </header>
  );
}
