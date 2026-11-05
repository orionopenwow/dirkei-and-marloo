# CLAUDE.md

Queen's Domain Lab: a StarCraft-styled vibe-coding game planner. See `README.md`, `HANDOFF.md`, `AGENTS.md`.

## Commands
```bash
npm test                    # dependency-free checks
npm start                   # helper on http://127.0.0.1:47831/
npm run install-shortcut    # icon + desktop shortcut
```

## Style
- Smallest change that fully works; keep error handling and validation.
- UI text in plain language. Keep the SC1 look (CSS variables at the top of `app/index.html`).
- `app/wizard.js` stays pure (no DOM/network).

## Gotchas
- `pick` (model picker) and `pickOpt` (wizard) are different globals.
- Restart `server/server.js` after changing it.
- Don't read credential files (`~/.claude/.credentials.json`, `~/.codex/auth.json`); ask the tools for status instead (`claude auth status`, `codex login status`).
- The helper only serves files listed in `FILES` in `server/server.js`; add new static files there.
- Don't kill port 47831 if the app is running. Test with `QD_PORT`.
- Personal working rules go in `CLAUDE.local.md` (gitignored).
