# Kodeva design specification

Status: **P-003 option A approved in D-009**. The owner approved the tokens, system typography, responsive rules and shared component treatments below. Screen-specific compositions remain proposals for their assigned tasks. T01 implements only the shared foundation.

## Reference and scope

Inspected the actual [VoltAgent Stripe reference](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/stripe/DESIGN.md) on 2026-10-30. It uses light surfaces, dark text, a vivid primary, product imagery and expressive typography. It is inspiration, not evidence of Kodeva token approval or font licensing. DESIGN.md is the single project design specification; the external reference is linked here without a duplicate local copy.

Taste Skill is advisory and constrained by the approved direction and assessment. Do not use random direction draws to replace the brand, add features or expand scope. The owner reviewed and accepted the T01 foundation on 2026-10-30; future screen-specific designs remain subject to their assigned tasks and approvals.

## Identity and page argument

Kodeva serves Indonesian UMKM comparing POS, HR/payroll and supporting software. Make package, price and remaining promotional license quantity easy to understand on a phone. Product imagery supplies evidence; dummy testimonials must be recognizable as fictional demo content.

Proposed idea: the small business's software choice becomes a clear package comparison and purchase path. Carry campaign identity through landing, article recommendations, detail and checkout without extra decorative interactions.

Required landing argument: hero explains the offer and links to catalog; featured products show choices; testimonials provide demo social proof; FAQ resolves purchasing questions; lead form allows contact. Composition/order remain proposed; preserve all required editable content.

## Approved tokens (D-009)

Approved P-003 option A uses system fonts without extra downloads. A custom font would require a new approval.

| Role | Approved value | Use |
| --- | --- | --- |
| Font | system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif | One family; tabular figures for prices/counts |
| Primary / hover | #533afd / #4434d4 | Main actions and links |
| Ink / secondary | #0d253d / #273951 | Text |
| Canvas / soft | #ffffff / #f6f9fc | Surfaces |
| Border | #a8c3de | Input/card boundary where needed |
| Error / success | #b42318 / #166534 | Feedback with words, never color alone |
| Focus | #533afd | Outline with separation from surrounding surface |
| Type | Body 16px/1.6; small 14px/1.5; section 28–40px/1.15; hero 36–56px/1.08 | Body 400, headings 600; final fit checked in browser |
| Space | 4, 8, 12, 16, 24, 32, 48, 64, 96px | Shared spacing relationships |
| Radius | Inputs 6px; cards 12px; buttons 9999px | Shared treatments |
| Container | Up to 1200px; gutters 16px phone, 24px tablet, 32px desktop | Equal outer margins and aligned content |

Check actual foreground/background contrast before implemented UI approval. Do not copy thin reference body type or accessibility claims untested. Approved minimum control size is 44×44px for comfortable tapping; this alone does not establish WCAG conformance.

## Layout and responsiveness

Approved shared rules use mobile-first, content-driven layout with 768px/1024px transitions where useful. Screen-specific grid and composition choices below remain proposals. Phones use one content column; tablet product grids may use two, desktop three. Articles stay around 65 characters per line. Cart/checkout stack on phones; summaries remain readable without page overflow.

Review at 360px, 768px, 1280px and a 320px stress width; these are review viewports, not additional CSS breakpoints. Hero may use copy beside a lightweight product screenshot on desktop, then copy/action before image on mobile. A static color wash needs approval and a measured performance budget; the reference mesh is not mandatory. Separate sections clearly without identical card grids everywhere. No animation dependency proposed.

## Shared patterns

- Navigation: Kodeva wordmark, landing/blog/catalog links, visible cart link/count on every public route. Proposed mobile menu is keyboard-operable with explicit expanded state and focus behavior; cart remains reachable. No customer sign-in required.
- Actions: one clear primary per decision area; useful text labels; visible hover/focus/pressed/disabled/pending states. Links navigate; buttons change state.
- Forms: persistent labels, appropriate types/autocomplete, clear required fields, associated errors/help, values retained on failure. Prevent duplicate pending submissions and announce relevant status.
- Cards: meaningful image/name/price/destination; avoid nested buttons/links; consistent currency/quota language.
- Feedback: relevant inline errors/status, useful empty-state next steps and retry where possible. Preserve focus and avoid color-only messages.

## Screens

Landing: CMS owns section text/images/items. Keep CTA/campaign visible early. Prioritize hero image, lazy-load lower images, provide dimensions and alternatives; optimize using real Lighthouse evidence.

Blog: readable headings/cover/body, category labels, pagination and related product links. Rich text uses semantic headings/lists/links. Draft/missing content gets safe not-found behavior.

Catalog/detail: consistent screenshots, usable category filter/empty result, Basic/Pro/Business selection alongside current/original promo prices and shared remaining quota. Package controls expose selection to keyboard/assistive technology and update price immediately.

Cart: package, license unit, integer quantity, line totals and subtotal. Explain shared quota across variants. Distinguish restoring persisted state from empty state. Make approved stale-cart recovery visible and actionable.

Checkout: buyer name/email, accurate summary, clearly identified simulation, pending state and distinct success/failure recovery. Never send buyer data to analytics. Retry/cart clearing follow P-007.

## Review and consistency

Review landmarks/headings, image alternatives, visible focus, labels/errors, keyboard order, zoom/reflow, contrast and tap targets. Respect reduced motion if motion is later approved. Check long CMS titles/prices, missing images and errors on phones. Reuse shared tokens across content/commerce; substantive polish requires approval. Final critique uses Impeccable and browser evidence uses Playwright CLI after implementation.
