# T02 — CMS content contracts and public reads

## Goal and scope

Implement approved Sanity content models, marketing editing structure and typed content access, including the chosen publication/freshness policy. Establish product-link and lead-data contracts needed by later tasks; no full landing/blog frontend.

Requirements: R-004, R-005, R-007, R-008, R-010, R-011, R-017. Dependencies: accepted T01; P-004 rendering/cache, P-005 exact schema/contracts, P-006 lead storage/access approvals; authorized Sanity project access. Approved decisions: D-001/D-002/D-004. Load Sanity/content modeling skills; verify version-sensitive behavior with official docs.

## Deliverables and acceptance

- CMS fields cover editable hero/featured products/testimonials/FAQ and article title/unique readable slug/cover/rich text/category/product links/draft-publish. Fixed section layout allowed; no page builder.
- Schema fields, validation, singleton behavior and product-link strategy match explicit approval. Supply approved dummy content with provenance; no invented real customers.
- Typed reads expose published public content only, handle missing/error responses and support future SEO metadata. Draft content/write tokens never reach browser bundles.
- Implement approved server rendering/cache behavior so publishing, new slugs and unpublishing do not require manual deployment; document actual freshness policy.
- Lead storage contract follows approved private-read and editor access policy. Marketing can later inspect records; unauthenticated queries cannot read them. Submission endpoint belongs to T03.

## Verification and edge cases

Run configured lint/typecheck/format/build. In real Studio test field validation, missing images, long text, duplicate slugs, invalid related products, draft/publish/unpublish, and category changes. Read public content before/after publishing without web redeploy and record timing/cache evidence; test draft access by slug and ID. Check anonymous lead reads are denied and intended editor access succeeds. Verify missing config/read failures without logging secrets. Offline/schema-only checks cannot substitute for real CMS checks; keep unavailable checks open.

## Manual review and boundaries

- [ ] Non-technical editor can identify and edit all required fields/items.
- [ ] Publication evidence and draft isolation demonstrated.
- [ ] Lead privacy tested against actual dataset permissions.
- [ ] Product/content contracts approved and documented.

Out of scope: landing/article page layouts, lead endpoint, visual preview, scheduled campaigns, CMS deployment without authorization.

## Status

Completion: proposed, not started. Verification: not run. Human acceptance: pending. Actual time: not measured; see TIME_LOG.md once started. Commit: none; separate authorization required.
