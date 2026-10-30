# Initial planning prompt

Developer reference approved for linking from AI_LOG.md. This preserves the initial planning request with the owner-authorized Markdown source correction. Current AGENTS.md governs execution and AI_LOG update timing; older general logging wording below does not override it. This file is not a required agent read.

You are a senior software architect, technical lead, and AI-assisted development workflow designer.

Your assignment is to prepare the complete planning documentation and execution workflow for a Fullstack Developer technical assessment from PT Digital Solusi Grup (DSG).

**IMPORTANT: This is a PLANNING-ONLY task. Do not implement application features yet.**

## 1. Source of truth

First, read the provided assessment: `ASSESSMENT_BRIEF.md`.

Use the original assessment brief as the authoritative source of requirements.

Do not invent requirements, omit mandatory requirements, or silently resolve ambiguity.

Distinguish clearly between:
- Explicit assessment requirements
- Technical and architectural decisions already approved by the developer
- Proposed decisions awaiting approval
- Optional improvements

If the `ASSESSMENT_BRIEF.md` is unavailable, stop and ask me to provide it. Do not reconstruct the requirements from memory or assumptions.

## 2. Project context

The project is a fictional software business called **Kodeva**, featuring the "Promo Akhir Tahun" marketing campaign.

The application includes:
- CMS-managed marketing landing page
- CMS-managed blog
- Lead capture
- Frontend-only mini marketplace
- Product catalog and product details
- Package selection
- Persistent shopping cart
- Shared promotional license quota validation
- Mock checkout and payment simulation
- Marketing attribution and GA4-style dataLayer tracking
- SEO, responsive UI, and mobile performance

All mandatory requirements and acceptance criteria must come from the `ASSESSMENT_BRIEF.md`.

The assessment is designed for approximately 6–8 hours of actual work. Prioritize mandatory requirements, reliable functionality, verification, and documentation over unnecessary complexity.

## 3. Previously approved architecture

The following architectural direction has already been discussed and approved:

- Monorepo using pnpm workspaces
- `apps/web`: Astro + React integration (`@astrojs/react`)
- Astro for content-oriented and server-rendered pages
- React Islands for interactive commerce functionality
- TypeScript
- Tailwind CSS
- Zustand with persistence for shopping cart state
- `apps/studio`: Sanity Studio
- Sanity Content Lake for CMS content
- Vercel for Astro deployment
- Sanity-hosted deployment for Studio
- No unnecessary orchestration tooling such as Turborepo or Nx

The codebase should maintain a clear separation between marketing, content, and marketplace responsibilities without splitting them into unnecessary independent applications.

The visual design direction is **modern SaaS**, using Stripe's DESIGN.md from the VoltAgent awesome-design-md repository as a starting reference:

https://github.com/VoltAgent/awesome-design-md/tree/main/design-md

Verify that the selected reference exists and inspect its actual content before adopting it.

Treat the reference as inspiration, not a design system to copy blindly. Adapt it to create a coherent identity for Kodeva.

Do not introduce additional frameworks, dependencies, services, infrastructure, or architectural patterns without my approval.

If any previously approved decision conflicts with an explicit assessment requirement, report the conflict and ask before proceeding.

## 4. Decision-making policy — STRICT

**You are not authorized to make new project decisions independently.**

This applies to:
- Architecture changes
- Dependencies and libraries
- Data modeling choices
- API design
- CMS schema behavior
- Authentication and security approaches
- UI/UX direction and design tokens
- State management behavior
- Caching and revalidation strategy
- Error handling behavior not already specified
- Business rules and ambiguous requirements
- Deployment configuration
- Testing strategy changes
- Scope modifications
- Additional features
- Any other substantive technical or product decisions

Do not treat conventional defaults or popular best practices as authorization.

Whenever a decision is needed:

1. Explain the question or ambiguity.
2. Present reasonable options, preferably two or three.
3. Explain the tradeoffs briefly.
4. Recommend an option with justification.
5. Ask for my explicit approval.
6. Record the approved decision before implementing it.

You may handle purely mechanical operations that follow existing approved decisions, but must not introduce new behavior, architecture, design direction, or requirements.

Group related questions to avoid unnecessary interruptions.

If a decision blocks the current task, stop at that boundary. Do not silently choose a default.

Maintain a `DECISIONS.md` document containing:
- Decision ID
- Context
- Options considered
- Approved decision
- Rationale
- Status
- Related tasks

Distinguish approved decisions from pending proposals.

Never mark a decision as approved without my explicit confirmation.

## 5. Documentation to create

Create the following documentation structure, keeping it concise, useful, and free of unnecessary duplication.

### `PRD.md`

Translate the assessment brief into an implementation-oriented product requirements document.

Include:
- Product overview and objectives
- User roles and primary user journeys
- All mandatory functional requirements
- Non-functional requirements
- CMS and marketing requirements
- Marketplace business rules
- Validation and error states
- Performance and SEO requirements
- Analytics and UTM attribution requirements
- Security considerations
- Acceptance criteria
- Optional versus mandatory requirements
- Open questions and dependencies

Use stable requirement IDs so every task can reference the corresponding requirements.

Do not reinterpret ambiguous requirements without approval.

### `DESIGN.md`

Create a practical design specification for Kodeva, based on the approved visual direction.

Include:
- Visual identity and design principles
- Typography
- Color tokens
- Spacing and layout principles
- Responsive breakpoints or responsive design rules
- Shared UI patterns
- Buttons, inputs, cards, navigation, and feedback components
- Marketing landing page direction
- Blog design direction
- Marketplace design direction
- Loading, empty, and error states
- Mobile usability and accessibility
- Visual consistency rules

Inspect the referenced DESIGN.md before using it.

Any specific design decisions not already approved, such as exact colors, fonts, or component treatments, must be presented for approval before being finalized.

Do not build a large design system for such a small assessment.

### `AGENTS.md`

Create strict development instructions for Codex and other AI coding agents.

This file must establish:
- Requirement priority and source hierarchy
- Mandatory reading of relevant project documents
- Decision approval rules
- Scope boundaries
- Coding standards
- TypeScript requirements
- Astro and React Islands conventions
- CMS integration conventions
- Security rules
- Environment variable and secret handling
- Dependency approval rules
- Testing and verification requirements
- Documentation update rules
- Git and commit rules
- Time tracking requirements
- AI usage logging requirements
- Task completion and handoff workflow

**Non-negotiable rule: No task may be committed before it has been verified and explicitly approved by me.**

A successful build alone is insufficient verification.

Never perform a Git commit, squash, merge, push, or deployment without explicit authorization.

Do not continue to another task automatically.

### `README.md`

Create an initial README structure containing the sections required by the assessment.

Include:
- Project overview
- Features
- Technology stack and rationale
- Architecture overview
- Local development instructions
- Environment variables
- Deployment information
- CMS demo access instructions
- Technical decisions and assumptions
- Actual implementation status
- Verification and testing
- Actual working time
- Marketplace backend integration proposal
- Secure payment, webhook, quota consistency, and license fulfillment considerations
- Lighthouse mobile results and screenshot reference
- Limitations
- Improvements with one additional week

Initially use clearly marked placeholders where implementation evidence is not yet available.

Do not fabricate results, test coverage, Lighthouse scores, deployment URLs, credentials, or working time.

Avoid putting real passwords or sensitive credentials in the repository.

### `AI_LOG.md`

Create a template matching the assessment requirements.

Include:
- AI tools used and their purposes
- Meaningful prompt examples
- Actual AI-assisted implementation work
- Edge cases tested
- Real AI mistakes or omissions
- Detection, correction, and verification evidence
- Work intentionally completed without AI
- Reasons for independent implementation

The assessment requires at least two examples of actual AI mistakes or inadequate outputs.

**Never fabricate mistakes just to satisfy this requirement.**

Record real problems when they occur. If fewer than two are observed, accurately document that limitation.

### `TASKS.md`

Create a master implementation tracker containing:
- Ordered tasks
- Task IDs
- Task titles
- Objectives
- Dependencies
- Requirement coverage
- Current status
- Verification status
- Approval status
- Actual working time
- Commit reference after approval and commit

Use a clear and minimal task status workflow.

### `tasks/`

Create one concise Markdown file per implementation task.

Each task must include:
- Task ID and title
- Goal and scope
- Related PRD requirement IDs
- Dependencies
- Approved decisions relevant to the task
- Expected deliverables
- Acceptance criteria
- Verification plan
- Important edge cases
- Manual review checklist
- Out-of-scope items
- Completion and approval status
- Actual working time
- Commit reference once available

Do not turn tasks into excessively detailed line-by-line coding instructions.

### `TIME_LOG.md`

Maintain an auditable record of actual work sessions.

Include:
- Task ID
- Date
- Work session start and end if reliably known
- Actual active duration
- Verification and debugging time
- Notes

Use real elapsed active time, not estimates.

If timing cannot be measured reliably, ask me to provide or confirm the actual duration.

Never invent timestamps or durations.

After each task is verified, update the cumulative actual working time in `README.md` from the validated time log.

Time tracking must reflect actual work rather than planned task duration.

### `TASK_PROMPT.md`

Create a reusable, English-language prompt template for executing one task using Codex.

The template must instruct the agent to:

1. Read `AGENTS.md`.
2. Read the assigned task file.
3. Read relevant sections of `PRD.md`, `DESIGN.md`, and `DECISIONS.md`.
4. Inspect the existing implementation.
5. Identify unresolved decisions and ask before implementation.
6. Implement only the assigned task.
7. Avoid unrelated refactoring or additional features.
8. Execute appropriate verification.
9. Report changed files, tests, results, and remaining risks.
10. Update task documentation and AI usage notes with truthful evidence.
11. Request actual working time if necessary.
12. Stop for human review.
13. Wait for explicit verification and commit approval.
14. Update README working time after verification and before the approved commit.

Include placeholders such as `{TASK_ID}` and `{TASK_FILE}`.

Make the execution prompt short enough to reuse easily. The project documents should provide the detailed context.

## 6. Task decomposition rules

Break implementation into a manageable number of **medium-sized, independently reviewable tasks**.

Avoid:
- One task for every tiny component
- Tasks that cover several unrelated application areas
- Tasks that require reviewing almost the entire project at once
- Excessive dependencies between tasks
- Artificially splitting work just to increase the number of commits

Prefer roughly 8–11 implementation tasks unless the requirements justify a different number.

Aim for tasks that produce coherent, testable increments.

Suggested grouping to evaluate and refine:

1. Monorepo foundation, application setup, and design foundations
2. Sanity schemas, content structure, and CMS integration
3. Landing page, editable campaign content, and lead capture
4. Blog listing, article details, CMS publishing behavior, and SEO
5. Marketplace catalog and product detail interactions
6. Shopping cart, persistence, pricing, and shared promotion quota
7. Checkout flow, validation, mock payment, and application states
8. GA4-style tracking and UTM attribution across user journeys
9. Integration testing, responsive QA, performance, and deployment
10. Final documentation, Lighthouse evidence, and submission readiness

These are candidate groupings, not immutable requirements.

Refine their boundaries according to:
- Cohesive responsibility
- Dependency order
- Ease of human review
- Meaningful acceptance criteria
- Realistic assessment scope
- Risk of integration failures

You may propose different task boundaries, but obtain my approval for the final decomposition before implementation.

Do not create separate tasks for trivial items that naturally belong together.

Prioritize mandatory requirements ahead of bonuses.

## 7. Verification before commit — MANDATORY

Every implementation task must pass an appropriate verification gate.

Verification must include, where relevant:
- TypeScript checks
- Linting
- Production build
- Unit tests for business rules
- Integration or browser-based testing
- Form validation checks
- Loading/error/empty state checks
- Responsive UI inspection
- CMS functionality checks
- Data persistence checks
- UTM attribution checks
- DataLayer event verification
- Security and environment variable checks
- Regression checks against existing functionality

Choose verification appropriate to each task. Do not run irrelevant checks merely to claim a comprehensive test suite.

For critical business logic, test edge cases explicitly.

For example, the shared promotional quota must be validated against the total quantity across different package variants of the same product.

A task is not verified merely because:
- Files were generated successfully
- The development server starts
- Tests exist but were not executed
- AI claims the implementation is correct
- A build succeeds while functional requirements remain untested

If a check cannot run, report why and mark it as unverified.

**Required workflow:**

`Implement → Test → Review results → Human verification/approval → Confirm actual time → Update README/TIME_LOG → Authorized commit`

Before asking for commit authorization, provide a concise verification summary.

Do not commit unfinished or unverified tasks.

Do not squash commits. Maintain meaningful, visible commit history.

If verification fails, fix the issue and rerun the relevant checks before requesting approval.

## 8. Documentation and time tracking workflow

After each task:

1. Summarize what was implemented.
2. Show verification evidence.
3. Identify remaining risks or incomplete work.
4. Ask me to verify and approve the task.
5. Once approved, obtain or confirm actual active working time.
6. Update `TIME_LOG.md`.
7. Update the cumulative actual working time in `README.md`.
8. Update the task status and relevant `AI_LOG.md` entries.
9. Request explicit permission to commit.
10. Commit only after permission is granted.
11. Record the commit reference in the task tracker.

Do not mark a task completed while its required verification is still pending.

Documentation should reflect the actual state of the project, never the intended state.

## 9. Scope and quality priorities

Use the assessment's evaluation criteria to guide prioritization.

Focus on:
- Correct functional behavior
- Clear TypeScript code
- Validation and error handling
- Important business logic edge cases
- CMS usability for non-technical marketing users
- Mobile performance
- SEO and marketing tracking
- Proportionate architecture
- Accurate and honest documentation

Pay particular attention to:
- Shared promotional quotas across packages
- Cart persistence and hydration
- CMS publication without manual website redeployment
- Secure server-side lead handling
- Draft versus published content
- UTM persistence across navigation
- GA4 event deduplication
- Responsive mobile experience
- Lighthouse mobile performance target
- SEO metadata and social sharing previews
- Marketplace backend proposal despite frontend-only implementation

Do not implement bonus features until mandatory requirements have been verified and I approve the additional scope.

## 10. Required behavior for this planning run

For this first execution:

1. Inspect the assessment `ASSESSMENT_BRIEF.md`.
2. Inspect the existing repository and documents, if any.
3. Check the proposed design reference.
4. Identify missing information and unresolved decisions.
5. Prepare the necessary Markdown planning documents.
6. Create a coherent task decomposition.
7. Create the reusable task execution prompt.
8. Review the documents for contradictions, omissions, and duplicated requirements.
9. Map every mandatory assessment requirement to at least one task and acceptance criterion.
10. Present a concise summary of the generated files, task boundaries, and decisions requiring my approval.

**Do not install dependencies, scaffold applications, implement features, deploy services, or commit anything during this planning run.**

You may draft proposed decisions, but you must not finalize unapproved decisions or represent them as approved.

If a missing decision prevents a document from being finalized, leave the affected section explicitly marked as pending approval.

Conclude by presenting:
- Created/updated document list
- Proposed ordered task list
- Requirement coverage summary
- Pending decisions
- Recommended first implementation task

Then stop and wait for my review and approval.
