import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnMap",
  description: "Curated roadmaps and the best resources to learn any tech.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}