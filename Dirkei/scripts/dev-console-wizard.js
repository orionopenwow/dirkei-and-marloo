#!/usr/bin/env node
// ==============================================================================
// AI GAME STUDIO // DEV CONSOLE WIZARD & AUTO-REPO UPLOAD ENGINE
// StarCraft / Protoss Cyberpunk Command Center & Repository Automation
// ==============================================================================

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const REPO_CATALOG = [
  // Category 1: Cyber-Tactical & RTS (StarCraft / Protoss Heritage)
  { id: 1, name: 'ai-game-studio', category: 'Default / Flagship', pitch: 'The official flagship AI Game Studio suite' },
  { id: 2, name: 'queens-domain-lab', category: 'Cyber-Tactical & RTS', pitch: 'Lore-driven StarCraft tactical game architecture laboratory' },
  { id: 3, name: 'protoss-forge', category: 'Cyber-Tactical & RTS', pitch: 'Golden-rimmed AI blueprint architecture for game engineering' },
  { id: 4, name: 'nexus-game-engine', category: 'Cyber-Tactical & RTS', pitch: 'Central warp-in node for autonomous game development' },
  { id: 5, name: 'archon-studio', category: 'Cyber-Tactical & RTS', pitch: 'Fused intelligence gaming synthesis platform' },
  { id: 6, name: 'chronosphere-engine', category: 'Cyber-Tactical & RTS', pitch: 'Temporal game loop builder and dynamic prompt warp gate' },
  { id: 7, name: 'hyperion-games-lab', category: 'Cyber-Tactical & RTS', pitch: 'Tactical command deck for generative game prototyping' },
  { id: 8, name: 'cyber-domain-studio', category: 'Cyber-Tactical & RTS', pitch: 'Cyberpunk game forge powered by frontier models' },
  { id: 9, name: 'psi-blade-studio', category: 'Cyber-Tactical & RTS', pitch: 'Razor-sharp prompts and precision engine blueprints' },
  { id: 10, name: 'starcraft-game-lab', category: 'Cyber-Tactical & RTS', pitch: 'Retro RTS and ARPG vibe-coding environment' },

  // Category 2: Autonomous AI & Generative Game Engines
  { id: 11, name: 'vibe-craft-studio', category: 'Autonomous & Generative AI', pitch: 'The premier vibe-coding game ideation engine' },
  { id: 12, name: 'neural-forge-studio', category: 'Autonomous & Generative AI', pitch: 'Deep-learning pipeline for interactive worlds' },
  { id: 13, name: 'prompt-to-play', category: 'Autonomous & Generative AI', pitch: 'From natural language to fully playable indie games' },
  { id: 14, name: 'agentic-game-lab', category: 'Autonomous & Generative AI', pitch: 'Multi-agent crews collaborating on engine source code' },
  { id: 15, name: 'synthetica-games', category: 'Autonomous & Generative AI', pitch: 'Synthetic asset and code orchestration engine' },
  { id: 16, name: 'genesis-ai-studio', category: 'Autonomous & Generative AI', pitch: 'Instant universe genesis and ruleset synthesis' },
  { id: 17, name: 'mind-weaver-lab', category: 'Autonomous & Generative AI', pitch: 'Cognitive state-machine and NPC brain generator' },
  { id: 18, name: 'automata-game-studio', category: 'Autonomous & Generative AI', pitch: 'Self-assembling game systems and step-by-step builders' },
  { id: 19, name: 'omni-game-matrix', category: 'Autonomous & Generative AI', pitch: 'Universal prompt adapter across Godot, Unity, Unreal and Web' },
  { id: 20, name: 'prompt-smith-engine', category: 'Autonomous & Generative AI', pitch: 'Engineered prompts calibrated with pass/fail rule auditors' },

  // Category 3: Retro Arcade, Indie & Pixel Forge
  { id: 21, name: 'pixel-foundry-ai', category: 'Retro Arcade & Pixel Forge', pitch: '16-bit aesthetic generation and retro game mechanics' },
  { id: 22, name: 'retro-byte-studio', category: 'Retro Arcade & Pixel Forge', pitch: 'Chiptune and sprite-infused game studio' },
  { id: 23, name: 'arcade-alchemist', category: 'Retro Arcade & Pixel Forge', pitch: 'Transmuting classic arcade thrills into modern code' },
  { id: 24, name: 'quantum-arcade', category: 'Retro Arcade & Pixel Forge', pitch: 'Next-gen retro mechanics with local LLM speed' },
  { id: 25, name: 'neo-geo-lab', category: 'Retro Arcade & Pixel Forge', pitch: 'Hardcore arcade cabinet design meets AI speed' },
  { id: 26, name: 'bit-craft-engine', category: 'Retro Arcade & Pixel Forge', pitch: 'Micro-games, roguelikes, and grid-based level generation' },
  { id: 27, name: 'chiptune-domain', category: 'Retro Arcade & Pixel Forge', pitch: 'Harmonizing sound identity with fast gameplay loops' },
  { id: 28, name: 'glitch-forge', category: 'Retro Arcade & Pixel Forge', pitch: 'Experimental mechanics and hyper-stylish indie titles' },
  { id: 29, name: 'poly-vault-studio', category: 'Retro Arcade & Pixel Forge', pitch: 'Low-poly 3D aesthetics and snappy controls' },
  { id: 30, name: 'raster-nexus', category: 'Retro Arcade & Pixel Forge', pitch: 'Retro shader and procedural level synthesizer' },

  // Category 4: High-Fantasy & World-Building
  { id: 31, name: 'realm-weaver-ai', category: 'High-Fantasy & World-Building', pitch: 'Expansive lore, dialogue matrices, and RPG quest generation' },
  { id: 32, name: 'world-seed-studio', category: 'High-Fantasy & World-Building', pitch: 'Procedural world generation and biome architectures' },
  { id: 33, name: 'mythic-matrix', category: 'High-Fantasy & World-Building', pitch: 'Mythological narrative engines and ARPG combat tuning' },
  { id: 34, name: 'titan-forge-games', category: 'High-Fantasy & World-Building', pitch: 'Heavy combat, boss phases, and Souls-like encounter design' },
  { id: 35, name: 'valkyrie-lab', category: 'High-Fantasy & World-Building', pitch: 'Aerial combat, platformers, and celestial aesthetics' },
  { id: 36, name: 'aether-game-studio', category: 'High-Fantasy & World-Building', pitch: 'Atmospheric exploration and dynamic audio landscapes' },
  { id: 37, name: 'grimoire-engine', category: 'High-Fantasy & World-Building', pitch: 'Magic systems, spell synergies, and elemental interactions' },
  { id: 38, name: 'runic-craft-ai', category: 'High-Fantasy & World-Building', pitch: 'Symbolic game design and deep progression trees' },
  { id: 39, name: 'infinite-realms-lab', category: 'High-Fantasy & World-Building', pitch: 'Endless open world and dungeon crawler blueprints' },
  { id: 40, name: 'chronicle-forge', category: 'High-Fantasy & World-Building', pitch: 'Branching narrative game books and dialog trees' },

  // Category 5: Minimalist, Developer Sandbox & Studio Tools
  { id: 41, name: 'vibe-coder-pro', category: 'Developer Sandbox & Tooling', pitch: 'Professional workspace for AI-assisted game developers' },
  { id: 42, name: 'game-craft-console', category: 'Developer Sandbox & Tooling', pitch: 'Command-line and GUI hybrid for rapid game shipping' },
  { id: 43, name: 'zero-gravity-studio', category: 'Developer Sandbox & Tooling', pitch: 'Weightless coding with zero bloat and zero dependencies' },
  { id: 44, name: 'code-vibe-studio', category: 'Developer Sandbox & Tooling', pitch: 'Fluid game dev loop with multi-model verification' },
  { id: 45, name: 'ai-ludology-lab', category: 'Developer Sandbox & Tooling', pitch: 'Scientific analysis of gameplay loops, pacing, and retention' },
  { id: 46, name: 'dream-craft-ai', category: 'Developer Sandbox & Tooling', pitch: 'Lucid game prototyping from idea to Steam release' },
  { id: 47, name: 'sandbox-prime', category: 'Developer Sandbox & Tooling', pitch: 'High-performance experimental game sandbox' },
  { id: 48, name: 'play-forge-ai', category: 'Developer Sandbox & Tooling', pitch: 'Instant playability with automated rule verification' },
  { id: 49, name: 'game-smith-matrix', category: 'Developer Sandbox & Tooling', pitch: 'Architectural blueprints for any 2D or 3D engine' },
  { id: 50, name: 'ludus-architect', category: 'Developer Sandbox & Tooling', pitch: 'Master architect for game mechanics and rule systems' }
];

const COLORS = {
  reset: '\x1b[0m',
  gold: '\x1b[38;2;212;174;69m',
  goldBright: '\x1b[38;2;255;226;138m',
  cyan: '\x1b[38;2;111;211;255m',
  blue: '\x1b[38;2;31;120;224m',
  green: '\x1b[38;2;65;224;96m',
  red: '\x1b[38;2;255;74;61m',
  dim: '\x1b[38;2;95;126;168m',
  bold: '\x1b[1m'
};

function banner() {
  console.log(`
${COLORS.gold}╔═══════════════════════════════════════════════════════════════════════════════════════╗
║   ${COLORS.goldBright}★ AI GAME STUDIO // DEV CONSOLE WIZARD & REPOSITORY AUTOMATION ★${COLORS.gold}                 ║
║   ${COLORS.cyan}Protocol: Protoss Command Deck // Zero-Dependency Vibe-Coding Platform${COLORS.gold}             ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝${COLORS.reset}
`);
}

function sh(cmd, args = [], cwd = PROJECT_ROOT) {
  try {
    const res = spawnSync(cmd, args, { cwd, encoding: 'utf8', windowsHide: true });
    return { ok: res.status === 0, out: (res.stdout || '').trim(), err: (res.stderr || '').trim(), code: res.status };
  } catch (e) {
    return { ok: false, out: '', err: e.message, code: -1 };
  }
}

// 1. Diagnostics & Tool Detection
function getDiagnostics() {
  const diag = {
    os: `${os.type()} ${os.release()} (${os.arch()})`,
    node: process.version,
    cpu: os.cpus()[0]?.model || 'Unknown CPU',
    cores: os.cpus().length,
    ramGB: +(os.totalmem() / 2 ** 30).toFixed(1),
    ramFreeGB: +(os.freemem() / 2 ** 30).toFixed(1),
    git: null,
    gh: null,
    hardwareGpu: null
  };

  // Git check
  const gitCheck = sh('git', ['--version']);
  diag.git = gitCheck.ok ? { installed: true, version: gitCheck.out.replace('git version ', '') } : { installed: false };

  // GitHub CLI check
  const ghCheck = sh('gh', ['--version']);
  if (ghCheck.ok) {
    const authCheck = sh('gh', ['auth', 'status']);
    const userCheck = sh('gh', ['api', 'user', '--jq', '.login']);
    diag.gh = {
      installed: true,
      loggedIn: authCheck.ok || /Logged in to/.test(authCheck.err + authCheck.out),
      user: userCheck.ok ? userCheck.out : null
    };
  } else {
    diag.gh = { installed: false, loggedIn: false, user: null };
  }

  // GPU check (nvidia-smi if available)
  const smi = sh('nvidia-smi', ['--query-gpu=name,memory.total,memory.free', '--format=csv,noheader,nounits']);
  if (smi.ok && smi.out) {
    const parts = smi.out.split('\n')[0].split(',').map(s => s.trim());
    if (parts.length >= 3) {
      diag.hardwareGpu = {
        name: parts[0],
        totalVramGB: +(parts[1] / 1024).toFixed(1),
        freeVramGB: +(parts[2] / 1024).toFixed(1)
      };
    }
  }

  return diag;
}

// 2. Security & Vulnerability Scan
function runSecurityAudit() {
  const issues = [];
  const serverPath = path.join(PROJECT_ROOT, 'server', 'server.js');
  const repoPath = path.join(PROJECT_ROOT, 'server', 'repo.js');

  const serverCode = fs.existsSync(serverPath) ? fs.readFileSync(serverPath, 'utf8') : '';
  const repoCode = fs.existsSync(repoPath) ? fs.readFileSync(repoPath, 'utf8') : '';

  // Check 1: Path Traversal Guard in Ollama Tools
  if (!serverCode.includes('path.relative(dir,') || !serverCode.includes('Unsafe path')) {
    issues.push({
      id: 'SEC-01',
      severity: 'HIGH',
      title: 'Path Traversal Vulnerability in Ollama Tool Execution',
      desc: 'ollamaTool read_file/write_file resolved path without verifying it remains bounded inside the workspace directory.',
      remediation: 'Bound paths with path.relative(dir, target) and reject paths starting with .. or absolute paths.'
    });
  }

  // Check 2: Git Config Injection in Commit Operations
  if (repoCode.includes("user.name=' + (b.user") || repoCode.includes('user.name=" + (b.user')) {
    issues.push({
      id: 'SEC-02',
      severity: 'MEDIUM',
      title: 'Git Config Directive Injection via unescaped -c parameters',
      desc: 'User-provided name and email parameters were directly concatenated into git -c options without sanitization.',
      remediation: 'Sanitize user.name and user.email to strip newlines, null bytes, and non-identifier characters.'
    });
  }

  // Check 3: Web Origin Header Validation
  if (serverCode.includes('origin && origin !== `http://127.0.0.1:${PORT}`')) {
    issues.push({
      id: 'SEC-03',
      severity: 'LOW',
      title: 'Permissive Origin Header Check (Empty Origin Bypass)',
      desc: 'When Origin header is omitted (e.g. some form navigations), check could evaluate as non-forbidden without strict Host validation.',
      remediation: 'Enforce strict 127.0.0.1 Host header checks and validate Origin when present.'
    });
  }

  // Check 4: Plaintext API Key & Token Storage
  const keysPath = path.join(process.env.LOCALAPPDATA || os.tmpdir(), 'QueensDomainLab', 'keys.json');
  if (fs.existsSync(keysPath)) {
    issues.push({
      id: 'SEC-04',
      severity: 'INFO',
      title: 'Plaintext API Key Storage on Local Disk',
      desc: `Keys stored at ${keysPath}. While file permissions restrict read access to the current Windows user, OS-level DPAPI encryption provides stronger defense-in-depth.`,
      remediation: 'Adopt Windows DPAPI (Data Protection API) for encrypting stored provider keys.'
    });
  }

  return issues;
}

// 3. Test Runner Execution
function runTests() {
  const testScript = path.join(PROJECT_ROOT, 'tests', 'run.js');
  if (!fs.existsSync(testScript)) {
    return { ok: false, output: 'tests/run.js not found' };
  }
  const res = sh('node', [testScript]);
  return {
    ok: res.ok,
    output: res.out || res.err,
    allPassed: res.ok && !/FAIL/.test(res.out)
  };
}

// 4. Auto-Repo Creation & Upload Engine
async function uploadToGithub(repoName, isPrivate = true, description = 'AI Game Studio - Autonomous Vibe-Coding Platform') {
  console.log(`${COLORS.cyan}▸ Target Repository:${COLORS.reset} ${repoName}`);
  console.log(`${COLORS.cyan}▸ Visibility:${COLORS.reset} ${isPrivate ? 'Private' : 'Public'}`);

  const diag = getDiagnostics();
  if (!diag.git?.installed) throw new Error('Git is not installed on this system.');
  if (!diag.gh?.installed) throw new Error('GitHub CLI (gh) is not installed on this system.');
  if (!diag.gh?.loggedIn) throw new Error('GitHub CLI is not signed in. Run: gh auth login');

  console.log(`${COLORS.green}✔ GitHub CLI Authenticated as:${COLORS.reset} ${diag.gh.user}`);

  // Check if .git exists in PROJECT_ROOT
  const hasGit = fs.existsSync(path.join(PROJECT_ROOT, '.git'));
  if (!hasGit) {
    console.log(`${COLORS.gold}▸ Initializing Git repository in:${COLORS.reset} ${PROJECT_ROOT}`);
    const initRes = sh('git', ['init', '-b', 'main'], PROJECT_ROOT);
    if (!initRes.ok) throw new Error('Git init failed: ' + initRes.err);
  } else {
    console.log(`${COLORS.green}✔ Git repository already initialized.${COLORS.reset}`);
  }

  // Check user name / email
  const nameCheck = sh('git', ['config', 'user.name'], PROJECT_ROOT);
  if (!nameCheck.ok || !nameCheck.out) {
    sh('git', ['config', 'user.name', 'AI Game Studio Dev'], PROJECT_ROOT);
    sh('git', ['config', 'user.email', 'lab@localhost'], PROJECT_ROOT);
  }

  // Ensure .gitignore exists
  const gitignorePath = path.join(PROJECT_ROOT, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    const defaultIgnore = `# Secrets\n.env\n.env.*\n*.pem\n*.key\n*.pfx\n*.token\nsecrets.*\ncredentials*.json\nkeys.json\n# OS & Logs\nnode_modules/\nThumbs.db\n.DS_Store\n*.log\n`;
    fs.writeFileSync(gitignorePath, defaultIgnore, 'utf8');
  }

  // Stage files
  console.log(`${COLORS.cyan}▸ Staging project files...${COLORS.reset}`);
  const addRes = sh('git', ['add', '-A'], PROJECT_ROOT);
  if (!addRes.ok) throw new Error('Git add failed: ' + addRes.err);

  // Commit if changes exist
  const statusRes = sh('git', ['status', '--porcelain'], PROJECT_ROOT);
  if (statusRes.out.trim()) {
    console.log(`${COLORS.cyan}▸ Creating commit...${COLORS.reset}`);
    const commitRes = sh('git', ['commit', '-m', `feat: Initial AI Game Studio release (${repoName})`], PROJECT_ROOT);
    if (!commitRes.ok) console.log(`${COLORS.dim}Notice: Commit returned code ${commitRes.code}: ${commitRes.err || commitRes.out}${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}✔ Worktree clean. Nothing new to commit.${COLORS.reset}`);
  }

  // Check remote
  const remoteRes = sh('git', ['remote', 'get-url', 'origin'], PROJECT_ROOT);
  const user = diag.gh.user;
  const targetUrl = `https://github.com/${user}/${repoName}`;

  if (!remoteRes.ok || !remoteRes.out) {
    console.log(`${COLORS.cyan}▸ Creating remote repository on GitHub via gh CLI...${COLORS.reset}`);
    const ghArgs = [
      'repo', 'create', repoName,
      isPrivate ? '--private' : '--public',
      '--source', '.',
      '--remote', 'origin',
      '--description', description
    ];
    const ghCreateRes = sh('gh', ghArgs, PROJECT_ROOT);
    if (!ghCreateRes.ok) {
      if (/already exists/i.test(ghCreateRes.err + ghCreateRes.out)) {
        console.log(`${COLORS.gold}Notice: Remote repo '${repoName}' already exists. Linking remote...${COLORS.reset}`);
        sh('git', ['remote', 'add', 'origin', targetUrl], PROJECT_ROOT);
      } else {
        throw new Error('GitHub repo creation failed: ' + (ghCreateRes.err || ghCreateRes.out));
      }
    }
  }

  // Push to main
  console.log(`${COLORS.cyan}▸ Pushing to origin main...${COLORS.reset}`);
  const pushRes = sh('git', ['push', '-u', 'origin', 'HEAD:main'], PROJECT_ROOT);
  if (!pushRes.ok) {
    if (/fetch first|non-fast-forward/i.test(pushRes.err + pushRes.out)) {
      console.log(`${COLORS.gold}Notice: Remote has existing history. Pulling with rebase...${COLORS.reset}`);
      sh('git', ['pull', '--rebase', 'origin', 'main'], PROJECT_ROOT);
      const push2 = sh('git', ['push', '-u', 'origin', 'HEAD:main'], PROJECT_ROOT);
      if (!push2.ok) throw new Error('Git push failed: ' + (push2.err || push2.out));
    } else {
      throw new Error('Git push failed: ' + (pushRes.err || pushRes.out));
    }
  }

  return {
    ok: true,
    url: targetUrl,
    repoName,
    user
  };
}

// 5. Interactive or Command-Line Execution
async function main() {
  banner();
  const args = process.argv.slice(2);
  const diag = getDiagnostics();

  // Print System Telemetry
  console.log(`${COLORS.goldBright}┌── SYSTEM TELEMETRY ────────────────────────────────────────────────────────┐${COLORS.reset}`);
  console.log(`│ ${COLORS.dim}Platform:${COLORS.reset}  ${diag.os.padEnd(65)} │`);
  console.log(`│ ${COLORS.dim}Node.js:${COLORS.reset}   ${diag.node.padEnd(65)} │`);
  console.log(`│ ${COLORS.dim}Hardware:${COLORS.reset}  ${(diag.cpu + ' (' + diag.cores + ' threads)').slice(0, 65).padEnd(65)} │`);
  console.log(`│ ${COLORS.dim}RAM:${COLORS.reset}       ${(diag.ramGB + ' GB Total / ' + diag.ramFreeGB + ' GB Free').padEnd(65)} │`);
  if (diag.hardwareGpu) {
    console.log(`│ ${COLORS.dim}GPU:${COLORS.reset}       ${(diag.hardwareGpu.name + ' [' + diag.hardwareGpu.totalVramGB + ' GB VRAM]').padEnd(65)} │`);
  }
  console.log(`│ ${COLORS.dim}Git:${COLORS.reset}       ${(diag.git?.installed ? 'v' + diag.git.version : 'NOT INSTALLED').padEnd(65)} │`);
  console.log(`│ ${COLORS.dim}GitHub:${COLORS.reset}    ${(diag.gh?.installed ? (diag.gh.loggedIn ? 'Logged in as @' + diag.gh.user : 'Installed, but not logged in') : 'NOT INSTALLED').padEnd(65)} │`);
  console.log(`${COLORS.goldBright}└────────────────────────────────────────────────────────────────────────────┘${COLORS.reset}\n`);

  // Flag handlers
  if (args.includes('--names') || args.includes('--list-names')) {
    console.log(`${COLORS.goldBright}★ 50 CURATED REPOSITORY NAMES FOR AI GAME STUDIO ★${COLORS.reset}\n`);
    let curCat = '';
    REPO_CATALOG.forEach(r => {
      if (r.category !== curCat) {
        curCat = r.category;
        console.log(`\n${COLORS.gold}[ ${curCat.toUpperCase()} ]${COLORS.reset}`);
      }
      const num = String(r.id).padStart(2, '0');
      const tag = r.id === 1 ? ` ${COLORS.green}(RECOMMENDED)${COLORS.reset}` : '';
      console.log(`  ${COLORS.cyan}${num}.${COLORS.reset} ${COLORS.bold}${r.name.padEnd(25)}${COLORS.reset}${tag} - ${COLORS.dim}${r.pitch}${COLORS.reset}`);
    });
    console.log('\n');
    return;
  }

  if (args.includes('--audit') || args.includes('--security-only')) {
    console.log(`${COLORS.goldBright}★ SECURITY FLAW AUDIT & HARDENING VERIFICATION ★${COLORS.reset}\n`);
    const issues = runSecurityAudit();
    if (!issues.length) {
      console.log(`${COLORS.green}✔ All security hardening checks passed! No known critical flaws found.${COLORS.reset}\n`);
    } else {
      issues.forEach(i => {
        const col = i.severity === 'HIGH' ? COLORS.red : i.severity === 'MEDIUM' ? COLORS.gold : COLORS.cyan;
        console.log(`${col}[${i.severity}] ${i.id}: ${i.title}${COLORS.reset}`);
        console.log(`  ${COLORS.dim}Detail:${COLORS.reset} ${i.desc}`);
        console.log(`  ${COLORS.green}Fix:${COLORS.reset}    ${i.remediation}\n`);
      });
    }
    return;
  }

  if (args.includes('--test') || args.includes('--check')) {
    console.log(`${COLORS.cyan}▸ Executing project test suite...${COLORS.reset}`);
    const t = runTests();
    console.log(t.output);
    console.log(t.allPassed ? `${COLORS.green}✔ ALL INVARIANTS PASS${COLORS.reset}` : `${COLORS.red}✖ TEST FAILURES DETECTED${COLORS.reset}`);
    return;
  }

  // Auto upload handler
  const autoMode = args.includes('--auto');
  const repoArg = (args.find(a => a.startsWith('--repo=')) || '').split('=')[1] || 'ai-game-studio';
  const isPublic = args.includes('--public');
  const isPrivate = !isPublic;

  if (autoMode) {
    console.log(`${COLORS.goldBright}★ AUTO-REPO UPLOAD MODE ACTIVATED ★${COLORS.reset}\n`);
    // Pre-flight tests
    console.log(`${COLORS.cyan}▸ Running pre-flight invariant tests...${COLORS.reset}`);
    const t = runTests();
    if (!t.allPassed) {
      console.log(`${COLORS.red}✖ Pre-flight test check failed! Aborting auto-upload for safety.${COLORS.reset}`);
      console.log(t.output);
      process.exit(1);
    }
    console.log(`${COLORS.green}✔ Pre-flight tests passed.${COLORS.reset}\n`);

    try {
      const res = await uploadToGithub(repoArg, isPrivate);
      console.log(`\n${COLORS.goldBright}╔═══════════════════════════════════════════════════════════════════════════════════════╗${COLORS.reset}`);
      console.log(`${COLORS.goldBright}║  ${COLORS.green}✔ REPOSITORY SUCCESSFULLY CREATED & SYNCHRONIZED TO GITHUB!${COLORS.goldBright}                  ║${COLORS.reset}`);
      console.log(`${COLORS.goldBright}║  ${COLORS.cyan}URL:${COLORS.reset} ${res.url.padEnd(76)} ${COLORS.goldBright}║${COLORS.reset}`);
      console.log(`${COLORS.goldBright}╚═══════════════════════════════════════════════════════════════════════════════════════╝${COLORS.reset}\n`);
    } catch (e) {
      console.error(`${COLORS.red}✖ Upload failed:${COLORS.reset}`, e.message);
      process.exit(1);
    }
    return;
  }

  // Interactive guidance
  console.log(`${COLORS.cyan}Dev Console Wizard Options:${COLORS.reset}`);
  console.log(`  1. Run Auto-Upload to GitHub (${COLORS.bold}ai-game-studio${COLORS.reset})`);
  console.log(`  2. Browse 50 Curated Repository Names`);
  console.log(`  3. Run Invariant Test Suite`);
  console.log(`  4. Run Security Vulnerability Audit`);
  console.log(`  5. Exit\n`);

  console.log(`${COLORS.dim}Run non-interactively:${COLORS.reset}`);
  console.log(`  node scripts/dev-console-wizard.js --auto --repo=ai-game-studio`);
  console.log(`  node scripts/dev-console-wizard.js --names`);
  console.log(`  node scripts/dev-console-wizard.js --audit`);
  console.log(`  node scripts/dev-console-wizard.js --test\n`);
}

module.exports = {
  REPO_CATALOG,
  getDiagnostics,
  runSecurityAudit,
  runTests,
  uploadToGithub
};

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
