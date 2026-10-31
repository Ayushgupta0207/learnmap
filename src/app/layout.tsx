import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: step-by-step learning roadmaps`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Curated, step-by-step roadmaps with the best resources to learn any tech, each one with a reason why it is worth your time.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
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