# T04 — Blog listing, articles and publication

## Goal and scope

Build paginated published-article listing and readable-slug details with rich text, product links and public metadata, using accepted CMS contracts/freshness behavior.

Requirements: R-004, R-009, R-010, R-011, R-017, R-018, R-022. Dependencies: accepted T02; approved pagination/slug/product/metadata policy P-005, freshness P-004 and design P-003. Product IDs follow T02 contract; final cross-links checked after T05. Approved: D-001/D-002/D-004/D-005.

## Deliverables and acceptance

- Listing paginates published content with accessible next/previous navigation and approved page size/unknown-page behavior.
- Detail renders title, cover, category and semantic safe rich text at readable slug; articles can link approved marketplace products.
- Draft/unpublished/unknown articles never expose private content. Empty lists, missing media, CMS failures and missing records have appropriate distinct states.
- Initial HTML provides useful article title/description/sharing image and approved canonical/indexability behavior. Phone layout and visible sitewide cart href are checked here; the cart destination/count/flow are verified after T06/T09.
- Prove updates/new articles/unpublish behavior without manual web redeploy; document measured staleness within the approved policy.

## Verification and edge cases

Run configured checks/build. Test real CMS draft→publish→edit→unpublish; refresh public article/list without deploy and record observations. Test first/last/out-of-range/malformed pagination, zero articles, long slugs/titles, duplicate-slug validation, broken related IDs, rich-text lists/links/headings and missing cover. Inspect initial HTML metadata and HTTP status behavior. Browser phone/keyboard review and cross-link regression after T05.

## Manual review and boundaries

- [ ] Editor can author/publish required fields and rich text.
- [ ] Pagination and readable URLs behave as approved.
- [ ] Draft privacy, publication timing and metadata evidenced.
- [ ] Article/product navigation and phone readability reviewed.

Out of scope: search, translations, draft previews, scheduled publication, new page builder/schema decisions.

## Status

Completion: proposed, not started. Verification: not run. Acceptance: pending. Actual time: not measured; update TIME_LOG.md. Commit: none; separate authorization required.
