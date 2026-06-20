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
    <section className="section-dark">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-12 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:pb-28 md:pt-20">
        <div className="order-1">
          <p className="eyebrow tracking-[0.28em]">
            {data.location || "Juba, South Sudan"}
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-4xl md:mt-5 md:text-6xl">
            {data.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-brand-muted sm:text-lg sm:leading-8 md:mt-6">
            {data.shortBio}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href={data.ctaPrimary?.href || "/work"} className="btn-primary w-full sm:w-auto">
              {data.ctaPrimary?.text || "View My Work"}
            </Link>
            <Link href={data.ctaSecondary?.href || "/activities"} className="btn-secondary w-full sm:w-auto">
              {data.ctaSecondary?.text || "Follow My Journey"}
            </Link>
          </div>

          {data.currentFocus?.length ? (
            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2">
              {data.currentFocus.map((focus) => (
                <div key={focus} className="focus-chip">
                  {focus}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="order-2 border border-brand-border bg-[#1a1a1a]">
          <ImageBox
            image={data.heroImage}
            altFallback={data.name}
            width={900}
            height={1100}
            variant="dark"
            className="aspect-[4/5] w-full object-cover sm:aspect-[5/6] md:h-[480px] md:aspect-auto"
          />
        </div>
      </div>
    </section>
  );
}
