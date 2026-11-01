// T08 attribution capture tests (R-021; D-020 contract, D-045 first-touch per
// tab, D-046 first-set-wins). Browser storage behavior itself is verified in
// the browser journey; these tests pin the pure parse/normalize/pick rules.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  UTM_VALUE_LIMIT,
  normalizeUtm,
  pickTouch,
  readStoredTouch,
  utmFromSearchParams,
} from "./attribution.ts";

const full = {
  source: "instagram",
  medium: "social",
  campaign: "promo-akhir-tahun",
  term: "kasir",
  content: "bio-link",
};

function search(input: string): URLSearchParams {
  return new URLSearchParams(input);
}

test("full parameter set is trimmed into the D-020 payload shape", () => {
  assert.deepEqual(
    utmFromSearchParams(
      search(
        "?utm_source=%20instagram%20&utm_medium=social&utm_campaign=promo-akhir-tahun&utm_term=kasir&utm_content=bio-link",
      ),
    ),
    { ok: true, utm: full },
  );
});

test("partial sets are kept as-is and empty values are omitted", () => {
  assert.deepEqual(utmFromSearchParams(search("?utm_source=instagram")), {
    ok: true,
    utm: { source: "instagram" },
  });
  assert.deepEqual(
    utmFromSearchParams(
      search("?utm_source=tiktok&utm_medium=&utm_campaign=%20%20"),
    ),
    { ok: true, utm: { source: "tiktok" } },
  );
});

test("absent and empty-only parameters are no new touch, not a wipe", () => {
  assert.deepEqual(utmFromSearchParams(search("?lang=id")), { ok: true });
  assert.deepEqual(utmFromSearchParams(search("?utm_source=&utm_medium=")), {
    ok: true,
  });
});

test("unknown utm keys are ignored at capture without invalidating known keys", () => {
  assert.deepEqual(
    utmFromSearchParams(
      search("?utm_id=123&utm_source=instagram&utm_medium=social"),
    ),
    { ok: true, utm: { source: "instagram", medium: "social" } },
  );
});

test("a known key beyond the approved limit rejects the whole set", () => {
  const oversized = "x".repeat(UTM_VALUE_LIMIT + 1);
  assert.deepEqual(
    utmFromSearchParams(
      search(`?utm_source=instagram&utm_campaign=${oversized}`),
    ),
    { ok: false },
  );
  assert.equal(
    utmFromSearchParams(
      search(
        `?utm_source=instagram&utm_campaign=${"x".repeat(UTM_VALUE_LIMIT)}`,
      ),
    ).ok,
    true,
  );
});

test("normalizeUtm rejects malformed payloads strictly", () => {
  for (const bad of [
    null,
    "instagram",
    [],
    { source: 42 },
    { channel: "instagram" },
    { utm_source: "instagram" },
    { source: "x".repeat(UTM_VALUE_LIMIT + 1) },
  ] as unknown[]) {
    assert.equal(normalizeUtm(bad).ok, false, JSON.stringify(bad));
  }
  assert.deepEqual(normalizeUtm({ source: " instagram " }), {
    ok: true,
    utm: { source: "instagram" },
  });
  assert.deepEqual(normalizeUtm(undefined), { ok: true });
  assert.deepEqual(normalizeUtm({}), { ok: true });
  assert.deepEqual(normalizeUtm({ source: "   " }), { ok: true });
});

test("pickTouch keeps the stored touch (first set wins, D-046)", () => {
  const stored = { source: "instagram", medium: "social" };
  const second = { source: "tiktok", medium: "social", campaign: "lain" };
  assert.equal(pickTouch(stored, second), stored);
  assert.deepEqual(pickTouch(undefined, second), second);
  assert.deepEqual(pickTouch(undefined, undefined), undefined);
  assert.equal(pickTouch(stored, undefined), stored);
});

test("readStoredTouch treats forged or corrupt storage as absent", () => {
  assert.deepEqual(readStoredTouch({ ...full }), full);
  for (const corrupt of [
    null,
    "instagram",
    42,
    { unknown: "x" },
    { source: 5 },
    { source: "x".repeat(UTM_VALUE_LIMIT + 1) },
    {},
  ] as unknown[]) {
    assert.equal(readStoredTouch(corrupt), undefined, JSON.stringify(corrupt));
  }
});
