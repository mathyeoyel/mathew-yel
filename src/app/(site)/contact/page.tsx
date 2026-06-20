import { sanityFetch } from "@/sanity/client";
import { profileQuery } from "@/sanity/queries";
import { fallbackProfile } from "@/lib/fallbacks";
import { isSanityConfigured } from "@/sanity/env";
import type { Profile } from "@/types/content";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata = {
  title: "Contact",
  description: "Contact Mathew Yel for collaborations, projects, speaking, and creative technology work."
};

async function getProfile(): Promise<Profile> {
  if (!isSanityConfigured) return fallbackProfile;
  return (await sanityFetch<Profile>(profileQuery)) || fallbackProfile;
}

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <main className="mx-auto max-w-4xl px-5 py-20">
      <SectionHeader
        eyebrow="Contact"
        title="Let’s build something meaningful."
        description="Reach out for product design, web projects, creative technology collaborations, speaking, or community work."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {profile.email ? (
          <a href={`mailto:${profile.email}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
            <p className="text-sm font-black uppercase tracking-wide text-amber-700">Email</p>
            <h2 className="mt-3 text-xl font-black text-slate-950">{profile.email}</h2>
          </a>
        ) : null}

        {profile.phone ? (
          <a href={`tel:${profile.phone}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
            <p className="text-sm font-black uppercase tracking-wide text-amber-700">Phone / WhatsApp</p>
            <h2 className="mt-3 text-xl font-black text-slate-950">{profile.phone}</h2>
          </a>
        ) : null}
      </div>

      {profile.socialLinks?.length ? (
        <section className="mt-12">
          <h2 className="text-2xl font-black text-slate-950">Social links</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {profile.socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-amber-600"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
