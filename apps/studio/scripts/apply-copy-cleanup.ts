// One-time copy cleanup (owner-directed, sitewide): applies the trimmed,
// customer-facing copy to the already-seeded live content dataset so the
// published site matches apps/studio/seed/content.ts without re-seeding and
// without touching anything else the editor has added (portrait, seo, body
// structure).
//
// Uses the server-side editor token from apps/web/.env.local (D-023); the
// token is never logged.
//
// Dry run by default; add --write to patch the live documents.
import { readFile } from "node:fs/promises";
import { API_VERSION } from "../../../shared/content.ts";
import { seedArticles, seedCampaign, seedImageMeta } from "../seed/content.ts";

const RETIRED_SENTENCE = "Materi ini merupakan ilustrasi assessment.";

const readEnv = async (file: URL, key: string): Promise<string> => {
  const text = await readFile(file, "utf8");
  const value = text.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1];
  if (!value)
    throw new Error(`Set ${key} in ${file.pathname.split("/").pop()}.`);
  return value.trim();
};

const projectId = await readEnv(
  new URL("../.env.local", import.meta.url),
  "SANITY_STUDIO_PROJECT_ID",
);
const dataset = await readEnv(
  new URL("../.env.local", import.meta.url),
  "SANITY_STUDIO_DATASET",
);
const token = await readEnv(
  new URL("../../../apps/web/.env.local", import.meta.url),
  "SANITY_LEADS_WRITE_TOKEN",
);
const base = `https://${projectId}.api.sanity.io/v${API_VERSION}`;
const queryUrl = `${base}/data/query/${dataset}`;
const mutateUrl = `${base}/data/mutate/${dataset}`;

interface CampaignDoc {
  subtitle: string;
  testimonials: Array<Record<string, unknown>>;
  faq: Array<Record<string, unknown>>;
  image?: { alt?: string; provenance?: string };
}

interface ArticleDoc {
  _id: string;
  excerpt: string;
  cover?: { alt?: string; provenance?: string };
  body: Array<{
    _type?: string;
    style?: string;
    _key?: string;
    markDefs?: unknown;
    children?: Array<Record<string, unknown>>;
  }>;
}

async function fetchQuery<T>(query: string, params: object = {}): Promise<T> {
  const url = new URL(queryUrl);
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params))
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok)
    throw new Error(
      `Query failed (${response.status}): ${await response.text()}`,
    );
  const result = (await response.json()) as { result?: T };
  return result.result as T;
}

async function commitPatch(documentId: string, set: Record<string, unknown>) {
  const response = await fetch(mutateUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mutations: [{ patch: { id: documentId, set } }],
    }),
  });
  if (!response.ok)
    throw new Error(
      `Patch of ${documentId} failed (${response.status}): ${await response.text()}`,
    );
}

async function main() {
  const write = process.argv.includes("--write");
  const campaign = await fetchQuery<CampaignDoc>(
    `*[_type == "campaign" && _id == "campaign"][0]{
      subtitle, testimonials, faq, image{alt,provenance}
    }`,
  );
  if (!campaign) {
    throw new Error("Campaign document not found in the content dataset.");
  }
  const campaignPatch: Record<string, unknown> = {};
  if (campaign.subtitle !== seedCampaign.subtitle) {
    campaignPatch.subtitle = seedCampaign.subtitle;
  }
  if (campaign.image?.alt !== seedImageMeta.alt) {
    campaignPatch["image.alt"] = seedImageMeta.alt;
  }
  if (campaign.image?.provenance !== seedImageMeta.provenance) {
    campaignPatch["image.provenance"] = seedImageMeta.provenance;
  }
  for (const field of ["testimonials", "faq"] as const) {
    const seedItems =
      field === "testimonials" ? seedCampaign.testimonials : seedCampaign.faq;
    const liveItems = Array.isArray(campaign[field]) ? campaign[field] : [];
    const next = liveItems.map((item: Record<string, unknown>) => {
      const seed = seedItems.find((option) => option._key === item._key);
      if (!seed) return item;
      const merged: Record<string, unknown> = { ...item, ...seed };
      // Retired fields: remove them from the live document entirely.
      if (field === "testimonials" && !Object.hasOwn(seed, "disclosure"))
        delete merged.disclosure;
      return merged;
    });
    if (JSON.stringify(next) !== JSON.stringify(liveItems))
      campaignPatch[field] = next;
  }
  if (Object.keys(campaignPatch).length) {
    console.log(
      `${write ? "Patching" : "Would patch"} campaign (id "campaign"):`,
      Object.keys(campaignPatch).join(", "),
    );
  } else {
    console.log("Campaign copy already up to date.");
  }

  for (const sample of seedArticles) {
    const article = await fetchQuery<ArticleDoc>(
      `*[_type == "article" && slug.current == $slug][0]{
        _id, excerpt, cover{alt,provenance}, body
      }`,
      { slug: sample.slug },
    );
    if (!article) {
      console.log(`Article "${sample.slug}" not found; skipped.`);
      continue;
    }
    const patch: Record<string, unknown> = {};
    if (article.excerpt !== sample.excerpt) patch.excerpt = sample.excerpt;
    if (article.cover?.alt !== seedImageMeta.alt)
      patch["cover.alt"] = seedImageMeta.alt;
    if (article.cover?.provenance !== seedImageMeta.provenance)
      patch["cover.provenance"] = seedImageMeta.provenance;
    // Only the plain normal-style paragraph carries the retired sentence;
    // headings and any editor-added blocks stay untouched.
    const body = Array.isArray(article.body) ? article.body : [];
    const index = body.findIndex(
      (block) =>
        block._type === "block" &&
        block.style === "normal" &&
        typeof block.children?.[0]?.text === "string" &&
        (((block.children[0]?.text as string) ?? "").includes(
          RETIRED_SENTENCE,
        ) ||
          ((block.children[0]?.text as string) ?? "")
            .trim()
            .endsWith(sample.paragraph)),
    );
    if (index >= 0) {
      const block = body[index]!;
      const text = block.children![0]!.text as string;
      const next = text.includes(RETIRED_SENTENCE)
        ? text
            .replace(RETIRED_SENTENCE, "")
            .replace(/\s+([.])/g, "$1")
            .trim()
        : sample.paragraph;
      if (next !== text) {
        const nextBody = body.map((item, position: number) =>
          position === index
            ? {
                ...block,
                children: [{ ...block.children![0], text: next }],
              }
            : item,
        );
        patch.body = nextBody;
      }
    }
    if (Object.keys(patch).length) {
      console.log(
        `${write ? "Patching" : "Would patch"} article "${sample.slug}":`,
        Object.keys(patch).join(", "),
      );
    } else {
      console.log(`Article "${sample.slug}" copy already up to date.`);
    }

    if (write && Object.keys(patch).length) {
      await commitPatch(article._id, patch);
    }
  }

  if (write) {
    if (Object.keys(campaignPatch).length) {
      await commitPatch("campaign", campaignPatch);
    }
    console.log("Copy cleanup applied to the content dataset.");
  } else {
    console.log("Dry run: rerun with --write to apply the patches above.");
  }
}

main().catch((error: unknown) => {
  console.error(
    "Copy cleanup stopped. Check access to the content dataset before retrying. No credentials were logged.",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
