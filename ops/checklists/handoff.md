# Deployment Handoff Checklist

Complete this checklist before beginning deployment execution.

## Access

- [ ] SSH host, port, and username for VPS are confirmed.
- [ ] SSH key has been tested successfully.
- [ ] Sudo privileges are confirmed on VPS user.
- [ ] Cloudflare API token is available and tested.
- [ ] Cloudflare zone is confirmed for target domain.
- [ ] GitHub repository admin/maintainer permissions are available.

## Cloudflare Permissions

- [ ] Zone DNS edit
- [ ] Zone settings edit
- [ ] Cache purge
- [ ] Cloudflare Pages project edit

## Runtime Secrets

- [ ] `GEMINI_API_KEY`
- [ ] `NEWS_API_KEY`
- [ ] `GOOGLE_MAPS_PLATFORM_KEY` (browser restricted)
- [ ] `TWITTER_BEARER_TOKEN` (optional)
- [ ] `GROK_API_KEY` (optional)

## Domain + Routing Plan

- [ ] `app.<domain>` for frontend
- [ ] `api.<domain>` for backend
- [ ] TLS mode planned as Full (strict)

## Preflight Checks

- [ ] `master` branch is current and clean.
- [ ] Deployment-related docs have been reviewed:
  - `docs/playbooks/deployment.md`
  - `ops/runbook-vps-cloudflare.md`
  - `ops/checklists/go-live.md`
  - `ops/checklists/rollback.md`
- [ ] Rollback owner is assigned.
- [ ] Maintenance window decision is made (if needed).
