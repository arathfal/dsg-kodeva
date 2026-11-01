# T08 — Attribution and GA4-style action events

## Goal and scope

Implement approved UTM capture/persistence and dataLayer event contracts, wiring the existing landing, product, cart, lead and checkout journeys without render-induced duplication.

Requirements: R-004, R-020, R-021. Dependencies: accepted T03/T04/T07 (including T05/T06 commerce); explicit P-008 touch/lifetime/storage/event/payload approvals. Approved: D-001/D-002/D-004. No real analytics account needed.

## Deliverables and acceptance

- Capture approved UTM keys and preserve according to approved lifetime/touch rules across navigation, refreshing and relevant storage boundaries.
- Include attribution in actual stored lead and mock order payload; pages without parameters do not silently erase a valid touch. Handle invalid/oversized values and unavailable storage per policy.
- Emit view_item, add_to_cart, begin_checkout and approved landing CTA event on the corresponding real action, including relevant product/package/quantity/currency/value/campaign data.
- Rerenders do not duplicate events. Rejected cart mutations do not report a successful add. View/back/refresh semantics match explicit contract rather than accidental effect behavior.
- Initialize dataLayer safely and exclude buyer PII/secrets. Keep SSR safe and minimize client script footprint.

## Verification and important edge cases

Run unit tests for UTM parse/merge/persistence/expiry if applicable and storage failures. Execute browser journey from a realistic social UTM link through intermediate blog/catalog pages to lead submission; inspect stored record. Repeat through package/cart/checkout and inspect mock payload. Record actual dataLayer contents/counts for each action, repeated render, repeated real click, navigation/back/refresh, failed cart mutation, empty checkout and failed payment. Test direct visit/no UTM, partial UTM, a second campaign, denied storage and long/untrusted parameter values under approved policy. Run configured checks/build and mobile regression.

## Manual review and boundaries

- [ ] Lead and order both retain attribution after navigation.
- [ ] All four event types have relevant fields and correct counts.
- [ ] Render deduplication and genuine repeated actions distinguished.
- [ ] PII excluded and denied-storage behavior disclosed.

Out of scope: live GA integration, consent platform, ad pixels, attribution models/lifetimes not approved.

## Status

Completion: accepted by the owner ("Oke saat ini saya approve, bisa di commit", 2026-11-01). Verification: passed (2026-11-01, details below). Acceptance: recorded. Actual time: TIME_LOG.md S-033 — observed stamped window ≈ 5m 17s; earlier reading/approval tails untimed and not owner-confirmed with a figure. Commit: authorized and executed as `f73af5e` (feat(tracking); Conventional Commit with body).

### Verification evidence (2026-11-01)

Approvals used: D-020 (payload), D-045 (first-touch per tab, sessionStorage, in-memory fallback), D-046 (first set wins; unknown `utm_*` keys ignored at capture), D-047 (page-load event semantics, `landing_cta_click` naming).

Implementation: `shared/attribution.ts` (pure parse/normalize/pick, 8 Node tests in `test:attribution`), `apps/web/src/lib/analytics.ts` (SSR-safe dataLayer init/push + touch capture with denied-storage fallback), Shell init/capture script on every page, `view_item` page script + JSON payload on product detail, `landing_cta_click` listener on the landing CTA, `add_to_cart` on accepted adds only (PackageSelector), `begin_checkout` once per valid nonempty checkout load (CheckoutView), `utm` in lead POST (LeadForm) and mock order (`readTouch()` into `buildMockOrder`).

Checks: format/lint/typecheck clean; `test:attribution` 8/8, `test:checkout` 17/17, `test:cart` 11/11, `test:leads` 7/7, `test:cms` 58/58 (includes shared suites), `test:catalog` 8/8; both production builds pass; analytics client chunk ≈1.1 KB + 158-byte product page script; no new dependency.

Browser journey (Playwright, dev server): social UTM link → landing → blog → article → product → cart → checkout; touch persisted in `sessionStorage` across all navigation; stored lead verified through the Sanity API with full utm after the multi-page journey; failure and success mock order payloads both carried utm (redacted console line; Node tests pin the contract). Recorded dataLayer contents/counts: `view_item` once per product page load, repeated on reload (approved), not re-fired by rerenders or the island; two genuine CTA clicks → exactly two `landing_cta_click` events; two accepted adds → two `add_to_cart` events; rejected add (quota-full disabled control) emitted nothing; `begin_checkout` once per checkout load, unchanged through failed payment, retry and success; refresh after success → empty-cart checkout, no event; back/forward loads are fresh documents (bfcache restore never re-runs the module script; this environment restored no bfcache pages). Direct visit → no touch, lead body without utm key; partial `utm_source` stored as-is; second campaign never overwrites; oversized known value rejects the whole set and never erases a stored touch; unknown `utm_id` ignored while known keys still capture; `<script>`-style values stored only as JSON data, never rendered. Denied sessionStorage: same-page CTA/lead attribution worked from the memory fallback (captured POST body), navigation honestly dropped the touch (later events without utm key). Mobile 360/320: no horizontal overflow on landing/catalog/cart/product, journey and events intact, screenshots kept local in `evidence/T08/` (excluded via `.git/info/exclude`); buyer PII asserted absent from dataLayer.

Notes and observations: quota-full adds are prevented by the disabled control (T06 UX), so the rejected-add code path is defensive; the event contract still only pushes on `result.ok`. Pre-existing (T06/T07 scope, not changed): `PackageSelector` renders two elements with the same `priceId` id (duplicate id in the DOM); the known dev-toolbar 504 console error appears only in dev. Test lead records created during verification were deleted and zero remaining records were confirmed through the API.
