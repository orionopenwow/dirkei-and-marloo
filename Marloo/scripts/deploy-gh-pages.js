const fs = require('fs');
const path = require('path');

const repoDir = 'C:/Users/campw/Desktop/QueensDomain';
const appDir = path.join(repoDir, 'app');

// 1. Copy app/index.html to root index.html
fs.copyFileSync(path.join(appDir, 'index.html'), path.join(repoDir, 'index.html'));
console.log('Created root index.html');

// 2. Copy static support assets to root so relative paths (templates.js, etc.) work identically
const assetsToCopy = [
  'templates.js',
  'platforms.js',
  'wizard.js',
  'assets.js',
  'forest_bg.svg',
  'icon.png'
];

for (const file of assetsToCopy) {
  const src = path.join(appDir, file);
  const dest = path.join(repoDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Copied to root:', file);
  }
}

// Copy directories (presets, fonts)
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const s = path.join(src, item);
    const d = path.join(dest, item);
    if (fs.statSync(s).isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

copyDir(path.join(appDir, 'presets'), path.join(repoDir, 'presets'));
console.log('Copied presets to root');

copyDir(path.join(appDir, 'fonts'), path.join(repoDir, 'fonts'));
console.log('Copied fonts to root');

// 3. Create .nojekyll at repository root
fs.writeFileSync(path.join(repoDir, '.nojekyll'), '');
console.log('Created .nojekyll');

// 4. Create docs/index.html just in case GitHub Pages is configured to serve from /docs
const docsDir = path.join(repoDir, 'docs');
fs.mkdirSync(docsDir, { recursive: true });
// docs/index.html can also be the complete app or a redirect
const docsIndexHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Queen's Domain Architecture Engine</title>
  <meta http-equiv="refresh" content="0; url=../">
  <script>location.replace("../");</script>
</head>
<body style="background:#04070a;color:#ffffff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;margin:0">
  <p>Loading Queen's Domain... <a href="../" style="color:#00f0ff">Click here if not redirected</a></p>
</body>
</html>`;
fs.writeFileSync(path.join(docsDir, 'index.html'), docsIndexHtml);
console.log('Created docs/index.html redirect fallback');

// 5. Create .github/workflows/pages.yml for automatic GitHub Actions Pages deployment
const workflowsDir = path.join(repoDir, '.github', 'workflows');
fs.mkdirSync(workflowsDir, { recursive: true });

const pagesWorkflow = `name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

fs.writeFileSync(path.join(workflowsDir, 'pages.yml'), pagesWorkflow);
console.log('Created .github/workflows/pages.yml');
