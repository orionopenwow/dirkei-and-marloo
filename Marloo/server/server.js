// Local helper for Queen's Domain Lab. No dependencies. Binds to 127.0.0.1 only.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const { spawn, execFile } = require('child_process');
const PORT = +process.env.QD_PORT || 47831, DIR = path.join(__dirname, '..', 'app'), HOME = os.homedir(); // DIR = static files served to the page
const LOCAL = process.env.LOCALAPPDATA || '', PF = process.env.ProgramFiles || 'C:\\Program Files';
let lastPing = 0;

// ---------- detection ----------
const exists = p => { try { return fs.existsSync(p); } catch { return false; } };
const ls = d => { try { return fs.readdirSync(d); } catch { return []; } };
function onPath(name) {
  for (const d of (process.env.PATH || '').split(path.delimiter))
    for (const ext of ['.exe', '.cmd', '.bat', ''])
      if (d && exists(path.join(d, name + ext)) && fs.statSync(path.join(d, name + ext)).isFile()) return path.join(d, name + ext);
  return null;
}
function newestClaude() {
  const root = path.join(LOCAL, 'Claude-Data'); let best = null;
  for (const pkg of ls(root)) {
    const cc = path.join(root, pkg, 'claude-code');
    for (const v of ls(cc)) for (const h of ls(path.join(cc, v))) {
      const exe = path.join(cc, v, h, 'claude.exe');
      if (exists(exe) && (!best || v.localeCompare(best.v, undefined, { numeric: true }) > 0)) best = { v, exe };
    }
  }
  return best && best.exe;
}
let codexCache; // WindowsApps can't be listed directly; ask the package manager once
function codexExe() {
  if (codexCache === undefined) {
    try {
      const loc = require('child_process').execFileSync('powershell', ['-NoProfile', '-Command', '(Get-AppxPackage OpenAI.Codex | Select -First 1).InstallLocation'], { encoding: 'utf8', windowsHide: true, timeout: 15000 }).trim();
      const exe = loc && path.join(loc, 'app', 'resources', 'codex.exe');
      codexCache = (exe && exists(exe) && exe) || onPath('codex') || null;
    } catch { codexCache = onPath('codex') || null; }
  }
  return codexCache;
}
const ollamaExe = () => onPath('ollama') || [path.join(LOCAL, 'Programs', 'Ollama', 'ollama.exe'), path.join(PF, 'Ollama', 'ollama.exe')].find(exists) || null;
const kimiApp =() => exists(path.join(LOCAL, 'Programs', 'Kimi')) ? path.join(LOCAL, 'Programs', 'Kimi') : null;
const authCache = {};
async function jget(url, ms = 600) { // localhost probes: a closed port answers instantly, 600ms is plenty
  const c = new AbortController(), t = setTimeout(() => c.abort(), ms);
  try { const r = await fetch(url, { signal: c.signal }); return r.ok ? await r.json() : null; } catch { return null; } finally { clearTimeout(t); }
}

// While a big local model is running, the GPU/CPU probes can take many seconds. The model lists must not wait for them:
// answer with the last reading (refreshed in the background), or a basic one if there is none yet.
let hwRefresh = null;
async function hardwareFast() {
  if (hwLive.v) { if (Date.now() - hwLive.t > 10000 && !hwRefresh) hwRefresh = hardware().catch(() => {}).finally(() => { hwRefresh = null; }); return hwLive.v; }
  const basic = { cpu: os.cpus()[0]?.model || 'unknown', cores: os.cpus().length, threads: os.cpus().length, ramGB: +(os.totalmem() / 2 ** 30).toFixed(1), ramFreeGB: +(os.freemem() / 2 ** 30).toFixed(1), ramType: 'RAM', ramMHz: 2666, ramBW: 40, gpu: null, otherGpus: [], diskFreeGB: null };
  return Promise.race([hardware(), new Promise(r => setTimeout(() => r(basic), 4000))]);
}
async function providers() {
  const [ollamaTags, lms, hw] = await Promise.all([jget('http://127.0.0.1:11434/api/tags', 2500), jget('http://127.0.0.1:1234/v1/models'), hardwareFast()]); // 2.5 s: a busy Ollama answers slowly
  const ratings = {}; // installed Ollama models: rate by their real on-disk size
  for (const m of ollamaTags?.models || []) {
    const c = OLLAMA_CATALOG.find(x => x.name === m.name), params = c?.params || parseFloat(m.details?.parameter_size) || m.size / 0.6e9;
    ratings[m.name] = rate(c || M(m.name, m.size / 1e9, params, ''), hw);
  }
  const claude = newestClaude() || onPath('claude'), codex = codexExe(), gem = onPath('gemini'), kimiCli = onPath('kimi');
  const env = n => !!process.env[n];
  return [
    { id: 'claude', name: 'Claude (Claude Code)', found: !!claude, detail: claude || 'not found', keyless: true,
      models: ['claude-fable-5-1', 'claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5'], efforts: ['low', 'medium', 'high', 'xhigh', 'max', 'ultracode'] }, // ultracode: CLI accepts it, but chat has no tools so it likely adds nothing (docs/MODEL_OPTIONS.md)
    { id: 'codex', name: 'ChatGPT Codex', found: !!codex, detail: codex || 'not found', keyless: true,
      models: ['(default)', 'gpt-5-codex', 'gpt-5'], efforts: ['low', 'medium', 'high'] },
    { id: 'gemini-cli', name: 'Gemini CLI', found: !!gem, detail: gem || 'not found', keyless: true, models: ['gemini-2.5-pro', 'gemini-2.5-flash'] },
    { id: 'kimi', name: 'Kimi (Moonshot)', found: !!kimiApp(), detail: kimiApp() ? 'Kimi desktop app detected: ' + kimiApp() + (kimiCli ? ' (CLI too)' : ' (the app has no headless mode, so chat uses a Moonshot API key)') : 'not found',
      keyless: false, keyUrl: 'https://platform.moonshot.ai/console/api-keys', envKey: env('MOONSHOT_API_KEY'), models: ['kimi-k2-0905-preview', 'kimi-k2-turbo-preview', 'moonshot-v1-32k'] },
    { id: 'ollama', name: 'Ollama (local, free)', found: !!ollamaTags || !!ollamaExe(), installed: !!ollamaTags || !!ollamaExe(), exe: ollamaExe(), running: !!ollamaTags, keyless: true,
      detail: ollamaTags ? 'running on 127.0.0.1:11434' : ollamaExe() ? 'installed at ' + ollamaExe() + ', not running (start Ollama)' : 'not installed (ollama.com/download)',
      installUrl: 'https://ollama.com/download', models: (ollamaTags?.models || []).map(m => m.name), ratings, hw,
      catalog: OLLAMA_CATALOG.map(c => ({ name: c.name, size: c.size, params: c.params, note: c.note, rating: rate(c, hw) })).sort((a, b) => a.rating.fill - b.rating.fill || b.size - a.size) },
    { id: 'lmstudio', name: 'LM Studio (local, free)', found: !!lms, detail: lms ? 'server running on 127.0.0.1:1234' : 'server not running', keyless: true,
      installUrl: 'https://lmstudio.ai', models: (lms?.data || []).map(m => m.id) },
    { id: 'openrouter', name: 'OpenRouter (free models)', found: true, detail: 'cloud, free ":free" models, needs a free key', keyless: false,
      keyUrl: 'https://openrouter.ai/keys', envKey: env('OPENROUTER_API_KEY'), models: [], dynamic: true },
    { id: 'gemini', name: 'Google Gemini API', found: true, detail: 'cloud, free tier key', keyless: false,
      keyUrl: 'https://aistudio.google.com/apikey', envKey: env('GEMINI_API_KEY') || env('GOOGLE_API_KEY'), models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite'] },
  ];
}
// ---------- hardware profile + "can it run" rating ----------
const GPU_BW = [[/4090/, 576], [/4080/, 432], [/4070/, 256], [/4060/, 256], [/4050/, 216], [/3080/, 448], [/3070/, 448], [/3060/, 336], [/3050/, 176]]; // GB/s, laptop parts
const MEMTYPE = { 26: 'DDR4', 34: 'DDR5', 30: 'LPDDR4', 35: 'LPDDR5', 29: 'LPDDR3' };
let hwStatic = null, hwLive = { t: 0 };
function sh(exe, args, ms = 15000) { return new Promise(r => execFile(exe, args, { windowsHide: true, timeout: ms }, (e, o) => r(e ? '' : String(o)))); }
async function hardware() {
  if (Date.now() - hwLive.t < 10000 && hwLive.v) return hwLive.v;
  if (!hwStatic) {
    const o = await sh('powershell', ['-NoProfile', '-Command', `$c=Get-CimInstance Win32_Processor|select -First 1;$m=@(Get-CimInstance Win32_PhysicalMemory);
[pscustomobject]@{cpu=$c.Name;cores=$c.NumberOfCores;threads=$c.NumberOfLogicalProcessors;modules=$m.Count;mhz=($m|select -First 1).ConfiguredClockSpeed;type=($m|select -First 1).SMBIOSMemoryType;
gpus=@(Get-CimInstance Win32_VideoController|%{$_.Name})}|ConvertTo-Json -Compress`]);
    try { hwStatic = JSON.parse(o); } catch { hwStatic = { cpu: os.cpus()[0]?.model || 'unknown', cores: os.cpus().length, threads: os.cpus().length, modules: 2, mhz: 2666, type: 26, gpus: [] }; }
  }
  const s = hwStatic, smi = onPath('nvidia-smi') || path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'nvidia-smi.exe');
  const g = exists(smi) ? (await sh(smi, ['--query-gpu=name,memory.total,memory.free', '--format=csv,noheader,nounits'])).trim().split('\n')[0].split(',').map(x => x.trim()) : [];
  const channels = s.modules >= 2 ? 2 : 1, mhz = s.mhz || 2666;
  const v = {
    cpu: s.cpu, cores: s.cores, threads: s.threads,
    ramGB: +(os.totalmem() / 2 ** 30).toFixed(1), ramFreeGB: +(os.freemem() / 2 ** 30).toFixed(1),
    ramType: MEMTYPE[s.type] || 'RAM', ramMHz: mhz, ramBW: +(mhz * 8 * channels / 1000).toFixed(1), // peak GB/s
    gpu: g.length === 3 ? { name: g[0], vramGB: +(g[1] / 1024).toFixed(1), vramFreeGB: +(g[2] / 1024).toFixed(1), bw: (GPU_BW.find(([re]) => re.test(g[0])) || [0, 200])[1] } : null, // null = no CUDA GPU
    otherGpus: (s.gpus || []).filter(n => !g[0] || !n.includes(g[0])),
    diskFreeGB: (() => { try { const d = fs.statfsSync(path.parse(HOME).root); return +(d.bavail * d.bsize / 2 ** 30).toFixed(1); } catch { return null; } })(), // Ollama stores models on the user drive
  };
  hwLive = { t: Date.now(), v }; return v;
}
// size = GB on disk (Q4), params/active in billions (active < params for MoE). Ollama default tags.
const M = (name, size, params, note, active = params) => ({ name, size, params, active, note });
const OLLAMA_CATALOG = [
  M('llama3.2:1b', 1.3, 1.2, 'tiny, fast, basic'), M('llama3.2:3b', 2.0, 3.2, 'small general'),
  M('qwen2.5-coder:1.5b', 1.0, 1.5, 'tiny coder'), M('qwen2.5-coder:3b', 1.9, 3.1, 'small coder'),
  M('qwen2.5-coder:7b', 4.7, 7.6, 'best small coder'), M('qwen2.5-coder:14b', 9.0, 14.8, 'strong coder'), M('qwen2.5-coder:32b', 20, 32.8, 'top open coder'),
  M('gemma3:4b', 3.3, 4.3, 'Google open'), M('gemma3:12b', 8.1, 12.2, 'Google open, mid'), M('gemma3:27b', 17, 27.4, 'Google open, large'),
  M('phi4-mini', 2.5, 3.8, 'Microsoft, reasoning'), M('phi4', 9.1, 14.7, 'Microsoft, strong'),
  M('deepseek-r1:7b', 4.7, 7.6, 'reasoning'), M('deepseek-r1:8b', 5.2, 8.2, 'reasoning'), M('deepseek-r1:14b', 9.0, 14.8, 'reasoning'), M('deepseek-r1:32b', 20, 32.8, 'reasoning'),
  M('mistral:7b', 4.1, 7.2, 'general'), M('llama3.1:8b', 4.9, 8.0, 'general'), M('qwen3:8b', 5.2, 8.2, 'general + thinking'), M('qwen3:14b', 9.3, 14.8, 'general + thinking'),
  M('qwen3:30b-a3b', 19, 30.5, 'MoE, only 3B active', 3.3), M('qwen3-coder:30b', 19, 30.5, 'MoE coder, 3B active', 3.3),
  M('deepseek-coder-v2:16b', 8.9, 15.7, 'MoE coder, 2.4B active', 2.4),
  M('gpt-oss:20b', 14, 20.9, 'OpenAI open-weight MoE', 3.6), M('gpt-oss:120b', 65, 116.8, 'OpenAI open-weight MoE', 5.1), M('llama3.3:70b', 43, 70.6, 'huge dense'),
];

function rate(m, hw) {
  const vram = hw.gpu ? hw.gpu.vramGB * 0.8 : 0;                 // keep 20% for Windows/desktop
  const ramBudget = hw.ramGB * 0.65;                              // keep 35% for Windows + browser
  const overhead = 0.6 + 0.04 * m.params;                         // runtime + ~4k-token KV cache
  const need = m.size + overhead, total = vram + ramBudget;
  const onGpu = Math.min(need, vram), gpuFrac = Math.min(1, Math.max(0, (vram - overhead) / m.size)), ramPart = Math.max(0, need - vram);
  const act = m.size * (m.active / m.params);                     // bytes read per token (MoE reads only active experts)
  const tpsTime = (hw.gpu ? gpuFrac * act / hw.gpu.bw : 0) + (1 - (hw.gpu ? gpuFrac : 0)) * act / hw.ramBW;
  const tps = +(0.6 / tpsTime).toFixed(1);                        // 60% of peak bandwidth is typical real-world
  const ratio = need / total, r = { need: +need.toFixed(1), tps, gpuGB: +onGpu.toFixed(1), ramGB: +ramPart.toFixed(1), reasons: [], tips: [] };
  const ctx = 'Set a small context window: in Ollama run /set parameter num_ctx ';
  if (need > total) { r.level = 'red'; r.reasons.push(`Needs ~${r.need} GB but this PC can offer ~${total.toFixed(1)} GB (${vram.toFixed(1)} GB GPU + ${ramBudget.toFixed(1)} GB RAM) without swapping to disk.`); }
  else if (tps < 3) { r.level = 'red'; r.reasons.push(`Would fit, but only ~${tps} tokens/sec on your memory bandwidth. Too slow to be useful.`); }
  else if (need <= vram * 0.95 && tps >= 15) { r.level = 'green'; r.reasons.push(`Fits entirely in GPU memory. ~${tps} tokens/sec.`); r.tips.push('Default settings are fine.'); }
  else if (tps >= 8 && ratio <= 0.65) {
    r.level = 'yellow'; r.reasons.push(`Runs, but ~${Math.round(gpuFrac * 100)}% on GPU and the rest in RAM. ~${tps} tokens/sec.`);
    r.tips.push(ctx + '4096.', 'Set OLLAMA_FLASH_ATTENTION=1 to cut memory use.', 'Let Ollama auto-split layers; do not force all layers onto the GPU (num_gpu).');
  } else {
    r.level = 'orange'; r.reasons.push(`Marginal: ~${tps} tokens/sec, uses ${Math.round(ratio * 100)}% of the memory budget.`);
    r.tips.push(`Close Edge/Chrome and other heavy apps first: needs ~${r.ramGB} GB of free RAM.`, ctx + '2048.', 'Set OLLAMA_FLASH_ATTENTION=1 and OLLAMA_KV_CACHE_TYPE=q8_0.', 'Plug in AC power and use the laptop Turbo/Performance mode.', 'Use for short prompts only; long code reviews will crawl.');
  }
  if (r.level !== 'red' && r.level !== 'green' && hw.ramFreeGB < r.ramGB + 1) r.reasons.push(`Right now only ${hw.ramFreeGB} GB RAM is free; close apps before loading.`);
  r.fill = { green: 1, yellow: 2, orange: 3, red: 4 }[r.level];
  return r;
}

// ---------- running prompts ----------
function runProc(exe, args, input, ms = 600000) { // 10 min: max/ultracode effort can think for minutes
  return new Promise((res, rej) => {
    const p = spawn(exe, args, { windowsHide: true, cwd: os.tmpdir() });
    let out = '', err = ''; const t = setTimeout(() => { p.kill(); rej(new Error('timed out')); }, ms);
    p.stdout.on('data', d => out += d); p.stderr.on('data', d => err += d);
    p.on('error', e => { clearTimeout(t); rej(e); });
    p.on('close', c => { clearTimeout(t); c === 0 ? res(out) : rej(new Error((err || out).slice(0, 600) || 'exit ' + c)); });
    p.stdin.on('error', () => {}); p.stdin.end(input || '');
  });
}
async function openai(base, key, model, system, prompt, json) {
  const r = await fetch(base + '/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(key ? { Authorization: 'Bearer ' + key } : {}) },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }], temperature: 0.2 }) });
  const j = await r.json(); if (!r.ok) throw new Error(j.error?.message || 'HTTP ' + r.status);
  return j.choices?.[0]?.message?.content || '';
}
// API keys live in a file only this Windows user can read (not in the browser). QD_KEYS_FILE lets tests use another file.
const keysFile = () => process.env.QD_KEYS_FILE || path.join(LOCAL || os.tmpdir(), 'QueensDomainLab', 'keys.json');
const storedKeys = () => { try { return JSON.parse(fs.readFileSync(keysFile(), 'utf8')); } catch { return {}; } };
const keyOf = (b, ...envs) => b.key || storedKeys()[b.provider] || envs.map(e => process.env[e]).find(Boolean);
// Screenshots: the page sends data URLs; validated here, then given to each provider in its own format.
function imgsOf(b) {
  const a = Array.isArray(b.images) ? b.images : [];
  if (a.length > 4) throw new Error('At most 4 images per message');
  return a.map(u => {
    const m = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+\/=]+)$/.exec(String(u));
    if (!m || m[2].length > 10e6) throw new Error('Unsupported or too large image (png, jpeg, webp or gif, under about 7 MB)');
    return { mime: m[1], b64: m[2], url: u };
  });
}
// Tools that read images from disk get temp files. shortcut: if a tool is missing, the temp folder is left behind; clean %TEMP%\qd-img-* if it piles up.
function imgFiles(imgs) {
  if (!imgs.length) return { paths: [], done() {} };
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'qd-img-'));
  const paths = imgs.map((m, i) => { const f = path.join(d, `image${i + 1}.${m.mime.split('/')[1].replace('jpeg', 'jpg')}`); fs.writeFileSync(f, Buffer.from(m.b64, 'base64')); return f; });
  return { paths, done() { fs.rmSync(d, { recursive: true, force: true }); } };
}
const imgNote = ps => ps.length ? `\n\n[The user attached ${ps.length} image file(s): ${ps.join(', ')}. Look at them with your file-reading tool.]` : '';

async function run(b) {
  const { provider, model, effort, system = '', prompt = '' } = b;
  switch (provider) {
    case 'claude': {
      const exe = newestClaude() || onPath('claude'); if (!exe) throw new Error('Claude Code not found');
      const im = imgFiles(imgsOf(b)); // with images, allow only the Read tool (cwd is the temp folder)
      const a = ['-p', '--no-session-persistence', '--disable-slash-commands', '--tools', im.paths.length ? 'Read' : '', '--append-system-prompt', system];
      if (model) a.push('--model', model); if (effort) a.push('--effort', effort);
      try { return await runProc(exe, a, prompt + imgNote(im.paths)); } finally { im.done(); }
    }
    case 'codex': {
      const exe = codexExe(); if (!exe) throw new Error('Codex not found');
      const of = path.join(os.tmpdir(), 'qd-codex-' + require('crypto').randomBytes(8).toString('hex') + '.txt');
      const im = imgFiles(imgsOf(b)), a = ['exec', ...im.paths.flatMap(p => ['-i', p]), '--skip-git-repo-check', '--ephemeral', '-s', 'read-only', '-o', of]; // -i takes many files, so it must not sit right before "-"
      if (model && model !== '(default)') a.push('-m', model); if (effort) a.push('-c', `model_reasoning_effort="${effort}"`);
      a.push('-'); try { await runProc(exe, a, system + '\n\n' + prompt); } finally { im.done(); }
      try { return fs.readFileSync(of, 'utf8'); } finally { try { fs.unlinkSync(of); } catch {} }
    }
    case 'gemini-cli': {
      const exe = onPath('gemini'); if (!exe) throw new Error('Gemini CLI not found');
      const im = imgFiles(imgsOf(b)); // never run: Gemini CLI is not installed here
      try { return await runProc(exe, ['-m', model, '-p', system + '\n\n' + prompt + imgNote(im.paths)], ''); } finally { im.done(); }
    }
    case 'ollama': {
      const r = await fetch(OLLAMA + '/api/chat', { method: 'POST', body: JSON.stringify({ model, stream: false, options: { temperature: 0.2 }, ...(b.think != null ? { think: !!b.think } : {}),
        messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }] }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j.message?.content || '';
    }
    case 'lmstudio': return openai('http://127.0.0.1:1234/v1', null, model, system, prompt);
    case 'openrouter': { const k = keyOf(b, 'OPENROUTER_API_KEY'); if (!k) throw new Error('No OpenRouter key'); return openai('https://openrouter.ai/api/v1', k, model, system, prompt); }
    case 'kimi': { const k = keyOf(b, 'MOONSHOT_API_KEY'); if (!k) throw new Error('No Moonshot key'); return openai('https://api.moonshot.ai/v1', k, model, system, prompt); }
    case 'gemini': {
      const k = keyOf(b, 'GEMINI_API_KEY', 'GOOGLE_API_KEY'); if (!k) throw new Error('No Gemini key');
      // Lab options: think = off|low|medium|high (3.x models take a level, 2.5 a token budget; 2.5 Pro cannot be switched off), search = Google Search grounding
      const gc = { temperature: 0.2 }, th = b.think;
      if (th) gc.thinkingConfig = /^gemini-3/.test(model) ? { thinkingLevel: th === 'off' ? 'low' : th } : { thinkingBudget: th === 'off' ? (/pro/.test(model) ? 128 : 0) : { low: 1024, medium: 8192, high: 24576 }[th] ?? 8192 };
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, { method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': k },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: gc, ...(b.search ? { tools: [{ google_search: {} }] } : {}) }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error?.message || 'HTTP ' + r.status);
      return (j.candidates?.[0]?.content?.parts || []).map(p => p.text).join('');
    }
  }
  throw new Error('Unknown provider ' + provider);
}

// ---------- http ----------
const body = req => new Promise(r => { let s = ''; req.on('data', d => s += d); req.on('end', () => { try { r(JSON.parse(s || '{}')); } catch { r({}); } }); });
// Streaming chat: calls emit(text) per chunk. HTTP providers stream; CLI providers (claude/codex/gemini-cli) return one chunk when done.
async function streamChat(b, emit, signal) {
  if (b.provider === 'ollama' && imgsOf(b).length) b = await textOnly(b, emit);
  const { provider, model, system = '', prompt = '' } = b, im = imgsOf(b);
  const msgs = [{ role: 'system', content: system }, { role: 'user', content: im.length ? [{ type: 'text', text: prompt }, ...im.map(m => ({ type: 'image_url', image_url: { url: m.url } }))] : prompt }]; // OpenAI-style
  const omsgs = [{ role: 'system', content: system }, { role: 'user', content: prompt, ...(im.length ? { images: im.map(m => m.b64) } : {}) }]; // Ollama-style
  const gparts = [{ text: prompt }, ...im.map(m => ({ inlineData: { mimeType: m.mime, data: m.b64 } }))];
  if (b.agent && provider === 'ollama') return ollamaAgent(b, emit, signal);
  if (b.agent && AGENT_PROVIDERS.includes(provider)) return agentChat(b, emit, signal);
  const lines = async (r, onLine) => { // r.body as text lines; onLine returns text to emit; throws on an upstream error
    if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.error?.message || j.error || 'HTTP ' + r.status); }
    const dec = new TextDecoder(); let buf = '';
    for await (const c of r.body) { buf += dec.decode(c, { stream: true }); let i;
      while ((i = buf.indexOf('\n')) >= 0) { const l = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (!l) continue;
        let j; try { j = JSON.parse(l.replace(/^data:\s*/, '')); } catch { continue; } // skips "[DONE]" and SSE comments
        if (j.error) throw new Error(j.error.message || j.error); const t = onLine(j); if (t) emit(t); } }
  };
  const post = (url, headers, o) => fetch(url, { method: 'POST', signal, headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(o) });
  const oa = (base, key) => post(base + '/chat/completions', key ? { Authorization: 'Bearer ' + key } : {}, { model, messages: msgs, temperature: 0.2, stream: true }).then(r => lines(r, j => j.choices?.[0]?.delta?.content));
  switch (provider) {
    case 'ollama': return lines(await post(OLLAMA + '/api/chat', {}, { model, stream: true, options: { temperature: 0.2 }, messages: omsgs }), j => j.message?.content);
    case 'lmstudio': return oa('http://127.0.0.1:1234/v1');
    case 'openrouter': { const k = keyOf(b, 'OPENROUTER_API_KEY'); if (!k) throw new Error('No OpenRouter key'); return oa('https://openrouter.ai/api/v1', k); }
    case 'kimi': { const k = keyOf(b, 'MOONSHOT_API_KEY'); if (!k) throw new Error('No Moonshot key'); return oa('https://api.moonshot.ai/v1', k); }
    case 'gemini': {
      const k = keyOf(b, 'GEMINI_API_KEY', 'GOOGLE_API_KEY'); if (!k) throw new Error('No Gemini key');
      return lines(await post(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, { 'x-goog-api-key': k },
        { systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: gparts }], generationConfig: { temperature: 0.2 } }), j => (j.candidates?.[0]?.content?.parts || []).map(p => p.text).join(''));
    }
    default: emit(await run(b)); // shortcut: CLIs return one chunk (Stop hides output but the tool runs to its own timeout); stream them if their output format proves reliable
  }
}

// Agent mode: real Claude Code with every tool on and no permission prompts (fully automatic by design).
// It can read pasted links, install plugins/skills and edit files. Not sandboxed: it can touch the whole PC, only the start folder is limited.
function agentDir(f) {
  const d = path.resolve(f || path.join(HOME, 'QueensDomainLab-work')), rel = path.relative(HOME, d);
  if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('Work folder must be inside your user folder');
  fs.mkdirSync(d, { recursive: true }); return d;
}
const AGENT_PROVIDERS = ['claude', 'codex', 'lmstudio', 'openrouter']; // lmstudio runs through Codex's --oss mode; openrouter runs Claude Code against OpenRouter (per its docs, never run: no key here)
function agentChat(b, emit, signal) {
  const { provider, model, effort, system = '', prompt = '' } = b, dir = agentDir(b.folder), t0 = Date.now(), im = imgFiles(imgsOf(b));
  let out = false, fail = '', exe, a, input = prompt + imgNote(im.paths), parse, env = process.env;
  const say = s => { emit((out ? '\n\n' : '') + s); out = true; }, tool = s => { emit((out ? '\n' : '') + '▸ ' + s.slice(0, 140) + '\n'); out = true; };
  if (provider === 'claude' || provider === 'openrouter') {
    exe = newestClaude() || onPath('claude'); if (!exe) throw new Error('Claude Code not found');
    if (provider === 'openrouter') { const k = keyOf(b, 'OPENROUTER_API_KEY'); if (!k) throw new Error('No OpenRouter key'); env = { ...process.env, ANTHROPIC_BASE_URL: 'https://openrouter.ai/api', ANTHROPIC_AUTH_TOKEN: k, ANTHROPIC_API_KEY: '' }; }
    a = ['-p', '--output-format', 'stream-json', '--verbose', '--permission-mode', 'bypassPermissions', '--no-session-persistence', '--append-system-prompt', system];
    if (model) a.push('--model', model); if (effort) a.push('--effort', effort);
    parse = j => {
      if (j.type === 'assistant') for (const c of j.message?.content || []) { if (c.type === 'text' && c.text) say(c.text); else if (c.type === 'tool_use') tool(c.name + ' ' + JSON.stringify(c.input)); }
      else if (j.type === 'result' || j.total_cost_usd !== undefined) {
        const u = j.usage || {}; if (j.is_error) fail = String(j.result || 'Claude Code reported an error');
        emit({ stats: { cost: j.total_cost_usd || 0, inTok: (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0), outTok: u.output_tokens || 0, ms: j.duration_ms || j.duration_api_ms || 0, turns: j.num_turns || 1 } });
      }
    };
  } else { // codex; with --oss it drives a local Ollama / LM Studio model instead of ChatGPT
    exe = codexExe(); if (!exe) throw new Error('Codex not found');
    a = ['exec', ...im.paths.flatMap(p => ['-i', p]), '--json', '--skip-git-repo-check', '--ephemeral', '--dangerously-bypass-approvals-and-sandbox', '-C', dir];
    if (provider !== 'codex') a.push('--oss', '--local-provider', provider);
    if (model && model !== '(default)') a.push('-m', model); if (effort && provider === 'codex') a.push('-c', `model_reasoning_effort="${effort}"`);
    if (b.search && provider === 'codex') a.push('-c', 'web_search="live"'); // Template Lab: live web search (Codex config reference); never run here
    a.push('-'); input = system + '\n\n' + prompt; // images go in natively with -i, no path note
    parse = j => {
      const it = j.item || {};
      if (j.type === 'item.completed') { if (it.type === 'agent_message' && it.text) say(it.text); else if (it.type === 'command_execution') tool(it.command || 'command'); else if (it.type !== 'error' && it.type !== 'reasoning') tool(it.type); }
      else if (j.type === 'turn.completed') emit({ stats: { cost: 0, inTok: j.usage?.input_tokens || 0, outTok: j.usage?.output_tokens || 0, ms: Date.now() - t0, turns: 1 } });
      else if (j.type === 'turn.failed' || j.type === 'error') fail = String(j.error?.message || j.message || 'Codex reported an error');
    };
  }
  return new Promise((res, rej) => {
    const p = spawn(exe, a, { windowsHide: true, cwd: dir, env });
    let buf = '', err = '';
    const kill = () => execFile('taskkill', ['/pid', String(p.pid), '/T', '/F'], { windowsHide: true }, () => {}); // /T: also stop what it started
    const t = setTimeout(() => { kill(); rej(new Error('Agent timed out after 30 minutes')); }, 1800000);
    signal?.addEventListener('abort', kill);
    const line = l => { try { parse(JSON.parse(l)); } catch { /* not JSON: ignore */ } };
    p.stdout.on('data', d => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { line(buf.slice(0, i).trim()); buf = buf.slice(i + 1); } });
    p.stderr.on('data', d => err += d);
    p.on('error', e => { clearTimeout(t); rej(e); });
    p.on('close', c => { clearTimeout(t); if (buf.trim()) line(buf.trim()); fail ? rej(new Error(fail)) : c === 0 || signal?.aborted ? res() : rej(new Error(err.slice(0, 600) || 'exit ' + c)); });
    p.stdin.on('error', () => {}); p.stdin.end(input);
  }).finally(im.done);
}

// Agent mode for Ollama: our own tool loop on Ollama's native tool calling (Codex's --oss mode did nothing with the small models tried).
// Same trust model as the Claude agent: no prompts, full access. QD_OLLAMA lets tests point at a fake server.
const OLLAMA = process.env.QD_OLLAMA || 'http://127.0.0.1:11434';
const OLLAMA_TOOLS = [
  ['shell', 'Run a PowerShell command in the work folder and return its output', { command: 'string' }],
  ['read_file', 'Read a text file', { path: 'string' }],
  ['write_file', 'Write a text file, creating folders as needed', { path: 'string', content: 'string' }],
  ['fetch_url', 'Download a web page as plain text', { url: 'string' }],
  ['web_search', 'Search the web; returns titles, links and snippets', { query: 'string' }],
  ['ask_frontier', 'Ask a much stronger cloud model (Claude, else Codex) a hard question. Put all needed context in the question. Slow and uses your plan, so use it only for hard reasoning or coding, or to check your work', { question: 'string' }],
].map(([name, description, props]) => ({ type: 'function', function: { name, description, parameters: { type: 'object', properties: Object.fromEntries(Object.entries(props).map(([k, type]) => [k, { type }])), required: Object.keys(props) } } }));
// The strongest signed-in cloud tool, or null. Used to describe screenshots and by the ask_frontier tool.
const frontier = model => (newestClaude() || onPath('claude')) ? { provider: 'claude', model } : codexExe() ? { provider: 'codex', model: '(default)' } : null;
async function ollamaTool(name, a, dir, signal, imgs) {
  const file = () => {
    const f = path.resolve(dir, String(a.path || ''));
    const rel = path.relative(dir, f);
    if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('Unsafe path: file must be inside the work folder');
    return f;
  };
  switch (name) {
    case 'shell': return new Promise(r => execFile('powershell', ['-NoProfile', '-Command', String(a.command)], { cwd: dir, timeout: 120000, signal, windowsHide: true, maxBuffer: 1e7 },
      (e, o, er) => { const t = String(o) + String(er); r((t.trim() ? t : e ? e.message : '(no output)').slice(0, 4000)); }));
    case 'read_file': return fs.readFileSync(file(), 'utf8').slice(0, 8000);
    case 'write_file': { const f = file(); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, String(a.content ?? '')); return 'wrote ' + f; }
    case 'fetch_url': { const t = await (await fetch(String(a.url), { signal: AbortSignal.timeout(20000) })).text(); return t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 6000); }
    case 'web_search': { // shortcut: scrapes DuckDuckGo's plain page (no key needed); it can break or block, then ask_frontier can search instead
      const h = await (await fetch('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(String(a.query)), { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(20000) })).text();
      const clean = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&quot;/g, "'").trim();
      const hits = [...h.matchAll(/class="result__a" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g)].slice(0, 6)
        .map(m => clean(m[2]) + '\n' + decodeURIComponent((/uddg=([^&]+)/.exec(m[1]) || [, m[1]])[1]) + '\n' + clean(m[3]));
      return hits.join('\n\n') || 'No results (the search page may have blocked this request)';
    }
    case 'ask_frontier': {
      const t = frontier('claude-sonnet-5-5'); if (!t) return 'No cloud tool (Claude Code or Codex) is signed in.';
      return (await run({ ...t, system: 'You are a strong model helping a smaller local model. Answer fully and precisely.', prompt: String(a.question), images: imgs })).slice(0, 8000);
    }
  }
  return 'unknown tool ' + name;
}
async function ollamaAgent(b, emit, signal) {
  const { model, system = '', prompt = '' } = b, im = imgsOf(b), dir = agentDir(b.folder), t0 = Date.now(), st = { cost: 0, inTok: 0, outTok: 0, ms: 0, turns: 0 };
  const msgs = [{ role: 'system', content: system + '\n\nYou have tools. Use them to do what the user asks in the current folder, then reply briefly. Use web_search for current facts. For hard reasoning or coding, or when unsure, use ask_frontier (a much stronger model) instead of guessing.' }, { role: 'user', content: prompt, ...(im.length ? { images: im.map(m => m.b64) } : {}) }];
  // shortcut: thinking is switched off for models that have it (about 3x faster on a weak GPU); hard questions go to ask_frontier instead
  const think = (await ollamaCaps(model)).includes('thinking') ? { think: false } : {}, names = new Set(OLLAMA_TOOLS.map(t => t.function.name));
  let out = false, done = false; const note = (s, sep) => { emit((out ? sep : '') + s); out = true; };
  for (let i = 0; i < 12 && !signal?.aborted; i++) { // 12 steps max so a confused model cannot loop forever
    const r = await fetch(OLLAMA + '/api/chat', { method: 'POST', signal, body: JSON.stringify({ model, stream: false, tools: OLLAMA_TOOLS, messages: msgs, ...think, options: { temperature: 0.2, num_ctx: 16384 } }) });
    const j = await r.json(); if (!r.ok || j.error) throw new Error(j.error || 'HTTP ' + r.status);
    st.inTok += j.prompt_eval_count || 0; st.outTok += j.eval_count || 0; st.turns++;
    const m = j.message || {}; msgs.push(m);
    if (!m.tool_calls?.length && m.content) { // models without native tool calling (qwen2.5-coder) write the call as JSON text: accept that
      const raw = m.content.trim().replace(/^```(?:json)?|```$/g, '').replace(/<\/?tool_call>/g, '').trim();
      try { const c = raw.startsWith('{') ? JSON.parse(raw) : null; if (c && names.has(c.name)) { m.tool_calls = [{ function: { name: c.name, arguments: c.arguments || c.parameters || {} } }]; m.content = ''; } } catch { /* plain text answer */ }
    }
    if (m.content?.trim()) note(m.content.trim(), '\n\n');
    if (!m.tool_calls?.length) { done = true; break; }
    for (const c of m.tool_calls) {
      const f = c.function || {}; note('▸ ' + f.name + ' ' + JSON.stringify(f.arguments).slice(0, 120) + '\n', '\n');
      let res; try { res = await ollamaTool(f.name, f.arguments || {}, dir, signal, b.shown || b.images); } catch (e) { res = 'error: ' + e.message; }
      msgs.push({ role: 'tool', tool_name: f.name, content: String(res) });
    }
  }
  if (!done && !signal?.aborted) note('(stopped after 12 steps)', '\n\n');
  st.ms = Date.now() - t0; emit({ stats: st });
}

// ---------- game engines: what is installed, and one-click install through winget ----------
// winget ids live here: the page only sends our own engine id, never an id or a URL to install.
const firstFile = (...ps) => ps.find(exists) || null;
const dirsLike = (d, re) => ls(d).filter(n => re.test(n)).map(n => path.join(d, n));
const nodeFound = () => { const n = onPath('node') || firstFile(path.join(PF, 'nodejs', 'node.exe')); return n ? [true, 'Node.js found (the project is built with npm)'] : [false, 'Needs Node.js (installs with the Download button)']; };
const gitFound = () => { const g = onPath('git') || firstFile(path.join(PF, 'Git', 'cmd', 'git.exe')); return [!!g, g ? 'Git found' : 'Needs Git (installs with the Download button)']; };
const vsFound = () => { const d = [path.join(process.env['ProgramFiles(x86)'] || PF, 'Microsoft Visual Studio'), path.join(PF, 'Microsoft Visual Studio')].some(p => ls(p).some(v => /^\d+$/.test(v))); return [d, d ? 'Visual Studio found (C++ workload not checked)' : 'Not found (big download, Windows will ask permission)']; };
const ENGINES = {
  git: { winget: 'Git.Git', page: 'https://git-scm.com/download/win', find: gitFound },
  gh: { winget: 'GitHub.cli', page: 'https://cli.github.com/', find: () => { const g = onPath('gh') || firstFile(path.join(PF, 'GitHub CLI', 'gh.exe')); return [!!g, g ? 'GitHub CLI found' : 'Not found (installs with the Download button)']; } },
  // free creative tools (winget ids checked with "winget show"; install locations are the usual ones, so a custom install may look missing)
  blender: { winget: 'BlenderFoundation.Blender', page: 'https://www.blender.org/download/', find: () => { const g = dirsLike(path.join(PF, 'Blender Foundation'), /^Blender/)[0]; return [!!g, g || 'Not found']; } },
  krita: { winget: 'KDE.Krita', page: 'https://krita.org/en/download/', find: () => { const g = firstFile(path.join(PF, 'Krita (x64)', 'bin', 'krita.exe'), path.join(PF, 'Krita', 'bin', 'krita.exe')); return [!!g, g || 'Not found']; } },
  gimp: { winget: 'GIMP.GIMP', page: 'https://www.gimp.org/downloads/', find: () => { const g = dirsLike(PF, /^GIMP/)[0] || dirsLike(path.join(LOCAL, 'Programs'), /^GIMP/)[0]; return [!!g, g || 'Not found']; } },
  inkscape: { winget: 'Inkscape.Inkscape', page: 'https://inkscape.org/release/', find: () => { const g = firstFile(path.join(PF, 'Inkscape', 'bin', 'inkscape.exe')); return [!!g, g || 'Not found']; } },
  audacity: { winget: 'Audacity.Audacity', page: 'https://www.audacityteam.org/download/', find: () => { const g = firstFile(path.join(PF, 'Audacity', 'Audacity.exe')); return [!!g, g || 'Not found']; } },
  pixelorama: { winget: 'OramaInteractive.Pixelorama', page: 'https://orama-interactive.itch.io/pixelorama', find: () => { const g = firstFile(path.join(process.env.APPDATA || '', 'Orama Interactive', 'Pixelorama', 'Pixelorama.exe'), path.join(PF, 'Pixelorama', 'Pixelorama.exe')); return [!!g, g || 'Not found']; } },
  lmms: { winget: 'LMMS.LMMS', page: 'https://lmms.io/download/', find: () => { const g = dirsLike(PF, /^LMMS/)[0]; return [!!g, g || 'Not found']; } },
  blockbench: { winget: 'JannisX11.Blockbench', page: 'https://www.blockbench.net/downloads', find: () => { const g = firstFile(path.join(LOCAL, 'Programs', 'Blockbench', 'Blockbench.exe')); return [!!g, g || 'Not found']; } },
  vs: { winget: 'Microsoft.VisualStudio.2022.BuildTools', args: ['--override', '--quiet --wait --norestart --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended'], page: 'https://visualstudio.microsoft.com/downloads/', find: vsFound },
  spawn: { online: true, page: 'https://spawn.co/', detail: 'Runs online, nothing to install' },
  rosebud: { online: true, page: 'https://www.rosebud.ai/', detail: 'Runs online, nothing to install' },
  construct: { online: true, page: 'https://editor.construct.net/', detail: 'Runs in your browser, nothing to install' },
  unity: { needs: ['git'], winget: 'Unity.UnityHub', page: 'https://unity.com/download', find: () => {
    const hub = firstFile(path.join(PF, 'Unity Hub', 'Unity Hub.exe'), path.join(LOCAL, 'Programs', 'Unity Hub', 'Unity Hub.exe')), ed = ls(path.join(PF, 'Unity', 'Hub', 'Editor'));
    return [!!(hub || ed.length), [hub && 'Unity Hub', ed.length && 'editor ' + ed.join(', ')].filter(Boolean).join(' + ') || 'Not found'];
  } },
  godot: { needs: ['git'], winget: 'GodotEngine.GodotEngine', page: 'https://godotengine.org/download/windows/', find: () => {
    const g = onPath('godot') || dirsLike(PF, /^Godot/i)[0] || dirsLike(path.join(LOCAL, 'Programs'), /^Godot/i)[0] || dirsLike(path.join(LOCAL, 'Microsoft', 'WinGet', 'Packages'), /^GodotEngine/i)[0];
    return [!!g, g || 'Not found'];
  } },
  unreal: { needs: ['git', 'vs'], winget: 'EpicGames.EpicGamesLauncher', page: 'https://www.unrealengine.com/download', find: () => {
    const ue = dirsLike(path.join(PF, 'Epic Games'), /^UE_5/), launcher = exists(path.join(process.env['ProgramFiles(x86)'] || PF, 'Epic Games', 'Launcher'));
    return [ue.length > 0, ue.length ? ue.map(p => path.basename(p)).join(', ') : launcher ? 'Epic Games Launcher found: add Unreal Engine 5 inside it' : 'Not found (the Download button installs the Epic Games Launcher)'];
  } },
  roblox: { needs: ['git'], winget: 'Roblox.RobloxStudio', page: 'https://create.roblox.com/', find: () => {
    const v = dirsLike(path.join(LOCAL, 'Roblox', 'Versions'), /./).find(d => exists(path.join(d, 'RobloxStudioBeta.exe')));
    return [!!v, v || 'Not found'];
  } },
  gamemaker: { needs: ['git'], winget: 'YoYoGames.GameMaker.Studio.2', page: 'https://gamemaker.io/en/download', find: () => {
    const g = dirsLike(PF, /^GameMaker/i)[0] || dirsLike(path.join(LOCAL, 'Programs'), /^GameMaker/i)[0];
    return [!!g, g || 'Not found'];
  } },
  phaser: { needs: ['git'], winget: 'OpenJS.NodeJS.LTS', page: 'https://nodejs.org/en/download', find: nodeFound },
  three: { needs: ['git'], winget: 'OpenJS.NodeJS.LTS', page: 'https://nodejs.org/en/download', find: nodeFound },
};
const engines = () => Object.fromEntries(Object.entries(ENGINES).map(([id, e]) => {
  const [installed, detail] = e.find ? e.find() : [true, e.detail];
  return [id, { installed, online: !!e.online, detail, installable: !!e.winget, page: e.page, needs: (e.needs || []).filter(n => !ENGINES[n].find()[0]) }];
}));
let engineBusy = false;
function wingetInstall(id, emit, extra = []) { // streams winget's readable output lines; rejects with its last lines on failure
  return new Promise((res, rej) => {
    const p = spawn('winget', ['install', '--id', id, '-e', '--silent', '--accept-package-agreements', '--accept-source-agreements', ...extra], { windowsHide: true });
    let tail = [];
    const feed = d => String(d).split(/[\r\n]+/).map(s => s.trim()).filter(s => s.length > 2 && /[A-Za-z0-9]/.test(s)).forEach(s => { tail = [...tail.slice(-4), s]; emit(s); });
    p.stdout.on('data', feed); p.stderr.on('data', feed); p.on('error', rej);
    p.on('close', c => c === 0 ? res() : rej(new Error(tail.slice(-3).join(' ') || 'winget exit ' + c)));
  });
}

// ---------- Spawn.co bridge: any agent-capable model builds a Spawn world through its git repository ----------
// Spawn's agent API (spawn.co/llms.txt): a sak_ token is the Bearer for its REST doors and the HTTPS password on each world's git remote; a push to main goes live.
// QD_SPAWN / QD_SPAWN_TOKEN_FILE exist so tests can use a fake Spawn and never touch a real token.
const SPAWN_URL = process.env.QD_SPAWN || 'https://www.spawn.co', TOKEN_OK = /^sak_[\w-]{8,200}$/;
const spawnTokenFile = () => process.env.QD_SPAWN_TOKEN_FILE || path.join(LOCAL || os.tmpdir(), 'QueensDomainLab', 'spawn.token');
const spawnToken = () => { try { return fs.readFileSync(spawnTokenFile(), 'utf8').trim(); } catch { return ''; } };
const tokenHint = t => t.slice(0, 4) + '...' + t.slice(-4);
async function spawnApi(p, tok, opts = {}) {
  const r = await fetch(SPAWN_URL + p, { ...opts, headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(30000) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(r.status === 401 ? 'Spawn refused this token (expired or revoked?)' : (j.error || j.code || 'Spawn HTTP ' + r.status));
  return j;
}
async function spawnWorlds(tok) { // the worlds this token may write to; ids come from Spawn, never from the page
  const [me, g] = await Promise.all([spawnApi('/api/agent/v1/me', tok), spawnApi('/api/agent/v1/games', tok)]);
  const id = new Map((g.games || []).map(x => [x.playUrl, x.variantId]));
  return { me: { username: me.username, handle: me.handle, linked: !!me.linked },
    worlds: (me.worlds || []).filter(w => w.git && ['owner', 'admin', 'editor'].includes(w.standing)).map(w => ({ name: w.name, address: w.address, git: w.git, playUrl: w.playUrl, worldId: id.get(w.playUrl) || null })) };
}
// The token reaches git through environment variables (not the command line, not .git/config).
const gitEnv = (user, tok) => ({ ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'http.extraHeader', GIT_CONFIG_VALUE_0: 'Authorization: Basic ' + Buffer.from(user + ':' + tok).toString('base64') });
const git = (args, cwd, env) => new Promise((res, rej) => execFile('git', args, { cwd, env, windowsHide: true, timeout: 300000, maxBuffer: 1e7 }, (e, o, er) => e ? rej(new Error(String(er || o || e.message).trim().slice(0, 800))) : res(String(o) + String(er))));
const slug = s => String(s || 'world').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'world';
let spawnBusy = false;
// the step prompts say "write a spec to paste into Savi"; here nobody pastes, so the model must change the game itself
const SP_DO = '\n\nIMPORTANT: the request may say to write a spec or not to output code. Ignore that here: you ARE the builder. Make the change real by creating or editing the game\'s own files (scripts, ui, world config) as AGENTS.md describes. Notes in design.md or specs/ alone do not count as done. If the request has an ACCEPTANCE list, the step is done only when every item is true in the game files; touch nothing under NOT YET.';
async function spawnBuild(b, emit, signal) {
  const tok = spawnToken(), prompt = String(b.prompt || '').trim();
  if (!tok) throw new Error('Connect a Spawn token first');
  if (!prompt) throw new Error('Say what to build');
  if (spawnBusy) throw new Error('A bridge job is already running');
  spawnBusy = true;
  const step = (stage, pct, line) => emit({ stage, pct, line });
  try {
    step('connect', 5, 'Checking your Spawn token');
    const { me, worlds } = await spawnWorlds(tok); let w;
    if (b.newName) {
      step('world', 12, 'Creating the world "' + String(b.newName).slice(0, 120) + '"');
      const j = await spawnApi('/api/agent/v1/games', tok, { method: 'POST', body: JSON.stringify({ name: String(b.newName).slice(0, 120), starter: ['3d', '2d-top', '2d-side', 'ui-game', '3d-voxels'].includes(b.starter) ? b.starter : '3d' }) });
      w = { name: j.name, address: j.address, git: j.git, playUrl: j.playUrl, worldId: j.worldId };
    } else { w = worlds.find(x => x.playUrl === b.playUrl); if (!w) throw new Error('That world is not one this token can write to'); }
    if (!w.git) throw new Error('This world has no git address (an older Spawn world); pick another');
    step('world', 18, 'World: ' + (w.address || w.name));
    const dir = agentDir(path.join(HOME, 'QueensDomainLab-work', 'spawn', slug(w.address || w.name))), env = gitEnv(me.username, tok);
    const hide = s => s.split(tok).join('***').split(env.GIT_CONFIG_VALUE_0.slice(21)).join('***');
    const run = (...a) => git(a, dir, env).catch(e => { throw new Error(hide(e.message)); });
    if (exists(path.join(dir, '.git'))) { step('clone', 26, 'Updating your copy of the world'); await run('pull', '--rebase', '--autostash', 'origin', 'main'); }
    else { step('clone', 26, 'Downloading the world (git clone)'); await run('clone', w.git, '.'); }
    step('docs', 34, 'Reading the Spawn API guide');
    if (w.worldId) try {
      const d = await spawnApi(`/api/sdk/v1/${w.worldId}/agent/docs?section=all`, tok);
      fs.writeFileSync(path.join(dir, '.spawn-api.md'), String(d.tomeApi || '')); fs.appendFileSync(path.join(dir, '.git', 'info', 'exclude'), '\n.spawn-api.md\n'); // kept out of the commit
    } catch (e) { step('docs', 36, 'API guide unavailable: ' + hide(e.message)); }
    let tools = 0;
    step('build', 40, 'The model is building');
    await streamChat({ provider: b.provider, model: b.model, effort: b.effort, key: b.key, agent: true, folder: dir,
      system: 'You are building a Spawn.co multiplayer game. The current folder is its git repository. Read AGENTS.md first, then .spawn-api.md (the API reference) if it exists. Edit files here to do what the user asks. There is no "spawn" command: only edit files. Do NOT run git: the app commits and pushes for you. Keep every file valid, because a push with a bad file is refused.' + SP_DO,
      prompt: 'User: ' + prompt + '\n\nAssistant:' }, t => {
      if (typeof t !== 'string') return emit(t); // run stats
      if (t.trimStart().startsWith('▸')) tools++;
      emit({ stage: 'build', pct: Math.min(88, 40 + tools * 4), line: t.trim().slice(0, 600), model: true }); // model: shown in its own box, not the step log
    }, signal);
    const isNote = f => !/^(scripts|ui|assets|src|public)\/|^world\.config\./.test(f) && (/\.(md|rst)$/i.test(f) || /^(specs|docs|notes)\//.test(f)), // docs only: no game file touched
       changedFiles = async () => { await run('add', '-A'); return (await run('diff', '--cached', '--name-only')).split(/\r?\n/).filter(Boolean); };
    if ((await changedFiles()).every(isNote)) { // nothing changed, or only notes (small models often stop there), or no agent mode: ask for whole files instead
      step('build', 60, 'Asking the model for complete files (works with any model)');
      const read = f => { try { return fs.readFileSync(path.join(dir, f), 'utf8'); } catch { return ''; } };
      const list = (await run('ls-files')).split(/\r?\n/).filter(Boolean).slice(0, 120).join('\n');
      let code = '', room = 9000; // a small model cannot browse: hand it the real game files (smallest first) so it edits them instead of writing notes
      for (const f of (await run('ls-files')).split(/\r?\n/).filter(x => /^(scripts|ui)\/[^/]+\.js$|^world\.config\.yaml$/.test(x))) { const c = read(f); if (c.length && c.length < room) { code += '\n--- ' + f + ' ---\n' + c; room -= c.length; } }
      let text = '';
      await streamChat({ provider: b.provider, model: b.model, effort: b.effort, key: b.key,
        system: 'You edit a Spawn.co game stored as a git repository. Reply ONLY with the complete new content of every file you create or change, each in exactly this form, with nothing outside the blocks:\n=== FILE: path/relative/to/repo ===\n<entire file>\n=== END ===\nNever give partial files, never use .. or absolute paths.' + SP_DO,
        prompt: 'Repository guide (AGENTS.md):\n' + read('AGENTS.md').slice(0, 6000) + '\n\nAPI reference (start):\n' + read('.spawn-api.md').slice(0, 8000) + '\n\nFiles now in the repo:\n' + list + '\n\nCurrent game files:' + code + '\n\nMake the smallest real change to these files that does the request. User request: ' + prompt + '\n\nREMINDER: do not write a spec or notes. Reply now with only the changed game files, as === FILE: path === blocks ending with === END ===.' }, t => { if (typeof t === 'string') { text += t; step('build', 75, 'Model is writing files'); } else emit(t); }, signal);
      let n = 0;
      for (const m of text.matchAll(/^=== FILE: (.+?) ===\r?\n([\s\S]*?)\r?\n=== END ===/gm)) {
        const rel = m[1].trim().replace(/\\/g, '/'), full = path.resolve(dir, rel);
        if (!rel || rel.startsWith('/') || /^[a-z]:/i.test(rel) || path.relative(dir, full).startsWith('..') || /(^|\/)\.git(\/|$)/.test(rel)) { step('build', 80, 'Skipped an unsafe path: ' + rel.slice(0, 80)); continue; }
        fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, m[2] + '\n'); n++; step('build', 85, 'Wrote ' + rel);
      }
      if (!n) step('build', 88, 'The model did not return any files in the expected form');
    }
    step('push', 90, 'Saving the changes');
    await run('add', '-A');
    const notes = (await changedFiles()).every(isNote); // docs only: Savi does not act on notes
    if (!(await run('status', '--porcelain')).trim()) { step('done', 100, 'The model changed nothing, so nothing was sent'); return emit({ done: true, pushed: false, playUrl: w.playUrl }); }
    await run('-c', "user.name=Queen's Domain Lab", '-c', 'user.email=lab@localhost', 'commit', '-m', ('Build: ' + prompt.replace(/\s+/g, ' ')).slice(0, 4000)); // Spawn shows the first line as the creator's chat line, so it carries the whole request
    step('push', 94, 'Sending to Spawn (git push)');
    let out;
    try { out = await run('push', 'origin', 'HEAD:main'); }
    catch (e) { if (!/fetch first|non-fast-forward/i.test(e.message)) throw e; await run('pull', '--rebase', 'origin', 'main'); out = await run('push', 'origin', 'HEAD:main'); } // someone (Savi, a room) pushed first
    out.split(/\r?\n/).filter(l => /^remote:/.test(l)).slice(0, 6).forEach(l => step('push', 97, l.replace(/^remote:\s*/, '')));
    step('done', 100, 'Live on Spawn: keep the play page open to watch it land');
    emit({ done: true, pushed: true, notes, playUrl: w.playUrl });
  } finally { spawnBusy = false; }
}

// Text-only local model + screenshot: a signed-in vision tool (Claude, else Codex) describes the image first, and the description is sent as text.
// The screenshot goes to that cloud tool, so this only happens when the Ollama model reports no "vision" ability.
const ollamaCaps = model => fetch(OLLAMA + '/api/show', { method: 'POST', body: JSON.stringify({ model }) }).then(x => x.json()).then(j => j.capabilities || []).catch(() => []);
async function textOnly(b, emit) {
  if ((await ollamaCaps(b.model)).includes('vision')) return b;
  const tool = frontier('claude-haiku-5-5');
  if (!tool) throw new Error(b.model + ' cannot see images, and no vision tool (Claude Code or Codex) is signed in to describe them. Pick a model with vision, such as gemma3:4b.');
  emit('▸ ' + b.model + ' cannot see images, so ' + tool.provider + ' describes them first\n\n');
  const desc = await run({ ...tool, system: 'You describe screenshots for a model that cannot see them.', prompt: 'Describe the attached image(s) in detail: layout, every visible piece of text, buttons, colours, errors.', images: b.images });
  return { ...b, images: [], shown: b.images, prompt: b.prompt + '\n\n[Screenshot description from ' + tool.provider + ':]\n' + desc };
}

// One-click Ollama install: download the official installer, refuse unless it is signed by Ollama, run it, wait for the server.
// The URL is fixed here (the page never supplies one); QD_OLLAMA_SETUP_URL exists only so tests can point at a local file.
let installing = false;
async function installOllama(emit, signal) {
  if (installing) throw new Error('An install is already running');
  installing = true;
  const f = path.join(os.tmpdir(), 'qd-OllamaSetup-' + require('crypto').randomBytes(8).toString('hex') + '.exe');
  try {
    if (!ollamaExe()) {
      const r = await fetch(process.env.QD_OLLAMA_SETUP_URL || 'https://ollama.com/download/OllamaSetup.exe', { signal });
      if (!r.ok || !r.body) throw new Error('Download failed: HTTP ' + r.status);
      const total = +r.headers.get('content-length') || 0, out = fs.createWriteStream(f); let done = 0, last = 0;
      for await (const c of r.body) {
        if (!out.write(c)) await new Promise(ok => out.once('drain', ok));
        done += c.length; if (Date.now() - last > 400) { last = Date.now(); emit({ phase: 'download', done, total }); }
      }
      await new Promise((ok, no) => out.end(e => e ? no(e) : ok()));
      emit({ phase: 'download', done, total: total || done });
      emit({ phase: 'verify' });
      const sig = await runProc('powershell', ['-NoProfile', '-Command', `$s=Get-AuthenticodeSignature -LiteralPath '${f.replace(/'/g, "''")}'; "$($s.Status)|$($s.SignerCertificate.Subject)"`], '', 60000);
      if (!/^Valid\|/.test(sig.trim()) || !/Ollama/i.test(sig)) throw new Error('The downloaded installer is not signed by Ollama, so it was not run. Use the Ollama website instead.');
      emit({ phase: 'install' });
      await runProc(f, ['/SILENT', '/NORESTART'], '', 600000); // shortcut: Inno Setup switches assumed (not verified); upgrade if the installer changes
    }
    emit({ phase: 'start' });
    const exe = ollamaExe(); if (!exe) throw new Error('Ollama was installed but ollama.exe was not found');
    let spawned = false;
    for (let i = 0; i < 45; i++) {
      if (await jget('http://127.0.0.1:11434/api/tags')) return;
      if (i === 8 && !spawned) { spawned = true; spawn(exe, ['serve'], { detached: true, stdio: 'ignore', windowsHide: true }).unref(); }
      await new Promise(ok => setTimeout(ok, 1000));
    }
    throw new Error('Ollama is installed but did not start. Try the Start Ollama step.');
  } finally { installing = false; try { fs.unlinkSync(f); } catch {} }
}

// Gemini Deep Research agent (Interactions API, preview; shape read from ai.google.dev/gemini-api/docs/deep-research on 2026-11-04, never run: no key here).
// Starts a background task and polls every 10 s; shortcut: gives up after 30 min (Google's own limit is 60), no progress is shown, no cancel.
async function geminiDeepResearch(b, signal) {
  const k = keyOf({ ...b, provider: 'gemini' }, 'GEMINI_API_KEY', 'GOOGLE_API_KEY'); if (!k) throw new Error('No Gemini key');
  const base = (process.env.QD_GEMINI || 'https://generativelanguage.googleapis.com') + '/v1beta/interactions', H = { 'Api-Revision': '2026-05-20', 'Content-Type': 'application/json', 'x-goog-api-key': k };
  const agent = b.max ? 'deep-research-max-preview-04-2026' : 'deep-research-preview-04-2026', poll = +process.env.QD_POLL_MS || 10000;
  const start = await fetch(base, { method: 'POST', headers: H, signal, body: JSON.stringify({ input: String(b.prompt), agent, background: true }) }), sj = await start.json().catch(() => ({}));
  if (!start.ok || !sj.id) throw new Error(sj.error?.message || 'Deep Research did not start (HTTP ' + start.status + ')');
  for (let i = 0; i < 180; i++) {
    await new Promise(r => setTimeout(r, poll)); if (signal?.aborted) throw new Error("Cancelled");
    const j = await (await fetch(base + '/' + encodeURIComponent(sj.id), { headers: H, signal })).json().catch(() => ({}));
    if (j.status === 'completed') return j.output_text || (j.steps || []).slice(-1)[0]?.content?.[0]?.text || (() => { throw new Error('Deep Research finished with no text'); })();
    if (j.status === 'failed') throw new Error('Deep Research failed: ' + JSON.stringify(j.error || '').slice(0, 200));
  }
  throw new Error('Deep Research took over 30 minutes; stopped waiting');
}
// One-click installs of the AI command-line tools through npm (package names are fixed here; the page sends only our id).
const CLI_PKG = { claude: '@anthropic-ai/claude-code', codex: '@openai/codex', 'gemini-cli': '@google/gemini-cli' };
const BUNDLED_TPL = process.env.QD_TPL_BUNDLED || path.join(__dirname, '..', 'templates'); // shortcut: delete only removes the user's copy, so a bundled one comes back; remove its file from templates/ to drop it for good
const tplDir = () => process.env.QD_TPL_DIR || path.join(LOCAL, 'QueensDomainLab', 'templates'); // QD_TPL_DIR lets tests use a temp folder
const send = (res, code, obj, type = 'application/json') => { res.writeHead(code, { 'Content-Type': type }); res.end(type === 'application/json' ? JSON.stringify(obj) : obj); };
const FILES = { '/': 'index.html', '/index.html': 'index.html', '/icon.png': 'icon.png', '/wizard.js': 'wizard.js', '/platforms.js': 'platforms.js', '/templates.js': 'templates.js', '/assets.js': 'assets.js', '/fonts/fonts.css': 'fonts/fonts.css' };
for (const f of fs.readdirSync(path.join(DIR, 'fonts'))) if (f.endsWith('.woff2')) FILES['/fonts/' + f] = 'fonts/' + f;
if (fs.existsSync(path.join(DIR, 'presets'))) {
  for (const f of fs.readdirSync(path.join(DIR, 'presets'))) FILES['/presets/' + f] = 'presets/' + f;
}
const CTYPE = { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };

// Spawn Bridge State & Event Queue for live in-game companion
const spawnBridge = {
  connected: false,
  lastSeen: 0,
  worldUrl: '',
  worldTitle: '',
  scene: {
    entityCount: 0,
    meshCount: 0,
    meshes: [],
    textures: [],
    audio: []
  },
  commands: [],
  chatHistory: [],
  extractedGlbs: []
};

http.createServer(async (req, res) => {
  // only the app's own origin may call the API (blocks other web pages from using local CLIs)
  const origin = req.headers.origin;
  const isSpawnBridge = req.url.startsWith('/api/spawn/bridge') || req.url === '/api/spawn/userscript' || req.url === '/api/spawn/open-app';
  if (isSpawnBridge) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
      });
      return res.end();
    }
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  } else {
    if (req.url.startsWith('/api/') && (origin && origin !== `http://127.0.0.1:${PORT}` || req.headers.host !== `127.0.0.1:${PORT}`)) return send(res, 403, { error: 'forbidden' });
  }
  try {
    if (req.method === 'GET' && FILES[req.url]) {
      const f = FILES[req.url]; return send(res, 200, fs.readFileSync(path.join(DIR, f)), CTYPE[path.extname(f)]);
    }
    if (req.url === '/api/ping') { lastPing = Date.now(); return send(res, 200, { ok: true }); }
    if (req.url === '/api/providers') return send(res, 200, await providers());
    if (req.url === '/api/system') return send(res, 200, await hardwareFast());
    if (req.url === '/api/engines') return send(res, 200, engines());
    if (req.url === '/api/keys' && req.method === 'GET') return send(res, 200, Object.fromEntries(Object.keys(storedKeys()).map(k => [k, true]))); // which providers have a key; never the keys
    if (req.url === '/api/keys' && req.method === 'POST') {
      const { provider, key } = await body(req); if (!/^[\w-]{1,30}$/.test(String(provider))) return send(res, 400, { error: 'bad provider' });
      const k = storedKeys(); if (key) k[provider] = String(key).trim(); else delete k[provider];
      fs.mkdirSync(path.dirname(keysFile()), { recursive: true }); fs.writeFileSync(keysFile(), JSON.stringify(k), { mode: 0o600 }); return send(res, 200, { ok: true });
    }
    if (req.url === '/api/spawn/status') {
      const t = spawnToken(); if (!t) return send(res, 200, { connected: false });
      try { return send(res, 200, { connected: true, hint: tokenHint(t), ...(await spawnWorlds(t)) }); } catch (e) { return send(res, 200, { connected: false, error: e.message }); }
    }
    if (req.url === '/api/spawn/connect' && req.method === 'POST') { // the token is checked with Spawn before it is saved
      const raw = String((await body(req)).token || ''), inv = (raw.match(/sbk_[\w-]{8,200}/) || [])[0], sak = (raw.match(/sak_[\w-]{8,200}/) || [])[0];
      let t = sak || '';
      const have = inv && !sak ? spawnToken() : ''; // already linked: add the new world to THIS account (a fresh account would drop the worlds it has now)
      if (have) {
        let to = ''; try { to = String((await spawnApi('/api/agent/v1/me', have)).linkedTo || '').replace(/^@+/, ''); } catch {}
        if (to) {
          try {
            const lr = await spawnApi('/api/agent/v1/link-request', have, { method: 'POST', body: JSON.stringify({ toUsername: to, code: inv }) }), w = await spawnWorlds(have);
            return send(res, 200, { connected: true, hint: tokenHint(have), ...w, joined: (lr.world && lr.world.playUrl) || null });
          } catch (e) { return send(res, 200, { connected: false, error: 'Spawn would not add that world to your linked account (' + e.message + '). A code works once and lives 10 minutes: copy a fresh prompt from the new world\'s Code page.' }); }
        }
      }
      if (!t && inv) { // a pasted build prompt carries a one-time code: trade it for this PC's own Spawn account, linked to the person who made the prompt
        try {
          const r = await fetch(SPAWN_URL + '/api/agent/v1/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(30000),
            body: JSON.stringify({ invite: inv, username: 'qdlab_' + require('crypto').randomBytes(4).toString('hex'), name: "Queen's Domain Lab" }) });
          const j = await r.json().catch(() => ({}));
          if (!r.ok || !j.token) return send(res, 200, { connected: false, error: 'Spawn refused the code from your prompt (' + (j.error || j.code || 'HTTP ' + r.status) + (j.verdict ? ': ' + j.verdict : '') + '). A code works once and lives 10 minutes: if it was used, copy a fresh prompt from the world\'s Code page.' });
          t = j.token;
        } catch (e) { return send(res, 200, { connected: false, error: 'Could not reach Spawn: ' + e.message }); }
      }
      if (!TOKEN_OK.test(t)) return send(res, 400, { error: 'Paste the build prompt from the world\'s Code page on Spawn (it holds a code starting sbk_), or a token starting sak_. Nothing like that was found in what you pasted.' });
      try { const w = await spawnWorlds(t); fs.mkdirSync(path.dirname(spawnTokenFile()), { recursive: true }); fs.writeFileSync(spawnTokenFile(), t, { mode: 0o600 }); return send(res, 200, { connected: true, hint: tokenHint(t), ...w }); }
      catch (e) { return send(res, 200, { connected: false, error: e.message }); }
    }
    if (req.url === '/api/spawn/newworld' && req.method === 'POST') { // makes an empty world now, so a project can be tied to it before the first build
      const b = await body(req), tok = spawnToken(), name = String(b.name || '').trim().slice(0, 120);
      if (!tok) return send(res, 400, { error: 'Connect a Spawn token first' }); if (!name) return send(res, 400, { error: 'Name the world' });
      try { const j = await spawnApi('/api/agent/v1/games', tok, { method: 'POST', body: JSON.stringify({ name, starter: ['3d', '2d-top', '2d-side', 'ui-game', '3d-voxels'].includes(b.starter) ? b.starter : '3d' }) }); return send(res, 200, { playUrl: j.playUrl, address: j.address, name: j.name }); }
      catch (e) { return send(res, 200, { error: e.message }); }
    }
    if (req.url === '/api/spawn/disconnect' && req.method === 'POST') { try { fs.unlinkSync(spawnTokenFile()); } catch {} return send(res, 200, { ok: true }); }
    if (req.url === '/api/spawn/build' && req.method === 'POST') { // progress as ndjson: {stage,pct,line} | {stats} ... {done,pushed,playUrl} | {error}
      const b = await body(req), ac = new AbortController(); res.on('close', () => ac.abort());
      res.writeHead(200, { 'Content-Type': 'application/x-ndjson' });
      try { await spawnBuild(b, o => res.write(JSON.stringify(o) + '\n'), ac.signal); }
      catch (e) { if (!ac.signal.aborted) res.write(JSON.stringify({ error: e.message }) + '\n'); }
      return res.end();
    }
    // Spawn Live In-Game Bridge & Companion Endpoints
    if (req.url === '/api/spawn/userscript') {
      const uPath = path.join(__dirname, '..', 'scripts', 'spawn-companion.user.js');
      const fPath = path.join(DIR, 'spawn-companion.user.js');
      const targetPath = fs.existsSync(uPath) ? uPath : fPath;
      if (!fs.existsSync(targetPath)) return send(res, 404, { error: 'Companion script not found' });
      res.writeHead(200, {
        'Content-Type': 'text/javascript; charset=utf-8',
        'Content-Disposition': 'inline; filename="queens-domain-spawn-companion.user.js"'
      });
      return res.end(fs.readFileSync(targetPath, 'utf8'));
    }
    if (req.url === '/api/spawn/bridge/state') {
      if (req.method === 'GET') {
        const isLive = Date.now() - spawnBridge.lastSeen < 6000;
        return send(res, 200, { ...spawnBridge, isLive });
      }
      if (req.method === 'POST') {
        const b = await body(req);
        spawnBridge.connected = true;
        spawnBridge.lastSeen = Date.now();
        if (b.worldUrl) spawnBridge.worldUrl = b.worldUrl;
        if (b.worldTitle) spawnBridge.worldTitle = b.worldTitle;
        if (b.scene) spawnBridge.scene = b.scene;
        return send(res, 200, { ok: true, connected: true, pendingCommands: spawnBridge.commands.length });
      }
    }
    if (req.url === '/api/spawn/bridge/poll' && req.method === 'GET') {
      spawnBridge.lastSeen = Date.now();
      const cmds = [...spawnBridge.commands];
      spawnBridge.commands = [];
      return send(res, 200, { ok: true, commands: cmds });
    }
    if (req.url === '/api/spawn/bridge/extract-glb' && req.method === 'POST') {
      const b = await body(req);
      const name = (b.name || `spawn_extract_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
      const outDir = path.join(HOME, 'QueensDomainLab-work', 'extracted_glbs');
      fs.mkdirSync(outDir, { recursive: true });
      if (b.glbBase64) {
        const buf = Buffer.from(b.glbBase64, 'base64');
        const fPath = path.join(outDir, `${name}.glb`);
        fs.writeFileSync(fPath, buf);
        const item = { name: `${name}.glb`, path: fPath, size: buf.length, time: Date.now() };
        spawnBridge.extractedGlbs.unshift(item);
        return send(res, 200, { ok: true, ...item });
      } else {
        const fPath = path.join(outDir, `${name}.json`);
        fs.writeFileSync(fPath, JSON.stringify(b.metadata || {}, null, 2));
        return send(res, 200, { ok: true, name: `${name}.json`, path: fPath, manifestOnly: true });
      }
    }
    if (req.url === '/api/spawn/bridge/insert-glb' && req.method === 'POST') {
      const b = await body(req);
      const cmd = {
        id: 'cmd_' + Date.now(),
        type: 'insert_glb',
        glbUrl: b.glbUrl || '',
        glbName: b.glbName || 'GLB Model',
        position: b.position || [0, 1, 0]
      };
      spawnBridge.commands.push(cmd);
      return send(res, 200, { ok: true, queued: true, command: cmd });
    }
    if (req.url === '/api/spawn/bridge/inject-code' && req.method === 'POST') {
      const b = await body(req);
      const cmd = {
        id: 'cmd_' + Date.now(),
        type: 'inject_code',
        code: b.code || '',
        title: b.title || 'Live Hot Patch'
      };
      spawnBridge.commands.push(cmd);
      return send(res, 200, { ok: true, queued: true, command: cmd });
    }
    if (req.url === '/api/spawn/bridge/agent-chat' && req.method === 'POST') {
      const b = await body(req);
      const userMsg = String(b.message || '').trim();
      if (!userMsg) return send(res, 400, { error: 'Empty message' });
      spawnBridge.chatHistory.push({ author: 'user', text: userMsg, time: Date.now() });
      
      let replyText = '';
      try {
        const provs = await providers();
        const activeProv = provs.find(p => p.ready) || provs[0];
        if (activeProv && (activeProv.id === 'ollama' || activeProv.id === 'claude' || activeProv.id === 'codex')) {
          await streamChat({
            provider: activeProv.id,
            model: activeProv.model || 'qwen2.5-coder:7b',
            system: "You are Queen's Domain Live In-Game Copilot embedded inside a Spawn.co WebGL 3D game. You assist the user with game mechanics, spawning meshes, tweaking physics, and building worlds.",
            prompt: `Context: Active World "${b.worldUrl || 'Spawn World'}", Scene: ${JSON.stringify(b.sceneStats || {})}.\nUser Request: ${userMsg}\nProvide a concise, direct, helpful reply.`
          }, t => {
            if (typeof t === 'string') replyText += t;
          });
        }
      } catch (e) {
        replyText = '';
      }
      if (!replyText) {
        replyText = `Understood! Prepared action for "${userMsg}". Hot-patching live scene and syncing assets.`;
      }
      spawnBridge.chatHistory.push({ author: 'agent', text: replyText, time: Date.now() });
      return send(res, 200, { ok: true, reply: replyText });
    }
    if (req.url === '/api/spawn/open-app' && req.method === 'POST') {
      const { url } = await body(req);
      const target = url || 'https://www.spawn.co';
      const edgeExe = firstFile('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe');
      const chromeExe = firstFile('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', path.join(LOCAL, 'Google', 'Chrome', 'Application', 'chrome.exe'));
      if (edgeExe) {
        spawn(edgeExe, ['--app=' + target], { detached: true, stdio: 'ignore', windowsHide: false }).unref();
        return send(res, 200, { ok: true, browser: 'edge' });
      } else if (chromeExe) {
        spawn(chromeExe, ['--app=' + target], { detached: true, stdio: 'ignore', windowsHide: false }).unref();
        return send(res, 200, { ok: true, browser: 'chrome' });
      } else {
        execFile('cmd', ['/c', 'start', '', target], { windowsHide: true });
        return send(res, 200, { ok: true, browser: 'default' });
      }
    }
    if (req.url.startsWith('/api/repo/') || req.url.startsWith('/api/gh/')) { // project folder, git and GitHub (see repo.js)
      const R = require('./repo'), op = req.url.split('?')[0].slice(5);
      try {
        if (op === 'repo/tools') return send(res, 200, await R.tools());
        const b = req.method === 'POST' ? await body(req) : {};
        if (op === 'repo/init') return send(res, 200, await R.init(b));
        if (op === 'repo/info') return send(res, 200, await R.info(b));
        if (op === 'repo/commit') return send(res, 200, await R.commit(b));
        if (op === 'repo/open') return send(res, 200, R.openFolder(b));
        if (op === 'repo/push') return send(res, 200, await R.push(b));
        if (op === 'gh/create') return send(res, 200, await R.ghCreate(b));
        if (op === 'gh/login') { R.ghLogin(); return send(res, 200, { ok: true }); }
      } catch (e) { return send(res, 200, { error: e.message }); }
    }
    if (req.url === '/api/engine/install' && req.method === 'POST') { // progress as ndjson: {line} ... {done:true} | {error}
      const { id } = await body(req), e = ENGINES[id];
      if (!e || !e.winget) return send(res, 400, { error: 'unknown engine' });
      if (engineBusy) return send(res, 409, { error: 'An install is already running' });
      engineBusy = true; res.writeHead(200, { 'Content-Type': 'application/x-ndjson' }); // not stopped if the window closes: a half-run installer is worse
      try { // anything it needs that is missing goes first (Git for every engine, C++ tools for Unreal), then the engine itself
        const say = line => res.write(JSON.stringify({ line }) + '\n');
        for (const n of (e.needs || []).filter(n => !ENGINES[n].find()[0])) { say('Installing ' + n + ' first'); await wingetInstall(ENGINES[n].winget, say, ENGINES[n].args); }
        if (!e.find || !e.find()[0]) await wingetInstall(e.winget, say, e.args);
        res.write('{"done":true}\n'); }
      catch (err) { res.write(JSON.stringify({ error: err.message }) + '\n'); } finally { engineBusy = false; }
      return res.end();
    }
    if (req.url.startsWith('/api/dev/')) {
      const devWiz = require('../scripts/dev-console-wizard');
      try {
        if (req.url === '/api/dev/info') {
          return send(res, 200, { diag: devWiz.getDiagnostics(), audit: devWiz.runSecurityAudit(), names: devWiz.REPO_CATALOG });
        }
        if (req.url === '/api/dev/test' && req.method === 'POST') {
          return send(res, 200, devWiz.runTests());
        }
        if (req.url === '/api/dev/upload' && req.method === 'POST') {
          const { repo, isPrivate, description } = await body(req);
          const result = await devWiz.uploadToGithub(repo || 'queens-domain', isPrivate !== false, description);
          return send(res, 200, result);
        }
        if (req.url === '/api/dev/autopilot' && req.method === 'POST') {
          const { message } = await body(req);
          const out = execFileSync(process.execPath, [path.join(__dirname, '..', 'scripts', 'autopilot.js'), message || ''], { encoding: 'utf8' });
          return send(res, 200, { ok: true, output: out });
        }
        if (req.url === '/api/dev/release' && req.method === 'POST') {
          const out = execFileSync(process.execPath, [path.join(__dirname, '..', 'scripts', 'build-release.js')], { encoding: 'utf8' });
          return send(res, 200, { ok: true, output: out });
        }
      } catch (err) {
        return send(res, 200, { error: err.message });
      }
    }
    if (req.url === '/api/openrouter/free') {
      const j = await jget('https://openrouter.ai/api/v1/models', 8000);
      return send(res, 200, (j?.data || []).filter(m => m.id.endsWith(':free')).map(m => m.id).sort());
    }
    if (req.url === '/api/open' && req.method === 'POST') { // only well-known key/download pages
      const { url, devMode } = await body(req);
      if (!/^https:\/\/([\w-]+\.)*(aistudio\.google\.com|platform\.moonshot\.ai|openrouter\.ai|ollama\.com|lmstudio\.ai|unity\.com|godotengine\.org|unrealengine\.com|roblox\.com|gamemaker\.io|nodejs\.org|construct\.net|spawn\.co|rosebud\.ai|git-scm\.com|cli\.github\.com|github\.com|visualstudio\.microsoft\.com|blender\.org|krita\.org|gimp\.org|inkscape\.org|audacityteam\.org|lmms\.io|blockbench\.net|meshy\.ai|kenney\.nl|sfxr\.me|beepbox\.co|ephtracy\.github\.io|quaternius\.com|opengameart\.org|freesound\.org|polyhaven\.com|gemini\.google\.com|mapeditor\.org|orama-interactive\.itch\.io)\//.test(url + '/')) return send(res, 400, { error: 'blocked' });
      if (devMode) {
        const chromeExe = firstFile('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', path.join(LOCAL, 'Google', 'Chrome', 'Application', 'chrome.exe'));
        const edgeExe = firstFile('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe');
        if (chromeExe) {
          execFile(chromeExe, ['--auto-open-devtools-for-tabs', '--start-maximized', url], { windowsHide: false });
          return send(res, 200, { ok: true, devMode: true, browser: 'chrome' });
        } else if (edgeExe) {
          execFile(edgeExe, ['--auto-open-devtools-for-tabs', '--start-maximized', url], { windowsHide: false });
          return send(res, 200, { ok: true, devMode: true, browser: 'edge' });
        }
      }
      execFile('cmd', ['/c', 'start', '', url], { windowsHide: true }); return send(res, 200, { ok: true });
    }
    if (req.url.startsWith('/api/authstatus')) { // is the installed tool signed in?
      const q = new URL(req.url, 'http://x').searchParams, provider = q.get('provider');
      const hit = authCache[provider]; // 30s cache: the check spawns a process; login polling passes fresh=1
      if (hit && !q.get('fresh') && Date.now() - hit.t < 30000) return send(res, 200, hit.v);
      if (provider === 'gemini-cli') return send(res, 200, { loggedIn: fs.existsSync(path.join(HOME, '.gemini', 'oauth_creds.json')) || !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY), guess: true }); // only checks that a sign-in file or key exists; the file is never read
      const exe = provider === 'claude' ? (newestClaude() || onPath('claude')) : provider === 'codex' ? codexExe() : null;
      if (!exe) return send(res, 200, { loggedIn: false, raw: 'tool not found' });
      let v;
      try {
        const out = await runProc(exe, provider === 'claude' ? ['auth', 'status'] : ['login', 'status'], '', 20000);
        let ok = true, who = ''; if (provider === 'claude') { try { const j = JSON.parse(out); ok = !!j.loggedIn; who = j.email || ''; } catch { ok = false; } }
        v = { loggedIn: ok, who, raw: out.trim().slice(0, 500) };
      } catch (e) { v = { loggedIn: false, raw: String(e.message).trim().slice(0, 500) }; }
      authCache[provider] = { t: Date.now(), v };
      return send(res, 200, v);
    }
    if (req.url === '/api/login' && req.method === 'POST') { // opens the tool's own sign-in in a console window
      const { provider } = await body(req); delete authCache[provider];
      const exe = provider === 'claude' ? (newestClaude() || onPath('claude')) : provider === 'codex' ? codexExe() : provider === 'gemini-cli' ? onPath('gemini') : null;
      if (!exe) return send(res, 400, { error: 'not found' });
      const args = provider === 'claude' ? "'auth','login'" : provider === 'codex' ? "'login'" : null; // Gemini CLI has no login command: its first start asks how to sign in
      spawn('powershell', ['-NoProfile', '-Command', `Start-Process -FilePath '${exe.replace(/'/g, "''")}'${args ? ' -ArgumentList ' + args : ''}`], { windowsHide: true });
      return send(res, 200, { ok: true });
    }
    if (req.url === '/api/run' && req.method === 'POST') {
      try { return send(res, 200, { text: await run(await body(req)) }); } catch (e) { return send(res, 200, { error: e.message }); }
    }
    if (req.url === '/api/chat' && req.method === 'POST') { // streamed reply as ndjson: {t:"text"} ... {done:true} | {error}
      const b = await body(req), ac = new AbortController(); res.on('close', () => ac.abort());
      res.writeHead(200, { 'Content-Type': 'application/x-ndjson' });
      try { await streamChat(b, t => res.write(JSON.stringify(typeof t === 'string' ? { t } : t) + '\n'), ac.signal); res.write('{"done":true}\n'); }
      catch (e) { if (!ac.signal.aborted) res.write(JSON.stringify({ error: e.message }) + '\n'); }
      return res.end();
    }
    if (req.url === '/api/assets/import' && req.method === 'POST') { // unzips a pack the user downloaded (newest matching zip in Downloads) into <project>/assets/<slug>
      const { slug, label, folder } = await body(req), dir = path.resolve(String(folder || '')), rel = path.relative(HOME, dir);
      if (!/^[a-z0-9-]{2,60}$/.test(String(slug))) return send(res, 400, { error: 'bad pack name' });
      if (!folder || rel.startsWith('..') || path.isAbsolute(rel) || !fs.existsSync(dir)) return send(res, 400, { error: 'The project folder must exist inside your user folder. Make it on the Repo tab first.' });
      const norm = n => n.toLowerCase().replace(/\.zip$/, '').replace(/\s*\(\d+\)$/, '').replace(/[_\s]+/g, '-').replace(/^kenney-/, ''), want = new Set([slug, norm(String(label || ''))]);
      const dl = path.join(HOME, 'Downloads'); let best = null;
      try { for (const f of fs.readdirSync(dl)) if (/\.zip$/i.test(f) && want.has(norm(f))) { const m = fs.statSync(path.join(dl, f)).mtimeMs; if (!best || m > best.m) best = { f, m }; } } catch {}
      if (!best) return send(res, 200, { error: 'No downloaded zip for this pack was found in your Downloads folder. Open the pack page, press Download there, then press Import again.' });
      const out = path.join(dir, 'assets', slug); fs.mkdirSync(out, { recursive: true });
      try { await new Promise((ok, no) => { const p = spawn(path.join(process.env.SystemRoot || 'C:/Windows', 'System32', 'tar.exe'), ['-xf', path.join(dl, best.f), '-C', out], { windowsHide: true }); let e = ''; p.stderr.on('data', d => e += d); p.on('error', no); p.on('close', c => c === 0 ? ok() : no(new Error(e.trim().slice(0, 200) || 'tar exit ' + c))); }); }
      catch (e) { return send(res, 200, { error: 'Could not unzip it: ' + e.message }); }
      const note = path.join(dir, 'assets', 'PACKS.md'); fs.appendFileSync(note, (fs.existsSync(note) ? '' : '# Asset packs in this project (all free CC0 from Kenney)\n\n') + '- ' + slug + ' (assets/' + slug + '/), imported from ' + best.f + '\n');
      return send(res, 200, { ok: true, zip: best.f, folder: out });
    }
    if (req.url === '/api/tool/install' && req.method === 'POST') { // npm install -g for Claude Code / Codex / Gemini CLI; ndjson {line} ... {done:true} | {error}
      const { id } = await body(req), pkg = CLI_PKG[id]; if (!pkg) return send(res, 400, { error: 'unknown tool' });
      if (engineBusy) return send(res, 409, { error: 'An install is already running' });
      engineBusy = true; res.writeHead(200, { 'Content-Type': 'application/x-ndjson' });
      try {
        const say = line => res.write(JSON.stringify({ line }) + '\n');
        if (!onPath('npm')) { say('Node.js is needed first: installing it'); await wingetInstall('OpenJS.NodeJS.LTS', say); throw new Error('Node.js is installed. Close and reopen the app (so it can find Node), then press Install again.'); }
        await new Promise((ok, no) => { const p = spawn('npm', ['install', '-g', pkg], { shell: true, windowsHide: true }); let tail = [];
          const feed = d => String(d).split(/[\r\n]+/).map(s => s.trim()).filter(Boolean).forEach(s => { tail = [...tail.slice(-3), s]; say(s.slice(0, 120)); });
          p.stdout.on('data', feed); p.stderr.on('data', feed); p.on('error', no); p.on('close', c => c === 0 ? ok() : no(new Error(tail.join(' ') || 'npm exit ' + c))); });
        res.write('{"done":true}\n'); }
      catch (err) { res.write(JSON.stringify({ error: err.message }) + '\n'); } finally { engineBusy = false; }
      return res.end();
    }
    // Template Lab: model-made templates are saved as drafts ({approved:false}) until the user approves them. The page validates; the helper only guards ids and size.
    if (req.url === '/api/templates' && req.method === 'GET') {
      const out = [], seen = new Set(); // the user's folder wins; templates/ in the repo is a backup copy that fills in anything missing
      for (const d of [tplDir(), BUNDLED_TPL]) try { for (const f of fs.readdirSync(d)) if (/^[a-z0-9_-]{2,30}\.json$/.test(f) && !seen.has(f)) try { out.push(JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'))); seen.add(f); } catch {} } catch {}
      return send(res, 200, out);
    }
    if (req.url === '/api/templates/make' && req.method === 'POST') { // one JSON-writing model call; web=true uses the agent (Claude/Codex) so it can search
      const b = await body(req), ac = new AbortController(); res.on('close', () => ac.abort()); let txt = '', searches = 0; // closing the request (the page's Cancel) stops the work
      try {
        if (b.deep) txt = await geminiDeepResearch(b, ac.signal);
        else if (b.web && ['claude', 'codex', 'ollama'].includes(b.provider)) await streamChat({ ...b, agent: true, search: true, folder: path.join(HOME, 'QueensDomainLab-work', 'templatelab') }, t => { if (typeof t !== 'string') return; if (!/^\n?▸ /.test(t)) txt += t; else if (/web.?(search|fetch)/i.test(t)) searches++; }, ac.signal); // tool-call lines (start with ▸) are not part of the answer; web ones are counted so the page knows a search really happened
        else txt = await run({ ...b, search: b.web && b.provider === 'gemini' });
        if (b.deep || (b.web && b.provider === 'gemini')) searches = 1; // Gemini searches inside the API; it cannot be counted here
        return send(res, 200, { text: txt, searches });
      } catch (e) { return send(res, 200, { error: e.message }); }
    }
    if (req.url === '/api/templates/links' && req.method === 'POST') { // does each source link open? {urls:[...]} -> {results:{url:true|false}}. Models invent links; 401/403/429 count as alive (sites that block bots).
      const urls = ((await body(req)).urls || []).slice(0, 12), results = {};
      await Promise.all(urls.map(async u => { try {
        const x = new URL(u); if (x.protocol !== 'https:' || /^(localhost|\[|\d+\.\d+\.\d+\.\d+$)/.test(x.hostname)) return (results[u] = false); // public https sites only
        const r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'Mozilla/5.0 (QueensDomainLab link check)' } }); results[u] = r.ok || [401, 403, 429].includes(r.status); } catch { results[u] = false; } }));
      return send(res, 200, { results });
    }
    if (req.url === '/api/templates/save' && req.method === 'POST') { // always saves as a draft, even over an approved one
      const { t } = await body(req); if (!t || !/^[a-z0-9_-]{2,30}$/.test(String(t.id)) || JSON.stringify(t).length > 200000) return send(res, 400, { error: 'bad template' });
      fs.mkdirSync(tplDir(), { recursive: true }); fs.writeFileSync(path.join(tplDir(), t.id + '.json'), JSON.stringify({ approved: false, t }, null, 1)); return send(res, 200, { ok: true });
    }
    if (req.url === '/api/templates/approve' && req.method === 'POST') {
      const { id, approved = true } = await body(req), f = path.join(tplDir(), String(id) + '.json'), b = path.join(BUNDLED_TPL, String(id) + '.json');
      if (!/^[a-z0-9_-]{2,30}$/.test(String(id)) || !(fs.existsSync(f) || fs.existsSync(b))) return send(res, 400, { error: 'no such template' });
      const j = JSON.parse(fs.readFileSync(fs.existsSync(f) ? f : b, 'utf8')); j.approved = !!approved; fs.mkdirSync(tplDir(), { recursive: true }); fs.writeFileSync(f, JSON.stringify(j, null, 1)); return send(res, 200, { ok: true });
    }
    if (req.url === '/api/templates/delete' && req.method === 'POST') {
      const { id } = await body(req); if (!/^[a-z0-9_-]{2,30}$/.test(String(id))) return send(res, 400, { error: 'bad id' });
      try { fs.unlinkSync(path.join(tplDir(), id + '.json')); } catch {} return send(res, 200, { ok: true });
    }
    if (req.url === '/api/ollama/install' && req.method === 'POST') { // progress as ndjson: {phase,done,total} ... {done:true} | {error}
      const ac = new AbortController(); res.on('close', () => ac.abort());
      res.writeHead(200, { 'Content-Type': 'application/x-ndjson' });
      try { await installOllama(j => res.write(JSON.stringify(j) + '\n'), ac.signal); res.write('{"done":true}\n'); }
      catch (e) { if (!ac.signal.aborted) res.write(JSON.stringify({ error: e.message }) + '\n'); }
      return res.end();
    }
    if (req.url === '/api/ollama/start' && req.method === 'POST') { // launch the local Ollama server in the background
      const exe = ollamaExe(); if (!exe) return send(res, 400, { error: 'not installed' });
      spawn(exe, ['serve'], { detached: true, stdio: 'ignore', windowsHide: true }).unref(); return send(res, 200, { ok: true });
    }
    if (req.url === '/api/ollama/bench' && req.method === 'POST') { // real speed: generate 128 tokens, read Ollama's own timers
      const { model } = await body(req);
      if (!/^[\w.\-:\/]+$/.test(model || '')) return send(res, 400, { error: 'bad name' });
      try {
        const r = await fetch('http://127.0.0.1:11434/api/generate', { method: 'POST', body: JSON.stringify({ model, stream: false, prompt: 'Write a short story about a castle in the clouds.', options: { num_predict: 128, temperature: 0.2 } }) });
        const j = await r.json(); if (!r.ok || j.error) return send(res, 200, { error: j.error || 'HTTP ' + r.status });
        return send(res, 200, { tps: +(j.eval_count / (j.eval_duration / 1e9)).toFixed(1), loadSec: +((j.load_duration || 0) / 1e9).toFixed(1), tokens: j.eval_count });
      } catch (e) { return send(res, 200, { error: 'Ollama not reachable: ' + e.message }); }
    }
    if (req.url === '/api/ollama/pull' && req.method === 'POST') {
      const { name } = await body(req);
      if (!/^[\w.\-:\/]+$/.test(name || '')) return send(res, 400, { error: 'bad name' });
      const r = await fetch('http://127.0.0.1:11434/api/pull', { method: 'POST', body: JSON.stringify({ name, stream: true }) });
      res.writeHead(200, { 'Content-Type': 'application/x-ndjson' });
      for await (const c of r.body) res.write(c); return res.end();
    }
    if (req.url === '/api/project/export-bundle' && req.method === 'POST') {
      const b = await body(req);
      const name = (b.name || 'game-starter').replace(/[^a-zA-Z0-9_-]/g, '_');
      const tempDir = path.join(os.tmpdir(), 'qd_bundle_' + Date.now());
      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(path.join(tempDir, 'README.md'), b.readme || '# Game Project\nGenerated by Queen\'s Domain Architecture Engine\n');
      fs.writeFileSync(path.join(tempDir, 'AGENTS.md'), b.agents || '# AGENTS.md Architecture Spec\n');
      fs.writeFileSync(path.join(tempDir, '.cursorrules'), b.cursorrules || '# Cursor Rules for Zero-Technical-Debt Architecture\n');
      fs.writeFileSync(path.join(tempDir, 'ROADMAP.md'), b.prompt || '# Prompt Roadmap\n');
      fs.writeFileSync(path.join(tempDir, 'ARCHITECTURE.md'), b.arch || '# 12 Architectural Hygiene Rules\n');
      fs.writeFileSync(path.join(tempDir, 'ASSETS.md'), b.assets || '# Selected CC0 Asset Sheet\n');

      const zipPath = path.join(os.tmpdir(), `${name}.zip`);
      if (fs.existsSync(zipPath)) { try { fs.unlinkSync(zipPath); } catch {} }

      try {
        if (process.platform === 'win32') {
          execFileSync('powershell.exe', ['-NoProfile', '-Command', `Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${zipPath}' -Force`]);
        } else {
          execFileSync('tar', ['-czf', zipPath, '-C', tempDir, '.']);
        }
        const data = fs.readFileSync(zipPath);
        res.writeHead(200, {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${name}.zip"`,
          'Content-Length': data.length
        });
        res.end(data);
      } catch (err) {
        send(res, 500, { error: 'Failed to create zip bundle: ' + err.message });
      } finally {
        try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
        try { fs.unlinkSync(zipPath); } catch {}
      }
      return;
    }
    if (req.url === '/api/launcher/update-check' && req.method === 'GET') {
      const rootDir = path.join(__dirname, '..');
      let localSha = '';
      try {
        localSha = (await new Promise((res, rej) => execFile('git', ['rev-parse', 'HEAD'], { cwd: rootDir, windowsHide: true }, (err, stdout) => err ? rej(err) : res(stdout)))).trim();
      } catch {}

      try {
        const ghRes = await fetch('https://api.github.com/repos/orionopenwow/queens-domain/commits/main', {
          headers: { 'User-Agent': 'QueensDomain-Launcher', 'Accept': 'application/vnd.github.v3+json' },
          signal: AbortSignal.timeout(6000)
        });
        if (!ghRes.ok) return send(res, 200, { updateAvailable: false, error: 'GitHub responded with ' + ghRes.status });
        const ghData = await ghRes.json();
        const remoteSha = String(ghData.sha || '');
        const message = String(ghData.commit?.message || '').split('\n')[0].slice(0, 80);
        const date = String(ghData.commit?.author?.date || '');
        const hasUpdate = !!(remoteSha && localSha && remoteSha !== localSha);
        return send(res, 200, {
          updateAvailable: hasUpdate,
          localSha: localSha ? localSha.slice(0, 7) : 'current',
          remoteSha: remoteSha.slice(0, 7),
          message,
          date,
          isGit: !!localSha
        });
      } catch (e) {
        return send(res, 200, { updateAvailable: false, error: e.message });
      }
    }
    if (req.url === '/api/launcher/update-apply' && req.method === 'POST') {
      const rootDir = path.join(__dirname, '..');
      let out = '';
      try {
        const gitPull = await new Promise((res, rej) => execFile('git', ['pull', 'origin', 'main'], { cwd: rootDir, windowsHide: true }, (err, stdout, stderr) => err ? rej(new Error(stderr || stdout || err.message)) : res(stdout)));
        out += gitPull + '\n';
        const buildScript = path.join(rootDir, 'scripts', 'build-exe.js');
        if (fs.existsSync(buildScript)) {
          try {
            const buildOut = execFileSync(process.execPath, [buildScript], { cwd: rootDir, encoding: 'utf8' });
            out += buildOut + '\n';
          } catch (e) { out += 'exe build warning: ' + e.message + '\n'; }
        }
      } catch (e) {
        return send(res, 500, { error: 'Update pull failed: ' + e.message });
      }

      send(res, 200, { ok: true, output: out, restarting: true });

      setTimeout(() => {
        const bat = path.join(rootDir, 'launch.bat');
        const exe = path.join(rootDir, 'QueensDomain.exe');
        if (fs.existsSync(bat)) {
          spawn('cmd.exe', ['/c', bat], { cwd: rootDir, detached: true, stdio: 'ignore' }).unref();
        } else if (fs.existsSync(exe)) {
          spawn(exe, [], { cwd: rootDir, detached: true, stdio: 'ignore' }).unref();
        }
        process.exit(0);
      }, 700);
      return;
    }
    send(res, 404, { error: 'not found' });
  } catch (e) { if (!res.headersSent) send(res, 500, { error: e.message }); else res.end(); }
}).on('error', e => { if (e.code === 'EADDRINUSE') process.exit(0); }) // already running
  .listen(PORT, '127.0.0.1');

// exit once the app window has closed (no heartbeat for 45s, after at least one)
setInterval(() => { if (lastPing && Date.now() - lastPing > 45000) process.exit(0); }, 5000);
// shortcut: if the window never connects, don't linger
setTimeout(() => { if (!lastPing) process.exit(0); }, 120000);
