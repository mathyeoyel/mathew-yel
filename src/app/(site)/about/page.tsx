import { sanityFetch } from "@/sanity/client";
import { profileQuery } from "@/sanity/queries";
import { fallbackProfile } from "@/lib/fallbacks";
import { isSanityConfigured } from "@/sanity/env";
import type { Profile } from "@/types/content";
import { SectionHeader } from "@/components/SectionHeader";
import { PortableContent } from "@/components/PortableContent";

export const metadata = {
  title: "About",
  description: "About Mathew Yel, creative technologist and founder of VikraHub."
};

async function getProfile(): Promise<Profile> {
  if (!isSanityConfigured) return fallbackProfile;
  return (await sanityFetch<Profile>(profileQuery)) || fallbackProfile;
}

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <main className="mx-auto max-w-4xl px-5 py-20">
      <SectionHeader
        eyebrow="About"
        title={profile.name}
        description={profile.shortBio}
      />

      {profile.fullBio?.length ? (
        <PortableContent value={profile.fullBio} />
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
          Add your full bio in Sanity Studio. Suggested direction: tell the story from Yelose Graphics, to VikraHub, to UI/UX and product-building work in South Sudan.
        </div>
      )}

      {profile.currentFocus?.length ? (
        <section className="mt-14">
          <h2 className="text-2xl font-black text-slate-950">Current focus</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {profile.currentFocus.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
