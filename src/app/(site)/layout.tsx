import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { sanityFetch } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";
import { fallbackSettings } from "@/lib/fallbacks";
import type { SiteSettings } from "@/types/content";
import { isSanityConfigured } from "@/sanity/env";

async function getSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) return fallbackSettings;

  try {
    return (await sanityFetch<SiteSettings>(siteSettingsQuery)) || fallbackSettings;
  } catch {
    return fallbackSettings;
  }
}

export default async function SiteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <>
      <Header settings={settings} />
      {children}
      <Footer settings={settings} />
    </>
  );
}
