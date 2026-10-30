# T01 — Workspace, tooling and design foundations

## Goal and scope

Create the approved pnpm workspace with apps/web (Astro/React/TypeScript/Tailwind ≥4) and apps/studio (Sanity), development/check scripts, environment examples and approved shared design primitives. Preserve existing Git/.gitignore. No product features.

Requirements: R-001, R-002, R-004, R-005, R-018, R-022. Dependencies: approved P-001 decomposition and explicit assignment; approve P-002 packages/runtime and P-003 tokens first. Decide test tooling under P-009 only if installed here. Approved decisions: D-001, D-003, D-004, D-005; D-002 governs the source brief. Pending recommendations are not permission.

## Deliverables and acceptance

- Both apps have compatible pinned manifests and a pnpm lockfile; approved runtime/package manager versions are documented. No npm/yarn lockfiles or orchestration layer.
- Web renders a minimal foundation route and only deliberately hydrates interactive examples. Tailwind ≥4 styles compile. Studio launches without application schemas beyond necessary approved setup.
- Lint/typecheck/build/format scripts cover relevant .astro/.ts/.tsx and Studio files; Prettier sorts Tailwind classes in Astro and React using the actual v4 stylesheet and correct plugin ordering.
- Shared shell/primitives use only approved tokens, support accessible controls/mobile reflow, and provide a metadata integration point. No unapproved marketing layout.
- Safe env examples, ignores, setup rationale and actual verification are documented; no secrets bundled/versioned.

## Verification and edge cases

Run actual pnpm install, lint, typecheck, format:check and production builds for both apps using verified script names. Smoke-test both dev apps; inspect foundation page on phone/desktop with Playwright CLI. Check intentional unsorted classes in temporary Astro/TSX fixtures are sorted, then formatter output is stable. Check unknown env values fail clearly without exposing secrets. Confirm generated outputs ignored, lockfile/env examples trackable, and no accidental full-page hydration. No business-logic tests are needed before logic exists.

## Manual review and boundaries

- [ ] Reviewer can follow local setup and run both apps.
- [ ] Tokens match explicit approval and browser screenshot evidence.
- [ ] Tooling covers both app source types; package set matches approval.
- [ ] No secrets or product features; logs/time truthful.

Out of scope: CMS schemas/data, leads, marketplace behavior, production deploy, bonus UI. Stop after reporting results for human acceptance.

## Status

Completion: proposed, not started. Technical verification: not run. Human acceptance: pending. Actual active time: none measured; update TIME_LOG.md when started. Commit: none; separate authorization required.
