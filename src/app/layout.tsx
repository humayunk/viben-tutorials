import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { MainWrapper } from "@/components/main-wrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viben Tutorials",
  description: "Content processing pipeline for Viben tutorial cards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SiteNav />
        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  );
}
