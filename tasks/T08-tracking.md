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

Completion: proposed, not started. Verification: not run. Acceptance: pending. Actual time: not measured; update TIME_LOG.md. Commit: none; separate authorization required.
