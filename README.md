# Kodeva — Promo Akhir Tahun

Fullstack Developer assessment for PT Digital Solusi Grup. Kodeva is a fictional UMKM software business.

## Project status

T01 provides the pnpm workspace, web/Studio foundations and approved design primitives. The owner reviewed and accepted T01 on 2026-10-30 with the documented Studio authentication limitation. Available foundation checks passed. The foundation route is a component example rather than the campaign landing page.

T02 adds CMS schemas/editor workspaces, typed published-content reads, request-time rendering and demo seed material. Available automated/API checks passed. The owner reviewed the content workspace and confirmed the invited-account sign-in/edit/publish/lead-workspace checklist. A separate Editor member is confirmed. Native duplicate/publication-date behavior was also verified by the owner. The owner accepted T02 on 2026-10-31 with the recorded limitations; remaining edge cases and deployed behavior are not claimed verified.

T03 implements the campaign landing page (hero, product cards, testimonials, FAQ, lead form), the server-side lead endpoint, and the cart icon in the shared header. Format/lint/typecheck/tests/build pass. Playwright responsive, keyboard, form-state and product-card checks pass. A real dummy lead was stored in the private leads dataset, confirmed server-side, and cleaned up; anonymous reads of the private dataset returned no lead data. CMS edit/publish freshness was verified on the landing route without redeploying.

A scoped T02 amendment (D-025) makes the featured-product cards fully CMS-editable: description, features, and optional image, while product IDs, names, prices, packages, routes and business logic remain code-owned. The amendment is reflected in the Studio schema, web types/validator, GROQ query, seed data, and frontend rendering. The owner accepted T03 on 2026-11-01 and accepted T04 on 2026-11-01 after a parallel review of the delivered blog implementation.

T04 implements the blog: `/blog` listing and `/blog/halaman/N` pagination with approved six-per-page size and 404 policy, `/blog/[slug]` article detail with validated safe rich text rendering (headings, lists, emphasis, http(s) links), related-product links to `/products/[id]`, and per-route SEO/canonical/social metadata including `og:type article` and rasterized sharing images. Blog URL policy, rich text approach, page compositions, and temporary QA records were approved through interactive Q&A (DECISIONS.md D-026–D-030). Runtime owner corrections (D-031, D-032) made listing cards uniformly tall with ellipsized title/excerpt truncation, and kept the pagination indicator centered with always-rendered disabled controls whose hover state is inert. Available checks passed: format, lint, typecheck, 14 CMS/contract tests, and both production builds. Live temporary QA records exercised pagination splits, out-of-range/malformed pages, publish→refresh freshness, unpublish, slug changes, and draft isolation; all QA records were deleted and zero leftovers were verified. Deployed Vercel behavior and Lighthouse remain T09; product destinations remain verified after T05.

T05 implements the marketplace catalog and product details from the approved commerce fixtures (D-033: annual IDR prices, struck promotional prices, shared per-product promo quota, per outlet/per pengguna unit labels). The catalog renders server-side with no-JS category filter links (D-034), a reachable empty-result state (D-035), and 404 handling for unknown categories; `/products/[id]` shows original SVG screenshot illustrations, current and struck prices, shared quota ("Sisa kuota promo…" or "Kuota promo habis") and an accessible Basic/Pro/Business radio island that updates the displayed price immediately; an add-to-cart button adds the selected package with quantity 1 (D-036). Eight Node tests assert the fixture values, shared-quota shape and filter results. Browser checks covered zero horizontal overflow at 360/320px, immediate click and keyboard price updates, unknown-category/unknown-product 404s, initial metadata (title/description/canonical/og:image), and landing-CTA/blog-to-product journeys. The owner accepted T05 on 2026-11-01. `view_item`/`add_to_cart` instrumentation (T08) and Lighthouse (T09) remain deferred.

T06 implements the persistent cart behind approved D-037–D-040: a Zustand `persist` store (`kodeva-cart`, versioned) whose every mutation and restore is validated by pure logic in `shared/cart.ts` against the approved fixtures — line identity is product+package, repeated adds grow one line, the per-product promo quota is shared across all packages, quantities are positive safe integers to 9999, and amounts are always integer rupiah recomputed from fixtures so persisted totals are never trusted. Restore drops invalid/unknown lines, clamps over-limit quantities to the current shared quota, reports recovery/corrupt/version/denied-storage outcomes visibly in `/cart`, and never overwrites in-session changes made before restore. After two agent implementation rounds the owner finalized the `/cart` layout by hand in `CartView.tsx` (item-list panel with divided rows and an accessible quantity stepper plus a sticky subtotal aside, stacking on phones); the agent later split that file verbatim into `CartView.tsx` + `CartRow.tsx` with no layout change, verified by block diffs and 1280/360px screenshots. The header cart icon gains a hydrated count badge on every public page. Eleven new Node tests (`test:cart`) plus carried-over suites pass; browser checks covered add→change→refresh→remove, quota boundaries across packages (Basic 6 + Pro 4 at the shared limit), forged/corrupt/old-version storage, blocked localStorage (session-only cart), keyboard use, and layouts without overflow at 320/360px. Cross-tab sync is a documented limitation (no storage-event synchronization). Checkout, payments, analytics and Lighthouse remain T07–T09.

T07 implements validated checkout behind owner-approved D-041–D-044: a separate `/checkout` page reached from the cart's "Lanjut ke pembayaran" button; `shared/checkout.ts` builds a strictly bounded client-side mock order (buyer, item/package/unit prices recomputed from fixtures, itemCount, total, currency "IDR", annual billing, simulation result) after revalidating the buyer (approved lead-style limits), the quote, every product's shared promo quota and the attributed utm payload (D-020 contract; capture itself is T08). A clearly labelled Sukses/Gagal radio makes both simulated results deterministic; a visible pending state blocks duplicate submissions; failure retains the cart with a distinct order-id alert and retry; success clears the cart and shows the owner-revised centered "Checkout berhasil" panel with only that content visible (page headers hidden through `body[data-checkout-success]` while the island state is active; refresh/back then shows the empty-cart cannot-checkout state; no quota decrement, no gateway, no network request, buyer PII never logged — the inspection console line is redacted). Seventeen Node tests (`test:checkout`) assert the buyer validation, payload shape/values, quota revalidation and the utm contract; browser checks covered blank/invalid/long inputs with focus, double submit, stale-cart clamp/drop recovery, quantity changes before submit, and each notice-display scenario at 320/360/1280 without overflow. The owner hand-revised the success panel layout, directed the panel-only success view, the notice removal from that view (recorded as failure candidate C-001) and its vertical centering; analytics (T08), Lighthouse/deployment (T09) and backend proposal (T10) remain deferred.

T08 implements attribution and GA4-style tracking behind owner-approved D-045–D-047. `shared/attribution.ts` holds the pure capture rules — the five utm_ keys with the D-020 limits (trimmed strings, ≤200 characters, empty values omitted), first-touch merging and corrupted-storage treatment — covered by 8 Node tests (`test:attribution`). A small SSR-safe client module initializes the dataLayer on every page and captures the tab's first-touch attribution in `sessionStorage` (`kodeva-utm-touch`): the first valid parameter set wins for the whole tab session (partials kept as-is, later campaigns never overwrite, oversized sets rejected without erasing a stored touch), and when storage is denied the touch degrades honestly to a same-document memory fallback. The four events follow page-load semantics with no rerender duplication: `view_item` once per real product page load (reload refires; back/forward restores never re-run the script), `add_to_cart` only after the cart store accepts the addition, `begin_checkout` once per checkout page load with a valid nonempty cart (a failed-payment retry does not refire), and `landing_cta_click` on each genuine CTA click — each payload carrying GA4-style ecommerce items, IDR currency/value and the captured utm campaign data, never buyer PII. Attribution is included in stored lead payloads (verified through the Sanity API) and the mock order payload. Browser verification covered UTM survival across the landing/blog/catalog/product/cart/checkout journey, event counts under repeated clicks/rejected adds/failed-payment retry/empty checkout, partial/second-campaign/oversized/injected parameters, denied-storage degradation, mobile 320/360 without overflow and PII exclusion. Lighthouse/deployment (T09) and the backend proposal (T10) remain deferred.

T09 executes the integrated QA round on the production build and records release preparation. Available checks passed: format/lint/typecheck, all six Node test suites (0 failures), and both production builds; a scratch (git-ignored) local production runner verifies the actual built app because the Vercel adapter has no `astro preview` support. Integrated browser journeys cover the mandatory paths with recorded evidence: UTM→landing→lead including the stored lead's first-touch attribution verified server-side (a mid-session second campaign never overrides, honeypot submissions store nothing, and the dummy lead was deleted and verified absent), and UTM→catalog→package→cart→checkout success/failure/retry including the cross-package shared-quota boundary, double-submit producing exactly one order, and `begin_checkout`/`view_item`/`add_to_cart`/`landing_cta_click` semantics with no rerender or retry duplication. CMS freshness was re-verified on temporary owner-approved QA records that were deleted and verified absent: publish→edit→new-slug→unpublish without redeploy, with `documents validate` 6/6 clean, anonymous draft/lead queries returning nothing, and the three `no-store` headers intact. Security checks: no credentials, env names, or lead data in any client asset, and the `/api/leads` matrix behaves exactly per D-022 (400/403/413/415). A CMS-outage rehearsal shows explicit 503 states on landing/blog while the fixture-driven catalog stays available. Two owner-directed mandatory fixes were applied and re-verified: the product-page quota label became a cart-aware island (`components/QuotaLabel.tsx`) so the shown remaining quota matches the disabled add button after hydration, and product pages now share committed 1200×800 PNG derivatives rasterized from the approved screenshot SVGs because WhatsApp does not render SVG `og:image`. Lighthouse mobile Performance reached 97 and 100 on two runs of the local production build and **99 on the final run of the deployed production build** (Lighthouse 12.8.2, mobile form factor, Moto G Power 2022 emulation, throttled 4G; artifacts and screenshots dated 2026-11-01). The production web app is deployed at <https://kodeva-page.vercel.app/> (owner's Vercel account, dashboard import with GitHub auto-deploy; `PUBLIC_SITE_URL` set to the deployed origin so canonical/`og:url` and product `og:image` render correctly). Non-mandatory findings (branded 404 page, robots.txt/sitemap.xml/favicon) were recorded locally per the owner's instruction rather than implemented. The owner accepted T09 on 2026-11-01 ("oke diterima") together with the authorization to push; the owner then deployed the web app via the Vercel dashboard with GitHub auto-deploy and set `PUBLIC_SITE_URL`, after which deployed-origin checks passed (headers, metadata, lead write/privacy, Lighthouse 99 — see below). Sanity Studio is deployed at <https://kodeva-admin.sanity.studio/> where anonymous access correctly falls through to the Sanity login screen; the demo Editor login and its workspace/CORS check remain owner-side steps.

Requirements and implementation scope are documented in [PRD.md](PRD.md) and [TASKS.md](TASKS.md).

## Approved architecture

The selected architecture uses:

- pnpm workspaces with apps/web and apps/studio.
- Astro, @astrojs/react and TypeScript for the web application, with React islands for interactive features.
- Tailwind CSS v4 or newer for styling.
- Zustand persistence for the shopping cart.
- Sanity Studio and Content Lake for marketing content.
- Vercel for web hosting and Sanity hosting for Studio.
- A frontend marketplace with simulated checkout and payment.
- Linting and Prettier with Tailwind class sorting.

Astro supports content rendering and SEO while keeping browser JavaScript focused on interactive features. pnpm workspaces keep the web application and Studio in one repository.

T02 configures request-time Astro rendering with the Vercel adapter. The existing foundation route still has no CMS content; its title/description and optional canonical/social image props render in the initial HTML. One small React island demonstrates controls; the shell stays rendered by Astro. Zustand 5.0.16 was added in T06 (already present in the lockfile as a Studio dependency and explicitly part of the approved D-001 architecture) with a versioned `persist` store and validated rehydration.

Approved decisions and implementation proposals are tracked in [DECISIONS.md](DECISIONS.md). The design specification is in [DESIGN.md](DESIGN.md).

## Local setup

Requires Node **>=24.16.0 <25** and pnpm **10.13.1** (`packageManager`). `.nvmrc` pins **24.22.2**, the version used for verification; compatible Node 24 versions are accepted by the engine check. The minimum follows the Astro ESLint plugin's supported Node range. With an existing nvm installation:

```sh
nvm install
nvm use
corepack enable
corepack prepare pnpm@10.13.1 --activate
pnpm install --frozen-lockfile
cp apps/web/.env.example apps/web/.env.local
cp apps/studio/.env.example apps/studio/.env.local
pnpm dev
```

Web: <http://localhost:4321>. Studio: <http://localhost:3333>. Run either app alone with `pnpm dev:web` or `pnpm dev:studio`. Astro 7 runs its dev server in the background; stop it with `pnpm --filter @kodeva/web exec astro dev stop`. Stop the foreground Studio process with Ctrl+C.

Replace example identifiers in the ignored env files with your Sanity project ID. Web uses `SANITY_PROJECT_ID` and `SANITY_DATASET`; Studio uses `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` and `SANITY_STUDIO_LEADS_DATASET`. The content dataset must be public and the separate leads dataset private. T02's configured project has public `production` and private `leads`. Studio has `/content` and `/leads` workspaces. Configure the localhost Studio CORS origin and authenticate through Studio to edit content. CLI checks separately require `pnpm --filter @kodeva/studio exec sanity login`.

Every `SANITY_STUDIO_` value reaches the browser bundle, so these variables must never contain tokens or secrets. Content reads are anonymous and server-side. T02 requires no web credential. T03 must establish an approved scoped server-only write credential before implementing submissions; do not substitute a broad project Editor token. `PUBLIC_SITE_URL` is the configured canonical origin for subsequent public-page integration.

## CMS editing and publication

The approved [content contract](tasks/T02-cms.md#approved-content-contract) defines field limits, product identities, dummy content and lead access. In Konten Kodeva, edit Kampanye for hero, featured selections, fictional testimonials and FAQ; Artikel and Kategori manage the blog. Publish a category before an article that references it. Product selections reference the shared code registry; full pricing/packages belong to T05. Draft content is excluded from public reads. Campaign creation/duplication/deletion is restricted in Studio to keep one campaign; administrators/API credentials remain capable of overriding Studio safeguards.

Articles use readable unique slugs. Changing a published slug makes its old URL return not-found; there are no redirects in this assessment. Duplicates receive a new first-publication date when published. Native Sanity validation/publish behavior is retained. Public content is validated again at the read boundary: malformed images, unresolved categories, invalid product IDs or unsafe rich-text links return an explicit unavailable result instead of broken or draft content.

`apps/web/src/lib/cms/server.ts` supplies fixed typed campaign, article and six-item paginated article reads. Future landing/blog routes consume these results in Astro, handling `ok`, `not-found` and `unavailable` explicitly. There is no public raw-document/query endpoint. SEO overrides and image provenance are included in the contracts; public-page layouts are later tasks.

Each read uses the origin Sanity API (not the API CDN), the explicit `published` perspective and fetch `cache: no-store`. Astro middleware sends `Cache-Control`, `CDN-Cache-Control` and `Vercel-CDN-Cache-Control: no-store`. No ISR, application response cache, webhook or manual redeployment is required for subsequent CMS reads, including new slugs and unpublishing. This trades per-request latency/API usage and CMS availability for freshness; it does not promise zero publication delay or offline cached content. Static assets retain their normal hosting behavior.

Live temporary-record checks observed a published edit on the next read in **1.6 seconds including the write**; changed slugs and unpublishing were also reflected without rebuilding. Local HTTP checks confirmed the no-store headers. These are origin-reader/local-server measurements, not deployed Vercel measurements or a latency guarantee. The owner subsequently confirmed the invited-account editing/publishing and lead-workspace checklist; API inspection confirms that member has the Editor role. The owner also verified native duplication: the new article had a new publication time while the original retained its earlier time. Deployed behavior remains a separate check.

The Lead Kodeva workspace displays read-only records from the private dataset. UI restrictions are not dataset permissions. T02 verified authenticated CLI read access and anonymous non-disclosure of a synthetic lead under published/raw/draft queries; some denied queries return an empty result with HTTP 200. The owner later confirmed opening the workspace through the invited account, and its Editor role is confirmed; because the workspace was empty, reading a stored lead as that account is not separately demonstrated. A scoped submission credential remains unverified. Leads are dummy assessment submissions only; the owner manually deletes them after review. Lead submission and spam handling belong to T03.

## Optional manual demo content import

The original SVG and fictional Indonesian copy are in `apps/studio/seed/`. They contain no real customer claims or lead records. The import script defaults to a dry run and does not overwrite content. Review the configured project/dataset first; run the write command only when you intend to publish the supplied demo content into an empty content dataset:

```sh
pnpm --filter @kodeva/studio exec sanity exec scripts/seed.ts --with-user-token
pnpm --filter @kodeva/studio exec sanity exec scripts/seed.ts --with-user-token -- --write
```

The write command uploads one original image and creates the singleton, two categories and two published articles. It requires authenticated write access. If an import fails partway, inspect Studio before retrying; the empty-dataset guard stops overwriting existing editor content. The agent did not run this manual import.

## Development checks

```sh
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test:cms
pnpm test:catalog
pnpm test:leads
pnpm test:cart
pnpm test:checkout
pnpm test:attribution
pnpm build
```

`pnpm format` formats app code and workspace configs. ESLint covers Astro, TypeScript and TSX in both apps, including React Hooks rules; generated build directories are excluded. Astro check validates web types; TypeScript validates Studio. Use `pnpm dev:web` for local web development; the production adapter targets Vercel. Preview the Studio build with `pnpm --filter @kodeva/studio preview`.

`pnpm test:cms` uses Node 24's built-in runner for content/lead validation, product-link and slug boundaries, fixed anonymous published-only requests, error/configuration states, safe rich text and pagination. These offline checks do not replace actual CMS publication/privacy tests. Validate stored content using `pnpm --filter @kodeva/studio exec sanity documents validate --workspace content --yes` after CLI login.

Tailwind v4 uses the Vite plugin and `apps/web/src/styles/global.css`. Prettier loads the Astro plugin first and Tailwind plugin last, with that actual stylesheet for class sorting. The owner-approved [upstream compatibility patch](patches/README.md) keeps Astro formatter 1.1.2 and Tailwind formatter 0.8.1 working together. The pinned lockfile and pnpm patch are part of setup; do not omit the patch files when copying the repository.

The blog uses the D-026 URL policy: `/blog` (page 1), `/blog/halaman/N` (pages 2+, out-of-range or malformed → 404), and `/blog/[slug]` for details. Article rich text renders from the validated Portable Text contract in a server-side typed component; no Portable Text library was added. Dynamic routes read params from `Astro.params` (Astro 7 on-demand routing).

## Recorded working time

Recorded-interval snapshot through TIME_LOG sessions S-023B, S-024, S-025, S-026, S-028, the owner-confirmed T07 windows S-029–S-031 and the T08/T09 windows S-033 and S-034/S-034B (S-034C observed, plus S-027, S-032 and untimed tails unquantified):

| Scope | Recorded time |
| --- | --- |
| T02 — agent intervals | 32m 38s |
| T02 — owner editing review, confirmed not overlapping | 6m |
| T02 combined | **38m 38s** |
| T03 initial implementation (S-018A, owner-confirmed) | 12m 00s |
| T03 prerequisite review | 1m 09s |
| T03 takeover corrections and verification (S-019) | 15m 26s |
| T02 amendment + T03 testimonial polish (S-020) | 12m 55s |
| T03 owner-revised testimonial verification (S-021) | 2m 01s |
| T03 AI_LOG and tracker update (S-022) | 31s |
| T03 combined | **44m 02s** |
| T04 implementation and verification (S-023) | 27m 53s |
| T04 documentation and authorized commits (S-023B, commit-bounded) | 4m 27s |
| T04 combined | **32m 20s** |
| T05 implementation, verification and documentation (S-024, owner-confirmed) | 19m 58s |
| T05 combined | **19m 58s** |
| T06 implementation, verification and documentation (S-025, observed) | ~22m 25s |
| T06 owner-directed UI refinement (S-026, observed) | ~3m |
| T06 acceptance round: owner manual revision, verbatim file split, authorized commit (S-027) and approved log/hash reconciliation (S-028) | observed windows of minutes, not individually quantified |
| T07 implementation, verification and documentation (S-029, owner-confirmed approximation) | ~14m 44s |
| T07 owner manual revision plus directed changes (S-030, owner-confirmed approximation) | ~15m |
| T07 notice removal, C-001 recording and simulations (S-031, owner-confirmed approximation) | ~10m |
| T07 vertical centering plus final checks (S-032) | observed minutes-scale window, unquantified — not assumed zero |
| T08 implementation, verification and documentation (S-033, stamped window ≈ 5m 17s; earlier reading/approval tails untimed) | ~5m 17s + untimed tails |
| T09 integrated QA, verification and documentation (S-034, owner-confirmed) | ~25m + untimed tails |
| T09 owner-directed mandatory fix round (S-034B, owner-confirmed) | ~16m + untimed tails |
| T09 deployed verification on kodeva-page.vercel.app (S-034C, observed) | ~11m + untimed tails |
| **Whole project combined (recorded)** | **~5h 02m 18s** (+ S-027, S-032, S-033, S-034 and S-034C tails untimed) |

The owner explicitly confirmed that their six-minute review did not overlap agent work, so it is included once in both combined figures. Concurrent agent review and tool checks are already inside parent session intervals and are not added again.

T07 observed windows were confirmed by the owner on 2026-11-01: S-029 **~14m 44s** (implementation, verification and documentation; early reading/approval time untimed), S-030 **~15m** (owner manual revision plus directed changes), S-031 **~10m** (notice removal, C-001 recording and simulations). S-032 (vertical centering, turn yang singkat) remains an observed minutes-scale window without a separate figure and is not assumed zero. Confirmed windows add ~39m 44s on top of the previous combined total. The T09 windows were also owner-confirmed on 2026-11-01: S-034 **~25m** (08:41–09:07 WIB QA and verification) and S-034B **~16m** (09:14–09:30 WIB mandatory-fix round), plus untimed documentation/commit tails; they add ~41m. The deployed verification window S-034C (~11m, 09:42–09:53 WIB) is observed and not yet confirmed; it adds ~11m to the snapshot with its own caveat.

These figures are sums of recorded and owner-confirmed intervals, **not complete actual active working-time totals**. Main agent windows still include unseparated approval waits, while some intake, discussion, staging/commit, handoff and later time-reconciliation work was not continuously timed. The T03 initial implementation duration is the owner-confirmed 12-minute figure, not an independently measured session. Unknown time is not assumed to be zero. [TIME_LOG.md](TIME_LOG.md) preserves session details, arithmetic and these limitations.

## Project documentation

- [ASSESSMENT_BRIEF.md](ASSESSMENT_BRIEF.md): authoritative assessment requirements.
- [PRD.md](PRD.md): requirement mapping and acceptance criteria.
- [DESIGN.md](DESIGN.md): design specification.
- [DECISIONS.md](DECISIONS.md): approved decisions and proposals.
- [TASKS.md](TASKS.md): task scope, dependencies and progress.
- [AGENTS.md](AGENTS.md): development, review and approval rules.
- [AI_LOG.md](AI_LOG.md): tools used and owner-approved prompt references; additions require explicit owner approval and any applicable verification.
- [Task prompt template](prompts/TASK_PROMPT_TEMPLATE.md): reusable developer reference for assigning one task.
