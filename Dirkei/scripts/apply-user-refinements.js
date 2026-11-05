const fs = require('fs');
const path = require('path');

const htmlPath = 'C:/Users/campw/Desktop/QueensDomain/app/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Remove the clunky top header row and the gold pill from the hero card
// Find hero start
const heroStartStr = '<div class="explainer-hero" id="pj-explainer"';
const heroStartIdx = html.indexOf(heroStartStr);
const hiddenStartMarker = '<!-- Hidden Compatibility Elements for Test Invariants -->';
const hiddenStartIdx = html.indexOf(hiddenStartMarker);

if (heroStartIdx === -1 || hiddenStartIdx === -1) {
  console.error('Could not find heroStartIdx or hiddenStartMarker', { heroStartIdx, hiddenStartIdx });
  process.exit(1);
}

// Build the overhauled sleek Hero section:
// - NO top header row with steps and NO gold pill
// - Starts directly with "What kind of game would you like to create?"
// - Sleek prompt input
// - Full background images and slightly taller cards for presets
// - Left column is the "Inspiration & Asset Drop Canvas" for dragging/dropping links, images, 3D models
// - Right column is Ever-Evolving Game Prompt (LIVE)

const newHeroHtml = `<div class="explainer-hero" id="pj-explainer" style="max-width:1040px;margin:16px auto 24px;background:rgba(12,14,20,0.95);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:26px 30px;box-shadow:0 30px 80px rgba(0,0,0,0.85),inset 0 1px 0 rgba(255,255,255,0.1);position:relative;transition:all .3s ease">

          <!-- Hidden button for toggle compatibility -->
          <button id="btn-zen-fold" style="display:none">Toggle</button>

          <!-- CENTRAL BLANK SQUARE HERO -->
          <div id="zen-hero-square" style="text-align:center;max-width:820px;margin:0 auto 16px">
            <h1 style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-.025em;margin:0 0 8px">What kind of game would you like to create?</h1>
            <p style="font-size:13px;color:#a1a1aa;line-height:1.45;margin:0 auto 18px;max-width:680px">Describe your game vision in the chat bar below, or drop inspiration (images, Pinterest/Sketchfab links, 3D models .glb) to dynamically unfold your architecture.</p>

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
            <div id="zen-drop-zone" style="max-width:860px;margin:0 auto 12px;padding:12px 18px;background:rgba(255,255,255,0.02);border:1.5px dashed rgba(255,255,255,0.12);border-radius:12px;display:flex;align-items:center;justify-content:center;gap:12px;cursor:pointer;transition:all .2s ease">
              <span style="font-size:20px">🔮</span>
              <div style="text-align:left">
                <div style="font-size:12px;font-weight:700;color:#ffffff">Drag &amp; Drop Inspiration Anywhere Here</div>
                <div style="font-size:10.5px;color:#a1a1aa">Drop 3D models (.glb), pixel sprites, concept images, sound FX, or paste web links to auto-detect</div>
              </div>
              <span class="badge ok" style="font-size:9.5px;margin-left:auto">Auto-Detect ON</span>
            </div>

            <!-- Detected Inspiration Chips Bar -->
            <div id="zen-detected-chips" style="display:none;flex-wrap:wrap;justify-content:center;gap:8px;max-width:860px;margin:0 auto 12px"></div>
          </div>

          <!-- DYNAMIC UNFOLDED HUB (Unfolds when typing or dropping inspiration) -->
          <div id="studio-unfolded-hub" style="display:none;opacity:0;transform:translateY(12px);transition:opacity .35s ease, transform .35s ease">
            
            <!-- Sleek Modern Status Bar (Replacing the bulky header when unfolded) -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 14px;background:rgba(0,240,255,0.03);border:1px solid rgba(0,240,255,0.15);border-radius:8px;margin-bottom:14px;font-size:11.5px">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="color:#00f0ff">✦</span>
                <span id="dec-detected-theme" style="font-weight:700;color:#00f0ff">🎯 Detected: 3D Soulslike Action RPG</span>
                <span id="dec-scope-badge" class="badge ok" style="font-size:9.5px">📐 SCOPE: 24 STEPS</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px">
                <span style="color:#a1a1aa">Target Engine:</span>
                <select id="engine-quick-select" style="background:rgba(8,10,14,0.9);border:1px solid rgba(255,255,255,0.15);color:#ffffff;border-radius:6px;padding:3px 8px;font-size:11.5px;font-weight:bold;outline:none">
                  <option value="unity">Unity C# (Deterministic 60Hz)</option>
                  <option value="godot">Godot 4 (GDScript / C#)</option>
                  <option value="unreal">Unreal Engine 5 (C++ / Blueprints)</option>
                  <option value="spawn">Spawn.co (TypeScript / Savi WebGL)</option>
                </select>
              </div>
            </div>

            <!-- Inspiration & Game Presets (TALLER CARDS WITH FULL BACKGROUND IMAGES) -->
            <div style="margin-bottom:14px">
              <div style="font-size:11.5px;font-weight:bold;color:#a1a1aa;margin-bottom:8px">Inspiration &amp; Game Presets (1-Click Fill &amp; Local DB Search)</div>
              
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px" id="insp-cards-grid">
                <!-- Card 1: 2D Pixel RPG (Full Background Image) -->
                <div class="cg-insp-card" id="dec-preset-pixel" style="background:linear-gradient(180deg, rgba(10,12,18,0.65) 0%, rgba(10,12,18,0.92) 100%), url('presets/pixel_tilesheet.svg') center/cover no-repeat;border:1px solid rgba(0,240,255,0.22);border-radius:10px;padding:14px;min-height:110px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:all .2s ease;box-shadow:0 4px 14px rgba(0,0,0,0.5)">
                  <div>
                    <b style="font-size:12.5px;color:#ffffff;display:flex;align-items:center;gap:6px;text-shadow:0 1px 3px rgba(0,0,0,0.8)"><span>✦</span> 2D Pixel Art RPG</b>
                    <div style="font-size:11px;color:#d4d4d8;margin-top:6px;line-height:1.35;text-shadow:0 1px 2px rgba(0,0,0,0.9)">16x16 top-down tiles, retro hero walk cycle, village NPCs &amp; inventory</div>
                  </div>
                  <div>
                    <span class="badge ok" style="font-size:9.5px;background:rgba(16,185,129,0.25);border-color:rgba(16,185,129,0.5)">Tiny Town · Godot/Unity</span>
                  </div>
                </div>

                <!-- Card 2: 3D Soulslike (Full Background Image) -->
                <div class="cg-insp-card" id="dec-preset-souls" style="background:linear-gradient(180deg, rgba(10,12,18,0.65) 0%, rgba(10,12,18,0.92) 100%), url('presets/souls.svg') center/cover no-repeat;border:1px solid rgba(251,191,36,0.3);border-radius:10px;padding:14px;min-height:110px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:all .2s ease;box-shadow:0 4px 14px rgba(0,0,0,0.5)">
                  <div>
                    <b style="font-size:12.5px;color:#ffffff;display:flex;align-items:center;gap:6px;text-shadow:0 1px 3px rgba(0,0,0,0.8)"><span>⚔️</span> 3D Low-Poly Souls</b>
                    <div style="font-size:11px;color:#d4d4d8;margin-top:6px;line-height:1.35;text-shadow:0 1px 2px rgba(0,0,0,0.9)">Over-the-shoulder camera, committed stamina combat, dark castle kit</div>
                  </div>
                  <div>
                    <span class="badge act" style="font-size:9.5px;background:rgba(251,191,36,0.25);border-color:rgba(251,191,36,0.5)">Castle Kit · Unity C#</span>
                  </div>
                </div>

                <!-- Card 3: Cozy Farm Sim (Full Background Image) -->
                <div class="cg-insp-card" id="dec-preset-cozy" style="background:linear-gradient(180deg, rgba(10,12,18,0.65) 0%, rgba(10,12,18,0.92) 100%), url('presets/cozy.svg') center/cover no-repeat;border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:14px;min-height:110px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:all .2s ease;box-shadow:0 4px 14px rgba(0,0,0,0.5)">
                  <div>
                    <b style="font-size:12.5px;color:#ffffff;display:flex;align-items:center;gap:6px;text-shadow:0 1px 3px rgba(0,0,0,0.8)"><span>🌾</span> 2D Cozy Farm Sim</b>
                    <div style="font-size:11px;color:#d4d4d8;margin-top:6px;line-height:1.35;text-shadow:0 1px 2px rgba(0,0,0,0.9)">15-minute daily clock, seed to harvest crop economy, peaceful ambient mix</div>
                  </div>
                  <div>
                    <span class="badge ok" style="font-size:9.5px;background:rgba(16,185,129,0.25);border-color:rgba(16,185,129,0.5)">Tiny Town · Godot 4</span>
                  </div>
                </div>

                <!-- Card 4: 2D Sandbox Miner (Full Background Image) -->
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

            <!-- Split Lower Section (Left: Inspiration & Asset Drop Canvas | Right: Live Prompt Dock) -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
              
              <!-- Left Column: INSPIRATION & ASSET DROP CANVAS -->
              <div id="asset-drop-canvas-panel" style="background:rgba(10,12,18,0.7);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px;display:flex;flex-direction:column">
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

// 2. Change Active Game Blueprints to Created Projects
html = html.replace('<h2 style="flex:1;border:none;margin:0">Active Game Blueprints</h2>', '<h2 style="flex:1;border:none;margin:0">Created Projects</h2>');
html = html.replace('Open any project below to view its step-by-step prompts, run the AI auditor, import matching asset packs, or push commits to GitHub.', 'Open any created project to copy its prompt, launch into your AI agent, or work on code.');

// 3. Overhaul renderProjects in the script
// Locate renderProjects function
const renderProjectsStart = 'function renderProjects(){';
const renderProjectsIdx = html.indexOf(renderProjectsStart);
const renderProjectsEnd = html.indexOf("$('sb-newproj').onclick", renderProjectsIdx);

if (renderProjectsIdx === -1 || renderProjectsEnd === -1) {
  console.error('Could not find renderProjects boundaries', { renderProjectsIdx, renderProjectsEnd });
  process.exit(1);
}

const newRenderProjects = `function renderProjects(){
  sbProj();try{designBanner()}catch(e){}
  const g=$('pj-grid');g.innerHTML='';

  // Wire up suggested action cards if present
  const aQd = $('act-start-qd'), aCust = $('act-create-custom'), aAss = $('act-browse-assets');
  if(aQd) aQd.onclick = () => openProject('qd');
  if(aCust) aCust.onclick = () => $('pj-new').click();
  if(aAss) aAss.onclick = () => showTab('assets');

  // Simple clean card generator for created projects
  const card=(p,steps,d)=>{
    const c=el('div','pjcard'+(store.active===p.id?' act':''));
    c.style.cssText='background:rgba(14,16,22,0.85);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:10px;box-shadow:0 8px 24px rgba(0,0,0,0.5)';
    
    // Thumbnail preview
    const imgWrap=el('div','pj-img-wrap');
    imgWrap.style.cssText='height:110px;border-radius:8px;overflow:hidden;background:#080a0e;display:flex;align-items:center;justify-content:center';
    const img=el('img','pj-gallery-img');
    img.src=getPresetSvg(p);
    img.alt=p.name;
    img.style.cssText='width:100%;height:100%;object-fit:cover';
    imgWrap.append(img);
    c.append(imgWrap);

    // Title & engine info
    const topRow=el('div','row');topRow.style.alignItems='center';
    const pTitle = el('b',null,p.name+(p.preset?' (Preset)':''));
    pTitle.style.fontSize = '13.5px';
    const pBadge = el('span','badge ok', p.preset ? 'READY' : 'ACTIVE');
    topRow.append(pTitle, pBadge);
    c.append(topRow);

    // Project Prompt Snippet (Clean & Simple)
    let promptSnippet = '';
    try {
      const stepsArr = p.preset ? [] : generate(p.profile);
      promptSnippet = stepsArr[0] && stepsArr[0].prompt ? stepsArr[0].prompt.slice(0, 160) + '...' : '[PONYTAIL ARCHITECTURE ENGINE]\\nGame: "' + p.name + '"\\nFixed 60Hz loop with isolated state structs.';
    } catch(err) {
      promptSnippet = '[PONYTAIL ARCHITECTURE ENGINE]\\nGame: "' + p.name + '"';
    }

    const prePrompt = el('pre', null, promptSnippet);
    prePrompt.style.cssText = 'background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:8px 10px;font-size:10px;color:#00f0ff;font-family:monospace;white-space:pre-wrap;height:55px;overflow:hidden;margin:0;line-height:1.35';
    c.append(prePrompt);

    // Simple Action Buttons: [Copy Prompt] & [Work on Project]
    const row=el('div','row');
    row.style.gap = '8px';
    
    const cpBtn = el('button', 'btn', '📋 Copy Prompt');
    cpBtn.style.cssText = 'flex:1;font-size:11px;padding:6px';
    cpBtn.onclick = () => {
      try {
        const stepsArr = p.preset ? [] : generate(p.profile);
        const fullPrompt = stepsArr[0] ? stepsArr[0].prompt : promptSnippet;
        copy(fullPrompt);
        toast('COPIED PROMPT FOR ' + p.name.toUpperCase());
      } catch(e) {
        copy(promptSnippet);
        toast('COPIED PROMPT');
      }
    };

    const workBtn = el('button', 'btn gold', '⚡ Work on Project');
    workBtn.style.cssText = 'flex:1.2;font-size:11px;padding:6px;font-weight:bold';
    workBtn.onclick = () => openProject(p.id);

    row.append(cpBtn, workBtn);

    if(!p.preset){
      const delBtn = el('button', 'icon-btn', '🗑');
      delBtn.title = 'Delete Project';
      delBtn.style.cssText = 'padding:4px 8px;font-size:12px;color:var(--red);border-color:rgba(244,63,94,0.3)';
      delBtn.onclick = () => {
        if(confirm(\`Delete "\${p.name}"?\`)){
          store.list = store.list.filter(y => y.id !== p.id);
          if(store.active === p.id) loadProject('qd');
          ls.set('qd.projects', JSON.stringify(store));
          render();
          renderProjects();
        }
      };
      row.append(delBtn);
    }

    c.append(row);
    g.append(c);
  };

  // Render preset & user projects
  card(QD, 50, store.qd.done.length);
  store.list.forEach(p => card(p, generate(p.profile).length, p.done.length));

  // If no custom projects, show clean blank created projects notice
  if (store.list.length === 0) {
    const blankNotice = el('div');
    blankNotice.style.cssText = 'grid-column:1/-1;text-align:center;padding:24px 18px;background:rgba(255,255,255,0.02);border:1.5px dashed rgba(255,255,255,0.1);border-radius:12px';
    blankNotice.innerHTML = '<div style="font-size:22px;margin-bottom:6px">🎮</div><b style="font-size:13px;color:#ffffff">No Custom Projects Created Yet</b><p style="font-size:11.5px;color:#a1a1aa;margin:4px auto 10px;max-width:380px">Describe your game vision in the prompt bar above or click "+ Create New Project" to generate your first architecture prompt.</p><button class="btn gold" style="font-size:11px;padding:6px 14px" onclick="$(\\'pj-new\\').click()">+ Create Project</button>';
    g.append(blankNotice);
  }
}
`;

html = html.slice(0, renderProjectsIdx) + newRenderProjects + '\n' + html.slice(renderProjectsEnd);

// 4. Connect the Inspiration & Asset Drop Canvas (drag-and-drop & link add in left pane)
const linkHandlerScript = `
// Left Pane: Drag & Drop and Link Inspector Handlers
const assetPaneDropZone = $('asset-pane-drop-zone');
const assetLinkInput = $('asset-link-input');
const assetLinkAddBtn = $('asset-link-add-btn');

if (assetPaneDropZone) {
  assetPaneDropZone.onclick = () => {
    if (zenFileInput) zenFileInput.click();
  };
  ['dragenter', 'dragover'].forEach(evName => {
    assetPaneDropZone.addEventListener(evName, (e) => {
      e.preventDefault(); e.stopPropagation();
      assetPaneDropZone.style.borderColor = '#00f0ff';
      assetPaneDropZone.style.background = 'rgba(0,240,255,0.1)';
    }, false);
  });
  ['dragleave', 'drop'].forEach(evName => {
    assetPaneDropZone.addEventListener(evName, (e) => {
      e.preventDefault(); e.stopPropagation();
      assetPaneDropZone.style.borderColor = 'rgba(0,240,255,0.3)';
      assetPaneDropZone.style.background = 'rgba(0,240,255,0.03)';
    }, false);
  });
  assetPaneDropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt ? dt.files : null;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        handleInspirationFile(files[i]);
      }
    }
  }, false);
}

if (assetLinkAddBtn && assetLinkInput) {
  assetLinkAddBtn.onclick = () => {
    const url = assetLinkInput.value.trim();
    if (!url) return;
    try {
      const u = new URL(url);
      const host = u.hostname.replace('www.', '');
      let label = 'Web Inspiration';
      if (host.includes('pinterest')) label = 'Pinterest Board';
      else if (host.includes('sketchfab')) label = 'Sketchfab 3D Model';
      else if (host.includes('artstation')) label = 'ArtStation Artwork';
      else if (host.includes('github')) label = 'GitHub Repo Asset';
      
      addDetectedChip({ name: host + u.pathname.slice(0, 16), type: 'link', badge: '🔗 ' + label, role: 'Reference Link' });
      assetLinkInput.value = '';
      toast('BOUND INSPIRATION LINK: ' + label.toUpperCase());
    } catch(err) {
      addDetectedChip({ name: url.slice(0, 24), type: 'link', badge: '🔗 Web Link', role: 'Inspiration' });
      assetLinkInput.value = '';
      toast('ADDED INSPIRATION LINK');
    }
  };
}
`;

const linkMarker = "renderAssetSheet();";
const linkMarkerIdx = html.indexOf(linkMarker);
if (linkMarkerIdx !== -1) {
  html = html.slice(0, linkMarkerIdx) + linkHandlerScript + '\n' + html.slice(linkMarkerIdx);
}

fs.writeFileSync(htmlPath, html);
console.log('Successfully updated app/index.html with all 4 UI refinements!');
