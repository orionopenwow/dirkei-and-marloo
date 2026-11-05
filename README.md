# Dirkei & Marloo Collaborative Matrix

<p align="center">
  <strong>Dual-Fork Game Studio Matrix & Automated Developer Console</strong><br>
  <em>Isolated, parallel development branches for Dirkei and Marloo with automated push isolation and cross-pollination feature consolidation.</em>
</p>

---

## 🏛️ Repository Architecture

This repository hosts two independent, parallel copies/forks of Queen's Domain, governed by strict folder isolation rules:

```
dirkei-and-marloo/
├── .github/workflows/
│   └── folder-guard.yml      # CI rule: Dirkei can only touch Dirkei/, Marloo only Marloo/
├── console/                  # Interactive Developer Console & live difference consolidator
│   ├── index.html            # Web dashboard (Metrics, Diff Tree, Feature Matrix, Suggestions)
│   ├── server.js             # Local consolidation runner (http://localhost:5050)
│   └── diff-data.json        # Compiled diff telemetry
├── Dirkei/                   # Dirkei's version / fork of Queen's Domain
│   ├── app/
│   ├── QueensDomain.exe
│   └── ...
├── Marloo/                   # Marloo's version / fork of Queen's Domain
│   ├── app/
│   ├── QueensDomain.exe
│   └── ...
├── scripts/
│   ├── diff-versions.js      # CLI/Node tool comparing Dirkei vs Marloo
│   └── push-guard.js         # Local pre-push hook preventing cross-folder edits
├── DIRKEI_AGENT_PROMPT.md    # Dedicated setup prompt for Dirkei's AI Git Agent
└── index.html                # Multi-fork launch portal
```

---

## 🔒 Push Isolation Rules

- **Dirkei**: May **only** add, edit, or delete files inside `Dirkei/`. Any commit touching `Marloo/` is automatically blocked by `.github/workflows/folder-guard.yml` and local push guards.
- **Marloo**: May **only** add, edit, or delete files inside `Marloo/`. Any commit touching `Dirkei/` is blocked.

---

## ⚡ Developer Console

The **Developer Console** automatically consolidates version differences, feature checklists, and suggested cross-pollinations:

1. **Start the Console**:
   ```bash
   node console/server.js
   ```
   Open `http://localhost:5050` in your browser.
2. **Run Pull Check & Diff**:
   Click **[⚡ Run Pull Check & Consolidate]** or run:
   ```bash
   npm run diff
   ```
   This pulls the latest commits from GitHub, checks for differences between `Dirkei/` and `Marloo/`, and surfaces:
   - **File Divergence**: File sizes, lines modified, unique files.
   - **Feature Checklist**: Scanned active features in both forks.
   - **Suggested Features**: AI-suggested cross-pollinations (features Dirkei built that Marloo can adopt, and vice versa).

---

## 🤖 For Dirkei: Setting Up Your Git Agent

Give your AI agent (Claude Code, Cursor, Codex, or AGY) the prompt provided in **[DIRKEI_AGENT_PROMPT.md](DIRKEI_AGENT_PROMPT.md)** to instantly configure your workspace, pre-push guards, and workflow bounds.
