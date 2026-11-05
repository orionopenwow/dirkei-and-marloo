// Runs repo.js against a throwaway home folder. Prints one JSON line per check: {n, ok}.
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qdrepo-'));
process.env.USERPROFILE = tmp; process.env.HOME = tmp;
const R = require('../server/repo'), out = [], ok = (n, v) => out.push({ n, ok: !!v });
(async () => {
  const t = await R.tools();
  if (!t.git.installed) { out.push({ n: 'repo: git missing, checks skipped', ok: true }); return; }
  const j = await R.init({ name: 'Ember Hollow', platform: 'unity', pitch: 'cave game', license: 'mit' });
  const g = f => fs.existsSync(path.join(j.folder, f));
  ok('repo: init makes git, README, MIT licence, Unity ignore, LFS attributes', g('.git') && g('README.md') && g('LICENSE') && /Library\//.test(fs.readFileSync(path.join(j.folder, '.gitignore'), 'utf8')) && g('.gitattributes') && j.folder.startsWith(R.ROOT));
  ok('repo: first commit exists', (await R.info({ folder: j.folder })).commits.length === 1);
  fs.writeFileSync(path.join(j.folder, '.gitignore'), ''); /* even with the ignore file emptied, the guard must hold */ fs.writeFileSync(path.join(j.folder, 'game.cs'), 'x'); fs.writeFileSync(path.join(j.folder, '.env'), 'KEY=1');
  ok('repo: info lists changed files', (await R.info({ folder: j.folder })).changed.length >= 1);
  const c = await R.commit({ folder: j.folder, message: 'add game' });
  ok('repo: commit keeps game.cs and refuses .env', c.skipped.includes('.env') && (await R.info({ folder: j.folder })).commits.length === 2);
  ok('repo: .env never entered history', !require('child_process').execFileSync('git', ['log', '--all', '--name-only', '--format='], { cwd: j.folder }).toString().includes('.env'));
  ok('repo: empty message refused', await R.commit({ folder: j.folder, message: ' ' }).then(() => false, () => true));
  ok('repo: nothing changed refused', await R.commit({ folder: j.folder, message: 'again' }).then(() => false, () => true));
  const a = await R.init({ name: 'x', platform: 'unity', folder: j.folder });
  ok('repo: adopting an existing repo keeps its history', a.adopted && (await R.info({ folder: j.folder })).commits.length === 2);
  ok('repo: folder outside home refused', await R.info({ folder: path.join(path.parse(tmp).root, 'Windows') }).then(() => false, () => true));
  ok('repo: push without a GitHub repo refused', await R.push({ folder: j.folder }).then(() => false, e => /No GitHub repo/.test(e.message)));
  ok('repo: bad GitHub name refused', await R.ghCreate({ folder: j.folder, repo: 'a b;c' }).then(() => false, e => /Repo name/.test(e.message)));
})().catch(e => out.push({ n: 'repo: crashed ' + e.message, ok: false })).finally(() => { console.log(JSON.stringify(out)); try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { } });
