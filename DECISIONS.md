# Decision register

Approved technical and workflow decisions for the **Kodeva — Promo Akhir Tahun** assessment. This is a reference for the implemented project, not a list of unresolved proposals. The assessment requirements are in [ASSESSMENT_BRIEF.md](ASSESSMENT_BRIEF.md); detailed implementation records are in [TASKS.md](TASKS.md) and the linked task briefs.

**Decision rule:** a proposed alternative is not permission to implement it. The developer approves scope, reviews the result, and separately authorizes commits, pushes, and deployments. Earlier decisions remain historically recorded when later decisions explicitly supersede them.

## Project foundation and working agreements (D-001–D-014)

| ID | Final decision | Important qualification |
| --- | --- | --- |
| **D-001** | pnpm monorepo with `apps/web` (Astro, React islands, TypeScript, Tailwind, Zustand) and `apps/studio` (Sanity). Host web on Vercel and Studio on Sanity. | Marketplace and payment backend are out of scope for the demo. |
| **D-002** | Treat [ASSESSMENT_BRIEF.md](ASSESSMENT_BRIEF.md) as the authoritative transcription of the assessment brief. | Do not require agents to find the original PDF or alter the brief. |
| **D-003** | Use pnpm, Tailwind v4+, ESLint and Prettier with Tailwind class sorting. | Specific compatible versions follow D-008/D-011. |
| **D-004** | Execute **one assigned task at a time**. Verify, request developer acceptance, reconcile documentation, then seek separate commit/push/deploy permission. | No autonomous next task, commit, push, merge, deployment, or squash. |
| **D-005** | Stripe-inspired SaaS design adapted to Kodeva, with [DESIGN.md](DESIGN.md) as the single visual specification. | Original reference is linked by DESIGN.md, not copied locally. |
| **D-006** | Record AI contributions after developer review; record owner-identified shortcomings with evidence. | **D-013 adds the stricter rule**: obtain explicit approval before any addition to AI_LOG. |
| **D-007** | Use ten reviewable implementation tasks (T01–T10). | Interactive questions are preferred for choices requiring approval. |
| **D-008** | Approve compatible pinned tooling: Node 24, pnpm 10.13.1, Astro 7, React 19, Tailwind 4, Sanity 6 and TypeScript 6. | Actual exact versions belong in `package.json` and the lockfile; Node range amended by D-011. |
| **D-009** | Use system typography and approved responsive design tokens/components. | T01 is foundation only, not the finished landing page. |
| **D-010** | Retain Astro Prettier plugin 1.1.2 and use the reviewed pnpm patch for Tailwind formatter 0.8.1. | Patch is documented in [patches/README.md](patches/README.md). |
| **D-011** | Allow Node `>=24.16.0 <25`, with `.nvmrc` pinned to the verified 24.22.2. | Supersedes the unnecessarily strict exact-version requirement in D-008. |
| **D-012** | Keep routine QA screenshots/reports local and ignored. | Required final Lighthouse submission evidence is an exception. |
| **D-013** | Require explicit developer approval **before every addition to AI_LOG**, including failures and contributions. | A private failure candidate is not an automatically approved AI_LOG entry. |
| **D-014** | Authorized Git commits must use a Conventional Commits subject and a nonempty descriptive body. | Commit formatting does not constitute commit authorization. |

## CMS, landing page and leads (D-015–D-025)

| ID | Approved choice | Scope / caveat |
| --- | --- | --- |
| **D-015** | Read published Sanity content on request, using the origin API (`useCdn: false`), `published` perspective and no-store response/cache policy. | Drafts never enter public responses. Missing content returns not-found; CMS outage returns unavailable. Freshness trades caching for latency/API dependency. |
| **D-016** | Use one editable campaign, articles/categories and a shared TypeScript registry of six product identities. | Content can reference products; pricing and commerce rules remain code-owned. Six articles per blog listing page. |
| **D-017** | Separate public marketing content from a **private `leads` dataset**. | Server-only writes and authenticated marketing read access; never expose leads via anonymous content queries. |
| **D-018** | Approve [CMS content contract](tasks/T02-cms.md#approved-content-contract), seed content and Node built-in contract tests. | Earlier scoped-token preference is **superseded for the demo by D-023**. Vercel adapter pinned compatibly with Astro. |
| **D-019** | Log the approved T02 AI contribution and record the developer's six-minute content review. | Count overlapping work only once; unknown intervals are not zero. Developer explicitly approved that log entry. |
| **D-020** | Use `utm: {source, medium, campaign, term, content}` in lead/order payloads. | Trim strings, max 200 characters; omit empties and reject unknown payload fields/types. This supersedes the earlier `attribution` proposal. |
| **D-021** | Landing with Kodeva/Blog/Katalog/cart navigation, mobile-stacked hero, CMS products/testimonials/FAQ and lead form. | Approved in T03 scope; no additional animation dependency. |
| **D-022** | `POST /api/leads` accepts bounded same-origin JSON, validates data and uses a hidden `website` honeypot. | Max body 8 KiB; errors include 400/403/413/415/503. Confirm storage before displaying success; no silent retry. |
| **D-023** | **Demo-only exception:** use a server-side Sanity Editor token for the lead-writing endpoint. | Explicit owner approval: “Oke saya Approve A untuk token.” It has broader project permissions than ideal; never expose it client-side or commit it. Production would require least-privilege credentials. |
| **D-024** | Replace the header's text “Keranjang” with an accessible cart icon linking to `/cart`. | T03 decision; **T06 later adds** the hydrated quantity badge. |
| **D-025** | Make featured-product *marketing fields* CMS-editable: description (≤200 chars), 1–6 short features (≤100 chars each), optional image. | Product ID/name, packages, prices, URLs and quota remain defined in the registry. Duplicate featured-product selections are invalid. |

## Blog and SEO (D-026–D-032)

| ID | Approved choice | Scope / caveat |
| --- | --- | --- |
| **D-026** | Blog listing `/blog`, pagination `/blog/halaman/N` (from page 2), article detail `/blog/[slug]`. | Malformed/out-of-range pages, including `/blog/halaman/1`, return 404; changed old slugs do not redirect in this demo. |
| **D-027** | Render validated rich text with a small typed server-side Astro renderer. | Support paragraphs, h2/h3, emphasis, lists and safe HTTP(S) links; no extra Portable Text library. |
| **D-028** | Responsive article cards, accessible pagination, article details and related product links. | Use shared visual tokens and `/products/[id]` destinations. |
| **D-029** | Create explicitly labeled temporary CMS QA articles using approved server-only access, then delete and verify cleanup. | Testing data is not permanent marketing content. |
| **D-030** | Extend the shared page shell's `og:type` property. | Default `website`; article pages use `article`. |
| **D-031** | Enforce consistent article-card height with fixed cover ratios and clamped title/excerpt text. | Owner-requested visual correction. |
| **D-032** | Keep pagination's page indicator centered, with both controls present and an inert disabled state. | Disabled controls must not respond visually to hover. |

## Products and pricing (D-033–D-036)

**D-033 — Demo pricing contract.** All prices are annual, in whole Indonesian rupiah, with Basic / Pro / Business packages. Each product has **one shared remaining promo quota across all packages**; no taxes or vouchers are implemented. Product images are original illustrations.

| Product | Basic / Pro / Business (IDR million) | Struck-through promo comparison (IDR million) | Shared quota | Unit |
| --- | --- | --- | ---: | --- |
| Kasir | 1.8 / 2.7 / 3.9 | 2.4 / 3.6 / 5.2 | 10 | Outlet |
| Inventori | 1.2 / 1.9 / 2.9 | — | 5 | Outlet |
| HR | 1.5 / 2.4 / 3.5 | 2.0 / 3.2 / 4.6 | 8 | Pengguna |
| Payroll | 2.2 / 3.3 / 4.9 | — | 12 | Pengguna |
| Akuntansi | 1.6 / 2.5 / 3.8 | 2.1 / 3.3 / 5.0 | 15 | Pengguna |
| Laporan | 0.9 / 1.4 / 2.2 | — | 0 | Pengguna |

- **D-034:** Category filtering uses server-rendered links such as `/products?kategori=slug`, without JavaScript; unknown categories return 404.
- **D-035:** An empty “Tambahan” category intentionally demonstrates the catalogue's valid empty state.
- **D-036:** T05 delivered package and price selection **without** a placeholder add-to-cart button. The working button was added in **T06**; D-036 is a task-sequencing decision, not a final-feature limitation.

## Cart, checkout and analytics (D-037–D-047)

| ID | Approved choice | Scope / caveat |
| --- | --- | --- |
| **D-037** | Test cart/quota/price logic using Node's built-in `node --test` runner. | No Vitest dependency. |
| **D-038** | Persist and validate cart contents with Zustand; drop invalid lines and clamp lines exceeding the shared product quota. | Ignore stored totals, recalculate prices, and show recovery notices; invalid-version/corrupt storage resets to an empty cart with feedback. |
| **D-039** | Cart line identity = product + package; each successful add increments quantity by 1. | Quantity changes happen in cart, with one quota shared among a product's packages. |
| **D-040** | Hydrate a small React cart-count badge in the shared header. | Avoid showing an incorrect SSR count before hydration; handle storage denial gracefully. |
| **D-041** | Checkout has its own `/checkout` page. | Empty or invalid cart shows cannot-checkout state; cart remains the editing/review page. |
| **D-042** | Simulate payment results with an explicit Sukses/Gagal radio selection. | Reproducible demonstration, clearly not a real payment transaction. |
| **D-043** | Validate and build the mock order **only on the client**. | No order endpoint, database persistence, real gateway or lead/PII leakage to analytics. |
| **D-044** | Disable double submission while pending; retain cart on failure and clear it on success. | Show confirmation only on success; no shared-quota decrement across users in the demo. Owner later finalized the success-only presentation. |
| **D-045** | Capture first-touch UTM in per-tab `sessionStorage`. | When denied, use only a current-document in-memory fallback. |
| **D-046** | First valid nonempty set of UTM fields wins, even when partial; later campaigns do not overwrite it. | Unknown `utm_*` query keys are ignored during capture; payload contract remains strict (D-020). |
| **D-047** | Emit GA4-style `view_item`, `add_to_cart`, `begin_checkout`, `landing_cta_click` on genuine page loads/actions. | Never on rerenders or rejected adds; checkout retry does not re-emit `begin_checkout`. Include campaign/items/value, exclude buyer PII. |

## Historical proposals and precedence

The original alternatives P-001–P-009 were planning inputs, **not pending implementation work at submission**. Their resolved decisions are:

| Proposal | Resolution |
| --- | --- |
| P-001 — Task breakdown | D-007 |
| P-002 — Tooling/runtime | D-008, D-010, D-011 |
| P-003 — Design foundation | D-005, D-009 |
| P-004 — CMS freshness | D-015 |
| P-005 — Content/product ownership | D-016, D-018, D-025 |
| P-006 — Lead storage/security | D-017, D-018, D-022, D-023 |
| P-007 — Marketplace and checkout | D-033–D-044 |
| P-008 — UTM and tracking | D-020, D-045–D-047 |
| P-009 — Testing, deployment assumptions | D-001, D-011, D-037 and [T09](tasks/T09-quality-release.md) |

For implementation-level details and verification, use the linked task briefs. Do not interpret an earlier task's temporary omission as a missing feature in the completed project.
