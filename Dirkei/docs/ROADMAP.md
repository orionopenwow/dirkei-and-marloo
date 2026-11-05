# Roadmap & known gaps

## Not yet verified (be honest about these)

- **Ollama has not been run on the dev machine.** Pulling models, benchmarking and local audits are untested. Speed estimates (e.g. ~10 tok/s for `qwen2.5-coder:7b`) are bandwidth-based guesses.
- **Chat with real models.** No real message has been sent to Claude Code, Codex or any API from the chat. Streaming, Stop, Compare and Retry were checked against a fake Ollama and error paths only. Claude Code, Codex and Gemini CLI are not streamed (one chunk when done; Stop hides output but the tool runs to its own timeout).
- **Effort lists** (`low..max` for Claude, `low..high` for Codex) are from `server/server.js`, not checked against the installed tools' `--help`. "Ultra" is not offered.
- **Next-model suggestion** detects limit errors by matching message text, which may miss the real wording, and treats a tool that is found on the PC as signed in.
- **Context meter** is about 4 characters per token; the 3000 / 60000 warning limits are rough guesses.
- **One-click Ollama install has never run for real.** Checked only against a fake installer: download bar, time left and the refusal of an unsigned file work. Unverified: that the real `OllamaSetup.exe` is signed with a subject containing "Ollama" (if not, the app refuses and points to the website), that it accepts `/SILENT /NORESTART`, and that the installer starts the server. Time left is an estimate.
- **A real audit end to end** (paste AI output → model returns JSON verdict) has not been exercised end to end by the author.
- **Spinner animation** was only verified by position; the test pane's animation clock stalled.
- Everything UI-side was verified by scripted checks in the browser pane, not by hand in the Edge window.
- `REQ` hardware requirements and `GPU_BW` bandwidths are estimates.
- GameDiscover sub-genres are Sept 2022 public data; current rankings are paywalled.

- **Claude "ultracode" effort is offered but unproven.** The CLI accepts `--effort ultracode` (exit 0, 2.1.317), but chat runs with no tools, so it probably does nothing extra. Not tested, to save usage.

- **Agent mode is only checked for a plain reply.** A real call through the helper returned text and cost/token stats. Never run: pasting a link, installing a plugin from it, the `/ponytail ...` buttons (slash commands in print mode), the Stop button killing the process tree, the page UI in a browser. Not built: the Board and Compact buttons and the "tests passed" box from the Ponytail bar. Codex agent mode returned a plain reply with token counts (no cost shown). Ollama via Codex `--oss` connected but qwen2.5-coder:7b replied with raw tool-call JSON and did nothing. qwen3:8b (installed) did no better: asked to create a file, it answered with unrelated text about site hosting and made no file (Retried with Ollama's window raised to 16384 via OLLAMA_CONTEXT_LENGTH: the model then saw the full ~8k-token prompt instead of ~2k, but still produced no message or tool call. So the small window was part of it, not all. Fix: Ollama now has its own tool loop (`ollamaAgent` in server.js, 16k window per request). Real run: qwen3:8b wrote hello.txt in about 59 s. Only one simple task tried; harder jobs, link reading and long chats are unproven, and a 5 GB model on a 4 GB card is slow.) Treat local models as chat-only for now. LM Studio never tried. Gemini CLI and Kimi CLI are not installed here, so untested and not wired. OpenRouter agent mode runs Claude Code against OpenRouter (env vars from OpenRouter's own docs) but was never run: no key here. Gemini API and Kimi API would need our own tool loop (not built). Checked for real with Claude: pasting a link (it fetched the page), a `/ponytail-help` slash command, and Stop (the process tree ends within 5 s). Never run: a real plugin install from a link, and the page UI in a browser.

- **Screenshots are only proven for Claude and Codex.** Both named the colour of a red test image. Ollama is checked against a fake server only: no vision model installed (try `gemma3:4b` or `qwen2.5vl`), and what a non-vision model does with an image is unknown. OpenRouter, LM Studio, Kimi, Gemini API and Gemini CLI formats are written from their docs and never run. The attach buttons, paste and drop were never clicked in the real window.

- **Local "frontier" tools are thin.** `web_search` scrapes DuckDuckGo's plain page and can break or get blocked. `ask_frontier` spends your Claude/Codex plan and sends the question (and images) to the cloud. Only short, easy jobs were tried; long multi-step jobs with the 8B model are unproven. Plain chat has no tools. Not built: Deep Research as a job, a tool-free "online" chat mode.

- **Engine one-click install never ran.** The winget ids exist (checked with `winget show`), but no install was started (big downloads, UAC prompts). Unknown: the live status lines, what happens when winget needs admin approval, and that the tile updates afterwards. The engine tiles and Auto-generate buttons were never seen in the real window. Detection paths for Godot, GameMaker and Roblox are guesses from usual install folders (those three show "missing" here, which may be true). Auto-generate text is template-based, not model-written.

## Next

1. Run Settings → Ollama → install → benchmark; tune `rate()` from the measured number.
2. Real audit run with Claude; harden JSON parsing if needed.
3. Chat gaps: "summarise and continue" when the context fills, usage and cost readout, Ctrl+K search, stream the CLIs if their output format allows it.
4. Project import/export as JSON (profile only) for sharing.
5. More genre modules and sub-genre twists; Metroidvania, Tower Defence, Fighting, Horror as full genres.
6. Per-step "ask the loaded model to build this" button (run the step prompt directly).
7. Regenerate progress mapping by stable step ids instead of titles.
8. Optional: package as an installer (Electron/Tauri) if the Edge app-window approach proves limiting.

## Ideas parked

- Reference-game-aware prompts (pull design pillars from the "feels like" answer).
- Compare two models side by side on the same audit.
- Download-time estimates (needs a bandwidth probe).
