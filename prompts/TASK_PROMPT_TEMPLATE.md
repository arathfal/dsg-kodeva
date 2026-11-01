# Execute one task

Reusable developer reference for detailed agent handoffs. **Not an automatically loaded instruction** and not a claim that this entire prompt was pasted for every task. Most assignments were short (for example, `Kerjakan task T10`) because the repository already contained task requirements and agent rules.

```text
Execute {TASK NUMBER}. Work on this task only.

Read AGENTS.md, the assigned task, ASSESSMENT_BRIEF.md, and relevant project documentation. Follow existing decisions and approval rules.
Inspect the current implementation before coding (CodeGraph first if indexed). Reuse existing work and avoid unnecessary changes.

Proactively identify issues within scope, including functional, visual, security, and integration gaps. Verify actual behavior, not just passing tests. For UI tasks, inspect desktop and mobile screenshots.

Track actual active time and follow the documentation lifecycle in AGENTS.md.

For AI documentation:
- AI_LOG.md: Propose factual AI implementation contributions and any developer-approved, verified failure write-ups. Obtain explicit developer approval before each addition or expansion; do not log speculation or AI-detected issues as developer-identified failures.
- AI_FAILURE_CANDIDATES.md: Keep a private, uncommitted review queue of shortcomings explicitly reported by the developer; record what was observed and what remains to be verified. Do not automatically promote candidates into AI_LOG.md.
- Never fabricate prompt history, time measurements, verification evidence, or developer approval.

Report changes, verification results, risks, and blockers concisely. Stop for developer verification and acceptance.
Do not start another task, commit, push, or deploy without explicit authorization.
Once the developer explicitly authorizes a commit, use Conventional Commits format with a descriptive body explaining the changes.
```

For routine work, a one-line task assignment is enough when the agent is already following [AGENTS.md](../AGENTS.md) and the linked task brief. This template is useful only when a more explicit handoff is needed.
