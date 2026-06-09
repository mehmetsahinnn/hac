import type { Metadata } from "next";
import "./globals.css";
import DesktopBar from "@/components/DesktopBar";

export const metadata: Metadata = {
  title: "RetroTool - Online Retrospectives",
  description: "The easiest way to run engaging online retrospectives for remote and hybrid teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <DesktopBar />
        <div className="pt-7">{children}</div>
      </body>
    </html>
  );
}
