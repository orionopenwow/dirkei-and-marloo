# Testing

```bash
npm test
```

`tests/run.js` needs no dependencies and checks:

1. `server.js` and the page's combined scripts parse (`node --check`).
2. Every element id the page script references exists in the markup.
3. Generator invariants: 10 platforms/genres, step count grows with project size, **every platform × genre generates prompts with no `undefined`**, existing projects start with an audit step, declarative platforms never ask for code, 12 audit rules.
4. Hardware verdicts for the developer machine (i5-12500H, 16 GB, 4 GB VRAM).
5. `nextModel()` (next-model suggestion): other signed-in tool first, else best local model never red, else nothing.

## Manual checks (not automated)

- Desktop shortcut opens the window; closing it stops the helper within ~45 s.
- Settings → Claude → Load (after sign-in) shows the model in the header.
- Briefing → paste output → **Audit** returns a verdict.
- Ollama flow: install → start → download the recommended model → Benchmark.
- Hover cards: 0.5 s spinner left of the pointer, then the card.
- Chat (not automated): send a real message with Claude Code and with Codex (CLIs answer in one piece); Stop mid-reply (Esc); Retry after an error; reload and reopen a saved chat; Compare with a second model; Save .md; first-run box when nothing is set up; narrow window.
- Detection of an existing Ollama: run a test helper with `LOCALAPPDATA` pointing at a folder holding `Programs\Ollama\ollama.exe`; step 1 should turn into a tick with the path.
- One-click Ollama install (not automated): `QD_PORT=47899 QD_OLLAMA_SETUP_URL=<local fake file> node server/server.js` shows the download bar, then the unsigned-installer refusal. A real install has NOT been run (see ROADMAP).
- Streaming was checked with a fake Ollama (`/api/tags` + streamed `/api/chat`) through the helper and the page. Redo that if `streamChat()` changes.

## Testing the UI with the browser pane

Start the helper (`npm start`), open <http://127.0.0.1:47831/>, drive the page with scripts. The pane's animation clock can stall, so verify positions and state, not animation frames. Stop the helper afterwards (kill `node` processes whose command line contains `QueensDomainLab`).

## After editing `server.js`

Restart it. A stale process keeps serving old code (this caused a real bug once).
