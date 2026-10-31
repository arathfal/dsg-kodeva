import assert from "node:assert/strict";
import { test } from "node:test";
import { validateLead } from "./leads.ts";

const valid = {
  name: "Usaha Demo",
  email: "demo@example.test",
  campaignKey: "promo-akhir-tahun",
  website: "",
};

test("lead contacts accept either or both and normalize whitespace without extra stored fields", () => {
  assert.deepEqual(
    validateLead({
      ...valid,
      name: " Demo ",
      email: " demo@example.test ",
      whatsapp: " +62 (812) 3456-7890 ",
    }),
    {
      ok: true,
      data: {
        name: "Demo",
        email: "demo@example.test",
        whatsapp: "+6281234567890",
        campaignKey: valid.campaignKey,
      },
    },
  );
  assert.equal(
    validateLead({ ...valid, email: "", whatsapp: "08123456789" }).ok,
    true,
  );
  assert.equal(validateLead({ ...valid, whatsapp: "" }).ok, true);
  assert.equal(validateLead({ ...valid, name: "x".repeat(100) }).ok, true);
});

test("blank, malformed, excessive and spam inputs never pass", () => {
  for (const input of [
    null,
    [],
    {},
    { ...valid, name: "   " },
    { ...valid, name: "x".repeat(101) },
    { ...valid, email: "", whatsapp: "" },
    { ...valid, email: "bad" },
    { ...valid, email: "a".repeat(250) + "@b.test" },
    { ...valid, email: 12 },
    { ...valid, whatsapp: "1234567" },
    { ...valid, whatsapp: "1".repeat(16) },
    { ...valid, whatsapp: "+62abc12345678" },
    { ...valid, whatsapp: {} },
    { ...valid, whatsapp: "1234" + " ".repeat(41) + "5678" },
    { ...valid, website: "https://spam.test" },
    { ...valid, website: null },
    { ...valid, campaignKey: "../drafts" },
    { ...valid, campaignKey: "a".repeat(81) },
    { ...valid, submittedAt: "forged" },
  ])
    assert.equal(validateLead(input).ok, false, JSON.stringify(input));
});

test("UTM is an optional whitelist with trimmed bounded strings and omitted empty values", () => {
  assert.deepEqual(
    validateLead({
      ...valid,
      utm: { source: " instagram ", medium: " ", content: "x".repeat(200) },
    }),
    {
      ok: true,
      data: {
        name: valid.name,
        email: valid.email,
        campaignKey: valid.campaignKey,
        utm: { source: "instagram", content: "x".repeat(200) },
      },
    },
  );
  for (const utm of [
    null,
    [],
    "x",
    { source: 1 },
    { source: "x".repeat(201) },
    { unknown: "x" },
    { utm_source: "x" },
  ])
    assert.equal(validateLead({ ...valid, utm }).ok, false);
});
