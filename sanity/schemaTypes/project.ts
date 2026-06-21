import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./objects";
import { quickGalleryImagesField } from "./quickGalleryImagesField";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fieldsets: [
    {
      name: "homepageDisplay",
      title: "Homepage display",
      options: { collapsible: true, collapsed: false }
    }
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required()
    }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3, validation: (Rule) => Rule.required().max(240) }),
    defineField({ name: "description", title: "Description / case study", type: "richText" }),
    defineField({ name: "coverImage", title: "Cover image", ...imageWithAlt }),
    quickGalleryImagesField,
    defineField({ name: "role", title: "Your role", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Completed", value: "completed" },
          { title: "In progress", value: "in-progress" },
          { title: "Ongoing", value: "ongoing" },
          { title: "Archived", value: "archived" }
        ],
        layout: "radio"
      },
      initialValue: "completed"
    }),
    defineField({ name: "startDate", title: "Start date", type: "date" }),
    defineField({ name: "endDate", title: "End date", type: "date" }),
    defineField({ name: "projectUrl", title: "Project URL", type: "url" }),
    defineField({ name: "client", title: "Client / organization", type: "string" }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Product",
          "Website",
          "Branding",
          "Community Platform",
          "Client Work",
          "UI/UX",
          "CMS",
          "Startup"
        ]
      }
    }),
    defineField({ name: "technologies", title: "Technologies / tools", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "featured",
      title: "Featured project",
      type: "boolean",
      initialValue: false,
      description: "Highlights this project on the Work page.",
      fieldset: "homepageDisplay"
    }),
    defineField({
      name: "showOnHomepage",
      title: "Show on homepage",
      type: "boolean",
      initialValue: false,
      description:
        "Enable this to feature this project on the homepage. Only 3 projects should be selected at a time.",
      fieldset: "homepageDisplay"
    }),
    defineField({
      name: "homepageOrder",
      title: "Homepage order",
      type: "number",
      description: "Controls order on the homepage. Use 1, 2, or 3.",
      hidden: ({ document }) => !document?.showOnHomepage,
      fieldset: "homepageDisplay",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as { showOnHomepage?: boolean };

          if (!doc?.showOnHomepage) {
            return true;
          }

          if (value === undefined || value === null) {
            return "Homepage order is required when Show on homepage is enabled.";
          }

          if (value < 1 || value > 3) {
            return "Use 1, 2, or 3 for homepage order.";
          }

          return true;
        })
    }),
    defineField({ name: "displayOrder", title: "Display order", type: "number", initialValue: 100 }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "title", title: "SEO title", type: "string" }),
        defineField({ name: "description", title: "SEO description", type: "text", rows: 3 })
      ]
    })
  ],
  orderings: [
    {
      title: "Featured first",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "displayOrder", direction: "asc" },
        { field: "_updatedAt", direction: "desc" }
      ]
    }
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "summary",
      media: "coverImage"
    }
  }
});
