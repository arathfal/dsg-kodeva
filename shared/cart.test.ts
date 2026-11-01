import assert from "node:assert/strict";
import { test } from "node:test";
import {
  addCartLine,
  isCartQuantity,
  quantityInCart,
  quoteCart,
  recoverPersistedCart,
  removeCartLine,
  setCartQuantity,
  MAX_LINE_QTY,
  CART_STORAGE_KEY,
  CART_STORAGE_VERSION,
  type CartLine,
} from "./cart.ts";

/** Adds `qty` licenses, asserting the update is accepted. */
function add(
  lines: CartLine[],
  productId: CartLine["productId"],
  packageId: CartLine["packageId"],
  qty = 1,
): CartLine[] {
  const result = addCartLine(lines, productId, packageId, qty);
  assert.equal(
    result.ok,
    true,
    `expected to add ${qty} ${productId}/${packageId}`,
  );
  return result.ok ? result.lines : lines;
}

/** Asserts an update is rejected for quota and leaves state untouched. */
function assertOverQuota(
  result: ReturnType<typeof addCartLine>,
  expected: CartLine[],
  maxAllowed?: number,
) {
  assert.equal(result.ok, false, "expected a rejected update");
  if (result.ok) return;
  assert.equal(result.reason, "over-quota");
  if (maxAllowed !== undefined) assert.equal(result.maxAllowed, maxAllowed);
  assert.deepEqual(result.lines, expected);
}

const initial = (): CartLine[] => [
  { productId: "hr", packageId: "pro", qty: 5 },
];

// Shared quotas: kasir 10, inventori 5, hr 8, payroll 12, akuntansi 15,
// laporan 0 (habis).
test("identity is product+package; repeated adds grow one line", () => {
  let current: CartLine[] = [];
  current = add(current, "kasir", "basic");
  current = add(current, "kasir", "basic");
  current = add(current, "kasir", "basic");
  assert.deepEqual(current, [
    { productId: "kasir", packageId: "basic", qty: 3 },
  ]);
  current = add(current, "kasir", "pro");
  assert.deepEqual(current, [
    { productId: "kasir", packageId: "basic", qty: 3 },
    { productId: "kasir", packageId: "pro", qty: 1 },
  ]);
  current = add(current, "kasir", "pro");
  assert.deepEqual(current, [
    { productId: "kasir", packageId: "basic", qty: 3 },
    { productId: "kasir", packageId: "pro", qty: 2 },
  ]);
  assert.equal(current.length, 2);
});

test("adds validate identities and quantities", () => {
  const unknownProduct = addCartLine([], "tidak-ada", "basic");
  assert.equal(unknownProduct.ok, false);
  if (!unknownProduct.ok)
    assert.equal(unknownProduct.reason, "unknown-product");

  const unknownPackage = addCartLine([], "kasir", "enterprise");
  assert.equal(unknownPackage.ok, false);
  if (!unknownPackage.ok)
    assert.equal(unknownPackage.reason, "unknown-package");

  const badQuantity = addCartLine([], "kasir", "basic", 0);
  assert.equal(badQuantity.ok, false);
  if (!badQuantity.ok) {
    assert.equal(badQuantity.reason, "invalid-quantity");
    assert.deepEqual(badQuantity.lines, []);
  }
});

test("shared product quota binds every package variant together", () => {
  let lines = add([], "kasir", "basic", 6);

  // Boundary: Basic 6 + Pro 4 fills exactly 10.
  const boundary = addCartLine(lines, "kasir", "pro", 4);
  assert.equal(boundary.ok, true, "the exact quota boundary must be accepted");
  lines = boundary.ok ? boundary.lines : lines;
  assert.equal(quantityInCart(lines, "kasir"), 10);

  // Boundary + 1 is rejected; this line may reach quota minus the others (6+4
  // already present leaves nothing above 4 for Pro).
  assertOverQuota(addCartLine(lines, "kasir", "pro", 1), lines, 4);

  // Changing a line while another variant exists stays quota bound.
  // Basic may reach exactly 10 − Pro 4 = 6; within that any value is fine.
  const rebalance = setCartQuantity(lines, "kasir", "basic", 1);
  assert.equal(rebalance.ok, true);
  if (rebalance.ok) assert.equal(quantityInCart(rebalance.lines, "kasir"), 5);
  const rebuilt = setCartQuantity(
    rebalance.ok ? rebalance.lines : lines,
    "kasir",
    "basic",
    6,
  );
  assert.equal(rebuilt.ok, true, "back to the exact boundary is accepted");
  if (rebuilt.ok) assert.equal(quantityInCart(rebuilt.lines, "kasir"), 10);

  assertOverQuota(
    setCartQuantity(rebuilt.ok ? rebuilt.lines : lines, "kasir", "basic", 7),
    rebuilt.ok ? rebuilt.lines : lines,
    6,
  );
});

test("products keep independent quotas", () => {
  let lines = add([], "kasir", "basic", 10);

  // HR quota is 8; a full kasir must not block another product.
  lines = add(lines, "hr", "basic", 8);
  assertOverQuota(addCartLine(lines, "hr", "business", 1), lines, 0);

  // Payroll (quota 12) and Inventori (quota 5) stay independent as well.
  lines = add(lines, "payroll", "pro", 12);
  assertOverQuota(addCartLine(lines, "payroll", "basic", 1), lines, 0);
  lines = add(lines, "inventori", "basic", 5);
  assertOverQuota(addCartLine(lines, "inventori", "pro", 1), lines, 0);

  // Laporan has a zero quota (habis): additions are always rejected.
  assertOverQuota(addCartLine(lines, "laporan", "basic", 1), lines, 0);
});

test("zero, negative, fractional, nonfinite and oversized quantities are rejected", () => {
  const rejectedQuantities = [
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    MAX_LINE_QTY + 1,
    Number.MAX_SAFE_INTEGER + 1,
    99_999,
  ];
  for (const value of rejectedQuantities) {
    assert.equal(isCartQuantity(value), false, String(value));
    const setAttempt = setCartQuantity(initial(), "hr", "pro", value);
    assert.equal(setAttempt.ok, false, String(value));
    if (!setAttempt.ok) {
      assert.ok(
        setAttempt.reason === "invalid-quantity" ||
          // Values within the ceiling but over the product quota reject as
          // over-quota instead: HR Pro already holds 5 of 8.
          setAttempt.reason === "over-quota",
        String(value),
      );
      // Rejected updates never lose valid state.
      assert.deepEqual(setAttempt.lines, initial());
    }
    const recovered = recoverPersistedCart({
      lines: [{ productId: "hr", packageId: "pro", qty: value }],
    });
    assert.deepEqual(recovered.lines, [], String(value));
    assert.ok(recovered.recovery.droppedLines > 0, String(value));
  }
  // MAX_LINE_QTY is a valid quantity shape; the quota check still bounds it.
  assertOverQuota(setCartQuantity([], "kasir", "basic", MAX_LINE_QTY), [], 10);
});

test("changing the only line and removing lines keep identity rules", () => {
  let lines = add([], "inventori", "pro", 3);

  const changed = setCartQuantity(lines, "inventori", "pro", 2);
  assert.equal(changed.ok, true);
  lines = lines.map((line) =>
    line.packageId === "pro" ? { ...line, qty: 2 } : line,
  );
  if (changed.ok) assert.deepEqual(changed.lines, lines);

  // Setting the same value is accepted without duplication.
  const unchanged = setCartQuantity(lines, "inventori", "pro", 2);
  assert.equal(unchanged.ok, true);
  if (unchanged.ok) assert.deepEqual(unchanged.lines, lines);

  const removed = removeCartLine(lines, "inventori", "pro");
  assert.equal(removed.ok, true);
  if (removed.ok) assert.deepEqual(removed.lines, []);

  const unknown = removeCartLine(lines, "inventori", "basic");
  assert.equal(unknown.ok, false);
  if (!unknown.ok) assert.equal(unknown.reason, "unknown-line");

  // The freed quota accepts a sibling package again.
  lines = add([], "akuntansi", "basic", 15);
  const shrunk = setCartQuantity(lines, "akuntansi", "basic", 14);
  assert.equal(shrunk.ok, true);
  if (shrunk.ok) {
    const refilled = add(shrunk.lines, "akuntansi", "pro");
    assert.equal(quantityInCart(refilled, "akuntansi"), 15);
  }
});

test("aggregate quantities and money stay exact integer rupiah", () => {
  const lines = add([], "akuntansi", "pro", 5);
  assert.equal(quantityInCart(lines, "akuntansi"), 5);
  const mixed: CartLine[] = [
    ...lines,
    { productId: "akuntansi", packageId: "business", qty: 4 },
  ];
  assert.equal(quantityInCart(mixed, "akuntansi"), 9);
  // 6 fits exactly (quota 15); 7 would exceed it (Basic reaches 15 − 9 = 6).
  assertOverQuota(addCartLine(mixed, "akuntansi", "basic", 7), mixed, 6);
  const exactly = addCartLine(mixed, "akuntansi", "basic", 6);
  assert.equal(exactly.ok, true);
  const quote = quoteCart(exactly.ok ? exactly.lines : mixed);
  assert.equal(quote.ok, true);
  if (!quote.ok) return;
  // 5 × Rp2.500.000 + 4 × Rp3.800.000 + 6 × Rp1.600.000 = Rp37.300.000.
  assert.equal(quote.total, 37_300_000);
  assert.equal(quote.itemCount, 15);
});

test("quote exposes fixture-derived unit data without trusting storage", () => {
  const recovered = recoverPersistedCart({
    lines: [
      { productId: "kasir", packageId: "basic", qty: 2 },
      { productId: "inventori", packageId: "basic", qty: 1 },
    ],
    // Forged persisted amounts must be ignored.
    total: 999_999_999,
    savedSubtotal: "Rp165",
  });
  assert.equal(recovered.recovery.kind, "restored");
  assert.equal(recovered.lines.length, 2);
  const quote = quoteCart(recovered.lines);
  assert.equal(quote.ok, true, "recovered lines must quote");
  if (!quote.ok) return;
  // 2 × Rp1.800.000 + 1 × Rp1.200.000 comes from the fixture, not storage.
  assert.equal(quote.total, 4_800_000);
  assert.notEqual(quote.total, 999_999_999);
  assert.equal(quote.itemCount, 3);

  const kasirView = quote.lines.find((view) => view.productId === "kasir");
  assert.equal(kasirView?.unitPrice, 1_800_000);
  assert.equal(kasirView?.originalPrice, 2_400_000);
  assert.equal(kasirView?.unitLabel, "per outlet");
  assert.equal(kasirView?.unit, "outlet");
  assert.equal(kasirView?.packageName, "Basic");
  assert.equal(kasirView?.lineTotal, 3_600_000);
  const inventoriView = quote.lines.find(
    (view) => view.productId === "inventori",
  );
  assert.equal(inventoriView?.unitLabel, "per outlet");
  assert.equal(inventoriView?.originalPrice, undefined);
});

test("recovery drops unknown product/package and corrupt entries", () => {
  const corrupt = recoverPersistedCart({
    lines: [
      { productId: "kasir", packageId: "basic", qty: 1 },
      { productId: "tidak-ada", packageId: "basic", qty: 1 },
      { productId: "kasir", packageId: "nope", qty: 1 },
      { productId: "hr", packageId: "basic", qty: 0 },
      { productId: "hr", packageId: "basic", qty: -3 },
      { productId: "hr", packageId: "basic", qty: 1.5 },
      { productId: "hr", packageId: "basic", qty: Number.NaN },
      { productId: "hr", packageId: "basic", qty: 99_999 },
      "forged-line",
      null,
    ],
  });
  assert.equal(corrupt.recovery.kind, "recovered");
  assert.equal(corrupt.recovery.droppedLines, 9);
  assert.deepEqual(corrupt.lines, [
    { productId: "kasir", packageId: "basic", qty: 1 },
  ]);

  // Structurally broken payloads restore empty with a notice.
  assert.equal(recoverPersistedCart(undefined).recovery.kind, "fresh");
  assert.equal(recoverPersistedCart(null).recovery.kind, "fresh");
  assert.equal(recoverPersistedCart("garbage").recovery.kind, "corrupt");
  assert.equal(
    recoverPersistedCart({ lines: "not-an-array" }).recovery.kind,
    "corrupt",
  );
  assert.equal(recoverPersistedCart({ lines: [] }).recovery.kind, "fresh");
});

test("recovery clamps persisted quantities to the current shared quota", () => {
  const overProductLimit = recoverPersistedCart({
    lines: [
      { productId: "kasir", packageId: "basic", qty: 20 },
      { productId: "kasir", packageId: "pro", qty: 4 },
      { productId: "kasir", packageId: "business", qty: 2 },
    ],
  });
  assert.equal(overProductLimit.recovery.kind, "recovered");
  assert.equal(overProductLimit.recovery.clampedLines, 1);
  // Basic clamps to 10; both later variants of the same product drop because
  // the shared quota is already fully used by the clamped line.
  assert.equal(overProductLimit.recovery.droppedLines, 2);
  assert.deepEqual(overProductLimit.lines, [
    { productId: "kasir", packageId: "basic", qty: 10 },
  ]);

  const splitAcrossVariants = recoverPersistedCart({
    lines: [
      { productId: "hr", packageId: "basic", qty: 6 },
      { productId: "hr", packageId: "pro", qty: 8 },
    ],
  });
  assert.equal(splitAcrossVariants.recovery.clampedLines, 1);
  assert.deepEqual(splitAcrossVariants.lines, [
    { productId: "hr", packageId: "basic", qty: 6 },
    { productId: "hr", packageId: "pro", qty: 2 },
  ]);

  const zeroQuota = recoverPersistedCart({
    lines: [{ productId: "laporan", packageId: "basic", qty: 1 }],
  });
  assert.deepEqual(zeroQuota.lines, []);
  assert.equal(zeroQuota.recovery.droppedLines, 1);
  assert.equal(zeroQuota.recovery.kind, "recovered");

  // Duplicate persisted identities merge into one bounded line.
  const duplicates = recoverPersistedCart({
    lines: [
      { productId: "kasir", packageId: "pro", qty: 6 },
      { productId: "kasir", packageId: "pro", qty: 4 },
    ],
  });
  assert.deepEqual(duplicates.lines, [
    { productId: "kasir", packageId: "pro", qty: 10 },
  ]);
  assert.equal(duplicates.recovery.kind, "restored");
});

test("storage markers follow the approved versioned policy", () => {
  assert.equal(CART_STORAGE_VERSION, 1);
  assert.equal(typeof CART_STORAGE_KEY, "string");
  assert.ok(CART_STORAGE_KEY.length > 0);
  const legacy = recoverPersistedCart(
    { lines: [{ productId: "kasir", packageId: "basic", qty: 1 }] },
    { legacy: true },
  );
  assert.equal(legacy.recovery.kind, "wrong-version");
  assert.deepEqual(legacy.lines, []);
});
