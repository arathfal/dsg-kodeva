import { readFile } from "node:fs/promises";
import { getCliClient } from "sanity/cli";
import { API_VERSION } from "../../../shared/content.ts";
import { paragraph, seedArticles, seedCampaign } from "../seed/content.ts";

async function main() {
  if (!process.argv.includes("--write")) {
    console.log(
      "Dry run: one campaign, two categories, two articles and one original SVG. Add --write to import into the configured public content dataset. Repeat imports create additional articles/categories.",
    );
    return;
  }
  const client = getCliClient({ apiVersion: API_VERSION }).withConfig({
    useCdn: false,
  });
  const existing = await client.fetch<number>(
    'count(*[_type in ["campaign","article","category"]])',
  );
  if (existing)
    throw new Error(
      "Seed requires an empty content dataset; it never overwrites editor content.",
    );
  const asset = await client.assets.upload(
    "image",
    await readFile(new URL("../seed/software.svg", import.meta.url)),
    { filename: "kodeva-demo.svg" },
  );
  const image = {
    _type: "contentImage",
    asset: { _type: "reference", _ref: asset._id },
    alt: "Ilustrasi aplikasi Kodeva dengan data usaha fiktif",
    provenance:
      "Ilustrasi SVG asli untuk assessment Kodeva; bukan tangkapan layar produk nyata.",
  };
  await client.createIfNotExists({ ...seedCampaign, image });
  for (const sample of seedArticles) {
    const category = await client.create({
      _type: "category",
      name: sample.category,
      slug: { _type: "slug", current: sample.categorySlug },
    });
    await client.create({
      _type: "article",
      title: sample.title,
      slug: { _type: "slug", current: sample.slug },
      cover: image,
      excerpt: sample.excerpt,
      category: { _type: "reference", _ref: category._id },
      relatedProducts: sample.relatedProducts,
      publishedAt: new Date().toISOString(),
      body: [
        paragraph(sample.heading, "heading", "h2"),
        paragraph(sample.paragraph, "paragraph"),
      ],
    });
  }
  console.log(
    "Imported fictional demo content. Inspect and edit it in Studio. No leads were created.",
  );
}
main().catch(() => {
  console.error(
    "Seed import stopped. Check access and whether the dataset is empty. Import may be partial; inspect Studio before retrying. No credentials were logged.",
  );
  process.exitCode = 1;
});
