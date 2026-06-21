import type { PortableTextBlock } from "sanity";

export type ImageWithAlt = {
  _key?: string;
  asset?: unknown;
  url?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type LinkItem = {
  label: string;
  url: string;
};

export type Cta = {
  text?: string;
  href?: string;
};

export type Profile = {
  name: string;
  preferredName?: string;
  headline?: string;
  shortBio?: string;
  fullBio?: PortableTextBlock[];
  heroImage?: ImageWithAlt;
  location?: string;
  email?: string;
  phone?: string;
  currentFocus?: string[];
  socialLinks?: LinkItem[];
  ctaPrimary?: Cta;
  ctaSecondary?: Cta;
};

export type ProjectCard = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: ImageWithAlt;
  role?: string;
  status?: string;
  category?: string;
  tags?: string[];
  technologies?: string[];
  projectUrl?: string;
};

export type ProjectDetail = ProjectCard & {
  description?: PortableTextBlock[];
  galleryImages?: ImageWithAlt[];
  startDate?: string;
  endDate?: string;
  client?: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

export type ActivityCard = {
  _id: string;
  title: string;
  slug: string;
  activityDate: string;
  category?: string;
  location?: string;
  shortDescription?: string;
  coverImage?: ImageWithAlt;
  featured?: boolean;
  showOnHomepage?: boolean;
  homepageOrder?: number;
};

export type ActivityDetail = ActivityCard & {
  content?: PortableTextBlock[];
  galleryImages?: ImageWithAlt[];
  seo?: {
    title?: string;
    description?: string;
  };
  relatedProject?: {
    title: string;
    slug: string;
    summary?: string;
  };
};

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  coverImage?: ImageWithAlt;
  category?: string;
  tags?: string[];
  readingTime?: number;
  featured?: boolean;
};

export type PostDetail = PostCard & {
  content?: PortableTextBlock[];
  galleryImages?: ImageWithAlt[];
  seo?: {
    title?: string;
    description?: string;
  };
};

export type Award = {
  _id: string;
  title: string;
  organization?: string;
  year?: string;
  date?: string;
  description?: string;
  category?: string;
  image?: ImageWithAlt;
  link?: string;
  featured?: boolean;
};

export type SiteSocialPlatform =
  | "email"
  | "whatsapp"
  | "facebook"
  | "x"
  | "linkedin"
  | "github"
  | "instagram"
  | "vikrahub"
  | "website";

export type SiteSettings = {
  siteTitle?: string;
  siteDescription?: string;
  contactEmail?: string;
  whatsapp?: string;
  navigationLinks?: Array<{
    label: string;
    href: string;
  }>;
};
