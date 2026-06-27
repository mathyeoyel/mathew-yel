import type { ProjectCard } from "@/types/content";

export const WORK_CATEGORIES = [
  "All",
  "Digital Products",
  "Websites",
  "Brand Identity",
  "Print Materials",
  "UI/UX",
  "Community Platforms"
] as const;

export type WorkCategoryFilter = (typeof WORK_CATEGORIES)[number];

const CATEGORY_SHORT_LABELS: Partial<Record<WorkCategoryFilter, string>> = {
  "Digital Products": "Products",
  "Brand Identity": "Branding",
  "Print Materials": "Print",
  "Community Platforms": "Community"
};

export function getCategoryShortLabel(category: WorkCategoryFilter): string {
  return CATEGORY_SHORT_LABELS[category] ?? category;
}

const CATEGORY_ALIASES: Record<string, WorkCategoryFilter> = {
  Product: "Digital Products",
  Website: "Websites",
  Branding: "Brand Identity",
  "Community Platform": "Community Platforms",
  CMS: "Websites",
  Startup: "Digital Products",
  "UI/UX": "UI/UX"
};

const BRAND_TAG_KEYWORDS = [
  "company profile",
  "corporate identity",
  "branding",
  "logo",
  "brand presentation",
  "stationery"
];

const PRINT_TAG_KEYWORDS = [
  "print design",
  "business cards",
  "letterhead",
  "staff id",
  "pull-up banner",
  "banner",
  "t-shirt",
  "caps",
  "folder",
  "stationery"
];

const WEBSITE_TAG_KEYWORDS = ["website", "cms", "seo", "next.js", "sanity"];

const DIGITAL_PRODUCT_TAG_KEYWORDS = [
  "platform",
  "web app",
  "dashboard",
  "system",
  "voting system",
  "membership system"
];

const COMMUNITY_TAG_KEYWORDS = ["community", "ngo", "association", "youth", "creators"];

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function tagMatchesKeywords(tag: string, keywords: string[]): boolean {
  const normalizedTag = normalize(tag);
  return keywords.some(
    (keyword) => normalizedTag.includes(keyword) || keyword.includes(normalizedTag)
  );
}

function addCategory(matches: Set<WorkCategoryFilter>, category: string) {
  const mapped = (CATEGORY_ALIASES[category] ?? category) as WorkCategoryFilter;

  if (mapped !== "All" && WORK_CATEGORIES.includes(mapped)) {
    matches.add(mapped);
  }
}

function addTagMatches(matches: Set<WorkCategoryFilter>, project: ProjectCard) {
  for (const tag of project.tags ?? []) {
    if (tagMatchesKeywords(tag, BRAND_TAG_KEYWORDS)) {
      matches.add("Brand Identity");
    }

    if (tagMatchesKeywords(tag, PRINT_TAG_KEYWORDS)) {
      matches.add("Print Materials");
    }

    if (tagMatchesKeywords(tag, WEBSITE_TAG_KEYWORDS)) {
      matches.add("Websites");
    }

    if (tagMatchesKeywords(tag, DIGITAL_PRODUCT_TAG_KEYWORDS)) {
      matches.add("Digital Products");
    }

    if (tagMatchesKeywords(tag, COMMUNITY_TAG_KEYWORDS)) {
      matches.add("Community Platforms");
    }
  }
}

export function getProjectCategories(project: ProjectCard): WorkCategoryFilter[] {
  const matches = new Set<WorkCategoryFilter>();

  for (const category of project.categories ?? []) {
    addCategory(matches, category);
  }

  if (project.category) {
    addCategory(matches, project.category);
  }

  addTagMatches(matches, project);

  return Array.from(matches);
}

export function getProjectDisplayCategories(project: ProjectCard): string[] {
  const explicit = project.categories?.filter((category) =>
    WORK_CATEGORIES.includes(category as WorkCategoryFilter)
  );

  if (explicit?.length) {
    return explicit;
  }

  if (project.category) {
    const mapped = CATEGORY_ALIASES[project.category] ?? project.category;

    if (WORK_CATEGORIES.includes(mapped as WorkCategoryFilter)) {
      return [mapped];
    }
  }

  return getProjectCategories(project);
}

export function projectMatchesCategory(
  project: ProjectCard,
  filter: WorkCategoryFilter
): boolean {
  if (filter === "All") {
    return true;
  }

  return getProjectCategories(project).includes(filter);
}

export function countProjectsByCategory(
  projects: ProjectCard[],
  filter: WorkCategoryFilter
): number {
  if (filter === "All") {
    return projects.length;
  }

  return projects.filter((project) => projectMatchesCategory(project, filter)).length;
}
