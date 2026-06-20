import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./objects";

export const award = defineType({
  name: "award",
  title: "Award / Recognition",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "organization", title: "Organization", type: "string" }),
    defineField({ name: "year", title: "Year", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "date", title: "Exact date", type: "date" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["Award", "Recognition", "Program", "Speaking", "Leadership", "Community"]
      }
    }),
    defineField({ name: "image", title: "Image", ...imageWithAlt }),
    defineField({ name: "link", title: "Link", type: "url" }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false })
  ],
  orderings: [
    {
      title: "Newest first",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }]
    }
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "year",
      media: "image"
    }
  }
});
