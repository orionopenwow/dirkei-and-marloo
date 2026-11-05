# AGENTS.md: working on Queen's Domain Lab

Rules for AI agents (Claude Code, Cursor, Codex, ...) editing this repository.

## Ownership by folder
| Area | Folder | Notes |
|---|---|---|
| UI | `app/index.html` | One inline script; keep sections in the existing order |
| Generator & data | `app/wizard.js` | Pure functions only: no DOM, no network |
| Local helper | `server/server.js` | Zero dependencies; localhost only |
| Tooling | `scripts/` | PowerShell for Windows install/launch |
| Checks | `tests/` | Add a check for every new rule you rely on |
| Docs | `docs/`, `*.md` | Update when behaviour changes |

If several agents work at once, **one agent per folder**; cross-folder changes are requested, not made.

## Guardrails
1. **Ponytail**: the smallest change that fully works. No new dependency for a few lines. No wrapper classes or abstractions nobody asked for.
2. **Never remove validation, error handling or security checks** to shorten code (origin checks, regex-validated names, the `/api/open` allow-list).
3. **Security**: the helper binds 127.0.0.1 only. Never scrape credentials from other apps; Claude/Codex use their own sign-ins.
4. **Honesty**: don't claim something works unless it was run. Record unverified items in `docs/ROADMAP.md`.
5. **Name collisions**: `app/wizard.js` and the inline script share a global scope (`pick` vs `pickOpt`, `P`, `el`, `info`, `LVL`).
6. After editing `server/server.js`, restart it before testing.

## Definition of done
- `npm test` passes.
- New behaviour is covered by a test or listed as manual in `docs/TESTING.md`.
- Docs and `CHANGELOG.md` updated.
- Commit message explains the why; one logical change per commit.
