import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BILLING_PERIOD,
  catalogCategories,
  catalogFixture,
  catalogResult,
  getCatalogCategory,
  getCatalogEntry,
  isProductCatalog,
  packageOffer,
  productsInCategory,
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
