# T06 — Persistent cart, pricing and shared quota

## Goal and scope

Implement Zustand persistence and complete add/update/remove/subtotal flows with the shared product quota enforced across packages at every mutation and restore boundary.

Requirements: R-004, R-014, R-015, R-017, R-018, R-023. Dependencies: accepted T05; approved P-007 line identity/pricing/limits/restore rules and P-009 test runner. Approved: D-001/D-002/D-004/D-005. No cross-user quota or payment guarantees.

## Deliverables and acceptance

- Product selections add to correct product/package lines; repeated adds and quantity changes follow approved identity rules. Remove and subtotal update correctly.
- Sum quantities for all packages sharing a product's quota. Reject invalid/out-of-limit changes without losing valid cart state; different products retain independent quotas.
- Positive integer license quantities and approved currency math; totals recompute from current demo data rather than trusting persisted amounts.
- Refresh preserves valid contents. Missing/corrupt/stale storage, hydration and approved schema migration/recovery have visible appropriate behavior.
- Phone cart, empty state, accessible quantity controls and global cart link/count work. Loading restore never silently overwrites existing state.

## Verification and important edge cases

Run unit tests for exact quota boundary, boundary+1, Basic+Pro shared total, repeated adds, changing a line while other variants exist, removing a line, zero/negative/fractional/nonfinite/oversized quantities, multiple products, and money/subtotal correctness. Test forged persisted totals, unknown product/package, changed price/quota and corrupt/versioned storage per approved policy. Run configured checks/build; browser add→change→refresh→remove, direct navigation, empty state, phone/keyboard and denied storage. Report cross-tab limitations rather than inventing guarantees.

## Manual review and boundaries

- [x] Cross-package quota test demonstrated at limit and over limit (`pnpm test:cart` 11/11; browser: Basic 6 + Pro 4 fills kasir quota 10, further +/typed increases rejected with per-line messages, Pro stepper disabled at the boundary).
- [x] Persistence/hydration and stale-data outcomes evidenced (refresh restores 3×Basic incl. computed totals; forged `total`/price fields ignored, subtotal recomputed Rp18.000.000 from fixtures; over-quota persisted line clamped to 10 with a recovery notice; unknown product dropped; corrupt JSON → empty cart + storage notice; `version:99` → empty cart + notice and storage rewritten to version 1; blocked localStorage → session-only cart with notice, still addable, reloaded cart is empty).
- [x] Pricing/subtotal and mobile controls reviewed (integer rupiah math asserted in tests and browser: 2×Rp1.800.000 = Rp3.600.000, cross-package Rp37.300.000 case in tests; 320/360px no horizontal overflow with 44px steppers).
- [x] Errors preserve valid state; no stored total trusted (rejected over-quota/invalid quantities leave the cart unchanged; input draft snaps back with `aria-invalid` + `role="alert"`; quoted amounts always come from `quoteCart`, never storage).

## Verification record (2026-11-01)

- **Owner UI acceptance and manual revision (S-026/S-027):** the owner accepted the refined cart direction ("Oke done") and hand-revised `CartView.tsx` because the agent's layout was not exactly right. The owner's revision became the final layout: item list panel ("Ringkasan keranjang", package chip + unit line, compact unit-price/subtotal columns, integrated − / typed-input / + stepper with hidden spin buttons, quota/removal footer row) plus a sticky "Subtotal" aside with per-item counts and the recomputed total, stacking on small screens, and line-quantity logic factored into a `useQuantityEditor` hook. Agent task afterwards: split that file without any layout change. The row view (hook + `CartRow`) moved verbatim to `apps/web/src/components/CartRow.tsx` (252 lines) leaving `CartView.tsx` at 183/435 lines; moved blocks were diff-verified identical and rendering is unchanged.
- `pnpm format:check` clean; `pnpm lint` 0 errors; `pnpm typecheck` 0 errors (astro check);
  `pnpm build` web + studio passed.
- `pnpm test:cart` 11/11 new Node tests (`shared/cart.test.ts`): repeated adds on one product+package identity; unknown product/package; exact boundary (Basic 6 + Pro 4 = quota 10), boundary+1 rejection with per-line `maxAllowed`; changing a line while another variant exists; independent quotas across products incl. zero-quota laporan; zero/negative/fractional/NaN/±Infinity/oversized (>9999, >MAX_SAFE_INTEGER) rejected both at mutation and recovery; change/remove/re-add; integer-rupiah subtotal exactness (Rp37.300.000 case); forged persisted totals/price fields ignored with amounts recomputed from fixtures; recovery dropping unknown identities/corrupt entries; quota clamping and duplicate-line merging on restore; version/key policy including legacy-version empty restore. Existing suites still pass: `test:catalog` 8/8, `test:leads` 7/7, `test:cms` 33/33.
- Browser (Playwright, dev server): /cart direct navigation shows restoring state clearly ("Memuat keranjang…" only until the island hydrates, then empty state); add→change(+, typed Enter)→refresh(3×Basic restored incl. totals)→remove(Pro line removed, Basic kept; last line removal → empty state and empty storage `{lines:[],version:1}`); header badge appears only after hydration and clears at 0; add-to-cart on detail adds 1 license of the selected package with a success line and "Lihat keranjang" link; disabled add button on quota-full kasir (10/10 restored) and zero-quota laporan; recovery/forged/corrupt/version/denied-storage scenarios above all visible in the UI.
- Mobile/keyboard: 320px and 360px cart and detail without horizontal overflow; stepper buttons 44×44px; typed-quantity edit + Enter via keyboard updates line and subtotal; screen-reader labels for steppers/input/removal; `role="status"` restore notices and `role="alert"` rejections.
- Cross-tab limitation (documented, no guarantees): a second tab opened after a change shows the previous state until reload, because the persisted store is re-read at island mount and no storage-event sync is implemented.
- Console clean apart from an Astro dev-toolbar "Outdated Optimize Dep" 504 artifact of the running dev server; initial `/cart` HTML server-renders the loading state and `Cache-Control: no-store` still applies from middleware.
- Screenshots retained locally only (/tmp), not committed.

Out of scope: checkout/payment, global reservations, vouchers, taxes/currencies not approved, production backend.

## Status

Completion: **accepted by owner on 2026-11-01**. The owner approved the refined cart direction and authorized the commit in the same message ("Oke done … setelah itu kamu boleh commit"), delivering their own manual `CartView.tsx` layout revision that becomes the final UI; the agent's follow-up task was splitting that file without any layout change (done, S-027). Verification: available checks passed (see Verification record; behavior preserved by the owner's own `useQuantityEditor` logic and `test:cart`). Acceptance: recorded (the approved owner "Boleh" 2026-11-01 also approved recording the hash and the AI_LOG T06 paragraph plus the owner-confirmed work entry). Actual time: see TIME_LOG.md S-025–S-027; observed windows, tails and S-025 confirmation untimed. Commit: c647c42ad654e934fb702f3e5a88f4aa24ba9fe2 (`feat(cart): persistent validated cart with shared promo quota`); hash recorded through a separate owner-approved documentation commit. Out-of-scope items remain checkout/payment (T07), analytics (T08), Lighthouse/deployment (T09), backend. Cross-tab sync is a documented limitation, not a guarantee.
