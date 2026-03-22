# AI Rules - Veritas News Hub

Read [`ai/AI_TEAM.md`](./AI_TEAM.md) for role assignments and collaboration protocol.

These rules apply to ALL AI assistants (Claude, Copilot, Perplexity, Cursor, Codex, Antigravity, etc.) working in this repository.

---

## Non-Negotiable Rules

1. **Read before write** — always read file contents before modifying any existing file
2. **Never delete or truncate** existing documented content without explicit user approval
3. **No secrets in commits** — API keys, tokens, passwords must never appear in any committed file
4. **Update `ROADMAP.md`** and `ai/AI_HANDOVER.md` for significant session progress
5. **Check `ai/AI_CONTEXT.md`** and recent commits at the start of every session
6. **Follow your role** — see `ai/AI_TEAM.md` for what your agent is and is not responsible for

---

## File Ownership Rules

| File/Folder | Owner | Rule |
|-------------|-------|------|
| `ai/*.md` | Maintainers | Keep accurate and current |
| `ROADMAP.md` | Maintainers | Keep milestones and priorities current |
| `CHANGELOG.md` | All contributors | Append meaningful changes only |
| `veritas-global-intelligence/src/**` | Engineering contributors | No broad refactors without explicit request |
| `veritas-global-intelligence/server.ts` | Engineering + security review | Treat endpoint and secret-handling changes as sensitive |
| `SECURITY.md` and `docs/playbooks/security.md` | Maintainers | Keep reporting and controls up to date |

---

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`, `fix`, `docs`, `chore`, `refactor`, `ci`, `security`, `style`

---

## Naming Conventions

- TypeScript/JS files: `camelCase.ts` or `PascalCase.tsx` (components)
- Markdown files: `UPPER_CASE.md` for root docs, `kebab-case.md` for subfolders
- Scripts: `verb-noun.sh` where shell scripts are introduced

---

## Quality Standards

- All new functions should have docstrings/JSDoc comments
- Run the project linter before considering any change complete
- New dependencies should include a brief security impact note in the PR

---

## Security Standards (enforced by Codex)

- No hardcoded secrets, tokens, or passwords anywhere in the codebase
- All user-supplied input must be validated and sanitised before use
- SQL queries must use parameterised statements — no string interpolation
- New API endpoints must be documented and access-controlled appropriately
- CORS changes require maintainer review

---

## Repo-Specific Rules

- Keep project docs synchronized with implemented behavior.
- Prefer small, reversible changes.
- Do not remove fallback behavior without explicit approval.
