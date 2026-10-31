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

Verification evidence from the implementation pass: verification panel passed (format check, ESLint, Astro check 0 errors, 14 CMS/contract tests, both production builds). In-scope owner corrections implemented: D-031 (consistent card heights with ellipsized truncation) and D-032 (always-rendered pagination controls with disabled state and centered indicator, hover excluded for disabled controls after owner report). Live QA evidence (D-029 temporary records, later all deleted and zero leftovers verified): first/last pages with 6-per-page splits (9→8→7 records), page indicator and next/previous URLs, out-of-range/malformed/decimal/zero-padded/page-1 segment all 404, empty-page-1 contract preserved, publish→refresh without redeploy (edited title visible on the next request), unpublish → slug 404 with immediate listing change, changed slug → old URL 404/new URL 200, draft-only slugs never public, and no-store headers on blog routes. Initial HTML: title, description, canonical, `og:type article` and rasterized CDN sharing image verified per route. Rich text rendered with numbered/bulleted lists, headings and strong/em/safe-link marks; related products link to `/products/[id]` per existing contract. Phone (360) checks: no horizontal overflow; desktop cards measured uniformly 442px; keyboard focus visible with underline on clamped titles. Blog composition approved through interactive Q&A (D-026–D-030).

Completion: **accepted by owner on 2026-11-01**. The owner responded “Secara pengerjaan saya sudah cek secara paralel dan saya sudah approve hasilnya” after reviewing the delivered blog routes, corrections and live CMS behavior in parallel; the owner simultaneously directed that `AI_FAILURE_CANDIDATES.md` is only for owner-found failures, so the agent-detected T04 observations were removed from that queue. Technical checks remain documented above; deployed Vercel/Lighthouse behavior stays T09 and product destination content stays T05. Owner acceptance of the technical results is separate from any future AI_LOG entry, which still requires explicit owner approval of proposed text.

- [ ] Editor can author/publish required fields and rich text. *(owner parallel review reported approved; detailed checklist comment pending)*
- [x] Pagination and readable URLs behave as approved.
- [x] Draft privacy, publication timing and metadata evidenced.
- [x] Article/product navigation and phone readability reviewed.

Actual time: TIME_LOG.md S-023 (observed 27m 53s window; final acceptance/documentation tail not separately timed; owner confirmation of the active total remains open). Commit: recorded below after the authorized commit; separate authorization was given with acceptance (“Paralel kamu bisa commit”).
