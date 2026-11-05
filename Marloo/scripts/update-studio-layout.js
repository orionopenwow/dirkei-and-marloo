const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../app/index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// 1. Inject responsive & theme CSS before </style>
const styleEnd = html.indexOf('</style>');
if (styleEnd === -1) {
  throw new Error('</style> not found in index.html');
}

const customCss = `
/* Dynamic Theme Auras for Queen's Domain Studio */
#pj-explainer {
  transition: border-color .35s ease, box-shadow .35s ease, background .35s ease;
}
#pj-explainer.theme-souls {
  border-color: rgba(239, 68, 68, 0.45) !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.85), 0 0 35px rgba(220, 38, 38, 0.18), inset 0 1px 0 rgba(239,68,68,0.25) !important;
}
#pj-explainer.theme-cozy {
  border-color: rgba(16, 185, 129, 0.45) !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.85), 0 0 35px rgba(16, 185, 129, 0.18), inset 0 1px 0 rgba(16, 185, 129, 0.25) !important;
}
#pj-explainer.theme-scifi {
  border-color: rgba(6, 182, 212, 0.45) !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.85), 0 0 35px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(6, 182, 212, 0.25) !important;
}
#pj-explainer.theme-sand {
  border-color: rgba(245, 158, 11, 0.45) !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.85), 0 0 35px rgba(245, 158, 11, 0.18), inset 0 1px 0 rgba(245, 158, 11, 0.25) !important;
}
#pj-explainer.theme-pixel {
  border-color: rgba(168, 85, 247, 0.45) !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.85), 0 0 35px rgba(168, 85, 247, 0.18), inset 0 1px 0 rgba(168, 85, 247, 0.25) !important;
}
#pj-explainer.theme-horror {
  border-color: rgba(185, 28, 28, 0.5) !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.9), 0 0 40px rgba(185, 28, 28, 0.25), inset 0 1px 0 rgba(185, 28, 28, 0.3) !important;
}

/* Responsive Multi-Column Studio Grid */
.studio-lower-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 14px;
}
@media (min-width: 900px) {
  .studio-lower-grid {
    grid-template-columns: minmax(330px, 1fr) minmax(350px, 1.15fr);
  }
}
@media (min-width: 1260px) {
  .studio-lower-grid {
    grid-template-columns: 360px 1.1fr 340px;
  }
}

.glass-col {
  background: rgba(10,12,18,0.7);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 13px 15px;
  display: flex;
  flex-direction: column;
}

/* Preset Cards with Rich Gameplay Picture Headers */
.cg-insp-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all .2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}
.cg-insp-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 240, 255, 0.4);
  box-shadow: 0 8px 20px rgba(0,0,0,0.55), 0 0 14px rgba(0,240,255,0.18);
}
.cg-insp-card.active-preset {
  border-color: var(--gold) !important;
  background: rgba(251, 191, 36, 0.05) !important;
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.25) !important;
}

.insp-banner {
  height: 66px;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #090b10;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.insp-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .3s ease;
  filter: contrast(1.05) brightness(0.92);
}
.cg-insp-card:hover .insp-banner img {
  transform: scale(1.06);
  filter: contrast(1.1) brightness(1.02);
}
.insp-hud-tag {
  position: absolute;
  bottom: 4px;
  right: 5px;
  background: rgba(0,0,0,0.82);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 8.5px;
  font-family: monospace;
  color: #e4e4e7;
  letter-spacing: .02em;
}

/* Drag and Drop Asset Ingestion */
.asset-drop-target {
  margin-top: 10px;
  border: 2px dashed rgba(0,240,255,0.25);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  background: rgba(0,240,255,0.02);
  cursor: pointer;
  transition: all .2s ease;
}
.asset-drop-target:hover, .asset-drop-target.drag-over {
  border-color: #00f0ff;
  background: rgba(0,240,255,0.08);
  box-shadow: 0 0 18px rgba(0,240,255,0.25);
}

/* Rolling Inspiration Shelf (Pinterest / Horizontal Sliding Gallery) */
.rolling-shelf {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: thin;
}
.rolling-card {
  min-width: 135px;
  max-width: 135px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all .15s ease;
  flex-shrink: 0;
}
.rolling-card:hover {
  border-color: rgba(255,255,255,0.28);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.55);
}
.rolling-card-img {
  height: 68px;
  width: 100%;
  object-fit: cover;
  background: #090c12;
}

/* Claude Architecture Skills */
.skill-pill-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 6px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all .15s ease;
}
.skill-pill-card:hover {
  border-color: rgba(251,191,36,0.35);
  background: rgba(251,191,36,0.04);
}
`;

html = html.substring(0, styleEnd) + customCss + '\n' + html.substring(styleEnd);

// 2. Replace insp-cards-grid through the lower section up to Hidden Compatibility Elements
const startMarker = '<div id="insp-cards-grid"';
const endMarker = '<!-- Hidden Compatibility Elements for Test Invariants -->';

const sIdx = html.indexOf(startMarker);
const eIdx = html.indexOf(endMarker);

if (sIdx === -1 || eIdx === -1) {
  throw new Error(`Markers not found: sIdx=${sIdx}, eIdx=${eIdx}`);
}

const replacementSection = `<div id="insp-cards-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px">
              <!-- Card 1: 2D Pixel RPG -->
              <div class="cg-insp-card" id="dec-preset-pixel" data-cat="rpg retro">
                <div class="insp-banner">
                  <img src="presets/pixel_hero.svg" alt="2D Pixel RPG">
                  <span class="insp-hud-tag">❤ 3/3 · LV 1</span>
                </div>
                <div style="padding:8px 10px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                  <div>
                    <b style="font-size:11.5px;color:#ffffff;display:flex;align-items:center;gap:4px"><span>✦</span> 2D Pixel RPG</b>
                    <div style="font-size:10px;color:#a1a1aa;margin:3px 0 5px;line-height:1.3">16x16 tiles, retro walk cycle, village NPCs</div>
                  </div>
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
                    <span class="badge ok" style="font-size:8.5px">Tiny Town</span>
                    <span class="badge" style="font-size:8px;color:#a1a1aa">Jam ~12</span>
                  </div>
                </div>
              </div>

              <!-- Card 2: 3D Soulslike -->
              <div class="cg-insp-card" id="dec-preset-souls" data-cat="rpg action">
                <div class="insp-banner">
                  <img src="presets/souls.svg" alt="3D Souls">
                  <span class="insp-hud-tag">STAM ▓▓▓░ · PARRY</span>
                </div>
                <div style="padding:8px 10px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                  <div>
                    <b style="font-size:11.5px;color:#ffffff;display:flex;align-items:center;gap:4px"><span>⚔️</span> 3D Souls-Like</b>
                    <div style="font-size:10px;color:#a1a1aa;margin:3px 0 5px;line-height:1.3">Shoulder camera, stamina combat, dark castle</div>
                  </div>
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
                    <span class="badge act" style="font-size:8.5px">Castle Kit</span>
                    <span class="badge" style="font-size:8px;color:#a1a1aa">Indie ~32</span>
                  </div>
                </div>
              </div>

              <!-- Card 3: Cozy Farm Sim -->
              <div class="cg-insp-card" id="dec-preset-cozy" data-cat="cozy">
                <div class="insp-banner">
                  <img src="presets/cozy.svg" alt="Cozy Farm">
                  <span class="insp-hud-tag">☀️ 10:45 AM · 🌾84%</span>
                </div>
                <div style="padding:8px 10px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                  <div>
                    <b style="font-size:11.5px;color:#ffffff;display:flex;align-items:center;gap:4px"><span>🌾</span> 2D Cozy Farm</b>
                    <div style="font-size:10px;color:#a1a1aa;margin:3px 0 5px;line-height:1.3">15-min clock, seed-to-harvest crop economy</div>
                  </div>
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
                    <span class="badge ok" style="font-size:8.5px">Tiny Town</span>
                    <span class="badge" style="font-size:8px;color:#a1a1aa">Indie ~24</span>
                  </div>
                </div>
              </div>

              <!-- Card 4: 2D Sandbox Miner -->
              <div class="cg-insp-card" id="dec-preset-sandbox" data-cat="sand action">
                <div class="insp-banner">
                  <img src="presets/sandbox.svg" alt="Sandbox Miner">
                  <span class="insp-hud-tag">⛏️ -142m · TI</span>
                </div>
                <div style="padding:8px 10px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                  <div>
                    <b style="font-size:11.5px;color:#ffffff;display:flex;align-items:center;gap:4px"><span>⛏️</span> 2D Sandbox Miner</b>
                    <div style="font-size:10px;color:#a1a1aa;margin:3px 0 5px;line-height:1.3">Destructible voxel slice, mining tiers & safehouse</div>
                  </div>
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
                    <span class="badge no" style="font-size:8.5px">Dungeon Pack</span>
                    <span class="badge" style="font-size:8px;color:#a1a1aa">Jam ~16</span>
                  </div>
                </div>
              </div>

              <!-- Card 5: Cyberpunk Roguelike -->
              <div class="cg-insp-card" id="dec-preset-scifi" data-cat="rpg action">
                <div class="insp-banner">
                  <img src="presets/scifi.svg" alt="Cyberpunk Roguelike">
                  <span class="insp-hud-tag">SHIELD 100% · ⚡HACK</span>
                </div>
                <div style="padding:8px 10px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                  <div>
                    <b style="font-size:11.5px;color:#ffffff;display:flex;align-items:center;gap:4px"><span>🤖</span> Cyber Roguelike</b>
                    <div style="font-size:10px;color:#a1a1aa;margin:3px 0 5px;line-height:1.3">Isometric neon hacking nodes & drone combat</div>
                  </div>
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
                    <span class="badge ok" style="font-size:8.5px">Space Station</span>
                    <span class="badge" style="font-size:8px;color:#a1a1aa">Indie ~28</span>
                  </div>
                </div>
              </div>

              <!-- Card 6: Survival Horror -->
              <div class="cg-insp-card" id="dec-preset-horror" data-cat="action rpg">
                <div class="insp-banner">
                  <img src="presets/guardian_model.jpg" alt="Survival Horror">
                  <span class="insp-hud-tag">SANITY 42% · 🔦68%</span>
                </div>
                <div style="padding:8px 10px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                  <div>
                    <b style="font-size:11.5px;color:#ffffff;display:flex;align-items:center;gap:4px"><span>🕯️</span> Survival Horror</b>
                    <div style="font-size:10px;color:#a1a1aa;margin:3px 0 5px;line-height:1.3">Scarce ammo, flashlight raycasts & sanity</div>
                  </div>
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
                    <span class="badge act" style="font-size:8.5px">Castle / Crypt</span>
                    <span class="badge" style="font-size:8px;color:#a1a1aa">Indie ~30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Responsive Multi-Column Studio Section: Bottom Left Prompt + Center Asset Sheet + Right Rolling Inspiration -->
          <div class="studio-lower-grid" id="studio-lower-grid">
            
            <!-- Column 1: BOTTOM LEFT -> Ever-Evolving Game Prompt (LIVE) -->
            <div id="dock-prompt-col" class="glass-col">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                <b style="font-size:12.5px;color:#ffffff;letter-spacing:.02em">Ever-Evolving Game Prompt (LIVE)</b>
                <div style="display:flex;align-items:center;gap:6px">
                  <span id="prompt-token-meter" class="badge ok" style="font-size:9.5px;font-weight:bold" title="Estimated Context Tokens">~420 Tok (Safe)</span>
                  <span class="badge ok" style="font-size:9px">● LIVE SYNC</span>
                </div>
              </div>
              <div id="dock-prompt-meta" style="font-size:11px;color:#a1a1aa;margin-bottom:6px">Target: Unity C# | Vision: Action RPG | Protagonist: Guardian | Environment: Dungeon</div>
              
              <!-- Prompt Density Mode Pills -->
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                <span style="font-size:11px;font-weight:bold;color:#a1a1aa">Density Mode:</span>
                <div style="display:flex;align-items:center;gap:4px">
                  <button class="density-btn" id="prompt-density-lite" title="Concise single-pass prompt for Cursor/Copilot">⚡ Lite</button>
                  <button class="density-btn on" id="prompt-density-std" title="Balanced game architecture with state structs">⚙️ Standard</button>
                  <button class="density-btn" id="prompt-density-deep" title="Exhaustive Ponytail zero-GC rules & invariants">🏛️ Deep / Zero-GC</button>
                </div>
              </div>

              <!-- Interactive Nuance Chips Injector -->
              <div id="nuance-chips-bar" style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-bottom:8px">
                <span style="font-size:10.5px;font-weight:bold;color:#a1a1aa;margin-right:2px">+ Nuance:</span>
                <button class="nu-chip" id="chip-proc" title="Inject procedural map generation">+ Proc Map</button>
                <button class="nu-chip" id="chip-pad" title="Inject gamepad input ring buffer">+ Gamepad</button>
                <button class="nu-chip" id="chip-fog" title="Inject dynamic fog of war">+ Fog</button>
                <button class="nu-chip" id="chip-daynight" title="Inject day/night clock cycle">+ Day/Night</button>
                <button class="nu-chip" id="chip-save" title="Inject save monument serializer">+ Save</button>
                <button class="nu-chip" id="chip-juice" title="Inject combat hit-stop & screen shake">+ Screen Juice</button>
              </div>

              <textarea id="dec-prompt-preview" class="mono code" rows="8" readonly spellcheck="false" style="flex:1;width:100%;min-height:130px;background:rgba(6,8,12,0.92);border:1px solid rgba(255,255,255,0.08);color:#e4e4e7;border-radius:6px;padding:8px 10px;font-size:11px;line-height:1.45;resize:vertical;margin-bottom:8px"></textarea>
              
              <!-- Primary Action Buttons -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px">
                <button class="btn" id="dec-copy-prompt" style="padding:7px;font-size:11.5px;font-weight:bold;text-align:center;justify-content:center">
                  Copy Prompt (Standard)
                </button>
                <button class="btn gold" id="btn-dock-send-agent" style="padding:7px;font-size:11.5px;font-weight:bold;text-align:center;justify-content:center">
                  Send to Agent
                </button>
              </div>

              <!-- Savi & Live Companion In-Game Actions -->
              <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(0,240,255,0.18);border-radius:6px;padding:6px 8px;margin-bottom:6px">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                  <span style="font-size:10px;font-weight:bold;color:var(--cyan);letter-spacing:.02em">🎮 SAVI / SPAWN LIVE BRIDGE</span>
                  <span class="badge ok" style="font-size:8px">Connected</span>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
                  <button class="btn" id="btn-savi-paste" style="padding:4px 6px;font-size:10.5px;font-weight:bold;text-align:center;justify-content:center;background:rgba(0,240,255,0.06);border-color:rgba(0,240,255,0.3)" title="Paste prompt into Savi's tab window">
                    📋 Paste into Savi
                  </button>
                  <button class="btn act" id="btn-savi-execute" style="padding:4px 6px;font-size:10.5px;font-weight:bold;text-align:center;justify-content:center" title="Execute script live in Savi WebGL scene">
                    ⚡ Execute In Savi
                  </button>
                </div>
                <button class="icon-btn" id="btn-savi-quick-chat" style="width:100%;margin-top:4px;font-size:10px;padding:3px;text-align:center" title="Send quick agent command to live in-game companion">
                  💬 Send Command to In-Game Agent
                </button>
              </div>

              <!-- Quick CLI and Export Bar -->
              <div style="display:flex;gap:4px;flex-wrap:wrap">
                <button class="icon-btn" id="btn-copy-claude-cli" style="flex:1;min-width:70px;font-size:10px;padding:3px 5px;text-align:center" title="Copy claude -p command">⚡ Claude CLI</button>
                <button class="icon-btn" id="btn-copy-codex-cli" style="flex:1;min-width:70px;font-size:10px;padding:3px 5px;text-align:center" title="Copy codex exec command">⚡ Codex CLI</button>
                <button class="icon-btn" id="btn-export-prompt-md" style="flex:1;min-width:70px;font-size:10px;padding:3px 5px;text-align:center" title="Export prompt as Markdown">📄 Export .MD</button>
                <button class="icon-btn" id="btn-download-single-prompt-pack" style="flex:1;min-width:90px;font-size:10px;padding:3px 5px;text-align:center;color:var(--gold);border-color:rgba(251,191,36,0.3)" title="Download complete single-prompt starter zip">📦 Single-Prompt Kit</button>
              </div>
            </div>

            <!-- Column 2: CENTER -> Curated Game Asset Sheet & Live Drop Zone -->
            <div id="dock-assets-col" class="glass-col">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                <b style="font-size:12px;color:#ffffff;letter-spacing:.02em">Curated Asset Sheet (Local CC0 DB)</b>
                <div style="display:flex;align-items:center;gap:6px">
                  <button class="btn" id="btn-random-assets" style="padding:2px 8px;font-size:10.5px;font-weight:bold" title="Randomize compatible asset combo">🎲 Randomize</button>
                  <span class="badge ok" style="font-size:9px">LOCAL DB</span>
                </div>
              </div>

              <div style="display:flex;flex-direction:column;gap:5px;flex:1">
                <!-- Row 1: Protagonist -->
                <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 9px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
                  <div>
                    <div style="font-size:9.5px;font-weight:bold;color:#f43f5e;text-transform:uppercase">★ Protagonist</div>
                    <b id="ash-char-name" style="font-size:11.5px;color:#ffffff">Queen's Domain Guardian [3D Mesh]</b>
                    <div id="ash-char-specs" style="display:none"></div>
                  </div>
                  <div style="display:flex;align-items:center;gap:5px">
                    <button class="lock-btn" id="lock-char-btn" title="Lock/Unlock Slot from Randomization">🔓</button>
                    <span class="badge ok" style="font-size:8.5px">Slot 1</span>
                    <button class="icon-btn" id="sub-char-btn" title="Substitute Asset" style="padding:2px 6px;font-size:11px">☰</button>
                  </div>
                </div>

                <!-- Row 2: World & Environment -->
                <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 9px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
                  <div>
                    <div style="font-size:9.5px;font-weight:bold;color:var(--cyan);text-transform:uppercase">🌐 World & Environment</div>
                    <b id="ash-world-name" style="font-size:11.5px;color:#ffffff">Modular Dungeon Kit</b>
                    <div id="ash-world-specs" style="display:none"></div>
                  </div>
                  <div style="display:flex;align-items:center;gap:5px">
                    <button class="lock-btn" id="lock-world-btn" title="Lock/Unlock Slot from Randomization">🔓</button>
                    <span class="badge ok" style="font-size:8.5px">Slot 2</span>
                    <button class="icon-btn" id="sub-world-btn" title="Substitute Asset" style="padding:2px 6px;font-size:11px">☰</button>
                  </div>
                </div>

                <!-- Row 3: UI & HUD Kit -->
                <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 9px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
                  <div>
                    <div style="font-size:9.5px;font-weight:bold;color:#a855f7;text-transform:uppercase">🖥️ UI & HUD Kit</div>
                    <b id="ash-ui-name" style="font-size:11.5px;color:#ffffff">Minimal HUD</b>
                    <div id="ash-ui-specs" style="display:none"></div>
                  </div>
                  <div style="display:flex;align-items:center;gap:5px">
                    <button class="lock-btn" id="lock-ui-btn" title="Lock/Unlock Slot from Randomization">🔓</button>
                    <span class="badge ok" style="font-size:8.5px">Slot 4</span>
                    <button class="icon-btn" id="sub-ui-btn" title="Substitute Asset" style="padding:2px 6px;font-size:11px">☰</button>
                  </div>
                </div>

                <!-- Row 4: Audio & Sound FX -->
                <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 9px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
                  <div>
                    <div style="font-size:9.5px;font-weight:bold;color:#10b981;text-transform:uppercase">🎵 Audio & Sound FX</div>
                    <b id="ash-audio-name" style="font-size:11.5px;color:#ffffff">RPG SFX Pack</b>
                    <div id="ash-audio-specs" style="display:none"></div>
                  </div>
                  <div style="display:flex;align-items:center;gap:5px">
                    <button class="lock-btn" id="lock-audio-btn" title="Lock/Unlock Slot from Randomization">🔓</button>
                    <span class="badge ok" style="font-size:8.5px">Slot 5</span>
                    <button class="icon-btn" id="sub-audio-btn" title="Substitute Asset" style="padding:2px 6px;font-size:11px">☰</button>
                  </div>
                </div>
              </div>

              <!-- Expandable Sub In/Out Drawer -->
              <div id="asset-sub-drawer" style="display:none;margin-top:8px;background:rgba(6,8,12,0.95);border:1px solid rgba(0,240,255,0.25);border-radius:8px;padding:8px">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                  <b id="asset-sub-title" style="font-size:11px;color:var(--cyan)">SUBSTITUTE ASSET</b>
                  <button class="icon-btn" id="asset-sub-close" style="font-size:10px">✖ Close</button>
                </div>
                <div id="asset-sub-options" style="display:grid;grid-template-columns:1fr;gap:4px;max-height:140px;overflow-y:auto"></div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px">
                <button id="btn-view-asset-sheet" class="btn" style="padding:6px;font-size:10.5px;text-align:center;justify-content:center">
                  Full Asset Manifest
                </button>
                <button id="btn-copy-attribution" class="btn" style="padding:6px;font-size:10.5px;text-align:center;justify-content:center" title="Copy CC0 Attribution.md">
                  📋 CC0 Attribution
                </button>
              </div>

              <!-- Interactive Drag & Drop Asset Ingestion Zone -->
              <div class="asset-drop-target" id="asset-drop-zone">
                <div style="font-size:20px;line-height:1;margin-bottom:3px">📥</div>
                <b style="font-size:11px;color:#ffffff">Drag & Drop 3D GLBs or 2D Sprites</b>
                <div style="font-size:9.5px;color:#a1a1aa;margin-top:2px">Mesh & Screen Detection auto-injects into Asset Sheet & Prompt</div>
                <div id="drop-zone-status" style="font-size:9.5px;color:var(--cyan);margin-top:4px;font-weight:bold;display:none"></div>
              </div>
            </div>

            <!-- Column 3: RIGHT -> Responsive Inspiration Gallery & Claude Skills -->
            <div id="dock-inspiration-col" class="glass-col">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                <b style="font-size:11.5px;color:#ffffff;letter-spacing:.02em">🎨 Rolling Free 3D & Pixel Assets</b>
                <span class="badge ok" style="font-size:8.5px">CC0 CDN</span>
              </div>
              
              <!-- Rolling Pinterest / Sliding Shelf -->
              <div class="rolling-shelf" id="rolling-inspiration-shelf">
                <!-- Card A: Guardian 3D -->
                <div class="rolling-card">
                  <img src="presets/guardian_model.jpg" class="rolling-card-img" alt="Guardian">
                  <div style="padding:5px 6px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                    <div>
                      <b style="font-size:10px;color:#ffffff">Guardian Mesh</b>
                      <div style="font-size:8.5px;color:#a1a1aa">1,240 Tris · 3D Rigged</div>
                    </div>
                    <div style="display:flex;gap:3px;margin-top:4px">
                      <button class="icon-btn btn-roll-insert" data-glb="Queen's Domain Guardian" style="flex:1;font-size:8.5px;padding:2px" title="Insert into Spawn">🔗 Spawn</button>
                      <button class="icon-btn btn-roll-inject" data-slot="char" data-idx="0" style="flex:1;font-size:8.5px;padding:2px" title="Inject into Prompt">📋 Inject</button>
                    </div>
                  </div>
                </div>

                <!-- Card B: Pixel Knight -->
                <div class="rolling-card">
                  <img src="presets/pixel_hero.svg" class="rolling-card-img" alt="Pixel Hero">
                  <div style="padding:5px 6px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                    <div>
                      <b style="font-size:10px;color:#ffffff">Retro Knight</b>
                      <div style="font-size:8.5px;color:#a1a1aa">16x16px · 4-Dir Walk</div>
                    </div>
                    <div style="display:flex;gap:3px;margin-top:4px">
                      <button class="icon-btn btn-roll-insert" data-glb="Hero Knight 16x16" style="flex:1;font-size:8.5px;padding:2px" title="Insert into Spawn">🔗 Spawn</button>
                      <button class="icon-btn btn-roll-inject" data-slot="char" data-idx="1" style="flex:1;font-size:8.5px;padding:2px" title="Inject into Prompt">📋 Inject</button>
                    </div>
                  </div>
                </div>

                <!-- Card C: Castle Kit -->
                <div class="rolling-card">
                  <img src="presets/souls.svg" class="rolling-card-img" alt="Castle Kit">
                  <div style="padding:5px 6px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                    <div>
                      <b style="font-size:10px;color:#ffffff">Castle / Crypt</b>
                      <div style="font-size:8.5px;color:#a1a1aa">3,400 Tris · Snapping</div>
                    </div>
                    <div style="display:flex;gap:3px;margin-top:4px">
                      <button class="icon-btn btn-roll-insert" data-glb="Kenney Castle Kit" style="flex:1;font-size:8.5px;padding:2px" title="Insert into Spawn">🔗 Spawn</button>
                      <button class="icon-btn btn-roll-inject" data-slot="world" data-idx="0" style="flex:1;font-size:8.5px;padding:2px" title="Inject into Prompt">📋 Inject</button>
                    </div>
                  </div>
                </div>

                <!-- Card D: Tiny Town -->
                <div class="rolling-card">
                  <img src="presets/cozy.svg" class="rolling-card-img" alt="Tiny Town">
                  <div style="padding:5px 6px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                    <div>
                      <b style="font-size:10px;color:#ffffff">Tiny Town</b>
                      <div style="font-size:8.5px;color:#a1a1aa">16x16 · 240 Tiles</div>
                    </div>
                    <div style="display:flex;gap:3px;margin-top:4px">
                      <button class="icon-btn btn-roll-insert" data-glb="Tiny Town Kit" style="flex:1;font-size:8.5px;padding:2px" title="Insert into Spawn">🔗 Spawn</button>
                      <button class="icon-btn btn-roll-inject" data-slot="world" data-idx="1" style="flex:1;font-size:8.5px;padding:2px" title="Inject into Prompt">📋 Inject</button>
                    </div>
                  </div>
                </div>

                <!-- Card E: Voxel Mine -->
                <div class="rolling-card">
                  <img src="presets/sandbox.svg" class="rolling-card-img" alt="Voxel Cave">
                  <div style="padding:5px 6px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                    <div>
                      <b style="font-size:10px;color:#ffffff">Voxel Mining</b>
                      <div style="font-size:8.5px;color:#a1a1aa">Destructible Slice</div>
                    </div>
                    <div style="display:flex;gap:3px;margin-top:4px">
                      <button class="icon-btn btn-roll-insert" data-glb="Voxel Cave Kit" style="flex:1;font-size:8.5px;padding:2px" title="Insert into Spawn">🔗 Spawn</button>
                      <button class="icon-btn btn-roll-inject" data-slot="world" data-idx="5" style="flex:1;font-size:8.5px;padding:2px" title="Inject into Prompt">📋 Inject</button>
                    </div>
                  </div>
                </div>

                <!-- Card F: Cyber Mech -->
                <div class="rolling-card">
                  <img src="presets/scifi.svg" class="rolling-card-img" alt="Cyber Mech">
                  <div style="padding:5px 6px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                    <div>
                      <b style="font-size:10px;color:#ffffff">Cyber Mech</b>
                      <div style="font-size:8.5px;color:#a1a1aa">2,100 Tris · Emission</div>
                    </div>
                    <div style="display:flex;gap:3px;margin-top:4px">
                      <button class="icon-btn btn-roll-insert" data-glb="Cyber Mech 3D" style="flex:1;font-size:8.5px;padding:2px" title="Insert into Spawn">🔗 Spawn</button>
                      <button class="icon-btn btn-roll-inject" data-slot="char" data-idx="2" style="flex:1;font-size:8.5px;padding:2px" title="Inject into Prompt">📋 Inject</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Claude Code Architecture Skills Matrix -->
              <div style="margin-top:10px;border-top:1px solid rgba(255,255,255,0.08);padding-top:8px">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                  <b style="font-size:11px;color:var(--gold);letter-spacing:.02em">⚡ Claude Code Skills</b>
                  <span class="badge" style="font-size:8px;color:var(--cyan)">claude -p</span>
                </div>
                <div id="claude-skills-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
                  <div class="skill-pill-card">
                    <div>
                      <b style="font-size:9.5px;color:#ffffff">Fixed 60Hz Runner</b>
                      <div style="font-size:8px;color:#a1a1aa">Deterministic dt=1/60s loop</div>
                    </div>
                    <button class="icon-btn btn-copy-skill" data-skill="deterministic_60hz" style="margin-top:4px;font-size:8px;padding:2px" title="Copy skill for Claude Code">📋 Copy Skill</button>
                  </div>

                  <div class="skill-pill-card">
                    <div>
                      <b style="font-size:9.5px;color:#ffffff">Zero-GC Pooler</b>
                      <div style="font-size:8px;color:#a1a1aa">Pre-allocated ring buffers</div>
                    </div>
                    <button class="icon-btn btn-copy-skill" data-skill="zero_gc_pooler" style="margin-top:4px;font-size:8px;padding:2px" title="Copy skill for Claude Code">📋 Copy Skill</button>
                  </div>

                  <div class="skill-pill-card">
                    <div>
                      <b style="font-size:9.5px;color:#ffffff">Web Audio SFX</b>
                      <div style="font-size:8px;color:#a1a1aa">Procedural synth oscillator</div>
                    </div>
                    <button class="icon-btn btn-copy-skill" data-skill="web_audio_synth" style="margin-top:4px;font-size:8px;padding:2px" title="Copy skill for Claude Code">📋 Copy Skill</button>
                  </div>

                  <div class="skill-pill-card">
                    <div>
                      <b style="font-size:9.5px;color:#ffffff">GLTF/GLB Loader</b>
                      <div style="font-size:8px;color:#a1a1aa">Instanced meshes & shadows</div>
                    </div>
                    <button class="icon-btn btn-copy-skill" data-skill="gltf_loader" style="margin-top:4px;font-size:8px;padding:2px" title="Copy skill for Claude Code">📋 Copy Skill</button>
                  </div>
                </div>

                <div style="margin-top:6px;padding:6px 8px;background:rgba(251,191,36,0.05);border:1px solid rgba(251,191,36,0.2);border-radius:5px;font-size:9.5px;color:#d4d4d8;line-height:1.35">
                  <b style="color:var(--gold)">Single-Prompting:</b> Feed your evolving prompt + <code>AGENTS.md</code> into Claude Code to build a complete 60fps game in one generation.
                </div>
              </div>
            </div>

          </div>
          
          `;

html = html.substring(0, sIdx) + replacementSection + html.substring(eIdx);

// 3. Remove duplicate hidden preset buttons in the hidden div (since they are now in the DOM)
html = html.replace('<button id="dec-preset-scifi"></button><button id="dec-preset-horror"></button>', '');

// 4. Update JavaScript to wire theme aura, savi buttons, drag & drop, and rolling inspiration shelf
const runDecHook = 'function runDeconstructor(concept){';
const runDecIdx = html.indexOf(runDecHook);
if (runDecIdx !== -1) {
  const insertThemePoint = html.indexOf('const lang =', runDecIdx);
  if (insertThemePoint !== -1) {
    const themeAuraJs = `  // Dynamic Environment Theme Evolution
  const studioHero = $('pj-explainer');
  if (studioHero) {
    studioHero.classList.remove('theme-souls', 'theme-cozy', 'theme-scifi', 'theme-sand', 'theme-pixel', 'theme-horror');
    if (isSouls) studioHero.classList.add('theme-souls');
    else if (isCozy) studioHero.classList.add('theme-cozy');
    else if (isSand) studioHero.classList.add('theme-sand');
    else if (isScifi) studioHero.classList.add('theme-scifi');
    else studioHero.classList.add('theme-pixel');
  }
  document.querySelectorAll('.cg-insp-card').forEach(c => c.classList.remove('active-preset'));
  if (isSouls && pSouls) pSouls.classList.add('active-preset');
  else if (isCozy && pCozy) pCozy.classList.add('active-preset');
  else if (isSand && pSand) pSand.classList.add('active-preset');
  else if (isScifi && pScifi) pScifi.classList.add('active-preset');
  else if (pPixel) pPixel.classList.add('active-preset');
\n  `;
    html = html.substring(0, insertThemePoint) + themeAuraJs + html.substring(insertThemePoint);
  }
}

// 5. Wire Savi buttons, Drag & Drop, and Rolling Inspiration Shelf
const wireHook = "const btnCopyClCli = $('btn-copy-claude-cli');";
const wireIdx = html.indexOf(wireHook);
if (wireIdx !== -1) {
  const newFeaturesJs = `// Savi & Live Companion In-Game Actions
const btnSaviPaste = $('btn-savi-paste');
if (btnSaviPaste) {
  btnSaviPaste.onclick = () => {
    if (!decPrev) return;
    copy(decPrev.value);
    showTab('spawnbrowser');
    toast('📋 COPIED PROMPT! SWITCHED TO SAVI BROWSER WINDOW');
  };
}

const btnSaviExec = $('btn-savi-execute');
if (btnSaviExec) {
  btnSaviExec.onclick = async () => {
    if (!decPrev) return;
    toast('⚡ EXECUTING LIVE IN SAVI WEBGL ENGINE...');
    try {
      const res = await fetch('/api/spawn/bridge/inject-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: decPrev.value, title: 'Studio Injected Patch' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Execution failed');
      toast('✅ LIVE PATCH DISPATCHED TO SAVI COMPANION!');
    } catch (e) {
      toast('EXECUTION FAILED: ' + e.message);
    }
  };
}

const btnSaviChat = $('btn-savi-quick-chat');
if (btnSaviChat) {
  btnSaviChat.onclick = async () => {
    const msg = prompt('Enter command or agent prompt to send to in-game Savi companion:', 'Fix physics frame pacing to strict 60Hz and log entity count');
    if (!msg) return;
    try {
      await fetch('/api/spawn/bridge/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, role: 'user' })
      });
      toast('💬 COMMAND DISPATCHED TO IN-GAME AGENT COMPANION');
    } catch (e) {
      toast('BRIDGE CHAT FAILED: ' + e.message);
    }
  };
}

// Drag & Drop Ingestion Zone for 3D GLBs & 2D Sprites
const dropZone = $('asset-drop-zone');
const dropStatus = $('drop-zone-status');
if (dropZone) {
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (!files || !files.length) return;
    
    Array.from(files).forEach(file => {
      const name = file.name;
      const ext = name.split('.').pop().toLowerCase();
      const sizeKb = (file.size / 1024).toFixed(1);
      
      if (ext === 'glb' || ext === 'gltf') {
        const option = {
          name: name.replace(/\\.[^/.]+$/, '') + ' [Custom 3D Mesh]',
          path: 'assets/characters/' + name,
          specs: \`\${name} · \${sizeKb} KB · User Mesh\`
        };
        ASSET_SLOTS.char.options.push(option);
        ASSET_SLOTS.char.active = ASSET_SLOTS.char.options.length - 1;
        renderAssetSheet();
        runDeconstructor(decQ.value);
        if (dropStatus) {
          dropStatus.style.display = 'block';
          dropStatus.textContent = \`✓ Detected 3D Mesh: \${name} (\${sizeKb} KB) -> Injected into Protagonist Slot\`;
        }
        toast(\`✨ DETECTED 3D MESH: \${name} -> INJECTED!\`);
      } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'svg') {
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth || 32, h = img.naturalHeight || 32;
          const isSprite = w <= 64 && h <= 64;
          const option = {
            name: name.replace(/\\.[^/.]+$/, '') + (isSprite ? ' [Sprite]' : ' [Texture]'),
            path: 'assets/' + (isSprite ? 'sprites/' : 'textures/') + name,
            specs: \`\${name} · \${w}x\${h}px · \${sizeKb} KB\`
          };
          if (isSprite) {
            ASSET_SLOTS.char.options.push(option);
            ASSET_SLOTS.char.active = ASSET_SLOTS.char.options.length - 1;
          } else {
            ASSET_SLOTS.world.options.push(option);
            ASSET_SLOTS.world.active = ASSET_SLOTS.world.options.length - 1;
          }
          renderAssetSheet();
          runDeconstructor(decQ.value);
          if (dropStatus) {
            dropStatus.style.display = 'block';
            dropStatus.textContent = \`✓ Detected Art: \${name} (\${w}x\${h}px) -> Injected into \${isSprite ? 'Protagonist' : 'World'} Slot\`;
          }
          toast(\`✨ DETECTED ART: \${name} (\${w}x\${h}px) -> INJECTED!\`);
        };
        img.src = URL.createObjectURL(file);
      } else {
        toast(\`📁 RECEIVED FILE: \${name} (\${sizeKb} KB)\`);
      }
    });
  });
}

// Rolling Inspiration Shelf Actions (Insert to Spawn & Inject to Prompt)
document.addEventListener('click', (e) => {
  const insertBtn = e.target.closest('.btn-roll-insert');
  if (insertBtn) {
    const glbName = insertBtn.getAttribute('data-glb') || "Queen's Domain Guardian";
    toast(\`📥 INSERTING '\${glbName}' INTO SPAWN SCENE...\`);
    fetch('/api/spawn/bridge/insert-glb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ glbName, position: [0, 1, 0] })
    }).then(() => toast(\`✅ DISPATCHED INSERTION FOR '\${glbName}'\`))
      .catch(err => toast('INSERT FAILED: ' + err.message));
    return;
  }

  const injectBtn = e.target.closest('.btn-roll-inject');
  if (injectBtn) {
    const slot = injectBtn.getAttribute('data-slot');
    const idx = parseInt(injectBtn.getAttribute('data-idx'), 10);
    if (ASSET_SLOTS[slot] && ASSET_SLOTS[slot].options[idx]) {
      ASSET_SLOTS[slot].active = idx;
      renderAssetSheet();
      runDeconstructor(decQ.value);
      toast(\`📋 INJECTED \${ASSET_SLOTS[slot].options[idx].name} INTO PROMPT\`);
    }
    return;
  }

  const skillBtn = e.target.closest('.btn-copy-skill');
  if (skillBtn) {
    const skillType = skillBtn.getAttribute('data-skill');
    const skills = {
      deterministic_60hz: 'claude -p "Implement a strict 60Hz fixed timestep accumulator loop (dt = 0.01667s) in C#/TypeScript. Decouple rendering interpolation from physics ticks to eliminate collision tunneling and frame pacing stutter."',
      zero_gc_pooler: 'claude -p "Implement a zero-GC ring buffer object pool for projectiles, particles, and combat hit VFX. Pre-allocate all entity memory at startup and enforce zero runtime heap allocations during gameplay."',
      web_audio_synth: 'claude -p "Synthesize procedural sound effects using Web Audio API procedural nodes (OscillatorNode, GainNode) with zero external asset latency and instant fallback sound chips."',
      gltf_loader: 'claude -p "Implement an instanced Three.js GLTFLoader system with automatic shadow map casting, cached materials, and bounding box occlusion culling for 3D meshes."'
    };
    const cmd = skills[skillType] || 'claude -p "Build game architecture"';
    copy(cmd);
    toast('⚡ COPIED CLAUDE CODE SKILL COMMAND');
    return;
  }
});

// Single-Prompt Starter Kit Download
const btnSinglePromptPack = $('btn-download-single-prompt-pack');
if (btnSinglePromptPack) {
  btnSinglePromptPack.onclick = downloadStarterZip;
}

`;
  html = html.substring(0, wireIdx) + newFeaturesJs + html.substring(wireIdx);
}

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Successfully updated app/index.html with new studio layout, bottom-left prompt, gameplay picture panels, drag-and-drop, savi actions, rolling gallery, and claude skills.');
