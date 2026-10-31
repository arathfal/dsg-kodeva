# AI usage log

Filled incrementally under the owner-approval and verification rules in [AGENTS.md](AGENTS.md). T01 was reviewed and accepted by the owner on 2026-10-30 with the documented Studio authentication limitation. T03 was accepted on 2026-11-01.

## Tools used

| Tool | Purpose |
| --- | --- |
| Codex | Assist with assessment planning, project documentation and Git/ignore setup. |
| OpenCode agent (DeepSeek V4.1 Flash) | Takeover implementation, verification and documentation for T03. |
| Shell/Git | Inspect repository files, run checks and manage local repository state. |
| Node / Sanity HTTP API | Run unit tests and verify lead storage, anonymous-read denial and CMS freshness. |
| Web tool | Consult the design reference and official tooling documentation. |
| Skills | Ponytail, verification-before-completion, design-taste-frontend, requesting-code-review, Astro best practices/docs lookup, Sanity best practices, systematic debugging, Playwright CLI and Impeccable used as guidance. |
| Playwright CLI / Chrome | Inspect the assigned task in a browser. |

## Owner-approved prompt references

- [Initial planning prompt](prompts/MASTER_PROMPT.md): the long prompt for preparing assessment planning documents and the execution workflow. The owner approved including this reference; it is not an implementation-task record.

## Owner-approved implementation contributions

T02 — CMS contracts and public reads. Codex assisted with approved Sanity schemas/editor workspaces, shared product identities, typed published-only reads, request-time/no-store configuration, fictional seed material and documentation. Technical checks covered install/lint/typecheck/format, nine Node tests, both builds, live schema validation, draft isolation, publication/slug/unpublish behavior and anonymous lead non-disclosure. The owner reviewed content and invited-Editor access, verified separate publication dates for an original and duplicated article, and accepted T02 on 2026-10-31 with documented limitations. Stored-lead access through Editor, remaining category edge cases, scoped submission credentials and deployed caching remain unverified.

T03 — Campaign landing and stored leads. The OpenCode agent continued the implementation with CMS-driven hero, featured products, testimonials and FAQ sections, a server-validated lead endpoint writing to the private dataset, and an accessible cart icon in the shared header. Edge cases implemented and checked included name/contact combinations, malformed and oversized payloads, non-JSON content types, spam fields, anonymous private-dataset reads, SVG social images rasterized for `og:image`, and CMS edit/publish freshness without redeploy. Checks covered format/lint/typecheck, 14 CMS/contract tests, 7 lead tests, both production builds, and Playwright flows at 320/360/768/1280. The owner accepted T03 on 2026-11-01; Lighthouse, the `/cart` flow, and catalog/blog routes remain deferred to their assigned tasks.

T04 — Blog listing, article detail and publication. The OpenCode agent implemented the `/blog` listing, `/blog/halaman/N` pagination, `/blog/[slug]` detail with a typed server-side Portable Text renderer, related-product links and route-level SEO/canonical/social metadata. Edge cases exercised with temporary CMS records (all later deleted): six-per-page splits, out-of-range/malformed/decimal/zero-padded pages → 404, publish→refresh freshness without redeploy, unpublish and slug-change 404s, draft isolation, no-store headers, uniform card heights and inert disabled hover after owner corrections (D-031/D-032). The owner accepted T04 after a parallel review.

## AI errors detected and corrected (owner-reported)

- The first landing page presented "Pilihan Aplikasi" as a plain list of product links without visual hierarchy. The owner rejected it during visual review. The agent replaced it with product cards (icon, description, features, CTA) and proposed the scoped T02 amendment recorded in D-025 so marketing could edit card content. Browser checks then confirmed CMS-driven card content rendered correctly.
- The agent's testimonial card redesign was still rejected by the owner as visually unbalanced. The owner manually revised the component with a centred, compact layout and separated disclosure. The agent did not redesign it again; it only re-ran type, test, build and focused browser checks, which passed.

## Work done without AI (owner-confirmed)

- The owner manually revised `apps/web/src/components/TestimonialCard.astro` after rejecting the agent's design.
- The owner performed the visual reviews that identified both UI shortcomings and accepted T03.

## Pending owner review

`AI_FAILURE_CANDIDATES.md` is a private, locally ignored queue for AI-failure candidates. It currently holds one AI-detected verification-gap observation that is not part of this log.
