const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const dirkeiDir = path.join(rootDir, 'Dirkei');
const marlooDir = path.join(rootDir, 'Marloo');

function getFiles(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === '.git' || file === 'node_modules') continue;
    const fullPath = path.join(dir, file);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, baseDir));
    } else {
      results.push({ relPath, fullPath, size: stat.size, mtime: stat.mtime });
    }
  }
  return results;
}

function runGit(args, cwd = rootDir) {
  try {
    return cp.execSync('git ' + args, { cwd, stdio: 'pipe' }).toString().trim();
  } catch (e) {
    return '';
  }
}

function analyzeFeatures(dir) {
  const features = [];
  const indexPath = path.join(dir, 'app', 'index.html');
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, 'utf8');
    if (html.includes('zen-hero-square') || html.includes('dec-query')) features.push({ id: 'prompt-gen', name: 'AI Game Prompt Generator', tag: 'Core' });
    if (html.includes('zen-drop-zone') || html.includes('handleInspirationFile')) features.push({ id: 'drop-detect', name: 'Drag & Drop Inspiration Detection (.glb/images/audio)', tag: 'Inspiration' });
    if (html.includes('forest_bg.svg')) features.push({ id: 'forest-theme', name: 'Atmospheric Forest Backdrop & Glassmorphism', tag: 'Visuals' });
    if (html.includes('insp-spark-pill')) features.push({ id: 'sparks', name: 'Instant Inspiration Spark Pills', tag: 'UX' });
    if (html.includes('Created Projects')) features.push({ id: 'created-projects', name: 'Created Projects Gallery with 1-Click Copy & Work', tag: 'Projects' });
    if (html.includes('Spawn.co') || html.includes('t-spawn')) features.push({ id: 'spawn-bridge', name: 'Spawn.co Savi WebGL Bridge', tag: 'Engine' });
    if (html.includes('Kenney Castle')) features.push({ id: 'cc0-assets', name: 'Curated CC0 Modular Asset Synthesizer', tag: 'Assets' });
    if (html.includes('Ponytail Zero-GC')) features.push({ id: 'ponytail', name: 'Ponytail Zero-GC 60Hz Deterministic Loop', tag: 'Architecture' });
  }
  return features;
}

function compareVersions() {
  const dirkeiFiles = getFiles(dirkeiDir);
  const marlooFiles = getFiles(marlooDir);

  const dMap = new Map(dirkeiFiles.map(f => [f.relPath, f]));
  const mMap = new Map(marlooFiles.map(f => [f.relPath, f]));

  const allRelPaths = new Set([...dMap.keys(), ...mMap.keys()]);
  
  const modified = [];
  const onlyInDirkei = [];
  const onlyInMarloo = [];
  const identical = [];

  for (const rel of allRelPaths) {
    const inD = dMap.has(rel);
    const inM = mMap.has(rel);

    if (inD && !inM) {
      onlyInDirkei.push(rel);
    } else if (!inD && inM) {
      onlyInMarloo.push(rel);
    } else {
      const fD = dMap.get(rel);
      const fM = mMap.get(rel);
      
      let isDifferent = false;
      if (fD.size !== fM.size) {
        isDifferent = true;
      } else {
        const bufD = fs.readFileSync(fD.fullPath);
        const bufM = fs.readFileSync(fM.fullPath);
        if (!bufD.equals(bufM)) isDifferent = true;
      }

      if (isDifferent) {
        modified.push({
          file: rel,
          dirkeiSize: fD.size,
          marlooSize: fM.size,
          diffSize: fD.size - fM.size
        });
      } else {
        identical.push(rel);
      }
    }
  }

  // Feature scanning
  const dirkeiFeatures = analyzeFeatures(dirkeiDir);
  const marlooFeatures = analyzeFeatures(marlooDir);

  // Suggested features (cross-pollination)
  const dFeatIds = new Set(dirkeiFeatures.map(f => f.id));
  const mFeatIds = new Set(marlooFeatures.map(f => f.id));

  const suggestionsForDirkei = marlooFeatures
    .filter(f => !dFeatIds.has(f.id))
    .map(f => ({ feature: f.name, source: 'Marloo', rationale: 'Present in Marloo but missing in Dirkei' }));

  const suggestionsForMarloo = dirkeiFeatures
    .filter(f => !mFeatIds.has(f.id))
    .map(f => ({ feature: f.name, source: 'Dirkei', rationale: 'Present in Dirkei but missing in Marloo' }));

  // Pull / Git Status
  const latestCommit = runGit('log -1 --format="%h - %s (%cr) <%an>"');
  const dirkeiCommits = runGit('log -5 --oneline -- Dirkei');
  const marlooCommits = runGit('log -5 --oneline -- Marloo');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFilesDirkei: dirkeiFiles.length,
      totalFilesMarloo: marlooFiles.length,
      modifiedCount: modified.length,
      onlyInDirkeiCount: onlyInDirkei.length,
      onlyInMarlooCount: onlyInMarloo.length,
      identicalCount: identical.length
    },
    git: {
      latestCommit,
      dirkeiCommits: dirkeiCommits ? dirkeiCommits.split('\n') : [],
      marlooCommits: marlooCommits ? marlooCommits.split('\n') : []
    },
    differences: {
      modifiedFiles: modified,
      onlyInDirkei,
      onlyInMarloo
    },
    features: {
      dirkei: dirkeiFeatures,
      marloo: marlooFeatures
    },
    suggestions: {
      forDirkei: suggestionsForDirkei,
      forMarloo: suggestionsForMarloo
    }
  };

  const outPath = path.join(rootDir, 'console', 'diff-data.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log('===================================================');
  console.log('   DIRKEI & MARLOO // VERSION CONSOLIDATION REPORT');
  console.log('===================================================');
  console.log(`Modified Files: ${modified.length} | Dirkei-Only: ${onlyInDirkei.length} | Marloo-Only: ${onlyInMarloo.length}`);
  console.log(`Report written to: ${outPath}`);
  return report;
}

if (require.main === module) {
  compareVersions();
}

module.exports = { compareVersions };
