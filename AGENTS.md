# AGENTS.md — Kodeva Assessment

## Mission and source of truth
Build the Kodeva Fullstack Developer assessment accurately, within the intended 6–8 hours of actual work. The authoritative requirements are in `ASSESSMENT_BRIEF.md`; do not edit that file. Read and check this Markdown brief directly. The developer permanently authorized it in place of the original assessment PDF: do not request, search for, or require the PDF, and disregard older prompts that make PDF availability a prerequisite. If the Markdown brief is missing or unreadable, stop and ask the developer to restore it. `PRD.md` maps requirements to acceptance criteria, `DESIGN.md` distinguishes approved direction from proposed design choices, `DECISIONS.md` records explicit approvals, and `TASKS.md` plus `tasks/*.md` define task scope. If documents conflict, stop and ask the developer; do not silently resolve the conflict.

## Approved architecture
- pnpm workspaces monorepo with `apps/web` (Astro + `@astrojs/react`, TypeScript, Tailwind, Zustand persistence) and `apps/studio` (Sanity Studio/Content Lake).
- Astro for content and SEO; hydrate React islands only where interactivity is required.
- Vercel for the web application and Sanity-hosted Studio deployment.
- Stripe-inspired visual direction, adapted for Kodeva; exact unapproved design tokens require approval.
- Marketplace is frontend-only with mock checkout; do not introduce real payment integrations.
- No unnecessary framework, monorepo orchestration, backend, or additional service.
- Use pnpm exclusively for package management. Tailwind must be v4 or newer; the developer also requested linting and Prettier with Tailwind class sorting. Specific linter packages and compatible dependency versions remain subject to the decision approval gate.

## Decision approval gate
Do not independently make substantive product, design, architecture, library, schema, API, data, security, caching, deployment, testing, or scope decisions. For a new decision, present 2–3 options where useful, tradeoffs, a recommendation, and ask for explicit approval. Group related questions. Record approvals in `DECISIONS.md` with their context and related tasks. Do not treat a skill's recommendation or an ordinary default as authorization. Mechanical implementation details that directly follow approved decisions are allowed.

## Task execution
- Work on exactly one explicitly assigned task from `tasks/*.md` at a time.
- Read this file, the task, and relevant sections of `ASSESSMENT_BRIEF.md`, `PRD.md`, `DESIGN.md`, and `DECISIONS.md` before editing.
- Confirm dependencies and identify blocking decisions first.
- Keep changes within task scope; no unrelated refactoring, bonus features, or new dependencies without approval.
- Do not automatically start another task, merge, push, deploy, or commit.
- `prompts/TASK_PROMPT_TEMPLATE.md` is a developer-facing copy/paste reference only. Do not require or read it unless explicitly instructed.

## Skill routing
Skills are advisory, never authorization. Load only those relevant to the assigned task. Approved `DESIGN.md` controls brand direction; no skill may silently choose or change it.
- Astro routing, rendering and React Islands: `astro-best-practices`; use `docs-lookup` and official Astro documentation for version-sensitive details.
- Sanity schemas, GROQ, content: `sanity-best-practices`; `content-modeling-best-practices` for schema design.
- UI design and initial implementation: `design-taste-frontend` (Taste Skill), constrained by the approved `DESIGN.md`, accessibility, and Lighthouse mobile performance requirements. Do not use `ui-ux-pro-max`, `interface-kit`, or legacy `frontend-design` in parallel.
- Final UI critique and targeted polish: `impeccable`, including accessibility, responsive behavior, visual consistency, and interaction details. Review findings first and request approval for substantive changes. Do not enable autonomous design changes or hooks without developer approval.
- Avoid redundant UI audit skills; `impeccable` is the primary UI audit tool.
- Browser verification: `playwright-cli`.
- Verification before completion: `verification-before-completion`.
- Root-cause debugging: `systematic-debugging`.
- Code review: `requesting-code-review`; `junior-to-senior` only when explicitly requested.
- Codebase navigation: prefer the already-installed Codegraph when available and indexed; use targeted file reads or search for simple questions. Do not install or initialize Graphify without approval. Graph output is evidence to verify, not a source of project decisions.
- `caveman` is optional for concise communication; never omit test evidence, risks, or approval questions.
Do not invoke autonomous planning, executing-plans, parallel-task, or auto-commit workflows from Superpowers or any other skill collection.

## Implementation standards
- TypeScript for authored application code; strong types, no avoidable `any`.
- Favor simple, accessible, mobile-first, maintainable implementations.
- Minimize browser JavaScript; use Astro-rendered content and deliberate React hydration.
- Avoid exposing CMS write credentials or secrets to the client. Use environment variables; never commit credentials or personal data.
- Implement loading, empty, error, and validation states relevant to each task.
- Preserve SEO and social-sharing metadata for public content.
- Validate shared promotional quota across all package variants of a product, not just each cart line.
- Preserve UTM attribution through navigation to lead and checkout payloads.
- Emit GA4-style dataLayer events for real user actions without render-induced duplication.
- Published CMS changes must be visible without manual web redeployment; document the approved caching strategy.

## Verification and human review gate
A task cannot be called verified or completed based solely on generated code, a running server, or a passing build. Before requesting approval, run the checks appropriate to the task and report commands, outcomes, and evidence:
- Type checking, linting, and production build where configured.
- Unit tests for pricing, cart quantities, shared quota, attribution, and other important logic.
- Browser/user-flow checks for interactive features, forms, mobile layout, and error states.
- CMS edit/publish/read checks and caching behavior when applicable.
- DataLayer and UTM verification where applicable.
- Security and regression checks; Lighthouse mobile landing evidence when applicable.
If a check is unavailable or fails, disclose it and keep the task unverified. Use `verification-before-completion` and relevant review skills. Stop after the verification report and wait for explicit human acceptance. Human acceptance is separate from technical checks.

Report verification commands and outcomes in the review handoff; keep routine reports, screenshots and browser captures local in ignored paths rather than committing an evidence archive or linking repository documentation to local artifacts. Preserve explicitly required submission artifacts, including the assessment's final Lighthouse screenshot. AI failure records belong in AI_LOG.md under the owner-reporting and owner-verification rules below.

## Time tracking and documentation
Track actual active work, including planning, coding, AI-assisted work, review, debugging, testing, and documentation. Exclude genuine breaks. Record owner and agent contributions separately, but count overlapping active intervals only once in cumulative project time; never sum parallel agents or parallel checks as additional elapsed work. `TIME_LOG.md` contains session-level records; `README.md` must show the cumulative actual working time required by the assessment. Never fabricate time or infer it from commit timestamps. Ask the developer to confirm elapsed time if reliable timing is unavailable. Record planning sessions too, even before any implementation task is verified. After human task verification, reconcile `TIME_LOG.md`, update README cumulative time, task status, and `AI_LOG.md` with genuine evidence. Do not hide time spent on failed or unverified work from the final total.

## Git approval workflow
1. Implement the assigned task.
2. Run and inspect appropriate verification.
3. Report changed files, evidence, failures, open risks, and any pending decisions.
4. Stop and request explicit human verification/acceptance.
5. Confirm actual active time and update `TIME_LOG.md`, `README.md`, task tracker, and `AI_LOG.md` as appropriate.
6. Request separate explicit permission to commit; do not commit until authorized.
7. After authorized commit, record the commit reference in the tracker without silently amending the commit. If recording the hash would require another commit, ask how to proceed.
Keep visible, meaningful, unsquashed Git history. Never push, merge, or deploy without explicit authorization.
Use a Conventional Commits title and a nonempty commit body.

## Assessment documentation and honesty
At submission, README must cover setup, architecture and rationale, assumptions, status, actual working time, deployment/CMS access instructions, tests, Lighthouse screenshot, future improvements, and proposed production marketplace backend/payment webhook/quota/license flow. Build README incrementally as real information becomes available; omit empty sections and placeholders such as "No", "not yet", "not deployed", or "pending" instead of prepopulating every eventual section. Label approved architecture and proposals clearly, and document actual limitations or failed checks when relevant. `AI_LOG.md` must record tools, useful prompts, AI-heavy implementation with edge cases, genuine AI errors and their detection/correction/verification, and work done without AI. Never fabricate mistakes, test outcomes, Lighthouse scores, deployed URLs, or credentials. Mandatory requirements take priority over bonuses.

## AI_LOG lifecycle — explicit owner approval and verification required
- Before adding or expanding any AI_LOG entry, including tools, prompts, failures, contributions or verification outcomes, present the proposed entry to the owner and ask for explicit approval. Owner reporting, task acceptance and fix verification do not independently authorize an addition. Apply removals explicitly requested by the owner without asking again. This gate also governs generic AI_LOG-update instructions elsewhere in the project.
- Fill `AI_LOG.md` incrementally. Before any owner-verified implementation task, include only tools actually used and prompt references explicitly approved by the owner. Do not prepopulate task results, edge cases, verification claims, error examples, or independent-work claims.
- Add implementation contributions, executed edge cases, and verification outcomes only after the owner explicitly verifies and accepts the corresponding task. Automated checks, AI self-review, and reviewer findings do not count as owner verification. Continue running and reporting appropriate technical checks for review; they do not authorize an AI_LOG entry.
- Propose failed-work entries only when the owner identifies or reports the failure, then obtain explicit approval before adding them. Do not independently promote AI/tool/reviewer-detected issues into the failed-work log. Include correction and recovery-verification evidence only after the owner verifies the fix and approves the entry. An approved owner-reported failure may be recorded before the task is accepted, but must not be labeled resolved prematurely.
- Record work done without AI only from the owner's explicit confirmation and after the relevant task is verified. Never infer independent authorship.
- Reference long approved prompts by a repository Markdown link, with a short purpose description. The approved initial planning prompt is `prompts/MASTER_PROMPT.md`; it is a developer reference, not a required agent read. Do not duplicate the full prompt in AI_LOG or treat a saved prompt as an executed implementation task.
- These timing and approval rules govern generic AI_LOG-update wording in task documents and prompt references. Keep required assessment evidence pending until genuine owner-verified evidence exists; never fill a quota of mistakes or prompts with invented entries.
