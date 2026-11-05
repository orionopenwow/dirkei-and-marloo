const fs = require('fs');
const path = require('path');

const htmlPath = 'C:/Users/campw/Desktop/QueensDomain/app/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Find offsets
const heroStartStr = '<div class="explainer-hero" id="pj-explainer"';
const heroStartIdx = html.indexOf(heroStartStr);
const hiddenStartMarker = '<!-- Hidden Compatibility Elements for Test Invariants -->';
const hiddenStartIdx = html.indexOf(hiddenStartMarker);

if (heroStartIdx === -1 || hiddenStartIdx === -1) {
  console.error('Offsets not found', { heroStartIdx, hiddenStartIdx });
  process.exit(1);
}

// 2. Build the new Zen Square & Dynamic Unfolding Markup
const newHeroHtml = `<div class="explainer-hero" id="pj-explainer" style="max-width:1040px;margin:16px auto 24px;background:rgba(12,14,20,0.95);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:26px 30px;box-shadow:0 30px 80px rgba(0,0,0,0.85),inset 0 1px 0 rgba(255,255,255,0.1);position:relative;transition:all .3s ease">
          
          <!-- Card Header & 5-Step Pipeline + Zen / Full Studio Toggle -->
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.06)">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:9px;height:9px;background:#00f0ff;box-shadow:0 0 10px #00f0ff;transform:rotate(45deg);border-radius:2px"></div>
              <b style="font-size:13px;color:#ffffff;letter-spacing:.04em">QUEEN'S DOMAIN ARCHITECTURE</b>
              <span class="badge ok" style="font-size:9.5px;padding:1px 6px">Idea</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;font-size:11.5px;color:#a1a1aa;font-weight:600">
              <span>🎮 1. Idea</span> <span style="color:#52525b">➔</span> <span>📦 2. Asset Sheet</span> <span style="color:#52525b">➔</span> <span>⚡ 3. Evolving Prompt</span> <span style="color:#52525b">➔</span> <span>🤖 4. Agent Mode</span> <span style="color:#52525b">➔</span> <span style="color:#10b981">🚀 5. Ship</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <button id="btn-zen-fold" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:#a1a1aa;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:bold;cursor:pointer;transition:all .15s ease">⤢ Toggle Full Studio</button>
            </div>
          </div>

          <!-- CENTRAL BLANK SQUARE HERO -->
          <div id="zen-hero-square" style="text-align:center;max-width:820px;margin:0 auto 16px">
            <div style="display:inline-flex;align-items:center;gap:6px;padding:3px 14px;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.3);border-radius:20px;font-size:11px;font-weight:bold;color:var(--gold);margin-bottom:12px">
              <span>✦ DYNAMIC GAME CREATION ENGINE</span>
            </div>
            <h1 style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-.025em;margin:0 0 8px">What kind of game would you like to create?</h1>
            <p style="font-size:13px;color:#a1a1aa;line-height:1.45;margin:0 auto 18px;max-width:680px">Describe your game vision in the chat bar below, or drag &amp; drop inspiration (.glb 3D models, sprites, audio, or notes) into this square to dynamically unfold your architecture.</p>

            <!-- Main Chat / Prompt Input Bar -->
            <div style="position:relative;max-width:860px;margin:0 auto 12px">
              <span style="position:absolute;left:18px;top:50%;transform:translateY(-50%);color:#00f0ff;font-size:18px;pointer-events:none;filter:drop-shadow(0 0 6px rgba(0,240,255,0.6))">✨</span>
              <input id="dec-query" placeholder="What game would you like to create? (e.g. '3D Low-Poly Souls with stamina combat' or '2D Cozy Farm Sim')..." style="width:100%;padding:14px 110px 14px 48px;background:rgba(8,10,14,0.94);border:1.5px solid rgba(0,240,255,0.35);border-radius:12px;color:#ffffff;font-size:14px;outline:none;box-shadow:0 0 20px rgba(0,240,255,0.1),inset 0 0 12px rgba(0,0,0,0.6);transition:all .2s ease">
              <div style="position:absolute;right:10px;top:50%;transform:translateY(-50%);display:flex;align-items:center;gap:6px">
                <button id="zen-attach-btn" title="Attach 3D Model, Concept Art, or Audio" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#ffffff;border-radius:6px;padding:5px 9px;font-size:12px;cursor:pointer">📎 Drop</button>
                <button id="zen-clear-btn" title="Clear and Reset to Zen Blank Square" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#a1a1aa;border-radius:6px;padding:5px 9px;font-size:12px;cursor:pointer">✕</button>
              </div>
              <input type="file" id="zen-file-input" style="display:none" multiple accept=".glb,.gltf,.obj,.fbx,.png,.jpg,.jpeg,.webp,.svg,.wav,.mp3,.ogg,.txt,.md,.json,.zip">
            </div>

            <!-- Drag & Drop Inspiration Zone Inside Blank Square -->
            <div id="zen-drop-zone" style="max-width:860px;margin:0 auto 12px;padding:14px 18px;background:rgba(255,255,255,0.02);border:1.5px dashed rgba(255,255,255,0.12);border-radius:12px;display:flex;align-items:center;justify-content:center;gap:12px;cursor:pointer;transition:all .2s ease">
              <span style="font-size:20px">🔮</span>
              <div style="text-align:left">
                <div style="font-size:12px;font-weight:700;color:#ffffff">Drag &amp; Drop Inspiration Anywhere Here</div>
                <div style="font-size:10.5px;color:#a1a1aa">Drop 3D models (.glb), pixel sprites, concept images, sound FX, or GDD design notes to auto-detect</div>
              </div>
              <span class="badge ok" style="font-size:9.5px;margin-left:auto">Auto-Detect ON</span>
            </div>

            <!-- Detected Inspiration Chips Bar -->
            <div id="zen-detected-chips" style="display:none;flex-wrap:wrap;justify-content:center;gap:8px;max-width:860px;margin:0 auto 12px"></div>
          </div>

          <!-- DYNAMIC UNFOLDED HUB (Unfolds when typing or dropping inspiration) -->
          <div id="studio-unfolded-hub" style="display:none;opacity:0;transform:translateY(12px);transition:opacity .35s ease, transform .35s ease">
            
            <!-- Live Detection Banner & Engine Selector -->
            <div id="live-detection-banner" style="background:rgba(0,240,255,0.04);border:1px solid rgba(0,240,255,0.2);border-radius:10px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:14px">🎯</span>
                <span id="dec-detected-theme" style="font-size:12.5px;font-weight:700;color:#00f0ff">🎯 Detected: 3D Soulslike Action RPG</span>
                <span id="dec-scope-badge" class="badge ok" style="font-size:9.5px">📐 SCOPE: 24 STEPS (BALANCED INDIE)</span>
              </div>
              
              <!-- Engine Dropdown Bar -->
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:11.5px;font-weight:bold;color:#a1a1aa">Engine</span>
                <select id="engine-quick-select" style="width:280px;background:rgba(8,10,14,0.9);border:1px solid rgba(255,255,255,0.15);color:#ffffff;border-radius:6px;padding:5px 10px;font-size:12px;font-weight:bold;outline:none">
                  <option value="unity">Unity C# (Deterministic 60Hz)</option>
                  <option value="godot">Godot 4 (GDScript / C#)</option>
                  <option value="unreal">Unreal Engine 5 (C++ / Blueprints)</option>
                  <option value="spawn">Spawn.co (TypeScript / Savi WebGL)</option>
                </select>
              </div>
            </div>

            <!-- Inspiration & Game Presets (The 4 Compact Preset Cards) -->
            <div style="margin-bottom:14px">
              <div style="font-size:11.5px;font-weight:bold;color:#a1a1aa;margin-bottom:6px">Inspiration &amp; Game Presets (1-Click Fill &amp; Local DB Search)</div>
              
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px" id="insp-cards-grid">
                <!-- Card 1: 2D Pixel RPG -->
                <div class="cg-insp-card" id="dec-preset-pixel" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 12px;cursor:pointer;transition:all .15s ease">
                  <b style="font-size:12px;color:#ffffff;display:flex;align-items:center;gap:6px"><span>✦</span> 2D Pixel Art RPG</b>
                  <div style="font-size:10.5px;color:#a1a1aa;margin:4px 0 6px;line-height:1.35">16x16 top-down tiles, retro hero walk cycle, village NPCs &amp; inventory</div>
                  <span class="badge ok" style="font-size:9px">Tiny Town · Godot/Unity</span>
                </div>

                <!-- Card 2: 3D Soulslike -->
                <div class="cg-insp-card" id="dec-preset-souls" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 12px;cursor:pointer;transition:all .15s ease">
                  <b style="font-size:12px;color:#ffffff;display:flex;align-items:center;gap:6px"><span>⚔️</span> 3D Low-Poly Souls</b>
                  <div style="font-size:10.5px;color:#a1a1aa;margin:4px 0 6px;line-height:1.35">Over-the-shoulder camera, committed stamina combat, dark castle kit</div>
                  <span class="badge act" style="font-size:9px">Castle Kit · Unity C#</span>
                </div>

                <!-- Card 3: Cozy Farm Sim -->
                <div class="cg-insp-card" id="dec-preset-cozy" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 12px;cursor:pointer;transition:all .15s ease">
                  <b style="font-size:12px;color:#ffffff;display:flex;align-items:center;gap:6px"><span>🌾</span> 2D Cozy Farm Sim</b>
                  <div style="font-size:10.5px;color:#a1a1aa;margin:4px 0 6px;line-height:1.35">15-minute daily clock, seed to harvest crop economy, peaceful ambient mix</div>
                  <span class="badge ok" style="font-size:9px">Tiny Town · Godot 4</span>
                </div>

                <!-- Card 4: 2D Sandbox Miner -->
                <div class="cg-insp-card" id="dec-preset-sandbox" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 12px;cursor:pointer;transition:all .15s ease">
                  <b style="font-size:12px;color:#ffffff;display:flex;align-items:center;gap:6px"><span>⛏️</span> 2D Sandbox Miner</b>
                  <div style="font-size:10.5px;color:#a1a1aa;margin:4px 0 6px;line-height:1.35">Destructible voxel slice, underground mining tiers, safehouse crafting</div>
                  <span class="badge no" style="font-size:9px">Dungeon Pack · Spawn.co</span>
                </div>
              </div>
            </div>

            <!-- Split Lower Section (2 Columns Side-by-Side Matching Mockup) -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
              
              <!-- Left Column: Curated Game Asset Sheet -->
              <div style="background:rgba(10,12,18,0.7);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px;display:flex;flex-direction:column">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
                  <b style="font-size:12.5px;color:#ffffff;letter-spacing:.02em">Curated Game Asset Sheet (Local CC0 Database)</b>
                  <span class="badge ok" style="font-size:9px">LOCAL DB</span>
                </div>

                <div style="display:flex;flex-direction:column;gap:6px;flex:1">
                  <!-- Row 1: Protagonist -->
                  <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
                    <div>
                      <div style="font-size:10px;font-weight:bold;color:#f43f5e;text-transform:uppercase">★ Protagonist</div>
                      <b id="ash-char-name" style="font-size:12px;color:#ffffff">Queen's Domain Guardian [3D Mesh]</b>
                      <div id="ash-char-specs" style="display:none"></div>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px">
                      <span class="badge ok" style="font-size:9px">Slot 1</span>
                      <button class="icon-btn" id="sub-char-btn" title="Substitute Asset" style="padding:2px 7px;font-size:12px">☰</button>
                    </div>
                  </div>

                  <!-- Row 2: World & Environment -->
                  <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
                    <div>
                      <div style="font-size:10px;font-weight:bold;color:var(--cyan);text-transform:uppercase">🌐 World &amp; Environment</div>
                      <b id="ash-world-name" style="font-size:12px;color:#ffffff">Modular Dungeon Kit</b>
                      <div id="ash-world-specs" style="display:none"></div>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px">
                      <span class="badge ok" style="font-size:9px">Slot 2</span>
                      <button class="icon-btn" id="sub-world-btn" title="Substitute Asset" style="padding:2px 7px;font-size:12px">☰</button>
                    </div>
                  </div>

                  <!-- Row 3: UI & HUD Kit -->
                  <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
                    <div>
                      <div style="font-size:10px;font-weight:bold;color:#a855f7;text-transform:uppercase">🖥️ UI &amp; HUD Kit</div>
                      <b id="ash-ui-name" style="font-size:12px;color:#ffffff">Minimal HUD</b>
                      <div id="ash-ui-specs" style="display:none"></div>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px">
                      <span class="badge ok" style="font-size:9px">Slot 4</span>
                      <button class="icon-btn" id="sub-ui-btn" title="Substitute Asset" style="padding:2px 7px;font-size:12px">☰</button>
                    </div>
                  </div>

                  <!-- Row 4: Audio & Sound FX -->
                  <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
                    <div>
                      <div style="font-size:10px;font-weight:bold;color:#10b981;text-transform:uppercase">♫ Audio &amp; Sound FX</div>
                      <b id="ash-audio-name" style="font-size:12px;color:#ffffff">RPG Audio Pack</b>
                      <div id="ash-audio-specs" style="display:none"></div>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px">
                      <span class="badge ok" style="font-size:9px">Slot 5</span>
                      <button class="icon-btn" id="sub-audio-btn" title="Substitute Asset" style="padding:2px 7px;font-size:12px">☰</button>
                    </div>
                  </div>
                </div>

                <!-- Asset Drawer Sub Modal -->
                <div id="asset-sub-drawer" style="display:none;margin-top:10px;padding:10px;background:rgba(18,22,30,0.95);border:1px solid rgba(255,255,255,0.12);border-radius:8px">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                    <b id="asset-sub-title" style="font-size:11px;color:#ffffff">Substitute Asset</b>
                    <button class="icon-btn" id="asset-sub-close" style="font-size:10px">✕</button>
                  </div>
                  <div id="asset-sub-options" style="display:flex;flex-direction:column;gap:4px;max-height:140px;overflow-y:auto"></div>
                </div>

                <div style="margin-top:10px">
                  <button class="btn ok" id="btn-view-asset-sheet" style="width:100%;font-size:11.5px;padding:7px">View Full Asset Sheet &amp; Manifest</button>
                </div>
              </div>

              <!-- Right Column: Ever-Evolving Game Prompt (LIVE) -->
              <div style="background:rgba(10,12,18,0.7);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px;display:flex;flex-direction:column">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                  <b style="font-size:12.5px;color:#ffffff;letter-spacing:.02em">Ever-Evolving Game Prompt (LIVE)</b>
                  <span class="badge act" style="font-size:9px">● LIVE SYNC</span>
                </div>
                <div id="dock-prompt-meta" style="font-size:11px;color:#a1a1aa;margin-bottom:8px">Target: Unity C# | Vision: Action RPG | Protagonist: Guardian | Environment: Dungeon</div>
                
                <div style="flex:1;position:relative">
                  <pre id="dec-prompt-preview" style="height:140px;margin:0;padding:10px;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.06);border-radius:6px;color:#00f0ff;font-family:monospace;font-size:10.5px;line-height:1.4;overflow-y:auto;white-space:pre-wrap;box-shadow:inset 0 0 10px rgba(0,0,0,0.5)">[PONYTAIL ARCHITECTURE ENGINE - TARGET: UNITY C#]
Game Vision: "Action RPG"
Pacing: FAST | Mechanic: ACTION | Style: 3D (Ponytail Zero-GC)

CC0 ASSET MANIFEST (AUTO-INJECTED):
- Protagonist: Queen's Domain Guardian [3D Mesh] -> assets/characters/guardian.glb
- World/Environment: Modular Dungeon Kit -> assets/world/dungeon/
- Weapons/Gear: Medieval Weapons Pack -> assets/weapons/
- UI &amp; HUD Kit: Minimal HUD -> assets/ui/minimal/
- Audio Mix SFX: RPG Audio Pack -> assets/audio/rpg_sfx/

Act as a senior systems architect. Build an ultra-decoupled fixed 60Hz simulation runner in pure Unity C#:
1. Pure State Struct: Define 'GameState' containing Vector3 position, Vector3 velocity, float stamina (0-100), and EntityState enum.
2. System Logic: Create 'SimulationRunner' as a pure isolated class operating strictly on GameState inputs with fixed dt = 0.016667f.
3. Decoupled Presentation: Create 'PlayerView' that interpolates transforms visually. Zero gameplay logic or collision calculation allowed in Update().
4. Invariant Assertion: Assert that physics runs deterministically whether rendering at 30, 60, or 144 FPS.</pre>
                </div>

                <div style="display:flex;align-items:center;gap:8px;margin-top:10px">
                  <button class="btn" id="dec-copy-prompt" style="flex:1;font-size:11px;padding:6px">Copy Prompt (Lite)</button>
                  <button class="btn gold" id="btn-dock-send-agent" style="flex:1.2;font-size:11px;padding:6px;font-weight:bold">Send to Agent</button>
                </div>
              </div>

            </div>
          </div>

          `;

// Replace from heroStartIdx to hiddenStartIdx
html = html.slice(0, heroStartIdx) + newHeroHtml + html.slice(hiddenStartIdx);

// 3. Add CSS for drag & drop highlights if not already present
if (!html.includes('.zen-drag-active')) {
  const cssIdx = html.indexOf('</style>');
  const zenCss = `
  .zen-drag-active {
    border-color: #00f0ff !important;
    box-shadow: 0 0 45px rgba(0,240,255,0.35), inset 0 0 20px rgba(0,240,255,0.12) !important;
  }
  .zen-zone-active {
    border-color: #00f0ff !important;
    background: rgba(0,240,255,0.08) !important;
  }
`;
  html = html.slice(0, cssIdx) + zenCss + html.slice(cssIdx);
}

// 4. Update the Script logic to handle Zen Unfold & Drag and Drop Detection
// Find where runDeconstructor is initialized or after copyPromptBtn
const insertScriptMarker = "if(decBtn)decBtn.onclick=()=>runDeconstructor(decQ.value);";
const insertScriptIdx = html.indexOf(insertScriptMarker);

if (insertScriptIdx === -1) {
  console.error('Could not find insertScriptMarker');
  process.exit(1);
}

const zenScript = `
// --- Zen Blank Square & Dynamic Unfolding Architecture Engine ---
const studioHub = $('studio-unfolded-hub');
const zenDropZone = $('zen-drop-zone');
const zenDetectedChips = $('zen-detected-chips');
const zenFileInput = $('zen-file-input');
const zenAttachBtn = $('zen-attach-btn');
const zenClearBtn = $('zen-clear-btn');
const zenFoldBtn = $('btn-zen-fold');

let detectedInspirations = [];
let isStudioManuallyUnfolded = false;

function setStudioUnfolded(unfolded) {
  if (!studioHub) return;
  if (unfolded) {
    studioHub.style.display = 'block';
    setTimeout(() => {
      studioHub.style.opacity = '1';
      studioHub.style.transform = 'translateY(0)';
    }, 10);
    if (zenFoldBtn) zenFoldBtn.textContent = '✕ Collapse to Zen';
  } else {
    studioHub.style.opacity = '0';
    studioHub.style.transform = 'translateY(12px)';
    setTimeout(() => {
      if (studioHub.style.opacity === '0') studioHub.style.display = 'none';
    }, 350);
    if (zenFoldBtn) zenFoldBtn.textContent = '⤢ Toggle Full Studio';
  }
}

if (zenFoldBtn) {
  zenFoldBtn.onclick = () => {
    isStudioManuallyUnfolded = !isStudioManuallyUnfolded;
    setStudioUnfolded(isStudioManuallyUnfolded);
  };
}

if (zenClearBtn) {
  zenClearBtn.onclick = () => {
    if (decQ) decQ.value = '';
    detectedInspirations = [];
    renderDetectedChips();
    isStudioManuallyUnfolded = false;
    setStudioUnfolded(false);
    toast('RESET TO ZEN BLANK CANVAS');
  };
}

if (zenAttachBtn && zenFileInput) {
  zenAttachBtn.onclick = () => zenFileInput.click();
}

if (zenDropZone && zenFileInput) {
  zenDropZone.onclick = () => zenFileInput.click();
}

if (zenFileInput) {
  zenFileInput.onchange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        handleInspirationFile(files[i]);
      }
    }
  };
}

function handleInspirationFile(file) {
  if (!file) return;
  const name = file.name;
  const ext = name.split('.').pop().toLowerCase();
  
  let type = 'unknown';
  let badge = '📄 Note';
  let role = 'Design Note';
  
  if (['glb', 'gltf', 'obj', 'fbx'].includes(ext)) {
    type = '3d-mesh';
    badge = '📦 3D Mesh';
    role = 'Protagonist Model';
    ideArt = '3d';
    const cleanName = name.replace(/\\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + ' [Custom 3D Mesh]';
    if ($('ash-char-name')) $('ash-char-name').textContent = formattedName;
    if (ASSET_SLOTS && ASSET_SLOTS.char) {
      ASSET_SLOTS.char.options[ASSET_SLOTS.char.active] = {
        name: formattedName,
        path: 'assets/characters/' + name,
        poly: 'Dynamic Poly',
        source: 'User Dropped'
      };
    }
    toast('DETECTED 3D MODEL: Bound to Protagonist slot');
  } else if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) {
    type = 'image';
    badge = '🎨 Visual';
    role = 'Concept Art & Palette';
    const reader = new FileReader();
    reader.onload = (ev) => {
      addDetectedChip({ name, type, badge, role, thumb: ev.target.result });
    };
    reader.readAsDataURL(file);
    toast('DETECTED INSPIRATION ART: Added to visual palette');
    return;
  } else if (['wav', 'mp3', 'ogg'].includes(ext)) {
    type = 'audio';
    badge = '🎵 Audio';
    role = 'Sound FX';
    if ($('ash-audio-name')) $('ash-audio-name').textContent = name + ' [Custom SFX]';
    toast('DETECTED AUDIO: Bound to Audio slot');
  } else if (['txt', 'md', 'json', 'cs', 'gd'].includes(ext)) {
    type = 'text';
    badge = '📄 GDD / Code';
    role = 'Game Concept';
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      if (decQ && !decQ.value) {
        decQ.value = text.slice(0, 80).replace(/\\r?\\n/g, ' ').trim();
        runDeconstructor(decQ.value);
      }
    };
    reader.readAsText(file);
    toast('DETECTED GDD TEXT: Extracted game vision');
  } else if (ext === 'zip') {
    type = 'archive';
    badge = '🗜️ Asset Pack';
    role = 'CC0 Bundle';
    if ($('ash-world-name')) $('ash-world-name').textContent = name.replace('.zip', '') + ' [Zip Pack]';
    toast('DETECTED ASSET PACK: Bound to World/Environment');
  }

  addDetectedChip({ name, type, badge, role });
}

function addDetectedChip(item) {
  detectedInspirations.push(item);
  renderDetectedChips();
  setStudioUnfolded(true);
  runDeconstructor(decQ && decQ.value ? decQ.value : 'Action RPG with ' + item.name);
}

function removeDetectedChip(index) {
  detectedInspirations.splice(index, 1);
  renderDetectedChips();
  if (detectedInspirations.length === 0 && (!decQ.value || !decQ.value.trim()) && !isStudioManuallyUnfolded) {
    setStudioUnfolded(false);
  }
}

function renderDetectedChips() {
  if (!zenDetectedChips) return;
  zenDetectedChips.innerHTML = '';
  if (detectedInspirations.length === 0) {
    zenDetectedChips.style.display = 'none';
    return;
  }
  zenDetectedChips.style.display = 'flex';
  detectedInspirations.forEach((item, idx) => {
    const chip = document.createElement('div');
    chip.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:rgba(0,240,255,0.08);border:1px solid rgba(0,240,255,0.3);border-radius:20px;font-size:11px;color:#ffffff;box-shadow:0 0 10px rgba(0,240,255,0.15)';
    
    if (item.thumb) {
      const img = document.createElement('img');
      img.src = item.thumb;
      img.style.cssText = 'width:18px;height:18px;border-radius:3px;object-fit:cover';
      chip.appendChild(img);
    }
    
    const text = document.createElement('span');
    text.innerHTML = '<b style="color:#00f0ff">' + item.badge + '</b>: ' + item.name + ' <span style="color:#a1a1aa">(' + item.role + ')</span>';
    chip.appendChild(text);
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'background:none;border:none;color:#a1a1aa;cursor:pointer;font-size:11px;padding:0 2px;margin-left:4px';
    closeBtn.onclick = (e) => { e.stopPropagation(); removeDetectedChip(idx); };
    chip.appendChild(closeBtn);
    
    zenDetectedChips.appendChild(chip);
  });
}

// Drag & drop listeners across the card
const dropArea = $('pj-explainer');
if (dropArea) {
  ['dragenter', 'dragover'].forEach(evName => {
    dropArea.addEventListener(evName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add('zen-drag-active');
      if (zenDropZone) zenDropZone.classList.add('zen-zone-active');
    }, false);
  });

  ['dragleave', 'drop'].forEach(evName => {
    dropArea.addEventListener(evName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('zen-drag-active');
      if (zenDropZone) zenDropZone.classList.remove('zen-zone-active');
    }, false);
  });

  dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt ? dt.files : null;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        handleInspirationFile(files[i]);
      }
    }
  }, false);
}

// Real-time typing unfolding listener
if (decQ) {
  decQ.addEventListener('input', () => {
    const val = decQ.value.trim();
    if (val.length > 0) {
      setStudioUnfolded(true);
      runDeconstructor(val);
    } else if (detectedInspirations.length === 0 && !isStudioManuallyUnfolded) {
      setStudioUnfolded(false);
    }
  });
}
`;

html = html.slice(0, insertScriptIdx) + zenScript + '\n' + html.slice(insertScriptIdx);

// When preset cards are clicked, make sure studio unrolls
html = html.replace('pPixel.onclick=()=>{', 'pPixel.onclick=()=>{ setStudioUnfolded(true);');
html = html.replace('if(pSouls) pSouls.onclick=()=>{', 'if(pSouls) pSouls.onclick=()=>{ setStudioUnfolded(true);');
html = html.replace('if(pCozy) pCozy.onclick=()=>{', 'if(pCozy) pCozy.onclick=()=>{ setStudioUnfolded(true);');
html = html.replace('if(pSand) pSand.onclick=()=>{', 'if(pSand) pSand.onclick=()=>{ setStudioUnfolded(true);');

fs.writeFileSync(htmlPath, html);
console.log('Successfully applied Zen Blank Square & Dynamic Unfolding Overhaul to app/index.html');
