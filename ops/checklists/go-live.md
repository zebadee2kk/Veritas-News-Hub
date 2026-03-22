# Go-Live Checklist

Run this checklist after deployment changes are in place.

## Backend Validation

- [ ] PM2 process `veritas-api` is online.
- [ ] `https://api.<domain>/health` returns 200.
- [ ] Nginx test passes (`nginx -t`) and service is active.
- [ ] API logs show no startup exceptions.

## Frontend Validation

- [ ] `https://app.<domain>` loads and renders correctly.
- [ ] Core user flow works (load feed, open map, view article details).
- [ ] Frontend can call API endpoints without CORS errors.
- [ ] No secrets are visible in browser network or bundled source.

## Cloudflare Validation

- [ ] DNS proxy is enabled for public hostnames.
- [ ] SSL/TLS mode is Full (strict).
- [ ] WAF managed rules enabled.
- [ ] API rate limiting rule enabled.

## Operational Validation

- [ ] Uptime checks configured for app and API hostnames.
- [ ] Alert channels verified.
- [ ] On-call/contact ownership confirmed for first 24 hours.

## Sign-Off

- [ ] Deployment owner signs off.
- [ ] Final notes logged in `PROJECT_STATUS.md`.
- [ ] Any follow-up items added to `ROADMAP.md`.
