import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./objects";
import { quickGalleryImagesField } from "./quickGalleryImagesField";

export const post = defineType({
  name: "post",
  title: "Blog Post",
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
    defineField({
      name: "publishedAt",
      title: "Public publish date",
      type: "datetime",
      description: "Use this for the public post date, not _createdAt.",
      validation: (Rule) => Rule.required()
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, validation: (Rule) => Rule.required().max(260) }),
    defineField({ name: "content", title: "Content", type: "richText" }),
    defineField({ name: "coverImage", title: "Cover image", ...imageWithAlt }),
    quickGalleryImagesField,
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Design",
          "Development",
          "Business",
          "Technology",
          "Personal",
          "VikraHub",
          "Community",
          "Lessons"
        ]
      }
    }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "readingTime", title: "Reading time in minutes", type: "number", initialValue: 5 }),
    defineField({ name: "featured", title: "Featured post", type: "boolean", initialValue: false }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" }
        ],
        layout: "radio"
      },
      initialValue: "published"
    }),
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
      title: "Newest published",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }]
    }
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "coverImage"
    }
  }
});
