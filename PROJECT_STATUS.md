# Project Status - Veritas News Hub

## Current Status

Active.

## Current Focus

- Align repository docs and operational files to the implemented Veritas Global Intelligence app.
- Stabilize development workflow and branch strategy documentation.

## In Progress

- [ ] Add automated tests for `server.ts` proxy behaviors and scoring utility logic.
- [ ] Normalize CI/workflow branch triggers with active default branch strategy.

## Blocked Or At Risk

- Production reliability depends on external API quota and key validity for NewsAPI, Gemini, Maps, and optional social providers.

## Recently Completed

- Implemented end-to-end intelligence dashboard structure in `veritas-global-intelligence`.
- Added setup gating and limited-mode bypass for missing credentials.
- Added news fallback payload in backend to keep UX usable without NewsAPI.

## Next Milestones

- Add smoke/integration tests and enforce in CI.
- Add caching and better API resilience controls.
- Prepare a production deployment target with environment hardening.

## Architecture Notes

See [ARCHITECTURE.md](ARCHITECTURE.md) for details. Current core choices:

- Single TypeScript stack (React frontend + Express backend).
- External API proxy in `server.ts` to manage CORS, fallback, and timeout behavior.
- Deterministic Truth Index calculation in `src/services/intelligence.ts`.

## Key Dependencies

- NewsAPI: primary article ingestion source.
- Google Gemini API: analysis and translation intelligence.
- Google Maps Platform: geospatial UI rendering.
- X API (optional): social context enrichment.
