# Deployment Handoff Checklist

Complete this checklist before beginning deployment execution.

## Access

### Jump Host (Required First)

- [ ] Can SSH to `lxc-webhost365-core` as `webadmin`.
- [ ] `~/.ssh/config` on jump host has been read — VPS alias, hostname, port, user are noted.
- [ ] Private key for `webadmin@lxc-webhost365-core` is available for GitHub Secrets (`JUMP_SSH_KEY`).
- [ ] Cloudflare API credentials are confirmed available from the jump host.

### VPS (Via Jump Host)

- [ ] Can reach VPS from jump host via SSH config alias.
- [ ] Can reach VPS directly using `ssh -J webadmin@lxc-webhost365-core <vps>` from local.
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
