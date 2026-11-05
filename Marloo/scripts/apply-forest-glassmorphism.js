const fs = require('fs');

const htmlPath = 'C:/Users/campw/Desktop/QueensDomain/app/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Update body styling for the forest background with subtle game transparency
const oldBodyRule = 'body{background:radial-gradient(circle at 50% 0%,#1a1a24 0%,var(--bg) 80%);color:var(--text);';
const newBodyRule = "body{background:#04070a url('forest_bg.svg') center/cover no-repeat fixed;color:var(--text);";

if (html.includes(oldBodyRule)) {
  html = html.replace(oldBodyRule, newBodyRule);
} else {
  // Try regex replace
  html = html.replace(/body\{background:[^;]+;color:var\(--text\);/, newBodyRule);
}

// 2. Add glassmorphic enhancements in CSS
if (!html.includes('.glass-glow')) {
  const cssIdx = html.indexOf('</style>');
  const glassCss = `
  .glass-card {
    background: rgba(10, 14, 22, 0.65) !important;
    backdrop-filter: blur(28px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
    border: 1px solid rgba(255, 255, 255, 0.09) !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
  }
  .glass-subcard {
    background: rgba(8, 12, 18, 0.6) !important;
    backdrop-filter: blur(20px) saturate(160%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(160%) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
  }
  #top-menu-btn:hover {
    border-color: rgba(0, 240, 255, 0.6) !important;
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
    transform: translateY(-1px);
  }
`;
  html = html.slice(0, cssIdx) + glassCss + html.slice(cssIdx);
}

// 3. Update the Top Nav Bar to have the merged logo + title interactive menu button
const oldTopNavStart = '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;background:rgba(8,10,14,0.85);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin-bottom:8px">';
const oldTopNavIdx = html.indexOf('top-menu-btn');
const topNavWrapStart = html.lastIndexOf('<div style="display:flex;align-items:center;justify-content:space-between;', oldTopNavIdx);
const topNavWrapEnd = html.indexOf('</header>', oldTopNavIdx);

// Look for the closing </div> of that top nav bar
const topNavEndDiv = html.indexOf('</div>\n\n    <!-- PROJECTS TAB', oldTopNavIdx);

if (topNavWrapStart !== -1 && topNavEndDiv !== -1) {
  const newTopNavHtml = `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:rgba(8,12,18,0.65);backdrop-filter:blur(28px) saturate(180%);-webkit-backdrop-filter:blur(28px) saturate(180%);border:1px solid rgba(255,255,255,0.08);border-radius:14px;margin-bottom:12px;box-shadow:0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)">
    <div style="display:flex;align-items:center;gap:12px">
      <!-- Unified Logo & Title as the Menu Open / Hide Trigger -->
      <button class="btn" id="top-menu-btn" title="Toggle Tab Toolbar / Side Menu" style="display:inline-flex;align-items:center;gap:10px;padding:6px 14px;background:rgba(18,24,34,0.7);backdrop-filter:blur(16px);border:1px solid rgba(0,240,255,0.3);border-radius:10px;cursor:pointer;transition:all .2s ease;box-shadow:0 0 16px rgba(0,240,255,0.12), inset 0 1px 0 rgba(255,255,255,0.15)">
        <img src="icon.png" alt="Queen's Domain" style="width:24px;height:24px;border-radius:5px;object-fit:cover;box-shadow:0 0 10px rgba(0,240,255,0.4);border:1px solid rgba(0,240,255,0.6)">
        <span style="font-size:13px;font-weight:700;color:#ffffff;letter-spacing:.02em">Queen's Domain Architecture Engine</span>
        <span style="font-size:12px;color:#00f0ff;margin-left:4px;opacity:0.85">☰</span>
      </button>
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <button class="btn on" data-t="projects" id="top-btn-projects" style="font-size:11.5px;padding:5px 14px;font-weight:bold;background:rgba(0,240,255,0.14);border:1px solid rgba(0,240,255,0.4);color:#ffffff;box-shadow:0 0 12px rgba(0,240,255,0.2)">PROJECTS</button>
      <button class="btn" data-t="settings" id="top-btn-settings" style="font-size:11.5px;padding:5px 14px;font-weight:bold;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:#a1a1aa">SETTINGS</button>
      <button class="btn sb-btn-dev" data-t="devconsole" id="top-btn-dev" style="font-size:11.5px;padding:5px 14px;font-weight:bold;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);color:var(--gold)">★ DEV CONSOLE</button>
    </div>
  </div>`;
  html = html.slice(0, topNavWrapStart) + newTopNavHtml + html.slice(topNavEndDiv + 6);
}

// 4. Add glassmorphic classes and styling to #pj-explainer and the dual columns
html = html.replace(
  'id="pj-explainer" style="max-width:1040px;margin:16px auto 24px;background:rgba(12,14,20,0.95);',
  'id="pj-explainer" class="glass-card" style="max-width:1040px;margin:16px auto 24px;background:rgba(10,14,22,0.68);'
);

html = html.replace(
  'id="asset-drop-canvas-panel" style="background:rgba(10,12,18,0.7);',
  'id="asset-drop-canvas-panel" class="glass-subcard" style="background:rgba(8,12,18,0.58);'
);

html = html.replace(
  '<div style="background:rgba(10,12,18,0.7);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px;display:flex;flex-direction:column">\n                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">\n                  <b style="font-size:12.5px;color:#ffffff;letter-spacing:.02em">Ever-Evolving Game Prompt (LIVE)</b>',
  '<div class="glass-subcard" style="background:rgba(8,12,18,0.58);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px;display:flex;flex-direction:column">\n                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">\n                  <b style="font-size:12.5px;color:#ffffff;letter-spacing:.02em">Ever-Evolving Game Prompt (LIVE)</b>'
);

fs.writeFileSync(htmlPath, html);
console.log('Successfully applied Forest Theme & Glassmorphic UI to app/index.html');
