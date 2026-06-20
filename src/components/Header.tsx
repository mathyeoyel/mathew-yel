import Link from "next/link";
import type { SiteSettings } from "@/types/content";
import { fallbackSettings } from "@/lib/fallbacks";

type Props = {
  settings?: SiteSettings | null;
};

export function Header({ settings }: Props) {
  const nav = settings?.navigationLinks?.length
    ? settings.navigationLinks
    : fallbackSettings.navigationLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-black tracking-tight text-slate-950">
          Mathew<span className="text-amber-600">Yel</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
          {nav?.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-amber-700">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
        >
          Contact
        </Link>
      </div>
    </header>
  );
}
