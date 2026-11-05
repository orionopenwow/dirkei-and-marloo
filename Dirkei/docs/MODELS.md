# Models, sign-in & the "can it run" gauge

## Providers

| Provider | How it runs | Needs |
|---|---|---|
| Claude (Claude Code) | `claude -p --tools "" --model X --effort Y` | One-time `claude auth login` (use the **Log in** button) |
| ChatGPT Codex | `codex exec -s read-only -m X -c model_reasoning_effort=Y -` | `codex login` |
| Gemini CLI | `gemini -m X -p ...` | Gemini CLI installed |
| Kimi (Moonshot) | OpenAI-compatible API | API key (the desktop app has no headless mode) |
| Ollama | `POST :11434/api/chat` | Ollama installed and running |
| LM Studio | OpenAI-compatible `:1234` | Local server running |
| OpenRouter | OpenAI-compatible, free `:free` models | Free key |
| Gemini API | `generateContent` | Free-tier key |

Detection looks on PATH, in known install folders (Claude Code under `%LOCALAPPDATA%\Claude-Data\...\claude-code\`, Codex via `Get-AppxPackage OpenAI.Codex`, Ollama under `%LOCALAPPDATA%\Programs\Ollama`) and by probing local ports.

**Keys are never scraped from other apps.** Claude/Codex use their own sign-ins; cloud providers use a key you paste (stored in this app's localStorage) or an environment variable (`GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `MOONSHOT_API_KEY`).

## Hardware profile (`hardware()` in server.js)

Live: CPU, threads, RAM total/free, RAM type/speed/channels → peak bandwidth, GPU name/VRAM via `nvidia-smi`, GPU bandwidth from a name table, free disk. Non-NVIDIA GPUs are ignored for local models.

## Local-model rating (`rate()`)

```
vram        = GPU VRAM × 0.80          (desktop reserve)
ramBudget   = RAM × 0.65               (OS + browser reserve)
need        = file size + 0.6 + 0.04 × params(B)
gpuFraction = (vram − overhead) / size
tokens/sec  = 0.6 / ( gpuFraction×active/gpuBW + (1−gpuFraction)×active/ramBW )
```

| Level | Rule |
|---|---|
| 🟢 green | `need ≤ 0.95×vram` and ≥ 15 tok/s |
| 🟡 yellow | ≥ 8 tok/s and uses ≤ 65% of the memory budget |
| 🟠 orange | marginal (≥ 3 tok/s) |
| 🔴 red | does not fit, or < 3 tok/s |

MoE models use only their *active* parameters for speed but still need all weights in memory. **Estimates are unvalidated until you run the Benchmark button** (it replaces the estimate with a measured number).

## Platform build check (`hwCheck()` in wizard.js)

Compares RAM/VRAM/disk with a per-platform table `REQ` (minimum and recommended). Below minimum → red; below ~75% of recommended → orange; below recommended → yellow. Realistic 3D art raises the requirement. The `REQ` numbers are estimates, not vendor specs.
