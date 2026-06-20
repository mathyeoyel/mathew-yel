import { createClient, type SanityClient } from "@sanity/client";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

type PortableTextBlock = {
  _type: "block";
  _key: string;
  style: "normal";
  markDefs: [];
  children: Array<{
    _type: "span";
    _key: string;
    text: string;
    marks: [];
  }>;
};

type MigrationStats = {
  profiles: number;
  projects: number;
  awards: number;
  posts: number;
  skippedFiles: string[];
};

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "data");
const PROFILE_DOCUMENT_ID = "profile";

const PROJECT_STATUS_VALUES = new Set([
  "completed",
  "in-progress",
  "ongoing",
  "archived"
]);

const PROJECT_CATEGORIES = new Set([
  "Product",
  "Website",
  "Branding",
  "Community Platform",
  "Client Work",
  "UI/UX",
  "CMS",
  "Startup"
]);

loadEnvFile(join(ROOT, ".env.local"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-19";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false
});

const stats: MigrationStats = {
  profiles: 0,
  projects: 0,
  awards: 0,
  posts: 0,
  skippedFiles: []
};

async function main() {
  console.log(`Seeding Sanity project ${projectId} (${dataset})...`);

  await migrateProfile(client);
  await migrateProjects(client);
  await migrateAwards(client);
  await migratePosts(client);

  console.log("\nMigration complete:");
  console.log(`- Profiles migrated: ${stats.profiles}`);
  console.log(`- Projects migrated: ${stats.projects}`);
  console.log(`- Awards migrated: ${stats.awards}`);
  console.log(`- Posts migrated: ${stats.posts}`);

  if (stats.skippedFiles.length) {
    console.log("- Skipped files:");
    for (const file of stats.skippedFiles) {
      console.log(`  - ${file}`);
    }
  } else {
    console.log("- Skipped files: none");
  }
}

async function migrateProfile(sanity: SanityClient) {
  const filePath = join(DATA_DIR, "personal.json");
  const data = readJsonFile<Record<string, unknown>>(filePath);

  if (!data) {
    stats.skippedFiles.push("data/personal.json");
    return;
  }

  const hero = asRecord(data.hero);
  const about = asRecord(data.about);
  const contact = asRecord(data.contact);
  const quickInfo = asArray(hero?.quickInfo);
  const firstQuickInfo = asRecord(quickInfo[0]);

  const currentFocus = uniqueStrings([
    ...asStringArray(hero?.highlights),
    ...asStringArray(about?.atAGlance),
    ...asStringArray(data.currentFocus)
  ]);

  const profile = {
    _id: PROFILE_DOCUMENT_ID,
    _type: "profile" as const,
    name: asString(hero?.name) || "Mathew Yel",
    headline:
      asString(hero?.title) ||
      "Creative Technologist, UI/UX Designer & Founder of VikraHub",
    shortBio:
      asString(hero?.description) ||
      "I design brands, build digital products, and document the journey of shaping creative technology in South Sudan.",
    fullBio: textToPortableText(asString(about?.content)),
    location:
      asString(firstQuickInfo?.text) ||
      asString(data.location) ||
      "Juba, South Sudan",
    email: asString(contact?.email),
    phone: asString(contact?.phone) || asString(contact?.whatsapp),
    currentFocus: currentFocus.length ? currentFocus : undefined
  };

  await sanity.createOrReplace(profile);
  stats.profiles += 1;
  console.log(`Migrated profile -> _id "${PROFILE_DOCUMENT_ID}"`);
}

async function migrateProjects(sanity: SanityClient) {
  const filePath = join(DATA_DIR, "projects.json");
  const data = readJsonFile<unknown>(filePath);

  if (!data) {
    stats.skippedFiles.push("data/projects.json");
    return;
  }

  const items = extractItems(data);
  const existingProjectIds = new Set(
    await sanity.fetch<string[]>(`*[_type == "project"]._id`)
  );
  const seenSlugs = new Set<string>();
  let hadItemPrefixedIds = false;

  for (const item of items) {
    const record = asRecord(item);
    if (!record) continue;

    const title = asString(record.title);
    if (!title) continue;

    const oldId = asString(record.id);
    const { slug, sourceLabel } = resolveProjectSlug(record, title);

    if (oldId?.startsWith("item-")) {
      hadItemPrefixedIds = true;
    }

    const documentId = `project-${slug}`;

    if (existingProjectIds.has(documentId) || seenSlugs.has(slug)) {
      console.log(
        `Skipped project (clean document already exists): ${sourceLabel} -> ${slug}`
      );
      continue;
    }

    seenSlugs.add(slug);

    const tags = asStringArray(record.tags);
    const technologies = asStringArray(record.tech ?? record.technologies);

    const project = {
      _id: documentId,
      _type: "project" as const,
      title,
      slug: { _type: "slug" as const, current: slug },
      summary: truncate(asString(record.summary) || title, 240),
      description: textToPortableText(
        asString(record.description) || asString(record.content)
      ),
      role: asString(record.role),
      status: normalizeProjectStatus(asString(record.status)),
      startDate: normalizeDate(asString(record.startDate)),
      endDate: normalizeDate(asString(record.endDate)),
      projectUrl: asString(record.link ?? record.projectUrl ?? record.url),
      technologies: technologies.length ? technologies : undefined,
      tags: tags.length ? tags : undefined,
      featured: asBoolean(record.featured),
      category: normalizeProjectCategory(
        asString(record.category),
        tags,
        asString(record.status)
      )
    };

    await sanity.createOrReplace(project);
    existingProjectIds.add(documentId);
    stats.projects += 1;
    console.log(`Project slug: ${sourceLabel} -> ${slug} (_id "${documentId}")`);
  }

  if (hadItemPrefixedIds) {
    console.warn(
      "\nWARNING: Some source projects used generated item-* IDs. Clean project documents were created with title-based slugs."
    );
    console.warn(
      "After confirming the clean project-* documents in Studio, manually delete old project-item-* documents."
    );
    console.warn("This script does not delete existing migrated documents automatically.");
  }
}

async function migrateAwards(sanity: SanityClient) {
  const filePath = join(DATA_DIR, "awards.json");
  const data = readJsonFile<unknown>(filePath);

  if (!data) {
    stats.skippedFiles.push("data/awards.json");
    return;
  }

  const items = extractItems(data);

  for (const item of items) {
    const record = asRecord(item);
    if (!record) continue;

    const title = asString(record.title);
    const year = asString(record.year);

    if (!title || !year) continue;

    const slug =
      asString(record.slug) ||
      asString(record.id) ||
      slugify(`${title}-${year}`);

    const award = {
      _id: `award-${slug}`,
      _type: "award" as const,
      title,
      organization: asString(record.organization ?? record.org),
      year,
      date: normalizeDate(asString(record.date)),
      description: asString(record.description),
      category: asString(record.category),
      link: asString(record.link ?? record.url),
      featured: asBoolean(record.featured)
    };

    await sanity.createOrReplace(award);
    stats.awards += 1;
    console.log(`Migrated award -> _id "award-${slug}"`);
  }
}

async function migratePosts(sanity: SanityClient) {
  const blogs = readJsonItems("blogs.json");
  const posts = readJsonItems("posts.json");
  const merged = new Map<string, Record<string, unknown>>();

  if (!blogs.exists) {
    stats.skippedFiles.push("data/blogs.json");
  }

  if (!posts.exists) {
    stats.skippedFiles.push("data/posts.json");
  }

  for (const item of [...blogs.items, ...posts.items]) {
    const record = asRecord(item);
    if (!record) continue;

    const title = asString(record.title);
    if (!title) continue;

    const slug =
      asString(record.slug) ||
      asString(record.id) ||
      slugify(title);

    merged.set(slug, record);
  }

  for (const [slug, record] of merged.entries()) {
    const title = asString(record.title);
    if (!title) continue;

    const post = {
      _id: `post-${slug}`,
      _type: "post" as const,
      title,
      slug: { _type: "slug" as const, current: slug },
      excerpt: truncate(
        asString(record.excerpt) ||
          asString(record.summary) ||
          asString(record.description) ||
          title,
        260
      ),
      content: textToPortableText(
        asString(record.content) || asString(record.body)
      ),
      publishedAt: normalizeDateTime(
        asString(record.date ?? record.publishedAt ?? record.createdAt)
      ),
      category: asString(record.category),
      tags: asStringArray(record.tags),
      readingTime: asNumber(record.readingTime),
      featured: asBoolean(record.featured),
      status: normalizePostStatus(asString(record.status))
    };

    await sanity.createOrReplace(post);
    stats.posts += 1;
    console.log(`Migrated post -> _id "post-${slug}"`);
  }
}

function readJsonItems(filename: string): { items: unknown[]; exists: boolean } {
  const filePath = join(DATA_DIR, filename);
  if (!existsSync(filePath)) {
    return { items: [], exists: false };
  }

  const data = readJsonFile<unknown>(filePath);
  if (!data) {
    return { items: [], exists: true };
  }

  return { items: extractItems(data), exists: true };
}

function readJsonFile<T>(filePath: string): T | null {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch (error) {
    console.warn(`Failed to parse ${filePath}:`, error);
    return null;
  }
}

function extractItems(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;

  const record = asRecord(data);
  if (!record) return [];

  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.projects)) return record.projects;
  if (Array.isArray(record.awards)) return record.awards;
  if (Array.isArray(record.posts)) return record.posts;
  if (Array.isArray(record.blogs)) return record.blogs;

  return [];
}

function textToPortableText(
  text: string | undefined
): PortableTextBlock[] | undefined {
  if (!text?.trim()) return undefined;

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      _type: "block" as const,
      _key: `block-${index}`,
      style: "normal" as const,
      markDefs: [] as [],
      children: [
        {
          _type: "span" as const,
          _key: `span-${index}`,
          text: paragraph,
          marks: [] as []
        }
      ]
    }));
}

function resolveProjectSlug(
  record: Record<string, unknown>,
  title: string
): { slug: string; sourceLabel: string } {
  const oldId = asString(record.id);
  const explicitSlug = asString(record.slug);

  if (explicitSlug && !isGeneratedItemId(explicitSlug)) {
    return {
      slug: slugify(explicitSlug),
      sourceLabel: oldId || explicitSlug
    };
  }

  if (oldId && !isGeneratedItemId(oldId)) {
    return {
      slug: slugify(oldId),
      sourceLabel: oldId
    };
  }

  return {
    slug: slugify(title),
    sourceLabel: oldId || title
  };
}

function isGeneratedItemId(value: string): boolean {
  return value.startsWith("item-");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeProjectStatus(status: string | undefined): string {
  if (!status) return "completed";

  const normalized = status.toLowerCase().trim();

  if (PROJECT_STATUS_VALUES.has(normalized)) {
    return normalized;
  }

  if (normalized.includes("progress")) return "in-progress";
  if (normalized.includes("ongoing")) return "ongoing";
  if (normalized.includes("archive")) return "archived";

  return "completed";
}

function normalizeProjectCategory(
  category: string | undefined,
  tags: string[],
  status: string | undefined
): string | undefined {
  if (category && PROJECT_CATEGORIES.has(category)) {
    return category;
  }

  const haystack = `${category || ""} ${tags.join(" ")} ${status || ""}`.toLowerCase();

  if (haystack.includes("ui") || haystack.includes("ux")) return "UI/UX";
  if (haystack.includes("brand")) return "Branding";
  if (haystack.includes("community")) return "Community Platform";
  if (haystack.includes("client")) return "Client Work";
  if (haystack.includes("cms")) return "CMS";
  if (haystack.includes("startup") || haystack.includes("product")) return "Product";
  if (haystack.includes("website") || haystack.includes("web")) return "Website";

  return category || undefined;
}

function normalizePostStatus(status: string | undefined): "draft" | "published" {
  if (!status) return "published";
  return status.toLowerCase().trim() === "draft" ? "draft" : "published";
}

function normalizeDate(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toISOString().slice(0, 10);
}

function normalizeDateTime(value: string | undefined): string {
  if (!value?.trim()) {
    return new Date().toISOString();
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : undefined))
    .filter((item): item is string => Boolean(item));
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;

  const contents = readFileSync(filePath, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
