const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../app/index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// 1. Update CSS for .cg-insp-card and .insp-thumb
const oldCardCssStart = html.indexOf('/* Preset Cards with Rich Gameplay Picture Headers */');
const oldCardCssEnd = html.indexOf('/* Drag and Drop Asset Ingestion */');

if (oldCardCssStart !== -1 && oldCardCssEnd !== -1) {
  const compactCss = `/* Compact Sleek Preset Sprite Cards */
.cg-insp-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all .18s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  min-height: 48px;
  box-sizing: border-box;
}
.cg-insp-card:hover {
  transform: translateY(-1px);
  border-color: rgba(0, 240, 255, 0.4);
  background: rgba(255,255,255,0.05);
  box-shadow: 0 4px 14px rgba(0,0,0,0.5), 0 0 10px rgba(0,240,255,0.15);
}
.cg-insp-card.active-preset {
  border-color: var(--gold) !important;
  background: rgba(251, 191, 36, 0.05) !important;
  box-shadow: 0 0 14px rgba(251, 191, 36, 0.22) !important;
}

.insp-thumb {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  overflow: hidden;
  background: #090b10;
  border: 1px solid rgba(255,255,255,0.1);
  flex: none;
  position: relative;
}
.insp-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .25s ease;
  filter: contrast(1.05) brightness(0.95);
}
.cg-insp-card:hover .insp-thumb img {
  transform: scale(1.1);
  filter: contrast(1.1) brightness(1.05);
}

`;
  html = html.substring(0, oldCardCssStart) + compactCss + html.substring(oldCardCssEnd);
}

// 2. Replace insp-cards-grid markup with the compact cards
const gridStart = html.indexOf('<div id="insp-cards-grid"');
const gridEnd = html.indexOf('<!-- Responsive Multi-Column Studio Section:');

if (gridStart === -1 || gridEnd === -1) {
  throw new Error(`Failed to find insp-cards-grid markers: ${gridStart}, ${gridEnd}`);
}

const compactGridMarkup = `<div id="insp-cards-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px">
              <!-- Card 1: 2D Pixel RPG -->
              <div class="cg-insp-card" id="dec-preset-pixel" data-cat="rpg retro">
                <div class="insp-thumb">
                  <img src="presets/pixel_hero.svg" alt="2D Pixel RPG">
                </div>
                <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:4px">
                    <b style="font-size:11px;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">✦ 2D Pixel RPG</b>
                    <span class="badge ok" style="font-size:8px;padding:1px 4px">Tiny Town</span>
                  </div>
                  <div style="font-size:9.5px;color:#a1a1aa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2;margin-top:2px">16x16 tiles, hero walk cycle, village NPCs</div>
                </div>
              </div>

              <!-- Card 2: 3D Soulslike -->
              <div class="cg-insp-card" id="dec-preset-souls" data-cat="rpg action">
                <div class="insp-thumb">
                  <img src="presets/souls.svg" alt="3D Souls">
                </div>
                <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:4px">
                    <b style="font-size:11px;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">⚔️ 3D Souls-Like</b>
                    <span class="badge act" style="font-size:8px;padding:1px 4px">Castle Kit</span>
                  </div>
                  <div style="font-size:9.5px;color:#a1a1aa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2;margin-top:2px">Shoulder camera, stamina combat, dark castle</div>
                </div>
              </div>

              <!-- Card 3: Cozy Farm Sim -->
              <div class="cg-insp-card" id="dec-preset-cozy" data-cat="cozy">
                <div class="insp-thumb">
                  <img src="presets/cozy.svg" alt="Cozy Farm">
                </div>
                <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:4px">
                    <b style="font-size:11px;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">🌾 2D Cozy Farm</b>
                    <span class="badge ok" style="font-size:8px;padding:1px 4px">Tiny Town</span>
                  </div>
                  <div style="font-size:9.5px;color:#a1a1aa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2;margin-top:2px">15-min clock, seed-to-harvest crop economy</div>
                </div>
              </div>

              <!-- Card 4: 2D Sandbox Miner -->
              <div class="cg-insp-card" id="dec-preset-sandbox" data-cat="sand action">
                <div class="insp-thumb">
                  <img src="presets/sandbox.svg" alt="Sandbox Miner">
                </div>
                <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:4px">
                    <b style="font-size:11px;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">⛏️ 2D Sandbox Miner</b>
                    <span class="badge no" style="font-size:8px;padding:1px 4px">Dungeon</span>
                  </div>
                  <div style="font-size:9.5px;color:#a1a1aa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2;margin-top:2px">Destructible voxel slice, underground mining</div>
                </div>
              </div>

              <!-- Card 5: Cyberpunk Roguelike -->
              <div class="cg-insp-card" id="dec-preset-scifi" data-cat="rpg action">
                <div class="insp-thumb">
                  <img src="presets/scifi.svg" alt="Cyberpunk Roguelike">
                </div>
                <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:4px">
                    <b style="font-size:11px;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">🤖 Cyber Roguelike</b>
                    <span class="badge ok" style="font-size:8px;padding:1px 4px">Station</span>
                  </div>
                  <div style="font-size:9.5px;color:#a1a1aa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2;margin-top:2px">Isometric neon hacking nodes & drone combat</div>
                </div>
              </div>

              <!-- Card 6: Survival Horror -->
              <div class="cg-insp-card" id="dec-preset-horror" data-cat="action rpg">
                <div class="insp-thumb">
                  <img src="presets/guardian_model.jpg" alt="Survival Horror">
                </div>
                <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:4px">
                    <b style="font-size:11px;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">🕯️ Survival Horror</b>
                    <span class="badge act" style="font-size:8px;padding:1px 4px">Crypt</span>
                  </div>
                  <div style="font-size:9.5px;color:#a1a1aa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2;margin-top:2px">Scarce ammo, flashlight raycasts & sanity</div>
                </div>
              </div>
            </div>
          </div>

          `;

html = html.substring(0, gridStart) + compactGridMarkup + html.substring(gridEnd);

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Successfully compacted preset sprite cards in app/index.html');
