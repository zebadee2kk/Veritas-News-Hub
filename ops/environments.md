# Environments - Veritas News Hub

## Environment Overview

| Environment | URL / Location | Purpose |
|-------------|---------------|--------|
| Development | `http://localhost:3000` | Local development with Express + Vite middleware |
| Staging | Not configured | Pre-production validation |
| Production | Not configured | Live deployment target |

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|--------|
| `GEMINI_API_KEY` | Yes | Gemini analysis and translation | `AIza...` |
| `GOOGLE_MAPS_PLATFORM_KEY` | Yes | Map rendering and geospatial layer | `AIza...` |
| `NEWS_API_KEY` | Yes | News ingestion API access | `123abc...` |
| `TWITTER_BEARER_TOKEN` | No | Optional X/Twitter social search | `AAAA...` |
| `GROK_API_KEY` | No | Optional secondary analysis provider | `xai-...` |
| `NODE_ENV` | No | Runtime mode (`development`/`production`) | `development` |

## Configuration Files

| File | Environment | Purpose |
|------|-------------|--------|
| `.env.local` (inside `veritas-global-intelligence`) | Development | Local secrets and API credentials |
| `veritas-global-intelligence/package.json` | All | Script/runtime configuration |
| `veritas-global-intelligence/vite.config.ts` | Build/runtime | Frontend build behavior |

## Deployment Notes

Production deployment target is not finalized in this repository yet.

Current runtime assumptions:
- App entrypoint is `veritas-global-intelligence/server.ts`.
- Server listens on port `3000`.
- In production mode, static assets are served from `dist`.
