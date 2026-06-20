import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./objects";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
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
    defineField({
      name: "galleryImages",
      title: "Gallery / screenshots",
      type: "array",
      of: [{ ...imageWithAlt }]
    }),
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
    defineField({ name: "featured", title: "Featured project", type: "boolean", initialValue: false }),
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
