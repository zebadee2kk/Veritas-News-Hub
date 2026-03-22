# Best Practice Polyglot Template [AI-Native]

[![Security Scan](https://github.com/zebadee2kk/best-practice-repo-template/actions/workflows/security-scan.yml/badge.svg)](https://github.com/zebadee2kk/best-practice-repo-template/actions/workflows/security-scan.yml)
[![CI](https://github.com/zebadee2kk/best-practice-repo-template/actions/workflows/ci.yml/badge.svg)](https://github.com/zebadee2kk/best-practice-repo-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **universal, AI-native** repository template designed for modern "Agentic" workflows. Integrating best practices for **Governance**, **Security**, and **Polyglot Development** (Node.js & Python).

## 🌟 Features
- **Polyglot CI/CD**: Automatically detects `package.json` (Node.js) or `requirements.txt` (Python) and runs the correct pipeline.
- **AI-Ready**: Includes `.cursorrules` and `ai/` directory to give generic and specific instructions to AI agents (Claude, Gemini, Copilot, Perplexity, Codex).
- **Multi-Agent Team Model**: Pre-configured team charter and playbook for orchestrating multiple AI agents (Opus, Sonnet, Haiku, Perplexity, Codex, Antigravity) with a human Director.
- **Governance First**: Pre-configured Issue Templates, Security Policy, and Contributing Guide.

## 🚀 Quick Start

### 1. Instantiate the Template
Click **"Use this template"** to create a new repository.

### 2. Choose Your Stack

**For Node.js / Web Apps:**
```bash
npm init -y
# The CI pipeline will now automatically detect a Node project
```

**For Python / AI / ML:**
```bash
touch requirements.txt
# The CI pipeline will now automatically detect a Python project
```

### 3. Set Up Your AI Team

```bash
# Customise the team charter for your project
# Replace all {{PLACEHOLDERS}} in:
nano ai/AI_TEAM.md
nano ai/AI_CONTEXT.md
nano ai/AI_RULES.md
```

See the [AI Team Playbook](./ai/AI_TEAM_PLAYBOOK.md) for a full explanation of the multi-agent model.

## 📖 Documentation

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](./docs/playbooks/architecture.md)
- [Roadmap](./ROADMAP.md)

## 🤖 AI Team Model

This template includes a battle-tested pattern for orchestrating multiple AI agents on a single project:

| Agent | Role |
|-------|------|
| **You** | Director & Human-in-the-Loop |
| **Perplexity** | Project Manager & Lead Research |
| **Opus** | Architect |
| **Sonnet** | Senior Engineer |
| **Haiku** | Engineer |
| **Codex** | Security & Code Review |
| **Antigravity** | UI/UX & Design |

**Key principle**: The repo is shared memory. Agents communicate via commits, docs, and issues — not via a shared chat thread.

→ [Full team charter template](./ai/AI_TEAM.md)  
→ [Why this model works](./ai/AI_TEAM_PLAYBOOK.md)

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before getting started.

- [Development Playbook](./docs/playbooks/development.md)
- [Project Management Playbook](./docs/playbooks/project-management.md)

## 🛡️ Security

If you discover a security vulnerability, please see our [Security Policy](SECURITY.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
