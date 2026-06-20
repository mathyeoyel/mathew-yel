"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { deskStructure } from "./sanity/deskStructure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "replace-me";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const singletonTypes = new Set(["profile", "siteSettings"]);

export default defineConfig({
  name: "mathewYelWebsite",
  title: "Mathew Yel Website",
  projectId,
  dataset,
  basePath: "/studio",
  // Use classic draft/publish workflow instead of Content Releases.
  releases: {
    enabled: false
  },
  scheduledDrafts: {
    enabled: false
  },
  scheduledPublishing: {
    enabled: false
  },
  document: {
    actions: (prev) => prev,
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter((template) => !singletonTypes.has(template.templateId));
      }

      return prev;
    }
  },
  plugins: [
    structureTool({
      structure: deskStructure
    })
  ],
  schema: {
    types: schemaTypes
  }
});
