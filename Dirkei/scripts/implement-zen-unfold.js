const fs = require('fs');
const path = require('path');

const htmlPath = 'C:/Users/campw/Desktop/QueensDomain/app/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Locate the hero section inside #pj-explainer
const heroStartStr = '<div class="explainer-hero" id="pj-explainer"';
const heroStartIdx = html.indexOf(heroStartStr);
if (heroStartIdx === -1) {
  console.error('Could not find #pj-explainer');
  process.exit(1);
}

// Find where #pj-explainer ends (before Active Game Blueprints)
const blueprintsStr = '<!-- Active Game Blueprints (Local Storage / Git Blueprints) -->';
const blueprintsIdx = html.indexOf(blueprintsStr);
if (blueprintsIdx === -1) {
  console.error('Could not find Active Game Blueprints marker');
  process.exit(1);
}

// The replacement hero block:
// It has:
// - #pj-explainer as the sleek centered canvas card with zen square proportions
// - Top bar with steps and a Zen/Unfold toggle button: #btn-zen-fold
// - The centered headline & subtitle
// - The ChatGPT-style main chat prompt bar with #dec-query, sparkle icon, clear button, and file upload trigger
// - The Drag & Drop Inspiration Zone: #zen-drop-zone and #zen-file-input
// - The Detected Inspiration Chips Bar: #zen-detected-chips
// - The Unfolded Hub: #studio-unfolded-hub (initially collapsed / unfolded upon typing or dropping)
//   - Live Detection Banner: #live-detection-banner
//   - Engine Quick Select: #engine-quick-select
//   - Inspiration Presets (the 4 cards): #dec-preset-pixel, #dec-preset-souls, #dec-preset-cozy, #dec-preset-sandbox
//   - Split Lower Section (Left: Asset Sheet with #ash-char-name, etc.; Right: Live Prompt Dock with #dec-prompt-preview, etc.)
//   - All hidden support elements (drawers, etc.) preserved!

const newHeroHtml = `<div class="explainer-hero" id="pj-explainer" style="max-width:1080px;margin:16px auto 24px;background:rgba(12,14,20,0.95);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:24px 28px;box-shadow:0 30px 80px rgba(0,0,0,0.85),inset 0 1px 0 rgba(255,255,255,0.1);position:relative;transition:all .3s ease">
          
          <!-- Card Header & 5-Step Pipeline + Zen Mode Toggle -->
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.06)">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:9px;height:9px;background:#00f0ff;box-shadow:0 0 10px #00f0ff;transform:rotate(45deg);border-radius:2px"></div>
              <b style="font-size:13.5px;color:#ffffff;letter-spacing:.04em">QUEEN'S DOMAIN ARCHITECTURE</b>
              <span class="badge ok" style="font-size:9.5px;padding:1px 6px">Idea</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;font-size:11.5px;color:#a1a1aa;font-weight:600">
              <span>🎮 1. Idea</span> <span style="color:#52525b">➔</span> <span>📦 2. Asset Sheet</span> <span style="color:#52525b">➔</span> <span>⚡ 3. Evolving Prompt</span> <span style="color:#52525b">➔</span> <span>🤖 4. Agent Mode</span> <span style="color:#52525b">➔</span> <span style="color:#10b981">🚀 5. Ship</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <button id="btn-zen-fold" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:#a1a1aa;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:bold;cursor:pointer;transition:all .15s ease">⤢ Toggle Full Studio</button>
            </div>
          </div>

          <!-- Central Title & Subtitle (Blank Square Hero) -->
          <div style="text-align:center;max-width:820px;margin:0 auto 16px">
            <div style="display:inline-flex;align-items:center;gap:6px;padding:3px 14px;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.3);border-radius:20px;font-size:11px;font-weight:bold;color:var(--gold);margin-bottom:10px">
              <span>✦ BUILD TECHNICAL GAME ARCHITECTURE</span>
            </div>
            <h1 style="font-size:27px;font-weight:800;color:#ffffff;letter-spacing:-.025em;margin:0 0 8px">What kind of game would you like to create?</h1>
            <p style="font-size:13px;color:#a1a1aa;line-height:1.45;margin:0 auto 16px;max-width:680px">Describe any game idea, or drop inspiration (3D models .glb, pixel art, sound, or design notes) into this square to dynamically unfold your game architecture.</p>

            <!-- Main Chat / Prompt Input Bar -->
            <div style="position:relative;max-width:860px;margin:0 auto 12px">
              <span style="position:absolute;left:18px;top:50%;transform:translateY(-50%);color:#00f0ff;font-size:18px;pointer-events:none;filter:drop-shadow(0 0 6px rgba(0,240,255,0.6))">✨</span>
              <input id="dec-query" placeholder="Type what game you want to create (e.g. '3D Low-Poly Souls with stamina combat' or '2D Cozy Farm Sim')..." style="width:100%;padding:14px 100px 14px 48px;background:rgba(8,10,14,0.94);border:1.5px solid rgba(0,240,255,0.35);border-radius:12px;color:#ffffff;font-size:14px;outline:none;box-shadow:0 0 20px rgba(0,240,255,0.1),inset 0 0 12px rgba(0,0,0,0.6);transition:all .2s ease">
              <div style="position:absolute;right:10px;top:50%;transform:translateY(-50%);display:flex;align-items:center;gap:6px">
                <button id="zen-attach-btn" title="Attach 3D Model, Concept Art, or Audio" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#ffffff;border-radius:6px;padding:4px 8px;font-size:12px;cursor:pointer">📎 Drop</button>
                <button id="zen-clear-btn" title="Clear and Reset to Zen Canvas" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#a1a1aa;border-radius:6px;padding:4px 8px;font-size:12px;cursor:pointer">✕</button>
              </div>
              <input type="file" id="zen-file-input" style="display:none" multiple accept=".glb,.gltf,.obj,.fbx,.png,.jpg,.jpeg,.webp,.svg,.wav,.mp3,.ogg,.txt,.md,.json,.zip">
            </div>

            <!-- Drag & Drop Inspiration Zone (Inside Blank Square) -->
            <div id="zen-drop-zone" style="max-width:860px;margin:0 auto 12px;padding:12px 18px;background:rgba(255,255,255,0.02);border:1.5px dashed rgba(255,255,255,0.12);border-radius:12px;display:flex;align-items:center;justify-content:center;gap:12px;cursor:pointer;transition:all .2s ease">
              <span style="font-size:18px">🔮</span>
              <div style="text-align:left">
                <div style="font-size:12px;font-weight:700;color:#ffffff">Drag & Drop Inspiration Here (.glb 3D models, pixel art, audio, or notes)</div>
                <div style="font-size:10.5px;color:#a1a1aa">Auto-detects file type, extracts palette & metadata, and binds directly to your game architecture</div>
              </div>
              <span class="badge ok" style="font-size:9.5px;margin-left:auto">Auto-Detect ON</span>
            </div>

            <!-- Detected Inspiration Gallery Chips -->
            <div id="zen-detected-chips" style="display:none;flex-wrap:wrap;justify-content:center;gap:8px;max-width:860px;margin:0 auto 14px"></div>
          </div>

          <!-- DYNAMIC UNFOLDED HUB (Smoothly Unfolds as User Types or Drops Inspiration) -->
          <div id="studio-unfolded-hub" style="display:none;opacity:0;transform:translateY(12px);transition:opacity .35s ease, transform .35s ease">
            
            <!-- Live Detection Banner & Engine Bar -->
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
              <div style="font-size:11.5px;font-weight:bold;color:#a1a1aa;margin-bottom:6px">Inspiration & Game Presets (1-Click Fill & Local DB Search)</div>
              
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px" id="insp-cards-grid">
                <!-- Card 1: 2D Pixel RPG -->
                <div class="cg-insp-card" id="dec-preset-pixel" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 12px;cursor:pointer;transition:all .15s ease">
                  <b style="font-size:12px;color:#ffffff;display:flex;align-items:center;gap:6px"><span>✦</span> 2D Pixel Art RPG</b>
                  <div style="font-size:10.5px;color:#a1a1aa;margin:4px 0 6px;line-height:1.35">16x16 top-down tiles, retro hero walk cycle, village NPCs & inventory</div>
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
                      <div style="font-size:10px;font-weight:bold;color:var(--cyan);text-transform:uppercase">🌐 World & Environment</div>
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
                      <div style="font-size:10px;font-weight:bold;color:#a855f7;text-transform:uppercase">🖥️ UI & HUD Kit</div>
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
                      <div style="font-size:10px;font-weight:bold;color:#10b981;text-transform:uppercase">♫ Audio & Sound FX</div>
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
                  <button class="btn ok" id="btn-view-asset-sheet" style="width:100%;font-size:11.5px;padding:7px">View Full Asset Sheet & Manifest</button>
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
- UI & HUD Kit: Minimal HUD -> assets/ui/minimal/
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

// Extract existing hidden elements inside #pj-explainer (from after the 2-column dock to the end of #pj-explainer)
// Let's find where the hidden elements start: id="dec-preset-scifi"
const scifiIdx = html.indexOf('id="dec-preset-scifi"');
const hiddenBlockStart = html.lastIndexOf('<div style="display:none', scifiIdx);
// And find where #pj-explainer closes
const closeExplainerIdx = html.indexOf('</div>\n\n        <!-- Active Game Blueprints', scifiIdx);

if (hiddenBlockStart === -1 || closeExplainerIdx === -1) {
  console.error('Could not locate hiddenBlockStart or closeExplainerIdx', { hiddenBlockStart, closeExplainerIdx });
  process.exit(1);
}

const hiddenElements = html.slice(hiddenBlockStart, closeExplainerIdx);

const assembledHero = newHeroHtml + '\n' + hiddenElements + '\n        </div>';

html = html.slice(0, heroStartIdx) + assembledHero + '\n\n        ' + html.slice(blueprintsIdx);

fs.writeFileSync(htmlPath, html);
console.log('Successfully updated markup in app/index.html');
