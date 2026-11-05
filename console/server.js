const http = require('http');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { compareVersions } = require('../scripts/diff-versions');

const PORT = process.env.PORT || 5050;
const rootDir = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  if (url.pathname === '/api/check' && req.method === 'POST') {
    try {
      try { cp.execSync('git fetch origin', { cwd: rootDir, stdio: 'pipe' }); } catch(e) {}
      const report = compareVersions();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, report }));
    } catch(err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  // Serve static files from /console or root
  let filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(rootDir, url.pathname);
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimeMap = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
    return fs.createReadStream(filePath).pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// Run initial comparison
compareVersions();

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`   DIRKEI & MARLOO // DEVELOPER CONSOLE LIVE`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`===================================================`);
});
