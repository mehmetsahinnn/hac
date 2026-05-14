import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Retro & Action Tracker",
  description: "Extract and track action items from retrospective meetings with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
