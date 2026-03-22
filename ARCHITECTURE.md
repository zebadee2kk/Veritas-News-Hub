# Architecture - Veritas News Hub

## Overview

Veritas Global Intelligence is a full-stack TypeScript application that combines a React client with an Express server. The client renders an intelligence dashboard (feed + map + analysis panel), while the server brokers external APIs and keeps keys server-side when possible.

## Directory Structure

```text
Veritas-News-Hub/
├── veritas-global-intelligence/
│   ├── src/
│   │   ├── components/            # Map, sidebar, setup UX
│   │   ├── services/              # Gemini/Grok analysis and social fetch wrappers
│   │   ├── App.tsx                # App orchestration and loading/error states
│   │   └── types.ts               # Shared frontend types
│   ├── server.ts                  # Express API proxy + Vite middleware host
│   └── package.json               # Runtime scripts and dependencies
├── docs/                          # Team playbooks and active context notes
├── ops/                           # Environments, monitoring, pipeline documentation
└── ai/                            # AI process context and handover notes
```

## Component Overview

| Component | File/Folder | Purpose |
|-----------|-------------|---------|
| App shell | `veritas-global-intelligence/src/App.tsx` | Coordinates loading, config checks, and top-level layout |
| Intelligence feed panel | `veritas-global-intelligence/src/components/Sidebar.tsx` | Lists articles and renders AI analysis + social snippets |
| Geospatial view | `veritas-global-intelligence/src/components/MapView.tsx` | Displays user position and clustered article markers |
| Setup and key validation | `veritas-global-intelligence/src/components/SetupGuide.tsx` | Guides required secret setup with limited-mode bypass |
| Intelligence engine | `veritas-global-intelligence/src/services/intelligence.ts` | Gemini/Grok analysis, translation, Truth Index scoring |
| Backend API layer | `veritas-global-intelligence/server.ts` | Proxies NewsAPI and X API, applies fallbacks and timeouts |

## Data Flow

```text
Browser UI
	-> GET /api/news (Express)
	-> NewsAPI (or local fallback payload)
	-> Article list in Sidebar + Map markers
	-> Per-article AI analysis request (Gemini, optional Grok)
	-> Truth Index + reasoning rendered in report drawer
	-> Optional GET /api/social for X/Twitter context
```

## Key Design Decisions

1. Proxy external APIs through `server.ts`.
Reason: improves CORS handling, centralizes timeout behavior, and avoids exposing provider keys directly in browser requests.

2. Include graceful degraded modes.
Reason: when required keys are missing, the app can still demonstrate UI behavior through setup guidance and fallback article data.

3. Use a deterministic Truth Index function.
Reason: a stable weighted score enables consistent comparison between articles and model outputs.

## External Dependencies

| Dependency | Purpose |
|------------|---------|
| React + Vite | Frontend rendering and tooling |
| Express | API endpoints and local server runtime |
| @google/genai | Gemini analysis and translation calls |
| @vis.gl/react-google-maps + markerclusterer | Interactive map and clustering |
| node-fetch | HTTP fallback where global fetch is unavailable |
| lucide-react + motion | UI icons and animation |

## Security Considerations

- Secrets are expected in environment variables and should never be committed.
- External requests implement timeout guards to avoid long hangs.
- Setup UX masks configured secret values for safer debugging.

## Performance Notes

- Initial article translation is capped to a subset to reduce latency.
- Map markers are clustered to keep map interactions responsive.
- Client loading progress and timeout safeguards reduce perceived freeze risk.

## Future Architecture

- Add persistent storage for article history and analysis snapshots.
- Introduce server-side caching/rate limiting for third-party API calls.
- Add automated tests around scoring, API handlers, and setup validation.
