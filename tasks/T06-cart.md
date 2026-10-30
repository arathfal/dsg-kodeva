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

- [ ] Cross-package quota test demonstrated at limit and over limit.
- [ ] Persistence/hydration and stale-data outcomes evidenced.
- [ ] Pricing/subtotal and mobile controls reviewed.
- [ ] Errors preserve valid state; no stored total trusted.

Out of scope: checkout/payment, global reservations, vouchers, taxes/currencies not approved, production backend.

## Status

Completion: proposed, not started. Verification: not run. Acceptance: pending. Actual time: not measured; update TIME_LOG.md including debugging. Commit: none; separate authorization required.
