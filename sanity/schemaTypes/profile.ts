import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./objects";

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full name",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "preferredName",
      title: "Preferred name",
      type: "string"
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: "Example: Creative Technologist, UI/UX Designer & Founder of VikraHub",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "shortBio",
      title: "Short bio",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(360)
    }),
    defineField({
      name: "fullBio",
      title: "Full bio",
      type: "richText"
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      ...imageWithAlt
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string"
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "email"
    }),
    defineField({
      name: "phone",
      title: "Phone / WhatsApp",
      type: "string"
    }),
    defineField({
      name: "currentFocus",
      title: "Current focus",
      type: "array",
      of: [{ type: "string" }],
      description: "Short lines like: Building VikraHub, UI/UX design, PrintLab, community work"
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "url", title: "URL", type: "url", validation: (Rule) => Rule.required() })
          ]
        }
      ]
    }),
    defineField({
      name: "ctaPrimary",
      title: "Primary CTA",
      type: "object",
      fields: [
        defineField({ name: "text", title: "Text", type: "string" }),
        defineField({ name: "href", title: "Link", type: "string" })
      ]
    }),
    defineField({
      name: "ctaSecondary",
      title: "Secondary CTA",
      type: "object",
      fields: [
        defineField({ name: "text", title: "Text", type: "string" }),
        defineField({ name: "href", title: "Link", type: "string" })
      ]
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "headline",
      media: "heroImage"
    }
  }
});
