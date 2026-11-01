import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BILLING_PERIOD,
  catalogCategories,
  catalogFixture,
  catalogResult,
  catalogParamsHref,
  catalogSearchHits,
  getCatalogCategory,
  getCatalogEntry,
  getCatalogSearch,
  getPriceSortId,
  isProductCatalog,
  packageOffer,
  productsInCategory,
  sortCatalogByPrice,
  startingPrice,
} from "./catalog.ts";

// Approved fixture values (D-033 / P-007).
const approvedPrices: Record<string, [number, number, number]> = {
  kasir: [1_800_000, 2_700_000, 3_900_000],
  inventori: [1_200_000, 1_900_000, 2_900_000],
  hr: [1_500_000, 2_400_000, 3_500_000],
  payroll: [2_200_000, 3_300_000, 4_900_000],
  akuntansi: [1_600_000, 2_500_000, 3_800_000],
  laporan: [900_000, 1_400_000, 2_200_000],
};
const approvedPromo: Record<string, [number, number, number] | undefined> = {
  kasir: [2_400_000, 3_600_000, 5_200_000],
  inventori: undefined,
  hr: [2_000_000, 3_200_000, 4_600_000],
  payroll: undefined,
  akuntansi: [2_100_000, 3_300_000, 5_000_000],
  laporan: undefined,
};
const approvedQuota: Record<string, number> = {
  kasir: 10,
  inventori: 5,
  hr: 8,
  payroll: 12,
  akuntansi: 15,
  laporan: 0,
};

test("approved fixtures match D-033 values exactly", () => {
  assert.equal(catalogResult().status, "ok");
  assert.equal(catalogFixture.length, 6);
  for (const [id, prices] of Object.entries(approvedPrices)) {
    const entry = getCatalogEntry(id);
    assert.ok(entry);
    for (const [index, offer] of entry.packages.entries()) {
      assert.equal(offer.price, prices[index]);
      assert.equal(offer.originalPrice, approvedPromo[id]?.[index]);
    }
    assert.equal(entry.promoQuota, approvedQuota[id]);
  }
});

test("promotional quota is shared per product, never per package", () => {
  for (const [id, quota] of Object.entries(approvedQuota)) {
    const entry = getCatalogEntry(id);
    assert.ok(entry);
    assert.equal(entry.promoQuota, quota);
    // Every package of one product reads the same quota; the offer type has no
    // quota field that could bypass the shared limit.
    assert.equal("promoQuota" in entry.packages[0], false);
    assert.equal("quota" in entry.packages[0], false);
  }
});

test("catalogue indexing, units and billing label", () => {
  const categoryOf: Record<string, string> = {
    kasir: "penjualan-kasir",
    inventori: "inventaris",
    hr: "sdm-payroll",
    payroll: "sdm-payroll",
    akuntansi: "keuangan-laporan",
    laporan: "keuangan-laporan",
  };
  for (const [id, category] of Object.entries(categoryOf))
    assert.equal(getCatalogEntry(id)?.categoryId, category);
  for (const [id, unit] of Object.entries({
    kasir: "outlet",
    inventori: "outlet",
    hr: "pengguna",
    payroll: "pengguna",
    akuntansi: "pengguna",
    laporan: "pengguna",
  }))
    assert.equal(getCatalogEntry(id)?.unit, unit);
  assert.equal(
    catalogCategories.some((category) => category.id === "tambahan"),
    true,
  );
  assert.equal(typeof BILLING_PERIOD, "string");
  assert.ok(BILLING_PERIOD.length > 0);
});

test("category filtering returns approved groupings and a real empty state", () => {
  assert.deepEqual(
    productsInCategory("penjualan-kasir").map((entry) => entry.id),
    ["kasir"],
  );
  assert.deepEqual(
    productsInCategory("inventaris").map((entry) => entry.id),
    ["inventori"],
  );
  assert.deepEqual(
    productsInCategory("sdm-payroll").map((entry) => entry.id),
    ["hr", "payroll"],
  );
  assert.deepEqual(
    productsInCategory("keuangan-laporan").map((entry) => entry.id),
    ["akuntansi", "laporan"],
  );
  assert.deepEqual(productsInCategory("tambahan"), []);
  assert.deepEqual(productsInCategory("tidak-ada"), []);
});

test("unknown or malformed identifiers resolve to not-found", () => {
  assert.equal(getCatalogEntry("kasir-transaksi.svg"), undefined);
  assert.equal(getCatalogEntry(""), undefined);
  assert.equal(getCatalogEntry(null), undefined);
  assert.equal(getCatalogEntry(42), undefined);
  assert.equal(getCatalogCategory("tambahan")?.name, "Tambahan");
  assert.equal(getCatalogCategory("Kasir"), undefined);
});

test("starting price uses the Basic package of each product", () => {
  for (const [id, prices] of Object.entries(approvedPrices)) {
    const entry = getCatalogEntry(id)!;
    assert.equal(startingPrice(entry), prices[0]);
  }
});

test("package offers validate strictly", () => {
  const entry = getCatalogEntry("kasir")!;
  assert.equal(packageOffer(entry, "basic").id, "basic");
  assert.equal(packageOffer(entry, "pro").price, 2_700_000);
  assert.equal(packageOffer(entry, "business").price, 3_900_000);

  assert.equal(isProductCatalog({}), false);
  assert.equal(isProductCatalog({ ...entry, packages: [] }), false);
  assert.equal(
    isProductCatalog({
      ...entry,
      packages: [...entry.packages.slice(1), entry.packages[0]],
    }),
    false,
  );
  assert.equal(
    isProductCatalog({
      ...entry,
      packages: [{ ...entry.packages[0], price: 0 }],
    }),
    false,
  );
  assert.equal(
    isProductCatalog({
      ...entry,
      packages: [{ ...entry.packages[0], originalPrice: 1 }],
    }),
    false,
  );
  assert.equal(
    isProductCatalog({
      ...entry,
      packages: [{ ...entry.packages[0], originalPrice: 1_800_000 }],
    }),
    false,
  );
  assert.equal(isProductCatalog({ ...entry, promoQuota: -1 }), false);
  assert.equal(isProductCatalog({ ...entry, unit: "year" }), false);
  assert.equal(
    isProductCatalog({
      ...entry,
      screenshots: [
        { ...entry.screenshots[0], src: "https://cdn.example.test/x.svg" },
      ],
    }),
    false,
  );
  assert.equal(
    isProductCatalog({
      ...entry,
      screenshots: [{ ...entry.screenshots[0], alt: "" }],
    }),
    false,
  );
});

test("fixtures carry exactly one validated entry per registry product", () => {
  const ids = catalogFixture.map((entry) => entry.id);
  assert.equal(new Set(ids).size, 6);
  assert.deepEqual(
    ids
      .flatMap((entry) => getCatalogEntry(entry)?.screenshots ?? [])
      .every(
        (shot) =>
          shot.alt.length > 0 &&
          shot.caption.length > 0 &&
          shot.src.startsWith("/img/products/") &&
          shot.src.endsWith(".svg"),
      ),
    true,
  );
});

// --- Bonus: URL-reflected search, filter and price sort ---

test("price sort identifiers validate strictly like the category contract", () => {
  assert.equal(getPriceSortId("termurah"), "termurah");
  assert.equal(getPriceSortId("termahal"), "termahal");
  assert.equal(getPriceSortId("TERMURAH"), undefined);
  assert.equal(getPriceSortId(" termurah"), undefined);
  assert.equal(getPriceSortId("harga-naik"), undefined);
  assert.equal(getPriceSortId(""), undefined);
  assert.equal(getPriceSortId("urutkan-ngawur"), undefined);
  assert.equal(getPriceSortId(null), undefined);
  assert.equal(getPriceSortId(undefined), undefined);
  assert.equal(getPriceSortId(42), undefined);
});

test("price sort orders by the Basic starting price and never mutates input", () => {
  const originalOrder = catalogFixture.map((entry) => entry.id);
  const ascending = sortCatalogByPrice(catalogFixture, "termurah");
  assert.deepEqual(
    ascending.map((entry) => entry.id),
    ["laporan", "inventori", "hr", "akuntansi", "kasir", "payroll"],
  );
  const descending = sortCatalogByPrice(catalogFixture, "termahal");
  assert.deepEqual(
    descending.map((entry) => entry.id),
    [...ascending].reverse().map((entry) => entry.id),
  );
  for (const entries of [ascending, descending])
    assert.deepEqual(
      [...new Set(entries.map((entry) => entry.id))].sort(),
      [...originalOrder].sort(),
    );
  assert.deepEqual(
    catalogFixture.map((entry) => entry.id),
    originalOrder,
  );
});

test("search barely matches card text: name, description, features", () => {
  assert.equal(catalogSearchHits(catalogFixture, "   "), catalogFixture);
  assert.deepEqual(
    catalogSearchHits(catalogFixture, "Kasir").map((entry) => entry.id),
    ["kasir"],
  );
  // “stok” lives in the summary description and a feature line of Inventori.
  assert.deepEqual(
    catalogSearchHits(catalogFixture, "stok").map((entry) => entry.id),
    ["inventori"],
  );
  // Feature-only text: “pantau” appears in a feature of Inventori.
  assert.deepEqual(
    catalogSearchHits(catalogFixture, "pantau").map((entry) => entry.id),
    ["inventori"],
  );
  assert.deepEqual(
    catalogSearchHits(catalogFixture, "gaji").map((entry) => entry.id),
    ["payroll"],
  );
  assert.deepEqual(
    catalogSearchHits(catalogFixture, "tidak-ada-sungguhan"),
    [],
  );
});

test("search composes with category filtering and price sorting", () => {
  const inCategory = productsInCategory("sdm-payroll");
  const hits = catalogSearchHits(inCategory, "gaji");
  assert.deepEqual(
    hits.map((entry) => entry.id),
    ["payroll"],
  );
  assert.deepEqual(
    sortCatalogByPrice(hits, "termahal").map((entry) => entry.id),
    ["payroll"],
  );
  // Searching inside an empty category also yields nothing, like Tambahan.
  assert.deepEqual(
    catalogSearchHits(productsInCategory("tambahan"), "kasir"),
    [],
  );
});

test("queries beyond the limit stay bounded instead of throwing", () => {
  for (const length of [150, 1_000]) {
    assert.deepEqual(catalogSearchHits(catalogFixture, "a".repeat(length)), []);
    const longQuery = `${"kod".repeat(length / 3)} kasir`;
    // Tokens past the 100-character cap are ignored, so “kasir” is dropped.
    assert.deepEqual(catalogSearchHits(catalogFixture, longQuery), []);
  }
});

test("search input normalizes blank noise and overlong values", () => {
  assert.equal(getCatalogSearch("  stok  "), "stok");
  assert.equal(getCatalogSearch(""), undefined);
  assert.equal(getCatalogSearch("   "), undefined);
  assert.equal(getCatalogSearch(null), undefined);
  assert.equal(getCatalogSearch(undefined), undefined);
  assert.equal(getCatalogSearch(42), undefined);
  assert.equal(getCatalogSearch("a".repeat(150))?.length, 100);
});

test("shareable catalog hrefs keep only valid state and encode safely", () => {
  assert.equal(catalogParamsHref({}), "/products");
  assert.equal(
    catalogParamsHref({ category: "sdm-payroll" }),
    "/products?kategori=sdm-payroll",
  );
  assert.equal(
    catalogParamsHref({
      category: "sdm-payroll",
      search: "stok gaji",
      priceSort: "termahal",
    }),
    "/products?kategori=sdm-payroll&q=stok+gaji&harga=termahal",
  );
  // Unknown category/sort values and blank searches never reach a shared link.
  assert.equal(
    catalogParamsHref({ category: "hacker", search: "x", priceSort: "ngawur" }),
    "/products?q=x",
  );
  assert.equal(catalogParamsHref({ search: "   " }), "/products");
  // Reserved characters round-trip through the page's searchParams parsing.
  assert.equal(catalogParamsHref({ search: "a&b" }), "/products?q=a%26b");
});
