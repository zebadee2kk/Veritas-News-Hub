# AI Context - Veritas News Hub

## Repository Purpose

This repository contains Veritas Global Intelligence, a full-stack TypeScript application for ingesting and analyzing global news and social signals. It is used to triage potential misinformation and surface location-based intelligence in a map-first dashboard.

## Architecture Overview

```text
Veritas-News-Hub/
├── ai/                            # AI operating context, rules, and handover
├── docs/                          # Project playbooks and active context
├── ops/                           # Environments, monitoring, and CI/CD docs
├── veritas-global-intelligence/   # Main app (React + Express + Vite)
├── ARCHITECTURE.md
├── PROJECT_STATUS.md
├── ROADMAP.md
└── SECURITY.md
```

## Existing Tooling

- `npm run dev` in `veritas-global-intelligence`: starts Express server with Vite middleware.
- `npm run build`: builds frontend production assets.
- `npm run lint`: TypeScript no-emit validation.

## What Still Needs Building

- Automated tests for API handlers and scoring logic.
- Production deployment definition and environment hardening.
- Improved geolocation extraction and persistent data/caching.

## Working With This Repo

- Language: TypeScript (frontend and backend)
- Package manager: npm
- App folder: `veritas-global-intelligence`
- Required env vars:
  - `GEMINI_API_KEY`
  - `GOOGLE_MAPS_PLATFORM_KEY`
  - `NEWS_API_KEY`
- Optional env vars:
  - `TWITTER_BEARER_TOKEN`
  - `GROK_API_KEY`

## AI Assistant Instructions

1. Read before write for every file edit.
2. Check `PROJECT_STATUS.md` and `ROADMAP.md` at session start.
3. Follow `ai/AI_RULES.md` for repo-level constraints.
4. Update `ai/AI_HANDOVER.md` after significant sessions.
5. Never commit secrets or raw key values.
