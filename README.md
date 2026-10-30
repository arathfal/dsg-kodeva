# Kodeva — Promo Akhir Tahun

Fullstack Developer assessment for PT Digital Solusi Grup. Kodeva is a fictional UMKM software business.

## Project status

Planning documentation has been prepared. The project has a local Git repository and a .gitignore for dependencies, build output, local environment files and machine-specific files.

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

Approved decisions and implementation proposals are tracked in [DECISIONS.md](DECISIONS.md). The design specification is in [DESIGN.md](DESIGN.md).

## Recorded working time

The measured intervals for S-002 through S-004 total **16m 59s**. Session records and time reconciliation are maintained in [TIME_LOG.md](TIME_LOG.md).

## Project documentation

- [ASSESSMENT_BRIEF.md](ASSESSMENT_BRIEF.md): authoritative assessment requirements.
- [PRD.md](PRD.md): requirement mapping and acceptance criteria.
- [DESIGN.md](DESIGN.md): design specification.
- [DECISIONS.md](DECISIONS.md): approved decisions and proposals.
- [TASKS.md](TASKS.md): task scope, dependencies and progress.
- [AGENTS.md](AGENTS.md): development, review and approval rules.
- [AI_LOG.md](AI_LOG.md): tools used and owner-approved prompt references, expanded after owner verification.
- [Task prompt template](prompts/TASK_PROMPT_TEMPLATE.md): reusable developer reference for assigning one task.
