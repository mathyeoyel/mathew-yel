export default function StudioLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-dvh min-h-screen w-full overflow-hidden">{children}</div>;
}
