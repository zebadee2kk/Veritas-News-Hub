# CI/CD Pipelines - Veritas News Hub

## Pipelines Overview

| Workflow | File | Trigger | Purpose |
|----------|------|---------|--------|
| CI | `.github/workflows/ci.yml` | Push and PR on configured branches | Lint and test Node/Python projects when detected |
| Security Scan | `.github/workflows/security-scan.yml` | Push, PR, and weekly schedule | CodeQL analysis for JavaScript and Python |
| Stale Cleanup | `.github/workflows/stale.yml` | Daily schedule | Mark and close inactive issues/PRs |

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

## Secrets Required

| Secret | Where Set | Purpose |
|--------|-----------|--------|
| None required for current workflow definitions | GitHub repository settings | CI and CodeQL run without app runtime API keys |

## Manual Triggers

Manual dispatch is not currently defined in these workflows.

If manual triggers are needed, add `workflow_dispatch` to each workflow file.
