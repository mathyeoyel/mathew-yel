# Migration Notes

## Old repo observation

The old personal site is a static HTML/CSS/JS website with JSON content files and a custom admin panel.

The main problem this rebuild solves:

- No more manual JSON editing for regular updates
- No more custom `admin.html`
- No more `api/data/[section].js` GitHub commit flow
- No more blog split between `blogs.json` and `posts.json`
- No standalone gallery to maintain

## What to migrate first

### Profile

From `data/personal.json`:

- `hero.name` → `profile.name`
- `hero.title` → `profile.headline`
- `hero.description` → `profile.shortBio`
- `hero.image` → upload as `profile.heroImage`
- `about.content` → `profile.fullBio`
- `about.atAGlance` → `profile.currentFocus`
- `contact.email` → `profile.email`

Suggested updated headline:

```txt
Creative Technologist, UI/UX Designer & Founder of VikraHub
```

Suggested short bio:

```txt
I design brands, build digital products, and document the journey of shaping creative technology in South Sudan.
```

### Projects

From `data/projects.json`:

- each `items[]` → `project`
- `title` → `title`
- `summary` → `summary`
- `description` → `description`
- `image` → upload/paste into `coverImage`
- `role` → `role`
- `status` → `status`
- `startDate` → `startDate`
- `endDate` → `endDate`
- `link` → `projectUrl`
- `tech` → `technologies`
- `tags` → `tags`
- `featured` → `featured`

### Activities

Create these manually first:

- World Labour Day — UNDP Student Ambassador activity
- VikraHub one-year anniversary
- VikraHub notification system update/poster
- Forum attendance opportunity
- VikraHub Sessions milestone
- PrintLab business focus shift
- KEER NHOMJOK client work
- Recent UI/UX/product design updates

Use `activityDate` as the real date each activity happened.

### Blog

Merge old `data/blogs.json` and `data/posts.json` into Sanity `post`.

Use `publishedAt` as the public date, not `_createdAt`.

### Awards

From `data/awards.json`:

- each `items[]` → `award`
- `title` → `title`
- `year` → `year`
- `description` → `description`
- `category` → `category`
- `link` → `link`

## Deployment checklist

1. Create Sanity project.
2. Add `.env.local`.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `/studio`.
6. Add profile and site settings first.
7. Add projects.
8. Add activities.
9. Add posts and awards.
10. Deploy to Vercel.
11. Add production domain to Sanity CORS origins.
12. Point `mathewyel.com` to the new Vercel deployment.

## Later phase

After MVP:

- Add preview/draft mode
- Add visual editing
- Add custom OG image generation
- Add sitemap generation
- Add contact form with Resend
- Add activity filters
- Add project filters
