# Task tracker

Planning draft: decomposition P-001 awaits explicit approval. No implementation task has been assigned or started. Git/.gitignore setup was independently requested and is recorded in TIME_LOG.md.

Workflow: **proposed → ready → in progress → review → accepted**. Use **blocked** with a stated prerequisite when necessary. “Ready” requires approved scope/decisions and accepted dependencies; starting still requires explicit assignment. Verification is separately recorded as not run / failed / passed / unavailable. Human acceptance never follows automatically from passed checks.

| ID | Task / objective | Dependencies | Requirements | Status | Verification | Acceptance | Actual active time | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P00 | Planning documentation and workflow | D-002 | All mapped | review | Document audit passed; human review pending | Pending | See TIME_LOG.md | None |
| T01 | [Foundation](tasks/T01-foundation.md): pnpm apps, tooling, approved design primitives | P-001/002/003; test tooling part of P-009 if installed | R-001/002/004/005/018/022 | proposed | Not run | Pending | Not measured; not started | None |
| T02 | [CMS contracts](tasks/T02-cms.md): content models, public reads, publish policy | T01; P-004/005/006 | R-004/005/007/008/010/011/017 | proposed | Not run | Pending | Not measured; not started | None |
| T03 | [Landing and leads](tasks/T03-landing-leads.md): CMS sections and stored submissions | T02; approved P-006 and attribution payload contract P-008 | R-004/005/006/007/008/017/018/019/021/022 | proposed | Not run | Pending | Not measured; not started | None |
| T04 | [Blog](tasks/T04-blog.md): pagination, articles, SEO and live publication | T02 | R-004/009/010/011/017/018/022 | proposed | Not run | Pending | Not measured; not started | None |
| T05 | [Catalog and details](tasks/T05-products.md): fixtures, category filter and plans | T01; T02 product contract; P-007 | R-004/006/012/013/015/017/018/022/023 | proposed | Not run | Pending | Not measured; not started | None |
| T06 | [Cart](tasks/T06-cart.md): persistence, quantities, totals and shared quota | T05; P-007 and approved logic test tooling | R-004/014/015/017/018/023 | proposed | Not run | Pending | Not measured; not started | None |
| T07 | [Checkout](tasks/T07-checkout.md): buyer validation, order payload, simulation | T06; P-007 and attribution payload contract P-008 | R-004/015/016/017/018/021/023 | proposed | Not run | Pending | Not measured; not started | None |
| T08 | [Attribution and analytics](tasks/T08-tracking.md): wire complete journeys | T03, T04, T07; P-008 | R-004/020/021 | proposed | Not run | Pending | Not measured; not started | None |
| T09 | [Integration and release QA](tasks/T09-quality-release.md): mobile, security, freshness, Lighthouse, authorized deployments | T03, T04, T08; deployment approval/access | R-002/003/004/005/006/011/017/018/019/020/021/022 | proposed | Not run | Pending | Not measured; not started | None |
| T10 | [Submission documentation](tasks/T10-submission.md): evidence, limitations and backend proposal | T09; developer time and independent-work evidence | R-001/002/003/004/005/024 | proposed | Not run | Pending | Not measured; not started | None |

Suggested execution order is table order; dependencies allow separate review of content and commerce. Never start the next row automatically. Cross-cutting R-004 logging applies to every implementation task. Each task's own acceptance is scoped: T03 checks the catalog href, T05/T09 its working destination; early content tasks check the visible cart link, T06/T09 its destination/count/flow. Final R-021 attribution remains open until T08/T09 even if T03/T07 payload interfaces pass. Record these deferred integrations explicitly rather than marking them as tested early.

After explicit human acceptance, reconcile TIME_LOG.md, README cumulative time, AI_LOG.md and task status before requesting separate commit permission. After an authorized commit, ask how to record its hash if that would need an additional commit; never silently amend. No estimates in actual-time fields. Elapsed planning and failed verification time still count.
