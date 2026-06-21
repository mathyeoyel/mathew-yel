import { defineField } from "sanity";
import { QuickGalleryInput } from "../components/QuickGalleryInput";

export const quickGalleryImagesField = defineField({
  name: "quickGalleryImages",
  title: "Gallery images",
  type: "array",
  of: [
    {
      type: "image",
      options: { hotspot: true }
    }
  ],
  description: "Upload multiple images quickly. These images will appear in the detail page gallery.",
  components: {
    input: QuickGalleryInput
  }
});
