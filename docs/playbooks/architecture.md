# Architecture Playbook

Practical architecture guidance for Veritas Global Intelligence.

## 🏗️ Design Principles
- **Server-mediated integrations**: Route third-party API calls through backend endpoints where feasible.
- **Graceful degradation**: Keep the interface usable when one or more external services are down or unconfigured.
- **Deterministic scoring**: Keep core trust-scoring logic explicit and reproducible.
- **Clear type contracts**: Maintain typed DTOs for shared frontend service responses.

## 🗺️ System Overview
- **Frontend**: React 19 + Vite + TypeScript in `veritas-global-intelligence/src`.
- **Backend**: Express in `veritas-global-intelligence/server.ts`.
- **Data Sources**: NewsAPI, Google Gemini, Google Maps, optional X API and xAI Grok.
- **Storage**: No persistent database yet; responses are processed in-memory.

## 📁 Directory Structure
```text
veritas-global-intelligence/
├── src/
│   ├── components/
│   ├── services/
│   ├── App.tsx
│   └── types.ts
├── server.ts
├── package.json
└── vite.config.ts
```

## 🔄 Data Flow

1. Client requests `/api/news`.
2. Express queries NewsAPI or returns curated fallback payload if key is invalid.
3. Frontend renders article feed and geospatial markers.
4. Sidebar triggers analysis requests through Gemini (and optional Grok).
5. Sidebar optionally requests `/api/social` for related X posts.

## Non-Goals (Current State)

- No long-term storage of analyses.
- No user account system.
- No hard real-time streaming pipeline.
