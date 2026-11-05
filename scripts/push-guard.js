const cp = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Read identity from environment or git config
const assignedRole = process.env.COLLAB_ROLE || process.argv[2] || '';

if (!assignedRole) {
  console.log('Push guard: No COLLAB_ROLE specified. Pass "Dirkei" or "Marloo".');
  process.exit(0);
}

const role = assignedRole.toLowerCase();
const allowedPrefix = role === 'dirkei' ? 'Dirkei/' : role === 'marloo' ? 'Marloo/' : '';

if (!allowedPrefix) {
  console.error(`Invalid role: ${assignedRole}. Must be "Dirkei" or "Marloo".`);
  process.exit(1);
}

// Get changed files compared to origin/main or HEAD
let changedFiles = [];
try {
  const diffOutput = cp.execSync('git diff --name-only origin/main HEAD', { cwd: rootDir, stdio: 'pipe' }).toString();
  changedFiles = diffOutput.split('\n').map(s => s.trim()).filter(Boolean);
} catch (e) {
  try {
    const diffCached = cp.execSync('git diff --cached --name-only', { cwd: rootDir, stdio: 'pipe' }).toString();
    changedFiles = diffCached.split('\n').map(s => s.trim()).filter(Boolean);
  } catch (err) {
    changedFiles = [];
  }
}

const violations = changedFiles.filter(file => !file.startsWith(allowedPrefix));

if (violations.length > 0) {
  console.error('===================================================');
  console.error(`   ❌ PUSH REJECTED: FOLDER ISOLATION VIOLATION`);
  console.error('===================================================');
  console.error(`Role "${assignedRole}" is restricted strictly to "${allowedPrefix}".`);
  console.error('The following files are outside your allowed directory:');
  violations.forEach(v => console.error(`  - ${v}`));
  console.error('\nPlease unstage or discard modifications outside your assigned folder.');
  process.exit(1);
}

console.log(`✔ Push guard passed: All ${changedFiles.length} modified files are within ${allowedPrefix}`);
process.exit(0);
