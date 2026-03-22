# Development Playbook

This document outlines day-to-day engineering workflow for Veritas News Hub.

## 🛠️ Environment Setup

### Prerequisites
Install Node.js LTS (18+ recommended).

### Local Configuration
1. `cd veritas-global-intelligence`
2. `npm install`
3. Configure `.env.local` with required keys:
   - `GEMINI_API_KEY`
   - `GOOGLE_MAPS_PLATFORM_KEY`
   - `NEWS_API_KEY`
4. Optional keys:
   - `TWITTER_BEARER_TOKEN`
   - `GROK_API_KEY`
5. Start dev server: `npm run dev`

## 🌿 Branching Strategy
We use a trunk-style flow:

1. `master` is the active default branch.
2. Create short-lived feature branches: `feat/my-feature` or `fix/issue-123`.
3. Open a Pull Request (PR) to merge into `master`.
4. **Squash and Merge** is preferred to keep history linear.

## ✍️ Coding Standards

### General
- **Naming**: Use descriptive variable names (`isAuthenticated` vs `a`).
- **Comments**: Explain "Why", not "What".
- **Formatting**: We use `Prettier` (JS/TS) and `Black` (Python) where possible.

### JavaScript / TypeScript
- Linting: `npm run lint`
- Build verification: `npm run build`

## 🧪 Testing Strategy
- Add tests for:
  - `server.ts` endpoint behavior (success, timeout, fallback, key missing).
  - `calculateTruthIndex` and analysis-service edge cases.
- If tests are not yet available, document manual verification in the PR.

## 📦 Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `refactor:` Code restructuring without behavioral change

