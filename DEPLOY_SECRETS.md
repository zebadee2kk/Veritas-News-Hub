# Deploy Secrets Reference

This file defines the GitHub Actions secrets needed for automated deployment workflows.

## Frontend Deployment Secrets

- `CLOUDFLARE_API_TOKEN`
  - Cloudflare token with Pages deploy permission.
  - Example format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

- `CLOUDFLARE_ACCOUNT_ID`
  - Cloudflare account identifier.
  - Example format: `a1b2c3d4e5f678901234567890abcdef`

- `CLOUDFLARE_PAGES_PROJECT`
  - Cloudflare Pages project name.
  - Example format: `veritas-global-intelligence`

- `VITE_API_BASE_URL`
  - Public API base URL used at frontend build time.
  - Example: `https://api.example.com`

## Backend Deployment Secrets

Deployment routes through a jump host. Both the jump host and the VPS need credentials.

### Jump Host (Bastion)

- `JUMP_HOST`
  - Hostname of the bastion server.
  - Value: `lxc-webhost365-core`

- `JUMP_USER`
  - Username on the bastion server.
  - Value: `webadmin`

- `JUMP_SSH_KEY`
  - Private key for `webadmin@lxc-webhost365-core`.
  - Include full multi-line private key (PEM format).

### VPS Target (Behind Jump Host)

- `VPS_HOST`
  - VPS hostname or IP — read from `~/.ssh/config` on `lxc-webhost365-core`.
  - Example: `203.0.113.10` or internal hostname.

- `VPS_PORT`
  - SSH port — from `~/.ssh/config` on jump host.
  - Example: `22`

- `VPS_USER`
  - SSH user on the VPS — from `~/.ssh/config` on jump host.
  - Example: `deploy`

- `SSH_PRIVATE_KEY`
  - Private key for the VPS user (may differ from jump host key).
  - Include full multi-line private key.

- `API_HEALTHCHECK_URL`
  - Full URL used after deploy to verify backend health.
  - Example: `https://api.example.com/health`

## Runtime Secrets (Set On VPS, Not In GitHub By Default)

These should be stored on the VPS host in `/etc/veritas.env`.

- `GEMINI_API_KEY`
- `NEWS_API_KEY`
- `GOOGLE_MAPS_PLATFORM_KEY`
- `TRUTH_SCORING_VERSION` (set to `v2` to enable Algorithm V2)
- `TWITTER_BEARER_TOKEN` (optional)
- `GROK_API_KEY` (optional)

## Verification Checklist

- Add all workflow secrets in GitHub repository settings.
- Confirm `workflow_dispatch` runs without missing-secret errors.
- Confirm backend secrets are present on VPS before restart.
- Rotate keys immediately if exposed.
