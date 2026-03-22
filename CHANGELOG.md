# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- SQLite persistence layer (`src/services/database.ts`) using `better-sqlite3`.
  - Articles auto-saved on every NewsAPI fetch.
  - Intelligence reports persisted via `POST /api/reports` after Gemini/Grok analysis.
  - New endpoints: `GET /api/history`, `GET /api/history/:encodedUrl`, `GET /api/stats`, `GET /api/health`.
  - DB file stored at `data/veritas.db` (gitignored, persisted on VPS).
- Algorithm V2 scoring engine (`src/services/scoringV2.ts`) — confidence scoring, model disagreement penalty, variance penalty, explainability report.
  - Gated behind `TRUTH_SCORING_VERSION=v2` environment variable.
- Jump host support in GitHub Actions backend deploy workflow — proxies through `lxc-webhost365-core` via `appleboy/ssh-action` `proxy_*` fields.
- `JUMP_HOST`, `JUMP_USER`, `JUMP_SSH_KEY` secrets added to `DEPLOY_SECRETS.md`.
- Updated `ops/runbook-vps-cloudflare.md`, `ops/checklists/handoff.md`, and `DEPLOYMENT_READY.md` to document the actual access topology.

### Changed
- `server.ts` now imports and initialises the database on startup, saving articles on every NewsAPI response.
- `Sidebar.tsx` now POSTs both Gemini and Grok reports to `/api/reports` after analysis completes.
- `V2 types added to `src/types.ts`: `Sentiment`, `ExplainabilityReport`, optional V2 fields on `IntelligenceReport`.
- `.gitignore` updated to exclude `data/`, `*.db`, `*.db-shm`, `*.db-wal`.
- Replaced template repository documentation with project-specific architecture, status, roadmap, and operations content.

### Fixed
- Removed placeholder references and generic template naming in core documentation files.
