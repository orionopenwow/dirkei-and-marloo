# Changelog

## Unreleased

- New project wizard, platform question: the app scans for installed engines at launch and each time the question opens. Each tile shows INSTALLED / NOT INSTALLED / ONLINE and a Download button (installs through winget with live status; ids are fixed on the helper) or an Open site button. The scan results are real; no engine install was actually run.
- New project wizard: **Auto-generate from my answers** on "What does the player do" and "Anything else every step should know". Written from your genre, sub-genre, multiplayer, story, budget, devices, controls, accessibility, art source and experience; offline, no AI; you can edit it after.
- `/api/open` also allows the engine download sites (look-alike addresses are tested and refused).

- Ollama agent mode gets **web_search** (DuckDuckGo page, no key) and **ask_frontier** (hands a hard question, with any attached screenshots, to Claude, else Codex). Local models stay the small driver; the strong model is called only when they choose to. Models without native tool calling (qwen2.5-coder) can write the call as JSON text and it is accepted. Thinking is turned off for models that have it (about 3x faster here). Checked for real with qwen3:8b and qwen2.5-coder:7b: search, ask_frontier and a screenshot all worked. Not frontier-smart by themselves: the 7B/8B still does the planning, and plain chat (agent mode off) has none of these tools.

- Chat: **screenshots**. Paste into the message box, drop a file, or press Image (up to 4 per message, shrunk to 1600 px). Sent with that one message only; later turns just note that an image was attached. Claude (chat and agent) and Codex were checked with a real image and named its colour. Ollama, LM Studio, OpenRouter, Kimi and Gemini API send the image in their own format (Ollama checked only against a fake server). Ollama models without vision (like qwen3:8b) get the screenshot described first by Claude (else Codex), then answer from that text. This sends the image to that cloud tool; the chat shows a line saying so. Checked for real with qwen3:8b. Other providers' models without vision still return their own error.

- Chat: **Agent mode** for Claude, Codex, and local models. Ollama uses our own tool loop (shell, read file, write file, fetch page; 12 steps max; real qwen3:8b created a file, but it took about a minute, and qwen2.5-coder:7b was not retried on it). LM Studio goes through Codex `--oss` (never tried). Codex `--oss` did nothing useful with two Ollama models, which is why Ollama has its own loop. Gemini CLI, Kimi and the API-key providers have none yet. Runs the real tool (Claude Code / Codex) with all tools on and no permission prompts, so it can read pasted links, install plugins and skills, and edit files in a work folder (default `~/QueensDomainLab-work`, must be inside the user folder). It is NOT sandboxed: it has full access to the PC. Off by default. A status bar shows cost, tokens, agent time and turns per chat, with buttons that send `/ponytail ...`, review, audit and Copy.

- Claude and Codex replies may now run up to 10 minutes (was 4) so long "max" or ultracode answers are not cut off. New "ultracode" option for Claude (unproven in chat, which has no tools).
- Tests now start the helper on a spare port and check its safety rules (other sites refused, unlisted links blocked, bad model names refused).

- Fix: Install no longer reports "setup complete" when the helper is out of date or a step failed. Error replies without a trailing newline were being dropped; now they show, and success is only reported after Ollama is confirmed running with a model.
- Ollama detection also checks Program Files, and the guide shows where it was found ("Already installed at ...") and moves on to the next step.
- Ollama: the Install button now does everything in one click: downloads the official installer, refuses to run it unless it is signed by Ollama, installs it, starts Ollama, then downloads the recommended model. A progress bar shows size, speed and time left (estimate from the last ~10 s of speed). Model downloads from the list use the same bar.
- `QD_PORT` and `QD_OLLAMA_SETUP_URL` environment variables let tests run a second helper against a fake installer.
- Skin v2: thicker bevelled gold/blue frames with black outlines, chamfered buttons, framed sidebar, thicker scrollbars. One override block at the end of the CSS (delete it to revert).
- Segmented progress bars (.sbar): header (overall steps), sidebar projects, chat size, and Speed / Fits-your-PC on local-model hover cards. Hovering the bars shows a short card with the numbers in plain words.
- Left sidebar layout: New chat, tabs, and a list of your projects (click one to open its Briefing). Replaces the top tab bar.
- Chat tab (home screen): pick provider, model and effort per message. Options remembered per model. Replies stream for Ollama, LM Studio, OpenRouter, Kimi and Gemini API (Send becomes Stop); Claude Code, Codex and Gemini CLI arrive in one piece. History is sent as text.
- Saved chats: Recent chats list in the sidebar (last 30, kept in this app's browser storage), open and delete.
- Project context checkbox: the chat's system prompt names your project, target, progress and current step.
- Chat: token-size estimate with a warning for small local windows, Retry on errors, and a first-run box that points to Settings when no model is set up.
- Projects tab is now Design: "+ New profile", Continue on saved ones, and Duplicate.
- Chat: Compare with a second model (reply shown, not saved), Save .md, Esc to stop, Alt+N for a new chat.
- Chat suggests the next model after a limit/quota/timeout error: other signed-in tool, then local models rated for this PC (never red), then API keys. Button to switch; never switches by itself.

## 0.1.0

### Project wizard
- Projects tab: Queen's Domain preset + custom projects from a 25-question wizard.
- 10 platforms (Spawn.co, Rosebud, Unity, Godot, Unreal, Roblox, GameMaker, Phaser, Three.js, Construct), 10 genres, 5 GameDiscoverCo (Sept 2022) sub-genres.
- Dynamic step count by project size; platform-, camera- and genre-aware prompts; generated AGENTS.md, handoff and 12 audit rules.
- Edit profile (progress carried by step title), Copy plan / Save .md export, "can this PC build it?" gauge.

### Models
- Settings model picker: Claude Code, Codex, Gemini CLI, Kimi, Ollama, LM Studio, OpenRouter, Gemini API.
- Claude/Codex sign-in with progress bar, status check and copyable activity log.
- 26 free Ollama models rated green/yellow/orange/red for the host PC; hover cards; "best for you" badge; first-time setup guide; benchmark; disk check.

### Foundations
- StarCraft 1 / Protoss UI, standalone Edge app window, desktop shortcut and icon.
- Queen's Domain 50-step blueprint with Unity / Spawn.co prompt modes.

### Repository
- `docs/DESIGN.md`: look, colour meaning, UI writing rules, known gaps.
- Structured into `app/`, `server/`, `scripts/`, `tests/`, `docs/`; `npm test` with 14 checks.



