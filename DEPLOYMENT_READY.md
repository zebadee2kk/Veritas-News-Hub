# Deployment Ready - Start Here

This file is the single entry point to resume deployment work later.

## Objective

Deploy Veritas News Hub with:

- Frontend on Cloudflare Pages (`app.<domain>`)
- Backend on VPS (`api.<domain>`) with Nginx + PM2
- Cloudflare DNS, TLS, WAF, and rate limiting in front of public hosts

## Start Sequence

1. Complete prerequisites in `ops/checklists/handoff.md`.
2. Read deployment strategy in `docs/playbooks/deployment.md`.
3. Execute commands in `ops/runbook-vps-cloudflare.md`.
4. Validate with `ops/checklists/go-live.md`.
5. If needed, follow `ops/checklists/rollback.md`.
6. Configure workflow secrets from `DEPLOY_SECRETS.md`.

## Required Inputs Before Execution

- VPS SSH access (host, port, user, key)
- Cloudflare API token + account/zone access
- Domain and target hostnames
- Runtime secrets (`GEMINI_API_KEY`, `NEWS_API_KEY`, `GOOGLE_MAPS_PLATFORM_KEY`, optional social keys)

## Current Status Snapshot

- Deployment docs: complete
- Deployment automation workflows: implemented in `.github/workflows/deploy-frontend.yml` and `.github/workflows/deploy-backend.yml`
- Production deployment execution: pending access handoff

## Related Planning Docs

- `DEPLOY_SECRETS.md`
- `docs/playbooks/intelligence-algorithm-v2.md`

## Update After Execution

After running deployment, update:

- `PROJECT_STATUS.md`
- `ROADMAP.md`
- `CHANGELOG.md`
- `ops/environments.md` (with final production URLs and notes)
