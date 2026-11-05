// scripts/build-release.js - Compiles QueensDomain.exe, builds QueensDomain-v1.0.0-windows-x64.zip, and publishes to GitHub
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = 'v' + (pkg.version || '1.0.0');

console.log('===================================================');
console.log(`   QUEEN\'S DOMAIN // RELEASE BUILDER (${version})`);
console.log('===================================================');

// 1. Build QueensDomain.exe
console.log('\n[1/4] Compiling native QueensDomain.exe launcher...');
execFileSync(process.execPath, [path.join(root, 'scripts', 'build-exe.js')], { stdio: 'inherit', cwd: root });

// 2. Prepare staging directory for release zip
console.log('\n[2/4] Packaging QueensDomain release archive...');
const distDir = path.join(root, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

const zipName = `QueensDomain-${version}-windows-x64.zip`;
const zipPath = path.join(distDir, zipName);
const exePath = path.join(root, 'QueensDomain.exe');

const itemsToZip = [
  'QueensDomain.exe',
  'launch.bat',
  'package.json',
  'README.md',
  'app',
  'server',
  'scripts',
  'docs',
  'templates',
  'tests'
];

execFileSync('tar.exe', ['-a', '-c', '-f', zipPath, ...itemsToZip], { cwd: root, stdio: 'inherit' });
console.log(`✔ Created release archive: ${zipPath} (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(2)} MB)`);

// 3. Verify GitHub release status
console.log('\n[3/4] Checking GitHub release status on orionopenwow/queens-domain...');
let releaseExists = false;
try {
  execFileSync('gh', ['release', 'view', version], { cwd: root, stdio: 'pipe' });
  releaseExists = true;
  console.log(`Release ${version} already exists. Assets will be updated.`);
} catch {
  console.log(`Release ${version} will be created.`);
}

// 4. Create or update GitHub release
console.log('\n[4/4] Uploading release assets to GitHub...');
const notes = `## Queen's Domain Architecture Engine ${version}
Autonomous Vibe-Coding Platform & Game Blueprint Synthesizer

### Downloads
- **\`QueensDomain.exe\`**: Standalone 1-click Windows native launcher (No black console window, auto-launches local engine and browser app).
- **\`${zipName}\`**: Complete standalone distribution package (Zero npm dependencies required).

### Highlights in this Release
- **Sleek Glassmorphic Console UI**: Interactive range sliders and tactile toggle buttons replace walls of text.
- **Chrome Developer Mode for Spawn.co**: 1-click launch with prompt automatically copied and Chrome DevTools pre-docked.
- **Isolated Asset Sheet Studio**: Modular Kenney CC0 sprite sheets, 3D kits, and audio packs with dynamic prompt injection.
- **12-Rule Code Auditor**: Instant verification against state leaks, memory bounds, and prompt drift.
- **PC Hardware Benchmark Gauge**: Real-time evaluation of local GPU/RAM limits vs. game engine and local LLM requirements.`;

try {
  if (releaseExists) {
    execFileSync('gh', ['release', 'upload', version, zipPath, exePath, '--clobber'], { cwd: root, stdio: 'inherit' });
    console.log(`✔ Updated release assets on ${version}.`);
  } else {
    execFileSync('gh', [
      'release', 'create', version,
      zipPath, exePath,
      '--title', `QueensDomain ${version} - Autonomous AI Game Studio`,
      '--notes', notes
    ], { cwd: root, stdio: 'inherit' });
    console.log(`✔ Published new GitHub release ${version}!`);
  }
} catch (e) {
  console.error('✖ GitHub release upload failed:', e.message);
  process.exit(1);
}

console.log('\n===================================================');
console.log(`   RELEASE ${version} PUBLISHED SUCCESSFULLY`);
console.log('===================================================');
