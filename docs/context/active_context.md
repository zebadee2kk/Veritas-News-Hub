# Active Context & Scratchpad

## 📝 Current Focus
- [x] Understand and inventory the generated AI Studio app under `veritas-global-intelligence`.
- [x] Replace template repository docs with project-specific documentation.
- [ ] Add test coverage for proxy handlers and scoring logic.
- [ ] Reconcile workflow branch triggers with active branch strategy.

## 🧠 Memory Bank
- Runtime entrypoint is `veritas-global-intelligence/server.ts` on port 3000.
- Required keys: `GEMINI_API_KEY`, `GOOGLE_MAPS_PLATFORM_KEY`, `NEWS_API_KEY`.
- Optional keys: `TWITTER_BEARER_TOKEN`, `GROK_API_KEY`.
- App has fallback data path when NewsAPI key is missing/invalid.

## 🚫 Constraints & Rules
- Do not commit secrets or `.env` files.
- Keep docs synchronized when architecture or process changes.
- Favor graceful degradation when third-party APIs are unavailable.
