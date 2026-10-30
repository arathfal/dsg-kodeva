# Kodeva — Promo Akhir Tahun

Fullstack Developer assessment for PT Digital Solusi Grup. Kodeva is a fictional UMKM software business.

## Project status

T01 provides the pnpm workspace, web/Studio foundations and approved design primitives. The owner reviewed and accepted T01 on 2026-10-30 with the documented Studio authentication limitation. Available foundation checks passed. The foundation route is a component example rather than the campaign landing page.

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

The T01 shell is static because it has no CMS content. Its title/description and optional canonical/social image props render in the initial HTML. CMS rendering and publication freshness remain governed by P-004 for T02. One small React island demonstrates controls; the shell stays rendered by Astro. Zustand will be added with cart implementation.

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

T01 web needs no environment values. Studio's example contains dummy public identifiers for build/startup checks. To sign in, replace them in the ignored `.env.local` with an existing Sanity project ID and dataset and configure its localhost CORS origin. Dummy identifiers cannot authenticate and cause Sanity API/CORS errors. Real CMS access, schemas and permission decisions belong to T02; no project or dataset is created by these commands. Every `SANITY_STUDIO_` value reaches the browser bundle, so these variables must never contain tokens or secrets.

## Development checks

```sh
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

`pnpm format` formats app code and workspace configs. ESLint covers Astro, TypeScript and TSX in both apps, including React Hooks rules. Astro check validates web types; TypeScript validates Studio. Both apps have production build and preview commands (`pnpm --filter @kodeva/web preview` and `pnpm --filter @kodeva/studio preview`).

Tailwind v4 uses the Vite plugin and `apps/web/src/styles/global.css`. Prettier loads the Astro plugin first and Tailwind plugin last, with that actual stylesheet for class sorting. The owner-approved [upstream compatibility patch](patches/README.md) keeps Astro formatter 1.1.2 and Tailwind formatter 0.8.1 working together. The pinned lockfile and pnpm patch are part of setup; do not omit the patch files when copying the repository.

## Recorded working time

Separately measured intervals through S-009 total **20m 37s**, including **16m 59s** of planning intervals and **3m 38s** of T01 prerequisite review and follow-up documentation. T01's main implementation/review work window was an additional **24m 17s**, including permission waits that were not separately timed.

These figures are partial records, not the full actual active project total. Earlier unmeasured planning, discussion/handoff tails and unseparated permission waits prevent a reliable cumulative active total. The owner authorized proceeding without supplying durations. Session records, including failed checks and recovery, are maintained in [TIME_LOG.md](TIME_LOG.md).

## Project documentation

- [ASSESSMENT_BRIEF.md](ASSESSMENT_BRIEF.md): authoritative assessment requirements.
- [PRD.md](PRD.md): requirement mapping and acceptance criteria.
- [DESIGN.md](DESIGN.md): design specification.
- [DECISIONS.md](DECISIONS.md): approved decisions and proposals.
- [TASKS.md](TASKS.md): task scope, dependencies and progress.
- [AGENTS.md](AGENTS.md): development, review and approval rules.
- [AI_LOG.md](AI_LOG.md): tools used and owner-approved prompt references; additions require explicit owner approval and any applicable verification.
- [Task prompt template](prompts/TASK_PROMPT_TEMPLATE.md): reusable developer reference for assigning one task.
