# AI Development Team Charter - Veritas News Hub

See [`ai/AI_TEAM_PLAYBOOK.md`](./AI_TEAM_PLAYBOOK.md) for the supporting model.

Live product: Veritas Global Intelligence | Repo: `zebadee2kk/Veritas-News-Hub`

---

## The Team

| Agent | Role | Responsibilities |
|-------|------|------------------|
| **Richard Ham** | Director & Human-in-the-Loop | Final prioritization and approval decisions. |
| **GitHub Copilot** | Implementation Agent | Source changes, documentation updates, and technical execution. |
| **Codex role** | Security & Code Review Lens | Security-centric review pass for sensitive updates. |
| **Perplexity role** | Research and Planning Support | Optional research and planning assistance. |

---

## Chain of Command

```
Richard (Director)
    └── Copilot (Implementation)
            ├── Codex lens (Security review)
            └── Perplexity lens (Research/planning as needed)
```

---

## How Work Gets Done

### 1. Planning
- Capture goals in issues and align with `ROADMAP.md`.
- Confirm scope and constraints before implementation.

### 2. Implementation
- Keep diffs focused and reversible.
- Maintain docs and changelog when behavior changes.
- Never hardcode secrets, URLs, or environment-specific private values.

### 3. Security Review
Apply security review before merge when:
- New API endpoints are added
- Authentication or secret handling changes
- User-supplied input is processed or stored
- New packages/dependencies are added
- CORS, headers, or middleware changes

### 4. Shipping
- Director gives final approval.
- Update `PROJECT_STATUS.md`, `ROADMAP.md`, and `ai/AI_HANDOVER.md` for major sessions.

---

## Commit Message Convention

All commits use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `style`, `chore`, `ci`, `security`

---

## Branch & PR Rules

- **Small/fast projects**: all work goes directly to `main`/`master`
- **Larger or riskier changes**: short-lived branch named `agent/description` (e.g. `sonnet/admin-backend`)
- PRs on feature branches require security-aware review for sensitive changes
- CI must pass before anything is considered done

---

## Agent-Specific Rules

### Implementation Agent
- Respect source-of-truth files (`types.ts`, config, docs).
- Keep endpoint behavior documented.
- Run lint/build checks before completion.

### Security Lens
- Verify secret handling and endpoint safety for each sensitive change.
- Confirm no credentials are leaked in code, logs, or docs.

---

## What NOT to Do

- ❌ Never commit `.env` or any real secrets
- ❌ Never hardcode environment-specific URLs in component or library files
- ❌ Never modify build output directories manually — CI owns these
- ❌ Never bypass security review for endpoint or secret-related changes
- ❌ Never add dependencies without checking security and bundle impact

---

## Key Files Every Agent Must Know

| File | Purpose |
|------|---------|
| `ai/AI_TEAM.md` | This file — roles and collaboration protocol |
| `ai/AI_TEAM_PLAYBOOK.md` | Why this model works + deep-dive guidance |
| `ai/AI_RULES.md` | Non-negotiable rules for all AI agents |
| `ai/AI_CONTEXT.md` | Project context and current state |
| `ROADMAP.md` | Current planned work and major milestones |
| `ARCHITECTURE.md` | Technical reference for current system structure |

---

Maintained by repository maintainers.
