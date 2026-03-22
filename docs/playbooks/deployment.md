# Deployment Playbook

This playbook defines how Veritas News Hub is deployed to production using Cloudflare Pages for frontend delivery and a VPS for backend APIs.

## Deployment Topology

- Frontend: Cloudflare Pages
- Backend API: VPS (Node.js + Express)
- Reverse proxy: Nginx
- Process manager: PM2
- DNS and edge security: Cloudflare

Target hostnames:

- `app.<domain>` -> Cloudflare Pages
- `api.<domain>` -> VPS (proxied through Cloudflare)

## Deployment Principles

- Keep secret API keys only on the backend host.
- Expose only browser-safe values to frontend builds.
- Use Cloudflare Full (strict) TLS for origin security.
- Use explicit rollback paths for both frontend and backend.

## Prerequisites

- VPS access via SSH with sudo privileges.
- Cloudflare account with zone and Pages permissions.
- Domain under Cloudflare DNS.
- GitHub repository access to configure CI/CD secrets.

Required runtime secrets:

- `GEMINI_API_KEY`
- `NEWS_API_KEY`
- `GOOGLE_MAPS_PLATFORM_KEY` (restricted browser key)

Optional runtime secrets:

- `TWITTER_BEARER_TOKEN`
- `GROK_API_KEY`

## Execution Order

1. Complete handoff checklist in `ops/checklists/handoff.md`.
2. Provision VPS and runtime dependencies.
3. Deploy backend app and configure PM2.
4. Configure Nginx reverse proxy for API host.
5. Configure Cloudflare DNS and TLS settings.
6. Deploy frontend on Cloudflare Pages.
7. Run go-live checks from `ops/checklists/go-live.md`.
8. Document outcomes in `PROJECT_STATUS.md` and `ROADMAP.md`.

## Security Requirements

- No plaintext secrets in repository files.
- Restrict CORS to approved frontend hostname(s).
- Apply Cloudflare WAF and endpoint rate limits.
- Keep SSH access key-based and least-privileged.

## Operational Requirements

- Add health endpoint for backend uptime checks.
- Track process state with PM2.
- Keep deploy logs and release notes for rollback.
- Verify frontend cache invalidation after deploy.

## References

- `ops/runbook-vps-cloudflare.md`
- `ops/checklists/handoff.md`
- `ops/checklists/go-live.md`
- `ops/checklists/rollback.md`
- `ops/environments.md`
- `DEPLOY_SECRETS.md`
- `docs/playbooks/intelligence-algorithm-v2.md`
