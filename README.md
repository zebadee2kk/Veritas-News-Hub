# Veritas News Hub

Veritas News Hub is the repository for Veritas Global Intelligence, an AI-assisted news and social intelligence dashboard focused on rapid signal triage.

The live application code is in [veritas-global-intelligence](veritas-global-intelligence).

## What The App Does

- Ingests global news via server-side proxy endpoints.
- Displays articles in an operator-style intelligence sidebar.
- Maps events on an interactive geospatial view.
- Runs article analysis to estimate credibility, bot likelihood, sentiment, and a composite Truth Index.
- Optionally compares Gemini and Grok analysis outputs.
- Optionally fetches related X/Twitter posts for social context.

## Repository Layout

```text
.
├── veritas-global-intelligence/   # React + Vite frontend and Express API server
├── docs/                          # Project context and playbooks
├── ops/                           # Environment, monitoring, and pipeline docs
├── ai/                            # AI working context, handover, and team docs
├── ARCHITECTURE.md
├── PROJECT_STATUS.md
└── ROADMAP.md
```

## Quick Start

1. Move into the app directory.

```bash
cd veritas-global-intelligence
```

2. Install dependencies.

```bash
npm install
```

3. Configure environment variables in `.env.local`.

Required:
- `GEMINI_API_KEY`
- `GOOGLE_MAPS_PLATFORM_KEY`
- `NEWS_API_KEY`

Optional:
- `TWITTER_BEARER_TOKEN`
- `GROK_API_KEY`

4. Start the development server.

```bash
npm run dev
```

The app runs at `http://localhost:3000` via `server.ts`.

## Available Scripts

From [veritas-global-intelligence/package.json](veritas-global-intelligence/package.json):

- `npm run dev` - starts Express + Vite middleware in development
- `npm run build` - creates production build
- `npm run preview` - previews built frontend
- `npm run start` - starts server entrypoint
- `npm run clean` - removes dist output
- `npm run lint` - TypeScript no-emit check

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [PROJECT_STATUS.md](PROJECT_STATUS.md)
- [ROADMAP.md](ROADMAP.md)
- [DEPLOYMENT_READY.md](DEPLOYMENT_READY.md)
- [DEPLOY_SECRETS.md](DEPLOY_SECRETS.md)
- [docs/playbooks/development.md](docs/playbooks/development.md)
- [docs/playbooks/deployment.md](docs/playbooks/deployment.md)
- [docs/playbooks/intelligence-algorithm-v2.md](docs/playbooks/intelligence-algorithm-v2.md)
- [docs/playbooks/security.md](docs/playbooks/security.md)
- [ops/environments.md](ops/environments.md)
- [ops/runbook-vps-cloudflare.md](ops/runbook-vps-cloudflare.md)
- [ops/checklists/handoff.md](ops/checklists/handoff.md)
- [ops/checklists/go-live.md](ops/checklists/go-live.md)
- [ops/checklists/rollback.md](ops/checklists/rollback.md)

## Contributing And Security

- Contribution process: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Security reporting: [SECURITY.md](SECURITY.md)

## License

MIT. See [LICENSE](LICENSE).
