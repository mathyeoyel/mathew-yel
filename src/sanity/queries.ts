import { groq } from "next-sanity";

const imageFields = `
  asset,
  "url": asset->url,
  alt,
  caption
`;

const coverImageFields = `
  _key,
  alt,
  caption,
  asset,
  "url": coalesce(asset->url, asset.url),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
`;

const quickGalleryImageFields = `
  _key,
  asset,
  "url": coalesce(asset->url, asset.url),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "alt": "",
  "caption": ""
`;

// Blog content status (not Sanity document publish state).
const publishedPostFilter = `(status == "published" || published == true || !defined(status))`;

// Activity content status (not Sanity document publish state).
const publishedActivityFilter = `(status == "published" || !defined(status))`;

export const profileQuery = groq`
  coalesce(
    *[_type == "profile" && _id == "profile"][0],
    *[_type == "profile"] | order(_updatedAt desc)[0]
  ){
    name,
    preferredName,
    headline,
    shortBio,
    fullBio,
    heroImage{${imageFields}},
    location,
    email,
    phone,
    currentFocus,
    socialLinks,
    ctaPrimary,
    ctaSecondary
  }
`;

export const footerProfileQuery = groq`
  coalesce(
    *[_type == "profile" && _id == "profile"][0],
    *[_type == "profile"] | order(_updatedAt desc)[0]
  ){
    name,
    socialLinks[]{
      label,
      url
    }
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    siteTitle,
    siteDescription,
    defaultOgImage{${imageFields}},
    contactEmail,
    whatsapp,
    seoKeywords,
    navigationLinks
  }
`;

export const homepageProjectsQuery = groq`
  *[_type == "project" && showOnHomepage == true]
  | order(homepageOrder asc, startDate desc, title asc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage{${imageFields}},
    status,
    category,
    tags,
    projectUrl
  }
`;

export const allProjectsQuery = groq`
  *[_type == "project"] | order(featured desc, startDate desc, title asc){
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage{${imageFields}},
    role,
    status,
    category,
    tags,
    technologies,
    projectUrl
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    description,
    coverImage{${imageFields}},
    "galleryImages": quickGalleryImages[]{${quickGalleryImageFields}},
    role,
    status,
    startDate,
    endDate,
    projectUrl,
    client,
    category,
    technologies,
    tags,
    featured,
    seo
  }
`;

export const homepageActivitiesQuery = groq`
  *[
    _type == "activity" &&
    defined(slug.current) &&
    showOnHomepage == true &&
    ${publishedActivityFilter}
  ] | order(coalesce(homepageOrder, 999) asc, activityDate desc)[0...6]{
    _id,
    title,
    "slug": slug.current,
    activityDate,
    category,
    location,
    shortDescription,
    coverImage{${imageFields}},
    featured,
    showOnHomepage,
    homepageOrder
  }
`;

export const recentActivitiesQuery = groq`
  *[_type == "activity" && defined(slug.current) && ${publishedActivityFilter}]
  | order(activityDate desc)[0...6]{
    _id,
    title,
    "slug": slug.current,
    activityDate,
    category,
    location,
    shortDescription,
    coverImage{${imageFields}},
    featured
  }
`;

export const allActivitiesQuery = groq`
  *[_type == "activity" && defined(slug.current) && ${publishedActivityFilter}]
  | order(activityDate desc){
    _id,
    title,
    "slug": slug.current,
    activityDate,
    category,
    location,
    shortDescription,
    coverImage{${imageFields}},
    featured
  }
`;

export const activityBySlugQuery = groq`
  *[
    _type == "activity" &&
    slug.current == $slug &&
    defined(slug.current) &&
    ${publishedActivityFilter}
  ][0]{
    _id,
    title,
    "slug": slug.current,
    activityDate,
    category,
    location,
    shortDescription,
    content,
    coverImage{${imageFields}},
    "galleryImages": quickGalleryImages[]{${quickGalleryImageFields}},
    featured,
    seo,
    relatedProject->{
      title,
      "slug": slug.current,
      summary
    }
  }
`;

export const recentPostsQuery = groq`
  *[_type == "post" && ${publishedPostFilter}] | order(publishedAt desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    coverImage{${coverImageFields}},
    category,
    tags,
    readingTime,
    featured
  }
`;

export const allPostsQuery = groq`
  *[_type == "post" && ${publishedPostFilter}] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    coverImage{${coverImageFields}},
    category,
    tags,
    readingTime,
    featured
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && ${publishedPostFilter}][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    content,
    coverImage{${coverImageFields}},
    "galleryImages": quickGalleryImages[]{${quickGalleryImageFields}},
    category,
    tags,
    readingTime,
    seo
  }
`;

export const featuredAwardsQuery = groq`
  *[_type == "award"] | order(featured desc, year desc)[0...6]{
    _id,
    title,
    organization,
    year,
    date,
    description,
    category,
    image{${imageFields}},
    link,
    featured
  }
`;
