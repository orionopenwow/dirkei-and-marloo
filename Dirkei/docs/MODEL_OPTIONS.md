# Model-specific options (research, 2026-11-04)

What each provider lets a user choose, so the chat's option bar can show the real controls. Confidence: **official** = read from the vendor's own docs or the installed CLI this session; **secondary** = blogs/third-party docs; **unverified** = not found. Nothing here has been run from the chat yet.

## Claude (Claude Code CLI)

| Option | How it is set | Confidence |
|---|---|---|
| Effort `low, medium, high, xhigh, max` | `--effort <level>` (installed CLI 2.1.317 help lists exactly these five). Which levels exist depends on the model (docs: no `xhigh` on some models) | official |
| **UltraCode** | A **toggle, not an effort level**. `/effort ultracode`, `--effort ultracode` (turns it on and sets `xhigh`; needs v2.1.203+) or the `ultracode` setting. With it on, Claude orchestrates "dynamic workflows" (parallel subagents) at whatever effort the session runs. Unavailable if the model has no `xhigh` or workflows are off | official (docs) |
| `ultrathink` | A keyword typed in a prompt: deeper reasoning for that one turn | official + secondary |
| Model aliases | `default`, `fable`, `opus`, `sonnet`, `haiku`, `opusplan` (plan with Opus, build with Sonnet); `[1m]` suffix for 1M context where offered | official |
| Fallback | `--fallback-model a,b` when the main model is overloaded | official |
| Fast mode | `/fast` | official (docs) |
| Permission mode | `--permission-mode` acceptEdits, auto, bypassPermissions, manual, dontAsk, plan | official |
| Budget cap | `--max-budget-usd` | official |

Our chat runs `claude -p --tools ''` (no tools), so UltraCode would have nothing to orchestrate. Docs say `--effort ultracode` is accepted, but the installed `--help` does not list it: **test before offering it**. Do not turn on tools in chat without a permission design.

## Codex (OpenAI)

| Option | Values | Confidence |
|---|---|---|
| `model_reasoning_effort` | levels the selected model advertises, "such as `low`, `medium`, `high`, `xhigh`, `max`, or `ultra`" (depends on model and client). Our app only offers low to high | official |
| `model_reasoning_summary` | `auto`, `concise`, `detailed`, `none` | official |
| `model_verbosity` | `low`, `medium`, `high` | official |
| `web_search` | `disabled`, `cached` (default), `indexed`, `live`; CLI flag `--search` | official |
| Sandbox | `read-only`, `workspace-write`, `danger-full-access` (`-s`) | official |
| Approval policy | `on-request`, `never`, granular table | official |
| Local models | `--oss --local-provider lmstudio\|ollama` | official |
| Attach images | `-i FILE` | official |

OpenAI **Deep Research** is API-only (`o3-deep-research`, `o4-mini-deep-research` on the Responses API, background mode, web search / file search / MCP tools), not a Codex CLI option (secondary + official guide).

## Gemini (API and CLI)

- **Thinking**: `thinking_level` `minimal | low | medium | high`; the supported levels differ per model (e.g. `gemini-3-pro-preview` only `low, high`; some models reject `minimal` with a 400). Older 2.5 models also used token budgets. Thought summaries: `thinking_summaries: "auto"`. (official)
- **Built-in tools**: Google Search, Google Maps, URL Context, File Search, Code Execution. (official)
- **Deep Research**: a separate **agent** (Interactions API), run with `background=true` then polled until `completed`, can stream progress. The model id differs between Google pages (`deep-research-pro-preview-12-2025` vs `deep-research-preview-04-2026`): check before use. (official, partly secondary)
- **Deep Think**: no API option found. (unverified)
- Our Gemini model list (`gemini-2.5-*`) is older than the models the docs now describe (3.x and later). **Model lists in `server/server.js` are likely stale** for several providers.

## Ollama (local)

- `think`: top-level request field, `true/false` or named levels, per model. Ask `POST /api/show` for `thinking.values` and `thinking.default`; `values: [false]` means no thinking support. (official)
- Reasoning arrives in a separate `message.thinking` field. **Our chat reads only `content`, so it silently drops it.**
- `options`: `temperature`, `num_ctx` (default window can be as small as 4096), top-level `keep_alive`. (official/secondary)

## LM Studio (local)

`reasoning.effort` only for `openai/gpt-oss-20b` as of 0.3.29; reasoning in a separate field is an opt-in setting for some models. (secondary: changelog + issue tracker)

## OpenRouter

- `reasoning.effort`: `xhigh, high, medium, low, minimal, none` (or a token budget, not both). (official)
- Model-name variants: `:free`, `:nitro` (fast), `:floor` (cheap), `:exacto` (tool-calling quality), `:thinking`, `:extended`, `:batch`. `:online` is **deprecated**: use the `openrouter:web_search` server tool. (official)

## Kimi (Moonshot)

Thinking toggle `thinking: {type: "enabled" | "disabled"}`; `kimi-k2-thinking` and `-turbo` model ids; newer models may always reason. No confirmed web-search or deep-research switch. (secondary only; Moonshot's own docs were not found)

## Not researched

Claude.ai's "Research" feature (not in the CLI or API as far as found), Perplexity, DeepSeek, Grok.

## What this means for the chat

1. **Make options data-driven from the provider**, not hard-coded: Ollama `/api/show`, Codex advertised levels, Gemini per-model levels.
2. Add per-provider controls: Claude (ultracode toggle after testing, ultrathink tick, fast mode, fallback), Codex (summary, verbosity, web search mode, more effort levels), Gemini (thinking level, Search/URL/Code tools), Ollama (think, context size), OpenRouter (effort, variants).
3. **Show reasoning**: collapsible "thinking" block where the provider returns it.
4. **Web search toggle** where the provider supports it.
5. **Deep research as a job, not a chat turn**: long-running, background, progress bar, result saved (Gemini agent, OpenAI deep-research models).
6. Refresh the stale model lists; consider reading them from each provider instead of hard-coding.

## Sources

Official: [Claude Code model config](https://code.claude.com/docs/en/model-config) · [Codex config reference](https://developers.openai.com/codex/config-reference) · [Gemini thinking](https://ai.google.dev/gemini-api/docs/thinking) · [Gemini tools](https://ai.google.dev/gemini-api/docs/tools) · [Gemini Deep Research](https://ai.google.dev/gemini-api/docs/deep-research) · [Ollama thinking](https://docs.ollama.com/capabilities/thinking) · [OpenRouter variants](https://openrouter.ai/docs/guides/routing/model-variants) · [OpenAI deep research](https://developers.openai.com/api/docs/guides/deep-research). Installed `claude --help` (2.1.317) and `codex exec --help`.
Secondary: [UltraCode explainer](https://dev.to/stacknotice/claude-code-ultrathink-vs-ultracode-every-effort-level-explained-2026-22g7) · [OpenClaw Moonshot notes](https://docs.openclaw.ai/providers/moonshot/index.html) · [LM Studio API changelog](https://www.lmstudio.ai/docs/developer/api-changelog).
