# CI/CD Pipelines - Veritas News Hub

## Pipelines Overview

| Workflow | File | Trigger | Purpose |
|----------|------|---------|--------|
| CI | `.github/workflows/ci.yml` | Push and PR on configured branches | Lint and test Node/Python projects when detected |
| Security Scan | `.github/workflows/security-scan.yml` | Push, PR, and weekly schedule | CodeQL analysis for JavaScript and Python |
| Stale Cleanup | `.github/workflows/stale.yml` | Daily schedule | Mark and close inactive issues/PRs |
| Frontend Deploy | `.github/workflows/deploy-frontend.yml` | Push to `master` and manual dispatch | Build and deploy frontend to Cloudflare Pages |
| Backend Deploy | `.github/workflows/deploy-backend.yml` | Push to `master` and manual dispatch | Deploy backend to VPS via SSH and run health check |

## Pipeline Details

### CI

- **Trigger:** Push/PR to workflow-configured branches.
- **Runs on:** `ubuntu-latest`
- **Steps:** Checkout, runtime setup, install dependencies, lint, tests.
- **Notes:** Workflow currently checks for root-level `package.json` and Python files before running language-specific jobs.

### Security Scan

- **Trigger:** Push/PR plus weekly cron schedule.
- **Runs on:** `ubuntu-latest`
- **Steps:** Checkout, CodeQL init, autobuild, analysis.
- **Matrix:** JavaScript and Python.

### Stale Cleanup

- **Trigger:** Daily cron schedule.
- **Action:** Labels stale issues/PRs and closes after configured inactivity window.

### Frontend Deploy

- **Target:** Cloudflare Pages
- **Expected steps:** install, build (`veritas-global-intelligence`), deploy, smoke check.

### Backend Deploy

- **Target:** VPS host behind Nginx
- **Expected steps:** checkout, install, restart PM2 process, health check.

## Secrets Required

| Secret | Where Set | Purpose |
|--------|-----------|--------|
| `VPS_HOST` | GitHub Actions secrets | Target backend server address |
| `VPS_PORT` | GitHub Actions secrets | SSH port for deployment |
| `VPS_USER` | GitHub Actions secrets | SSH user for deployment |
| `SSH_PRIVATE_KEY` | GitHub Actions secrets | Non-interactive SSH authentication |
| `CLOUDFLARE_API_TOKEN` | GitHub Actions secrets | Cloudflare Pages/DNS deploy actions |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions secrets | Cloudflare account scoping |
| `CLOUDFLARE_PAGES_PROJECT` | GitHub Actions secrets | Cloudflare Pages project name |
| `VITE_API_BASE_URL` | GitHub Actions secrets | Frontend API base URL during build |
| `API_HEALTHCHECK_URL` | GitHub Actions secrets | Post-deploy backend health endpoint |

## Manual Triggers

Manual dispatch is not currently defined in these workflows.

If manual triggers are needed, add `workflow_dispatch` to each workflow file.
