# Design

Why the app looks and reads the way it does. Read this before changing UI text or styles. For structure see `ARCHITECTURE.md`.

## Principles

1. **StarCraft 1 / Protoss look.** Dark navy panels, cyan and gold accents, glowing numbers, a resource bar across the top, a "portrait" box for the current step. The theme is part of the product, so new screens should look like they belong to it.
2. **Plain language.** The reader is a hobbyist making a game with AI help, not a developer. Say "your PC can't run this well", not "VRAM insufficient". Explain a term once where it first appears.
3. **Honest status.** Hardware ratings and speed numbers are estimates and the UI says so. Never show a green tick for something that was not checked.
4. **Smallest thing that works.** One inline script, one stylesheet, no framework, no build step. Add a control only when a user task needs it.
5. **Safe by default.** Nothing is run, installed or opened without a visible button press. Validation and the `/api/open` allow-list are part of the design, not clutter.

## Visual tokens

Defined as CSS variables at the top of `app/index.html`. Use them instead of raw colours.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#03050b` | Page background |
| `--panel`, `--panel2` | `#07142a`, `#0a1d3a` | Panels, raised panels |
| `--blue` | `#1f78e0` | Borders, active controls |
| `--cyan` | `#6fd3ff` | Step numbers, highlights |
| `--gold`, `--gold2` | `#d4ae45`, `#8a6d1f` | Titles, current step, frames |
| `--green` | `#41e060` | Good / done / resource counters |
| `--red` | `#ff4a3d` | Errors, "can't run this" |
| `--text`, `--dim` | `#b9d4f5`, `#5f7ea8` | Body text, secondary text |

Fonts: Rajdhani (fallback Eurostile, Segoe UI) for text; Share Tech Mono (fallback Consolas) for numbers, step ids and anything copied. Fonts are not bundled, so the fallbacks are what many PCs will show.

## Frames and bars

The skin v2 block at the end of the CSS in `app/index.html` sets the look: 3 px gold frame, black hairline, blue inner line, black hairline, dark inner shade; chamfered buttons with an inner coloured line; black 1 px outlines around cards. Progress is always a segmented `.sbar` (green normal, yellow warn, red bad, cyan blue; `.mini` / `.big` sizes). Hover a bar for a short card built by `barCard()`: label, number, bar, one plain sentence.

## Colour meaning

The same four colours rate a local model against the PC and a project against the hardware:

| Colour | Meaning |
|---|---|
| Green | Runs comfortably |
| Yellow | Works, but slow or tight |
| Orange | Barely; expect long waits or crashes |
| Red | Will not run on this PC |

Do not reuse these colours for decoration on those screens.

## Layout

Claude Code style: a left sidebar (210 px; 150 px under 900 px wide) beside the main area. The sidebar holds **+ New chat**, the tabs, **Recent chats** (last 30, hover for delete) and **Your projects** (click to open its Briefing). The header keeps the resource bar. Alt+N starts a new chat; Esc stops a reply.

## Screens

- **Chat** (home): provider, model and the options that model declares (effort for Claude and Codex), remembered per model. Replies stream where the provider allows it; Send becomes Stop. Extras: Project context checkbox, Compare with a second model (its reply is shown but not saved), Save .md, a size estimate with a warning for small local windows, Retry on errors, and a first-run box that points to Settings. On limit-style errors a Switch button suggests the next model; it never switches by itself.
- **Design**: New profile (the 25-question wizard) or Continue / Duplicate / Delete saved profiles. **Edit profile** regenerates a plan and keeps progress by step title.
- **Briefing**: the current step as a copyable prompt, with Complete and Audit. A hardware verdict line sits above the prompt.
- **Settings**: one row per model provider with a status light, a Log in button for Claude and Codex, a quiet activity log and Copy log.
- **Local models**: rated cards, a hover card after a 0.5 s spinner, the "BEST FOR YOU" badge, a first-time setup guide and a disk check.

## Writing rules for UI text

- Short sentences; say what happens and what to do next.
- Errors name the cause and the fix ("Ollama is not running. Press Start.").
- Buttons are verbs: Copy plan, Save .md, Log in, Benchmark.
- No claim of success unless the helper reported it.
- Estimates carry the word "estimate" or "about".

## Known gaps

- Spinner timing was checked by position only, not by a real animation test.
- Hardware tables are estimates; real timing needs Ollama installed and a benchmark run.
- Chat has not been used with a real Claude Code, Codex or API model yet (see `ROADMAP.md`). The sidebar was checked at one window size only.
- No record of testing small windows, keyboard focus order, screen-reader labels or text contrast (`--dim` on `--bg` may be weak). Treat them as unchecked.

Record changes to these gaps in `ROADMAP.md`.

