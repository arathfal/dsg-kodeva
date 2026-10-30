# Execute one task

Copy and fill this English prompt. This file is a developer reference, not a required agent read.

```text
Execute {TASK_ID} using {TASK_FILE}. Work on this task only.

Read AGENTS.md, the assigned task, ASSESSMENT_BRIEF.md, and relevant PRD.md,
DESIGN.md and DECISIONS.md sections. ASSESSMENT_BRIEF.md is permanently
authoritative; never require the original PDF. Do not edit the brief.
Inspect existing implementation (CodeGraph first if indexed), confirm dependencies
and approvals, and identify blocking decisions. Ask for explicit approval before
new substantive decisions; routine mechanics within approved scope need no
repeated permission. Do not read TASK_PROMPT.md as a prerequisite.

Use pnpm. Implement only approved scope: no unrelated refactors, new dependencies,
bonus features or silent architecture/design changes. Track real active time for
planning, debugging, checks and docs; exclude breaks and approval waits.

Run and inspect appropriate typecheck/lint/format/build, business-logic tests and
browser/CMS/UTM/dataLayer/security checks. A build alone is insufficient. Disclose
unavailable/failed checks and leave required verification open. Report changed
files, commands/results, flow evidence, risks and pending decisions. Keep task
docs and AI_LOG truthful; never invent errors, results or independent work.

Stop for explicit human verification/acceptance. Do not start another task.
After acceptance, obtain/confirm actual active time; reconcile TIME_LOG, README
cumulative time, task status and AI_LOG before requesting separate commit approval.
Never commit before verification, human acceptance and authorization; never
auto-push, merge, squash or deploy. After an authorized commit ask how to record
the hash if that needs another commit; never silently amend.
```
