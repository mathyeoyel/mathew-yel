import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/sanity/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mathew Yel — Creative Technologist",
    template: "%s — Mathew Yel"
  },
  description:
    "Creative technologist, UI/UX designer, and founder of VikraHub.",
  openGraph: {
    title: "Mathew Yel",
    description:
      "Creative technologist, UI/UX designer, and founder of VikraHub.",
    url: siteUrl,
    siteName: "Mathew Yel",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
