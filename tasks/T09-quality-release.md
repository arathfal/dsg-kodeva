# T09 — Integrated QA, mobile performance and release evidence

## Goal and scope

Verify mandatory journeys together, fix in-scope defects, inspect responsive/accessibility/security behavior, capture real Lighthouse evidence, and prepare/review deployments. Execute deployment/push only after explicit authorization.

Requirements: R-002, R-003, R-004, R-005, R-006, R-011, R-017, R-018, R-019, R-020, R-021, R-022; regression of all R-006–R-016. Dependencies: accepted T03/T04/T08, actual CMS and hosting access; P-009 release/test assumptions and authorization. Approved: D-001–D-005. Use verification, browser, systematic debugging if failures, and Impeccable for final UI critique. Report substantive design findings for approval before changing them.

## Deliverables and acceptance

- Full UTM→landing→lead and UTM→catalog→package→cart→checkout success/failure paths pass with recorded payload/event evidence, including quota/persistence regressions.
- Real CMS edits/publish/new slug/unpublish appear per approved cache policy without manual web redeploy. Drafts and lead records remain private.
- Phone/tablet/desktop and keyboard/zoom/error/empty/loading checks complete; metadata exists in initial HTML and shared links have intended imagery/text.
- Landing Lighthouse mobile Performance ≥80 on the documented production build; retain actual screenshot/report/URL/date/configuration. Failed target remains a disclosed failure until fixed and rerun.
- Hosting configuration/env/demo editor access prepared for review. Authorized web/Studio deployment and URL/access checks performed if authorization arrives; otherwise release evidence stays unverified. Local preparation may continue while authorization is pending.

## Verification and edge cases

Run all configured lint/typecheck/format/unit/build checks once after relevant fixes. Exercise business-logic boundaries, cross-package quota, corrupt/denied storage, invalid contacts, double submit, stale product data, failed payment retry and missing/CMS-failure states. Inspect actual anonymous dataset queries and client assets for exposed credentials/lead data. Compare CMS publish timing/cache headers without deploy. Browser-check 360/768/1280px plus 320px stress. Audit links/HTTP statuses/SEO/draft indexability; measure Lighthouse mobile on the reviewed build, retain genuine artifact. Rerun affected checks for fixes; do not claim a score from a different build without explanation.

## Manual review and boundaries

- [ ] Results and failures linked to requirements and artifacts.
- [ ] Mobile flows, real CMS freshness/privacy and analytics/UTM evidenced.
- [ ] Lighthouse screenshot and ≥80 result genuine or explicitly failed.
- [ ] Deployments executed only with approval; demo access delivered securely.

Out of scope: bonus features, redesign without approval, production marketplace backend, unapproved paid services. Stop for human acceptance; T10 is not automatic.

## Status

Completion: proposed, not started. Verification: not run. Acceptance: pending. Actual time: not measured; include all fixes/verification in TIME_LOG.md. Commit: none; separate authorization required.
