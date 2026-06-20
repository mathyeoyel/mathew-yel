import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./objects";

export const activity = defineType({
  name: "activity",
  title: "Activity",
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
      name: "activityDate",
      title: "Activity date",
      type: "date",
      description: "Use the real date the activity happened. This can be back-dated.",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Event",
          "Forum",
          "Award",
          "VikraHub",
          "UNDP",
          "Speaking",
          "Workshop",
          "Milestone",
          "Community",
          "Personal"
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "shortDescription", title: "Short description", type: "text", rows: 3, validation: (Rule) => Rule.required().max(260) }),
    defineField({ name: "content", title: "Full story", type: "richText" }),
    defineField({ name: "coverImage", title: "Cover image", ...imageWithAlt }),
    defineField({
      name: "galleryImages",
      title: "Extra activity images",
      type: "array",
      of: [{ ...imageWithAlt }]
    }),
    defineField({
      name: "relatedProject",
      title: "Related project",
      type: "reference",
      to: [{ type: "project" }]
    }),
    defineField({ name: "featured", title: "Featured activity", type: "boolean", initialValue: false }),
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
      title: "Newest activity date",
      name: "activityDateDesc",
      by: [{ field: "activityDate", direction: "desc" }]
    }
  ],
  preview: {
    select: {
      title: "title",
      date: "activityDate",
      category: "category",
      media: "coverImage"
    },
    prepare(selection) {
      const { title, date, category, media } = selection;
      return {
        title,
        subtitle: [category, date].filter(Boolean).join(" • "),
        media
      };
    }
  }
});
