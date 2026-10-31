# Kodeva — Promo Akhir Tahun

Fullstack Developer assessment for PT Digital Solusi Grup. Kodeva is a fictional UMKM software business.

## Project status

T01 provides the pnpm workspace, web/Studio foundations and approved design primitives. The owner reviewed and accepted T01 on 2026-10-30 with the documented Studio authentication limitation. Available foundation checks passed. The foundation route is a component example rather than the campaign landing page.

T02 adds CMS schemas/editor workspaces, typed published-content reads, request-time rendering and demo seed material. Available automated/API checks passed. The owner reviewed the content workspace and confirmed the invited-account sign-in/edit/publish/lead-workspace checklist. A separate Editor member is confirmed. Native duplicate/publication-date behavior was also verified by the owner. The owner accepted T02 on 2026-10-31 with the recorded limitations; remaining edge cases and deployed behavior are not claimed verified.

T03 implements the campaign landing page (hero, product cards, testimonials, FAQ, lead form), the server-side lead endpoint, and the cart icon in the shared header. Format/lint/typecheck/tests/build pass. Playwright responsive, keyboard, form-state and product-card checks pass. A real dummy lead was stored in the private leads dataset, confirmed server-side, and cleaned up; anonymous reads of the private dataset returned no lead data. CMS edit/publish freshness was verified on the landing route without redeploying.

A scoped T02 amendment (D-025) makes the featured-product cards fully CMS-editable: description, features, and optional image, while product IDs, names, prices, packages, routes and business logic remain code-owned. The amendment is reflected in the Studio schema, web types/validator, GROQ query, seed data, and frontend rendering. The owner accepted T03 on 2026-11-01.

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

T02 configures request-time Astro rendering with the Vercel adapter. The existing foundation route still has no CMS content; its title/description and optional canonical/social image props render in the initial HTML. One small React island demonstrates controls; the shell stays rendered by Astro. Zustand will be added with cart implementation.

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
pnpm build
```

`pnpm format` formats app code and workspace configs. ESLint covers Astro, TypeScript and TSX in both apps, including React Hooks rules; generated build directories are excluded. Astro check validates web types; TypeScript validates Studio. Use `pnpm dev:web` for local web development; the production adapter targets Vercel. Preview the Studio build with `pnpm --filter @kodeva/studio preview`.

`pnpm test:cms` uses Node 24's built-in runner for content/lead validation, product-link and slug boundaries, fixed anonymous published-only requests, error/configuration states, safe rich text and pagination. These offline checks do not replace actual CMS publication/privacy tests. Validate stored content using `pnpm --filter @kodeva/studio exec sanity documents validate --workspace content --yes` after CLI login.

Tailwind v4 uses the Vite plugin and `apps/web/src/styles/global.css`. Prettier loads the Astro plugin first and Tailwind plugin last, with that actual stylesheet for class sorting. The owner-approved [upstream compatibility patch](patches/README.md) keeps Astro formatter 1.1.2 and Tailwind formatter 0.8.1 working together. The pinned lockfile and pnpm patch are part of setup; do not omit the patch files when copying the repository.

## Recorded working time

Recorded-interval snapshot through TIME_LOG session S-022 and owner-confirmed S-018A:

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
| **Whole project combined (recorded)** | **2h 07m 34s** |

The owner explicitly confirmed that their six-minute review did not overlap agent work, so it is included once in both combined figures. Concurrent agent review and tool checks are already inside parent session intervals and are not added again.

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
