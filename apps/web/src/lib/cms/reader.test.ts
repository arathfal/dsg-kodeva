import assert from "node:assert/strict";
import { test } from "node:test";
import { createContentReader } from "./reader.ts";
import { isArticle, isCampaign, isTextBlock } from "./models.ts";

const image = {
  url: "https://cdn.sanity.io/images/example1/production/demo.svg",
  width: 960,
  height: 640,
  alt: "Ilustrasi demo",
  provenance: "Original assessment illustration",
};
const block = {
  _key: "p1",
  _type: "block",
  style: "normal",
  children: [{ _key: "s1", _type: "span", text: "Demo", marks: [] }],
  markDefs: [],
};
const article = {
  _id: "article1",
  title: "Demo",
  slug: "demo",
  cover: image,
  excerpt: "Demo",
  category: { name: "Tim", slug: "tim" },
  relatedProducts: ["hr"],
  publishedAt: "2026-10-31T00:00:00Z",
  body: [block],
};
const campaign = {
  campaignKey: "promo",
  title: "Demo",
  subtitle: "Demo",
  image,
  ctaLabel: "Katalog",
  featuredHeading: "Aplikasi",
  featuredProducts: ["kasir"],
  testimonialsHeading: "Ilustrasi",
  testimonials: [
    {
      quote: "Contoh",
      name: "Demo",
      business: "Fiktif",
      disclosure: "Ilustrasi",
    },
  ],
  faqHeading: "FAQ",
  faq: [{ question: "Demo?", answer: "Ya" }],
};
const config = { projectId: "example1", dataset: "production" };
const respond =
  (value: unknown): typeof fetch =>
  async () =>
    Response.json({ result: value });

test("fixed queries are anonymous, uncached and explicitly published; every call fetches", async () => {
  let calls = 0;
  const reader = createContentReader(config, async (input, init) => {
    calls++;
    const url = new URL(String(input));
    assert.equal(url.hostname, "example1.api.sanity.io");
    assert.equal(url.searchParams.get("perspective"), "published");
    assert.equal(init?.cache, "no-store");
    assert.equal(init?.headers, undefined);
    assert.equal(url.searchParams.get("$slug"), '"demo"');
    return Response.json({ result: article });
  });
  assert.equal((await reader.article("demo")).status, "ok");
  assert.equal((await reader.article("demo")).status, "ok");
  assert.equal(calls, 2);
  assert.equal((await reader.article("drafts.demo")).status, "not-found");
  assert.equal(calls, 2);
});
test("missing, malformed, network and configuration states remain distinct", async () => {
  assert.equal(
    (await createContentReader(config, respond(null)).campaign()).status,
    "not-found",
  );
  assert.deepEqual(
    await createContentReader({}, respond(campaign)).campaign(),
    { status: "unavailable", reason: "configuration" },
  );
  assert.deepEqual(
    await createContentReader(config, async () => {
      throw new Error("secret");
    }).campaign(),
    { status: "unavailable", reason: "network" },
  );
  assert.deepEqual(
    await createContentReader(
      config,
      async () => new Response("secret", { status: 403 }),
    ).campaign(),
    { status: "unavailable", reason: "network" },
  );
  assert.deepEqual(
    await createContentReader(
      config,
      respond({ ...campaign, featuredProducts: ["unknown"] }),
    ).campaign(),
    { status: "unavailable", reason: "invalid-content" },
  );
});
test("validation rejects drafts, missing images/categories, unsafe rich text and overlong copy", () => {
  assert.equal(isArticle(article), true);
  assert.equal(isCampaign(campaign), true);
  for (const invalid of [
    { ...article, _id: "drafts.demo" },
    { ...article, _id: "versions.release.demo" },
    { ...article, cover: null },
    { ...article, category: null },
    { ...article, title: "x".repeat(161) },
    { ...article, relatedProducts: ["unknown"] },
    { ...article, body: [{ ...block, _type: "html" }] },
  ])
    assert.equal(isArticle(invalid), false);
  assert.equal(
    isTextBlock({
      ...block,
      markDefs: [{ _key: "bad", _type: "link", href: "javascript:alert(1)" }],
    }),
    false,
  );
  assert.equal(
    isTextBlock({
      ...block,
      children: [{ ...block.children[0], marks: ["unknown"] }],
    }),
    false,
  );
});
test("pagination validates bounds and preserves an empty first page", async () => {
  const empty = createContentReader(config, respond({ items: [], total: 0 }));
  assert.equal((await empty.articles(1)).status, "ok");
  for (const page of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER, 2])
    assert.equal((await empty.articles(page)).status, "not-found");
  assert.equal(
    (
      await createContentReader(
        config,
        respond({ items: [article], total: 1 }),
      ).articles()
    ).status,
    "ok",
  );
  assert.equal(
    (
      await createContentReader(
        config,
        respond({ items: [{ ...article, category: null }], total: 1 }),
      ).articles()
    ).status,
    "unavailable",
  );
});
