import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { sanityFetch } from "@/sanity/client";
import { footerProfileQuery, siteSettingsQuery } from "@/sanity/queries";
import { fallbackProfile, fallbackSettings } from "@/lib/fallbacks";
import type { Profile, SiteSettings } from "@/types/content";
import { isSanityConfigured } from "@/sanity/env";

async function getSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) return fallbackSettings;

  try {
    return (await sanityFetch<SiteSettings>(siteSettingsQuery)) || fallbackSettings;
  } catch {
    return fallbackSettings;
  }
}

async function getFooterProfile(): Promise<Pick<Profile, "name" | "socialLinks">> {
  if (!isSanityConfigured) {
    return {
      name: fallbackProfile.name,
      socialLinks: fallbackProfile.socialLinks
    };
  }

  try {
    const profile = await sanityFetch<Pick<Profile, "name" | "socialLinks">>(footerProfileQuery);
    return profile || { name: fallbackProfile.name, socialLinks: fallbackProfile.socialLinks };
  } catch {
    return {
      name: fallbackProfile.name,
      socialLinks: fallbackProfile.socialLinks
    };
  }
}

export default async function SiteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, profile] = await Promise.all([getSettings(), getFooterProfile()]);

  return (
    <>
      <Header settings={settings} />
      {children}
      <Footer settings={settings} profile={profile} />
    </>
  );
}
