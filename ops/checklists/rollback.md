# Rollback Checklist

Use this checklist if deployment validation fails or production regressions are detected.

## Trigger Conditions

- [ ] API health endpoint failing repeatedly.
- [ ] Frontend major user flow broken.
- [ ] Critical security or data exposure issue detected.
- [ ] Elevated 5xx or severe latency after release.

## Frontend Rollback

- [ ] Promote previous Cloudflare Pages deployment.
- [ ] Purge Cloudflare cache for app hostname.
- [ ] Re-validate `https://app.<domain>`.

## Backend Rollback

- [ ] Restore previous backend release directory or commit.
- [ ] Reinstall dependencies if needed.
- [ ] Restart PM2 process (`pm2 restart veritas-api`).
- [ ] Confirm API health endpoint recovery.

## DNS / Edge Mitigation (if needed)

- [ ] Temporarily route traffic to maintenance page.
- [ ] Disable problematic WAF/rate rule if it causes false positives.
- [ ] Re-enable stable config after incident control.

## Incident Closure

- [ ] Capture timeline and root cause summary.
- [ ] Document remediation tasks in `ROADMAP.md`.
- [ ] Update `PROJECT_STATUS.md` with postmortem status.
