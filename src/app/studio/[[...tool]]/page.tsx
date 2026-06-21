import type { Metadata } from "next";
import { NextStudio } from "next-sanity/studio";
import {
  metadata as nextSanityStudioMetadata,
  viewport as nextSanityStudioViewport
} from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...(nextSanityStudioMetadata as Metadata),
  robots: {
    index: false,
    follow: false
  }
};

export const viewport = nextSanityStudioViewport;

export default function StudioPage() {
  return <NextStudio config={config} />;
}
