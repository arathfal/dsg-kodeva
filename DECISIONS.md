# Decision register

Status recorded from developer instructions on 2026-10-30. A proposal is not authorization. Do not infer approval from documentation review, a skill, or an ordinary default. Record the developer's explicit response and context before implementing any pending option.

## Approved decisions

| ID | Context and options considered | Approved decision and rationale | Authorization evidence | Tasks |
| --- | --- | --- | --- | --- |
| D-001 | Assessment architecture; alternative stacks were not evaluated in this session. | pnpm workspaces; apps/web: Astro, @astrojs/react, TypeScript, Tailwind, Zustand persistence; apps/studio: Sanity Studio/Content Lake; Vercel web and Sanity-hosted Studio. Content rendered with Astro, interactive islands with React. No orchestration layer or marketplace backend/payments. Fits previously approved scope. | Attached planning brief's “Previously approved architecture” and AGENTS.md. No new stack approval inferred. | T01–T10 |
| D-002 | Earlier attachment demanded the original PDF; a Markdown transcript already exists. Options: obtain PDF or use existing brief. | Use ASSESSMENT_BRIEF.md permanently as authoritative requirements. Future agents must not require or search for the PDF; do not edit the brief. | Explicit user: “Use ASSESSMENT_BRIEF.md and change instructions permanently to check ASSESSMENT_BRIEF.md instead of PDF”. | Planning, T01–T10 |
| D-003 | Package management and code quality tooling. Exact linter/plugins/versions not selected yet. | Use pnpm, latest compatible Tailwind with minimum v4, a linter, and Prettier with Tailwind class sorting. | Explicit user tooling request. Package-specific proposal is P-002. | T01 |
| D-004 | Git and task execution lifecycle. | Initialize Git and add .gitignore (performed). Implement one assigned task; verify, stop for human acceptance, confirm actual time, reconcile documentation, then request separate commit permission. Never auto-commit/push/merge/deploy/squash. | Explicit Git setup request and attached workflow/AGENTS.md. | Planning, T01–T10 |
| D-005 | Visual direction; exact reference tokens were present but no token approval evidence supplied. | Stripe-inspired modern SaaS adapted to Kodeva. Exact colors, type, spacing, component treatments remain proposals. Use DESIGN.md as the single design specification, linking the external Stripe source without a duplicate local reference. | Approved direction in attachment/AGENTS.md; owner subsequently requested deletion of the duplicate local reference. | T01, T03–T07, T09 |
| D-006 | AI_LOG previously included planning/tooling errors and checks before owner verification. Options: immediate AI-authored entries or incremental owner-verified entries. | Use incremental owner-verified logging: tools and explicitly approved prompt references now; task contributions/results only after owner verification/acceptance; failed work when identified/reported by owner, with recovery evidence after owner verifies the fix. Link the approved long initial prompt from prompts/MASTER_PROMPT.md rather than duplicating it. | Explicit owner correction: “AI_LOG ini di isi bertahap, hanya jika saya berhasil memverifikasi”; “ketika saya (owner) berhasil menemukan failed work maka catat”; approval to include the initial prompt by file reference. | Planning, T01–T10 |
| D-007 | P-001: ten reviewable tasks versus eight combined tasks. | Approve option A, the ten tasks in TASKS.md; T01 is explicitly assigned. | Owner: “Approve all, next use interactive QnA”, responding to the three-option approval request. Future decision questions use interactive Q&A. | T01–T10 |
| D-008 | P-002: ESLint flat config + Prettier with a newer project runtime versus older tooling on installed Node. | Approve option A: Node 24.22.2, pnpm 10.13.1, Astro 7.4.4, React 19.3.1, Tailwind 4.3.3, Sanity 6.21.0, TypeScript 6.0.3; the proposed Astro/TS/React Hooks lint and Astro/Tailwind formatter plugins. Pin compatible dependencies; defer a business-logic test runner. Use an isolated temporary Node runtime for agent verification without replacing installed Node. | Owner: “Approve all, next use interactive QnA”, in response to P-002 A with concrete core versions. Package pins are recorded below. | T01 |
| D-009 | P-003: system fonts versus a self-hosted display font. | Approve option A: all tokens and shared component treatments in DESIGN.md, system typography, responsive gutters and control states. No marketing layout or product features in T01. | Owner: “Approve all, next use interactive QnA”, in response to P-003 A. Browser evidence and human task acceptance remain separate. | T01, T03–T07, T09 |
| D-010 | Tailwind formatter 0.8.1 silently fails to sort Astro formatter v1 ASTs. Options: downgrade the Astro formatter to 0.14.1 or retain 1.1.2 with the reviewed upstream patch. | Keep Astro formatter 1.1.2 and apply upstream Tailwind PR #473 via a versioned pnpm patch to 0.8.1. Verify static/dynamic Astro classes, TSX and stable repeated formatting. Remove after a verified published upstream fix. | Owner interactive answer: “Keep Astro formatter 1.1.2 and apply the reviewed upstream Tailwind patch.” | T01 |
| D-011 | Owner questioned why 24.22.2 was enforced when the Astro ESLint plugin supports Node 24 from 24.16.0. Options: allow compatible Node 24 versions or enforce the exact tested patch. | Set package.json engines to >=24.16.0 <25; keep .nvmrc at tested 24.22.2. Supersedes the exact Node requirement in D-008. Owner installed Node 24.22.2 through existing nvm; remaining verification uses it. | Owner interactive answer: “Allow compatible Node 24 versions; keep the tested .nvmrc pin (Recommended).” | T01 |
| D-012 | Agent prepared a routine technical report and four screenshots for a future T01 commit and linked them from project documents. Owner rejected archiving these artifacts. | Keep routine verification artifacts local and ignored; remove repository links to them. Report checks in the review handoff and retain concise task verification status. Record owner-reported AI failures in AI_LOG; add correction/recovery evidence only after owner verifies the fix. Required final Lighthouse submission evidence remains governed by the assessment brief. | Owner: “We don't need to record the evidence. We only need record the verification that AI failed and I verified it”. | T01–T10 |
| D-013 | Agent added the owner's archive-policy finding to AI_LOG without separately asking. Owner instructed its removal and required prior approval for future additions. | Remove that entry. Ask for explicit approval of proposed text before every AI_LOG addition or expansion, including tool/prompt/failure/result entries. Owner reporting or verification alone is not authorization. This additional gate supersedes automatic logging language in D-006/D-012 and applies to task/document update instructions. | Owner: “No, don't recorded in AI_LOG.md. Next ask me before add in AI_LOG.md”. | T01–T10 |
| D-014 | Owner specified the Git message format before T01 commit authorization. | Use a Conventional Commits title and a nonempty body. Format approval does not replace the separate permission to commit. | Owner: “Commit must be conventional and”, completed by “and add body wkwk”. | T01–T10 |

### D-008 — Concrete tooling pins

Core/runtime pins are in D-008 above. Supporting packages: @astrojs/react 7.1.2, @astrojs/check 0.9.12, @tailwindcss/vite 4.3.3, react-dom 19.3.1, styled-components 6.6.0 (Studio peer), @types/node 24.19.2, @types/react and @types/react-dom 19.3.0; eslint 10.14.0, @eslint/js 10.0.1, typescript-eslint 8.72.1, eslint-plugin-astro 3.2.1, eslint-plugin-react-hooks 7.1.1, eslint-config-prettier 10.1.8; prettier 3.9.10, prettier-plugin-astro 1.1.2, prettier-plugin-tailwindcss 0.8.1. The TypeScript 6 pin follows the checkers' supported peer ranges. Registry metadata checks preceded installation; install/build results are separate evidence.

## Pending proposals

P-001 through P-003 have been approved as recorded above. All remaining proposals have status **pending explicit approval**. Recommendations describe proposed behavior only. Ask for the decisions needed by the next assigned task; unrelated future choices can remain pending.

### P-001 — Approved

Option A explicitly approved; see D-007. This is no longer a pending proposal.

### P-002 — Approved

Option A explicitly approved; see D-008. This is no longer a pending proposal.

### P-003 — Approved

Option A explicitly approved; see D-009. This is no longer a pending proposal.

### P-004 — Public rendering and CMS freshness (before T02)

Options: (A) request-time public CMS reads without application response caching (simple, immediate-on-next-request goal but adds CMS latency/dependency), or (B) explicit bounded caching/revalidation (faster repeated reads, stale window and extra configuration). Recommend A at this scale, server-rendering relevant routes on Vercel with published-only reads and CDN/cache policy explicitly configured and measured. Sanity CDN choice, response headers, error behavior, measured publication delay and unpublish handling must be recorded; do not promise immediate freshness without evidence. Static generation requiring manual deployment is ineligible. Related: T02, T03, T04, T09.

### P-005 — Content and product contracts (before T02)

Options: (A) Sanity campaign/article/category content with product references to a six-or-more-product TypeScript fixture source, or (B) keep products in Sanity too (single editor source, wider schema and validation scope). Recommend A for the frontend marketplace allowance; validate referenced fixture IDs and block broken related-product links. Proposed models: campaign singleton with fixed hero/featured/testimonial/FAQ fields; articles with cover, Portable Text, category, slug, related product IDs and native draft/publish; lead documents only under P-006. Exact fields, validation, media attribution, metadata defaults, pagination size (proposed 6), unknown-page behavior (proposed 404) and slug uniqueness/change handling require explicit sign-off. No generic page builder. Related: T02–T05.

### P-006 — Leads, storage and basic spam protection (before T02/T03)

Options: (A) Astro server endpoint writes restricted lead documents into existing Sanity and marketing reads them in Studio (no extra service), or (B) separate form service/store (extra integration and access management). Recommend A only with an approved private dataset/read boundary that prevents public lead reads; choose private content with server-only public-page queries, or a separate private leads dataset within Sanity. Dataset availability and permission behavior must be checked, not assumed.

Proposed contact interpretation: require name and at least one of email/WhatsApp; alternative require both (stronger data collection, more friction). Proposed basic spam checks: honeypot and server validation with bounded fields; time checks may help but are not a durable rate limiter. Decide whether this meets assessment scope or add an explicitly approved platform limit. Approve data retention, editor permissions, token scope, contact validation, duplicate-submit behavior and failure feedback. Browser write credentials and publicly readable leads are unacceptable. Related: T02, T03, T09.

### P-007 — Commerce fixtures, pricing and persistence (before T05)

Options: (A) one IDR billing period, integer rupiah amounts, no taxes/vouchers, fixture-driven package prices and shared product quota, or (B) additional currencies/billing durations/tax rules (more behavior, some optional scope). Recommend A; approve actual product/category/price/quota fixture values and user/outlet quantity labels before use.

Proposed behavior: distinct product+package cart lines; positive integer quantities; sum all package quantities for quota; block additions above quota, including zero quota; recompute prices from authoritative demo fixtures rather than persisted totals. Recover corrupt/old persisted state visibly; explain stale product/price/quota changes; block checkout until valid. Demonstrate deterministic success/failure via an explicit mock choice, prevent duplicate submissions, clear cart only after success, retain it after failure; no global quota decrement or cross-tab reservation guarantee. Alternatives: fail restore entirely instead of recovering valid lines; retain successful cart instead of clearing. Approve limits, migration/recovery and payment simulation behavior. Related: T05–T07.

### P-008 — Attribution and analytics contract (before T08; agree payload interface before T03/T07)

Options: (A) first-touch within a tab session using sessionStorage, or (B) last-touch persisted across browser sessions with an agreed expiry (broader attribution, more privacy/lifetime rules). Recommend A for a bounded demo. Proposed UTM keys: source, medium, campaign, term, content with utm_ prefixes; preserve an existing touch across internal navigation, whitelist/bound values and handle denied storage. Decide partial/new campaign behavior explicitly.

Proposed events: view_item after successful product view (not per rerender); add_to_cart only after a successful accepted addition; begin_checkout on a meaningful transition into checkout with a valid nonempty cart; landing_cta_click on actual CTA activation. Include GA4-style ecommerce item IDs/names, package variant, currency, quantity/value where applicable, and campaign information. Agree navigation/back/refresh semantics, exactly when view counts as new, event reset convention, and mock order payload structure. No buyer PII in dataLayer. Related: T03, T05–T09.

### P-009 — Verification, deployment and launch assumptions (before applicable work)

Options for important pure-logic tests: (A) Vitest for TypeScript business logic plus existing Playwright CLI for browser evidence, or (B) Node's supported built-in runner with compatible TS execution and browser checks separately (fewer dependencies, runtime constraints). Recommend A only if approved; no test runner is installed during planning. Agree targeted business-logic tests and real CMS/browser checks, not an exhaustive framework suite. Related: T01, T06–T09.

Propose Indonesian copy/IDR single-locale demo now; multi-locale content/currency as a documented future improvement. Alternative: translated launch now (scope/time impact). Confirm language/currency and content ownership. No localization feature is implied by expansion context.

Vercel and Sanity hosting are approved destinations; actual project IDs, public URLs, environment values, demo editor access, deployment configuration, free-plan fit and deployment/push authorization remain pending. Access instructions must be shared securely, never committed passwords. Record brief-received time and deadline from developer. Related: T09, T10.

## Approval record template

For each response: decision ID; date; developer's explicit wording; selected option and modifications; rationale; task(s); implementation evidence if available. Move an entry to approved only after that response. Technical task acceptance and commit permission are separate fields in TASKS.md.
