import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Retro & Action Tracker",
  description: "AI-powered retrospective action extraction and tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas-white">{children}</body>
    </html>
  );
}
