import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt } from "./objects";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteTitle", title: "Site title", type: "string", initialValue: "Mathew Yel" }),
    defineField({
      name: "siteDescription",
      title: "Site description",
      type: "text",
      rows: 3,
      initialValue: "Creative technologist, UI/UX designer, and founder of VikraHub."
    }),
    defineField({ name: "defaultOgImage", title: "Default social preview image", ...imageWithAlt }),
    defineField({ name: "contactEmail", title: "Contact email", type: "email" }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      description: "Phone number with country code, e.g. 211922931515"
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Email", value: "email" },
                  { title: "WhatsApp", value: "whatsapp" },
                  { title: "Facebook", value: "facebook" },
                  { title: "X / Twitter", value: "x" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "GitHub", value: "github" },
                  { title: "Instagram", value: "instagram" },
                  { title: "VikraHub", value: "vikrahub" },
                  { title: "Website", value: "website" }
                ]
              },
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required()
            })
          ],
          preview: {
            select: {
              title: "platform",
              subtitle: "url"
            }
          }
        })
      ]
    }),
    defineField({
      name: "seoKeywords",
      title: "SEO keywords",
      type: "array",
      of: [{ type: "string" }]
    }),
    defineField({
      name: "navigationLinks",
      title: "Navigation links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "Href", type: "string" })
          ]
        }
      ],
      initialValue: [
        { label: "About", href: "/about" },
        { label: "Work", href: "/work" },
        { label: "Activities", href: "/activities" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" }
      ]
    })
  ],
  preview: {
    select: {
      title: "siteTitle",
      subtitle: "siteDescription",
      media: "defaultOgImage"
    }
  }
});
