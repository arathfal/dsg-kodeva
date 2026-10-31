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

- [x] Product counts/fixture values match approval (D-033; exact values asserted in `shared/catalog.test.ts`).
- [x] Required detail information and immediate package pricing shown (screenshots, price, struck original price, shared promo quota, Basic/Pro/Business updating price immediately; browser-verified).
- [x] Empty/error/not-found and phone controls reviewed (Tambahan empty state reachable by browsing; unknown category/product 404; fixture-failure 503 states; 360px and 320px widths without overflow; radio keyboard arrows update price).
- [x] Cart/analytics remaining integration explicitly recorded (cart href `/cart` verified on catalog header; `/cart` destination/count/flow pending T06/T09; view_item/add_to_cart pending T06/T08; no add-to-cart control per D-036).

## Verification record (2026-11-01)

- `pnpm format:check` clean; `pnpm lint` 0 errors; `pnpm typecheck` 0 errors; production build (web + studio) passed.
- `pnpm test:catalog` 8/8 Node tests assert the approved D-033 fixture values, shared-quota-only shape (no per-package quota field), category filter results incl. empty Tambahan, not-found identifiers, strict offer validation, and invalid-variant failures through the approved data abstraction.
- Existing suites still pass: `test:cms` 22/22, `test:leads` 7/7.
- Browser (Playwright, dev server): catalog 360/320px and detail pages for all six products have no horizontal overflow; filter chips are plain links with `aria-current`; Tambahan shows the empty state; unknown `?kategori=hacker` returns HTTP 404 with a useful page; `/products/kasir-tidak-ada` returns 404; unknown and malformed product ids resolve to not-found without stack traces.
- Detail: exactly one hydrated island (`PackageSelector`); price updates immediately on click (Basic → Business → Rp3.900.000) and via arrow-key radio movement (→ Pro → Rp2.700.000); `aria-live` price region; radio labels expose package name, struck promo price and price to assistive tech; initial server HTML already contains the checked Basic radio and price; quota line shows shared quota ("Sisa kuota promo: 15 lisensi") or "Kuota promo habis" for laporan; non-promo products (inventori, payroll, laporan) render no struck prices.
- Initial metadata: title, description, canonical and `og:image` (absolute URL to the first screenshot) present in initial HTML for detail and catalog pages; SVG assets serve 200.
- Journeys: landing CTA "Lihat katalog" navigates to `/products` (T03 catalog CTA verified); campaign featured cards and blog related-product links (`/products/kasir`, `/products/inventori`, `/products/hr`, `/products/payroll`) resolve; catalog and landing initial HTML include cart href `/cart` (destination still 404 until T06).
- Loading state: not applicable to the approved fixture strategy (request-time server rendering of static typed data, no client fetch); the data-read failure path renders the 503 error state and is verified at accessor level through the approved Node tests rather than injected browser failures.
- Screenshots and full logging retained locally only (temp directory), not committed.

## Status

Completion: **accepted by owner on 2026-11-01**. Explicit response: “Saya terima T05”, together with approval of the AI_LOG contribution text, owner confirmation of the S-024 duration (~19m 58s) and commit authorization in one interactive Q&A round. Verification: available checks passed (see Verification record); browser-based verification used the dev server and the production build passed separately. Commit: authorized in the same round; see reference below. Out-of-scope items remain cart state, checkout, search, sorting, shareable filter URL, duration switcher, comparison table, backend/payment. Add-to-cart and cart count deliberately deferred to T06; view_item/add_to_cart instrumentation to T08; final Lighthouse to T09/T10. The dev-server screenshot helper pill in captured screenshots is the Astro dev toolbar, not part of the product.
