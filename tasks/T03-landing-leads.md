# T03 — Campaign landing and stored leads

## Goal and scope

Render the CMS campaign and implement a safe server-side lead submission flow with marketing-visible persistence. Integrate approved attribution payload fields; full capture/navigation verification is T08.

Requirements: R-004, R-005, R-006, R-007, R-008, R-017, R-018, R-019, R-021, R-022. Dependencies: accepted T02; approved design P-003, lead semantics/security P-006 and payload contract P-008. Approved decisions: D-001–D-005 as applicable. Read Astro, Sanity, design and browser skills relevant to implementation.

## Deliverables and acceptance

- Hero title/subtitle/image/catalog CTA, featured products, testimonials and FAQ render from editable CMS fields/items; section layout may stay in code. Check the approved catalog href here; destination behavior remains explicitly pending T05/T09 if that route is not implemented yet.
- Lead form captures approved name/contact combinations, provides accessible client feedback and authoritative server validation, applies approved spam checks, and stores only accepted data in restricted persistence.
- Marketing can view a successful dummy lead; failure never reports success or discards entered values silently. Pending submit prevents accidental duplicates per approved policy.
- Lead payload accepts bounded approved attribution fields; T08 must subsequently prove capture and retention across navigation. No buyer contact data in analytics.
- Initial HTML has approved campaign SEO/social metadata. Mobile navigation, a visible approved cart href and optimized image behavior meet shared design. Cart destination/count/flow are verified after T06/T09; final Lighthouse score belongs to T09.

## Verification and edge cases

Run configured checks/build; Playwright phone/desktop and keyboard review. Test blank/invalid/long contacts, approved either/both contact policy, whitespace, spam trap, double submit, CMS failure, write failure, missing campaign images/items and success reset behavior. Send malformed direct requests to demonstrate server enforcement. Confirm stored dummy data in Studio and deny unauthenticated reads. Edit/publish campaign content without redeploy; inspect metadata in initial HTML. Check payload attribution interface here; leave end-to-end R-021 open until T08. Baseline mobile performance if meaningful, without claiming final score.

## Manual review and boundaries

- [ ] All required sections visibly editable; correct catalog href checked, with destination verification deferred to T05/T09 where necessary.
- [ ] Real stored test lead and private read boundary shown.
- [ ] Pending/errors/success and phone layout reviewed.
- [ ] Tracking/UTM integration limits accurately reported.

Out of scope: bonus layout editing, real mailing/CRM integration, checkout, independent analytics policy, substantive unapproved design changes.

## Status

Completion: proposed, not started. Verification: not run. Acceptance: pending. Actual time: not measured; update TIME_LOG.md. Commit: none; separate authorization required.
