import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

const isDev = process.env.NODE_ENV === "development";
const token = process.env.SANITY_API_READ_TOKEN;

/** Skip Next.js fetch cache locally so Studio publishes show up immediately. */
export const sanityFetchOptions = isDev
  ? { cache: "no-store" as const }
  : { next: { revalidate: 60 } };

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !isDev,
  perspective: isDev && token ? "previewDrafts" : "published",
  ...(token ? { token } : {})
});

export function sanityFetch<T>(
  query: string,
  params: QueryParams = {}
): Promise<T> {
  return client.fetch<T>(query, params, sanityFetchOptions);
}
