# Security Playbook

Operational guidelines for keeping the project secure.

## 🛡️ Proactive Measures
- **Dependency Scanning**: Handled by Dependabot. Review PRs weekly.
- **Static Analysis**: CodeQL runs on repository workflows. Keep `master` free of unresolved critical findings.
- **Secret Scanning**: GitHub Secret Scanning is enabled. Never commit `.env` files.
- **Input Validation**: Validate and sanitize API query parameters in `server.ts`.
- **Timeout Controls**: Keep bounded request timeouts for all outbound API calls.

## 🚨 Incident Response
1. **Report**: Use private reporting process in [SECURITY.md](../../SECURITY.md).
2. **Triage**: Maintainers confirm severity and reproducibility.
3. **Fix**: Develop a patch in a private fork/branch.
4. **Release**: Merge fix to `master` and ship patched build.
5. **Disclose**: Publish a Security Advisory.

## 🔒 Best Practices
- Use Least Privilege for CI tokens.
- Mask all secrets in CI logs.
- Regularly audit 3rd party actions used in workflows.
- Avoid exposing provider API keys in client-side code paths.
