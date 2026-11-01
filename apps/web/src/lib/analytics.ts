// Client tracking: typed GA4-style dataLayer
// pushes plus the first-touch UTM session capture. Everything is guarded for
// SSR, never touches the network, and no buyer PII enters the dataLayer. Pure
// parse/merge rules live in shared/attribution.ts (Node-tested).
import {
  UTM_STORAGE_KEY,
  pickTouch,
  readStoredTouch,
  utmFromSearchParams,
  type UtmTouch,
} from "../../../../shared/attribution.ts";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** One captured attribution touch and where it currently lives. */
export type TouchSource = "storage" | "memory" | "none";

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
}

export interface AnalyticsEvent {
  event: string;
  ecommerce?: {
    currency: "IDR";
    value?: number;
    items: AnalyticsItem[];
  };
  utm?: UtmTouch;
  landing_cta?: { destination: string; campaign_key: string };
}

let memoryTouch: UtmTouch | undefined;
let memoryUsable = false;
let captured = false;
let touchSource: TouchSource = "none";

/** Creates the dataLayer once per document, preserving anything already there. */
export function initDataLayer(): void {
  if (typeof window === "undefined") return;
  window.dataLayer ??= [];
}

/** Pushes a GA4-style event object; safe to call before/without init. */
export function pushAnalyticsEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  (window.dataLayer ??= []).push({ ...event });
}

/**
 * Captures the tab's attribution touch once per document (first-touch
 * per tab session): a usable stored touch wins over any parameters; otherwise
 * a valid parameter set is stored. When sessionStorage is denied or broken the
 * touch lives in memory for this document only, which keeps same-page lead or
 * order attribution working without claiming persistence.
 */
export function captureTouch(): void {
  if (captured || typeof window === "undefined") return;
  captured = true;

  const incoming = utmFromSearchParams(
    new URLSearchParams(window.location.search),
  );

  let stored: UtmTouch | undefined;
  let denied = false;
  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    stored = raw === null ? undefined : readStoredTouch(JSON.parse(raw));
  } catch {
    denied = true;
  }

  memoryTouch = pickTouch(stored, incoming.ok ? incoming.utm : undefined);
  memoryUsable = true;

  if (stored === undefined && incoming.ok && incoming.utm && !denied) {
    try {
      window.sessionStorage.setItem(
        UTM_STORAGE_KEY,
        JSON.stringify(incoming.utm),
      );
      touchSource = "storage";
      return;
    } catch {
      denied = true;
    }
  }
  touchSource = denied ? "memory" : memoryTouch ? "storage" : "none";
}

/**
 * The tab's attribution touch, or undefined without a valid touch. Idempotent
 * capture keeps event order independent of the Shell script's scheduling.
 */
export function readTouch(): UtmTouch | undefined {
  if (typeof window === "undefined") return undefined;
  if (!memoryUsable) captureTouch();
  return memoryTouch;
}

/** Where the current touch lives; memory reports the no-storage degradation. */
export function currentTouchSource(): TouchSource {
  if (typeof window === "undefined" || !memoryUsable) return "none";
  return touchSource;
}
