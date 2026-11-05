# Architecture

```
 Edge window (--app)  ──HTTP──▶  server/server.js  ──spawn──▶  claude.exe / codex.exe / gemini
   app/index.html                127.0.0.1:47831  ──fetch──▶  Ollama :11434 · LM Studio :1234
   app/wizard.js                                  ──fetch──▶  Gemini / OpenRouter / Moonshot APIs
```

## Front end (`app/`)

- **`wizard.js`**: pure functions and data, no DOM. Loaded first.
  `PLATFORMS`, `QUESTIONS`, `GENRES`/`G` (per-genre step modules), `generate(profile)`, `rulesFor`, `handoffFor`, `agentsFor`, `hwCheck`.
- **`index.html`**: markup, CSS and one inline script (state, rendering, wizard UI, model picker, auditor).
- **Chat** (home): `chatStream()` reads `/api/chat`; selectors are filled from `/api/providers` (each provider's `efforts`). History is sent as one text prompt. Saved chats: `localStorage['qd.chats']` (last 30). `nextModel()` in wizard.js picks the fallback after limit errors.
- **Layout**: left sidebar (`#nav`: New chat, tabs, recent chats, projects) beside `<main>`. The `data-t=projects` tab is labelled Design.
- **Projects**: the preset (`QD`, fixed 50 steps from the `S` array) plus custom projects `{id,name,profile,done[],cur}`. Steps for custom projects are **regenerated from `profile`** on load, never stored. Progress lives in `localStorage['qd.projects']`; `done` is a list of step indices.
- **Name collisions**: wizard.js and the inline script share one global scope. The model-selection function is `pick`; the wizard's lookup helper is `pickOpt`. Keep them distinct (also `P`, `el`, `info`, `LVL`).

## Helper (`server/server.js`)

Zero-dependency Node server. Serves `app/`, detects installed tools, runs prompts, reads hardware. Exits ~45 s after the page stops pinging (and after 120 s if the window never connects).

Security: binds 127.0.0.1 only; every `/api/*` call must have `Host: 127.0.0.1:47831` and, if present, a matching `Origin`. `/api/open` only opens an allow-list of key/download pages. Model names passed to Ollama are regex-validated.

### API

| Route | Method | Purpose |
|---|---|---|
| `/api/ping` | GET | Heartbeat |
| `/api/providers` | GET | Detect providers; Ollama catalog with ratings; hardware |
| `/api/system` | GET | Live hardware (CPU, RAM, GPU/VRAM, disk, memory bandwidth) |
| `/api/chat` | POST | Streamed reply (ndjson `{t}` ... `{done}` / `{error}`); same body as `/api/run`. HTTP providers stream, CLIs send one chunk |
| `/api/run` | POST | Run a prompt: `{provider, model, effort, key, system, prompt}` → `{text}` or `{error}` |
| `/api/authstatus?provider=` | GET | Is Claude/Codex signed in (30 s cache; `fresh=1` bypasses) |
| `/api/login` | POST | Open the tool's own sign-in in a console window |
| `/api/open` | POST | Open an allow-listed https URL |
| `/api/openrouter/free` | GET | Live list of free OpenRouter models |
| `/api/ollama/pull` | POST | Stream a model download (ndjson) |
| `/api/ollama/install` | POST | One-click install: download official installer, check signature, run, wait for Ollama. ndjson `{phase,done,total}` / `{done}` / `{error}` |
| `/api/ollama/start` | POST | Start `ollama serve` |
| `/api/ollama/bench` | POST | Time a real 128-token reply |

## Launch chain

Desktop shortcut → `scripts/launcher.ps1` → starts `server/server.js` (hidden) → opens `msedge --app=http://127.0.0.1:47831/` with its own profile dir `%LOCALAPPDATA%\QueensDomainLab`. localStorage therefore lives at that origin.
