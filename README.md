# Mathew Yel — Next.js + Sanity Rebuild

This is the clean rebuild foundation for `mathewyel.com`.

It replaces the old static JSON + custom `admin.html` workflow with:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Sanity Studio at `/studio`
- Sanity content schemas for profile, projects, activities, posts, awards, and site settings
- Project and activity image support
- Back-dated public timeline dates
- Dynamic pages for work, activities, and blog posts

## Why this version exists

The old site stores content in JSON and uses a custom admin panel that commits changes back to GitHub. That became too complex for regular updates.

This rebuild uses Sanity Studio as the admin panel, so updates become:

1. Open `/studio`
2. Add project, activity, post, or award
3. Upload images
4. Set the public date
5. Publish

## First setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```txt
http://localhost:3000
http://localhost:3000/studio
```

## Required environment variables

```txt
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-06-19
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

You get `NEXT_PUBLIC_SANITY_PROJECT_ID` from your Sanity project dashboard.

## Seed content from old JSON files

If you still have the old static site JSON files, place them in a `data/` folder at the project root:

```txt
data/personal.json
data/projects.json
data/awards.json
data/blogs.json
data/posts.json
```

Create a Sanity **Editor** (or **Administrator**) token with write access at [sanity.io/manage](https://sanity.io/manage), then add it to `.env.local`:

```env
SANITY_API_WRITE_TOKEN=your-write-token-here
```

Run the migration script:

```bash
npm run seed:sanity
```

The script uses stable document IDs and `createOrReplace`, so it is safe to run more than once. Missing JSON files are skipped gracefully. Remote image URLs are not imported into Sanity image fields yet — upload images in Studio after seeding.

Profile documents use `_id: profile` to match the Studio singleton and frontend queries.

## Sanity content types

- Profile
- Project
- Activity
- Post
- Award
- Site Settings

There is intentionally no standalone gallery in the MVP. Projects and Activities both support:

- `coverImage`
- `galleryImages`

## Back-dating updates

Activities use `activityDate`, not Sanity’s `_createdAt`.

That means you can publish an update today but set its public date to the real day the event happened.

Example:

```txt
activityDate: 2026-05-01
title: World Labour Day — UNDP Student Ambassador Activity
```

The website will sort and display it according to `activityDate`.

## Suggested migration from the old static repo

Old file | New Sanity document
--- | ---
`data/personal.json` | `profile`
`data/projects.json` | `project`
`data/blogs.json` / `data/posts.json` | `post`
`data/awards.json` | `award`
Gallery content | move into `activity.galleryImages` or `project.galleryImages`

## MVP pages

- `/`
- `/about`
- `/work`
- `/work/[slug]`
- `/activities`
- `/activities/[slug]`
- `/blog`
- `/blog/[slug]`
- `/contact`
- `/studio`

## Deployment notes

Deploy on Vercel, then add these to Sanity CORS origins:

```txt
http://localhost:3000
https://mathewyel.com
https://www.mathewyel.com
```

Enable credentials if you later add visual editing or preview features.
