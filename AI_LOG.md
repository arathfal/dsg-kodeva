# AI Usage Log — Kodeva

This document explains how AI was used during the Fullstack Developer assessment for PT Digital Solusi Grup, what I verified, where the AI output fell short, and which parts I revised myself. AI was an implementation assistant, not the final reviewer or decision-maker. The assessment requirements are documented in [ASSESSMENT_BRIEF.md](ASSESSMENT_BRIEF.md).

## 1. Tools and responsibilities

| Tool | How it was used |
| --- | --- |
| **Codex** | Initial planning, architecture and task documentation, Sanity CMS foundation, and implementation assistance. |
| **OpenCode** (including DeepSeek V4.1 Flash and GLM 5.3 Flash) | Implementation assistance for the landing page, blog, marketplace, cart, checkout, tracking, integration QA, and final submission documentation (T10). Different tasks used different agent configurations. |
| **AI-assisted development skills** | Development guidance for UI design, Astro, Sanity, debugging, code review, and verification; these are instructions/guidance, not separate AI-generated deliverables. |
| **Playwright / Chrome DevTools** | Browser inspection: responsive UI, interaction states, keyboard behavior, user journeys, and Lighthouse. |
| **Node.js tests, shell/Git, and Sanity API/CLI** | Independent checks of business rules, builds, published CMS content, lead storage, and data privacy. |

AI-assisted work followed the project requirements, [DESIGN.md](DESIGN.md), [AGENTS.md](AGENTS.md), and the approved decisions in [DECISIONS.md](DECISIONS.md). I reviewed outputs and requested revisions before accepting implementation tasks.

## 2. Examples of useful prompts and instructions

**1. Initial planning prompt — [MASTER_PROMPT.md](prompts/MASTER_PROMPT.md)**

This is the preserved full prompt used to establish the assessment plan, task breakdown, architecture boundaries, documentation, and approval workflow. Its main benefit was defining the scope and working agreements before implementation began.

**2. Day-to-day task assignment — `Kerjakan task T10`**

Most implementation tasks were assigned using short instructions such as this, rather than repeatedly pasting a long execution prompt. This worked because [AGENTS.md](AGENTS.md), [TASKS.md](TASKS.md), the individual task briefs, [ASSESSMENT_BRIEF.md](ASSESSMENT_BRIEF.md), and [DECISIONS.md](DECISIONS.md) already captured the requirements, dependencies, verification expectations, and approval rules. The agent was expected to consult those files before working on the assigned task.

I also prepared a more detailed reusable [task-execution prompt template](prompts/TASK_PROMPT_TEMPLATE.md) covering code inspection, scope control, desktop/mobile review, testing, actual-time logging, owner verification, and commit authorization. **It was a developer reference, not a prompt automatically read by the agent or pasted in full for every task.** Its value was to make the instructions available when a more explicit handoff was needed.

**3. Focused QA correction — `Kerjakan temuan yang memang masih ranah wajib`**

During integrated QA, I limited the follow-up work to issues required by the assessment brief. The resulting fixes addressed the cart-aware remaining promo-quota display and PNG Open Graph product images, while non-mandatory polish was deferred. See [T09 verification](tasks/T09-quality-release.md) and [TIME_LOG.md](TIME_LOG.md) (S-034B).

**Prompt-record limitation:** Only the complete initial planning prompt and the reusable (not routinely submitted) template were retained as files. Short task assignments and focused corrections are represented by examples supported by the development records or supplied by the developer; I did not reconstruct missing full chat transcripts or claim the template was executed verbatim.

## 3. What AI helped implement

| Area | AI contribution | More detail |
| --- | --- | --- |
| **CMS and content** | Sanity schemas and workspaces, typed published-content queries, CMS-editable campaign sections, lead submission, blog pages and pagination. | [CMS](tasks/T02-cms.md), [Landing and leads](tasks/T03-landing-leads.md), [Blog](tasks/T04-blog.md) |
| **Marketplace** | Product fixtures, six-product catalog, category filters, product/package selection, persistent cart, shared promo-quota rules, and simulated checkout. | [Products](tasks/T05-products.md), [Cart](tasks/T06-cart.md), [Checkout](tasks/T07-checkout.md) |
| **Marketing and QA** | UTM first-touch attribution, GA4-style `dataLayer` events, automated tests, responsive checks, CMS publication tests, and integrated browser journeys. | [Tracking](tasks/T08-tracking.md), [QA](tasks/T09-quality-release.md) |

I did not accept these implementations solely because they compiled or passed automated tests. I also reviewed their rendered UI and tested meaningful user flows.

### Example: AI-assisted cart logic and the edge cases I tested

The cart is a substantial AI-assisted implementation using Zustand persistence and shared TypeScript validation. I specifically checked that:

- Adding the same product and package updates the existing line, while different packages remain separate lines.
- The **promo quota is shared across packages** of the same product, so combining Basic and Pro cannot exceed the product's remaining quota.
- Quantity and subtotal calculations remain correct after editing, removal, and page refresh.
- Invalid, corrupted, or outdated persisted cart data cannot introduce unknown products, forged totals, or over-quota quantities; recovery is shown to the user.
- Cart interactions work via keyboard and at mobile widths, including 320 px and 360 px.

The cart logic has 11 Node tests in addition to browser checks. Checkout was also checked for invalid buyer details, duplicate submissions, empty/stale carts, and deterministic success/failure behavior (17 Node tests). See [T06](tasks/T06-cart.md), [T07](tasks/T07-checkout.md), and [T09](tasks/T09-quality-release.md) for the detailed verification records.

## 4. AI output that I rejected or corrected

The following are **shortcomings I identified during visual and functional review**. The first four concern UI quality or mismatch with the intended design; they are not claims that the underlying business logic was broken. For each, I checked the rendered result rather than relying on the agent's completion report.

### Failure 1 — Featured products were presented as plain links (T03)

**What went wrong:** The first landing page presented **“Pilihan Aplikasi”** as a plain list of product links. It lacked the visual hierarchy and product information needed for a featured-products section, despite being functionally navigable.

**How I found it:** I inspected the landing page in the browser and rejected the section during UI review.

**How it was corrected:** I asked the agent to replace the link list with product cards showing an icon, description, key features, and a CTA. I also approved a scoped CMS change so marketing could edit the cards' descriptions, features, and optional images without changing code-owned product pricing or identity.

**How it was verified:** Browser checks confirmed the cards and their links; a CMS edit/publish check confirmed that revised product-card content appeared on the landing page without redeploying. See [T03](tasks/T03-landing-leads.md) and [DECISIONS.md](DECISIONS.md) (D-025).

### Failure 2 — Testimonial card remained visually unbalanced (T03)

**What went wrong:** The agent's revised testimonial card still did not have the visual balance and composition I wanted for the landing page.

**How I found it:** I reviewed the rendered testimonial section after the agent's redesign and found that the result still needed manual adjustment.

**How I corrected it:** Rather than requesting another redesign, I edited `apps/web/src/components/TestimonialCard.astro` myself, using a more centered, compact presentation with a separate disclosure. The agent did not redesign it again.

**How it was verified:** The agent reran format, lint, type checks, tests, production builds, and focused responsive browser checks against my edited component; I then accepted the landing-page task. See [T03](tasks/T03-landing-leads.md) and [TIME_LOG.md](TIME_LOG.md) (S-020–S-022).

### Failure 3 — Cart UI did not meet the intended layout (T06)

**What went wrong:** The cart felt visually fragmented and did not give the item list and pricing summary the hierarchy I wanted. I asked for a more unified panel and clearer row separation, but the AI-assisted revision still did not match the intended result.

**How I found it:** I reviewed the actual `/cart` page against the project's design direction after the agent's implementation and revision.

**How I corrected it:** I manually revised `apps/web/src/components/CartView.tsx`, including divided item rows, quantity controls, package presentation, and a distinct sticky subtotal area. The agent subsequently performed my requested file split into `CartView.tsx` and `CartRow.tsx` **without changing the layout**.

**How it was verified:** Cart tests and production builds passed again. Browser checks covered interactions and 1280 px / 360 px layouts without horizontal overflow. See [T06](tasks/T06-cart.md) and [TIME_LOG.md](TIME_LOG.md) (S-026–S-028).

### Failure 4 — Payment success UI did not match the intended presentation (T07)

**What went wrong:** The agent's successful-payment screen worked functionally, but its layout and visual emphasis still did not match the intended focused confirmation state. Further AI-assisted adjustments were not satisfactory.

**How I found it:** I completed the simulated payment flow and inspected the rendered success state.

**How I corrected it:** I manually revised the confirmation panel in `apps/web/src/components/CheckoutView.tsx` into the centered **“Checkout berhasil”** card. I then directed the agent to make only specific structural changes—hide surrounding headers on success, vertically center the panel, and split the component while retaining my design—instead of asking it to redesign the UI again.

**Related requirement mismatch:** Even after I explicitly requested a **success-only view**, the agent's success branch could still render `NoticeList` for a recovered cart. I noticed this in review and instructed the agent to remove it from the success branch while preserving notices in the cart and checkout form. This was recorded as internal candidate C-001, not counted as a separate headline failure.

**How it was verified:** Checkout tests, builds, and browser checks passed. A recovered-cart scenario verified that notices remained on the applicable screens but were absent on payment success; checks also covered header visibility, cart clearing, and responsive layout. I accepted the corrected result. See [T07](tasks/T07-checkout.md) and [TIME_LOG.md](TIME_LOG.md) (S-030–S-032).

### Failure 5 — Catalog filter bar did not match the intended design and interaction (Bonus)

**What went wrong:** The first optional-bonus implementation of the catalog's shareable search/filter/sort state worked functionally (URL-reflected `kategori`, `q`, and a price-sort parameter), but its layout — a plain search form with a visible "Cari" button and separate chip rows plus a stack of sort links — did not match the intended design, and search required a manual submit instead of behaving in real time. The industry-standard parameter naming (`urutan=harga-naik|harga-turun`) was also not what I wanted; the price-sort parameter should read `harga` with values `termahal|termurah`.

**How I found it:** I reviewed the rendered catalog against my reference layout ("Modern Kodeva Product Filter Bar.png") after the agent completed and self-verified the first version.

**How it was corrected:** The agent was instructed to follow the reference layout with no icons on category chips, make search real-time (no button, debounced), and rename the price-sort parameter to `harga=termahal|termurah`. The agent rebuilt the region as a full-width rounded search input with a magnifier icon, one row of category chips plus an `Urutkan:` picker and a "Menampilkan N produk" count line, added a ~300 ms debounced script that navigates typed searches (and submits picker changes) by GET — so the URL remains the source of truth — with a `noscript` fallback button, and updated the fixtures/tests to the new parameter values. Two implementation slips caught by checks along the way: a nested JSX ternary was rejected by the Astro/eslint parsers and restructured to flat conditionals, and an initial change also silently reordered the default catalog view until a browser snapshot caught it; both were fixed and re-verified before handoff.

**How it was verified:** Format/lint/typecheck stayed clean; the catalog suite passed 15/15 with all other suites unchanged; production builds passed. Browser checks confirmed that typing navigated after the debounce to the expected URLs, that the picker appended `harga=termahal`, that chips preserved `q`/`harga`, that unknown category values still returned 404 and unknown sort values fell back to the default order, and that desktop and 320 px renderings of the new bar had no horizontal overflow. Owner acceptance of the bonus task remains separate. See [TIME_LOG.md](TIME_LOG.md) (S-036–S-036A) and [DECISIONS.md](DECISIONS.md) (D-048–D-049).

### Failure 6 — Text inputs were reimplemented repeatedly instead of extracted into a reusable component (Bonus)

**What went wrong:** While building the catalog filter bar, the AI duplicated the text-input markup (styling class, size/spacing variants) instead of wrapping it behind a reusable component — the same pattern already existed in `CheckoutForm.tsx` and `LeadForm.tsx` before it.

**How I found it:** I flagged it while reviewing the catalog filter-bar changes and directed that inputs become a shared component (2026-11-01).

**How it was corrected:** The agent extracted a reusable `Input` — `apps/web/src/components/Input.astro` for the server-rendered search bar and `apps/web/src/components/Input.tsx` (one shared class contract) for the checkout and lead forms — and left deliberately bespoke inputs raw: the checkout simulation radios (custom layout) and the honeypot field (deliberately unstyled). Rounded corner tokens were also unified at the same time so buttons and inputs read 8px while pill-shaped controls (category chips, badges, the sort trigger) stay fully rounded; the radius/border restyling itself is not itemized in this log.

**How it was verified:** Format/lint/typecheck stayed clean (one real `astro check` error in the new component — an over-wide `type` attribute union — was caught by the check and narrowed to the HTML input kinds it serves); catalog suite 15/15 and all other suites unchanged; build clean; browser checks read computed radius values on the catalog search input, the lead-form input, chips and the sort trigger to confirm the intended mixing of the 8px controls and pills. See [TIME_LOG.md](TIME_LOG.md) (S-036D) and [DECISIONS.md](DECISIONS.md) (D-052).

## 5. What I implemented myself, without AI-generated layout code

I chose to take direct control of these UI details because iterating manually was faster than further prompting and let me make precise visual decisions:

- **Testimonial card:** manually edited `apps/web/src/components/TestimonialCard.astro` after rejecting the agent's revised card layout.
- **Cart layout:** manually revised `CartView.tsx` after the AI-generated layout and its refinement were still unsatisfactory. The agent later split the file without changing the owner-authored composition.
- **Payment-success presentation:** manually revised the success panel in `CheckoutView.tsx`. The agent's follow-up work was limited to my explicit structural instructions and verification.

This does **not** mean I implemented the whole cart or checkout without AI. Their business logic, state handling, and tests were substantially AI-assisted. My independent work was primarily the final UI composition and the decision to reject intermediate designs.

## 6. Final verification and limitations

The project passed the recorded format, lint, typecheck, build, and six automated test suites (**109 passing Node tests**). Integrated browser checks covered CMS publication, lead capture, marketplace flow, UTM attribution, responsive behavior, and simulated payment states. The deployed landing page recorded a **Lighthouse mobile Performance score of 100** in the final submitted evidence (developer run, 1 November 2026; QA-era runs ranged 97–99). Verification details and limitations are in [README.md](README.md), [T09](tasks/T09-quality-release.md), and [TIME_LOG.md](TIME_LOG.md).

The checkout is intentionally simulated and does not integrate a real payment gateway or marketplace order backend, as permitted by the assessment brief. This log records the corrections supported by the development notes; it is not a claim that every AI mistake or every prompt was archived.
