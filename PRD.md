# Kodeva product requirements

Status: planning draft; pending developer review. Source: [ASSESSMENT_BRIEF.md](ASSESSMENT_BRIEF.md), permanently authorized in place of the original assessment PDF. Do not edit the brief. Decisions and proposals live in [DECISIONS.md](DECISIONS.md).

## Objective and users

Kodeva sells subscription business software for UMKM: POS, HR/payroll, and supporting add-ons. The Promo Akhir Tahun campaign must let marketing edit content independently, capture leads with attribution, and let mobile visitors explore and simulate purchasing software. The assessment prioritizes reliable mandatory functionality within approximately 6–8 actual working hours; this is a target, never a fabricated time total.

Users: visitors/readers, prospective buyers, and non-technical marketing editors. No customer account system is required. Editor access must allow the evaluator to try content changes.

Journeys:

1. Social campaign link → landing → catalog → product/package → cart → validated mock checkout → success or failure; retain UTM throughout.
2. Campaign link → navigate between pages → lead form → stored lead visible to marketing, with original approved attribution.
3. Blog listing/pagination → published article → related marketplace product; search engines and shared links receive useful metadata.
4. Marketing edits/publishes landing or article content → public website reflects publication without manual deployment; drafts remain private.

## Mandatory requirement and acceptance matrix

Each row has a stable ID. Every acceptance clause in a row is required unless explicitly labeled a pending interpretation. Tasks list implementation owners; T09 verifies integrated behavior and T10 audits final evidence.

| ID | Source section | Acceptance criteria | Tasks |
| --- | --- | --- | --- |
| R-001 | General instructions; rule 7 | Authored application code uses TypeScript. README explains framework/CMS/library choices and any starter. Follow approved Astro/React Islands, Sanity and pnpm architecture. | T01, T10 |
| R-002 | Rules 1, 3; submission | Track genuine actual work and show it in README. Record received-date/deadline when developer supplies them; submission is due two calendar days after receipt. Deliver a Git repository with visible unsquashed history; private-repository evaluator invitation and exact email recipients/subject follow the brief and T10 checklist. Publishing repository, inviting others and sending submission require separate authorization. | T01, T09, T10 |
| R-003 | Rules 4–5 | Provide working web deploy URL and CMS demo access; README covers local run instructions, architecture/rationale, assumptions, complete/incomplete status, one-week improvements, actual time, future backend proposal, and a mobile landing Lighthouse screenshot. Do not fabricate any evidence. | T09, T10 |
| R-004 | Rule 6 | AI_LOG lists tools/purposes, 2–3 useful prompts, at least two genuine inadequate AI outputs with detection/correction/verification, one AI-heavy implementation with tested edge cases, and a developer-written portion with reasons. If evidence is missing, declare the gap; no invented mistakes or independent work. | T01–T10 |
| R-005 | Rule 8 | Use dummy content/data; no real personal data or live API keys in the repository. Keep operational credentials in environment settings and restricted server contexts. | T01, T02, T03, T09, T10 |
| R-006 | A: landing | Landing contains hero title, subtitle, image, CTA to catalog, featured products, testimonials, and FAQ. CTA destination works on mobile and desktop. T03 establishes the correct catalog link; T05/T09 verify its working destination once catalog exists. | T03, T05, T09 |
| R-007 | A: editable sections | Marketing can edit each landing section's text, images and repeated items through CMS, including featured products, testimonials and FAQ. Fixed layout/section order in code is allowed. | T02, T03 |
| R-008 | A: lead capture | Capture name and email/WhatsApp; validate and apply basic spam protection. Store successful submissions durably and let marketing read them. Display relevant pending, validation, failure, and success feedback. Exact contact interpretation and protection mechanism await P-006. | T02, T03 |
| R-009 | A: blog listing | Published articles appear in a paginated listing with usable navigation; define and handle empty and out-of-range pages. Page size/behavior await P-005. | T04 |
| R-010 | A: article management | CMS manages article title, readable unique slug, cover, rich text, category and draft/published state. Public details render published content safely and can link marketplace products. Draft/nonexistent URLs do not expose drafts. | T02, T04 |
| R-011 | A: publication | Published CMS edits become visible without manual web redeployment. Document and demonstrate the approved caching/revalidation strategy and measured freshness behavior. Unpublishing and newly published slugs follow the same policy. | T02, T04, T09 |
| R-012 | B: catalog | At least six dummy products; category filter updates visible products and provides an empty-result state. Product source and category vocabulary await P-005. | T05 |
| R-013 | B: details | Product details show feature screenshots, current price, struck original price when promotional, remaining license quota, and Basic/Pro/Business selection that immediately updates price. Missing products have a useful not-found state. | T05 |
| R-014 | B: cart | Add, change license quantity (users/outlets), remove; automatic line/subtotal calculation; persisted contents survive refresh. Hydration does not lose data or show incorrect actionable quantities. Pricing/unit policy awaits P-007. | T06 |
| R-015 | B: shared promo quota | Reject quantities above remaining promotional quota. All package variants of the same product share its limit across the whole cart; demonstrate boundary, cross-package, and repeated-add cases. Revalidate restored carts and checkout against approved product rules. | T05, T06, T07 |
| R-016 | B: checkout | Require validated buyer name/email, display accurate order summary and simulate both payment success and failure. No payment integration. Retry/cart handling awaits P-007. | T07 |
| R-017 | B: states | Cover relevant loading, error and empty states, including empty cart, missing product, and product data/mock API failure. No invented network delay is required if using a file; show failures through an approved test fixture or data abstraction. | T02–T07, T09 |
| R-018 | B: mobile | Comfortable phone interaction, easy-to-tap controls, and cart access from every public page. Forms, menus, filters, package/quantity controls, and checkout work without horizontal page overflow. | T01, T03–T07, T09 |
| R-019 | C: performance | Landing Lighthouse mobile Performance score ≥80. Record tested URL, build, date, configuration and actual screenshot; optimize based on measured results. | T03, T09, T10 |
| R-020 | C: tracking | Push GA4-style dataLayer events for view_item, add_to_cart, begin_checkout, and landing CTA clicks, with relevant product/campaign data. Real corresponding actions trigger them; ordinary rerenders do not duplicate them. No real GA account required. Event naming/trigger details await P-008. | T08, T09 |
| R-021 | C: attribution | Capture UTM from social links; preserve across navigation before lead or checkout; include it in stored lead and mock order payloads. Lifetime, touch policy, missing/partial parameters and storage failure behavior await P-008. | T03, T07, T08, T09 |
| R-022 | Scenario: Google/WhatsApp | Public landing, article, and product pages provide meaningful SEO and social-sharing metadata in initial HTML, including readable titles/descriptions and sharing imagery; verify actual metadata and indexability. Metadata defaults/fields await P-005/P-009. | T01, T03, T04, T05, T09 |
| R-023 | B: frontend boundary | Marketplace uses dummy file/mock API data or approved CMS reads, persistent frontend cart, mock orders and simulated payment. Do not create a marketplace backend, database or live payment flow. Lead persistence is a separate explicit A requirement. | T05–T07, T10 |
| R-024 | Rule 5: backend plan | README proposes needed endpoints, authoritative price/quota checks, secure payment initialization, webhook verification/order state updates, quota consistency, and post-payment license delivery. Proposal only, with clear frontend-demo limitations. | T10 |

## Approved constraints and quality expectations

Architecture is approved in D-001; implementation choices are bounded by pending decisions. Astro renders content/metadata; React hydrates only interactive islands. Zustand persistence is approved for cart. Web deploys to Vercel; Studio is Sanity-hosted. Use pnpm, Tailwind ≥4, linting, and Prettier with Tailwind sorting (D-003); specific packages/versions await approval.

Security implementation expectations from AGENTS.md: server-side lead validation, no client write credential, safe rich-text rendering, draft isolation, and bounded untrusted inputs. Specific credential scopes, lead access policy and spam mechanism await P-006. Public read access versus server-only access must follow approved dataset policy, not an accidental default.

Accessibility and quality checks from project instructions: semantic HTML, keyboard-operable controls, labels, visible focus, readable contrast, announced relevant errors, responsive content and reduced-motion consideration. Exact token sizes and treatments are proposed in DESIGN.md. These are project expectations supporting R-018, not invented assessment scoring criteria.

## Business rules and unresolved interpretations

- Quota is shared per product across Basic/Pro/Business lines. Each package's price is used for its own quantity; exact price/discount tables, currency, subscription period, unit labels, promo exhaustion behavior, tax and rounding policy require P-007.
- Cart line identity, persistence version/recovery, stale data handling, successful-checkout clearing, failed-checkout retry, and whether quota changes during a local simulation require P-007. Do not imply cross-user stock guarantees.
- A says email/WhatsApp without specifying either/both; P-006 must settle accepted combinations and validation before lead implementation.
- The international expansion message is context. Locale/currency architecture and translated content are unresolved (P-009); a multi-country launch is not an explicit required feature.
- Data source, references from articles/featured products to commerce, publication timing, pagination and slug rules require P-004/P-005. Future schema proposals cannot become approved through this document.
- View versus action deduplication and cross-navigation UTM contracts require P-008. T03/T07 own endpoints/payload integration; their attribution acceptance remains pending until T08 integration is verified.

## Optional scope

Only after mandatory requirements are verified and explicitly authorized: CMS layout/reordering/visibility; catalog search, sorting and shareable URL filters; billing-duration choices and feature comparison table; scheduled promos; vouchers; draft previews. Automated business-logic tests are listed as a bonus in the brief but are required by this project's verification instructions for important pricing/cart/quota/attribution logic; this does not authorize bonus product features.

## Dependencies and evidence

Developer approvals in DECISIONS.md, Sanity project/dataset access, dummy assets and fixture values, hosting access, assessment receipt time/deadline, and an honestly developer-written portion are outstanding. Approval to implement, acceptance of each task, permission to commit, and permission to deploy/push are separate. The coverage matrix plus per-task acceptance criteria is the review baseline; passing a build alone never satisfies it.
