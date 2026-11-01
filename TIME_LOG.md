# Working time — Kodeva assessment

Work began on **October 30, 2026**. The assessment deadline was **November 1, 2026 at 15:00 WIB**. The table below is a reconciliation of **recorded or developer-confirmed work windows**, not a claim that every minute of the project's actual active work was continuously timed.

## Recorded work summary

| Workstream | Recorded duration | Session references |
| --- | ---: | --- |
| Planning and T01 foundations | 44m 54s | S-001–S-009 |
| T02 — CMS | 38m 38s | S-010–S-018; includes separately confirmed 6m owner review |
| T03 — landing and leads | 44m 02s | S-018A–S-022; includes owner-confirmed 12m initial work |
| T04 — blog | 32m 20s | S-023–S-023B |
| T05 — catalogue and details | 19m 58s | S-024 |
| T06 — cart | ~25m 25s | S-025–S-026; later owner editing/split S-027–S-028 partly untimed |
| T07 — checkout | ~39m 44s | S-029–S-031; S-032 and owner edits unquantified |
| T08 — marketing attribution | ~5m 17s | S-033 stamped portion; earlier reading/approval and tail untimed |
| T09 — integrated QA and deployment checks | ~56m | S-034, S-034B, S-034C, S-034D |
| T10 — submission documentation | ~23m | S-035; owner-confirmed 2026-11-01 (window 10:30–10:53 WIB); acceptance/commit tail untimed |
| **Total of the recorded windows above, including T10** | **~5h 29m 18s** | Partial total, not final actual-active total |

**Important:** this total intentionally excludes unknown/untimed portions and **does not mean those portions took zero time**. Some observed agent work windows also contained short approval/tool waits that were not separately measurable. It would therefore be misleading to present `5h 06m 18s` as the complete actual active work duration required in the assessment README without developer reconciliation.

## How working time was counted

- Work includes planning, implementation, developer review, debugging, testing and documentation; breaks and identifiable approval waiting are excluded.
- Agent and developer work that ran **at the same time** is counted once in the combined elapsed-work total, not added together.
- The six-minute T02 owner editing review was explicitly confirmed **not to overlap** agent work and is included once.
- Approximate observed windows are labeled `~`. An incomplete start/end time or unseparated waiting is disclosed rather than silently converted into a precise duration.
- Developer-authored changes to the testimonial card, cart layout and payment-success panel are represented in the session history. Their **untimed manual editing** is not fabricated into the total.

## Session index and important milestones

| Period | Sessions | Main work / evidence |
| --- | --- | --- |
| Oct 30 | S-001–S-009 | Brief, architecture, agent rules, tooling and initial foundation; owner acceptance of T01 |
| Oct 31 | S-010–S-018, S-018A | Sanity models, Editor/content reviews, lead work and initial landing implementation |
| Nov 1 — early | S-019–S-024 | Landing visual corrections, blog and catalogue; owner acceptance and browser/contract checks |
| Nov 1 — cart | S-025–S-028 | Cart persistence/quota tests, developer's manual cart design, safe agent component split |
| Nov 1 — checkout | S-029–S-032 | Mock order/checkout checks, developer's manual success design, notice removal and centering |
| Nov 1 — tracking | S-033 | UTM capture, dataLayer events, end-to-end verification |
| Nov 1 — QA and deployment | S-034–S-034D | Full journeys, mandatory fixes, deployed Vercel/Sanity verification, Lighthouse mobile 99 |
| Nov 1 — submission | S-035 | README/AI log/document audits, clean-checkout setup verification, secret/artifact checks; owner-confirmed ~23m, acceptance/commit tail untimed |

All original session timestamps, task-specific notes, owner confirmations and verification context are preserved **without rewriting** in [TIME_LOG_DETAILS.md](TIME_LOG_DETAILS.md). That file is the audit trail behind this readable summary.

## Reconciliation status for final submission

The T10 documentation duration was confirmed by the developer on 2026-11-01: **about 23 minutes** (observed window 10:30–10:53 WIB); the acceptance, documentation, and upcoming commit/submission tails were not continuously timed and are not counted as zero. The remaining genuinely unknown portions are the earlier owner-side UI-editing windows and various small handoff tails, so the ~5h 29m 18s figure above stays a **partial total of recorded or developer-confirmed windows**, not a guaranteed complete active-work total. Do not replace it with a guessed overall duration.
