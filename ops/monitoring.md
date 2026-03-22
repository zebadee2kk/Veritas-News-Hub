# Monitoring - Veritas News Hub

## Monitoring Overview

Monitoring is currently basic and log-driven in local/runtime output. No centralized dashboard is configured yet.

## Health Checks

| Check | Endpoint / Method | Expected Response | Alert Threshold |
|-------|------------------|-------------------|-----------------|
| News proxy health | `GET /api/news` | JSON payload with `status` and `articles` | Elevated error rate over 5 minutes |
| Social proxy health (optional) | `GET /api/social?q=test` | JSON or expected 404 when token absent | Unexpected sustained 5xx responses |
| Frontend availability | `GET /` | HTML shell for React app | No response or repeated startup failures |

## Logging

- **Log location:** Process stdout/stderr from `server.ts`.
- **Log format:** Plain text with contextual prefixes (API key masks, request status, timing).
- **Retention:** Depends on runtime host; not standardized yet.

## Alerting

| Alert | Condition | Channel |
|-------|-----------|--------|
| CI failing on default branch | GitHub workflow failure | GitHub notifications |
| Security scan findings | CodeQL or dependency alerts | GitHub Security tab / notifications |

## Dashboards

- None configured.

## Runbooks

- News ingestion degraded: verify `NEWS_API_KEY`, quota, and upstream NewsAPI status.
- Analysis degraded: verify `GEMINI_API_KEY` and provider availability.
- Map unavailable: verify `GOOGLE_MAPS_PLATFORM_KEY` and Maps API enablement.
