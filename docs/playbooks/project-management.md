# Project Management Playbook

How we track work, manage priorities, and coordinate contributions.

## 📝 GitHub Issues
- **Every task has an issue.** No work should be done without a tracking issue.
- **Labels**:
  - `priority: high/med/low`
  - `type: bug/feat/doc`
  - `status: in-progress/blocked`
  - `good first issue`: Ideal for new contributors.

## 🗺️ Milestones & Roadmap
- Work is grouped in lightweight milestone batches (typically 1-2 weeks).
- Major releases are tracked in the [Roadmap](../../ROADMAP.md).

## 🧐 PR Reviews
- **Approval**: At least one maintainer approval is required.
- **AI-assisted PRs**: Require a human sponsor and at least one additional reviewer.
- **Tone**: Be helpful and respectful. Goal is code quality, not "winning".
- **Timeline**: Aim to review PRs within 48 hours.

## 🔒 Branch Protection (Repo Settings)
- **Protected branches**: `master` (and release branches if introduced)
- **Required reviews**: CODEOWNER review + required checks
- **No direct pushes**: PRs only, squash merge
- **Status checks**: CI, security scan, lint/test as applicable

## 🗓️ Communication
- **Async First**: Use GitHub Issues/Discussions for most things.
- **Sync**: Use ad hoc maintainer sync when release-critical changes are underway.
