const fs = require('fs');

const htmlPath = 'C:/Users/campw/Desktop/QueensDomain/app/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Locate the hero card inside #pj-explainer
const heroStartStr = '<div class="explainer-hero" id="pj-explainer"';
const heroStartIdx = html.indexOf(heroStartStr);
const hiddenStartMarker = '<!-- Hidden Compatibility Elements for Test Invariants -->';
const hiddenStartIdx = html.indexOf(hiddenStartMarker);

if (heroStartIdx === -1 || hiddenStartIdx === -1) {
  console.error('Offsets not found', { heroStartIdx, hiddenStartIdx });
  process.exit(1);
}

// 2. Build the Clean-Cut Landscape UI with the Prominent Prompt Command Center
const newHeroHtml = `<div class="explainer-hero glass-card" id="pj-explainer" style="max-width:1220px;margin:14px auto 22px;background:rgba(8,12,18,0.72);backdrop-filter:blur(32px) saturate(190%);-webkit-backdrop-filter:blur(32px) saturate(190%);border:1px solid rgba(255,255,255,0.09);border-radius:22px;padding:26px 32px;box-shadow:0 30px 80px rgba(0,0,0,0.75),inset 0 1px 0 rgba(255,255,255,0.14);position:relative;transition:all .3s ease">

          <!-- Hidden button for toggle compatibility -->
          <button id="btn-zen-fold" style="display:none">Toggle</button>

          <!-- PROMINENT PROMPT COMMAND CENTER (Clean-Cut Landscape Header) -->
          <div id="zen-hero-square" style="text-align:center;max-width:980px;margin:0 auto 16px">
            
            <div style="display:inline-flex;align-items:center;gap:8px;padding:4px 16px;background:rgba(0,240,255,0.08);border:1px solid rgba(0,240,255,0.3);border-radius:20px;font-size:11.5px;font-weight:700;color:#00f0ff;letter-spacing:.04em;margin-bottom:10px;box-shadow:0 0 14px rgba(0,240,255,0.12)">
              <span style="font-size:13px">✨</span> START TYPING A GAME IDEA, GENRE, OR MECHANICS
            </div>

            <h1 style="font-size:29px;font-weight:800;color:#ffffff;letter-spacing:-.025em;margin:0 0 8px">What kind of game would you like to create?</h1>
            
            <p style="font-size:13.5px;color:#cbd5e1;line-height:1.45;margin:0 auto 18px;max-width:760px">
              Type anything you want to create below — from a quick genre keyword (e.g. <i>"Soulslike"</i>, <i>"Cozy Farm Sim"</i>, <i>"Voxel Miner"</i>) to a full concept. Watch the architecture engine auto-detect your systems, match CC0 assets, and compile your prompt live as you type.
            </p>

            <!-- Main High-Prominence Chat / Prompt Input Bar -->
            <div style="position:relative;max-width:980px;margin:0 auto 12px">
              <span style="position:absolute;left:20px;top:50%;transform:translateY(-50%);color:#00f0ff;font-size:20px;pointer-events:none;filter:drop-shadow(0 0 8px rgba(0,240,255,0.7))">✨</span>
              
              <input id="dec-query" placeholder="Start typing a game idea, genre, theme, mechanics, or whatever you want to create..." style="width:100%;padding:17px 125px 17px 56px;background:rgba(6,9,14,0.92);border:2px solid rgba(0,240,255,0.45);border-radius:14px;color:#ffffff;font-size:15px;font-weight:600;outline:none;box-shadow:0 0 28px rgba(0,240,255,0.16),inset 0 0 16px rgba(0,0,0,0.7);transition:all .2s ease">
              
              <div style="position:absolute;right:12px;top:50%;transform:translateY(-50%);display:flex;align-items:center;gap:6px">
                <button id="zen-attach-btn" title="Attach 3D Model, Concept Art, or Audio" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.16);color:#ffffff;border-radius:6px;padding:6px 11px;font-size:12px;font-weight:bold;cursor:pointer;transition:all .15s ease">📎 Drop Art</button>
                <button id="zen-clear-btn" title="Clear and Reset" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.16);color:#a1a1aa;border-radius:6px;padding:6px 10px;font-size:12px;cursor:pointer;transition:all .15s ease">✕</button>
              </div>
              <input type="file" id="zen-file-input" style="display:none" multiple accept=".glb,.gltf,.obj,.fbx,.png,.jpg,.jpeg,.webp,.svg,.wav,.mp3,.ogg,.txt,.md,.json,.zip">
            </div>

            <!-- Clickable Instant Inspiration Sparks Bar -->
            <div id="inspiration-sparks-bar" style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px;max-width:980px;margin:0 auto 12px">
              <span style="font-size:11px;font-weight:bold;color:#71717a;margin-right:4px">Instant Sparks:</span>
              <button class="insp-spark-pill" data-idea="3D Low-Poly Souls with stamina combat and dark castle" style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);color:#fbbf24;border-radius:14px;padding:3px 10px;font-size:11px;cursor:pointer;transition:all .15s ease">⚔️ 3D Souls</button>
              <button class="insp-spark-pill" data-idea="2D Pixel Art RPG with 16x16 tiles and village NPCs" style="background:rgba(0,240,255,0.08);border:1px solid rgba(0,240,255,0.25);color:#00f0ff;border-radius:14px;padding:3px 10px;font-size:11px;cursor:pointer;transition:all .15s ease">✦ 2D Pixel RPG</button>
              <button class="insp-spark-pill" data-idea="2D Cozy Farm Sim with daily seasonal clock and crop economy" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);color:#10b981;border-radius:14px;padding:3px 10px;font-size:11px;cursor:pointer;transition:all .15s ease">🌾 Cozy Farm</button>
              <button class="insp-spark-pill" data-idea="2D Destructible Sandbox Miner with underground mining tiers" style="background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.25);color:#a855f7;border-radius:14px;padding:3px 10px;font-size:11px;cursor:pointer;transition:all .15s ease">⛏️ Sandbox Miner</button>
              <button class="insp-spark-pill" data-idea="Cyberpunk Roguelike with terminal hacking and drone combat" style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.25);color:#38bdf8;border-radius:14px;padding:3px 10px;font-size:11px;cursor:pointer;transition:all .15s ease">🌆 Cyberpunk</button>
              <button class="insp-spark-pill" data-idea="Survival Horror with scarce ammo and flashlight raycasts" style="background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.25);color:#f43f5e;border-radius:14px;padding:3px 10px;font-size:11px;cursor:pointer;transition:all .15s ease">🧟 Survival Horror</button>
            </div>

            <!-- Drag & Drop Inspiration Pad (Landscape Format) -->
            <div id="zen-drop-zone" style="max-width:980px;margin:0 auto 10px;padding:11px 18px;background:rgba(255,255,255,0.02);border:1.5px dashed rgba(255,255,255,0.12);border-radius:12px;display:flex;align-items:center;justify-content:center;gap:12px;cursor:pointer;transition:all .2s ease">
              <span style="font-size:18px">🔮</span>
              <div style="text-align:left">
                <div style="font-size:12px;font-weight:700;color:#ffffff">Drag &amp; Drop Inspiration Anywhere Into This Studio</div>
                <div style="font-size:10.5px;color:#a1a1aa">Drop 3D models (.glb), pixel sprites, concept images, sound FX, or paste web links to auto-detect</div>
              </div>
              <span class="badge ok" style="font-size:9.5px;margin-left:auto">Auto-Detect ON</span>
            </div>

            <!-- Detected Inspiration Chips Bar -->
            <div id="zen-detected-chips" style="display:none;flex-wrap:wrap;justify-content:center;gap:8px;max-width:980px;margin:0 auto 10px"></div>
          </div>

          <!-- DYNAMIC UNFOLDED HUB (Unfolds and builds the experience as user types) -->
          <div id="studio-unfolded-hub" style="display:none;opacity:0;transform:translateY(12px);transition:opacity .35s ease, transform .35s ease">
            
            <!-- Live Detection Banner & Engine Selector (Sleek Landscape Bar) -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:rgba(0,240,255,0.04);border:1px solid rgba(0,240,255,0.18);border-radius:10px;margin-bottom:14px;font-size:12px;box-shadow:0 4px 16px rgba(0,0,0,0.3)">
              <div style="display:flex;align-items:center;gap:10px">
                <span style="color:#00f0ff;font-size:14px">🎯</span>
                <span id="dec-detected-theme" style="font-weight:700;color:#00f0ff">🎯 Detected: 3D Soulslike Action RPG</span>
                <span id="dec-scope-badge" class="badge ok" style="font-size:9.5px">📐 SCOPE: 24 STEPS</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px">
                <span style="color:#a1a1aa;font-weight:bold;font-size:11.5px">Target Engine:</span>
                <select id="engine-quick-select" style="background:rgba(8,12,18,0.92);border:1px solid rgba(255,255,255,0.15);color:#ffffff;border-radius:6px;padding:4px 10px;font-size:11.5px;font-weight:bold;outline:none">
                  <option value="unity">Unity C# (Deterministic 60Hz)</option>
                  <option value="godot">Godot 4 (GDScript / C#)</option>
                  <option value="unreal">Unreal Engine 5 (C++ / Blueprints)</option>
                  <option value="spawn">Spawn.co (TypeScript / Savi WebGL)</option>
                </select>
              </div>
            </div>

            <!-- Inspiration & Game Presets (4 Wide Landscape Cards with Full Background Images) -->
            <div style="margin-bottom:14px">
              <div style="font-size:11.5px;font-weight:bold;color:#a1a1aa;margin-bottom:8px">Inspiration Presets (1-Click Fill &amp; Local DB Search)</div>
              
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px" id="insp-cards-grid">
                <!-- Card 1: 2D Pixel RPG -->
                <div class="cg-insp-card" id="dec-preset-pixel" style="background:linear-gradient(180deg, rgba(10,12,18,0.65) 0%, rgba(10,12,18,0.92) 100%), url('presets/pixel_tilesheet.svg') center/cover no-repeat;border:1px solid rgba(0,240,255,0.22);border-radius:10px;padding:14px;min-height:110px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:all .2s ease;box-shadow:0 4px 14px rgba(0,0,0,0.5)">
                  <div>
                    <b style="font-size:12.5px;color:#ffffff;display:flex;align-items:center;gap:6px;text-shadow:0 1px 3px rgba(0,0,0,0.8)"><span>✦</span> 2D Pixel Art RPG</b>
                    <div style="font-size:11px;color:#d4d4d8;margin-top:6px;line-height:1.35;text-shadow:0 1px 2px rgba(0,0,0,0.9)">16x16 top-down tiles, retro hero walk cycle, village NPCs &amp; inventory</div>
                  </div>
                  <div>
                    <span class="badge ok" style="font-size:9.5px;background:rgba(16,185,129,0.25);border-color:rgba(16,185,129,0.5)">Tiny Town · Godot/Unity</span>
                  </div>
                </div>

                <!-- Card 2: 3D Soulslike -->
                <div class="cg-insp-card" id="dec-preset-souls" style="background:linear-gradient(180deg, rgba(10,12,18,0.65) 0%, rgba(10,12,18,0.92) 100%), url('presets/souls.svg') center/cover no-repeat;border:1px solid rgba(251,191,36,0.3);border-radius:10px;padding:14px;min-height:110px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:all .2s ease;box-shadow:0 4px 14px rgba(0,0,0,0.5)">
                  <div>
                    <b style="font-size:12.5px;color:#ffffff;display:flex;align-items:center;gap:6px;text-shadow:0 1px 3px rgba(0,0,0,0.8)"><span>⚔️</span> 3D Low-Poly Souls</b>
                    <div style="font-size:11px;color:#d4d4d8;margin-top:6px;line-height:1.35;text-shadow:0 1px 2px rgba(0,0,0,0.9)">Over-the-shoulder camera, committed stamina combat, dark castle kit</div>
                  </div>
                  <div>
                    <span class="badge act" style="font-size:9.5px;background:rgba(251,191,36,0.25);border-color:rgba(251,191,36,0.5)">Castle Kit · Unity C#</span>
                  </div>
                </div>

                <!-- Card 3: Cozy Farm Sim -->
                <div class="cg-insp-card" id="dec-preset-cozy" style="background:linear-gradient(180deg, rgba(10,12,18,0.65) 0%, rgba(10,12,18,0.92) 100%), url('presets/cozy.svg') center/cover no-repeat;border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:14px;min-height:110px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:all .2s ease;box-shadow:0 4px 14px rgba(0,0,0,0.5)">
                  <div>
                    <b style="font-size:12.5px;color:#ffffff;display:flex;align-items:center;gap:6px;text-shadow:0 1px 3px rgba(0,0,0,0.8)"><span>🌾</span> 2D Cozy Farm Sim</b>
                    <div style="font-size:11px;color:#d4d4d8;margin-top:6px;line-height:1.35;text-shadow:0 1px 2px rgba(0,0,0,0.9)">15-minute daily clock, seed to harvest crop economy, peaceful ambient mix</div>
                  </div>
                  <div>
                    <span class="badge ok" style="font-size:9.5px;background:rgba(16,185,129,0.25);border-color:rgba(16,185,129,0.5)">Tiny Town · Godot 4</span>
                  </div>
                </div>

                <!-- Card 4: 2D Sandbox Miner -->
                <div class="cg-insp-card" id="dec-preset-sandbox" style="background:linear-gradient(180deg, rgba(10,12,18,0.65) 0%, rgba(10,12,18,0.92) 100%), url('presets/sandbox.svg') center/cover no-repeat;border:1px solid rgba(168,85,247,0.3);border-radius:10px;padding:14px;min-height:110px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:all .2s ease;box-shadow:0 4px 14px rgba(0,0,0,0.5)">
                  <div>
                    <b style="font-size:12.5px;color:#ffffff;display:flex;align-items:center;gap:6px;text-shadow:0 1px 3px rgba(0,0,0,0.8)"><span>⛏️</span> 2D Sandbox Miner</b>
                    <div style="font-size:11px;color:#d4d4d8;margin-top:6px;line-height:1.35;text-shadow:0 1px 2px rgba(0,0,0,0.9)">Destructible voxel slice, underground mining tiers, safehouse crafting</div>
                  </div>
                  <div>
                    <span class="badge no" style="font-size:9.5px;background:rgba(168,85,247,0.25);border-color:rgba(168,85,247,0.5)">Dungeon Pack · Spawn.co</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Balanced Dual Column Landscape Dock -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px">
              
              <!-- Left Column: INSPIRATION & ASSET DROP CANVAS -->
              <div id="asset-drop-canvas-panel" class="glass-subcard" style="background:rgba(8,12,18,0.58);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:15px;display:flex;flex-direction:column">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                  <b style="font-size:12.5px;color:#ffffff;letter-spacing:.02em">Inspiration &amp; Asset Canvas</b>
                  <span class="badge ok" style="font-size:9px">DROP / LINK ACTIVE</span>
                </div>

                <!-- Drag & Drop Zone inside Left Pane for Links & Images -->
                <div id="asset-pane-drop-zone" style="border:1.5px dashed rgba(0,240,255,0.3);background:rgba(0,240,255,0.03);border-radius:8px;padding:10px 12px;margin-bottom:8px;text-align:center;cursor:pointer;transition:all .2s ease">
                  <div style="font-size:11.5px;font-weight:700;color:#00f0ff;display:flex;align-items:center;justify-content:center;gap:6px">
                    <span>📥</span> Drag &amp; Drop Images, 3D Models, or Links Here
                  </div>
                  <div style="font-size:10px;color:#a1a1aa;margin-top:2px">Binds dropped inspiration directly into character, world, or UI slots</div>
                </div>

                <!-- Quick Link Paste Bar -->
                <div style="display:flex;gap:6px;margin-bottom:10px">
                  <input id="asset-link-input" placeholder="Paste link (Pinterest, Sketchfab, ArtStation, GitHub)..." style="flex:1;background:rgba(8,10,14,0.85);border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:5px 8px;font-size:11px;color:#ffffff;outline:none">
                  <button class="btn ok" id="asset-link-add-btn" style="font-size:10.5px;padding:4px 10px">Add Link</button>
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
              <div class="glass-subcard" style="background:rgba(8,12,18,0.58);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:15px;display:flex;flex-direction:column">
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

// 3. Connect the Instant Inspiration Spark Pills in the Script
const sparkScript = `
// Clickable Instant Inspiration Spark Pills
document.querySelectorAll('.insp-spark-pill').forEach(btn => {
  btn.onclick = () => {
    const idea = btn.getAttribute('data-idea');
    if (decQ && idea) {
      decQ.value = idea;
      setStudioUnfolded(true);
      runDeconstructor(idea);
      toast('LOADED SPARK: ' + btn.textContent.trim().toUpperCase());
    }
  };
});
`;

const sparkMarker = "const zenFoldBtn = $('btn-zen-fold');";
const sparkMarkerIdx = html.indexOf(sparkMarker);
if (sparkMarkerIdx !== -1) {
  html = html.slice(0, sparkMarkerIdx) + sparkScript + '\n' + html.slice(sparkMarkerIdx);
}

fs.writeFileSync(htmlPath, html);
console.log('Successfully updated Clean-Cut Landscape UI with Prominent Command Center');
