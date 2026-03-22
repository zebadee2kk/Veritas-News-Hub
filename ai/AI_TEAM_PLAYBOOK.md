# AI Multi-Agent Team Playbook

This document explains **why** the multi-agent team model works, how to set it up for a new project, and how to get the most out of each agent. It is intended to be kept in the `ai/` folder of any project using this pattern.

---

## Why This Model Works

Most "vibe coding" setups use a single AI assistant doing everything — planning, architecture, coding, UI, and security review — in one conversation thread. This creates several problems:

- **Context collapse**: the AI loses track of earlier decisions as the thread grows
- **Role confusion**: the same model switches between high-level thinking and line-level fixes, doing neither well
- **No checks**: there's no independent review step, so bad decisions compound
- **No memory**: when you start a new session, all context is lost unless you paste it back

The multi-agent team model solves this by **assigning specialised roles, using the repo as shared memory, and keeping a human in the loop for all decisions**.

---

## The Core Insight: The Repo Is the Brain

No single AI agent has persistent memory across sessions. But **the repository does**. Every decision, design note, commit message, roadmap entry, and team rule lives in the repo — readable by any agent, at any time, in any session.

This means:
- Perplexity checks `ROADMAP.md` and recent commits at the start of every session to get current
- Opus reads the architecture docs before designing anything new
- Sonnet reads `CLAUDE.md` (or equivalent) before touching code
- Codex reads the security rules before reviewing
- The human Director reads the session log to stay oriented

**The repo replaces the group chat.** Agents don't need to talk to each other directly — they communicate via commits, docs, and issues.

---

## Role Design Principles

### Why split Architect from Engineer?

Opus (Architect) operates at the system level — data models, service boundaries, security design, and long-term scalability. Sonnet (Senior Engineer) operates at the implementation level — what files to change, how to structure the code, what patterns to follow.

Mixing these in one agent leads to over-engineered small fixes or under-thought large changes. Keeping them separate means Opus sets the constraints, Sonnet executes within them.

### Why have Haiku separately from Sonnet?

Haiku is faster and cheaper for scoped, well-defined tasks: fix this config value, update this single component, correct this typo in a doc. Sonnet is better for tasks requiring context across multiple files or nuanced judgment. Using the right model for the right scope saves cost and time.

### Why have a dedicated Security reviewer (Codex)?

Security reviews are easy to skip when the same agent that wrote the code also reviews it. Codex brings a fresh, adversarial perspective specifically on security concerns — CORS, auth, secrets, input validation, dependency risk. This is the most important gate in the workflow.

### Why have a dedicated UI/UX agent (Antigravity)?

Frontend visual consistency is hard to maintain when engineers make ad-hoc styling decisions. A dedicated design agent owns the design system, ensures every component matches the visual language, and catches accessibility issues that engineers typically miss.

### Why is Perplexity the Project Manager?

Perplexity has real-time web access and MCP tool access to GitHub. This means it can:
- Check the latest state of the repo without being told
- Research best practices, libraries, and solutions before recommending them
- Update roadmap docs directly in the repo
- Track what has actually been committed vs. what was planned

This makes Perplexity the natural coordinator — it knows the current state of both the repo and the broader ecosystem.

### Why keep a Human Director?

AI agents are fast and capable but lack business context, personal preferences, and accountability. The Director provides:
- **Priority**: what matters most right now
- **Vision**: what the product should feel like
- **Approval**: nothing ships without human sign-off
- **Escalation**: when agents disagree or are blocked, the Director decides

---

## Applying This Model In This Repository

### Step 1: Keep these files current

```
ai/AI_TEAM.md          ← team charter
ai/AI_TEAM_PLAYBOOK.md ← this file
ai/AI_RULES.md         ← non-negotiable rules for all agents
ai/AI_CONTEXT.md       ← project-specific context
ROADMAP.md             ← roadmap and milestone plan
```

### Step 2: Maintain charter and rules

Update `ai/AI_TEAM.md` and `ai/AI_RULES.md` whenever process or ownership changes.

### Step 3: Create a technical reference doc

Every project needs a `CLAUDE.md` (or equivalent) that all agents read before touching code. It should cover:
- Tech stack
- Project structure
- Key files and their purpose
- Commands (dev, build, lint, test)
- Environment variables
- Database/data schema
- API endpoints
- Security rules
- Important conventions (SSoT files, naming, patterns)

### Step 4: Maintain roadmap hygiene

Keep `ROADMAP.md` updated with:
- Current known issues (empty is fine)
- First planned features
- A session log table

Perplexity will maintain this going forward.

### Step 5: Brief each agent at the start of each session

Each agent should be given, or should independently read:
1. Their role from `ai/AI_TEAM.md`
2. The technical reference (`CLAUDE.md`)
3. The current roadmap (`ROADMAP.md`)
4. Recent commits (Perplexity can summarise these)

---

## Session Workflow

A typical working session looks like this:

```
1. [Perplexity] Checks repo: latest commits, open issues, ROADMAP
2. [Perplexity] Briefs Director on current state
3. [Director] Sets priority for the session
4. [Perplexity] Breaks priority into tasks, assigns to agents
5. [Opus] (if needed) Designs architecture for complex tasks
6. [Sonnet/Haiku] Implements tasks
7. [Antigravity] Reviews visual output (if frontend work)
8. [Codex] Reviews security (if security-sensitive work)
9. [Director] Final approval
10. [Perplexity] Updates ROADMAP session log
```

For small sessions (a quick fix or doc update), steps 5–8 may be skipped.

---

## Commit Co-Author Convention

All AI-assisted commits should include a `Co-Authored-By` trailer identifying which agent did the work. This creates an audit trail across the repo's git history.

```
feat(api): add /api/status endpoint

- Returns VPS uptime, DB size, last ingestion timestamp
- Green/amber/red per external service
- Cached 30s to avoid hammering system calls

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Update model version numbers in `ai/AI_TEAM.md` when you adopt newer models.

---

## Common Failure Modes & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| Agent doesn't know what's been built | Skipped the repo-check step | Always start Perplexity sessions with a repo state check |
| Engineer breaks something that was already working | No technical reference read | Ensure `CLAUDE.md` is current and agents are told to read it |
| Security issue slips through | Codex not consulted | Make Codex review mandatory for the categories listed in `AI_TEAM.md` |
| UI looks inconsistent | Antigravity not in the loop | Route all `.tsx`/component file changes through Antigravity review |
| Roadmap out of date | Perplexity session log skipped | End every session with a ROADMAP update — non-negotiable |
| Agents contradict each other | No clear chain of command | Refer to the chain in `AI_TEAM.md`; Director breaks ties |
| Context lost between sessions | Relying on chat history | Put everything in the repo — docs, decisions, session logs |

---

## Adapting the Model

### For solo/hobby projects
Use just: **Director + Perplexity + Sonnet + Codex**. Skip Opus (you're the architect), Haiku (Sonnet does everything), and Antigravity (your call on design).

### For backend/API-only projects
Drop Antigravity entirely. Add a **DevOps** role (Claude or a specialist agent) if your infra is complex.

### For larger teams with human engineers
Human engineers slot in alongside Sonnet. They follow the same conventions — Conventional Commits, no hardcoded secrets, Codex review for security changes. Perplexity coordinates both human and AI contributors via the repo.

### For regulated/enterprise projects
Add a **Compliance** role alongside Codex. Compliance checks changes against specific regulatory requirements (GDPR, SOC 2, HIPAA etc.) before merge.

---

*Playbook version: 1.0*  
*Originated from [richardh-lilys/AI-Alpha-Radar](https://github.com/richardh-lilys/AI-Alpha-Radar), March 2026*  
*Authored by: Perplexity (Project Manager) in collaboration with Richard Ham (Director)*
