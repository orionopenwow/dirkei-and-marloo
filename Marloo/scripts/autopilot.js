// scripts/autopilot.js - Automated milestone test, commit, push & release engine
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const msg = process.argv.slice(2).join(' ') || `milestone: Automated concept update [${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`;

console.log('===================================================');
console.log('   QUEEN\'S DOMAIN // AUTOPILOT MILESTONE SYNC');
console.log('===================================================');
console.log('Milestone Message:', msg);

// 1. Run Tests
console.log('\n[1/3] Running Project Invariant Test Suite...');
try {
  execFileSync(process.execPath, [path.join(root, 'tests', 'run.js')], { stdio: 'inherit', cwd: root });
  console.log('✔ All test invariants passed.');
} catch (e) {
  console.error('✖ Test suite failed! Autopilot aborted.');
  process.exit(1);
}

// 2. Stage and Commit
console.log('\n[2/3] Staging changes and creating git commit...');
try {
  execFileSync('git', ['add', '-A'], { cwd: root, stdio: 'inherit' });
  const status = execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim();
  if (!status) {
    console.log('Nothing new to commit. Working tree already clean.');
  } else {
    execFileSync('git', ['commit', '-m', msg], { cwd: root, stdio: 'inherit' });
    console.log('✔ Commit recorded successfully.');
  }
} catch (e) {
  console.error('✖ Git commit failed:', e.message);
  process.exit(1);
}

// 3. Push to GitHub
console.log('\n[3/3] Pushing to GitHub (orionopenwow/queens-domain)...');
try {
  execFileSync('git', ['push', 'origin', 'main'], { cwd: root, stdio: 'inherit' });
  console.log('✔ Pushed to GitHub main successfully.');
} catch (e) {
  console.error('✖ Git push failed:', e.message);
  process.exit(1);
}

console.log('\n===================================================');
console.log('   AUTOPILOT MILESTONE COMPLETED SUCCESSFULLY');
console.log('===================================================');
