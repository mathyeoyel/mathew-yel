import type { LinkItem, Profile, SiteSettings, SiteSocialPlatform } from "@/types/content";

export type FooterSocialLink = {
  platform: SiteSocialPlatform;
  href: string;
  ariaLabel: string;
  external: boolean;
};

const PLATFORM_LABELS: Record<SiteSocialPlatform, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  x: "X",
  linkedin: "LinkedIn",
  github: "GitHub",
  instagram: "Instagram",
  vikrahub: "VikraHub",
  website: "Website"
};

const PROFILE_PLATFORM_MATCHERS: Array<{ platform: SiteSocialPlatform; patterns: string[] }> = [
  { platform: "facebook", patterns: ["facebook.com", "facebook"] },
  { platform: "x", patterns: ["twitter.com", "x.com", "twitter"] },
  { platform: "linkedin", patterns: ["linkedin.com", "linkedin"] },
  { platform: "github", patterns: ["github.com", "github"] },
  { platform: "instagram", patterns: ["instagram.com", "instagram"] },
  { platform: "vikrahub", patterns: ["vikrahub"] }
];

function formatEmailHref(value: string): string {
  if (value.startsWith("mailto:")) {
    return value;
  }

  if (value.includes("@") && !value.startsWith("http")) {
    return `mailto:${value}`;
  }

  return value;
}

function formatWhatsAppHref(value: string): string {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : value;
}

function resolveHref(platform: SiteSocialPlatform, url: string): string {
  if (platform === "email") {
    return formatEmailHref(url);
  }

  if (platform === "whatsapp") {
    return formatWhatsAppHref(url);
  }

  return url;
}

function isExternalLink(platform: SiteSocialPlatform, href: string): boolean {
  return platform !== "email" && !href.startsWith("mailto:");
}

function detectProfilePlatform(label: string, url: string): SiteSocialPlatform {
  const haystack = `${label} ${url}`.toLowerCase();

  for (const { platform, patterns } of PROFILE_PLATFORM_MATCHERS) {
    if (patterns.some((pattern) => haystack.includes(pattern))) {
      return platform;
    }
  }

  return "website";
}

function getAriaLabel(
  platform: SiteSocialPlatform,
  siteTitle: string,
  customLabel?: string
): string {
  if (platform === "email") {
    return `Email ${siteTitle}`;
  }

  if (platform === "whatsapp") {
    return `Message ${siteTitle} on WhatsApp`;
  }

  if (platform === "vikrahub") {
    return "Visit VikraHub";
  }

  if (platform === "website" && customLabel) {
    return `Visit ${customLabel}`;
  }

  if (platform === "website") {
    return `Visit ${siteTitle}'s website`;
  }

  return `Visit ${siteTitle} on ${PLATFORM_LABELS[platform]}`;
}

function createFooterSocialLink(
  platform: SiteSocialPlatform,
  url: string,
  siteTitle: string,
  customLabel?: string
): FooterSocialLink {
  const href = resolveHref(platform, url);

  return {
    platform,
    href,
    ariaLabel: getAriaLabel(platform, siteTitle, customLabel),
    external: isExternalLink(platform, href)
  };
}

export function getFooterSocialLinks(
  settings?: SiteSettings | null,
  profile?: Pick<Profile, "name" | "socialLinks"> | null
): FooterSocialLink[] {
  const siteTitle = settings?.siteTitle || profile?.name || "Mathew Yel";
  const links: FooterSocialLink[] = [];
  const seenKeys = new Set<string>();

  const addLink = (
    platform: SiteSocialPlatform,
    url?: string | null,
    customLabel?: string
  ) => {
    if (!url) {
      return;
    }

    const href = resolveHref(platform, url);
    const key = `${platform}:${href}`;

    if (seenKeys.has(key)) {
      return;
    }

    seenKeys.add(key);
    links.push(createFooterSocialLink(platform, url, siteTitle, customLabel));
  };

  addLink("email", settings?.contactEmail);
  addLink("whatsapp", settings?.whatsapp);

  profile?.socialLinks?.forEach((link: LinkItem) => {
    if (!link.url) {
      return;
    }

    const platform = detectProfilePlatform(link.label, link.url);
    addLink(platform, link.url, link.label);
  });

  return links;
}

export { PLATFORM_LABELS };
