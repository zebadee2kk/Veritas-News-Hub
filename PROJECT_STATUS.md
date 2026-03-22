# Project Status - Veritas News Hub

## Current Status

Active.

## Current Focus

- Execute VPS + Cloudflare deployment using documented runbook (access via `lxc-webhost365-core`).
- Add baseline tests for server endpoints and scoring logic.
- Monitor SQLite history DB in production for growth and query performance.

## In Progress

- [ ] Add automated tests for `server.ts` proxy behaviors and scoring utility logic.
- [ ] Execute production setup using `ops/runbook-vps-cloudflare.md` via jump host `lxc-webhost365-core`.
- [ ] Add Algorithm V2 explainability UI (top factors panel in sidebar).

## Blocked Or At Risk

- Production deployment pending SSH access handoff to `lxc-webhost365-core` (`webadmin`).
- Production reliability depends on external API quota and key validity for NewsAPI, Gemini, Maps, and optional social providers.

## Recently Completed

- Added SQLite persistence layer (`src/services/database.ts`) using `better-sqlite3`.
  - Articles auto-saved on every NewsAPI fetch.
  - Intelligence reports saved from client after each AI analysis (Gemini + Grok).
  - New REST endpoints: `POST /api/reports`, `GET /api/history`, `GET /api/history/:url`, `GET /api/stats`, `GET /api/health`.
- Implemented Algorithm V2 scoring engine (`src/services/scoringV2.ts`) with confidence, model disagreement, and explainability.
  - Feature-flagged behind `TRUTH_SCORING_VERSION=v2` env var.
- Updated deployment workflow (`.github/workflows/deploy-backend.yml`) to proxy through jump host `lxc-webhost365-core`.
- Updated all deployment docs and checklists to reflect actual access topology.
- Added `DEPLOY_SECRETS.md` with jump host and VPS secrets reference.

## Next Milestones

- Configure GitHub Secrets from `DEPLOY_SECRETS.md` (jump host + VPS + Cloudflare).
- Execute `ops/checklists/handoff.md` → `ops/runbook-vps-cloudflare.md` → `ops/checklists/go-live.md`.
- Add smoke/integration tests and enforce in CI.
- Add explainability top-factors UI panel in Sidebar.

## Architecture Notes

See [ARCHITECTURE.md](ARCHITECTURE.md) for details. Current core choices:

- Single TypeScript stack (React frontend + Express backend).
- External API proxy in `server.ts` to manage CORS, fallback, and timeout behaviour.
- SQLite file DB (`data/veritas.db`) for article and report history — file-based, no separate server.
- Dual-model analysis: Gemini (primary) + Grok (optional), reconciled via `reconcileModelReports`.
- Truth Index V1 (default) or V2 scoring engine (opt-in via env flag).

## Key Dependencies

- NewsAPI: primary article ingestion source.
- Google Gemini API: analysis and translation intelligence.
- Google Maps Platform: geospatial UI rendering.
- X API (optional): social context enrichment.
- better-sqlite3: local persistence layer for history.
