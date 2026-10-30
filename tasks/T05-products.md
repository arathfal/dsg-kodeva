# T05 — Catalog and product detail interactions

## Goal and scope

Build at least six approved dummy products, category filtering and detail/package interaction using the agreed product contract. Define reusable typed price/quota data for cart work.

Requirements: R-004, R-006, R-012, R-013, R-015, R-017, R-018, R-022, R-023. Dependencies: accepted T01 and T02 product contract; approved P-005 source/category data, P-007 fixture/pricing/unit rules, P-003 design. Approved: D-001–D-005 as applicable. No additional data service without approval.

## Deliverables and acceptance

- Catalog displays ≥6 products; category changes filter correctly and show meaningful empty/error/loading states appropriate to approved data access.
- Detail shows feature screenshots, price, original price when promotional, shared promo quota, and Basic/Pro/Business options updating displayed price immediately.
- Typed approved fixtures/contracts identify each product/package, quota, license unit and price consistently; no per-package quota that bypasses shared limits.
- Product-not-found behavior, initial SEO/social metadata, accessible package selection and phone controls work. Check the visible cart href here; cart destination/count/flow remain pending T06/T09. Once T03 exists, verify its catalog CTA reaches this catalog.
- Add-to-cart integration is deliberately deferred to T06; no false success UI. Analytics instrumentation is T08.

## Verification and edge cases

Run configured checks/build and browser catalog/filter/detail flow. Cover all categories, no results, invalid product URL, long names, absent screenshots, nonpromo and zero-quota items, each package price and data-read/mock failure through the approved fixture strategy. Confirm product links from campaign/blog resolve. Inspect initial metadata and minimal island hydration. If price logic branches, use approved small logic checks; do not add a runner without approval.

## Manual review and boundaries

- [ ] Product counts/fixture values match approval.
- [ ] Required detail information and immediate package pricing shown.
- [ ] Empty/error/not-found and phone controls reviewed.
- [ ] Cart/analytics remaining integration explicitly recorded.

Out of scope: cart state, checkout, search, sorting, shareable filter URL, duration switcher, comparison table, backend/payment.

## Status

Completion: proposed, not started. Verification: not run. Acceptance: pending. Actual time: not measured; update TIME_LOG.md. Commit: none; separate authorization required.
