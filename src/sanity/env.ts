const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-19";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Keep a syntactically valid placeholder so imports do not crash before env setup.
export const projectId = rawProjectId || "dummyprojectid";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mathewyel.com";

export const isSanityConfigured = Boolean(rawProjectId && dataset);
