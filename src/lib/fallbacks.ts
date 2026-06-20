import type { Profile, SiteSettings } from "@/types/content";

export const fallbackProfile: Profile = {
  name: "Mathew Yel",
  preferredName: "Yelose",
  headline: "Creative Technologist, UI/UX Designer & Founder of VikraHub",
  shortBio:
    "I design brands, build digital products, and document the journey of shaping creative technology in South Sudan.",
  location: "Juba, South Sudan",
  email: "info@mathewyel.com",
  currentFocus: [
    "Building VikraHub",
    "Designing better digital products",
    "Growing PrintLab",
    "Documenting creative technology in South Sudan"
  ],
  ctaPrimary: {
    text: "View My Work",
    href: "/work"
  },
  ctaSecondary: {
    text: "Follow My Journey",
    href: "/activities"
  }
};

export const fallbackSettings: SiteSettings = {
  siteTitle: "Mathew Yel",
  siteDescription:
    "Creative technologist, UI/UX designer, and founder of VikraHub.",
  navigationLinks: [
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
    { label: "Activities", href: "/activities" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" }
  ]
};
