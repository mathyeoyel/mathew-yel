import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem()
    .title(title)
    .schemaType(type)
    .child(S.document().schemaType(type).documentId(type).title(title));

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Website Content")
    .items([
      singleton(S, "profile", "Profile"),
      singleton(S, "siteSettings", "Site Settings"),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("activity").title("Activities"),
      S.documentTypeListItem("post").title("Blog Posts"),
      S.documentTypeListItem("award").title("Awards & Recognition")
    ]);
