// Project wizard data + step generator. Pure functions, no DOM. Loaded before the main script.
const O = (id, label, desc, extra) => ({ id, label, desc, ...extra });

// ---------- platforms (kind: engine = writes code, declarative = describe-to-AI, web = browser JS) ----------
const PLATFORMS = [
  O('spawn', 'Spawn.co (Savi AI)', 'Describe it in plain words; Savi builds it live. No code files.', { kind: 'declarative', lang: 'natural-language spec', dims: ['2D', '2.5D', '3D'], ai: 'Savi', folders: ['(built inside Spawn)', '(built inside Spawn)', '(playtest in Spawn)'],
    how: 'Do NOT output source code. Write one clear plain-language spec that I can paste to Savi (Spawn\'s AI). Savi applies it directly to the live game; describe behaviour, numbers and edge cases in words.' }),
  O('rosebud', 'Rosebud AI', 'Chat-driven browser game maker (2D and 3D). Describe, then iterate.', { kind: 'declarative', lang: 'natural-language spec', dims: ['2D', '2.5D', '3D'], ai: 'Rosebud', folders: ['(built inside Rosebud)', '(built inside Rosebud)', '(playtest in Rosebud)'],
    how: 'Do NOT output source code. Write one clear plain-language prompt I can paste into Rosebud\'s chat; describe behaviour, numbers and edge cases in words, one mechanic at a time.' }),
  O('unity', 'Unity', 'The most common engine for indie 2D/3D games. Language: C#.', { kind: 'engine', lang: 'C#', dims: ['2D', '2.5D', '3D'], folders: ['Assets/Scripts/Gameplay/', 'Assets/Scripts/Systems/ and Infrastructure/', 'Assets/Tests/'],
    how: 'Write idiomatic Unity C#. Keep game logic in plain C# classes/structs; MonoBehaviours only for presentation and wiring. Show complete files with their paths under Assets/Scripts/ and say which GameObjects/prefabs to create.' }),
  O('godot', 'Godot 4', 'Free, open-source engine with a friendly node/scene system. Language: GDScript.', { kind: 'engine', lang: 'GDScript', dims: ['2D', '2.5D', '3D'], folders: ['scripts/gameplay/', 'scripts/systems/', 'tests/'],
    how: 'Write typed GDScript 4.x. Use scenes, nodes and signals the Godot way. Show each .gd file with its path and describe the scene tree to build.' }),
  O('unreal', 'Unreal Engine 5', 'High-end 3D engine. C++ for systems, Blueprints for tuning.', { kind: 'engine', lang: 'C++/Blueprints', dims: ['2.5D', '3D'], folders: ['Source/<Game>/Gameplay/', 'Source/<Game>/Systems/', 'Source/<Game>/Tests/'],
    how: 'Use C++ for core systems and Blueprints for tuning/content. Follow UE naming (A/U/F prefixes), show headers and sources, and list any Build.cs or Project Settings changes.' }),
  O('roblox', 'Roblox Studio', 'Build games inside Roblox with built-in multiplayer. Language: Luau.', { kind: 'engine', lang: 'Luau', dims: ['2.5D', '3D'], folders: ['src/ServerScriptService/', 'src/ReplicatedStorage/', 'src/StarterPlayer/'],
    how: 'Write strict-typed Luau. Respect the client/server split: the server owns gameplay state, the client only renders and sends requests. Say which service/container each script lives in.' }),
  O('gamemaker', 'GameMaker', 'Beginner-friendly, 2D-focused. Language: GML.', { kind: 'engine', lang: 'GML', dims: ['2D'], folders: ['objects/ and scripts/', 'scripts/systems/', '(manual playtests)'],
    how: 'Write GML (2.3+). Describe each object with its Create/Step/Draw events and any scripts; show full code per event.' }),
  O('phaser', 'Phaser 3 (web)', 'Fast 2D browser games in JavaScript/TypeScript.', { kind: 'web', lang: 'TypeScript', dims: ['2D'], folders: ['src/scenes/', 'src/systems/', 'tests/'],
    how: 'Write TypeScript for Phaser 3 in a Vite project. Use Scenes and Arcade Physics, keep logic out of render code, and show complete files with paths.' }),
  O('three', 'Three.js / Babylon.js (web)', '3D in the browser. TypeScript.', { kind: 'web', lang: 'TypeScript', dims: ['2.5D', '3D'], folders: ['src/game/', 'src/engine/', 'tests/'],
    how: 'Write TypeScript with Three.js (or Babylon.js) in a Vite project. Keep the simulation on a fixed timestep separate from rendering, and show complete files with paths.' }),
  O('construct', 'Construct 3', 'No-code 2D editor using event sheets.', { kind: 'engine', lang: 'event sheets (no code)', dims: ['2D'], folders: ['(event sheets)', '(event sheets)', '(manual playtests)'],
    how: 'Do not write code. Describe exactly which objects, families, behaviours and event-sheet rows to create, in click-by-click order.' }),
];

// ---------- questions ----------
const DIMS = [O('2D', '2D', 'Flat sprites and tiles'), O('2.5D', '2.5D', '3D visuals on a 2D plane, or fixed-angle 3D'), O('3D', '3D', 'Full 3D worlds')];
const CAM_OK = { '2D': ['side', 'top', 'iso', 'fixed', 'rts'], '2.5D': ['side', 'iso', 'top', 'fixed'], '3D': ['fps', 'tps', 'iso', 'top', 'rts', 'fixed', 'chase'] };
const CAMS = [
  O('fps', 'First-person', 'You see through the character\'s eyes'), O('tps', 'Third-person', 'Camera behind or over the shoulder'),
  O('iso', 'Isometric', 'Fixed diagonal view from above (Diablo, Hades style)'), O('top', 'Top-down', 'Straight-down view (classic Zelda, twin-stick)'),
  O('side', 'Side-scroller', 'Left-to-right view (Mario, Hollow Knight)'), O('fixed', 'Fixed / cinematic angles', 'Preset camera shots (classic survival horror)'),
  O('rts', 'Strategy camera', 'Free pan/zoom over the battlefield'), O('chase', 'Chase camera', 'Follows behind a vehicle (racing)'),
];
const GENRES = [
  O('arpg', 'Action RPG', 'Real-time combat, loot and character growth'), O('rpg', 'RPG', 'Story, party and stats; often turn-based'),
  O('fps', 'First-person shooter', 'Gun-focused action'), O('platformer', 'Platformer', 'Jumping and movement challenges'),
  O('roguelike', 'Roguelike / Roguelite', 'Randomised runs; permanent upgrades between them'), O('strategy', 'Strategy / RTS', 'Command units, manage resources'),
  O('survival', 'Survival / Crafting', 'Gather, craft, build, stay alive'), O('puzzle', 'Puzzle', 'Rules-based brain teasers'),
  O('racing', 'Racing', 'Vehicles, tracks, lap times'), O('sim', 'Simulation / Tycoon', 'Run a system: farm, colony, business'),
  O('cozy', 'Cozy Game', 'Calm, atmospheric and ambient: fishing, farming, woodcutting, decorating. No fail state, no rush'),
  O('adventure', 'Adventure / Exploration', 'Wander, discover, solve small mysteries (Zelda, Outer Wilds)'), O('metroidvania', 'Metroidvania', 'One connected map; new abilities unlock old doors'),
  O('horror', 'Survival Horror', 'Scarce resources, dread, things in the dark'), O('tower', 'Tower Defense', 'Place defences, survive waves of enemies'),
  O('deck', 'Deckbuilder / Card Battler', 'Build a deck, fight with cards (Slay the Spire)'),
];
// GameDiscoverCo's last PUBLIC "top Steam tags" data (Sept 2022). Current rankings are behind their paid Pro plan; edit this list freely.
const RETRO = { gb: 'a Game Boy', nes: 'an NES', gba: 'a Game Boy Advance', ps1: 'a PlayStation 1', n64: 'a Nintendo 64', ps2: 'a PlayStation 2' };
const RETRO_LOOK = { gb: 'render at 160x144 and scale up with whole-number scaling; use only 4 shades of one green palette; cap at 60 fps; at most 10 sprites per scanline; no sub-pixel movement', nes: 'render at 256x240 with whole-number scaling; limit to the NES palette, 3 colours plus transparent per sprite; at most 8 sprites per scanline (flicker rather than vanish); 60 fps', gba: 'render at 240x160 with whole-number scaling; use 15-bit colour (32 levels per channel); 60 fps; tile-based backgrounds', ps1: 'render at 320x240 and scale up; no texture filtering; affine (warped) texture mapping; vertex snapping to a grid; 15-bit colour with dithering; keep to a low polygon budget; cap at 30 fps', n64: 'render at 320x240; filtered but blurry low-resolution textures; fog to hide draw distance; low polygon budget; cap at 20-30 fps', ps2: 'render at 640x480; baked lighting; moderate polygon counts; no modern post-processing; 30 or 60 fps' };
const TOOLS = [
  { id: 'krita', label: 'Krita', kind: 'art', app: 1, use: 'Paint, sprites and textures (free, good for pixel art too)', when: a => a.dim !== '3D' || ['pixel', 'hand', 'toon'].includes(a.art) },
  { id: 'blender', label: 'Blender', kind: 'art', app: 1, use: 'Make and animate 3D models, export as glb', when: a => a.dim !== '2D' },
  { id: 'blockbench', label: 'Blockbench', kind: 'art', app: 1, use: 'Simple low-poly and voxel-style models, fast to learn', when: a => a.dim !== '2D' && ['lowpoly', 'voxel', 'toon', 'ps1'].includes(a.art) },
  { id: 'inkscape', label: 'Inkscape', kind: 'art', app: 1, use: 'Clean vector art and UI icons', when: a => a.art === 'hand' || a.art === 'toon' || a.dim === '2D' },
  { id: 'gimp', label: 'GIMP', kind: 'art', app: 1, use: 'Edit and clean up images and textures', when: () => true },
  { id: 'pixelorama', kind: 'art', app: 1, label: 'Pixelorama', use: 'Free pixel-art and animation editor', when: a => a.art === 'pixel' || a.art === 'ps1' },
  { id: 'magicavoxel', kind: 'art', url: 'https://ephtracy.github.io/', label: 'MagicaVoxel', use: 'Free voxel model editor (download page)', when: a => a.art === 'voxel' },
  { id: 'meshy', kind: 'art', url: 'https://www.meshy.ai/', label: 'Meshy', use: 'AI 3D models from text or a picture (free credits)', when: a => a.dim !== '2D' && a.assets === 'ai' },
  { id: 'gemini', kind: 'art', url: 'https://gemini.google.com/', label: 'Gemini image generation', use: 'AI images for concept art, sprites and textures', when: a => a.assets === 'ai' },
  { id: 'quaternius', kind: 'art', url: 'https://quaternius.com/', label: 'Quaternius', use: 'Free CC0 3D models', when: a => a.dim !== '2D' && a.assets === 'packs' },
  { id: 'kenney', kind: 'art', url: 'https://kenney.nl/assets', label: 'Kenney', use: 'Free CC0 sprites, tiles, models and sounds', when: a => a.assets === 'packs' || a.assets === 'prims' },
  { id: 'audacity', label: 'Audacity', kind: 'sound', app: 1, use: 'Record, clean up and cut sounds', when: () => true },
  { id: 'lmms', label: 'LMMS', kind: 'sound', app: 1, use: 'Make music (free studio with synths)', when: a => ['custom', 'ai', 'prims'].includes(a.assets) },
  { id: 'sfxr', kind: 'sound', url: 'https://sfxr.me/', label: 'jsfxr', use: 'Make retro sound effects with one click (browser)', when: a => a.art === 'pixel' || a.sfx === 'retro' || a.assets === 'prims' },
  { id: 'beepbox', kind: 'sound', url: 'https://www.beepbox.co/', label: 'BeepBox', use: 'Write chiptune-style music in the browser', when: a => a.msty === 'chip' || a.art === 'pixel' },
  { id: 'freesound', kind: 'sound', url: 'https://freesound.org/', label: 'Freesound', use: 'Free sound recordings (check each licence)', when: a => a.assets !== 'platform' },
];
const toolsFor = (a, kind) => (a.assets === 'platform' ? [] : TOOLS.filter(t => t.kind === kind && t.when(a)));
// Spawn and Rosebud make their own art, so the art step is about steering it
const SUBS = [
  O('osc', 'Open World Survival Craft', 'Big open map, gather and craft to survive'), O('colony', 'Colony Sim', 'Manage a group of autonomous settlers'),
  O('farming', 'Farming Sim', 'Grow crops, tend animals, build relationships'), O('4x', '4X / Grand Strategy', 'Explore, expand, exploit, exterminate'),
  O('base', 'Base Building', 'Design and defend your own base'), O('none', 'None / plain genre', 'No special sub-genre twist'),
];
const ARTS = [
  O('pixel', 'Pixel art', 'Retro 8/16-bit look'), O('lowpoly', 'Low-poly 3D', 'Simple faceted shapes, clean colours'), O('toon', 'Stylised / cartoon', 'Bright, painterly, cel-shaded'),
  O('real', 'Realistic', 'Detailed, lifelike'), O('voxel', 'Voxel', 'Built from cubes (Minecraft-like)'), O('hand', 'Hand-drawn', 'Illustrated look'), O('ps1', 'Retro PS1 / lo-fi 3D', 'Wobbly low-res nostalgia'),
];
// Aesthetic vibe: the world's look and feel. look = one sentence that goes into every prompt and helps the Assets tab pick packs.
const VIBES = [
  O('auto', 'Pick for me', 'Matched to your mood and genre'),
  O('postapoc', 'Post-apocalyptic', 'Ruins, rust and overgrown cities', { look: 'a collapsed world: ruined and overgrown places, rust, dust and scavenged materials, muted earth tones with rare warm light' }),
  O('highfan', 'High fantasy', 'Castles, magic and grand quests', { look: 'high fantasy: castles, forests and magic, rich saturated colours, heroic silhouettes and glowing spell effects' }),
  O('grim', 'Grimdark gothic', 'Decay, cathedrals, bleak and heavy', { look: 'grim gothic decay: crumbling cathedrals, fog, desaturated greys and ochre, small pockets of warm light' }),
  O('fever', 'Fever dream', 'Surreal, melting shapes, clashing colours', { look: 'a fever dream: surreal, melting and impossible shapes, clashing saturated colours, odd scale and dream logic' }),
  O('cosy', 'Super cosy', 'Warm light, soft shapes, tea and blankets', { look: 'super cosy: warm golden light, soft rounded shapes, pastel and earthy colours, small homely details' }),
  O('cyber', 'Neon cyberpunk', 'Rain, neon signs, high tech low life', { look: 'neon cyberpunk: rain-slick streets at night, glowing signs in magenta and cyan, dense layered cities' }),
  O('scifi', 'Clean sci-fi', 'Smooth white and blue tech, space stations', { look: 'clean sci-fi: smooth white and blue surfaces, glowing panels, calm sterile spaces and starfields' }),
  O('steam', 'Steampunk', 'Brass, gears, steam and airships', { look: 'steampunk: brass, copper and leather, visible gears and pipes, steam, airships and Victorian shapes' }),
  O('story', 'Storybook', 'Painted fairy-tale charm', { look: 'a storybook: painterly fairy-tale scenery, soft outlines, friendly characters and gentle colour' }),
  O('spooky', 'Spooky-cute', 'Friendly ghosts, pumpkins, pastel goth', { look: 'spooky-cute: friendly ghosts and pumpkins, purple and orange with pastel accents, playful not scary' }),
  O('retro80', '80s retro-future', 'Synthwave grids, chrome, sunset gradients', { look: '80s retro-future: synthwave grids, chrome lettering, sunset gradients of pink and purple, arcade nostalgia' }),
  O('west', 'Dusty frontier', 'Deserts, saloons, sun-bleached', { look: 'a dusty frontier: sun-bleached deserts, wooden towns, long shadows and warm orange light' }),
  O('nautical', 'Sea and islands', 'Pirates, ports, tropical waters', { look: 'sea and islands: ports, ships and tropical water, bright turquoise and sand with weathered wood' }),
  O('urban', 'Modern city', 'Streets, shops and everyday places', { look: 'a modern city: streets, shops and everyday places, believable materials and ordinary lighting' }),
];
// imported asset packs (saved on the profile by the Assets tab) are named in every prompt so the AI uses them instead of placeholders
const packsLine = p => Array.isArray(p.packs) && p.packs.length ? ' Free asset packs already imported into the project folder (use them instead of placeholder art or sound, and keep their licence files): ' + p.packs.map(k => k.label + ' (assets/' + k.slug + '/)').join(', ') + '.' : '';
const vibeLine = p => { const v = VIBES.find(x => x.id === p.vibe); return v && v.look ? ' Visual vibe: ' + v.label + ' - ' + v.look + '.' : ''; };
const SCOPES = [
  O('0', 'Weekend jam', 'A tiny playable prototype in a few days'), O('1', 'Small', 'One person, 1-2 months'),
  O('2', 'Medium', '3-6 months, a polished game'), O('3', 'Large', '6-12+ months, commercial release'),
];
// each style says what it does; x lists the styles it cannot be combined with
const STYLES = [
  O('ponytail', 'Ponytail (lean)', 'Smallest working code, no over-engineering, nothing added "for later"', { x: ['standard', 'ecs'], does: 'writes the smallest code that fully works and skips extra layers' }),
  O('standard', 'Standard architecture', 'Clear layers, interfaces and abstractions', { x: ['ponytail'], does: 'uses clear layers and interfaces so the code can grow' }),
  O('tdd', 'Test-first (TDD)', 'Write a failing test, then the code that passes it', { x: [], does: 'writes a failing test first, then only the code that passes it' }),
  O('data', 'Data-driven', 'Numbers, enemies and levels live in data files, not code', { x: [], does: 'keeps numbers, enemies and levels in data files so they can be tuned without code changes' }),
  O('ecs', 'Entity-component (ECS)', 'Small components plus systems that process them', { x: ['ponytail'], does: 'splits everything into small components and systems' }),
  O('teach', 'Teach me as you go', 'Comments and short explanations for a learner', { x: [], does: 'adds short comments and explains each choice in plain words' }),
  O('perf', 'Performance-first', 'Avoid per-frame allocation, pool objects, measure first', { x: [], does: 'avoids per-frame allocation, pools objects and measures before optimising' }),
];
const COMBO = { 'ponytail+tdd': 'one small test per behaviour, with no test scaffolding beyond that', 'ponytail+data': 'a single small data file instead of a configuration framework', 'tdd+data': 'tests run against the data files so a bad number is caught early', 'ponytail+teach': 'short code with a one-line why-comment on each non-obvious choice', 'standard+tdd': 'interfaces are designed to be testable, with mocks for the engine', 'ecs+perf': 'components stored in tight arrays for fast processing', 'ecs+data': 'entity recipes are data files' };
const QUESTIONS = [
  { id: 'template', type: 'single', title: 'Start from a game template?', note: 'A template fills in many answers and steers every step toward the design of a well-known game, without copying it. You can change any answer afterwards.', options: [O('none', 'No template', 'Answer every question yourself'), ...TEMPLATES.map(t => O(t.id, t.label, t.desc))] },

  { id: 'name', type: 'text', title: 'What is your game called?', ph: 'e.g. Ember Hollow' },
  { id: 'pitch', type: 'text', title: 'Pitch it in one sentence', ph: 'e.g. A cosy lantern-keeper explores haunted caves.' },
  { id: 'refs', type: 'text', title: 'Which games should it feel like? (up to 3, optional)', ph: 'e.g. Hades meets Stardew Valley' },
  { id: 'tone', type: 'single', title: 'What is the mood and setting?', options: [O('auto', 'Pick for me', 'Fits your genre and art style'), O('epic', 'Heroic / epic fantasy', 'Big stakes, brave heroes'), O('dark', 'Dark and gritty', 'Grim, tense, dangerous'), O('whim', 'Whimsical / cartoony', 'Light, funny, colourful'), O('cosy', 'Cosy / calm', 'Gentle and relaxing'), O('scifi', 'Sci-fi / futuristic', 'Technology and space'), O('horror', 'Horror / eerie', 'Dread and suspense')] },
  { id: 'audience', type: 'single', title: 'Who is it for?', options: [O('all', 'Everyone / family', 'No violence worth rating, simple language'), O('teen', 'Teens', 'Mild fantasy violence is fine'), O('adult', 'Adults', 'Mature themes allowed')] },
  { id: 'existing', type: 'single', title: 'Starting fresh or continuing something?', options: [O('fresh', 'Starting fresh', 'A brand-new project'), O('existing', 'I already have a project', 'The plan will begin by auditing what you have')] },
  { id: 'platform', type: 'single', title: 'Which platform will you build on?', options: PLATFORMS },
  { id: 'dim', type: 'single', title: '2D or 3D?', options: DIMS },
  { id: 'camera', type: 'single', title: 'Camera style?', options: CAMS },
  { id: 'genre', type: 'single', title: 'Main genre?', options: GENRES },
  { id: 'sub', type: 'single', title: 'Add a popular sub-genre twist?', note: 'Top Steam sub-genres from GameDiscoverCo data (Sept 2022).', options: SUBS },
  { id: 'loop', type: 'text', auto: true, title: 'What does the player do, and how do they win? (optional)', ph: 'e.g. Explore caves, gather light, return to upgrade the lighthouse.' },
  { id: 'art', type: 'single', title: 'Art style?', options: ARTS },
  { id: 'vibe', type: 'single', title: 'What is the aesthetic vibe?', note: 'The look and feel of the world. It steers the art prompts and which free asset packs the Assets tab suggests.', options: VIBES },
  { id: 'msty', type: 'single', title: 'What should the music sound like?', note: 'Every sound step reuses this, so music, effects and ambience feel made for one game.', options: [O('auto', 'Pick for me', 'Chosen from your genre and art style'), O('orch', 'Orchestral', 'Strings, brass, big drums'), O('elec', 'Electronic', 'Synths and beats'), O('chip', 'Chiptune', '8/16-bit melodies'), O('acou', 'Acoustic / folk', 'Guitar, piano, hand percussion'), O('amb', 'Ambient / minimal', 'Pads, drones, sparse notes'), O('rock', 'Rock / metal', 'Driving guitars and drums')] },
  { id: 'sfx', type: 'single', title: 'What should the sound effects feel like?', options: [O('auto', 'Pick for me', 'Matched to your art style'), O('real', 'Realistic', 'Natural, lifelike sounds'), O('styl', 'Punchy / stylised', 'Bold, exaggerated, readable'), O('retro', 'Retro bleeps', 'Chip-style blips and noise'), O('sci', 'Sci-fi / synthetic', 'Electronic zaps and hums'), O('soft', 'Soft / cosy', 'Gentle, rounded, warm')] },
  { id: 'amb', type: 'single', title: 'What should the world sound like when nothing is happening?', options: [O('auto', 'Pick for me', 'Matched to your genre'), O('nature', 'Nature', 'Wind, birds, water, insects'), O('eerie', 'Dark / eerie', 'Low drones, drips, distant noises'), O('cosy', 'Calm / cosy', 'Soft room tone, light life sounds'), O('mech', 'Machines / city', 'Hums, traffic, industry'), O('adapt', 'Adaptive: changes where you are', 'Indoors is muffled and quiet, caves echo, outdoors opens up; weather and time of day change it'), O('sea', 'Sea / water', 'Waves, gulls, creaking wood, dripping'), O('weather', 'Weather and seasons', 'Rain, wind, snow, crickets; changes with the season'), O('space', 'Space / sci-fi hum', 'Engines, hull creaks, distant signals'), O('busy', 'Lively crowds', 'Voices, markets, activity')] },
  { id: 'voice', type: 'single', title: 'Will characters speak?', options: [O('none', 'No voices', 'Text and sounds only'), O('barks', 'Short reactions', 'Grunts, shouts, one-liners'), O('gibber', 'Gibberish talk', 'Funny made-up babble per character (Animal Crossing, Banjo-Kazooie)'), O('blips', 'Text blips', 'A short beep per letter as text appears (Undertale, Celeste)'), O('creature', 'Creature sounds only', 'Characters chirp, purr or growl instead of words'), O('narr', 'Narrator', 'A voice tells the story'), O('full', 'Full voice acting', 'Spoken dialogue')] },
  { id: 'content', type: 'single', title: 'How much content should it have?', note: 'Sets how many levels and how much variety the extra steps ask for.', options: [O('few', 'A little', 'A tight 1-3 hours. A new idea every 5-10 minutes; the loop stays fresh by changing, not by repeating'), O('some', 'A fair amount', 'About 5-10 hours. A new idea every 15-20 minutes, with a rest between hard parts'), O('lots', 'A lot', '15+ hours. New mechanics unlock steadily; optional side content for fans'), O('endless', 'Endless / replayable', 'Runs or levels that never repeat (roguelike, procedural, daily challenges). The core loop must stay fun for hundreds of rounds')] },
  { id: 'scope', type: 'single', title: 'How big is the project? (this sets how many steps you get)', options: SCOPES },
  { id: 'mp', type: 'single', title: 'Multiplayer?', options: [O('none', 'Single-player', ''), O('local', 'Local co-op / versus', 'Same screen or device'), O('coop', 'Online co-op', 'Friends play together online'), O('pvp', 'Online PvP', 'Players compete online')] },
  { id: 'devices', type: 'multi', title: 'Which devices will it run on?', options: [O('pc', 'PC', ''), O('mobile', 'Mobile', ''), O('console', 'Console', ''), O('web', 'Web browser', '')] },
  { id: 'controls', type: 'multi', title: 'Controls?', options: [O('kbm', 'Keyboard + mouse', ''), O('gamepad', 'Gamepad', ''), O('touch', 'Touch screen', '')] },
  { id: 'story', type: 'single', title: 'How much story?', options: [O('none', 'None', 'Pure gameplay'), O('light', 'Light', 'Some text, lore and a few characters'), O('heavy', 'Story-driven', 'Dialogue, quests and branching')] },
  { id: 'session', type: 'single', title: 'How long is a typical play session?', options: [O('10', 'Short bursts', '5-15 minutes'), O('30', 'Medium', '20-45 minutes'), O('60', 'Long', '1+ hour'), O('long', 'Marathon', 'A long campaign over many hours')] },
  { id: 'difficulty', type: 'single', title: 'Difficulty philosophy?', options: [O('forgiving', 'Forgiving', 'Generous checkpoints, low penalty'), O('balanced', 'Balanced', 'Fair challenge'), O('punishing', 'Punishing', 'Real consequences, learn by dying'), O('adjustable', 'Player-adjustable', 'Difficulty modes the player picks')] },
  { id: 'access', type: 'multi', allowEmpty: true, title: 'Accessibility features to plan for? (pick any, or none)', options: [O('colorblind', 'Colour-blind friendly', 'Never rely on colour alone'), O('subs', 'Subtitles & text size', ''), O('remap', 'Remappable controls', ''), O('onehand', 'One-handed / simple input', ''), O('motion', 'Reduced motion', 'Optional shake/flash reduction'), O('deaf', 'Deaf / hard of hearing', 'Every important sound also has a visual cue or caption'), O('blind', 'Low vision / blind', 'Screen reader menus, audio cues, high contrast, scalable UI'), O('contrast', 'High-contrast mode', 'Strong outlines and a bold palette option'), O('dyslexia', 'Dyslexia-friendly text', 'Readable font choice and spacing'), O('flash', 'Photosensitivity safety', 'No harmful flashing, with a warning and an off switch'), O('hold', 'No holding or mashing', 'Hold and rapid-press actions can be toggled or automated'), O('assist', 'Assist options', 'Aim assist, slower game speed, skip-a-challenge'), O('cogn', 'Clear goals and reminders', 'A quest reminder, simple menus, no time-limited choices'), O('tts', 'Text to speech', 'Read menus and dialogue aloud'), O('haptic', 'Vibration options', 'Adjust or turn off vibration, or use it as a cue'), O('touchsize', 'Large touch targets', 'Bigger buttons and spaced controls for phones')] },
  { id: 'money', type: 'single', title: 'How will it make money?', options: [O('none', 'It will not (free / portfolio)', 'No monetization steps'), O('paid', 'Paid game', 'One price, maybe a demo'), O('f2p', 'Free to play', 'Ads and/or optional purchases')] },
  { id: 'perf', type: 'single', title: 'What performance should it hit?', options: [O('low', '30 fps, low-end devices', 'Phones and old PCs'), O('std', '60 fps, typical devices', 'Most players'), O('high', '120 fps, high-end', 'Fast PCs and consoles'), O('gb', 'Game Boy look (60 Hz, 160x144, 4 shades)', 'Locked tiny screen and 4 greens. 2D only'), O('nes', 'NES look (60 Hz, 256x240, small palette)', 'Chunky pixels, 3 colours per sprite. 2D only'), O('gba', 'Game Boy Advance look (60 Hz, 240x160)', 'Bright 15-bit colour, 2D only'), O('ps1', 'PS1 look (30 fps, 320x240, no texture filtering)', 'Wobbly vertices, affine textures, low poly'), O('n64', 'Nintendo 64 look (20-30 fps, 320x240, blurry textures)', 'Soft filtered textures, fog, low poly'), O('ps2', 'PS2 look (30-60 fps, 640x480)', 'Early-2000s polygons and baked lighting')] },
  { id: 'budget', type: 'single', title: 'Budget?', options: [O('free', '$0', 'Free tools and assets only'), O('low', 'Under $500', ''), O('mid', 'Under $5,000', ''), O('funded', 'Funded / team', '')] },
  { id: 'assets', type: 'single', title: 'Where will art and sound come from?', options: [O('prims', 'Placeholders / primitives', 'Boxes and free beeps for now'), O('packs', 'Asset packs', 'Free or purchased packs'), O('ai', 'AI-generated', 'Made with AI image, 3D and music tools. This app writes the prompts; you run them in the tool'), O('custom', 'Custom-made', 'Made by you or a team'), O('platform', 'The platform makes it', 'Spawn.co or Rosebud generates the look itself; you steer it with words and shaders')] },
  { id: 'exp', type: 'single', title: 'Your experience level?', options: [O('beginner', 'Beginner', 'New to game dev: explain everything'), O('mid', 'Intermediate', 'Some projects done'), O('pro', 'Experienced', 'Just give me the work')] },
  { id: 'style', type: 'multi', title: 'Coding style? (pick one or combine)', note: 'Styles that clash are greyed out. The line under the tiles explains what your combination does.', options: STYLES },
  { id: 'ai', type: 'single', title: 'Which AI tool will you paste prompts into?', options: [O('claude', 'Claude Code', ''), O('cursor', 'Cursor', ''), O('copilot', 'GitHub Copilot', ''), O('codex', 'ChatGPT / Codex', ''), O('gemini', 'Gemini', ''), O('chat', 'A chat window (Claude/ChatGPT)', ''), O('platform', 'The platform\'s own AI', 'Savi, Rosebud, etc.')] },
  { id: 'extra', type: 'text', optional: true, auto: true, title: 'Anything else every step should know? (optional)', ph: 'e.g. no gore, must run on a 4 GB GPU, controller-first UI' },
  { id: 'world', type: 'single', title: 'How is the world laid out?', options: [O('linear', 'Linear levels', 'One level after another'), O('hub', 'Hub and spokes', 'A home base with areas that loop back to it'), O('open', 'Open world', 'Roam freely, go where you like'), O('proc', 'Procedurally generated', 'Built fresh by rules each time')] },
  { id: 'fail', type: 'single', title: 'What happens when the player fails?', options: [O('nofail', 'Nothing bad (no fail state)', 'Relaxing; nothing is lost'), O('checkpoint', 'Restart at a checkpoint', 'Lose a little time'), O('softloss', 'Lose some progress', 'Drop currency or items, can win them back'), O('permadeath', 'Permadeath', 'The run ends and you start again')] },
  { id: 'prog', type: 'single', title: 'How does the player grow stronger?', options: [O('levels', 'Character levels (XP)', 'Earn experience, spend points'), O('unlocks', 'Unlocks and upgrades', 'New tools, areas and abilities'), O('gear', 'Gear and loot', 'Better equipment makes you stronger'), O('skill', 'Player skill only', 'Nothing gets stronger; the player gets better')] },
  { id: 'feel', type: 'single', title: 'How should the controls feel?', options: [O('tight', 'Tight and snappy', 'Instant response, precise'), O('weighty', 'Weighty and deliberate', 'Actions commit; heavier but meaningful'), O('floaty', 'Floaty and loose', 'Soft, gliding, forgiving'), O('phys', 'Physics-driven', 'Things bump and tumble; a bit chaotic')] },
  { id: 'nview', type: 'single', title: 'Who tells the story?', options: [O('none', 'No story viewpoint needed', ''), O('first', 'First-person hero', 'You are the character'), O('third', 'Third-person hero', 'You follow a named hero'), O('silent', 'Silent hero', 'The hero never speaks; others do'), O('ensemble', 'Ensemble cast', 'Many characters share the story'), O('env', 'Told by the world', 'Items, places and hints; no one explains')] },
  { id: 'ending', type: 'single', title: 'How does the game end?', options: [O('boss', 'Final boss', 'Beat the last big challenge'), O('credits', 'Story ending', 'Finish the story, roll credits'), O('multi', 'Multiple endings', 'Choices decide the ending'), O('endless', 'No ending', 'Keep playing as long as you like'), O('score', 'High score or rank', 'Each run is rated')] },
  { id: 'procedural', type: 'single', title: 'How much is random?', options: [O('none', 'All hand-made', 'Every level and item is designed'), O('levels', 'Random levels or rooms', 'Each run lays out differently'), O('world', 'Random world', 'A new world per save'), O('loot', 'Random loot and enemies', 'Fixed levels, varied contents'), O('all', 'Almost everything', 'Heavy use of generation')] },
  { id: 'team', type: 'single', title: 'Who is making it?', options: [O('solo', 'Just me', 'Keep systems small'), O('duo', 'Small team (2-5)', 'Split work by area'), O('studio', 'Studio (6+)', 'Needs a clear pipeline and reviews')] },
  { id: 'time', type: 'single', title: 'How much time can you give it?', options: [O('few', 'A few hours a week', 'Plan very small steps'), O('part', '10-20 hours a week', 'Steady part-time'), O('full', 'Full time', 'Bigger steps are fine')] },
  { id: 'store', type: 'multi', allowEmpty: true, title: 'Where will you release it? (pick any, or none yet)', options: [O('steam', 'Steam', 'PC store'), O('itch', 'itch.io', 'Indie site, good for demos'), O('mobile', 'Mobile stores', 'iOS and Android'), O('web', 'Web portal', 'Play in a browser'), O('console', 'Console stores', 'Needs platform approval')] },
  { id: 'save', type: 'single', title: 'How does saving work?', options: [O('auto', 'Autosave', 'Saves by itself, often'), O('checkpoint', 'At checkpoints', 'Save at certain places'), O('manual', 'Manual save slots', 'The player chooses'), O('none', 'No saving', 'One sitting, one run')] },
  { id: 'ui', type: 'single', title: 'What should the interface look like?', options: [O('classic', 'Classic HUD', 'Bars and icons on screen'), O('min', 'Minimal', 'Almost nothing on screen'), O('diegetic', 'In the world', 'Info shown on objects and the character'), O('retro', 'Retro / pixel UI', 'Chunky and old-school')] },
  { id: 'langs', type: 'single', title: 'How many languages?', options: [O('en', 'English only', ''), O('few', 'A few (up to 5)', 'Plan text tables early'), O('many', 'Many (10+)', 'Needs layouts that survive long words')] },
  { id: 'mods', type: 'single', title: 'Should players be able to mod it?', options: [O('none', 'No', ''), O('data', 'Data mods', 'Edit files like items and levels'), O('full', 'Full mod support', 'Scripts and a workshop')] },
  { id: 'online', type: 'single', title: 'Any online services?', options: [O('none', 'None', 'Fully offline'), O('board', 'Leaderboards', 'Compare scores'), O('acct', 'Accounts and cloud saves', 'Sign in, play anywhere'), O('live', 'Live service', 'Events and a store')] },
  { id: 'link', type: 'connect', title: 'Which account connects this project? (Spawn.co asks for its build prompt or token)' },
];
// The wizard shows these 6 screens; answer ids stay per question so saved profiles keep working.
const SCREENS = [
  { title: 'The game', ids: ['template', 'name', 'pitch', 'refs', 'audience', 'genre', 'sub', 'loop', 'nview', 'ending'] },
  { title: 'Platform and view', ids: ['existing', 'platform', 'dim', 'camera', 'feel', 'ui'] },
  { title: 'Sound', ids: ['msty', 'sfx', 'amb', 'voice'] },
  { title: 'Size and content', ids: ['scope', 'content', 'session', 'mp', 'story', 'money', 'world', 'procedural', 'prog'] },
  { title: 'Players and reach', ids: ['devices', 'controls', 'perf', 'difficulty', 'fail', 'access'] },
  { title: 'How you build', ids: ['budget', 'team', 'time', 'store', 'save', 'langs', 'mods', 'online', 'exp', 'style', 'ai', 'extra', 'link'] },
  { title: 'Look and vibe', ids: ['art', 'vibe', 'tone', 'assets'] },
];
// ---------- modes: Normal and Hell ask fewer, smarter questions; the rest are filled in by autoFill ----------
// A page lists question ids. An id like 'p:sound' is a preset card that sets several answers at once.
const PRESETS = {
  view: { title: 'What does the player see?', note: 'Sets 2D or 3D and the camera together.', options: [
    O('2dside', '2D side view', 'Left-to-right (Mario, Terraria)', { set: { dim: '2D', camera: 'side' } }), O('2dtop', '2D top-down', 'Straight-down (Zelda, Stardew)', { set: { dim: '2D', camera: 'top' } }),
    O('2diso', '2D isometric', 'Diagonal from above (Diablo)', { set: { dim: '2D', camera: 'iso' } }), O('3dtps', '3D third-person', 'Camera behind the hero', { set: { dim: '3D', camera: 'tps' } }),
    O('3dfps', '3D first-person', 'Through the hero\'s eyes', { set: { dim: '3D', camera: 'fps' } }), O('3diso', '3D isometric', 'Fixed diagonal 3D', { set: { dim: '3D', camera: 'iso' } }),
    O('3drts', '3D strategy camera', 'Free pan and zoom', { set: { dim: '3D', camera: 'rts' } }), O('3dchase', '3D chase camera', 'Behind a vehicle', { set: { dim: '3D', camera: 'chase' } })] },
  sound: { title: 'What should it sound like?', note: 'Sets music, effects, ambience and voices together.', options: [
    O('s-auto', 'Pick for me', 'Matched to your genre and art', { set: { msty: 'auto', sfx: 'auto', amb: 'auto', voice: 'none' } }), O('s-orch', 'Epic orchestral', 'Strings and drums, real-feeling effects, short voice reactions', { set: { msty: 'orch', sfx: 'real', amb: 'nature', voice: 'barks' } }),
    O('s-cosy', 'Cosy acoustic', 'Guitar and piano, soft effects, nature, gibberish talk', { set: { msty: 'acou', sfx: 'soft', amb: 'nature', voice: 'gibber' } }), O('s-chip', 'Retro chiptune', 'Bleeps and blips, text blips for talking', { set: { msty: 'chip', sfx: 'retro', amb: 'auto', voice: 'blips' } }),
    O('s-dark', 'Dark ambient', 'Drones and silence, eerie ambience, no voices', { set: { msty: 'amb', sfx: 'real', amb: 'eerie', voice: 'none' } }), O('s-elec', 'Electronic / sci-fi', 'Synths, zaps and hums', { set: { msty: 'elec', sfx: 'sci', amb: 'mech', voice: 'none' } }),
    O('s-rock', 'Rock and punchy', 'Driving guitars, bold effects, shouts', { set: { msty: 'rock', sfx: 'styl', amb: 'auto', voice: 'barks' } })] },
  size: { title: 'How big should it be?', note: 'Sets project size, amount of content and play-session length together.', options: [
    O('z-jam', 'Weekend jam', 'A tiny prototype, a few days', { set: { scope: '0', content: 'few', session: '10' } }), O('z-small', 'Small game', '1-2 months, 1-3 hours of play', { set: { scope: '1', content: 'few', session: '30' } }),
    O('z-med', 'Medium game', '3-6 months, 5-10 hours', { set: { scope: '2', content: 'some', session: '30' } }), O('z-large', 'Large game', '6-12+ months, 15+ hours', { set: { scope: '3', content: 'lots', session: '60' } }),
    O('z-endless', 'Replayable runs', 'Short runs that never repeat', { set: { scope: '2', content: 'endless', session: '30' } })] },
  challenge: { title: 'How hard should it be?', note: 'Sets difficulty, what failing costs, and a set of accessibility options together.', options: [
    O('c-gentle', 'Gentle and accessible', 'No fail state, many accessibility options', { set: { difficulty: 'forgiving', fail: 'nofail', access: ['subs', 'colorblind', 'contrast', 'assist', 'cogn'] } }), O('c-bal', 'Balanced', 'Fair challenge, checkpoints', { set: { difficulty: 'balanced', fail: 'checkpoint', access: ['subs', 'remap'] } }),
    O('c-hard', 'Hard but fair', 'Learn from losing, lose some progress', { set: { difficulty: 'punishing', fail: 'softloss', access: ['subs', 'remap'] } }), O('c-brutal', 'Brutal', 'Permadeath, no safety net', { set: { difficulty: 'punishing', fail: 'permadeath', access: [] } }),
    O('c-choose', 'Player chooses', 'Difficulty modes, plus a broad accessibility set', { set: { difficulty: 'adjustable', fail: 'checkpoint', access: ['subs', 'remap', 'assist', 'colorblind', 'contrast'] } })] },
};
const MODES = [
  { id: 'normal', label: 'Normal', time: 'about 10 questions, 3 minutes', desc: 'The big choices only. Everything else is filled in smartly from your answers.', pages: [
    { title: 'Name it', ids: ['name', 'pitch'] }, { title: 'What kind of game?', ids: ['template', 'genre'] }, { title: 'Platform and view', ids: ['platform', 'p:view'] }, { title: 'Sound', ids: ['p:sound'] }, { title: 'Size', ids: ['p:size'] }, { title: 'Players', ids: ['mp', 'devices'] }, { title: 'Challenge', ids: ['p:challenge'] }, { title: 'Money and release', ids: ['money', 'store'] }, { title: 'You', ids: ['exp', 'ai'] }, { title: 'Look and vibe', ids: ['art', 'vibe', 'tone'] }] },
  { id: 'hell', label: 'Hell', time: 'about 20 questions, 8 minutes', desc: 'Finer control over look, sound, world and business. The rest is filled in smartly.', pages: [
    { title: 'Name it', ids: ['name', 'pitch', 'refs'] }, { title: 'Template', ids: ['template'] }, { title: 'Genre', ids: ['genre', 'sub'] }, { title: 'Platform', ids: ['existing', 'platform'] }, { title: 'View and feel', ids: ['p:view', 'feel'] },
    { title: 'Music and effects', ids: ['msty', 'sfx'] }, { title: 'Ambience and voices', ids: ['amb', 'voice'] }, { title: 'Size', ids: ['p:size'] },
    { title: 'Content', ids: ['scope', 'content'] }, { title: 'Players', ids: ['mp', 'devices'] }, { title: 'Controls and speed', ids: ['controls', 'perf'] }, { title: 'World', ids: ['world', 'procedural'] }, { title: 'Growth and ending', ids: ['prog', 'ending'] },
    { title: 'Challenge', ids: ['difficulty', 'fail'] }, { title: 'Accessibility', ids: ['access', 'ui'] }, { title: 'Money and release', ids: ['money', 'store', 'save'] }, { title: 'Team and budget', ids: ['team', 'time', 'budget'] }, { title: 'You', ids: ['exp', 'style', 'ai'] }, { title: 'Art and vibe', ids: ['art', 'vibe'] }, { title: 'Mood and assets', ids: ['tone', 'audience', 'assets'] }] },
  { id: 'night', label: 'Nightmare', time: 'every question, 15 minutes', desc: 'All of it. The full, deep project creator.', pages: SCREENS },
];
// what each genre usually wants for the answers Normal and Hell do not ask
const GENRE_DEF = {
  arpg: { world: 'hub', prog: 'gear', ending: 'boss', feel: 'tight', procedural: 'none', audience: 'teen' }, rpg: { world: 'open', prog: 'levels', ending: 'credits', feel: 'tight', procedural: 'none', audience: 'teen' },
  fps: { world: 'linear', prog: 'gear', ending: 'credits', feel: 'tight', procedural: 'none', audience: 'adult' }, platformer: { world: 'linear', prog: 'unlocks', ending: 'boss', feel: 'tight', procedural: 'none', audience: 'all' },
  roguelike: { world: 'proc', prog: 'unlocks', ending: 'boss', feel: 'tight', procedural: 'levels', audience: 'teen' }, strategy: { world: 'linear', prog: 'unlocks', ending: 'credits', feel: 'tight', procedural: 'none', audience: 'teen' },
  survival: { world: 'open', prog: 'gear', ending: 'endless', feel: 'tight', procedural: 'world', audience: 'teen' }, puzzle: { world: 'linear', prog: 'skill', ending: 'credits', feel: 'tight', procedural: 'none', audience: 'all' },
  racing: { world: 'linear', prog: 'unlocks', ending: 'score', feel: 'tight', procedural: 'none', audience: 'all' }, sim: { world: 'open', prog: 'unlocks', ending: 'endless', feel: 'tight', procedural: 'none', audience: 'all' },
  cozy: { world: 'open', prog: 'unlocks', ending: 'endless', feel: 'tight', procedural: 'none', audience: 'all' }, adventure: { world: 'open', prog: 'unlocks', ending: 'credits', feel: 'floaty', procedural: 'none', audience: 'teen' },
  metroidvania: { world: 'hub', prog: 'unlocks', ending: 'boss', feel: 'tight', procedural: 'none', audience: 'teen' }, horror: { world: 'hub', prog: 'gear', ending: 'multi', feel: 'weighty', procedural: 'none', audience: 'adult' },
  tower: { world: 'linear', prog: 'unlocks', ending: 'score', feel: 'tight', procedural: 'none', audience: 'all' }, deck: { world: 'proc', prog: 'gear', ending: 'boss', feel: 'tight', procedural: 'levels', audience: 'teen' },
};
const presetOf = id => PRESETS[String(id).replace(/^p:/, '')];
const modeOf = id => MODES.find(m => m.id === id) || MODES[2];
// pages for a mode; Spawn needs its account page, which Normal and Hell add at the end
const pagesOf = (mode, a) => { const m = modeOf(mode); return m.id !== 'night' && a && a.platform === 'spawn' ? [...m.pages, { title: 'Connect Spawn', ids: ['link'] }] : m.pages; };
const askedIds = (mode, a) => new Set(pagesOf(mode, a).flatMap(pg => pg.ids.flatMap(i => i.startsWith('p:') ? Object.keys(PRESETS[i.slice(2)].options[0].set) : [i])));
const presetOn = (o, a) => Object.entries(o.set).every(([k, v]) => JSON.stringify([].concat(v).slice().sort()) === JSON.stringify([].concat(a[k] === undefined ? [] : a[k]).slice().sort()));
const applyPreset = (o, a) => { Object.assign(a, JSON.parse(JSON.stringify(o.set))); return a; };
// fill every answer the mode did not ask. A template's own answers are never overridden.
function autoFill(a, mode) {
  if (mode === 'night') return a;
  const asked = askedIds(mode, a), t = tplOf(a), fixed = t ? t.answers : {}, put = (k, v) => { if (!asked.has(k) && !(k in fixed)) a[k] = v; };
  Object.entries(GENRE_DEF[a.genre] || {}).forEach(([k, v]) => put(k, v));
  const dev = a.devices || [];
  if (!asked.has('controls')) a.controls = ([...new Set([dev.includes('pc') || !dev.length ? 'kbm' : '', dev.includes('mobile') ? 'touch' : '', dev.includes('console') ? 'gamepad' : ''].filter(Boolean))]); // always follows the devices chosen
  put('ui', a.art === 'pixel' ? 'retro' : 'classic');
  put('save', a.fail === 'permadeath' || a.fail === 'nofail' ? 'auto' : 'checkpoint');
  if (!asked.has('loop') && !('loop' in fixed)) a.loop = autoText('loop', a);
  if (!asked.has('extra')) a.extra = autoText('extra', a);
  return a;
}
const DEFAULTS = { world: 'linear', fail: 'checkpoint', prog: 'unlocks', feel: 'tight', nview: 'none', ending: 'boss', procedural: 'none', team: 'solo', time: 'part', store: [], save: 'auto', ui: 'classic', langs: 'en', mods: 'none', online: 'none', template: 'none', link: '', name: 'Untitled Game', pitch: '', refs: '', existing: 'fresh', loop: '', session: '30', difficulty: 'balanced', access: [], budget: 'free', platform: 'unity', dim: '3D', camera: 'tps', genre: 'arpg', sub: 'none', art: 'lowpoly', scope: '1', mp: 'none', devices: ['pc'], controls: ['kbm'], story: 'none', tone: 'auto', vibe: 'auto', audience: 'teen', content: 'some', money: 'none', perf: 'std', msty: 'auto', sfx: 'auto', amb: 'auto', voice: 'none', assets: 'prims', exp: 'mid', style: ['ponytail'], ai: 'claude', extra: '' };

// Auto-written answers for the two free-text questions ('loop', 'extra'), built from the earlier answers. No AI needed, works offline.
const LOOPS = {
  arpg: 'Fight through enemies, collect loot, level up your character, and defeat the final boss to win.',
  rpg: 'Explore, talk to people, build a party and level up, then finish the main quest to win.',
  fps: 'Move, aim and shoot through combat areas, survive each encounter, and clear the last level to win.',
  platformer: 'Run and jump through levels, avoid hazards, collect items, and reach the end of the last level to win.',
  roguelike: 'Go on randomised runs, fight and pick upgrades, keep some power when you die, and beat the final boss to win.',
  strategy: 'Gather resources, build units, command them in battle, and destroy the enemy base to win.',
  survival: 'Gather materials, craft tools, build shelter and survive the dangers until you can escape or finish the main goal.',
  puzzle: 'Solve rule-based puzzles of rising difficulty and finish the last set to win.',
  racing: 'Race vehicles around tracks against opponents, improve lap times, and win the championship.',
  sim: 'Run and grow your system, balance money and resources, and reach the target goal to win.',
  cozy: 'Settle in, do small relaxing jobs (fish, farm, chop, decorate), grow your little corner of the world, and enjoy it at your own pace with nothing to lose.',
  adventure: 'Explore the world, find clues and tools, solve small mysteries, and uncover the final secret.',
  metroidvania: 'Explore one connected map, gain abilities that open old doors, and beat the final boss.',
  horror: 'Scavenge scarce supplies, avoid or survive what hunts you, solve the way out, and escape alive.',
  tower: 'Place and upgrade defences, survive each wave of enemies, and protect the base to the last wave.',
  deck: 'Fight battles with a deck of cards, add and remove cards after each fight, and beat the final boss.',
};
const SUB_LOOP = { osc: 'The world is open: roam freely, gather and craft to stay alive.', colony: 'Keep a group of settlers fed, safe and busy.', farming: 'Grow crops and tend animals between outings.', '4x': 'Explore, expand and out-manage rival factions.', base: 'Build and defend your own base.' };
const MP_LOOP = { local: 'Friends can play together on the same screen.', coop: 'Friends team up online.', pvp: 'Players compete against each other online.' };
const STORY_LOOP = { light: 'A little story and lore ties the levels together.', heavy: 'A story with quests and choices drives progress.' };
function autoText(id, a) {
  const opt = q => QUESTIONS.find(x => x.id === q).options, lab = (q, v) => pickOpt(opt(q), v).label;
  if (id === 'loop') return [LOOPS[a.genre] || LOOPS.arpg, SUB_LOOP[a.sub], MP_LOOP[a.mp], STORY_LOOP[a.story]].filter(Boolean).join(' ');
  if (id !== 'extra') return '';
  const dev = a.devices || [], acc = a.access || [];
  return [
    { free: 'Use only free tools and assets.', low: 'Keep total cost under $500.', mid: 'Keep total cost under $5,000.' }[a.budget],
    dev.includes('mobile') && 'It must run well on phones.', dev.includes('web') && 'It must run in a web browser.', dev.includes('console') && 'Plan for console limits.',
    `Controls: ${joinN(a.controls, opt('controls'))}.`,
    acc.length && `Accessibility: ${joinN(acc, opt('access'))}.`,
    `Difficulty: ${lab('difficulty', a.difficulty).toLowerCase()}.`,
    { prims: 'Use placeholder art and sound for now.', packs: 'Art and sound come from asset packs.', ai: 'Art and sound will be AI-generated.' }[a.assets],
    a.exp === 'beginner' && 'I am a beginner: explain each step in plain words.', a.exp === 'pro' && 'I am experienced: skip the basics.',
    a.scope === '0' && 'Keep it a tiny prototype.', hasStyle(a, 'ponytail') && 'Keep the code lean.',
  ].filter(Boolean).join(' ');
}

// which options are unavailable given earlier answers (returns reason string or '')
function blocked(qid, opt, a) {
  const P = PLATFORMS.find(x => x.id === a.platform);
  if (qid === 'dim' && P && !P.dims.includes(opt.id)) return `${P.label} does not support ${opt.label}`;
  const T = tplOf(a), need = T && T.needs && T.needs.dim;
  if (qid === 'platform' && need && !opt.dims.includes(need)) return `${T.label} needs ${need}`;
  if (qid === 'template' && opt.id !== 'none') { const t = tplOf({ template: opt.id }); if (P && t.needs && !P.dims.includes(t.needs.dim)) return `${P.label} does not support ${t.needs.dim}`; }
  if (qid === 'style') { const c = [].concat(a.style || []).filter(i => i !== opt.id).find(i => (pickOpt(STYLES, i).x || []).includes(opt.id) || (opt.x || []).includes(i)); if (c) return `Clashes with ${pickOpt(STYLES, c).label}`; }
  if (qid === 'perf' && ['gb', 'nes', 'gba'].includes(opt.id) && a.dim !== '2D') return 'That console was 2D only';
  if (qid === 'access' && opt.id === 'touchsize' && !(a.controls || []).includes('touch') && !(a.devices || []).includes('mobile')) return 'Needs touch controls or mobile';
  if (qid === 'access' && opt.id === 'haptic' && !(a.controls || []).includes('gamepad') && !(a.devices || []).includes('mobile')) return 'Needs a gamepad or mobile';
  if (qid === 'camera' && !(CAM_OK[a.dim] || []).includes(opt.id)) return `Not used in ${a.dim} games`;
  return '';
}
const hasStyle = (p, id) => [].concat(p.style || []).includes(id); // style is a list now; old saved profiles hold one word
const styleText = p => { const ids = [].concat(p.style || []).filter(i => STYLES.some(x => x.id === i)); return ids.map(i => pickOpt(STYLES, i).label).join(' + ') || 'Standard'; };
function styleRule(p) {
  const ids = [].concat(p.style || []).filter(i => STYLES.some(x => x.id === i)); if (!ids.length) return '';
  const pairs = ids.flatMap((a, k) => ids.slice(k + 1).map(b => COMBO[a + '+' + b] || COMBO[b + '+' + a]).filter(Boolean));
  return 'CODING STYLE: ' + ids.map(i => pickOpt(STYLES, i).label).join(' + ') + '. In plain words this ' + ids.map(i => pickOpt(STYLES, i).does).join(', and ') + '.' + (pairs.length ? ' Together: ' + pairs.join('; ') + '.' : '');
}
const pickOpt = (list, id) => list.find(x => x.id === id) || list[0];
const joinN = (ids, list) => (ids || []).map(i => pickOpt(list, i).label).join(', ') || 'PC';

// ---------- genre modules: [minScope, title, flavor, task, doneWhen] ----------
const G = {
  arpg: [
    [0, 'Melee Combat Core', 'Swinging a weapon and hitting things must feel good before anything else.', 'Implement basic attack with hit detection, damage numbers, and enemy hit reactions.', 'I can attack an enemy, see damage, and it reacts.'],
    [0, 'Enemy AI: Chase and Attack', 'Enemies that notice you, close in and strike.', 'Build a simple enemy state machine: idle, chase, attack, recover.', 'Enemies chase me and attack on a readable timer.'],
    [0, 'Health & Death Loop', 'Dying and restarting without friction.', 'Add player/enemy health, death, and a quick respawn or restart.', 'Dying restarts me cleanly.'],
    [1, 'Stats & Abilities', 'Numbers and skills that make builds feel different.', 'Create a stats system (health, damage, speed) and 2-3 active abilities with cooldowns.', 'Abilities consume cooldowns and change my output.'],
    [1, 'Loot Drops & Inventory', 'The treasure loop that keeps players hunting.', 'Add weighted loot drops, pickup, and a simple inventory with equipment slots.', 'Enemies drop items I can equip and feel the effect.'],
    [2, 'Boss Fight', 'A set-piece encounter that tests everything.', 'Design one multi-phase boss with telegraphed attacks and an arena.', 'The boss has 2+ phases and a fair, learnable pattern.'],
    [3, 'Skill Tree / Build Crafting', 'Long-term choices that define a build.', 'Add a skill tree with prerequisites and respec rules.', 'Spending points changes how I play.'],
  ],
  rpg: [
    [0, 'Character & Stats', 'The numbers behind your hero.', 'Create character stats (level, HP, attack, defence) and a data format for characters.', 'I can view and change a character\'s stats.'],
    [0, 'Turn or Combat Rules', 'The rules that make fights tactical.', 'Implement the combat ruleset (turn order or real-time rules) with attack, defend, and one special action.', 'A full fight plays from start to finish.'],
    [0, 'Enemy Roster & Encounters', 'A handful of foes with different jobs.', 'Add 3 enemy types with distinct stats and behaviours, and an encounter trigger.', 'Each enemy type plays differently.'],
    [1, 'Inventory, Equipment & Items', 'Gear that changes your stats.', 'Add inventory, equipable gear and consumable items.', 'Equipping gear changes my stats.'],
    [1, 'Leveling & Party Growth', 'The reward of getting stronger.', 'Add XP, level-ups and (if relevant) a party of 2-4 members.', 'Winning fights levels me up.'],
    [2, 'Quest System', 'Goals with a beginning, middle and end.', 'Build a quest system: objectives, tracking, rewards, a quest log.', 'I can accept, progress and complete a quest.'],
    [3, 'Companions & Relationships', 'People who care about your choices.', 'Add companion banter, approval and one relationship-driven outcome.', 'My choices shift a companion\'s attitude.'],
  ],
  fps: [
    [0, 'Weapon Handling', 'Shooting is the game; make it crisp.', 'Implement one hitscan weapon with fire rate, recoil, ammo and reload.', 'I can shoot, reload and see hits register.'],
    [0, 'Health, Damage & Death', 'Taking and dealing damage.', 'Add player health, hit reactions, death and respawn.', 'I can take damage, die and respawn.'],
    [0, 'Enemy AI: Aggro & Shoot', 'Opponents that hunt and shoot back.', 'Build enemy AI that sights the player, takes cover or advances, and fires with believable accuracy.', 'Enemies shoot back and can be beaten.'],
    [1, 'Weapon Variety', 'Different guns for different moments.', 'Add 2-3 more weapons (e.g. shotgun, projectile launcher) with distinct feel.', 'Each weapon feels different to use.'],
    [1, 'Level Flow & Objectives', 'Where the player goes and why.', 'Build one level with a start, combat spaces, and an objective/exit.', 'I can finish the level start to end.'],
    [2, 'Pickups & Armor', 'Resource tension on the battlefield.', 'Add health, armor and ammo pickups with sensible placement.', 'I run low and have to hunt for supplies.'],
    [3, 'Scoreboard & Match Rules', 'Win conditions and stats.', 'Add match rules, scoring and an end-of-round summary.', 'A match ends with a winner and stats.'],
  ],
  platformer: [
    [0, 'Movement Feel: Run & Jump', 'The whole game lives in the jump.', 'Implement run, variable-height jump, coyote time and jump buffering.', 'Jumping feels responsive and forgiving.'],
    [0, 'Hazards & Death', 'Danger that is fair.', 'Add spikes/pits/enemies, death and instant respawn at checkpoint.', 'I die fairly and retry instantly.'],
    [0, 'Collectibles & Goal', 'A reason to reach the end.', 'Add collectibles and a level exit/goal flag.', 'I can collect items and finish the level.'],
    [1, 'Checkpoints & Level Streaming', 'Progress that is saved as you go.', 'Add checkpoints and load the next level on completion.', 'Checkpoints hold and levels chain.'],
    [1, 'Enemy Variety', 'Foes with different movement rules.', 'Add 3 enemy types (patrol, jumper, shooter) with simple patterns.', 'Each enemy needs a different response.'],
    [2, 'Power-ups / New Abilities', 'New moves that change the level design.', 'Add one ability (e.g. dash or double-jump) and a level section that needs it.', 'The new ability unlocks new space.'],
    [3, 'Boss & World Map', 'A finale and a sense of journey.', 'Add a boss fight and a world/level-select map.', 'I can pick levels and beat a boss.'],
  ],
  roguelike: [
    [0, 'Core Combat or Action Loop', 'The moment-to-moment fun, before the randomness.', 'Implement the basic player action and one enemy type.', 'One room is fun to play on its own.'],
    [0, 'Run Structure', 'Start, advance, die, restart.', 'Create a run manager: start run, advance rooms/floors, end on death or victory.', 'A full run starts and ends cleanly.'],
    [0, 'Procedural Room/Level Generation', 'Every run is different.', 'Generate layouts from room templates with a seeded random generator.', 'Each run builds a different valid layout.'],
    [1, 'Upgrades & Item Pool', 'Choices that stack into a build.', 'Add a weighted pool of upgrades/items offered between rooms.', 'I choose upgrades that change my build.'],
    [1, 'Enemy Variety & Elites', 'Different threats per floor.', 'Add enemy types per floor and an elite variant.', 'Floors feel different from each other.'],
    [2, 'Meta-Progression', 'What survives death.', 'Add permanent currency and an unlock screen between runs.', 'Dying still moves me forward.'],
    [3, 'Bosses & Daily Seeds', 'Milestones and shareable runs.', 'Add floor bosses and a seed-sharing/daily challenge mode.', 'I can replay the same seed.'],
  ],
  strategy: [
    [0, 'Unit Selection & Orders', 'Click, drag, command.', 'Implement selection (click and box) and move/attack orders.', 'I can select units and order them around.'],
    [0, 'Pathfinding', 'Units that find their way around obstacles.', 'Add grid or navmesh pathfinding with simple avoidance.', 'Units route around walls without jamming.'],
    [0, 'Resource Economy', 'Gather, spend, expand.', 'Add at least one resource, a gatherer and a spend loop.', 'Income funds new units or buildings.'],
    [1, 'Building & Production', 'Turn resources into an army.', 'Add placeable buildings that produce units over time.', 'I can build and train units.'],
    [1, 'Enemy AI Opponent', 'Someone to beat.', 'Build a basic AI that expands, builds and attacks in waves.', 'The AI is a real (if simple) opponent.'],
    [2, 'Fog of War & Scouting', 'The unknown makes decisions hard.', 'Add vision radius and fog of war.', 'Unseen enemies are hidden.'],
    [3, 'Tech Tree & Factions', 'Depth and replayability.', 'Add a tech tree and a second faction.', 'Factions play differently.'],
  ],
  survival: [
    [0, 'Needs Meters', 'Hunger, thirst, health: constant pressure.', 'Implement survival meters that drain over time and cause damage when empty.', 'Neglecting needs hurts me.'],
    [0, 'Gathering Resources', 'Wood, stone, food from the world.', 'Add harvestable nodes with tools and respawn rules.', 'I gather resources from the world.'],
    [0, 'Crafting', 'Turn materials into tools and gear.', 'Add recipes, a crafting UI and tool tiers.', 'I craft better tools from materials.'],
    [1, 'Building / Shelter', 'A place that is yours.', 'Add snap-to-grid building pieces and basic structural rules.', 'I can build a simple shelter.'],
    [1, 'Day/Night & Weather', 'The clock that makes nights scary.', 'Add a day/night cycle that changes danger and visibility.', 'Night is more dangerous than day.'],
    [2, 'Threats: Wildlife & Hostiles', 'Things that want to eat you.', 'Add animals and hostile creatures with simple AI.', 'I can be hunted, and can hunt.'],
    [3, 'Base Defence & Long-term Goals', 'A reason to keep playing.', 'Add raids/waves and a goal (escape, tech, boss).', 'The game has a satisfying long-term target.'],
  ],
  puzzle: [
    [0, 'Core Mechanic & Rules', 'The one idea the whole game is built on.', 'Implement the core puzzle mechanic and its rules in the simplest possible form.', 'The mechanic works and is clear.'],
    [0, 'Level Format & Loader', 'Levels as data, not code.', 'Define a simple level data format and a loader.', 'I can load levels from files.'],
    [0, 'Win/Fail Detection', 'The game must know when you have solved it.', 'Add win and fail checks with clear feedback.', 'Solving a level is detected instantly.'],
    [1, 'Undo / Restart', 'Make experimentation cheap.', 'Add undo and instant restart.', 'I can undo any move.'],
    [1, 'Level Progression & Difficulty Curve', 'Teach, then twist.', 'Build 5-10 levels that introduce the mechanic and ramp up.', 'Levels teach in order and get harder.'],
    [2, 'Hint System', 'Help without spoiling.', 'Add an optional tiered hint system.', 'Hints nudge instead of solve.'],
    [3, 'Level Editor / Daily Puzzle', 'Longevity.', 'Add a simple level editor or daily puzzle.', 'Players can make or get new puzzles.'],
  ],
  racing: [
    [0, 'Vehicle Handling', 'Cars live and die by feel.', 'Implement vehicle physics: acceleration, steering, grip and braking.', 'The car feels controllable and fun.'],
    [0, 'Track & Checkpoints', 'A course to race on.', 'Build one track with checkpoints and a lap counter.', 'I can complete laps in order.'],
    [0, 'Race Rules: Laps & Timer', 'Win conditions and timing.', 'Add race start countdown, lap times and a finish screen.', 'A race starts, times and ends.'],
    [1, 'AI Opponents', 'Others to race against.', 'Add AI drivers following a racing line with rubber-banding.', 'AI cars race competitively.'],
    [1, 'Car Variety & Upgrades', 'Different machines, different feel.', 'Add 2-3 cars with different stats and simple upgrades.', 'Each car drives differently.'],
    [2, 'More Tracks & Environments', 'Variety across the season.', 'Add 2-3 more tracks with differing layouts.', 'Tracks feel distinct.'],
    [3, 'Championship / Career Mode', 'A reason to race again.', 'Add a career with points, unlocks and rival drivers.', 'Races connect into a championship.'],
  ],
  sim: [
    [0, 'Core Simulation Loop', 'The system that runs on its own.', 'Implement the core simulation tick: entities, rules and resource flow.', 'The simulation runs and changes over time.'],
    [0, 'Placement / Building', 'Shape your world.', 'Add grid-based placement of buildings or objects with cost.', 'I can place things and spend money.'],
    [0, 'Economy & Resources', 'Income, costs and balance.', 'Add currency, income, upkeep and simple balancing data.', 'My economy can grow or fail.'],
    [1, 'Agents / Customers / Workers', 'Little people with simple needs.', 'Add autonomous agents with needs and simple pathing.', 'Agents behave believably.'],
    [1, 'Upgrades & Unlocks', 'Always something new to buy.', 'Add an unlock/upgrade tree gated by money or milestones.', 'Progress unlocks new options.'],
    [2, 'Events & Challenges', 'Things go wrong (and right).', 'Add random events, goals and scenarios.', 'Events force interesting decisions.'],
    [3, 'Stats, Graphs & Scenarios', 'Understanding the system.', 'Add stats screens/graphs and a scenario selector.', 'I can read how my system is doing.'],
  ],
  cozy: [
    [0, 'Gentle Core Activity', 'The small job that feels good to repeat.', 'Build the main relaxing activity (fishing, farming, woodcutting or similar): start, a satisfying input, a reward. No timer, no way to fail or lose progress.', 'I can do the activity and it feels calm and rewarding.'],
    [0, 'Day Cycle & Ambient World', 'A world that breathes around you.', 'Add a day/night cycle with soft lighting changes, gentle weather and small life (birds, fish, leaves). It must look good doing nothing.', 'Time passes visibly and the world feels alive when I stand still.'],
    [0, 'Collect, Craft & Decorate', 'Make the space yours.', 'Add collecting (items, critters, recipes), simple crafting, and placing decorations freely in a home or plot.', 'I can collect things and arrange my space.'],
    [1, 'Gentle Progression', 'Growth without pressure.', 'Add tools that improve, areas that open, and a collection log. Progress is always optional and never punishes the player.', 'There is always something nice to work toward and nothing is lost.'],
    [1, 'Characters & Routines', 'Friendly faces with daily lives.', 'Add 3-5 characters with daily schedules, short friendly dialogue, and small requests or gifts.', 'Characters are in different places by time of day and talk to me.'],
    [2, 'Seasons & Events', 'A reason to come back tomorrow.', 'Add seasons or small festivals that change the world and add new things to do.', 'The world changes over time and brings new activities.'],
    [3, 'Cozy Polish: Comfort Features', 'Make it a safe place.', 'Add photo mode, a relaxed pace setting, and gentle autosave so players can drop in and out any time.', 'I can play for 5 minutes or 2 hours with no stress.'],
  ],
  adventure: [
    [0, 'Exploration & Movement', 'Moving through the world is the fun.', 'Build movement tuned for exploring (walk, climb or glide as the game needs), with a readable world that invites wandering.', 'Exploring feels good before anything else exists.'],
    [0, 'Interaction & Items', 'Pick things up, use things.', 'Add interacting with objects and a small inventory of key items that open ways forward.', 'I can pick up and use items to progress.'],
    [1, 'Clues & Small Puzzles', 'Reward curiosity.', 'Add 3-5 environmental puzzles or mysteries with clear clues in the world, each solvable with what the player has found.', 'I can solve puzzles by looking carefully.'],
    [1, 'Map, Waypoints & Guidance', 'Never lost for long.', 'Add a map or compass, discoverable fast-travel points, and a gentle hint system.', 'I always have a way to find my bearings.'],
    [2, 'World Regions & Landmarks', 'A world worth crossing.', 'Build 3 distinct regions with a landmark visible from far away in each.', 'Each region looks different and I can steer toward landmarks.'],
    [3, 'Secrets & Final Reveal', 'Pay off the exploring.', 'Add hidden secrets, a collection goal and the final reveal that ties the clues together.', 'The ending rewards what I found.'],
  ],
  metroidvania: [
    [0, 'Tight Movement & Combat', 'Moving and fighting must feel exact.', 'Build responsive movement (jump, dash) and a basic attack with fair hit boxes.', 'Controls feel precise.'],
    [0, 'Connected Map & Rooms', 'One world, many doors.', 'Build a room-based map with doors between rooms and room transitions that keep the player state.', 'I can walk between rooms with no loading glitches.'],
    [1, 'Ability Gates', 'New powers open old doors.', 'Add 3 abilities (e.g. double jump, dash, wall climb) and gates that need each one.', 'Getting an ability opens a place I could not reach before.'],
    [1, 'Map Screen & Save Rooms', 'Never lose your way or your progress.', 'Add a map that fills in as rooms are explored, and save/heal rooms.', 'The map records where I have been.'],
    [2, 'Bosses & Mini-Bosses', 'Gatekeepers with patterns.', 'Add one boss per major region with learnable patterns that use the newest ability.', 'Each boss tests the ability I just got.'],
    [3, 'Secrets, Upgrades & Sequence Breaks', 'Reward the curious.', 'Add hidden rooms, health/energy upgrades and allow safe sequence breaks.', 'There are secrets to find and no way to get permanently stuck.'],
  ],
  horror: [
    [0, 'Tension Core: Sight, Sound & Light', 'Fear comes from what you cannot see.', 'Build limited vision (flashlight or dark), a sound-driven sense of danger, and a calm pacing system for quiet moments.', 'The game builds dread even when nothing happens.'],
    [0, 'Threat AI: Stalk & Hunt', 'Something is out there.', 'Build a threat that patrols, hears and searches, and gives the player a way to hide or escape. It must be fair and readable.', 'The threat can find me, and I can survive by being smart.'],
    [1, 'Scarce Resources', 'Every item matters.', 'Add limited ammo, health, light or batteries, and pickups placed so choices feel tense.', 'I worry about running out.'],
    [1, 'Locked Doors & Puzzles', 'The way out is a puzzle.', 'Add keys, switches and 2-3 puzzles gating progress, with safe saving points.', 'I solve puzzles under pressure.'],
    [2, 'Scares & Pacing Director', 'Scare then relax.', 'Add a pacing director that triggers scripted scares and quiet recovery moments, and never repeats the same scare back to back.', 'Scares land and then ease off.'],
    [3, 'Finale & Multiple Endings', 'Escape, or not.', 'Add the final chase or boss and two endings based on what the player did.', 'The ending depends on my choices.'],
  ],
  tower: [
    [0, 'Path & Enemy Waves', 'Enemies must follow a path.', 'Build a path (or lanes) and a wave spawner that sends enemies along it with a base health to protect.', 'Waves of enemies walk the path and hurt the base if they get through.'],
    [0, 'Tower Placement', 'Choose where to defend.', 'Add grid or free placement of towers with a cost and a sell option.', 'I can place and sell towers.'],
    [0, 'Tower Types & Targeting', 'Different tools for different enemies.', 'Add 4 tower types (fast, slow, area, support) with targeting rules (first, strongest, nearest).', 'Each tower is useful in a different situation.'],
    [1, 'Economy & Upgrades', 'Spend wisely.', 'Add money per kill and per wave, plus 2-3 upgrade levels per tower.', 'I earn and spend money with real choices.'],
    [2, 'Enemy Variety & Boss Waves', 'Enemies that counter your plan.', 'Add fast, armoured, flying and boss enemies that force different towers.', 'No single tower type beats every wave.'],
    [3, 'Maps & Difficulty Modes', 'Replay value.', 'Add 3 maps with different shapes and a difficulty selector.', 'Each map needs a different plan.'],
  ],
  deck: [
    [0, 'Card Data & Hand', 'Cards are data.', 'Define cards as data (cost, effect, text), a draw pile, a hand and a discard pile that reshuffles.', 'I can draw and play cards from a hand.'],
    [0, 'Turn Battle Loop', 'Fight in turns.', 'Build a turn-based fight: energy, play cards, end turn, enemy acts with a shown intent.', 'I can win and lose a fight in turns.'],
    [1, 'Card Effects & Keywords', 'Cards that do different things.', 'Add 20 cards across damage, block, draw and status effects, using a small reusable effect system.', 'Different cards play differently.'],
    [1, 'Rewards, Deck Building & Map', 'Grow the deck.', 'Add card rewards after fights, removing cards, and a branching map of fights, shops and rests.', 'My deck changes between fights.'],
    [2, 'Enemies & Bosses', 'Opponents that make you think.', 'Add 8 enemy types and 2 bosses whose shown intents teach counterplay.', 'Enemies telegraph moves and I can plan around them.'],
    [3, 'Relics, Characters & Balance Tools', 'Variety and fairness.', 'Add relics (passive items), a second starting deck, and a script that simulates fights to find overpowered cards.', 'Runs feel different and no card dominates.'],
  ],
};

// ---------- sub-genre twist: one extra module ----------
const SUB_MOD = {
  osc: ['Open-World Streaming & Gathering Loop', 'A big map that stays fast.', 'Add chunked world streaming and a gather-craft-expand loop across biomes.', 'I can explore far without hitching.'],
  colony: ['Colony Settlers & Job System', 'People who work without being micromanaged.', 'Add autonomous settlers with needs, moods and a priority-based job queue.', 'Settlers pick up jobs on their own.'],
  farming: ['Farming Loop & Seasons', 'Plant, wait, harvest, repeat.', 'Add tillable plots, crop growth by day/season, tools, selling and daily energy.', 'I plant, harvest and sell across days.'],
  '4x': ['4X Loop: Explore, Expand, Exploit, Exterminate', 'The big-picture strategy loop.', 'Add exploration, city/outpost expansion, resource yields and a research or diplomacy hook.', 'All four Xs are present in a basic form.'],
  base: ['Base Building & Defence Layout', 'Design a base worth defending.', 'Add modular base building with defensive structures and waves that test the layout.', 'A wave tests my base design.'],
};

// ---------- multiplayer modules ----------
const MP_MODS = [
  [1, 'Netcode Foundation', 'The wires between players.', 'Set up the networking layer, a host/client split, and player spawning over the network.', 'Two players see each other move.'],
  [2, 'Lobby & Matchmaking', 'Getting players into a game.', 'Add a lobby (host/join by code or list), ready-up and match start.', 'Players can find and start a match.'],
  [2, 'State Sync & Authority', 'Who decides what is true.', 'Make the server/host authoritative for gameplay state; add client prediction or interpolation.', 'Gameplay stays in sync under latency.'],
  [3, 'Anti-Cheat Basics & Lag Testing', 'Fair play on real networks.', 'Validate client inputs server-side and test with simulated latency and packet loss.', 'The game holds up at 150 ms and 3% loss.'],
];

// short wording the new answers add to the project line and to the matching steps
const SAVE_TXT = { auto: 'Autosave often and on every area change.', checkpoint: 'Save only at checkpoints; a failed run returns there.', manual: 'Offer several manual save slots plus one autosave that never overwrites them.', none: '' };
const UI_TXT = { classic: 'Use a classic HUD: bars and icons on screen.', min: 'Keep the HUD minimal: show almost nothing unless it matters right now.', diegetic: 'Show information inside the world (on the character, weapon or objects) instead of on-screen bars.', retro: 'Use a chunky retro/pixel interface that matches the old-school look.' };
const FEEL_TXT = { tight: 'Controls are tight and snappy: instant response, short acceleration, generous input buffering.', weighty: 'Controls are weighty and deliberate: actions commit and cannot be cancelled freely.', floaty: 'Controls are floaty and forgiving: soft acceleration, coyote time and long air control.', phys: 'Controls are physics-driven: objects have mass and bump and tumble.' };
const STORE_TXT = { steam: 'Steam (a store page, capsule art, achievements, trading cards optional)', itch: 'itch.io (a page, a demo, devlog posts)', mobile: 'mobile stores (store listings, age rating, in-app rules, screen sizes)', web: 'a web portal (small download, fast first load)', console: 'console stores (platform approval, certification, ratings)' };
const LABEL = (q, v) => pickOpt(QUESTIONS.find(x => x.id === q).options, v).label.toLowerCase();
function extrasLine(p) {
  const st = (p.store || []).map(i => STORE_TXT[i] ? i : '').filter(Boolean);
  return ` World: ${LABEL('world', p.world)}. Failure: ${LABEL('fail', p.fail)}. Growth: ${LABEL('prog', p.prog)}. Controls feel: ${LABEL('feel', p.feel)}. Ending: ${LABEL('ending', p.ending)}. Randomness: ${LABEL('procedural', p.procedural)}.${p.nview && p.nview !== 'none' ? ' Story viewpoint: ' + LABEL('nview', p.nview) + '.' : ''} Team: ${LABEL('team', p.team)}, time: ${LABEL('time', p.time)}.${st.length ? ' Release on: ' + st.join(', ') + '.' : ''}${p.langs && p.langs !== 'en' ? ' Languages: ' + LABEL('langs', p.langs) + '.' : ''}${p.mods && p.mods !== 'none' ? ' Mod support: ' + LABEL('mods', p.mods) + '.' : ''}${p.online && p.online !== 'none' ? ' Online: ' + LABEL('online', p.online) + '.' : ''}`;
}
const PONYTAIL = `RULES (Ponytail, pragmatically lazy senior dev): 1) YAGNI: skip unneeded code. 2) REUSE what exists. 3) Prefer built-in platform features over custom wrappers. 4) Write only the minimum that works. 5) NEVER remove validation, null checks, error handling or balance math in the name of simplicity.`;

const SCOPE_LABEL = ['weekend-jam prototype', 'small solo', 'medium', 'large commercial'];
const PHASE_NAMES = ['I // FOUNDATION', 'II // CORE GAMEPLAY', 'III // CONTENT & PROGRESSION', 'IV // FEEL & POLISH', 'V // SHIP IT'];

function camDesc(p) {
  const c = pickOpt(CAMS, p.camera).label.toLowerCase();
  return { fps: 'first-person camera with mouse/stick look, head-bob optional', tps: 'third-person camera that follows behind/over the shoulder with collision so it never clips walls',
    iso: 'fixed isometric camera at a diagonal angle that follows the player', top: 'top-down camera directly above', side: 'side-on camera that scrolls with the player',
    fixed: 'fixed cinematic camera angles that switch by zone', rts: 'free pan/zoom strategy camera with edge-scroll and bounds', chase: 'chase camera behind the vehicle with speed-based FOV' }[p.camera] || c;
}

// ---------- sound identity: one description reused by every sound step so music, effects and ambience match ----------
const GENRE_MUSIC = { arpg: 'orch', rpg: 'orch', fps: 'elec', platformer: 'chip', roguelike: 'elec', strategy: 'orch', survival: 'amb', puzzle: 'amb', racing: 'rock', sim: 'acou', cozy: 'acou', adventure: 'orch', metroidvania: 'elec', horror: 'amb', tower: 'chip', deck: 'amb' };
const GENRE_AMB = { arpg: 'eerie', rpg: 'nature', fps: 'mech', platformer: 'nature', roguelike: 'eerie', strategy: 'busy', survival: 'nature', puzzle: 'cosy', racing: 'mech', sim: 'busy', cozy: 'nature', adventure: 'nature', metroidvania: 'eerie', horror: 'eerie', tower: 'busy', deck: 'cosy' };
const GENRE_SFX = { arpg: 'sword swing, hit, enemy hurt, enemy death, loot pickup, level up', rpg: 'attack, spell cast, hit, level up, item pickup, quest complete', fps: 'gunshot, reload, hit marker, footstep, pickup, enemy alert',
  platformer: 'jump, land, coin, hurt, checkpoint, goal', roguelike: 'attack, hit, pickup, door open, upgrade chosen, death', strategy: 'unit select, order confirm, build, attack, resource gain, alert',
  survival: 'chop, mine, craft, eat, hurt, build place', puzzle: 'move, place, success, fail, undo, hint', racing: 'engine, tyre squeal, boost, crash, checkpoint, countdown', sim: 'place, build, coin, upgrade, event alert, click', cozy: 'cast, catch, plant, harvest, chop, place decoration', adventure: 'footstep, climb, pickup, door, clue found, discovery',
  metroidvania: 'jump, dash, attack, hit, ability unlock, door open', horror: 'heartbeat, footstep, door creak, flashlight click, monster growl, jump scare', tower: 'tower place, shot, enemy hit, enemy death, wave start, base hurt', deck: 'card draw, card play, hit, block, end turn, card reward' };
const MUSIC_TXT = { orch: 'orchestral: strings, brass and big percussion', elec: 'electronic: synths, bass and beats', chip: 'chiptune: 8/16-bit square and triangle melodies', acou: 'acoustic: guitar, piano and hand percussion', amb: 'ambient: pads, drones and sparse notes', rock: 'rock: driving guitars, bass and drums' };
const SFX_TXT = { real: 'realistic and natural', styl: 'punchy, stylised and easy to read', retro: 'retro bleeps and noise bursts', sci: 'sci-fi: synthetic zaps and hums', soft: 'soft, rounded and warm' };
const AMB_TXT = { nature: 'nature: wind, birds, water, insects', eerie: 'dark and eerie: low drones, drips, distant noises', cosy: 'calm and cosy: soft room tone and light life sounds', mech: 'machines and city: hums, traffic, industry', busy: 'lively: voices, markets, activity', adapt: 'adaptive: the ambience changes with where the player is (indoors muffled and quiet, caves with echo, outdoors open and airy) and with weather and time of day, crossfading smoothly', sea: 'sea: waves, gulls, creaking wood, dripping water', weather: 'weather and seasons: rain, wind, snow, crickets, changing with the season', space: 'space: engine hum, hull creaks, distant signals' };
const VOICE_TXT = { none: 'no voices (text and sounds only)', barks: 'short voice reactions (grunts, shouts, one-liners)', gibber: 'funny made-up gibberish speech, a different pitch and rhythm per character', blips: 'a short text blip per letter, with a different pitch per character', creature: 'creature sounds only (chirps, purrs, growls) with no words', narr: 'a narrator', full: 'full voice acting' };
function soundIdentity(p) {
  const art = p.art, genre = p.genre in GENRE_MUSIC ? p.genre : 'arpg';
  const m = p.msty && p.msty !== 'auto' ? p.msty : (art === 'pixel' ? 'chip' : GENRE_MUSIC[genre]);
  const s = p.sfx && p.sfx !== 'auto' ? p.sfx : ({ pixel: 'retro', toon: 'styl', ps1: 'retro', real: 'real', lowpoly: 'styl', voxel: 'styl', hand: 'soft' }[art] || 'styl');
  const a = p.amb && p.amb !== 'auto' ? p.amb : GENRE_AMB[genre], v = p.voice || 'none';
  const style = `SOUND STYLE: music is ${MUSIC_TXT[m]}; sound effects are ${SFX_TXT[s]}; ambience is ${AMB_TXT[a]}; voices: ${VOICE_TXT[v]}.${p.refs ? ' Reference feel: ' + p.refs + '.' : ''} Use this one style for every sound so they sound like the same game.`;
  return { style, sfxList: GENRE_SFX[genre], music: MUSIC_TXT[m], sfx: SFX_TXT[s], amb: AMB_TXT[a], voice: VOICE_TXT[v] };
}
// where the sound files come from follows the "assets" answer; this app writes prompts and wires audio in, it does not make audio itself
function soundSource(p, what) {
  return ({ prims: `For now use code-made placeholder tones or free beeps for ${what}; name them exactly as in the Sound Bible so real files can replace them later with no code change.`,
    packs: `Get ${what} from asset packs: list 5 search terms that match the Sound Bible style, and name each file as in the Sound Bible.`,
    ai: `Make ${what} with an AI sound/music generator: for each item write a ready-to-paste generation prompt that starts with the style prompt, and name each file as in the Sound Bible.`,
    custom: `Write a short brief for whoever makes ${what}: style prompt, the asset list with lengths and loop points, file names and format.` }[p.assets]) || '';
}
// the sound each step should wire up, so sound is built alongside the game and not bolted on at the end
function soundLine(m, p) {
  const id = soundIdentity(p);
  if (m.ph === 1) return `SOUND: this feature must be heard as well as seen. Use names from the Sound Bible asset list (for ${pickOpt(GENRES, p.genre).label}: ${id.sfxList}); every visible action plays a cue.`;
  if (/Player Controller/.test(m.t)) return 'SOUND: add footstep/movement sounds per surface (placeholders are fine).';
  if (/HUD & Menu/.test(m.t)) return 'SOUND: add UI sounds: click, hover, confirm, back, pause.';
  return '';
}

const GENRE_TONE = { arpg: 'epic', rpg: 'epic', fps: 'dark', platformer: 'whim', roguelike: 'dark', strategy: 'epic', survival: 'dark', puzzle: 'cosy', racing: 'whim', sim: 'cosy', cozy: 'cosy', adventure: 'epic', metroidvania: 'dark', horror: 'horror', tower: 'whim', deck: 'dark' };
const toneText = p => { const t = p.tone && p.tone !== 'auto' ? p.tone : GENRE_TONE[p.genre] || 'epic'; return pickOpt(QUESTIONS.find(q => q.id === 'tone').options, t).label.toLowerCase(); };
// how much content each size and "content" answer asks for, per scope 0..3: lv = levels, va = distinct pieces of variety
// pacing line used by the content steps: how the new content is spaced so it rewards the player and respects their time
const PACE = { few: 'Pacing: a new idea every 5-10 minutes, no padding, nothing the player must repeat.', some: 'Pacing: a new idea about every 15-20 minutes, a calm moment after each hard part, and no required grinding.', lots: 'Pacing: unlock new mechanics steadily, keep side content optional, and never make the player repeat content to continue.', endless: 'Pacing: every run is short (10-20 minutes), starts fast, ends with a clear reward, and mixes new combinations so runs feel different.' };
const CONTENT_N = {
  endless: { lv: [2, 5, 10, 20], va: [8, 15, 30, 50] }, few: { lv: [1, 2, 3, 5], va: [3, 5, 8, 10] }, some: { lv: [1, 3, 6, 10], va: [4, 8, 12, 20] }, lots: { lv: [2, 5, 10, 20], va: [6, 12, 20, 35] } };
const VARIETY = { arpg: 'enemy types, bosses and loot items', rpg: 'enemies, items and quests', fps: 'enemy types, weapons and arenas', platformer: 'enemy types, hazards and power-ups', roguelike: 'enemies, upgrades and room templates', strategy: 'unit types, buildings and maps', survival: 'creatures, recipes and biomes', puzzle: 'puzzle mechanics and level sets', racing: 'tracks, cars and race modes', sim: 'buildings, events and scenarios', cozy: 'crops, fish, crafts, decorations and characters', adventure: 'regions, items, clues and characters', metroidvania: 'rooms, enemies, abilities and bosses', horror: 'threats, items, puzzles and scare moments', tower: 'tower types, enemy types and maps', deck: 'cards, enemies and relics' };
const packOf = p => (typeof PACKS !== 'undefined' && PACKS[p.platform]) || {}; // PACKS comes from platforms.js
// ---------- module library (min scope, phase, title, flavor, task, done) ----------
function modules(p) {
  const P = pickOpt(PLATFORMS, p.platform), dec = P.kind === 'declarative', multi = p.mp !== 'none';
  const dev = p.devices || [], ctl = p.controls || [], gm = G[p.genre] || G.arpg, snd = soundIdentity(p);
  const M = [];
  const add = (ph, min, t, f, b, d) => M.push({ ph, min, t, f, b, d });
  // I Foundation
  if (p.existing === 'existing') add(0, 0, 'Audit & Map the Existing Project', 'Know what you already have before building more.',
    'Read the existing project and produce: a folder/structure map, what already works, what is broken or missing compared with the roadmap below, and a prioritised fix list. Do NOT rewrite working code; propose changes as small, reviewable steps.', 'I have a written map of the project and a prioritised list of fixes.');
  else add(0, 0, 'Project Setup & First Scene', 'Get an empty, running project so every later step has a home.',
    dec ? `Start a new ${P.label} project for "${p.name}". Describe the empty world, the player start, and the ground/environment for a ${p.dim} ${pickOpt(GENRES, p.genre).label} using the ${pickOpt(ARTS, p.art).label} look.`
      : `Create a new ${P.label} project for "${p.name}". Set up the folder layout (${P.folders[0]}, ${P.folders[1]}, ${P.folders[2]}), source control (.gitignore), and one scene that runs.`, 'The project runs and shows an empty scene.');
  add(0, 0, 'Input & Controls', 'One input layer that supports every device you chose.',
    `Add an input layer for ${joinN(ctl, QUESTIONS.find(q => q.id === 'controls').options)}. Map move, look/aim, primary action, secondary action and pause. ${dev.includes('mobile') ? 'Include on-screen touch controls.' : ''}`, 'All controls respond on each chosen device.');
  add(0, 0, 'Camera', 'How the player sees the world.', `Implement the ${camDesc(p)}. Make it smooth, bounded and adjustable via a few tuning values.`, 'The camera follows and feels smooth.');
  add(0, 0, 'Player Controller', 'The body you control.', `Create the player character controller for a ${p.dim} ${pickOpt(CAMS, p.camera).label.toLowerCase()} game: movement, ${p.genre === 'platformer' ? 'jumping,' : ''} collision, and speed tuning exposed as values.`, 'I can move around without clipping or jitter.');
  add(0, 0, 'First Playable Level (Blockout)', 'A grey-box space to test everything in.', `Build a small blockout level suited to ${pickOpt(GENRES, p.genre).label}: a start, some obstacles and a goal. Use ${pickOpt(QUESTIONS.find(q => q.id === 'assets').options, p.assets).label.toLowerCase()} for visuals.`, 'I can traverse the level from start to goal.');
  add(0, 0, 'Sound Identity & Audio Manager', 'Decide how this game sounds once, so everything matches.',
    `Write the Sound Bible for "${p.name}": ${snd.style} List every sound the game needs, by name, grouped as music tracks, sound effects (start with: ${snd.sfxList}), ambience loops per zone and ${p.voice && p.voice !== 'none' ? 'voice lines' : 'no voice lines'}. Give each a short description and ONE reusable style prompt that can be pasted before every sound request. Then ${dec ? 'describe an audio manager with music, effects, ambience and voice volume groups and a way to play a sound by name' : 'create an audio manager with separate music, effects, ambience and voice buses/volume groups and a play(name) function that every later step will call'}. ${soundSource(p, 'the sounds')}`,
    'The Sound Bible exists, and I can trigger a sound by name from the game.');
  add(0, 1, 'Game Loop & State Architecture', 'Keep rules separate from visuals so the game stays fixable.', dec ? 'Describe the main game states (boot, menu, playing, paused, game over) and how the game moves between them.' : 'Create a clear game-state flow (boot, menu, playing, paused, game over) and keep gameplay logic separate from rendering/presentation code.', 'States switch cleanly with no leftover objects.');
  if (dec) add(0, 1, 'Art Direction & Shader Look', 'The platform makes the art, so you steer it with words.', `Write one look brief for "${p.name}" that I can paste to ${P.label}: the ${pickOpt(ARTS, p.art).label} style, a palette of 5 named colours, the lighting mood, and a shader/post-processing look (for example outlines, cel shading, pixelation, bloom or fog). Say what to keep the same everywhere so every object looks like it belongs.`, 'New objects match the same look.');
  add(0, 2, 'Art & Asset Pipeline', 'A repeatable way to get art into the game.', `Set up how ${pickOpt(QUESTIONS.find(q => q.id === 'assets').options, p.assets).label.toLowerCase()} enter the project in the ${pickOpt(ARTS, p.art).label} style: naming, folders, import settings and a style guide of 5 rules.`, 'A new asset can be dropped in and appears correctly.');
  add(0, 1, 'HUD & Menu Shell', 'The screens around the game.', 'Create a main menu, pause menu and a minimal HUD that will hold health/score/objectives.', 'I can start, pause and quit from menus.');
  // II Core gameplay (genre)
  gm.forEach(([min, t, f, b, d]) => add(1, min, t, f, b, d));
  if (p.sub && p.sub !== 'none') { const s = SUB_MOD[p.sub]; add(1, 1, s[0], s[1], s[2], s[3]); }
  if (multi) MP_MODS.forEach(([min, t, f, b, d]) => add(1, min, t, f + ` (${pickOpt(QUESTIONS.find(q => q.id === 'mp').options, p.mp).label})`, b, d));
  // content loops: a vertical slice, more levels, more variety
  { const cn = CONTENT_N[p.content] || CONTENT_N.some, sc = +p.scope;
    add(1, 1, 'Vertical Slice Review', 'Prove the fun before making more.', 'Pick one 5-10 minute section that uses every system built so far (move, core action, enemies or goals, feedback, sound). Play it end to end, write the 5 weakest things, and fix the top 3. Do not add new features.', 'One section plays start to finish and I would show it to a friend.');
    add(2, 1, 'More Levels', 'Turn one level into a game.', `Build levels 2 to ${cn.lv[sc]} (${cn.lv[sc]} total). Before building, list one new idea per level and how difficulty rises. Reuse the systems already built; do not add engine features. ${PACE[p.content] || PACE.some}`, `${cn.lv[sc]} levels are playable in order, each teaches or twists one idea, and difficulty rises.`);
    add(2, 1, 'Content Expansion: Variety Pass', 'Enough variety to keep it fresh.', `Grow the variety to about ${cn.va[sc]} distinct pieces in total across: ${VARIETY[p.genre] || VARIETY.arpg}. Each new piece must change how the player plays, not only its numbers. Use data tables or config, not copy-pasted code.`, `There are about ${cn.va[sc]} distinct pieces and each plays differently.`); }
  // III Content & progression
  add(2, 1, 'Core Loop Tuning', 'Find the fun and make it repeatable.', `Review the ${pickOpt(GENRES, p.genre).label} core loop, move all key numbers into one tunable data file/section, and do a first balance pass. Difficulty target: ${{ forgiving: 'forgiving (generous checkpoints, low penalty for failure)', balanced: 'balanced and fair', punishing: 'punishing (real consequences, patterns the player can learn)', adjustable: 'adjustable by the player' }[p.difficulty]}.`, 'Key numbers live in one place and I can tweak them.');
  add(2, 2, 'Progression & Unlocks', 'A reason to keep playing.', 'Add a simple progression layer: what the player earns, what it unlocks, and how that is shown.', 'Playing earns something visible.');
  if (p.story !== 'none') add(2, 2, 'Dialogue & Narrative', 'Let characters talk.', `Add a ${p.story === 'heavy' ? 'branching dialogue system with flags and choices' : 'light text/dialogue system'} for the story of "${p.name}".`, 'I can trigger and read a conversation.');
  if (p.story === 'heavy') add(2, 2, 'Quest & Lore Log', 'Keep track of the story.', 'Add a quest/lore log that records story state and objectives.', 'The log updates as the story advances.');
  add(2, 2, 'Onboarding & Tutorial', 'Teach without a wall of text.', 'Design the first 5 minutes: introduce one mechanic at a time with prompts that disappear once learned.', 'A new player learns the basics unaided.');
  { // planned accessibility or player-adjustable difficulty pulls this step into smaller projects
    const acc = (p.access || []).map(i => pickOpt(QUESTIONS.find(q => q.id === 'access').options, i).label), adj = p.difficulty === 'adjustable';
    add(2, acc.length || adj ? 1 : 3, adj || acc.length ? 'Difficulty Modes & Accessibility' : 'Difficulty & Accessibility Options', 'Let more people enjoy it.',
      `${adj ? 'Add player-selectable difficulty modes (what each changes: enemy damage, timers, resources). ' : 'Add a difficulty setting. '}${acc.length ? 'Implement these accessibility features: ' + acc.join(', ') + '.' : 'Add remappable controls, subtitle/size options and colour-blind friendly cues.'}`, 'Options change the experience as labelled.');
  }
  add(3, 2, 'Playtest & Fix Pass', 'Let real play find the problems.', 'Play the whole game once yourself and watch 2 other people play without help. Write down every point where they were confused, stuck or bored, then fix the top 10. Do not add features.', 'A new player gets through the first 10 minutes without asking me anything.');
  // IV Feel & polish
  add(3, 0, 'Ambience & Music Layers', 'The world should sound alive even when nothing happens.', `Add looping ambience for each zone/area (${snd.amb}) and a music system with ${p.scope >= 2 ? 'layers that fade in and out with intensity (calm, tension, combat) plus short stingers for wins and defeats' : 'one calm loop and one action loop with a smooth crossfade'}. Keep to the sound style: ${snd.music}. ${soundSource(p, 'music and ambience')}`, 'Each area has its own ambience and the music changes smoothly with the action.');
  add(3, 2, 'Mix & Audio Polish', 'Make everything sit together.', 'Balance volumes between music, effects, ambience and voices; add ducking (music dips under important sounds), remove clipping, vary repeated sounds (small pitch/volume changes) and expose music/effects/ambience volume sliders in the settings.', 'Nothing clips, repeated sounds do not feel robotic, and I can adjust each volume.');
  if (RETRO[p.perf]) add(3, 0, 'Retro Hardware Look: ' + RETRO[p.perf].replace(/^an? /, ''), 'Make it look and feel like it runs on old hardware.', `Make the game look like it runs on ${RETRO[p.perf]}: ${RETRO_LOOK[p.perf]}. Do this with a render texture / low-resolution target plus a palette or shader pass, and make the limits a few easy-to-tune values. If ${pickOpt(PLATFORMS, p.platform).label} cannot do a part of this exactly, say so and do the closest thing.`, 'The game is locked to the old look and still plays well.');
  add(3, 1, 'Game Feel: Juice & Feedback', 'The small touches that make it satisfying.', `Add feedback to the most-used actions: hit flashes, particles, ${p.dim === '2D' ? 'screen shake' : 'camera shake'}, and short pauses on impact.`, 'Key actions feel punchy.');
  add(3, 2, `Visual Style Pass: ${pickOpt(ARTS, p.art).label}`, 'Make it look like one game.', `Apply the ${pickOpt(ARTS, p.art).label} look consistently: lighting/colour palette, ${p.dim === '2D' ? 'sprite and tile polish' : 'materials and post-processing'}, and UI styling.`, 'Screens look cohesive.');
  add(3, 2, 'Performance Budget & Profiling', 'Fast on the devices you chose.', `Profile on ${joinN(dev, QUESTIONS.find(q => q.id === 'devices').options)} targets; set a frame-time budget and fix the worst offenders.`, 'The game holds its target frame rate.');
  // V Ship
  add(4, 1, 'Save & Load', 'Let players come back later.', `Add safe save/load for progress and settings, with versioning so old saves do not break. ${p.session === '10' ? 'Sessions are short (about 10 minutes): autosave often and resume instantly where the player left off.' : p.session === 'long' ? 'Sessions are long: add several save slots and an autosave that never overwrites the last good save.' : 'Autosave at natural checkpoints and offer a manual save.'}`, 'Quitting and reopening restores progress.');
  add(4, 2, 'Settings Menu', 'Graphics, audio and controls.', 'Build a settings menu that persists between sessions.', 'Settings persist after restart.');
  if (dev.includes('mobile')) add(4, 1, 'Touch UI & Mobile Adaptation', 'Fit on a phone.', 'Resize all UI for small screens, add safe-area handling and thumb-friendly buttons.', 'The game is comfortable on a phone.');
  add(4, 1, 'Tests & Bug Bash', 'Find problems before players do.', dec ? 'Write a test checklist: 20 scenarios to play through and expected results.' : 'Add automated tests for the core rules and write a manual test checklist.', 'Tests pass and the checklist is clean.');
  add(4, 0, 'Build & Playtest Package', 'Get it into other people\'s hands.', `Export a playable build ${dev.includes('web') ? '(web build included)' : ''} for ${joinN(dev, QUESTIONS.find(q => q.id === 'devices').options)}, with a one-page how-to-play.`, 'A friend can play it without my help.');
  if (dev.includes('console')) add(4, 3, 'Console Certification Checklist', 'Pass platform rules.', 'List and satisfy the platform-holder technical requirements (save, suspend/resume, controller disconnect, achievements).', 'Every checklist item is handled.');
  if (p.money && p.money !== 'none') add(4, 1, 'Monetization & Store Rules', 'Earn without annoying players.', p.money === 'paid' ? `Decide the price and whether to offer a demo or free first level; add a clear first-run flow and make sure nothing in the game feels paywalled mid-play.${p.audience === 'all' ? ' Check the platform rules for products aimed at children.' : ''}` : `Add ${p.audience === 'all' ? 'only child-safe monetization (no targeted ads; check the platform rules for products aimed at children)' : 'rewarded ads and/or optional cosmetic purchases'}. Nothing may be required to progress, and nothing may give a paying player an unfair edge. Show the player clearly what a purchase does.`, 'The game can earn money, a player is never forced to pay, and purchase screens are clear.');
  add(4, 3, 'Playtest Telemetry & Feedback', 'Learn from real players.', 'Add lightweight, privacy-respecting playtest telemetry and a feedback button.', 'I can see where players quit or struggle.');
  add(4, 3, 'Localization-Ready Text', 'Reach more players.', 'Move all text into string tables so translations can be added later.', 'No hard-coded player-facing text remains.');
  add(4, 3, 'Store Page, Trailer & Press Kit', 'Launch.', 'Prepare the store page copy, screenshots, trailer shot list and a press kit.', 'Everything needed to publish exists.');
  const T = tplOf(p);
  if (T) T.add.forEach(([ph, min, t, f, b, d]) => add(ph, min, t, f, b, d));
  // steps that only exist because of the later answers
  add(0, 1, 'Milestone Plan', 'Turn the steps into a calendar you can keep.', `Group the steps below into 4-6 milestones for ${LABEL('team', p.team)} working ${LABEL('time', p.time)}. For each milestone give the steps in it, a rough date range, and what a player could do at the end. Mark the first playable moment. Cut or delay anything that does not fit.`, 'I have milestones with dates and a clear first playable.');
  if (p.procedural && p.procedural !== 'none' && !M.some(m => /Procedural/.test(m.t))) add(1, 1, 'Procedural Generation', 'Rules that build the game for you.', `Add generation for ${LABEL('procedural', p.procedural)}: a seeded generator that gives the same result for the same seed, rules that guarantee it is always playable and winnable, and a debug view to inspect results.`, 'The same seed always gives the same, playable result.');
  if (p.mods && p.mods !== 'none') add(4, 2, 'Mod Support', 'Let players extend the game.', p.mods === 'data' ? 'Move items, enemies, levels and text into plain data files in a mods folder that are loaded at start, with clear error messages for bad files.' : 'Add a mod loader with a scripting API, a mods folder, version checks, safe defaults on a bad mod, and workshop-ready packaging.', 'A sample mod changes the game without editing source code.');
  if (p.online && p.online !== 'none') add(4, 2, 'Online Services', 'Connect to the outside world.', `Add ${LABEL('online', p.online)}: ${p.online === 'board' ? 'score submission and a leaderboard with basic cheat checks' : p.online === 'acct' ? 'sign-in, cloud save sync with conflict handling, and privacy basics' : 'accounts, events, a store and server-side checks, with a clear way to turn each off'}. The game must still start offline.`, 'The feature works online and fails gracefully offline.');
  const pk = packOf(p); // platform pack: engine-specific wording for steps it knows, generic text for the rest
  M.forEach(m => { let o = pk.override && pk.override[m.t]; if (typeof o === 'function') o = o(p, m); if (o) { if (o.f) m.f = o.f; if (o.b) m.b = o.b; if (o.d) m.d = o.d; } });
  if (T) M.forEach(m => { const k = Object.keys(T.steps || {}).find(x => m.t.startsWith(x)); if (k) m.b += ' FOR THIS TEMPLATE: ' + T.steps[k] + (/^Sound Identity/.test(m.t) ? ' SOUND DIRECTION: ' + T.sound + ' MUSIC DIRECTION: ' + T.music : '') + (/^(Art & Asset|Visual Style)/.test(m.t) ? ' ART DIRECTION: ' + T.art : ''); });
  const X = { 'Save & Load': SAVE_TXT[p.save], 'HUD & Menu Shell': UI_TXT[p.ui], 'Player Controller': FEEL_TXT[p.feel], 'Store Page, Trailer & Press Kit': (p.store || []).length ? 'Prepare for: ' + p.store.map(i => STORE_TXT[i]).join('; ') + '.' : '', 'Localization-Ready Text': p.langs && p.langs !== 'en' ? 'Plan for ' + LABEL('langs', p.langs) + ': allow longer text in every layout and support non-Latin fonts.' : '' };
  M.forEach(m => { if (X[m.t]) m.b += ' ' + X[m.t]; });
  if (p.langs && p.langs !== 'en') M.forEach(m => { if (m.t === 'Localization-Ready Text') m.min = 1; });
  if (p.amb === 'adapt') M.forEach(m => { if (m.t === 'Ambience & Music Layers') m.b += ' Build an ambience zone system: each area is tagged (outdoor, indoor, cave, underwater) and the sound crossfades, low-pass filters (muffles) and changes reverb when the player crosses a boundary; weather and time of day change the layers.'; });
  if (p.folder) M.forEach(m => { if (m.t === 'Project Setup & First Scene') m.b = `The project folder already exists at ${p.folder}, with git and .gitignore set up. Work inside it; do NOT run git init or replace .gitignore. ` + m.b; }); // made by the app
  return M.filter(m => !(T && T.skip && T.skip.includes(m.t)) && !(p.save === 'none' && m.t === 'Save & Load'));
}

function generate(p) {
  p = { ...DEFAULTS, ...p };
  const lvl = +p.scope, P = pickOpt(PLATFORMS, p.platform), pk = packOf(p);
  const mods = modules(p).filter(m => m.min <= lvl).sort((a, b) => a.ph - b.ph); // stable sort keeps authored order inside a phase
  const total = mods.length, opts = id => QUESTIONS.find(q => q.id === id).options;
  const proj = `PROJECT: "${p.name}"${p.pitch ? ' - ' + p.pitch : ''}. A ${SCOPE_LABEL[lvl]} ${p.dim} ${pickOpt(CAMS, p.camera).label.toLowerCase()} ${pickOpt(GENRES, p.genre).label}${p.sub !== 'none' ? ` with ${pickOpt(SUBS, p.sub).label} elements` : ''} built on ${P.label} (${P.lang}). Art: ${pickOpt(ARTS, p.art).label}. Multiplayer: ${pickOpt(opts('mp'), p.mp).label}. Devices: ${joinN(p.devices, opts('devices'))}. Controls: ${joinN(p.controls, opts('controls'))}. Mood: ${toneText(p)}.${vibeLine(p)}${packsLine(p)} Audience: ${pickOpt(opts('audience'), p.audience).label}. Performance target: ${pickOpt(opts('perf'), p.perf).label}.${p.refs ? ' Should feel like: ' + p.refs + '.' : ''}${p.loop ? ' Core loop / win condition: ' + p.loop + '.' : ''} Session length: ${pickOpt(opts('session'), p.session).desc}.${extrasLine(p)} Budget: ${pickOpt(opts('budget'), p.budget).label}${p.budget === 'free' ? ' (use only free tools and CC0/free-licence assets)' : ''}.${p.existing === 'existing' ? ' This builds on an EXISTING project: preserve working code.' : ''}${p.extra ? ' Extra requirements: ' + p.extra + '.' : ''}`;
  const expNote = p.exp === 'beginner' ? 'I am new to game development: explain in plain language, say exactly what to click and which files to create, and avoid jargon.' : p.exp === 'pro' ? 'I am experienced: be concise and skip basics.' : '';
  const aiNote = { claude: 'Reference exact file paths so Claude Code can edit them.', cursor: 'Give changes file by file so Cursor can apply them.', copilot: 'Keep each change small and file-scoped.', codex: 'Provide complete files that can be pasted.', gemini: 'Provide complete files that can be pasted.', chat: 'Give complete files in separate code blocks.', platform: 'Phrase everything for the platform\'s own AI.' }[p.ai];
  const steps = mods.map((m, i) => ({
    t: m.t, f: m.f, ph: PHASE_NAMES[m.ph],
    prompt: [hasStyle(p, 'ponytail') ? PONYTAIL : '', styleRule(p), proj, tplBrief(p, m.ph <= 1), `STEP ${i + 1} OF ${total}: ${m.t}`,
      `ALREADY BUILT: ${i ? mods.slice(Math.max(0, i - 25), i).map(x => x.t).join('; ') : 'nothing yet, this is the first step'}. Reuse it; do not rebuild it.`,
      `TASK: ${m.b}`, soundLine(m, p), `HOW: ${P.how}${pk.how ? ' ' + pk.how : ''}`, pk.pitfalls || '', expNote, p.ai ? aiNote : '',
      `ACCEPTANCE: 1) ${m.d} 2) It runs without errors${P.kind === 'declarative' ? ' in the live game' : ' on ' + P.label}. ${i ? '3) Everything from earlier steps still works.' : ''}`.trim(),
      i < total - 1 ? `NOT YET (later steps): ${mods.slice(i + 1, i + 4).map(x => x.t).join('; ')}. Do not build these now. When done, list what to test and what comes next.` : 'When done, list what to test and what is left to ship.'].filter(Boolean).join('\n\n'),
  }));
  return steps;
}

function rulesFor(p) {
  p = { ...DEFAULTS, ...p }; const P = pickOpt(PLATFORMS, p.platform), g = pickOpt(GENRES, p.genre).label;
  return ['Minimal & YAGNI (no needless wrappers)', 'Game logic separated from presentation', `Idiomatic for ${P.label} (${P.lang})`, 'Null checks and error handling intact',
    P.kind === 'declarative' ? 'No runaway per-frame work described' : 'No per-frame allocations in hot loops', 'Values data-driven (no magic numbers)', `Matches ${g} design goals`,
    `Camera and controls match ${pickOpt(CAMS, p.camera).label} / ${joinN(p.controls, QUESTIONS.find(q => q.id === 'controls').options)}`, 'Save/load and state persistence are safe',
    p.mp !== 'none' ? 'Server authority and sync are correct for multiplayer' : 'No hidden global state; behaviour is repeatable', 'Testable in isolation', 'No golfed validation or error handling'];
}

function handoffFor(p, steps) {
  p = { ...DEFAULTS, ...p }; const P = pickOpt(PLATFORMS, p.platform);
  return `PROJECT HANDOFF: ${p.name}
${p.pitch || ''}

PROFILE
Platform: ${P.label} (${P.lang})   Dimension: ${p.dim}   Camera: ${pickOpt(CAMS, p.camera).label}
Genre: ${pickOpt(GENRES, p.genre).label}${p.sub !== 'none' ? ' + ' + pickOpt(SUBS, p.sub).label : ''}   Art: ${pickOpt(ARTS, p.art).label}   Scope: ${SCOPE_LABEL[+p.scope]}
Multiplayer: ${pickOpt(QUESTIONS.find(q => q.id === 'mp').options, p.mp).label}   Story: ${p.story}   Devices: ${joinN(p.devices, QUESTIONS.find(q => q.id === 'devices').options)}
Coding style: ${styleText(p)}${hasStyle(p, 'ponytail') ? ' (lean; never golf validation or balance math)' : ''}   AI tool: ${pickOpt(QUESTIONS.find(q => q.id === 'ai').options, p.ai).label}
${p.extra ? 'Extra requirements: ' + p.extra : ''}

ROADMAP (${steps.length} steps)
${steps.map((s, i) => `${String(i + 1).padStart(2, '0')}. ${s.t}`).join('\n')}

HOW TO WORK
1. Do the steps in order. Finish and verify each one before the next.
2. ${P.how}
3. After each step, list what to test and update the roadmap.
4. Never remove error handling, null checks or balance math to shorten code.`;
}

function agentsFor(p) {
  p = { ...DEFAULTS, ...p }; const P = pickOpt(PLATFORMS, p.platform);
  if (P.kind === 'declarative') return `# AGENTS.md (${p.name})\n\n${P.label} builds the game inside its own platform, so there are no source folders to split between agents.\nUse this file as the design contract:\n- Describe one mechanic at a time and playtest before moving on.\n- Keep the profile in HANDOFF.md as the source of truth.\n- Never ask the AI to remove existing behaviour while adding new behaviour.`;
  return `# AGENTS.md (${p.name}, ${P.label})\n\n## Agent Work Crew Roles\n1. Agent 1 (Gameplay): ${P.folders[0]}\n2. Agent 2 (Systems & Infrastructure): ${P.folders[1]}\n3. Agent 3 (Tests & QA): ${P.folders[2]}\n\n## Guardrails\n- RULE 1: ${hasStyle(p, 'ponytail') ? 'Ponytail: no extra wrapper classes or managers; smallest working change.' : 'Keep abstractions justified by real duplication.'}\n- RULE 2: Game logic stays separate from presentation/rendering.\n- RULE 3: Never delete validation, null checks, error handling or balance math to simplify.\n- RULE 4: Agents only edit their own folders; cross-folder changes are requested, not made.`;
}

// ---------- can this PC build it? [minRAM, recRAM, minVRAM, recVRAM, diskGB] ----------
const REQ = { spawn: [4, 8, 0, 0, 1], rosebud: [4, 8, 0, 0, 1], phaser: [4, 8, 0, 0, 2], construct: [4, 8, 0, 0, 2], gamemaker: [4, 8, 1, 1, 5],
  godot2: [4, 8, 0, 1, 3], godot3: [8, 16, 2, 4, 5], unity2: [8, 16, 1, 2, 15], unity3: [8, 16, 2, 4, 15], roblox: [8, 16, 1, 2, 10], three2: [4, 8, 0, 1, 2], three3: [8, 16, 1, 2, 2], unreal: [16, 32, 6, 8, 60] };
function hwCheck(p, hw) {
  if (!hw) return null;
  p = { ...DEFAULTS, ...p };
  const d = p.dim === '2D' ? '2' : '3', r = (REQ[p.platform + d] || REQ[p.platform] || REQ.unity3).slice(), P = pickOpt(PLATFORMS, p.platform);
  const real3d = d === '3' && p.art === 'real' && P.kind !== 'declarative';
  if (real3d) { r[2] += 2; r[3] += 4; r[1] += 8; } // realistic 3D asks much more of the GPU
  if (+p.scope >= 3) r[4] += 20;
  const ram = hw.ramGB * 1.05, vram = hw.gpu ? hw.gpu.vramGB : 0, disk = hw.diskFreeGB ?? 999, reasons = [], tips = [];
  const hard = [];
  if (ram < r[0]) hard.push(`needs at least ${r[0]} GB RAM (you have ${hw.ramGB} GB)`);
  if (vram < r[2]) hard.push(`needs at least ${r[2]} GB of GPU memory (you have ${vram} GB)`);
  if (disk < r[4]) hard.push(`needs about ${r[4]} GB of free disk (you have ${disk} GB)`);
  const frac = Math.min(ram / r[1], r[3] ? vram / r[3] : 9, 9);
  let level = hard.length ? 'red' : frac >= 1 ? 'green' : frac >= 0.75 ? 'yellow' : 'orange';
  if (hard.length) { reasons.push(`${P.label} ${hard.join(' and ')}.`); tips.push('Pick a lighter platform (Godot, Unity 2D, Phaser, Spawn.co), or a 2D/low-poly style.'); }
  else if (level === 'green') reasons.push(`${P.label} should run comfortably on this PC.`);
  else {
    reasons.push(`${P.label} will run, but the recommended setup is ${r[1]} GB RAM and ${r[3]} GB GPU memory (you have ${hw.ramGB} GB / ${vram} GB).`);
    tips.push(real3d ? 'Switch the art style to low-poly or stylised to cut GPU load a lot.' : 'Keep scenes small and close other apps while the editor is open.', 'Lower editor viewport quality and turn off real-time lighting while building.');
    if (level === 'orange') tips.push('Test builds often on a small scene; expect slow editor performance.');
  }
  return { level, fill: { green: 1, yellow: 2, orange: 3, red: 4 }[level], reasons, tips };
}

// Next best model after `failed` ({provider, model}) gave a limit/timeout error. Pure: no DOM, no network.
// Order: other signed-in CLIs, then local models that fit this PC (never red), then API providers with a key.
function nextModel(provs, failed, keys) {
  const skip = (p, m) => p.id === failed.provider && m === failed.model, rank = { green: 0, yellow: 1, orange: 2 };
  for (const p of provs) if (p.found && p.keyless && p.efforts && p.models[0]) {
    const m = p.models.find(x => x !== '(default)' && !skip(p, x)) || (!skip(p, '(default)') && p.models.includes('(default)') ? '(default)' : null);
    if (m && p.id !== failed.provider) return { provider: p.id, model: m, why: 'signed-in tool' };
  }
  const local = [];
  for (const p of provs) if (p.ratings) for (const m of p.models) {
    const r = p.ratings[m]; if (r && r.level in rank && !skip(p, m)) local.push({ provider: p.id, model: m, why: `local, ${r.level} on this PC, ~${r.tps} tok/s`, k: rank[r.level] * 1e4 - (r.tps || 0) });
  }
  local.sort((a, b) => a.k - b.k);
  if (local.length) return local[0];
  for (const p of provs) if (!p.keyless && (keys[p.id] || p.envKey) && p.models[0] && p.id !== failed.provider) return { provider: p.id, model: p.models[0], why: 'API key available' };
  return null;
}

// Download pace from [ms, bytes] samples (last ~10 s). sec = time left, null until 3 s of data. Pure: no DOM, no network.
function pace(samples, total) {
  const n = samples.length; if (n < 2) return { bps: 0, sec: null };
  const last = samples[n - 1], first = samples.find(s => last[0] - s[0] <= 10000) || samples[0];
  const dt = (last[0] - first[0]) / 1000, bps = dt > 0 ? (last[1] - first[1]) / dt : 0;
  return { bps, sec: dt >= 3 && bps > 0 && total > last[1] ? (total - last[1]) / bps : null };
}
const fmtSize = b => b >= 1e9 ? (b / 1e9).toFixed(1) + ' GB' : (b / 1e6).toFixed(b >= 1e8 ? 0 : 1) + ' MB';
// Agent-chat totals {cost, inTok, outTok, ms, turns} as the four numbers the status bar shows.
function fmtStats(s) {
  const tok = s.inTok + s.outTok, sec = Math.round(s.ms / 1000);
  return { cost: '$' + s.cost.toFixed(2), tokens: tok >= 1e6 ? (tok / 1e6).toFixed(1) + 'M' : tok >= 1e3 ? Math.round(tok / 1e3) + 'k' : String(tok),
    time: sec >= 60 ? Math.floor(sec / 60) + 'm ' + (sec % 60) + 's' : sec + 's', turns: String(s.turns) };
}
function fmtEta(sec) {
  if (sec == null) return 'working out time left...';
  if (sec < 60) return 'under a minute left';
  const m = Math.round(sec / 60); return m < 60 ? `about ${m} min left` : `about ${Math.floor(m / 60)} h ${m % 60} min left`;
}

// Adds an approved user template (already validated) to the list and the first question; same id replaces the old entry.
function addTemplate(t) {
  const i = TEMPLATES.findIndex(x => x.id === t.id); if (i >= 0) TEMPLATES.splice(i, 1, t); else TEMPLATES.push(t);
  const q = QUESTIONS.find(x => x.id === 'template'), o = O(t.id, t.label, t.desc), j = q.options.findIndex(x => x.id === t.id);
  if (j >= 0) q.options.splice(j, 1, o); else q.options.push(o);
}
// ---------- template guardrails: every template, hand-written or model-made, must pass this before it is usable ----------
// Returns { errors: [], warnings: [] }. Errors block the template. The Template Lab and tests both call this.
function validateTemplate(t, existingIds = []) {
  const E = [], W = [], str = (v, lo, hi) => typeof v === 'string' && v.trim().length >= lo && v.length <= hi, arr = (v, lo, hi) => Array.isArray(v) && v.length >= lo && v.length <= hi;
  if (!t || typeof t !== 'object') return { errors: ['Template is not an object'], warnings: [] };
  if (!/^[a-z0-9_-]{2,30}$/.test(t.id || '')) E.push('id must be 2-30 lowercase letters, digits, - or _');
  if (existingIds.includes(t.id)) E.push('id is already used by another template');
  if (!str(t.label, 3, 60)) E.push('label must be 3-60 characters');
  if (!str(t.desc, 20, 200)) E.push('desc must be 20-200 characters');
  if (!str(t.inspired, 2, 80)) E.push('inspired must name the game (2-80 characters)');
  if (!t.needs || !['2D', '2.5D', '3D'].includes(t.needs.dim)) E.push('needs.dim must be 2D, 2.5D or 3D');
  else if (!PLATFORMS.some(p => p.dims.includes(t.needs.dim))) E.push('no platform supports ' + t.needs.dim);
  // answers: real question ids and real option ids
  const a = t.answers || {}, bad = [];
  for (const [k, v] of Object.entries(a)) {
    if (k === 'loop') { if (!str(v, 20, 600)) E.push('answers.loop must be 20-600 characters'); continue; }
    const q = QUESTIONS.find(x => x.id === k);
    if (!q || ['name', 'pitch', 'refs', 'template', 'link', 'extra', 'platform', 'existing'].includes(k) || !q.options) { bad.push(k); continue; }
    if (!(q.type === 'multi' ? Array.isArray(v) : typeof v === 'string') || ![].concat(v).every(x => q.options.some(o => o.id === x))) bad.push(k + '=' + JSON.stringify(v));
  }
  if (bad.length) E.push('answers has unknown or invalid entries: ' + bad.join(', '));
  for (const k of ['genre', 'dim', 'camera', 'art', 'tone', 'difficulty', 'scope', 'world', 'fail', 'prog', 'ending']) if (!(k in a)) E.push('answers.' + k + ' is required');
  if (t.needs && a.dim && a.dim !== t.needs.dim) E.push('answers.dim must equal needs.dim');
  if (a.dim && a.camera && !(CAM_OK[a.dim] || []).includes(a.camera)) E.push('camera ' + a.camera + ' is not used in ' + a.dim + ' games');
  // text blocks: size limits
  if (!arr(t.pillars, 4, 8) || !t.pillars.every(x => str(x, 30, 300))) E.push('pillars: 4-8 lines of 30-300 characters');
  if (!str(t.loop || (t.answers && t.answers.loop), 20, 600)) E.push('core loop is missing');
  if (!str(t.philosophy, 150, 1400)) E.push('philosophy must be 150-1400 characters');
  if (!arr(t.avoid, 3, 8) || !t.avoid.every(x => str(x, 15, 300))) E.push('avoid: 3-8 lines of 15-300 characters');
  else if (!/not copy|do not copy/i.test(t.avoid[0])) E.push('avoid[0] must say not to copy the original game');
  for (const k of ['art', 'music', 'sound']) if (!str(t[k], 80, 900)) E.push(k + ' direction must be 80-900 characters');
  if (!arr(t.differ, 2, 6) || !t.differ.every(x => str(x, 10, 200))) E.push('differ: 2-6 ideas');
  if (!str(t.notes, 10, 400)) E.push('notes must state the limits of this entry');
  // steps: shape, ids and no clashes with the built-in steps
  const base = { ...DEFAULTS, ...a, template: 'none', platform: (PLATFORMS.find(p => t.needs && p.dims.includes(t.needs.dim)) || PLATFORMS[0]).id, scope: '3' };
  let plain = [];
  try { plain = generate(base).map(s => s.t); } catch (e) { E.push('could not build a plan from these answers: ' + e.message); }
  const adds = Array.isArray(t.add) ? t.add : [];
  if (!arr(t.add, 6, 12)) E.push('add: 6-12 steps');
  const seen = new Set();
  adds.forEach((x, i) => {
    const n = 'add[' + i + ']';
    if (!Array.isArray(x) || x.length !== 6) return E.push(n + ' must be [phase, minimum size, title, flavour, task, done-when]');
    const [ph, min, ti, f, b, d] = x;
    if (!Number.isInteger(ph) || ph < 0 || ph > 4) E.push(n + ' phase must be 0-4');
    if (!Number.isInteger(min) || min < 0 || min > 3) E.push(n + ' minimum size must be 0-3');
    if (!str(ti, 3, 60) || !str(f, 5, 120) || !str(b, 80, 900) || !str(d, 15, 200)) E.push(n + ' text lengths: title 3-60, flavour 5-120, task 80-900, done-when 15-200');
    if (seen.has(ti)) E.push(n + ' title is repeated'); seen.add(ti);
    if (plain.includes(ti)) E.push(n + ' title clashes with a built-in step: ' + ti);
  });
  if (adds.filter(x => x[1] === 0).length < 3) E.push('at least 3 steps must be minimum size 0 so small projects still get the core');
  if (!adds.some(x => x[0] >= 2)) E.push('at least one step must be in a later phase (2 or higher)');
  (t.skip || []).forEach(x => { if (!plain.includes(x)) E.push('skip names a step that does not exist: ' + x); });
  Object.keys(t.steps || {}).forEach(k => { if (!plain.some(x => x.startsWith(k)) && !adds.some(x => x[2].startsWith(k))) E.push('steps key matches no step: ' + k); });
  // safety: no links or markup, no instructions aimed at the AI, none of the original's proper names
  const texts = []; (function walk(v, key) { if (['sources', 'forbidden', 'inspired', 'label', 'id', 'status'].includes(key)) return; if (typeof v === 'string') texts.push(v); else if (Array.isArray(v)) v.forEach(x => walk(x)); else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, k)); })(t);
  const all = texts.join('\n');
  if (/<[a-z!\/]|https?:\/\/|javascript:/i.test(all)) E.push('text contains markup or a link');
  if (/ignore (all |any )?(previous|prior|above)|system prompt|disregard (the )?(rules|instructions)|you are now/i.test(all)) E.push('text contains an instruction aimed at the AI');
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(all)) E.push('text contains control characters');
  if (all.length > 30000) E.push('template is too long (over 30000 characters)');
  const fb = (t.forbidden || []);
  if (!arr(fb, 3, 40) || !fb.every(x => str(x, 3, 60))) E.push('forbidden: list 3-40 proper names from the original that must not be used');
  else fb.forEach(x => { if (all.toLowerCase().includes(x.toLowerCase())) E.push('uses a name from the original game: ' + x); });
  // sources
  if (!['memory', 'researched'].includes(t.status)) E.push("status must be 'memory' or 'researched'");
  const src = Array.isArray(t.sources) ? t.sources : [];
  if (src.some(x => !x || !str(x.title, 3, 160) || !/^https:\/\/[^\s]+$/.test(x.url || ''))) E.push('every source needs a title and an https link');
  if (t.status === 'researched') { if (src.length < 3) E.push('researched templates need at least 3 sources'); if (new Set(src.map(x => { try { return new URL(x.url).hostname; } catch { return x.url; } })).size < 2) E.push('sources must come from at least 2 different sites'); }
  else W.push('written from memory, not checked against sources');
  // the plan must build cleanly with it on every platform that fits, and the brief must stay a sensible size
  if (!E.length) {
    const tt = { ...t }; let brief = '', old = TEMPLATES.findIndex(x => x.id === tt.id), prev = old >= 0 ? TEMPLATES.splice(old, 1)[0] : null; // same id = a replacement: hide the old one while checking
    try {
      // the candidate is added to TEMPLATES only while checking, then removed
      TEMPLATES.push(tt);
      brief = tplBrief({ template: tt.id }, true);
      for (const pl of PLATFORMS.filter(p => p.dims.includes(t.needs.dim))) {
        const steps = generate({ ...DEFAULTS, ...a, template: tt.id, platform: pl.id, scope: '3' });
        if (steps.some(s => /undefined|\[object/.test(s.prompt))) { E.push('prompts contain undefined on ' + pl.id); break; }
        if (!steps.some(s => adds.some(x => x[2] === s.t))) { E.push('added steps do not appear in the plan on ' + pl.id); break; }
      }
    } catch (e) { E.push('building a plan failed: ' + e.message); }
    finally { const i = TEMPLATES.indexOf(tt); if (i >= 0) TEMPLATES.splice(i, 1); if (prev) TEMPLATES.splice(old, 0, prev); }
    if (brief.length > 3600) E.push('template brief is too long (' + brief.length + ' characters, max 3600)');
  }
  return { errors: E, warnings: W };
}
