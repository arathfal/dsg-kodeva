// Pure cart logic for T06 (R-014/R-015; D-038/D-039). Cart lines are identified
// by productId+packageId, the approved per-product quota is shared by every
// package variant, and all amounts are integer rupiah recomputed from the
// approved fixtures. Persisted storage is never trusted for prices or totals;
// recovery validates every line against current catalog data (D-038).
import {
  getCatalogEntry,
  packageNames,
  unitLabels,
  type LicenseUnit,
  type PackageId,
} from "./catalog.ts";
import { isProductId, isRecord, products, type ProductId } from "./content.ts";

export type { PackageId } from "./catalog.ts";
export type { ProductId } from "./content.ts";

export const CART_STORAGE_KEY = "kodeva-cart";
export const CART_STORAGE_VERSION = 1; /**
 * Per-line quantity ceiling shared by typed input and persisted data. The
 * approved fixtures never hold more than 15 licenses, so this only bounds
 * corrupt or forged payloads; anything larger is treated as invalid.
 */
export const MAX_LINE_QTY = 9999;

export interface CartLine {
  productId: ProductId;
  packageId: PackageId;
  qty: number;
}

export type CartQuantityError =
  | "unknown-product"
  | "unknown-package"
  | "invalid-quantity"
  | "unknown-line"
  | "over-quota";

export type CartQuantityResult =
  | { ok: true; lines: CartLine[] }
  | {
      ok: false;
      /** Unchanged current state; rejected updates never mutate the cart. */
      lines: CartLine[];
      reason: CartQuantityError;
      /** Absolute quantity the target line may still reach (over-quota). */
      maxAllowed?: number;
    };

/** A positive safe integer within the approved ceiling, or undefined. */
export function isCartQuantity(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value > 0 &&
    value <= MAX_LINE_QTY
  );
}

export function quantityInCart(
  lines: CartLine[],
  productId: ProductId,
): number {
  return lines.reduce(
    (sum, line) => (line.productId === productId ? sum + line.qty : sum),
    0,
  );
}

function quantitiesOfOthers(
  lines: CartLine[],
  productId: ProductId,
  packageId: PackageId,
): number {
  return lines.reduce(
    (sum, line) =>
      line.productId === productId && line.packageId !== packageId
        ? sum + line.qty
        : sum,
    0,
  );
}

function replaceLine(
  lines: CartLine[],
  productId: ProductId,
  packageId: PackageId,
  qty: number,
): CartLine[] {
  const existing = lines.some(
    (line) => line.productId === productId && line.packageId === packageId,
  );
  if (!existing) return [...lines, { productId, packageId, qty }];
  return lines.map((line) =>
    line.productId === productId && line.packageId === packageId
      ? { ...line, qty }
      : line,
  );
}

// One line identity per product+package; "add" increases an existing line
// (D-039) and "set" replaces the typed quantity of a line.
function attemptQuantity(
  lines: CartLine[],
  productId: unknown,
  packageId: unknown,
  requested: number,
  mode: "add" | "set",
): CartQuantityResult {
  const reject = (
    reason: CartQuantityError,
    maxAllowed?: number,
  ): CartQuantityResult => ({
    ok: false,
    lines,
    reason,
    maxAllowed,
  });
  if (!isProductId(productId)) return reject("unknown-product");
  const entry = getCatalogEntry(productId);
  if (!entry) return reject("unknown-product");
  if (
    typeof packageId !== "string" ||
    !entry.packages.some((offer) => offer.id === packageId)
  )
    return reject("unknown-package");
  if (!isCartQuantity(requested)) return reject("invalid-quantity");
  const packageIdTyped = packageId as PackageId;
  const current =
    lines.find(
      (line) =>
        line.productId === productId && line.packageId === packageIdTyped,
    )?.qty ?? 0;
  const next = mode === "add" ? current + requested : requested;
  const maxAllowed = Math.max(
    entry.promoQuota - quantitiesOfOthers(lines, productId, packageIdTyped),
    0,
  );
  if (next > maxAllowed) return reject("over-quota", maxAllowed);
  if (mode === "set" && next === current) return { ok: true, lines };
  return {
    ok: true,
    lines: replaceLine(lines, productId, packageIdTyped, next),
  };
}

export function addCartLine(
  lines: CartLine[],
  productId: unknown,
  packageId: unknown,
  requested = 1,
): CartQuantityResult {
  return attemptQuantity(lines, productId, packageId, requested, "add");
}

export function setCartQuantity(
  lines: CartLine[],
  productId: unknown,
  packageId: unknown,
  requested: number,
): CartQuantityResult {
  return attemptQuantity(lines, productId, packageId, requested, "set");
}

export function removeCartLine(
  lines: CartLine[],
  productId: unknown,
  packageId: unknown,
): CartQuantityResult {
  if (!isProductId(productId))
    return { ok: false, lines, reason: "unknown-product" };
  const remaining = lines.filter(
    (line) => !(line.productId === productId && line.packageId === packageId),
  );
  return remaining.length === lines.length
    ? { ok: false, lines, reason: "unknown-line" }
    : { ok: true, lines: remaining };
}

export interface CartRecovery {
  kind: "fresh" | "restored" | "recovered" | "wrong-version" | "corrupt";
  restoredLines: number;
  droppedLines: number;
  clampedLines: number;
}

const emptyRecovery = (): CartRecovery => ({
  kind: "restored",
  restoredLines: 0,
  droppedLines: 0,
  clampedLines: 0,
});

const emptyCart = (kind: CartRecovery["kind"]) => ({
  lines: [] as CartLine[],
  recovery: { ...emptyRecovery(), kind },
});

/**
 * Recovers a persisted cart payload against current catalog data (D-038):
 * positive safe integer quantities only, known product/package identities, and
 * per-product totals clamped to the current shared quota. Duplicate persisted
 * lines for one identity merge, unknown payload fields (such as forged totals)
 * are ignored, and prices are never read back.
 */
export function recoverPersistedCart(
  value: unknown,
  options: { legacy?: boolean } = {},
): { lines: CartLine[]; recovery: CartRecovery } {
  if (options.legacy) return emptyCart("wrong-version");
  if (value === undefined || value === null) return emptyCart("fresh");
  if (!isRecord(value) || !Array.isArray(value.lines))
    return emptyCart("corrupt");
  const recovery = emptyRecovery();
  const lines: CartLine[] = [];
  for (const rawLine of value.lines) {
    const rejected = () => {
      recovery.droppedLines += 1;
    };
    if (
      !isRecord(rawLine) ||
      !isCartQuantity(rawLine.qty) ||
      !isProductId(rawLine.productId)
    ) {
      rejected();
      continue;
    }
    const entry = getCatalogEntry(rawLine.productId);
    const packageId = rawLine.packageId;
    if (!entry || !entry.packages.some((offer) => offer.id === packageId)) {
      rejected();
      continue;
    }
    const typedPackageId = packageId as PackageId;
    const target = lines.find(
      (line) =>
        line.productId === rawLine.productId &&
        line.packageId === typedPackageId,
    );
    const others = quantitiesOfOthers(lines, rawLine.productId, typedPackageId);
    const limit = Math.max(entry.promoQuota - others, 0);
    const requested = (target ? target.qty : 0) + (rawLine.qty as number);
    if (requested > limit) {
      if (limit <= Math.max(target ? target.qty : 0, 0)) {
        // Every remaining license is already in another line of this product.
        rejected();
        continue;
      }
      if (target) target.qty = limit;
      else
        lines.push({
          productId: rawLine.productId,
          packageId: typedPackageId,
          qty: limit,
        });
      recovery.clampedLines += 1;
      continue;
    }
    if (target) target.qty = requested;
    else
      lines.push({
        productId: rawLine.productId,
        packageId: typedPackageId,
        qty: requested,
      });
  }
  recovery.restoredLines = lines.length;
  recovery.kind =
    recovery.droppedLines > 0 || recovery.clampedLines > 0
      ? "recovered"
      : lines.length > 0
        ? "restored"
        : "fresh";
  return { lines, recovery };
}

export interface CartLineView {
  productId: ProductId;
  packageId: PackageId;
  qty: number;
  productName: string;
  packageName: string;
  unit: LicenseUnit;
  unitLabel: string;
  unitPrice: number;
  originalPrice?: number;
  lineTotal: number;
}

export type CartQuote =
  | { ok: true; lines: CartLineView[]; total: number; itemCount: number }
  | {
      ok: false;
      reason: "unknown-product" | "unknown-package" | "unsafe-total";
    };

/**
 * Recomputes every amount from the approved fixtures (R-023/D-038). Storage
 * never carries prices, so persisted totals can be neither trusted nor lost.
 */
export function quoteCart(lines: CartLine[]): CartQuote {
  const items: CartLineView[] = [];
  let total = 0;
  let itemCount = 0;
  for (const line of lines) {
    if (!isProductId(line.productId))
      return { ok: false, reason: "unknown-product" };
    const entry = getCatalogEntry(line.productId);
    const offer = entry?.packages.find(
      (candidate) => candidate.id === line.packageId,
    );
    if (!entry || !offer) return { ok: false, reason: "unknown-package" };
    if (!isCartQuantity(line.qty)) return { ok: false, reason: "unsafe-total" };
    const lineTotal = offer.price * line.qty;
    if (!Number.isSafeInteger(lineTotal))
      return { ok: false, reason: "unsafe-total" };
    const product = products.find((candidate) => candidate.id === entry.id);
    items.push({
      productId: line.productId,
      packageId: line.packageId,
      qty: line.qty,
      productName: product?.name ?? entry.id,
      packageName: packageNames[line.packageId],
      unit: entry.unit,
      unitLabel: unitLabels[entry.unit],
      unitPrice: offer.price,
      originalPrice: offer.originalPrice,
      lineTotal,
    });
    total += lineTotal;
    itemCount += line.qty;
  }
  return Number.isSafeInteger(total)
    ? { ok: true, lines: items, total, itemCount }
    : { ok: false, reason: "unsafe-total" };
}
