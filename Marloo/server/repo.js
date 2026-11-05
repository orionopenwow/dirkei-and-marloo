// Project folders, local git and GitHub for Queen's Domain Lab. No dependencies.
// Every folder must be inside the user's home folder and already a git repo (or be created here).
const fs = require('fs'), path = require('path'), os = require('os');
const { execFile, spawn } = require('child_process');
const HOME = os.homedir(), ROOT = path.join(HOME, 'QueensDomainLab-projects');

const run = (exe, args, cwd) => new Promise((res, rej) => execFile(exe, args, { cwd, windowsHide: true, timeout: 120000, maxBuffer: 1e7, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } },
  (e, o, er) => e ? rej(new Error(String(er || o || e.message).trim().slice(0, 600))) : res(String(o).trim())));
const ghExe = () => { for (const p of [path.join(process.env.ProgramFiles || 'C:\\Program Files', 'GitHub CLI', 'gh.exe')]) if (fs.existsSync(p)) return p; return 'gh'; };
const slug = s => String(s || 'game').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'game';
const cleanUser = s => String(s || '').replace(/[\r\n\0;`$]/g, '').trim().slice(0, 80);

// secrets and build output that must never be committed, plus what each platform generates on its own
const BASE = '# secrets: never commit these\n.env\n.env.*\n*.pem\n*.key\n*.pfx\n*.token\nsecrets.*\ncredentials*.json\n# OS junk\nThumbs.db\n.DS_Store\n';
const IGN = {
  unity: 'Library/\nTemp/\nObj/\nLogs/\nUserSettings/\nBuilds/\nMemoryCaptures/\n.vs/\n*.csproj\n*.sln\n*.pidb\n',
  godot: '.godot/\n.mono/\nexport_presets.cfg\n*.translation\nbuild/\n',
  unreal: 'Binaries/\nIntermediate/\nSaved/\nDerivedDataCache/\nBuild/\n.vs/\n*.sln\n',
  roblox: 'Packages/\nServerPackages/\n*.lock\nsourcemap.json\n',
  gamemaker: '*.resource_order.bak\noutput/\n.vs/\n',
  phaser: 'node_modules/\ndist/\n.vite/\n*.log\n',
  three: 'node_modules/\ndist/\n.vite/\n*.log\n',
  construct: 'exports/\n',
};
// big binary files go through Git LFS (Unity and Unreal projects are full of them)
const LFS = 'psd fbx blend wav mp3 ogg png jpg tga tif exr hdr mp4 mov uasset umap'.split(' ').map(x => `*.${x} filter=lfs diff=lfs merge=lfs -text`).join('\n') + '\n';
const LICENSE = {
  mit: n => `MIT License\n\nCopyright (c) ${new Date().getFullYear()} ${n}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n`,
};

// the folder must exist inside the user's home and be a git repo
function repoDir(f) {
  const d = path.resolve(String(f || '')), rel = path.relative(HOME, d);
  if (!f || rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('The project folder must be inside your user folder');
  if (!fs.existsSync(path.join(d, '.git'))) throw new Error('That folder is not a git project yet (use Create project folder)');
  return d;
}

async function tools() {
  const t = {};
  try { t.git = { installed: true, version: (await run('git', ['--version'])).replace('git version ', '') }; } catch { t.git = { installed: false }; }
  try { await run(ghExe(), ['--version']); t.gh = { installed: true }; try { await run(ghExe(), ['auth', 'status']); t.gh.loggedIn = true; t.gh.user = await run(ghExe(), ['api', 'user', '--jq', '.login']).catch(() => ''); } catch { t.gh.loggedIn = false; } } catch { t.gh = { installed: false }; }
  return t;
}

// Make (or adopt) the project folder: git init, platform .gitignore, README, optional licence, first commit.
async function init(b) {
  const name = String(b.name || '').trim().slice(0, 80) || 'Untitled Game', platform = String(b.platform || ''), mit = b.license === 'mit';
  const dir = b.folder ? path.resolve(b.folder) : path.join(ROOT, slug(name));
  const rel = path.relative(HOME, dir);
  if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('The project folder must be inside your user folder');
  fs.mkdirSync(dir, { recursive: true });
  const had = fs.existsSync(path.join(dir, '.git')); // adopting a project that already has history: add nothing it already has
  if (!had) await run('git', ['init', '-b', 'main'], dir);
  const put = (f, text) => { const p = path.join(dir, f); if (!fs.existsSync(p)) { fs.writeFileSync(p, text); return true; } return false; };
  let made = put('.gitignore', BASE + (IGN[platform] || ''));
  if (['unity', 'unreal'].includes(platform) && put('.gitattributes', LFS)) { made = true; await run('git', ['lfs', 'install', '--local'], dir).catch(() => {}); }
  if (put('README.md', `# ${name}\n\n${String(b.pitch || '').slice(0, 300)}\n\nMade with Queen's Domain Lab.\n`)) made = true;
  if (mit && put('LICENSE', LICENSE.mit(name))) made = true;
  if (made || !had) {
    await run('git', ['add', '-A'], dir);
    await run('git', ['-c', "user.name=" + cleanUser(b.user || "Queen's Domain Lab"), '-c', 'user.email=' + cleanUser(b.email || 'lab@localhost'), 'commit', '-m', had ? 'Add project files from Queen\'s Domain Lab' : 'Start project'], dir).catch(e => { if (!/nothing to commit/i.test(e.message)) throw e; });
  }
  return { folder: dir, adopted: had };
}

const parse = s => s.split(/\r?\n/).filter(Boolean).map(l => { const [hash, date, ...r] = l.split('\t'); return { hash, date, subject: r.join('\t') }; });
async function info(b) {
  const dir = repoDir(b.folder), g = (...a) => run('git', a, dir);
  const branch = await g('rev-parse', '--abbrev-ref', 'HEAD').catch(() => 'main');
  const changed = (await g('status', '--porcelain')).split(/\r?\n/).filter(Boolean).map(l => l.slice(3)).slice(0, 200);
  const remote = await g('remote', 'get-url', 'origin').catch(() => '');
  const fmt = '--format=%h\t%ad\t%s';
  const all = parse(await g('log', '-30', '--date=short', fmt).catch(() => ''));
  const unpushed = remote ? parse(await g('log', '@{u}..HEAD', '--date=short', fmt).catch(async () => await g('log', '-30', '--date=short', fmt).catch(() => ''))) : all;
  return { folder: dir, branch, remote, changed, commits: all, unpushed: unpushed.map(x => x.hash) };
}

// Files that look like keys or tokens are taken back out of the commit instead of being saved.
const SECRET = /(^|\/)(\.env(\..*)?|[^/]*\.(pem|key|pfx)|[^/]*\.token|secrets?\.[a-z]+|tokens?\.(txt|json)|credentials[^/]*\.json)$/i;
async function commit(b) {
  const dir = repoDir(b.folder), g = (...a) => run('git', a, dir), msg = String(b.message || '').trim().slice(0, 500);
  if (!msg) throw new Error('Write a short message for the commit');
  await g('add', '-A');
  const staged = (await g('diff', '--cached', '--name-only')).split(/\r?\n/).filter(Boolean), bad = staged.filter(f => SECRET.test(f));
  for (const f of bad) await g('reset', '-q', 'HEAD', '--', f);
  if (staged.length === bad.length) throw new Error(bad.length ? 'Only secret-looking files changed, so nothing was saved: ' + bad.join(', ') : 'Nothing has changed since the last commit');
  await g('-c', "user.name=" + cleanUser(b.user || "Queen's Domain Lab"), '-c', 'user.email=' + cleanUser(b.email || 'lab@localhost'), 'commit', '-m', msg);
  return { skipped: bad };
}
async function push(b) {
  const dir = repoDir(b.folder);
  if (!(await run('git', ['remote', 'get-url', 'origin'], dir).catch(() => ''))) throw new Error('No GitHub repo is linked yet. Create one first.');
  await run('git', ['push', '-u', 'origin', 'HEAD'], dir);
  return {};
}
// create the GitHub repo from the local folder; does not push (pushing is its own, confirmed step)
async function ghCreate(b) {
  const dir = repoDir(b.folder), name = String(b.repo || '').trim();
  if (!/^[A-Za-z0-9._-]{1,100}$/.test(name)) throw new Error('Repo name: letters, numbers, dot, dash and underscore only');
  const t = await tools();
  if (!t.gh.installed) throw new Error('GitHub CLI is not installed yet (use Set up GitHub)');
  if (!t.gh.loggedIn) throw new Error('Sign in to GitHub first (use Sign in)');
  const out = await run(ghExe(), ['repo', 'create', name, b.private === false ? '--public' : '--private', '--source', '.', '--remote', 'origin', ...(b.desc ? ['--description', String(b.desc).slice(0, 300)] : [])], dir);
  return { url: out.split(/\s+/).find(x => /^https:\/\//.test(x)) || '' };
}
function openFolder(b) { spawn('explorer.exe', [repoDir(b.folder)], { detached: true, stdio: 'ignore' }).unref(); return {}; }
function ghLogin() { spawn('cmd', ['/c', 'start', '', ghExe(), 'auth', 'login', '--web', '--git-protocol', 'https'], { detached: true, stdio: 'ignore', windowsHide: false }).unref(); }

module.exports = { openFolder, tools, init, info, commit, push, ghCreate, ghLogin, ROOT, SECRET, slug, repoDir };
