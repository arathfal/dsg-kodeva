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

## Status

Completion: proposed, not started. Verification: not run. Acceptance: pending. Actual time: not measured; update TIME_LOG.md. Commit: none; separate authorization required.
