export function isPublicNavLink(href: string): boolean {
  const normalized = href.replace(/\/+$/, "") || "/";
  return normalized !== "/studio" && !normalized.startsWith("/studio/");
}

export function filterPublicNavLinks<T extends { href: string }>(links: T[] | undefined | null): T[] {
  return links?.filter((link) => isPublicNavLink(link.href)) ?? [];
}
