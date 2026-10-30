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

## Pending proposals

All entries below have status **pending explicit approval**. Recommendations describe proposed behavior only. Ask for the decisions needed by the next assigned task; unrelated future choices can remain pending.

### P-001 — Task decomposition (before implementation)

Context: reviewable increments within the assessment time budget. Options: (A) ten tasks in TASKS.md following the suggested responsibilities, or (B) eight tasks by combining blog with landing and final documentation with QA (fewer reviews, larger review surface). Recommend A for isolated review of content, commerce, and submission evidence. Related: T01–T10. Implementation assignment is still required after decomposition approval.

### P-002 — Tooling packages and compatibility (before T01)

Options: (A) ESLint flat config for Astro/TS/React plus Prettier, or (B) a lightweight general TS linter plus separate Astro checking (fewer specialized rules, reduced template coverage). Recommend A: eslint, @eslint/js, typescript-eslint, eslint-plugin-astro, eslint-plugin-react-hooks, eslint-config-prettier; Prettier with prettier-plugin-astro and prettier-plugin-tailwindcss. Use Astro check/TypeScript for type checking. Proposed Tailwind integration: tailwindcss + @tailwindcss/vite, not the legacy Astro Tailwind integration. Resolve compatible stable versions, supported Node LTS and pnpm version before installation; report the concrete manifest for approval if compatibility changes the set. No arbitrary Node upgrade is authorized.

Prettier plugin documents require Tailwind v4's stylesheet entry via tailwindStylesheet and the Tailwind plugin last; verify .astro and .tsx formatting and class sorting together. See [Tailwind Vite setup](https://tailwindcss.com/docs/installation/using-vite), [Tailwind Prettier plugin](https://github.com/tailwindlabs/prettier-plugin-tailwindcss), [Astro formatter](https://github.com/withastro/prettier-plugin-astro), and [Astro ESLint guide](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/). These establish integration feasibility, not a tested version set. Related: T01.

### P-003 — Kodeva design specification (before T01 tokens)

Options: (A) compact adapted palette and system typography proposed in DESIGN.md (fast, no font download), or (B) self-host a licensed open-source display font with the same palette (more distinctive, adds asset/performance work). Recommend A initially; evaluate the real rendered result before approving further polish. Approve exact palette, type, sizes, spacing, responsive rules and component treatments together, or identify revisions. Existing reference values and skill suggestions have no approval status. Related: T01, T03–T07, T09.

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
