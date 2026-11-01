# T07 — Validated mock checkout and payment states

## Goal and scope

Implement buyer form/order summary, validated mock order payload and clearly simulated payment success/failure with approved retry/cart behavior.

Requirements: R-004, R-015, R-016, R-017, R-018, R-021, R-023. Dependencies: accepted T06; approved P-007 payment/cart rules and P-008 attribution payload interface. Approved: D-001/D-002/D-004/D-005. Attribution capture is finalized in T08.

## Deliverables and acceptance

- Validated buyer name/email and accurate product/package/quantity/price/subtotal summary; empty/invalid carts cannot submit.
- Revalidate current fixture prices and total shared product quota before mock order creation; stale cart feedback follows approved recovery policy.
- Mock order includes approved item/pricing/currency and bounded attribution fields; no real gateway or payment credentials.
- Pending state prevents duplicate simulation actions. Both success and failure are reproducible, clearly simulated and support approved retry/cart clearing semantics.
- Phone/keyboard form/error/status behavior and global cart navigation work. Buyer PII does not enter dataLayer. Full UTM journey remains pending T08.

## Verification and edge cases

Run configured checks/build and logic tests for order totals, quota rejection and payload construction. Browser-test invalid/blank/long/email inputs, double submit, empty cart, restored stale cart, success, failure, retry, refresh/back and quantity changes before submit. Inspect actual mock payloads and ensure PII is not logged to analytics. Check cart retained/cleared exactly as approved. Verify attribution payload contract here; do not claim end-to-end persistence before T08.

## Manual review and boundaries

- [ ] Success/failure and recovery both demonstrated.
- [ ] Summary/payload match cart and shared-quota validation.
- [ ] Validation/duplicate-submit/phone behavior reviewed.
- [ ] No payment backend or misleading real-payment claim.

Out of scope: live payment, backend orders, receipts/license emails, discounts/vouchers, quota reservations across users.

Initial implementation (2026-11-01, review pending). Owner selections recorded as D-041–D-044 before implementation:

- **Placement (D-041):** a new `/checkout` page (`apps/web/src/pages/checkout.astro`) reached from a cart-page primary button ("Lanjut ke pembayaran" in the cart summary); direct checkout with an empty or broken cart renders an explicit cannot-checkout state with katalog/keranjang links.
- **Buyer validation:** `shared/checkout.ts` `validateBuyer` reuses the approved lead limits (name 1–100 trimmed; valid email ≤254) and requires both name and email; buyer form validation limits and error copy follow the approved lead-form pattern (aria-invalid, role="alert", first-invalid focus).
- **Simulation trigger (D-042):** a clearly labelled radio group ("Hasil simulasi pembayaran", Sukses default / Gagal explicitly chosen) makes both outcomes deterministic.
- **Mock order (D-043):** `buildMockOrder` produces a strictly bounded client-side payload (orderId `KV-DEMO-XXXXXXXX`, createdAt, buyer, item/product/package/unit/qty/unit-price/line-total, itemCount, total, currency "IDR", billing "per tahun", bounded utm per D-020, simulation result + note). No `/api/orders`, no persistence, no Sanity write; a REDACTED console log mirrors the payload for inspection while buyer PII stays out of the console.
- **Checkout-time revalidation (R-015):** the payload build rejects invalid buyer/quote, empty carts, over-quota product totals (mixed packages summed against the current shared fixture quota) and invalid attribution before any payment result can be shown; a rejected build keeps the cart and shows recovery guidance per D-038 wording.
- **Results (D-044):** a visible pending state ("Memproses pembayaran (simulasi)…", disabled submit, 900 ms simulation window) prevents duplicate submissions; failure keeps the cart intact with a distinct order-id alert and retry; success clears the cart and shows a confirmation panel (order id, buyer, item summary, total, simulation disclosure); refresh/back after success renders the empty-cart cannot-checkout state; no quota decrement.
- **Shared notices:** the T06 recovery/restore notice logic moved verbatim to `components/CartNotices.tsx` and is reused by the cart and checkout pages (wording unchanged).
- Owner pre-commit revision (2026-11-01): the owner hand-revised the success panel into a centered "Checkout berhasil" card; the agent then applied three owner-directed changes only — the inline success SVG was replaced by the React twin of the approved `CheckIcon` (`components/icons/CheckIcon.tsx`; `.astro` components cannot be imported into hydrated TSX), the page headers are hidden when the success panel shows (`body[data-checkout-success]` attribute set by the island + one unlayered `global.css` rule; initial server HTML unchanged), and `CheckoutView.tsx` split into `CheckoutView` (212 incl. orchestration), `CheckoutForm` (135), `CheckoutSummary` (64), `CheckoutSuccess` (56), `CheckoutUnavailable` (35) and `CheckIcon.tsx` (29) with unused imports/branches of the owner's revised panel removed and no layout change.
- Owner follow-up (2026-11-01): the conditional `NoticeList` left in the success branch was removed per the owner's success-only view (reported by the owner and queued as AI-failure candidate C-001); notices now render only on the cart and checkout-form states. A seeded browser simulation captured each notice scenario (recovered clamp/drop on cart and checkout form and its persistence next to the failure alert, version-99 and corrupt empty-cart notices) plus success showing no notice; screenshots kept locally under /tmp/kodeva-t07.
- Owner follow-up (2026-11-01): the success panel is vertically centered while `body[data-checkout-success]` is active — the unlayered success-state rule now makes `main` a full-viewport (`min-height: 100svh`) grid with `place-items: center` and neutralized padding-block; no markup change. Computed measurements: section gap above (186px) equals gap below (186px) at 1280×720 with scrollY 0; 320px viewport centers without horizontal overflow.
- Attribution capture remains T08; `utm` is validated and accepted in the payload contract but not captured anywhere on this page yet.

Out of scope: real gateway/payment, backend orders, receipts/license emails, discounts/vouchers, cross-user quota reservation.

## Verification record (2026-11-01)

- `pnpm format:check` clean; `pnpm lint` 0 errors; `pnpm typecheck` 0 errors; `pnpm build` web + studio passed.
- `pnpm test:checkout` 17/17 new Node tests (`shared/checkout.test.ts`): buyer validation (trim, blank/long name, invalid/oversized email, unknown fields, non-string simulation); payload construction accuracy against fixtures (kasir Basic/Pro math Rp11.700.000, itemCount, currency, billing, simulation note, orderId format, createdAt); strictly bounded payload keys; empty-cart/invalid-quote/over-quota/invalid-buyer rejections; mixed-package quota boundary, quota+1 and zero-quota rejections; utm contract (trimmed known keys, empty omission, unknown key/oversized/non-string/shape rejections, utm absent when not passed). Existing suites unchanged: `test:cart` 11, `test:leads` 7, `test:cms` 50, `test:catalog` 8.
- Browser (Playwright, dev server): cart → "Lanjut ke pembayaran" → `/checkout`; summary matches cart (2×Rp1.800.000 = Rp3.600.000); blank submit → role="alert" + name-focused aria-invalid errors; invalid email error; Gagal simulation → distinct failure alert with order id, cart retained in localStorage (checked exact payload), retry resubmits; pending window with disabled submit blocks the double click; quantity change in cart before submit reflected at checkout (+1 Payroll Pro → 14 lisensi, 4×Rp3.300.000, total Rp31.200.000); stale restored cart (kasir 12 + laporan 2 + payroll 3) clamped/dropped per D-038 with visible notices and valid checkout (10×Rp1.800.000 + 3×Rp3.300.000 = Rp27.900.000); direct `/checkout` with empty cart → "Checkout tidak tersedia"; Sukses simulation → confirmation panel with order id/summary/total, storage `{lines:[],version:1}`, header badge cleared; refresh/back after success → empty-cart cannot-checkout state.
- Payload/PII checks: the console inspection line prints the real mock order payload with buyer redacted; `window.dataLayer` remains undefined (nothing pushed, so no buyer PII in analytics — dataLayer wiring itself is T08); no POST/`/api/orders` request ever leaves the page (requests inspected).
- Mobile/keyboard: 320/360/1280 screenshots without horizontal overflow (`scrollWidth == clientWidth`); radio/stepper-style controls ≥44px; Tab/keyboard fill and Enter submit; screen-reader alert/status roles.
- Owner pre-commit changes re-verified (2026-11-01): format/lint/typecheck/build + checkout/cart suites pass; computed-style checks show site header and page header `display:none` only while the success panel renders (attribute removed on reload/other states, headers restored), success icon uses the CheckIcon polyline geometry; failure path and cart retention unchanged.
- Owner-directed success-only notice removal re-verified (2026-11-01): success branch renders `CheckoutSuccess` alone (seeded recovered cart → notice on cart/checkout-form and beside the failure alert, absent on the success panel); version-99 and corrupt storage notices still visible on /cart; format/lint/typecheck/build/checkout suite pass after the change.
- Console clean apart from the known Astro dev-toolbar "Outdated Optimize Dep" 504 artifact; `/checkout` initial HTML keeps `Cache-Control: no-store` and canonical like the cart page. A pre-existing dev server from an earlier session was stopped during cleanup.
- Screenshots retained locally only (/tmp/kodeva-t07), not committed.

## Status

Completion: **accepted by owner on 2026-11-01** ("Oke sudah sesuai" after their manual success-panel revision and the three directed agent changes were verified in browser together). Verification: available checks passed (files Verification record; end-to-end UTM persistence and dataLayer wiring remain T08, Lighthouse/deployment T09). Acceptance: recorded (owner also approved the AI_LOG T07 contribution plus owner-work entries, the active-time confirmation and a separate hash-recording documentation commit). Actual time: TIME_LOG.md S-029–S-031 owner-confirmed approximations (~14m 44s + ~15m + ~10m); S-032 observed minutes-scale window, unquantified and not assumed zero. Commit: 745a6f54c77f9feac482795037b7ffbcfbc3f540 (`feat(checkout): validated checkout with simulated payment states`); hash recorded through a separate owner-authorized documentation commit.
