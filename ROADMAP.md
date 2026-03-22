# Project Roadmap

## March 2026 Update

- [x] Replace template/default repository docs with project-specific documentation.
- [x] Align architecture, ops, security, and AI context docs to the current app.
- [x] Add deployment playbook, runbook, and go-live/rollback/handoff checklists.
- [ ] Complete CI workflow alignment for nested app path (`veritas-global-intelligence`).
- [ ] Add baseline tests for `server.ts` endpoints and Truth Index scoring.
- [ ] Execute VPS + Cloudflare deployment using documented runbook once access is available.

## Phase 1 - Core Foundation (In Progress)

- [x] Stand up React + Express application structure.
- [x] Integrate NewsAPI ingestion through backend proxy endpoint.
- [x] Integrate Gemini-based article analysis and translation.
- [x] Add map visualization and article geolocation display.
- [x] Add setup flow for required and optional API keys.
- [ ] Add baseline test suite for critical paths.
- [ ] Align CI checks with current repository structure.

## Phase 2 - Product Hardening

- [ ] Add server-side caching for repeated news queries.
- [ ] Add retry and circuit-breaker behavior for upstream API calls.
- [ ] Add structured logging and request correlation IDs.
- [ ] Add better location extraction to replace mock geocoding.
- [ ] Add stronger validation and sanitization for inbound query params.

## Phase 3 - Intelligence Expansion

- [ ] Add source reputation memory and longitudinal trust trends.
- [ ] Add entity extraction and storyline clustering.
- [ ] Add alert subscriptions for regional or topic-specific intelligence signals.
- [ ] Add analyst workspaces for saved investigations and exported reports.

## Phase 4 - Deployment And Scale

- [x] Define target production platform (Cloudflare Pages + VPS API) and deployment runbook.
- [ ] Add environment-specific configuration and secret management policy.
- [ ] Add uptime, latency, and error-budget monitoring.
- [ ] Add rate-limit strategy and abuse protections for public-facing deployment.
