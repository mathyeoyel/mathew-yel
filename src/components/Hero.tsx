import Link from "next/link";
import type { Profile } from "@/types/content";
import { fallbackProfile } from "@/lib/fallbacks";
import { ImageBox } from "./ImageBox";

type Props = {
  profile?: Profile | null;
};

export function Hero({ profile }: Props) {
  const data = profile || fallbackProfile;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_top_right,#f59e0b,transparent_32rem)]" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-amber-400">
            {data.location || "Juba, South Sudan"}
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            {data.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {data.shortBio}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={data.ctaPrimary?.href || "/work"}
              className="rounded-full bg-amber-500 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-400"
            >
              {data.ctaPrimary?.text || "View My Work"}
            </Link>
            <Link
              href={data.ctaSecondary?.href || "/activities"}
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-black text-white transition hover:border-amber-400 hover:text-amber-300"
            >
              {data.ctaSecondary?.text || "Follow My Journey"}
            </Link>
          </div>

          {data.currentFocus?.length ? (
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {data.currentFocus.map((focus) => (
                <div key={focus} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  {focus}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl">
          <ImageBox
            image={data.heroImage}
            altFallback={data.name}
            width={900}
            height={1100}
            className="h-[480px] w-full rounded-[1.5rem] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
