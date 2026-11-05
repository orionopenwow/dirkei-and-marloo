// Asset Browser data: free CC0 packs that fit a project. Pure (no DOM, no network); loaded after wizard.js.
// Kenney's page names were checked against kenney.nl on 2026-11-04. The pack tags (art, vibe, genre) are my judgement from the pack titles and previews, not Kenney's own.
// To add a pack: add a row. [slug, label, kind, dims, arts, vibes, genres, what it is]
//   kind: world (characters, tiles, props) | ui | sound | fx | font      dims: '2' | '3' | '*'
//   arts / vibes / genres: ids from the questions; [] means "fits anything"
const KENNEY = 'https://kenney.nl/assets/';
const ASSET_PACKS = [
  ['pixel-platformer', 'Pixel Platformer', 'world', '2', ['pixel'], ['story', 'cosy', 'highfan'], ['platformer', 'metroidvania', 'adventure'], 'Characters, tiles and items for side-scrolling pixel games'],
  ['pixel-platformer-industrial-expansion', 'Pixel Platformer: Industrial', 'world', '2', ['pixel'], ['cyber', 'scifi', 'postapoc', 'urban'], ['platformer'], 'Factory and machine tiles that extend Pixel Platformer'],
  ['pixel-platformer-food-expansion', 'Pixel Platformer: Food', 'world', '2', ['pixel'], ['cosy', 'story'], ['platformer', 'cozy'], 'Food and kitchen tiles that extend Pixel Platformer'],
  ['pixel-platformer-farm-expansion', 'Pixel Platformer: Farm', 'world', '2', ['pixel'], ['cosy', 'story'], ['platformer', 'cozy', 'sim'], 'Farm tiles and animals that extend Pixel Platformer'],
  ['tiny-town', 'Tiny Town', 'world', '2', ['pixel'], ['cosy', 'story', 'highfan'], ['rpg', 'cozy', 'adventure', 'sim', 'strategy'], 'Top-down village tiles: houses, trees, fences, people'],
  ['tiny-dungeon', 'Tiny Dungeon', 'world', '2', ['pixel'], ['highfan', 'grim', 'spooky'], ['rpg', 'roguelike', 'arpg', 'adventure'], 'Top-down dungeon tiles, heroes and monsters'],
  ['tiny-battle', 'Tiny Battle', 'world', '2', ['pixel'], ['highfan', 'grim'], ['strategy', 'tower'], 'Small armies and a battlefield for tactics games'],
  ['roguelike-rpg-pack', 'Roguelike / RPG Pack', 'world', '2', ['pixel'], ['highfan', 'grim'], ['rpg', 'roguelike', 'arpg', 'adventure'], 'A big sheet of dungeon, town and nature tiles'],
  ['roguelike-characters', 'Roguelike Characters', 'world', '2', ['pixel'], ['highfan', 'grim', 'story'], ['rpg', 'roguelike', 'arpg'], 'Many mix-and-match pixel heroes and monsters'],
  ['roguelike-modern-city', 'Roguelike Modern City', 'world', '2', ['pixel'], ['urban', 'postapoc', 'cyber'], ['rpg', 'roguelike', 'adventure', 'survival'], 'Modern streets, cars and buildings in pixels'],
  ['rpg-urban-pack', 'RPG Urban Pack', 'world', '2', ['pixel'], ['urban', 'postapoc'], ['rpg', 'adventure', 'survival'], 'City tiles, vehicles and props'],
  ['1-bit-pack', '1-Bit Pack', 'world', '2', ['pixel', 'hand'], ['fever', 'grim', 'spooky', 'retro80'], [], 'Two-colour tiles for a stark, stylish look'],
  ['1-bit-platformer-pack', '1-Bit Platformer Pack', 'world', '2', ['pixel'], ['fever', 'retro80'], ['platformer'], 'Two-colour platformer tiles and characters'],
  ['pixel-shmup', 'Pixel Shmup', 'world', '2', ['pixel'], ['scifi', 'retro80'], [], 'Ships, enemies and bullets for a pixel shoot-em-up'],
  ['pixel-line-platformer', 'Pixel Line Platformer', 'world', '2', ['pixel', 'hand'], ['fever', 'retro80', 'story'], ['platformer', 'puzzle'], 'Thin-line pixel platformer art'],
  ['scribble-dungeons', 'Scribble Dungeons', 'world', '2', ['hand'], ['fever', 'story', 'highfan'], ['rpg', 'roguelike', 'adventure'], 'Hand-scribbled dungeon tiles and monsters'],
  ['top-down-shooter', 'Top-down Shooter', 'world', '2', ['toon', 'hand'], ['postapoc', 'urban', 'scifi'], ['arpg', 'roguelike', 'survival'], 'Soldiers, zombies, weapons and tiles seen from above'],
  ['tower-defense-top-down', 'Tower Defense (Top-Down)', 'world', '2', ['toon'], [], ['tower'], 'Towers, enemies and paths'],
  ['space-shooter-redux', 'Space Shooter Remastered', 'world', '2', ['toon'], ['scifi', 'retro80'], [], 'Ships, lasers and meteors'],
  ['desert-shooter-pack', 'Desert Shooter Pack', 'world', '2', ['toon'], ['west', 'postapoc'], ['arpg', 'roguelike'], 'Desert tiles, vehicles and soldiers'],
  ['animal-pack-redux', 'Animal Pack Remastered', 'world', '2', ['toon'], ['cosy', 'story'], ['cozy', 'sim', 'platformer', 'adventure'], 'Cartoon animals'],
  ['background-elements-redux', 'Background Elements Remastered', 'world', '2', ['toon'], ['story', 'cosy'], ['platformer'], 'Clouds, hills and trees for backgrounds'],
  ['platformer-characters', 'Platformer Characters', 'world', '2', ['toon'], ['story', 'cosy'], ['platformer'], 'Cartoon heroes with walk and jump frames'],
  ['shape-characters', 'Shape Characters', 'world', '2', ['toon', 'hand'], ['fever', 'story'], ['puzzle', 'platformer'], 'Simple blobs with faces'],
  ['monster-builder-pack', 'Monster Builder Pack', 'world', '2', ['toon'], ['fever', 'spooky', 'story'], [], 'Mix-and-match monster parts'],
  ['cartography-pack', 'Cartography Pack', 'world', '2', ['hand'], ['highfan', 'nautical', 'story'], ['adventure', 'strategy', 'rpg'], 'Map icons and paper textures'],
  ['isometric-miniature-dungeon', 'Isometric Miniature Dungeon', 'world', '2', ['toon', 'lowpoly'], ['highfan', 'grim'], ['rpg', 'roguelike', 'arpg'], 'Isometric dungeon sprites'],
  ['isometric-roads', 'Isometric Roads', 'world', '2', ['toon'], ['urban'], ['sim', 'racing', 'strategy'], 'Isometric road tiles'],
  ['nature-kit', 'Nature Kit', 'world', '3', ['lowpoly', 'toon'], ['cosy', 'story', 'highfan', 'postapoc'], ['survival', 'cozy', 'adventure', 'rpg'], '3D trees, rocks, plants and paths'],
  ['survival-kit', 'Survival Kit', 'world', '3', ['lowpoly', 'toon'], ['postapoc', 'cosy'], ['survival', 'cozy'], '3D camp, tools, crates and fences'],
  ['fantasy-town-kit', 'Fantasy Town Kit', 'world', '3', ['lowpoly', 'toon'], ['highfan', 'story', 'cosy'], ['rpg', 'cozy', 'adventure', 'strategy'], '3D medieval houses, walls and market stalls'],
  ['castle-kit', 'Castle Kit', 'world', '3', ['lowpoly', 'toon'], ['highfan', 'grim'], ['strategy', 'rpg', 'arpg', 'tower'], '3D castle walls, towers and gates'],
  ['graveyard-kit', 'Graveyard Kit', 'world', '3', ['lowpoly'], ['spooky', 'grim'], ['horror', 'adventure', 'arpg'], '3D tombstones, crypts and dead trees'],
  ['pirate-kit', 'Pirate Kit', 'world', '3', ['lowpoly', 'toon'], ['nautical', 'story'], ['adventure', 'rpg', 'arpg'], '3D ships, cannons and islands'],
  ['space-kit', 'Space Kit', 'world', '3', ['lowpoly'], ['scifi', 'cyber', 'retro80'], ['strategy', 'fps', 'adventure', 'racing'], '3D spaceships, bases and planets'],
  ['space-station-kit', 'Space Station Kit', 'world', '3', ['lowpoly'], ['scifi', 'cyber'], ['fps', 'horror', 'adventure', 'survival'], '3D corridors, doors and rooms'],
  ['modular-dungeon-kit', 'Modular Dungeon Kit', 'world', '3', ['lowpoly'], ['highfan', 'grim', 'spooky'], ['rpg', 'roguelike', 'arpg', 'horror'], '3D dungeon pieces that snap together'],
  ['modular-buildings', 'Modular Buildings', 'world', '3', ['lowpoly'], ['urban', 'postapoc', 'cyber'], [], '3D building pieces'],
  ['city-kit-commercial', 'City Kit (Commercial)', 'world', '3', ['lowpoly'], ['urban', 'cyber'], ['racing', 'sim', 'adventure'], '3D shops and skyscrapers'],
  ['city-kit-suburban', 'City Kit (Suburban)', 'world', '3', ['lowpoly'], ['urban', 'cosy'], ['racing', 'sim', 'adventure'], '3D houses, fences and streets'],
  ['building-kit', 'Building Kit', 'world', '3', ['lowpoly'], ['urban'], ['sim', 'strategy'], '3D building blocks'],
  ['racing-kit', 'Racing Kit', 'world', '3', ['lowpoly'], ['urban', 'retro80'], ['racing'], '3D track pieces and cars'],
  ['car-kit', 'Car Kit', 'world', '3', ['lowpoly'], ['urban', 'retro80'], ['racing'], '3D cars'],
  ['platformer-kit', 'Platformer Kit', 'world', '3', ['lowpoly'], ['story', 'cosy'], ['platformer'], '3D platforms, coins and hazards'],
  ['tower-defense-kit', 'Tower Defense Kit', 'world', '3', ['lowpoly'], [], ['tower'], '3D towers, enemies and tiles'],
  ['hexagon-kit', 'Hexagon Kit', 'world', '3', ['lowpoly', 'toon'], [], ['strategy', 'sim', 'tower'], '3D hex tiles for maps and boards'],
  ['medieval-rts', 'Medieval RTS', 'world', '3', ['lowpoly'], ['highfan', 'grim'], ['strategy'], '3D medieval strategy buildings and units'],
  ['blocky-characters', 'Blocky Characters', 'world', '3', ['lowpoly', 'voxel'], ['story', 'fever'], [], 'Cube-style 3D characters'],
  ['animated-characters-1', 'Animated Characters', 'world', '3', ['toon', 'lowpoly'], ['urban', 'story'], [], '3D characters with animations'],
  ['mini-characters', 'Mini Characters', 'world', '3', ['lowpoly', 'toon'], ['cosy', 'story'], [], 'Small cute 3D people'],
  ['toon-characters-1', 'Toon Characters', 'world', '3', ['toon'], ['story', 'cosy'], [], 'Cartoon 3D characters'],
  ['furniture-kit', 'Furniture Kit', 'world', '3', ['lowpoly'], ['cosy', 'urban'], ['cozy', 'sim', 'horror'], '3D furniture for rooms'],
  ['food-kit', 'Food Kit', 'world', '3', ['lowpoly', 'toon'], ['cosy'], ['cozy', 'sim'], '3D food items'],
  ['holiday-kit', 'Holiday Kit', 'world', '3', ['lowpoly'], ['cosy', 'story', 'spooky'], ['cozy'], '3D seasonal decorations'],
  ['cube-pets', 'Cube Pets', 'world', '3', ['voxel', 'lowpoly'], ['cosy', 'fever'], ['cozy'], 'Cube-shaped 3D animals'],
  ['conveyor-kit', 'Factory Kit', 'world', '3', ['lowpoly'], ['cyber', 'scifi', 'urban'], ['sim', 'puzzle'], '3D conveyors and machines'],
  ['prototype-textures', 'Prototype Textures', 'world', '*', [], [], [], 'Plain grid textures for blocking out levels (fits everything)'],
  ['ui-pack', 'UI Pack', 'ui', '*', ['toon', 'hand', 'lowpoly'], [], [], 'Buttons, panels and sliders'],
  ['ui-pack-pixel-adventure', 'UI Pack: Pixel Adventure', 'ui', '*', ['pixel', 'ps1'], ['highfan', 'story', 'cosy'], [], 'Pixel buttons, panels and bars'],
  ['ui-pack-sci-fi', 'UI Pack: Sci-Fi', 'ui', '*', [], ['scifi', 'cyber', 'retro80'], [], 'Sci-fi buttons, panels and bars'],
  ['ui-pack-rpg-expansion', 'UI Pack: RPG Expansion', 'ui', '*', [], ['highfan', 'grim', 'west'], ['rpg', 'arpg', 'adventure'], 'Parchment and wood RPG panels'],
  ['fantasy-ui-borders', 'Fantasy UI Borders', 'ui', '*', [], ['highfan', 'grim', 'story'], ['rpg', 'arpg', 'adventure', 'deck'], 'Ornate frames and borders'],
  ['game-icons', 'Game Icons', 'ui', '*', [], [], [], 'Simple icons for menus and HUDs'],
  ['input-prompts', 'Input Prompts', 'ui', '*', [], [], [], 'Keyboard, mouse and gamepad button icons'],
  ['board-game-icons', 'Board Game Icons', 'ui', '*', [], [], ['deck', 'strategy', 'puzzle'], 'Cards, dice and pieces'],
  ['kenney-fonts', 'Kenney Fonts', 'font', '*', [], [], [], 'Game-style fonts'],
  ['interface-sounds', 'Interface Sounds', 'sound', '*', [], [], [], 'Clicks, bleeps and menu sounds'],
  ['ui-audio', 'UI Audio', 'sound', '*', [], [], [], 'More button and menu sounds'],
  ['impact-sounds', 'Impact Sounds', 'sound', '*', [], [], ['arpg', 'fps', 'platformer', 'racing', 'survival', 'roguelike'], 'Hits, crashes and footsteps'],
  ['rpg-audio', 'RPG Audio', 'sound', '*', [], ['highfan', 'grim', 'story', 'west'], ['rpg', 'arpg', 'adventure', 'roguelike'], 'Swords, armour, coins and doors'],
  ['digital-audio', 'Digital Audio', 'sound', '*', [], ['scifi', 'cyber', 'retro80'], [], 'Digital bleeps and zaps'],
  ['sci-fi-sounds', 'Sci-fi Sounds', 'sound', '*', [], ['scifi', 'cyber', 'retro80'], ['fps', 'strategy', 'adventure'], 'Lasers, engines and doors'],
  ['music-jingles', 'Music Jingles', 'sound', '*', [], [], [], 'Short win, lose and level-up tunes'],
  ['voiceover-pack', 'Voiceover Pack', 'sound', '*', [], [], [], 'Short spoken words and numbers'],
  ['particle-pack', 'Particle Pack', 'fx', '*', [], [], [], 'Sparks, smoke and magic particles'],
  ['smoke-particles', 'Smoke Particles', 'fx', '*', [], ['postapoc', 'grim', 'spooky'], [], 'Smoke and fire sprites'],
].map(([slug, label, kind, dims, arts, vibes, genres, what]) => ({ slug, label, kind, dims, arts, vibes, genres, what, url: KENNEY + slug }));
// Other sites: no direct pack links (their pages change), so they open the site.
const ASSET_SITES = [
  { label: 'Quaternius', url: 'https://quaternius.com/', what: 'Free CC0 3D models: characters, nature, dungeons, sci-fi', dims: ['3D', '2.5D'] },
  { label: 'OpenGameArt', url: 'https://opengameart.org/', what: 'Community art, music and sounds (check each licence)', dims: ['2D', '2.5D', '3D'] },
];
const GROUPS = [['world', 'Characters, tiles and props', 8], ['ui', 'Menus and icons', 4], ['sound', 'Sound effects and music', 4], ['fx', 'Effects', 2], ['font', 'Fonts', 1]];
const TONE_VIBE = { epic: 'highfan', dark: 'grim', whim: 'story', cosy: 'cosy', scifi: 'scifi', horror: 'spooky' };
// The vibe to match on: the chosen one, else guessed from the mood (or the genre's usual mood).
const vibeOf = p => p.vibe && p.vibe !== 'auto' ? p.vibe : TONE_VIBE[p.tone && p.tone !== 'auto' ? p.tone : GENRE_TONE[p.genre]] || '';
// Packs that fit a project, best first, grouped. Returns [{ title, packs: [{ ...pack, score, why }] }]
function assetsFor(p) {
  const dim = p.dim === '2D' ? '2' : p.dim === '3D' ? '3' : '*', vibe = vibeOf(p), lbl = (list, id) => (list.find(x => x.id === id) || {}).label || id;
  const scored = ASSET_PACKS.filter(k => k.dims === '*' || dim === '*' || k.dims === dim).map(k => {
    let score = 0; const why = [];
    if (k.arts.length) { if (k.arts.includes(p.art)) { score += 3; why.push(lbl(ARTS, p.art) + ' style'); } else if (k.kind === 'world') score -= 3; }
    if (vibe && k.vibes.includes(vibe)) { score += 2; why.push(lbl(VIBES, vibe) + ' vibe'); }
    if (k.genres.includes(p.genre)) { score += 2; why.push(lbl(GENRES, p.genre) + ' games'); }
    if (!k.arts.length && !k.vibes.length && !k.genres.length) score += 1; // fits anything: always a sensible extra
    else if (k.kind !== 'world' && score === 0) score += 0.5; // non-art packs stay available even without a tag match
    return { ...k, score, why: why.length ? 'Fits: ' + why.join(', ') : 'Works with any project' };
  }).filter(k => k.kind === 'world' ? k.score >= 3 : k.score > 0).sort((a, b) => b.score - a.score);
  return GROUPS.map(([kind, title, n]) => ({ title, packs: scored.filter(k => k.kind === kind).slice(0, n) })).filter(g => g.packs.length);
}
