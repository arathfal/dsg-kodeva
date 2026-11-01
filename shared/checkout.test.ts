// Node built-in tests for checkout logic: buyer validation, mock order
// payload construction against the
// approved fixtures, shared-quota revalidation at checkout, and the bounded
// attribution (utm) contract.
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { quoteCart, type CartLine } from "./cart.ts";
import {
  buildMockOrder,
  CHECKOUT_STORAGE_NOTE,
  SIMULATION_RESULTS,
  validateBuyer,
} from "./checkout.ts";

const buyer = { name: "Ade Wirasena", email: "ade@example.co.id" };

describe("validateBuyer", () => {
  const buyer = { name: "Ade Wirasena", email: "ade@example.co.id" };

  it("accepts a valid buyer and trims values", () => {
    const result = validateBuyer({
      name: "  Ade Wirasena  ",
      email: " ade@example.co.id ",
      simulation: "success",
    });
    assert.ok(result.ok);
    assert.deepEqual(result.data, {
      name: "Ade Wirasena",
      email: "ade@example.co.id",
    });
  });

  it("accepts buyer input regardless of the radio value", () => {
    assert.deepEqual(SIMULATION_RESULTS, ["success", "failure"]);
    assert.ok(validateBuyer(buyer).ok);
    assert.ok(validateBuyer({ ...buyer, simulation: "failure" }).ok);
  });

  it("rejects blank, non-string and oversized names", () => {
    assert.ok(!validateBuyer({ ...buyer, name: "  " }).ok);
    assert.ok(!validateBuyer({ ...buyer, name: 123 }).ok);
    assert.ok(!validateBuyer({ ...buyer, name: "a".repeat(101) }).ok);
  });

  it("requires a valid, bounded email", () => {
    assert.ok(!validateBuyer({ ...buyer, email: "" }).ok);
    assert.ok(!validateBuyer({ ...buyer, email: "bukan-email" }).ok);
    assert.ok(!validateBuyer({ ...buyer, email: 456 }).ok);
    assert.ok(
      !validateBuyer({ ...buyer, email: `a@${"b".repeat(250)}.co` }).ok,
    );
  });

  it("rejects non-string simulation values and unknown payload fields", () => {
    assert.ok(!validateBuyer({ ...buyer, simulation: 2 }).ok);
    assert.ok(!validateBuyer({ ...buyer, wa: "08123" }).ok);
    assert.ok(!validateBuyer("string").ok);
  });
});

describe("buildMockOrder payload construction", () => {
  it("records accurate buyer, item, price and currency data from fixtures", () => {
    const quote = quoteCart([
      { productId: "kasir", packageId: "basic", qty: 2 },
      { productId: "kasir", packageId: "pro", qty: 3 },
    ]);
    assert.ok(quote.ok);
    const result = buildMockOrder(buyer, quote, undefined, "success");
    assert.ok(result.ok);
    assert.match(result.order.orderId, /^KV-DEMO-[0-9A-F]{8}$/);
    assert.doesNotThrow(() => new Date(result.order.createdAt).toISOString());
    assert.deepEqual(result.order.buyer, buyer);
    assert.equal(result.order.items.length, 2);
    assert.deepEqual(result.order.items[0], {
      productId: "kasir",
      productName: "Kodeva Kasir",
      packageId: "basic",
      packageName: "Basic",
      unit: "outlet",
      unitPrice: 1_800_000,
      originalPrice: 2_400_000,
      qty: 2,
      lineTotal: 3_600_000,
    });
    assert.deepEqual(result.order.items[1], {
      productId: "kasir",
      productName: "Kodeva Kasir",
      packageId: "pro",
      packageName: "Pro",
      unit: "outlet",
      unitPrice: 2_700_000,
      originalPrice: 3_600_000,
      qty: 3,
      lineTotal: 8_100_000,
    });
    assert.equal(result.order.itemCount, 5);
    assert.equal(result.order.total, 11_700_000);
    assert.equal(result.order.currency, "IDR");
    assert.equal(result.order.billingPeriod, "per tahun");
    assert.equal(result.order.simulation.result, "success");
    assert.equal(result.order.simulation.note, CHECKOUT_STORAGE_NOTE);
  });

  it("keeps a strictly bounded payload shape", () => {
    const quote = quoteCart([{ productId: "hr", packageId: "pro", qty: 1 }]);
    assert.ok(quote.ok);
    const result = buildMockOrder(buyer, quote, undefined, "failure");
    assert.ok(result.ok);
    assert.deepEqual(Object.keys(result.order).sort(), [
      "billingPeriod",
      "buyer",
      "createdAt",
      "currency",
      "itemCount",
      "items",
      "orderId",
      "simulation",
      "total",
    ]);
    assert.deepEqual(Object.keys(result.order.buyer).sort(), ["email", "name"]);
    assert.deepEqual(Object.keys(result.order.simulation).sort(), [
      "note",
      "result",
    ]);
    assert.deepEqual(Object.keys(result.order.items[0]).sort(), [
      "lineTotal",
      "originalPrice",
      "packageId",
      "packageName",
      "productId",
      "productName",
      "qty",
      "unit",
      "unitPrice",
    ]);
  });

  it("rejects empty carts before simulation", () => {
    const empty = quoteCart([]);
    assert.ok(empty.ok);
    const result = buildMockOrder(buyer, empty, undefined, "success");
    assert.equal(result.ok, false);
    assert.ok(!result.ok);
    assert.equal(result.reason, "empty-cart");
  });
});

describe("buildMockOrder quota revalidation", () => {
  it("accepts mixed packages that exactly fill the shared quota", () => {
    // Kasir quota 10: Basic 6 + Pro 4 covers the exact shared-quota boundary.
    const quote = quoteCart([
      { productId: "kasir", packageId: "basic", qty: 6 },
      { productId: "kasir", packageId: "pro", qty: 4 },
    ]);
    assert.ok(quote.ok);
    const result = buildMockOrder(buyer, quote, undefined, "success");
    assert.ok(result.ok);
    assert.equal(result.order.itemCount, 10);
  });

  it("rejects one more than the shared quota even when each line reads valid", () => {
    // Each line alone stays below the quantity ceiling; together they exceed
    // the kasir quota of 10 that every package shares.
    const quote = quoteCart([
      { productId: "kasir", packageId: "basic", qty: 6 },
      { productId: "kasir", packageId: "pro", qty: 5 },
    ]);
    assert.ok(quote.ok);
    const result = buildMockOrder(buyer, quote, undefined, "success");
    assert.equal(result.ok, false);
    assert.ok(!result.ok);
    assert.equal(result.reason, "over-quota");
  });

  it("rejects any quantity on a zero-quota product", () => {
    const quote = quoteCart([
      { productId: "laporan", packageId: "basic", qty: 1 },
    ]);
    assert.ok(quote.ok);
    const result = buildMockOrder(buyer, quote, undefined, "success");
    assert.equal(result.ok, false);
    assert.ok(!result.ok);
    assert.equal(result.reason, "over-quota");
  });

  it("rejects an unknown product quote", () => {
    const lines = [
      { productId: "tidak-ada", packageId: "basic", qty: 1 },
    ] as unknown as CartLine[];
    const quote = quoteCart(lines);
    assert.ok(!quote.ok);
    assert.equal(
      buildMockOrder(buyer, quote, undefined, "success").reason,
      "invalid-quote",
    );
  });

  it("rejects an invalid buyer instead of producing an order", () => {
    const quote = quoteCart([
      { productId: "kasir", packageId: "basic", qty: 1 },
    ]);
    assert.ok(quote.ok);
    assert.equal(
      buildMockOrder(
        { name: "", email: "", simulation: "success" },
        quote,
        undefined,
        "success",
      ).reason,
      "invalid-buyer",
    );
  });
});

describe("buildMockOrder attribution contract", () => {
  const quote = quoteCart([{ productId: "hr", packageId: "basic", qty: 1 }]);
  assert.ok(quote.ok);

  it("keeps known keys trimmed to the utm shape", () => {
    const result = buildMockOrder(
      buyer,
      quote,
      {
        source: " ig-beranda ",
        medium: "social",
        campaign: "promo-akhir-tahun",
        term: " umkm pos ",
        content: "link-bio",
      },
      "success",
    );
    assert.ok(result.ok);
    assert.equal(result.order.utm?.source, "ig-beranda");
    assert.equal(result.order.utm?.term, "umkm pos");
    assert.equal(Object.keys(result.order.utm ?? {}).length, 5);
  });

  it("omits empty values, then omits utm entirely when nothing stays", () => {
    const emptyResult = buildMockOrder(
      buyer,
      quote,
      { source: "", medium: "  ", campaign: "" },
      "success",
    );
    assert.ok(emptyResult.ok);
    assert.equal("utm" in emptyResult.order, false);
  });

  it("omits utm when no attribution is passed", () => {
    const result = buildMockOrder(buyer, quote, undefined, "success");
    assert.ok(result.ok);
    assert.equal("utm" in result.order, false);
  });

  it("rejects unknown keys, oversized values, non-string values and bad shapes", () => {
    assert.equal(
      buildMockOrder(buyer, quote, { utm_source: "ig" }, "success").reason,
      "invalid-attribution",
    );
    assert.equal(
      buildMockOrder(buyer, quote, { source: "x".repeat(201) }, "success")
        .reason,
      "invalid-attribution",
    );
    assert.equal(
      buildMockOrder(buyer, quote, { source: 7 }, "success").reason,
      "invalid-attribution",
    );
    assert.equal(
      buildMockOrder(buyer, quote, "utm", "success").reason,
      "invalid-attribution",
    );
  });
});
