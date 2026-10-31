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

### T02 approvals — 2026-10-31

- **D-015 / P-004:** Owner selected “Approve request-time reads (recommended)”: request-time CMS reads, Sanity CDN disabled, published-only queries, `Cache-Control: no-store`, compatible pinned Vercel adapter. Missing content returns not-found; CMS failures return an explicit unavailable result without draft exposure or silent demo fallback. Actual freshness remains subject to measurement.
- **D-016 / P-005 direction:** Owner selected “Approve fixture-linked content direction (recommended)”: singleton campaign, articles/categories, shared six-product TypeScript identity registry, fixed catalog CTA destination, optional SEO overrides, image alt/provenance, Indonesian fictional demo content, six articles per page, invalid pages and old changed slugs return 404. Exact field limits and seed content still require approval before implementation.
- **D-017 / P-006 boundary:** Owner selected “Separate private leads dataset (recommended)”: public marketing content and separate private leads, authenticated marketing access, server-only write credential. Project access, dataset creation/privacy changes, detailed lead contract and credential permissions remain unapproved/unconfirmed. This does not authorize external mutations.

These selections were received through interactive Q&A for T02. They supersede the corresponding pending directions below only to the extent explicitly approved; remaining details are still pending.

- **D-018 / T02 detailed contract:** Owner selected “Approve the detailed contract (recommended)” for [the T02 contract](tasks/T02-cms.md#approved-content-contract), including field limits, seed content, lead policy and Node built-in checks without a new test dependency. Owner then said “I have add project ID to env, but the project still empty. Just continue”. Continue local implementation and inspect the configured project; do not infer authenticated access, successful dataset creation or scoped-token availability. The compatible Vercel adapter is pinned to 11.0.17 (registry peer range Astro ^7.0.0, matching installed Astro 7.4.4).

### D-019 — T02 reporting follow-up (2026-10-31)

Owner explicitly approved the proposed T02 contribution paragraph for AI_LOG: “Setujui enti AI log”. Only that proposed paragraph is added; no failed-work or independent-authorship claims are authorized. Owner confirmed their editing review was six minutes and instructed: “Catat bagianmum bagianku tadi 6 menit. Kalau ada yang di kerjakan paralel jangan di sum, tapi catat 1 waktu karena paralel”. Record owner and agent contributions separately, use the union of overlapping active intervals for project totals, and do not add parallel reviewer/tool durations to the parent session. Unseparated waiting and untimed intervals remain unknown rather than fabricated active time.

### D-008 — Concrete tooling pins

Core/runtime pins are in D-008 above. Supporting packages: @astrojs/react 7.1.2, @astrojs/check 0.9.12, @tailwindcss/vite 4.3.3, react-dom 19.3.1, styled-components 6.6.0 (Studio peer), @types/node 24.19.2, @types/react and @types/react-dom 19.3.0; eslint 10.14.0, @eslint/js 10.0.1, typescript-eslint 8.72.1, eslint-plugin-astro 3.2.1, eslint-plugin-react-hooks 7.1.1, eslint-config-prettier 10.1.8; prettier 3.9.10, prettier-plugin-astro 1.1.2, prettier-plugin-tailwindcss 0.8.1. The TypeScript 6 pin follows the checkers' supported peer ranges. Registry metadata checks preceded installation; install/build results are separate evidence.

### T05 approvals — 2026-11-01

Interactive Q&A (D-007 interactive rule) for T05. Explicit owner selections:

- **D-033 / P-007 commerce fixtures:** Owner selected “Approve option A” after being offered two complete alternative pricing tables. Approved: annual IDR billing period displayed “Rp… / tahun”, integer rupiah, no taxes/vouchers; Basic < Pro < Business per product; shared per-product promo quota (never per package). Kasir #Penjualan & Kasir 1.8jt/2.7jt/3.9jt (coret 2.4/3.6/5.2jt), kuota 10; Inventori #Inventaris 1.2/1.9/2.9jt non-promo, kuota 5; HR #SDM & Payroll 1.5/2.4/3.5jt (coret 2.0/3.2/4.6jt), kuota 8; Payroll #SDM & Payroll 2.2/3.3/4.9jt non-promo, kuota 12; Akuntansi #Keuangan & Laporan 1.6/2.5/3.8jt (coret 2.1/3.3/5.0jt), kuota 15; Laporan #Keuangan & Laporan 0.9/1.4/2.2jt non-promo, kuota 0 (habis). Unit labels: kasir/inventori “per outlet”, hr/payroll/akuntansi/laporan “per pengguna”. Screenshots: 2–3 original simple SVG demo illustrations per product in the approved T02 seed-illustration style; no third-party imagery.
- **D-034 / Catalog filter interaction:** Owner selected “Approve A: no-JS links (Recommended)”. Filter chips are plain links to `/products?kategori=slug`; Astro re-renders the filtered list on the server with no client JavaScript. Plain hrefs only — no designed shareable-filter-URL feature; unknown category slugs return 404.
- **D-035 / Empty-result demonstration:** Owner selected “Approve B: add-on chip (Recommended)”. The catalog includes a fifth chip “Tambahan” (planned add-ons, no products) so a real empty-result state is visible in normal browsing.
- **D-036 / Add-to-cart control in T05:** Owner selected “Approve A: omit button (Recommended)”. The T05 detail page renders packages/price/quota without any add-to-cart control; T06 introduces the working control. No placeholder or disabled buy button.

### T04 approvals — 2026-11-01

Interactive Q&A (D-007 interactive rule) for T04. Explicit owner selections:

### T04 approvals — 2026-11-01

Interactive Q&A (D-007 interactive rule) for T04. Explicit owner selections:

- **D-026 / Blog URL routing:** Owner selected “Dedicated pagination segment (Recommended)”: `/blog` is listing page 1; pages 2+ use `/blog/halaman/N`; detail is `/blog/[slug]`. Out-of-range, malformed (`/blog/halaman/abc`) and `/blog/halaman/1` return 404 so page 1 keeps a single URL with no duplicate content. No collision with digit-only slugs because no numeric path segment is a route. These URL-shape details are scoped to T04.
- **D-027 / Rich text rendering:** Owner selected “Small typed renderer (Recommended)”: a small server-rendered Astro component keyed to the validated `TextBlock` contract (paragraphs, h2/h3, strong/em, bullet/number lists, http(s) links). No `@portabletext/react` or other new dependency.
- **D-028 / Blog page compositions:** Owner approved proposal A: listing with “Blog” heading, intro copy, responsive article-card grid (cover, category, title, excerpt, date) at 1/2/3 columns, accessible Sebelumnya/Berikutnya pagination with a page indicator; detail with category/date, title, cover, validated rich text, then a “Produk terkait” section reusing the existing ProductCard with registry descriptions linking to `/products/[id]`. Uses D-009 tokens; product destinations remain verified after T05.
- **D-029 / QA records:** Owner approved “Temporary articles via token (Recommended)”: the agent creates clearly labeled temporary QA articles through the previously approved server-only Editor token (D-023), runs pagination/unpublish/freshness checks, then deletes the records and verifies deletion.

### D-030 — T04 rendering follow-up

Owner explicitly approved extending the shared Shell with an `og:type` prop only (default `website`; article detail uses `article`) so initial-HTML social metadata on blog pages matches R-022 without other Shell changes.

### D-031 — T04 listing card consistency

Owner instruction during T04 (2026-11-01): blog listing cards truncate long content with an ellipsis so card heights stay consistent. Implemented as fixed-aspect covers, a single truncated category/date line and line-clamped/fixed-slot titles (2 lines) and excerpts (3 lines). Scoped to the T04 article card.

### D-032 — Pagination control geometry

Owner correction during T04 (2026-11-01): the “Halaman X dari Y” indicator must stay visually centered even when one of the Sebelumnya/Berikutnya controls does not apply. Owner’s own options were a disabled control or an in-DOM hidden control. Implemented as the owner’s first option: both controls always render in a `1fr auto 1fr` grid; the inapplicable one is a non-focusable `aria-disabled` control with the approved disabled button style. The owner then reported that the disabled control still reacted to hover (color change); hover/active states now exclude `[aria-disabled="true"]` alongside `:disabled`, verified by computed-style checks.

### T03 approvals — 2026-10-31

- **D-020 / P-008 payload interface:** Owner approved using the existing `utm: {source, medium, campaign, term, content}` shape. This explicitly corrected and superseded the earlier approved suggestion of `attribution` with `utm_`-prefixed keys. Values are strings, trimmed, maximum 200 characters; empty values are omitted; unknown keys/types are rejected. Capture, touch policy, browser persistence and navigation verification remain T08.
- **D-021 / landing composition:** Owner approved Kodeva/Blog/Katalog/Keranjang navigation (`/cart`), desktop two-column hero stacked on mobile, featured product name links from the registry without prices before T05, fictional testimonial disclosures, native details FAQ, then the lead form. Use DESIGN.md tokens and CMS illustration; no animation or additional dependency.
- **D-022 / lead transport:** Owner approved same-origin POST JSON `/api/leads`, streamed 8 KiB body limit, `website` honeypot, no automatic retry/server deduplication, and responses 400 validation, 403 origin, 413 body limit, 415 media type, 503 CMS/write failure. Success follows confirmed storage only. Existing D-018 name/contact and private dataset policies apply.

**D-023 / demo credential exception:** After the scoped-versus-Editor explanation, owner explicitly replied “Oke saya Approve A untuk token”. A server-only Editor token is allowed for this assessment demo, superseding D-018's scoped-token requirement only for T03's demo submission integration. Its read/write permissions cover all project datasets; private dataset isolation, server-only environment storage and no browser credential exposure remain required. The owner creates/stores the token manually; no token value is recorded here. A production rollout needs narrower credentials/access policy.

**D-024 / T03 navigation correction:** Owner explicitly approved replacing the text “Keranjang” navigation item with a shopping-cart icon in the shared global header as part of T03. Implementation: inline SVG, `aria-label="Keranjang"`, minimum 44×44 px touch target, preserved `/cart` destination, no React hydration, no badge or cart state. Cart count and checkout flow remain T06/T07.

**D-025 / T02 content-contract amendment (featured products):** Owner approved amending the accepted T02 campaign schema so the “Pilihan aplikasi” section supports CMS-editable marketing content. `featuredProducts` becomes an array of objects: required `product` selection from the existing shared registry, required `description` (≤200 characters), required `features` list (1–6 items, ≤100 characters each), and optional `image` (`contentImage`). Product IDs, names, prices, packages and all commerce business logic remain unchanged; the shared registry stays the source of truth. Duplicate product selections are rejected. Existing product routes and `isProductList` usage in article `relatedProducts` are unaffected. This is a scoped amendment to the T02 content contract.

P-001 through P-003 are approved above. T02's P-004 through P-006 selections and detailed contract are approved in D-015–D-018; remaining access/credential verification is not implied. P-007 through P-009 remain pending except for T02's approved Node built-in checks and Indonesian demo content. The original proposal comparisons below remain context; the explicit decisions and T02 contract control the approved behavior.

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
