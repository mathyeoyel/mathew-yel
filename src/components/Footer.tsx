import Link from "next/link";
import type { SiteSettings } from "@/types/content";

type Props = {
  settings?: SiteSettings | null;
};

export function Footer({ settings }: Props) {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="text-xl font-black">Mathew Yel</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            {settings?.siteDescription ||
              "Creative technologist, UI/UX designer, and founder of VikraHub."}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-300 md:justify-end">
          <Link href="/work" className="hover:text-amber-400">Work</Link>
          <Link href="/activities" className="hover:text-amber-400">Activities</Link>
          <Link href="/blog" className="hover:text-amber-400">Blog</Link>
          <Link href="/studio" className="hover:text-amber-400">Studio</Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Mathew Yel. Built with Next.js + Sanity.
      </div>
    </footer>
  );
}
