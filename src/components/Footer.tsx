import Link from "next/link";
import type { SiteSettings } from "@/types/content";

type Props = {
  settings?: SiteSettings | null;
};

export function Footer({ settings }: Props) {
  return (
    <footer className="border-t border-brand-border bg-brand-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="text-xl font-black tracking-tight">Mathew Yel</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-muted">
            {settings?.siteDescription ||
              "Creative technologist, UI/UX designer, and founder of VikraHub."}
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-brand-muted md:justify-end">
          <Link href="/work" className="transition hover:text-brand-accent">
            Work
          </Link>
          <Link href="/activities" className="transition hover:text-brand-accent">
            Activities
          </Link>
          <Link href="/blog" className="transition hover:text-brand-accent">
            Blog
          </Link>
          <Link href="/studio" className="transition hover:text-brand-accent">
            Studio
          </Link>
        </div>
      </div>
      <div className="border-t border-brand-border px-5 py-5 text-center text-xs text-brand-muted">
        © {new Date().getFullYear()} Mathew Yel. Built with Next.js + Sanity.
      </div>
    </footer>
  );
}
