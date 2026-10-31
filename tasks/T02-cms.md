# T02 — CMS content contracts and public reads

## Goal and scope

The approved field, seed and lead specification is included below in [Approved content contract](#approved-content-contract).

Implement approved Sanity content models, marketing editing structure and typed content access, including the chosen publication/freshness policy. Establish product-link and lead-data contracts needed by later tasks; no full landing/blog frontend.

Requirements: R-004, R-005, R-007, R-008, R-010, R-011, R-017. Dependencies: accepted T01; P-004 rendering/cache, P-005 exact schema/contracts, P-006 lead storage/access approvals; authorized Sanity project access. Approved decisions: D-001/D-002/D-004. Load Sanity/content modeling skills; verify version-sensitive behavior with official docs.

## Deliverables and acceptance

- CMS fields cover editable hero/featured products/testimonials/FAQ and article title/unique readable slug/cover/rich text/category/product links/draft-publish. Fixed section layout allowed; no page builder.
- Schema fields, validation, singleton behavior and product-link strategy match explicit approval. Supply approved dummy content with provenance; no invented real customers.
- Typed reads expose published public content only, handle missing/error responses and support future SEO metadata. Draft content/write tokens never reach browser bundles.
- Implement approved server rendering/cache behavior so publishing, new slugs and unpublishing do not require manual deployment; document actual freshness policy.
- Lead storage contract follows approved private-read and editor access policy. Marketing can later inspect records; unauthenticated queries cannot read them. Submission endpoint belongs to T03.

## Verification and edge cases

Run configured lint/typecheck/format/build. In real Studio test field validation, missing images, long text, duplicate slugs, invalid related products, draft/publish/unpublish, and category changes. Read public content before/after publishing without web redeploy and record timing/cache evidence; test draft access by slug and ID. Check anonymous lead reads are denied and intended editor access succeeds. Verify missing config/read failures without logging secrets. Offline/schema-only checks cannot substitute for real CMS checks; keep unavailable checks open.

## Manual review and boundaries

- [x] Non-technical editor can identify and edit all required fields/items (owner content review).
- [x] Publication evidence and draft isolation demonstrated (live API checks; owner editing/publishing review).
- [x] Lead privacy tested against actual dataset permissions (authenticated CLI and anonymous synthetic-record checks; Editor stored-record check remains open).
- [x] Product/content contracts approved and documented.

Out of scope: landing/article page layouts, lead endpoint, visual preview, scheduled campaigns, CMS deployment without authorization.

## Status

Completion: **accepted by owner on 2026-10-31 with the documented verification limitations**. Explicit response: “Saya terima T02”. Available technical checks passed; remaining checks below are not claimed verified. D-015–D-018 approve the rendering/content/lead contracts. Configured project has public `production` and private `leads`; no lasting demo content was imported.

Available checks passed: frozen-lockfile install; lint (including after Vercel build output was excluded); typecheck; format check; nine Node contract tests; both production builds; live temporary-record validation, draft isolation, published edits/new slugs/unpublish without rebuild, and anonymous lead non-disclosure. Temporary records/assets were cleaned up. Local HTTP headers are no-store; the phone-width foundation route has no horizontal overflow and still hydrates only FoundationControls. Code review findings were corrected and re-reviewed.

Owner review: owner confirmed “workspace konten aman” and then “Oke done” in response to the invited-account checklist (sign in, edit/publish content, open Lead Kodeva without access errors). Read-only project inspection confirms a separate Editor member alongside the owner Administrator; no account identity is recorded. Explicit task acceptance was subsequently supplied separately. Lead workspace was empty, so viewing a stored lead as Editor was not separately demonstrated.

Owner also verified native article duplication: the original showed “18 menit lalu” and the newly published copy “23 detik”, confirming a new publication timestamp for the copy while preserving the original.

Open checks: individually reported category-change edge cases, scoped lead submission credential availability and deployed Vercel behavior. Full authenticated browser automation remains unavailable. T03 owns the submission endpoint and credential integration; reviewer access for submission is deferred at the owner’s instruction. Available checks and owner reports do not establish every remaining edge case.

Actual time: see TIME_LOG.md; observed work window includes unseparated approval waits, so active time needs owner confirmation. Owner-authorized implementation commit: `20e8dd3de7e8343af8ebea8b8ddeedf2da13d3de` (`feat(cms): add content contracts and published reads`), with a nonempty body. The owner separately authorized this documentation-only commit to record its reference without amending the implementation commit. The owner separately approved the T02 contribution entry in AI_LOG.md, which has now been added.

## Approved content contract

Direction follows D-015–D-017. Owner explicitly approved this detailed contract through interactive Q&A on 2026-10-31 (D-018). External access and successful permission verification must still be established; demo seed import remains a manual action.

### Content fields and validation

All required strings are trimmed and nonblank. Limits below are characters unless stated otherwise. Editor labels/help use Indonesian. Only the campaign is a singleton (`campaign`); remove its create/duplicate/delete actions and global creation templates. Articles/categories use ordinary generated IDs.

- Campaign: required campaign key (1–80 lowercase letters/digits/hyphens), hero title (1–120), subtitle (1–300), image, CTA label (1–60); fixed CTA destination `/products`. Required editable headings (1–100) for featured products, testimonials and FAQ. Featured product IDs: 1–6 unique valid registry selections. Testimonials: 1–6 embedded entries with quote (1–500), fictional name/business (1–100 each), optional portrait, and visible demo disclosure. FAQ: 1–12 embedded entries with question (1–160) and answer (1–1000). Optional SEO overrides.
- Article: required title (1–160), unique lowercase hyphenated slug (1–96, checked across published/draft siblings while excluding the current document), cover, excerpt (1–300), rich text (1–200 blocks), one required category reference, optional unique related product IDs (0–6) and optional SEO overrides. Native Sanity draft/publish. Slug changes intentionally have no redirects. Rich text supports paragraphs, h2/h3, emphasis/strong, ordered/unordered lists, and http/https links; no raw HTML or embedded scripts. Product links are provided through the related product selections.
- Category: required unique name (1–80), unique lowercase hyphenated slug (1–80). No category hierarchy. Require referenced categories to be published before article publication; unresolved categories make public article content unavailable rather than exposing drafts.
- Images: asset required wherever image is required, alt text (1–180), source/provenance (1–300); hotspot enabled. Optional image objects must be complete when supplied.
- SEO: optional title (1–70), description (1–160), social image. Fallback title: content title plus Kodeva; description: article excerpt or campaign subtitle; image: article cover or hero. Canonical origin comes from configured public site URL, never an editor-entered arbitrary URL.
- Blog read contract: newest publication first with document ID as stable tie-breaker; six per page; empty page one allowed; other nonexistent pages return not-found. Publication time is stored on first publication. Public reads explicitly select approved fields and published documents; no generic caller-provided GROQ or public raw document API.
- Shared product identities only: `kasir` (Kodeva Kasir), `inventori` (Kodeva Inventori), `hr` (Kodeva HR), `payroll` (Kodeva Payroll), `akuntansi` (Kodeva Akuntansi), `laporan` (Kodeva Laporan). Selecting products is editable in CMS; names/prices/packages remain code-owned. T05 supplies full commerce fixtures. Unknown IDs fail validation and public reads rather than producing broken links.

### Approved dummy seed content

All copy/assets are fictional assessment material authored for this project, not real customer claims. Supply a local seed file and explicit manual import instructions; do not automatically upload or overwrite content. Original, simple SVG demo software illustrations provide hero/cover assets; no third-party photography or invented endorsements.

- Campaign key: `promo-akhir-tahun`. Hero title: “Software untuk langkah berikutnya bisnis Anda”. Subtitle: “Jelajahi pilihan aplikasi Kodeva untuk membantu pekerjaan harian usaha Anda. Seluruh penawaran di situs ini adalah simulasi.” CTA: “Lihat katalog”. Headings: “Pilihan aplikasi”, “Cerita usaha contoh”, “Pertanyaan umum”. Featured products: kasir, hr, payroll.
- Testimonial: “Contoh ini menggambarkan bagaimana aplikasi kasir dapat membantu pencatatan penjualan.” Name: “Pemilik Usaha Demo”; business: “Toko Contoh — fiktif”. Disclosure: “Testimoni ilustrasi; bukan pengalaman pelanggan nyata.” No portrait.
- FAQ: “Apakah pembelian di situs ini nyata?” / “Tidak. Katalog dan checkout digunakan untuk simulasi assessment.”; “Bagaimana memilih aplikasi?” / “Buka katalog dan bandingkan kebutuhan usaha Anda dengan informasi produk contoh.”
- Categories: “Operasional” (`operasional`) and “Tim” (`tim`).
- Article: “Menyiapkan pencatatan penjualan usaha” (`menyiapkan-pencatatan-penjualan-usaha`), category Operasional, related kasir/inventori. Excerpt: “Langkah dasar untuk merapikan catatan penjualan dalam contoh usaha.” Body: heading “Mulai dari transaksi harian”; paragraph “Catat transaksi secara konsisten dan tinjau ringkasannya secara berkala. Materi ini merupakan ilustrasi assessment.”
- Article: “Merapikan administrasi tim kecil” (`merapikan-administrasi-tim-kecil`), category Tim, related hr/payroll. Excerpt: “Kenali informasi dasar yang perlu ditata dalam administrasi tim contoh.” Body: heading “Susun data dengan teratur”; paragraph “Gunakan alur kerja yang jelas untuk mencatat kebutuhan administrasi tim. Materi ini merupakan ilustrasi assessment.”
- Seed images use descriptive Indonesian alt text; provenance identifies original Kodeva assessment illustration. No demo lead records containing personal data are seeded.

### Lead data and access contract

- Separate private dataset; separate Studio workspace for leads. Authenticated project editors inspect records; the web browser never connects to this dataset. Studio records are read-only through its UI (no manual creation/publish/duplicate/edit actions). Dataset permissions, not UI settings, enforce privacy. Project administrators retain their administrative abilities.
- Required trimmed name (1–100) and at least one of email (maximum 254, conventional email syntax) or WhatsApp (optional leading `+`, 8–15 digits after removing spaces/dashes/parentheses). Both accepted when valid. T03 performs authoritative server validation; Studio validation does not replace it.
- Stored fields: name, email/WhatsApp supplied, server timestamp, campaign key (maximum 80), optional five UTM strings (source/medium/campaign/term/content, maximum 200 each). Attribution selection/persistence semantics remain P-008; T02 only reserves the fields. No IP address, user agent or analytics PII.
- Basic spam policy for T03: honeypot and bounded server input, single pending submission in UI; no external rate-limit service. Reject invalid input with field errors, report persistence failures without clearing values, report success only after storage. No server-side deduplication or durable abuse-rate guarantee in this demo.
- Dummy assessment submissions only; owner manually deletes test leads after review. No automated retention job. A real launch requires an approved retention/consent policy.
- Use a server-only least-privilege leads write token if the account supports suitable scoped permissions. Do not silently substitute a broad project Editor token; ask if scoped permissions are unavailable. Content reads need no token for the public content dataset. Verify actual plan/dataset/role availability and anonymous denial before calling this secure or complete.

### Verification approach

Use configured checks plus Node 24 built-in assert/test support for important validation/read contract checks; no additional test dependency. Real Studio publish/unpublish, draft isolation, measured freshness and lead access tests are mandatory for acceptance. Do not replace unavailable real checks with mocks. No production deployment is authorized here.
