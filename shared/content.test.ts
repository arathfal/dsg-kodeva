import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isProductList,
  isSlug,
  isText,
  withoutPublicationDate,
  publicConfig,
  validLead,
} from "./content.ts";

test("required text rejects surrounding whitespace", () => {
  assert.equal(isText("Tim", 80), true);
  assert.equal(isText(" Tim ", 80), false);
});
test("duplicated articles get their own publication date without mutating the source", () => {
  const original = {
    _id: "demo",
    _type: "article",
    title: "Demo",
    publishedAt: "2026-10-30T00:00:00Z",
  };
  assert.deepEqual(withoutPublicationDate(original), {
    _id: "demo",
    _type: "article",
    title: "Demo",
  });
  assert.equal(original.publishedAt, "2026-10-30T00:00:00Z");
});

test("product links reject stale, duplicate and excessive IDs", () => {
  assert.equal(isProductList(["kasir", "hr"], 1), true);
  for (const ids of [
    ["missing"],
    ["kasir", "kasir"],
    [],
    ["kasir", "hr", "payroll", "laporan", "inventori", "akuntansi", "kasir"],
  ]) {
    assert.equal(isProductList(ids, 1), false);
  }
});
test("slug and env boundaries reject unsafe values without echoing them", () => {
  assert.equal(isSlug("artikel-contoh"), true);
  for (const slug of [
    "../secret",
    "drafts.article",
    "Upper",
    "a--b",
    "",
    "a".repeat(97),
  ])
    assert.equal(isSlug(slug), false);
  assert.throws(
    () => publicConfig("secret/value", "production"),
    (error: unknown) =>
      error instanceof Error && !error.message.includes("secret/value"),
  );
  assert.deepEqual(publicConfig("example1", "production"), {
    projectId: "example1",
    dataset: "production",
  });
});
test("lead contact and UTM boundaries", () => {
  const lead = { name: "Demo", campaignKey: "promo-akhir-tahun" };
  assert.equal(validLead({ ...lead, email: "demo@example.invalid" }), true);
  assert.equal(
    validLead({
      ...lead,
      whatsapp: "+62 (812) 3456-7890",
      utm: { source: "instagram" },
    }),
    true,
  );
  for (const input of [
    lead,
    { ...lead, name: "   ", email: "a@b.invalid" },
    { ...lead, email: "bad", whatsapp: "081234567890" },
    { ...lead, whatsapp: "123" },
    { ...lead, whatsapp: "1".repeat(16) },
    {
      ...lead,
      email: "demo@example.invalid",
      utm: { source: "x".repeat(201) },
    },
    { ...lead, email: "demo@example.invalid", utm: { secret: "no" } },
  ])
    assert.equal(validLead(input), false);
});
