// Pure attribution capture logic. Only the five utm keys are kept, with
// string values trimmed to at most 200 characters and empty values omitted.
// The touch policy is first-touch per tab session with first-set-wins
// handling of partial and later parameter sets. Browser storage access and
// the dataLayer live in apps/web/src/lib/analytics.ts; this module stays
// pure so Node tests can cover parsing, normalization and the merge decision.
import { isRecord } from "./content.ts";

export const UTM_KEYS = [
  "source",
  "medium",
  "campaign",
  "term",
  "content",
] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmTouch = Partial<Record<UtmKey, string>>;

/** sessionStorage key of the tab's attribution touch. */
export const UTM_STORAGE_KEY = "kodeva-utm-touch";
/** Value limit, applied to the trimmed string. */
export const UTM_VALUE_LIMIT = 200;

/**
 * { ok: true, utm: undefined } means "no new touch here" (absent or empty
 * parameters) so a page without parameters never erases a stored touch.
 * { ok: false } marks an unusable set (wrong types, unknown payload keys or an
 * oversized known value); callers ignore it entirely and keep any stored touch.
 */
export type UtmCapture = { ok: true; utm?: UtmTouch } | { ok: false };

/**
 * Validates a candidate touch against the touch contract. Unknown keys are
 * rejected (payload strictness), strings are trimmed and bounded, and empty
 * values are omitted; a set with no remaining values is "no new touch".
 */
export function normalizeUtm(input: unknown): UtmCapture {
  if (input === undefined) return { ok: true };
  if (!isRecord(input)) return { ok: false };
  const utm: UtmTouch = {};
  for (const [key, value] of Object.entries(input)) {
    if (
      !UTM_KEYS.includes(key as UtmKey) ||
      typeof value !== "string" ||
      value.trim().length > UTM_VALUE_LIMIT
    )
      return { ok: false };
    if (value.trim()) utm[key as UtmKey] = value.trim();
  }
  return Object.keys(utm).length ? { ok: true, utm } : { ok: true };
}

/**
 * Parses the five known utm_ parameters from a request/query. Unknown utm_*
 * keys are ignored at capture time so common extras such as utm_id do
 * not invalidate the known keys; a known key with an oversized value makes the
 * whole set unusable. No known parameter at all is "no new touch".
 */
export function utmFromSearchParams(params: URLSearchParams): UtmCapture {
  const raw: Partial<Record<UtmKey, string>> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(`utm_${key}`);
    if (value !== null) raw[key] = value;
  }
  if (Object.keys(raw).length === 0) return { ok: true };
  return normalizeUtm(raw);
}

/**
 * First-touch merge: a usable stored touch always wins as-is
 * (even against a full later campaign); an absent or corrupt stored touch is
 * replaced by the incoming one when it exists.
 */
export function pickTouch(
  stored: UtmTouch | undefined,
  incoming: UtmTouch | undefined,
): UtmTouch | undefined {
  return stored ?? incoming;
}

/**
 * Reads a persisted touch from untrusted JSON: anything that fails the touch
 * contract is treated as absent so a forged or stale value is replaced at the
 * next capture instead of being sent onward.
 */
export function readStoredTouch(raw: unknown): UtmTouch | undefined {
  const parsed = normalizeUtm(raw);
  return parsed.ok ? parsed.utm : undefined;
}
