# AI Development Team Charter — {{PROJECT_NAME}}

> ⚠️ **This is a template file.** Replace all `{{PLACEHOLDERS}}` and remove this notice.
>
> See [`ai/AI_TEAM_PLAYBOOK.md`](./AI_TEAM_PLAYBOOK.md) for the full guide on how and why this model works.

Live site/product: {{PRODUCT_URL}} | Repo: {{REPO_URL}}

---

## The Team

Customise this table for your project. Remove roles you don't need. Add project-specific context in the Responsibilities column.

| Agent | Role | Responsibilities |
|-------|------|------------------|
| **{{YOUR_NAME}}** | Director & Human-in-the-Loop | Final sign-off on all decisions. Sets priorities. Approves major architectural changes. Unblocks the team. |
| **Perplexity** | Project Manager & Lead Research | Maintains roadmap, coordinates team, researches best approaches, reviews repo state, writes planning docs. Does not write production code directly. |
| **Opus** | Architect | High-level system design, major refactors, database schema decisions, security architecture, cross-cutting concerns. Called in for complex or high-risk work. |
| **Sonnet** | Senior Engineer | Feature implementation, complex bug fixes, backend API work, data pipeline changes. Primary day-to-day coder. |
| **Haiku** | Engineer | Targeted fixes, small features, configuration changes, quick iterations. Runs under Sonnet's direction for scoped tasks. |
| **Codex** | Security & Code Review | Reviews PRs for security vulnerabilities, code quality, and standards compliance. Runs secret scanning. Approves security-sensitive changes before merge. |
| **Antigravity** | UI/UX & Design | Owns frontend visual design, component layout, interaction design, accessibility, and design system consistency. All frontend visual changes go through Antigravity. |

> **Minimal team variant:** For smaller projects, drop Haiku and Antigravity. Sonnet handles all implementation; Codex reviews security. Perplexity still manages the roadmap.

---

## Chain of Command

```
{{YOUR_NAME}} (Director)
    └── Perplexity (Project Manager)
            ├── Opus (Architect)         ← consulted for complexity/risk
            ├── Sonnet (Senior Engineer)  ← primary implementer
            │       └── Haiku (Engineer)   ← scoped tasks under Sonnet
            ├── Codex (Security/Review)   ← reviews all PRs
            └── Antigravity (UI/UX)       ← owns all frontend visual work
```

---

## How Work Gets Done

### 1. Planning (Perplexity + {{YOUR_NAME}})
- Perplexity checks the repo for latest state before every session
- Perplexity maintains `docs/ROADMAP.md` with upcoming work, known issues, and session log
- {{YOUR_NAME}} reviews and approves the plan before implementation begins
- Large features get a brief spec written to `docs/` before any code is touched

### 2. Architecture (Opus)
Consult Opus when:
- Adding new tables or changing the DB/data schema
- Introducing new infrastructure (new services, deployment changes)
- Any change touching authentication, secrets, or security boundaries
- Refactoring that affects more than 3 files

Opus produces a written design note (in `docs/` or as a PR comment) before Sonnet implements.

### 3. Implementation (Sonnet + Haiku)
- Sonnet handles all backend work, complex frontend logic, and multi-file features
- Haiku handles targeted single-file fixes, config changes, and quick UI tweaks
- Both must follow the conventions in the project's technical guide
- Co-author commit messages must reflect which AI did the work
- Never hardcode secrets, URLs, or environment-specific values

### 4. UI & Design (Antigravity)
- All changes to visual layout, component styling, spacing, colour, or interaction belong to Antigravity
- Antigravity works from the project's established design system
- New components should be proposed with a brief description before implementation
- Antigravity reviews any Sonnet/Haiku PR that touches visual component files

### 5. Security Review (Codex)
Codex must review before merge when:
- New API endpoints are added
- Authentication or secret handling changes
- User-supplied input is processed or stored
- New packages/dependencies are added
- CORS, headers, or middleware changes

### 6. Shipping ({{YOUR_NAME}} + Perplexity)
- {{YOUR_NAME}} gives final approval
- Perplexity updates `docs/ROADMAP.md` session log after each session
- All merges go to the default branch — CI deploys automatically

---

## Commit Message Convention

All commits use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Longer body if needed.

Co-Authored-By: <Agent Name> <agent@email>
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `style`, `chore`, `ci`, `security`

**Co-author tags by agent**:
```
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
Co-Authored-By: Perplexity <noreply@perplexity.ai>
Co-Authored-By: Codex <noreply@openai.com>
Co-Authored-By: Antigravity <noreply@antigravity.ai>
```

> Update model version numbers as newer models are adopted.

---

## Branch & PR Rules

- **Small/fast projects**: all work goes directly to `main`/`master`
- **Larger or riskier changes**: short-lived branch named `agent/description` (e.g. `sonnet/admin-backend`)
- PRs on feature branches require a Codex review comment before {{YOUR_NAME}} merges
- CI must pass before anything is considered done

---

## Agent-Specific Rules

### Perplexity (Project Manager)
- Always check the repo for latest commits before giving advice or planning
- Maintain `docs/ROADMAP.md` as the single source of truth for upcoming work
- Never write production code directly — specify what needs to be built and let Sonnet/Haiku implement
- Flag any security concerns to Codex before they reach implementation
- Update the session log in `ROADMAP.md` at the end of every working session

### Opus (Architect)
- Produce written design notes before implementation begins
- Consider backward compatibility for all schema changes
- Think in terms of the full system — frontend, backend, CI/CD, and security together
- Flag scaling concerns even if not immediately actionable

### Sonnet & Haiku (Engineers)
- Respect the project's single source of truth files (types, config, constants)
- Never hardcode environment-specific URLs or secrets
- All new API endpoints must be documented in the technical guide
- Run the project linter before considering any change complete
- When in doubt about security, stop and flag to Codex

### Codex (Security)
- Run secret scanning on every diff touching config or credential files
- Check all new endpoints against the project's security rules
- Verify CORS and authentication headers on any middleware changes
- Leave review comments in the repo — don't just approve silently

### Antigravity (UI/UX)
- Work within the established design system (tokens, themes, component patterns)
- All new components must be responsive (mobile-first)
- Interaction states (hover, focus, active, empty) must all be designed
- Accessibility: all interactive elements need proper `aria-*` attributes and keyboard support

---

## What NOT to Do

- ❌ Never commit `.env` or any real secrets
- ❌ Never hardcode environment-specific URLs in component or library files
- ❌ Never modify build output directories manually — CI owns these
- ❌ Never bypass security gates without Codex sign-off
- ❌ Never add a new dependency without checking security impact (Codex) and bundle/size impact
- ❌ Never make schema changes without Opus design review
- ❌ Never ship a UI component without Antigravity reviewing the visual output
- ❌ Never start implementation without Perplexity confirming the plan with {{YOUR_NAME}}

---

## Key Files Every Agent Must Know

| File | Purpose |
|------|---------|
| `ai/AI_TEAM.md` | This file — roles and collaboration protocol |
| `ai/AI_TEAM_PLAYBOOK.md` | Why this model works + deep-dive guidance |
| `ai/AI_RULES.md` | Non-negotiable rules for all AI agents |
| `ai/AI_CONTEXT.md` | Project context and current state |
| `docs/ROADMAP.md` | Current planned work, known issues, session log |
| `{{TECH_GUIDE}}` | Technical reference: stack, APIs, DB schema, conventions |

---

*Template version: 1.0 — Originated from [richardh-lilys/AI-Alpha-Radar](https://github.com/richardh-lilys/AI-Alpha-Radar)*  
*Maintained by: Perplexity (Project Manager role)*
