import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function StudioLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-dvh min-h-screen w-full overflow-hidden">{children}</div>;
}
