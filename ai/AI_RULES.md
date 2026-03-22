# AI Rules — {{PROJECT_NAME}}

> ⚠️ **This is a template file.** Customise these rules for the specific repo and remove this notice.
>
> **Multi-agent project?** Read [`ai/AI_TEAM.md`](./AI_TEAM.md) for role assignments and the full collaboration protocol.

These rules apply to ALL AI assistants (Claude, Copilot, Perplexity, Cursor, Codex, Antigravity, etc.) working in this repository.

---

## Non-Negotiable Rules

1. **Read before write** — always read file contents before modifying any existing file
2. **Never delete or truncate** existing documented content without explicit user approval
3. **No secrets in commits** — API keys, tokens, passwords must never appear in any committed file
4. **Update `docs/ROADMAP.md`** session log at the end of every working session
5. **Check `ai/AI_CONTEXT.md`** and recent commits at the start of every session
6. **Follow your role** — see `ai/AI_TEAM.md` for what your agent is and is not responsible for

---

## File Ownership Rules

| File/Folder | Owner | Rule |
|-------------|-------|------|
| `ai/*.md` | Perplexity / Director | Keep accurate and current; agents may read, Perplexity updates |
| `docs/ROADMAP.md` | Perplexity | Append session log; Perplexity owns structure |
| `CHANGELOG.md` | All | Append only (newest at top) |
| Source code files | Sonnet / Haiku | Read before modify; never refactor without explicit ask |
| Visual components | Antigravity | All styling changes must be reviewed by Antigravity |
| Security config | Codex | Auth, CORS, middleware — Codex must review before merge |
| Architecture docs | Opus | Schema and design docs — Opus must review structural changes |

---

## Commit Message Format

All commits use [Conventional Commits](https://www.conventionalcommits.org/) with AI co-author tags:

```
<type>(<scope>): <short description>

- bullet point of what changed
- another change

Co-Authored-By: <Agent> <email>
```

**Types**: `feat` | `fix` | `docs` | `chore` | `refactor` | `ci` | `security` | `style`

**Co-author tags** (update version numbers when models change):
```
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
Co-Authored-By: Perplexity <noreply@perplexity.ai>
Co-Authored-By: Codex <noreply@openai.com>
Co-Authored-By: Antigravity <noreply@antigravity.ai>
```

---

## Naming Conventions

- Python files: `snake_case.py`
- TypeScript/JS files: `camelCase.ts` or `PascalCase.tsx` (components)
- Markdown files: `UPPER_CASE.md` for root docs, `kebab-case.md` for subfolders
- Scripts: `verb-noun.sh` or `verb_noun.py`

---

## Quality Standards

- All new functions should have docstrings/JSDoc comments
- All new scripts must be documented in `SCRIPTS.md` (if it exists)
- GitHub Actions workflows must include a `workflow_dispatch` trigger
- Run the project linter before considering any change complete
- New dependencies require Codex security review before commit

---

## Security Standards (enforced by Codex)

- No hardcoded secrets, tokens, or passwords anywhere in the codebase
- All user-supplied input must be validated and sanitised before use
- SQL queries must use parameterised statements — no string interpolation
- New API endpoints must be documented and access-controlled appropriately
- CORS changes require Codex sign-off

---

## Repo-Specific Rules

<add any rules specific to this repository>
