// Pure checkout logic for T07 (R-015/R-016/R-021/R-023; D-020, D-042, D-043,
// D-044). Buyer validation reuses the approved T03 limits, the order payload is
// a client-side mock built only from validated cart quotes and approved fixture
// prices, and the whole checkout is revalidated against the current shared
// promo quotas before any simulated payment result is produced.
import { BILLING_PERIOD, getCatalogEntry } from "./catalog.ts";
import { isEmail, isRecord } from "./content.ts";
import type { CartQuote } from "./cart.ts";

export const CHECKOUT_STORAGE_NOTE =
  "Checkout ini adalah simulasi assessment tanpa gateway pembayaran nyata, tanpa data backend, dan tanpa pengiriman lisensi.";

export const SIMULATION_RESULTS = ["success", "failure"] as const;
export type SimulationResult = (typeof SIMULATION_RESULTS)[number];

export type UtmPayload = Partial<
  Record<"source" | "medium" | "campaign" | "term" | "content", string>
>;

export interface BuyerInput {
  name: string;
  email: string;
}

export type BuyerErrors = Partial<
  Record<"name" | "email" | "simulation" | "form", string>
>;
export type BuyerValidation =
  { ok: true; data: BuyerInput } | { ok: false; errors: BuyerErrors };

/** Buyer form validation; name/email limits follow the approved lead policy. */
export function validateBuyer(input: unknown): BuyerValidation {
  if (!isRecord(input))
    return { ok: false, errors: { form: "Data pembeli tidak valid." } };
  const errors: BuyerErrors = {};
  const allowed = ["name", "email", "simulation"];
  if (Object.keys(input).some((key) => !allowed.includes(key)))
    errors.form = "Data pembeli tidak valid.";
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name || name.length > 100)
    errors.name = "Isi nama dengan 1–100 karakter.";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  if (!email) errors.email = "Isi alamat email untuk pesanan ini.";
  else if (!isEmail(email))
    errors.email = "Isi alamat email yang valid, maksimal 254 karakter.";
  // The radio value is produced by the form (D-042), but an explicitly present
  // unknown value must not be accepted either.
  if (input.simulation !== undefined && typeof input.simulation !== "string")
    errors.simulation = "Pilih hasil simulasi pembayaran.";
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: { name, email },
  };
}

export interface MockOrderItem {
  productId: string;
  productName: string;
  packageId: string;
  packageName: string;
  unit: "outlet" | "pengguna";
  unitPrice: number;
  originalPrice?: number;
  qty: number;
  lineTotal: number;
}

export interface MockOrderPayload {
  orderId: string;
  createdAt: string;
  buyer: { name: string; email: string };
  items: MockOrderItem[];
  itemCount: number;
  total: number;
  currency: "IDR";
  billingPeriod: string;
  utm?: UtmPayload;
  simulation: {
    result: SimulationResult;
    note: string;
  };
}

export type OrderBuildError =
  | "invalid-buyer"
  | "empty-cart"
  | "invalid-quote"
  | "over-quota"
  | "invalid-attribution";

export type OrderBuild =
  | { ok: true; order: MockOrderPayload }
  | { ok: false; reason: OrderBuildError };

/**
 * Validates the attribution payload against the approved D-020 contract: only
 * the five utm_ keys, string values, trimmed to at most 200 characters, and
 * empty values omitted. Unknown keys or malformed types are rejected rather
 * than silently widened; capture itself stays in T08.
 */
function validatedUtm(
  utm: unknown,
): { ok: true; utm?: UtmPayload } | { ok: false } {
  if (utm === undefined) return { ok: true };
  if (!isRecord(utm)) return { ok: false };
  const typed: UtmPayload = {};
  for (const [key, value] of Object.entries(utm)) {
    if (
      !["source", "medium", "campaign", "term", "content"].includes(key) ||
      typeof value !== "string" ||
      value.trim().length > 200
    )
      return { ok: false };
    if (value.trim()) typed[key as keyof UtmPayload] = value.trim();
  }
  if (!Object.keys(typed).length) return { ok: true };
  return { ok: true, utm: typed };
}

/**
 * Builds the mock order payload (D-043 client-side only). Every quote line is
 * revalidated against the current fixtures and the per-product shared quota
 * (R-015) after the buyer validation, so a stale or hand-edited cart can never
 * produce an order whose amounts or quantities exceed approved limits.
 */
export function buildMockOrder(
  buyer: unknown,
  quote: CartQuote,
  attribution: unknown,
  result: SimulationResult,
): OrderBuild {
  const buyerChecked = validateBuyer(buyer);
  if (!buyerChecked.ok) return { ok: false, reason: "invalid-buyer" };
  if (!SIMULATION_RESULTS.includes(result))
    return { ok: false, reason: "invalid-buyer" };
  const utm = validatedUtm(attribution);
  if (!utm.ok) return { ok: false, reason: "invalid-attribution" };
  if (!quote.ok) return { ok: false, reason: "invalid-quote" };
  if (quote.lines.length === 0) return { ok: false, reason: "empty-cart" };

  const quotaUsed = new Map<string, number>();
  const items: MockOrderItem[] = quote.lines.map((line) => {
    quotaUsed.set(
      line.productId,
      (quotaUsed.get(line.productId) ?? 0) + line.qty,
    );
    return {
      productId: line.productId,
      productName: line.productName,
      packageId: line.packageId,
      packageName: line.packageName,
      unit: line.unit,
      unitPrice: line.unitPrice,
      ...(line.originalPrice !== undefined
        ? { originalPrice: line.originalPrice }
        : {}),
      qty: line.qty,
      lineTotal: line.lineTotal,
    };
  });

  for (const [productId, qty] of quotaUsed) {
    const entry = getCatalogEntry(productId);
    // Every quantity must still fit the product's current shared quota, so a
    // restored stale cart is rejected before a payment result can be shown.
    if (!entry || qty > entry.promoQuota || !Number.isSafeInteger(qty))
      return { ok: false, reason: "over-quota" };
    // Prices stay authoritative fixtures indexed by the quote, never re-derived.
  }

  return {
    ok: true,
    order: {
      orderId: newOrderId(),
      createdAt: new Date().toISOString(),
      buyer: {
        name: buyerChecked.data.name,
        email: buyerChecked.data.email,
      },
      items,
      itemCount: quote.itemCount,
      total: quote.total,
      currency: "IDR",
      billingPeriod: BILLING_PERIOD,
      ...(utm.utm ? { utm: utm.utm } : {}),
      simulation: {
        result,
        note: CHECKOUT_STORAGE_NOTE,
      },
    },
  };
}

/** Demo order label; determinism is required for outcomes, not identifiers. */
export function newOrderId(): string {
  const uuid = crypto.randomUUID();
  return `KV-DEMO-${uuid.replace(/-/g, "").substring(0, 8).toUpperCase()}`;
}
