// Game templates. A template pre-fills the questionnaire and steers every prompt toward the design of a well-known game,
// without copying it. To add a template: copy one object below, change the fields, add it to TEMPLATES. Nothing else to edit.
//
// Fields:
//   id, label, desc, inspired   what the picker shows ("inspired" names the game it learns from)
//   needs                        { dim } the template only works with this dimension (platforms that lack it are greyed out)
//   answers                      questionnaire answers this template sets (ids as in QUESTIONS); the user can still change them
//   pillars[]                    why the game works, in one line each (put in every prompt)
//   loop                         the core loop in one sentence
//   philosophy                   how the code is structured (put in every prompt)
//   avoid[]                      traps that break the feel (put in every prompt)
//   art, music, sound            direction text, used by the art and sound steps
//   skip[]                       generic step titles this template replaces with its own
//   steps{}                      extra wording appended to a generic step; the key is the start of the step title
//   add[]                        extra steps: [phase 0-4, minimum size 0-3, title, flavour, task, done-when]
//   differ[]                     ideas for making it your own game
//   status                       'memory' (written from general knowledge) or 'researched' (needs 3+ sources)
//   sources[]                    [{ title, url }] pages the entry was checked against
//   forbidden[]                  proper names from the original (characters, places, items) that must never appear in the text
//   notes                        honest limits of this entry
// Written from general knowledge of the games, not from live sources. Numbers marked "about" are from memory.
const TEMPLATES = [
  {
    id: 'souls', label: 'Soulslike (Dark Souls style)', inspired: 'Dark Souls (2011)',
    desc: 'Hard, fair, committed combat. Stamina, bonfire checkpoints, a world that loops back on itself.',
    status: 'memory', sources: [],
    forbidden: ['Lordran', 'Estus', 'Solaire', 'Firelink', 'Anor Londo', 'Undead Asylum', 'Gwyn', 'Artorias', 'Havel', 'Humanity', 'Chosen Undead', 'Darkroot', 'Blighttown', 'Sen\'s Fortress'],
    needs: { dim: '3D' },
    answers: { genre: 'arpg', sub: 'none', dim: '3D', camera: 'tps', art: 'real', tone: 'dark', audience: 'adult', difficulty: 'punishing', scope: '3', content: 'some', session: '60', story: 'light', msty: 'orch', sfx: 'real', amb: 'eerie', voice: 'barks', mp: 'none', perf: 'std', money: 'paid', controls: ['kbm', 'gamepad'], devices: ['pc'],
      world: 'hub', fail: 'softloss', prog: 'gear', feel: 'weighty', nview: 'env', ending: 'boss', procedural: 'none', save: 'checkpoint', ui: 'min', team: 'duo', time: 'part',
      loop: 'Leave the bonfire, explore carefully and fight enemies one at a time, collect souls, open a shortcut back to safety, level up at the bonfire, then beat the boss behind the fog gate. Dying drops your souls where you fell and you get one try to take them back.' },
    pillars: [
      'Committed combat: attacks, rolls and blocks cost stamina and cannot be cancelled once started, so every swing is a decision.',
      'Death teaches: dying costs your souls (currency) at the spot you died; you get one chance to recover them. Enemies come back when you rest.',
      'Fair but hard: every enemy has a readable wind-up and a learnable pattern. Deaths feel like the player\'s mistake, never random.',
      'One connected world: paths loop back to earlier places through shortcuts (doors, elevators, ladders), so the world feels like one real place.',
      'Safe points: bonfires heal you and refill healing flasks, but also respawn every enemy. Resting is a trade-off.',
      'Story told by the world: item descriptions, architecture and a few cryptic characters. No quest log, no hand-holding.',
    ],
    philosophy: 'Player and enemies are explicit state machines (idle, move, attack wind-up, attack active, recover, stagger, dead). Animations drive combat: hit boxes and invincibility frames are switched on and off by animation events whose frame numbers live in data. Combat runs on a fixed timestep. A small input buffer (about 150 ms) forgives early presses. Weapons, enemies, stats and soul costs are data tables, not code. World state is a flat dictionary of flags (door opened, boss dead, bonfire lit) saved at bonfires. No global manager that knows everything: systems talk through small events.',
    avoid: [
      'Do not copy any names, characters, places, lore, art, music or text from the original game. Recreate the design principles only.',
      'No unfair deaths: no hidden instant kills without a clear hint, no enemy attacks without a telegraph, no random damage.',
      'No floaty or cancellable attacks: commitment is the point. Never let the player cancel a swing into a roll for free.',
      'No quest markers or tutorials that explain everything. Teach with the level layout and one safe first enemy.',
      'Do not make runs to a boss too long: after a boss a shortcut or checkpoint must appear within a few minutes of play.',
    ],
    art: 'Desaturated, grey-green and ochre palette with small warm pockets of light (bonfires, torches) that mean safety. Decayed gothic architecture with huge scale and verticality; long sight lines so the player can see places they will reach later. Low-key lighting, heavy fog for depth, readable silhouettes for enemies against the background. Realistic-stylised, not photoreal.',
    music: 'Almost silent while exploring: wind, distant sounds, the player\'s own footsteps. Music only for bosses (orchestral with a choir, building through phases) and a soft, short lull when resting at a bonfire. Silence makes the music matter.',
    sound: 'Heavy, weighty hits with a clear difference between hitting flesh, armour and shield. Armour clinks scale with equipment weight. Footsteps change by surface and are a gameplay cue. Enemies make a sound just before a big attack. Stamina running out has a breathy, panting cue. Voices are short and gruff mumbles; no voiced exposition.',
    skip: ['Melee Combat Core', 'Health & Death Loop', 'Enemy AI: Chase and Attack'],
    steps: {
      'Camera': 'Add a lock-on: a button picks the nearest enemy in front, the camera keeps both player and target framed, movement becomes strafing around the target, and it releases when the target dies or is too far.',
      'Player Controller': 'Movement has weight: a short acceleration, a walk and a sprint that costs stamina, and a roll with a few invincibility frames then a recovery. Movement slows with equip load.',
      'Onboarding & Tutorial': 'Teach with the level: the first area has one slow enemy, a message on the floor that shows the controls, and a safe place to practise. No pop-up tutorials.',
      'Sound Identity': 'Make the first minutes mostly quiet. Plan three layers only: ambience, combat sounds, and boss music.',
      'Visual Style Pass': 'Check that every bonfire or light source is the warmest, brightest thing nearby so safety reads at a glance.',
    },
    add: [
      [1, 0, 'Stamina & Committed Combat', 'Every action is a decision.', 'Build a stamina bar that light attacks, heavy attacks, rolls and blocking all spend. Stamina regenerates only after a short delay and not while blocking. Attacks have wind-up, active and recovery phases and cannot be cancelled during wind-up or recovery. Add a roll with invincibility frames and a backstep. Put all frame counts and stamina costs in one data table.', 'I can fight one enemy using attack, roll and block, and running out of stamina leaves me open.'],
      [1, 0, 'Enemy Telegraphs, Poise & Aggro', 'Hard but fair.', 'Give each enemy type a readable wind-up before every attack, a damage window, and a recovery the player can punish. Add poise: big hits stagger, light hits do not. Enemies notice you inside a cone and a range, chase, and give up (leash) if you run far away. Two enemies must never attack at the exact same moment by default.', 'I can learn an enemy\'s pattern and beat it without taking damage.'],
      [1, 0, 'Bonfire Checkpoints & Healing Flasks', 'Rest is a trade-off.', 'Add bonfires: lighting one sets the respawn point. Resting there restores health, refills a limited number of healing flasks, and respawns all normal enemies. Saving the game happens at that moment.', 'Resting heals me and brings the enemies back; dying sends me to the last bonfire.'],
      [1, 0, 'Souls Currency & Recovery', 'Lose it, earn it back.', 'Enemies drop souls, which are both currency and experience. On death, drop all carried souls at the death spot. Touching the spot gets them back. Dying again before then loses them for good. Show the spot clearly in the world.', 'My souls are left where I died and I can get them back once.'],
      [1, 1, 'Levelling, Stats & Equip Load', 'Build your own fighter.', 'Spend souls at a bonfire to raise stats (vitality, endurance, strength, dexterity, intelligence). Derived values come from stats: health, stamina, damage scaling per weapon. Add equip load: total gear weight sets roll speed in tiers (light, medium, heavy).', 'Raising a stat changes my numbers, and heavy gear makes my roll slower.'],
      [2, 1, 'Interconnected World & Shortcuts', 'One place, not a list of levels.', 'Design the map as a hub with areas that loop back to it. Include at least three shortcuts that open from one side only (a locked door, a lever, a ladder kick-down, an elevator). Make a landmark visible from far away that the player can later reach. Mark nothing on a map: the layout teaches.', 'After opening a shortcut I can get from a far place back to a bonfire quickly.'],
      [2, 1, 'Boss Fight: Fog Gate & Phases', 'The exam.', 'Build a boss arena entered through a fog gate that locks behind the player. The boss has two phases, large readable attacks with different counters, and a health bar at the bottom. A bonfire sits close to the arena. After the win, drop a reward and open a shortcut.', 'The boss has two phases and I can beat it by learning its attacks.'],
      [3, 1, 'Item Lore & Sparse Storytelling', 'The world tells the story.', 'Write one short description for every item and weapon that hints at the world\'s history. Add 3-4 characters who speak in short, vague lines and move on as the game progresses. No quest log.', 'I learn about the world from items and a few characters, without a journal.'],
      [3, 2, 'Minimal HUD & Player Messages', 'Do not hold their hand.', 'Keep the HUD to health, stamina, flasks and souls. Add short messages players can read on the floor (premade phrases only) for hints and warnings.', 'The screen stays clean and I can read a hint left on the ground.'],
    ],
    differ: ['Change the fantasy: a sunken city, a space wreck or a haunted school.', 'Replace stamina with another limit (heat, breath, focus).', 'Make the loop co-op for two players.', 'Give the shortcut system a twist, such as tides that open and close paths.'],
    notes: 'Numbers (invincibility frames, input buffer) are common practice, not exact values from the original.',
  },
  {
    id: 'stardew', label: 'Farming Life Sim (Stardew Valley style)', inspired: 'Stardew Valley (2016)',
    desc: 'Cozy "one more day" loop: farm, fish, mine, make friends. Seasons, small goals, no fail state.',
    status: 'memory', sources: [],
    forbidden: ['Pelican Town', 'Pierre', 'Robin', 'Community Center', 'Junimo', 'Joja', 'Marnie', 'Willy', 'Gunther', 'Ginger Island', 'Cindersap', 'Stardrop', 'Calico Desert', 'Skull Cavern'],
    needs: { dim: '2D' },
    answers: { genre: 'cozy', sub: 'farming', dim: '2D', camera: 'top', art: 'pixel', tone: 'cosy', audience: 'all', difficulty: 'forgiving', scope: '3', content: 'lots', session: '60', story: 'light', msty: 'acou', sfx: 'soft', amb: 'adapt', voice: 'none', mp: 'none', perf: 'std', money: 'paid', controls: ['kbm', 'gamepad'], devices: ['pc'],
      world: 'open', fail: 'nofail', prog: 'unlocks', feel: 'tight', nview: 'ensemble', ending: 'endless', procedural: 'loot', save: 'auto', ui: 'classic', team: 'solo', time: 'part',
      loop: 'Wake up, water and harvest crops, use your energy on fishing, mining or foraging, sell what you made, chat with a neighbour, then sleep. The day ends, the game saves, and tomorrow brings something new.' },
    pillars: [
      'The day is the unit: a short clock (about 14 real minutes per day) ends in sleep, which saves the game and pays out. Players think "one more day".',
      'Many small loops that feed each other: farming, fishing, mining, foraging, animals, crafting. Each is simple; together they fill every day.',
      'Energy, not failure: tools use energy, so the day ends when you choose to rest. No fail state, nothing is lost.',
      'People with lives: neighbours have schedules, favourite gifts and friendship levels that unlock short events.',
      'Seasons: crops, fish and events change with each season (about 28 days each), so the farm keeps changing.',
      'Soft goals: a collection of bundles, upgrades and a growing farm give direction without pressure.',
    ],
    philosophy: 'The world is a tile grid with layers (ground, objects, buildings) and everything on it is data: items, crops, fish, machines, characters, schedules and events live in data files (JSON), not code. A single world clock ticks in fixed in-game minutes and fires "day start" and "day end" events; crops grow, machines finish and shops restock on day change, not in real time. Each activity (farming, fishing, mining, animals) is a small module that registers with the clock, inventory and save system. Mines are generated from a seed made of the save seed and the day, so they are repeatable. Saving happens when the player sleeps and serialises tile state and flags. No giant manager class.',
    avoid: [
      'Do not copy names, characters, towns, dialogue, art or music from the original game. Recreate the design principles only.',
      'No fail state, no permanent loss, no timers that punish players for being away.',
      'Do not add every feature at once. Each activity must be fun alone before they are connected.',
      'Do not make progress a grind: tool upgrades take a day or two to finish, not weeks.',
      'Never block the player with an unclear goal: always show something they can do today.',
    ],
    art: 'Bright, warm pixel art on a 16x16 tile grid in a three-quarter top-down view. Characters are about 16x32. Each season has its own palette (fresh greens in spring, saturated gold in summer, oranges in autumn, blue-white in winter) applied through palette swaps. Items have clear, chunky icons that read at small sizes. UI looks like warm wood and paper with generous padding.',
    music: 'Light acoustic music: guitar, piano, soft strings and woodwinds. One calm theme per season, a quieter loop for each location (farm, town, mines, beach), a gentle night version, and jaunty tunes for festivals. Music fades in and out slowly and never nags.',
    sound: 'Soft and tactile: hoe thuds, watering splashes, a pop for each harvest, a happy chime when something is sold. Gentle ambience that changes by place and weather: birds by day, crickets at night, rain, wind, running water. No voices; dialogue uses text boxes with a small blip per character.',
    skip: ['Day Cycle & Ambient World', 'Gentle Core Activity'],
    steps: {
      'Camera': 'Use a fixed top-down camera that follows the player and stops at the map edge. Pixel-snap it so tiles never shimmer.',
      'Player Controller': 'Four-way movement on a grid feel (free movement, but actions target the tile in front). A tool bar with a selected tool and a "use" button. Energy lowers on each tool use.',
      'Art & Asset Pipeline': 'Use a 16x16 tile size for everything and one shared palette file per season.',
      'Sound Identity': 'Plan sound by place and time: farm, town, mines and beach each get ambience; day and night versions; a separate bank for rain.',
      'Onboarding & Tutorial': 'Start the player on the farm with a tool and three seeds, and a neighbour who gives a gentle first task. Reveal one system per day.',
      'Save & Load': 'The game saves when the player sleeps. Save the clock, tile state, crop growth, machine timers, friendship values and event flags.',
    },
    add: [
      [1, 0, 'World Clock, Energy & Sleep', 'The day is the unit.', 'Build a world clock (about 10 real seconds per 10 in-game minutes) that runs from morning to late night, with day-start and day-end events. Add an energy bar that tools drain. When the clock ends or the player rests, show a short end-of-day summary, save, and start the next day. Fainting late costs only a little money.', 'A full day runs, ends with sleep and a summary, and the next day starts.'],
      [1, 0, 'Farming: Till, Plant, Water, Grow', 'The heart of the loop.', 'Add tilling soil, planting seeds, watering and harvesting. Crops grow in stages measured in days and only advance on day change if watered. Each crop has a data entry: seasons it grows in, days per stage, sell price, re-grow.', 'I can plant, water, wait days and harvest, and crops stop growing out of season.'],
      [1, 0, 'Inventory, Toolbar & Items', 'A pocket for everything.', 'Add a toolbar plus a backpack grid with stacking, an item data table (name, icon, price, category) and picking up items from the world.', 'I can carry, stack and switch items and tools.'],
      [1, 0, 'Shop & Shipping Box', 'Turn work into money.', 'Add a shop that buys seeds and tools, and a shipping box where items placed during the day are sold at day end with a clear summary.', 'Items I ship are paid for at the end of the day.'],
      [1, 1, 'Foraging & Fishing', 'Reasons to leave the farm.', 'Add foraged items that appear daily by season, and a fishing mini-game: cast, wait for a bite, and keep a moving bar over the fish. Fish depend on place, season and time.', 'I can catch a fish and find items that change with the season.'],
      [1, 1, 'Mining & Cave Floors', 'Risk and reward below.', 'Add a mine with floors generated from a seed (save seed + day). Rocks give ore, ladders go down, and simple enemies attack. Leaving or fainting returns the player to the surface.', 'I can descend several floors, collect ore and return, and floors repeat for the same seed and day.'],
      [2, 1, 'Neighbours: Schedules & Friendship', 'People with lives.', 'Add 6 characters with a daily schedule (place by time and day), a favourite and disliked items, short dialogue lines, and a friendship value that rises with talking and gifts and unlocks one short event each.', 'Neighbours are in different places through the day and remember my gifts.'],
      [2, 1, 'Seasons, Calendar & Festivals', 'The year turns.', 'Add four seasons of 28 days with a calendar, season-limited crops and fish, changing palettes and weather (sun, rain), and one festival per season on a fixed date.', 'The season changes the world, the crops and the activities.'],
      [2, 2, 'Animals, Crafting & Machines', 'Give the farm depth.', 'Add a barn with animals that need daily care and give goods, and machines that turn goods into higher-value products over a number of days.', 'Animals and machines produce things I can sell.'],
      [3, 2, 'Collection Goals & Upgrades', 'Soft goals, no pressure.', 'Add a set of collection bundles (for example gather a crop set, a fish set) that unlock a reward, and tool upgrades that take two days to finish.', 'There is always a goal in sight and finishing one unlocks something.'],
    ],
    differ: ['Change the setting: a lighthouse island, a space garden or a bakery town.', 'Replace farming with another loop (beekeeping, tea, ceramics).', 'Add a mystery that unfolds across seasons.', 'Make the weather affect gameplay more.'],
    notes: 'Day length, season length and energy numbers are from memory and about right. Not checked against live sources.',
  },
  {
    id: 'terraria', label: 'Sandbox Dig & Build (Terraria style)', inspired: 'Terraria (2011)',
    desc: 'A 2D world you dig, build and fight in. Depth layers, bosses that unlock new tiers, NPC towns.',
    status: 'memory', sources: [],
    forbidden: ['Terraria', 'Cthulhu', 'Wall of Flesh', 'Hardmode', 'Corruption', 'Crimson', 'Eater of Worlds', 'King Slime', 'Skeletron', 'Moon Lord', 'Demolitionist', 'Dryad', 'Hellevator', 'Plantera', 'Golem', 'Duke Fishron'],
    needs: { dim: '2D' },
    answers: { genre: 'survival', sub: 'osc', dim: '2D', camera: 'side', art: 'pixel', tone: 'epic', audience: 'teen', difficulty: 'balanced', scope: '3', content: 'lots', session: '60', story: 'none', msty: 'elec', sfx: 'styl', amb: 'adapt', voice: 'none', mp: 'coop', perf: 'std', money: 'paid', controls: ['kbm', 'gamepad'], devices: ['pc'],
      world: 'proc', fail: 'softloss', prog: 'gear', feel: 'tight', nview: 'none', ending: 'endless', procedural: 'world', save: 'auto', ui: 'classic', team: 'duo', time: 'part',
      loop: 'Dig for materials, craft better tools and weapons, build a home and safe rooms for new townspeople, explore deeper layers for rarer ore, and beat bosses that unlock the next tier of everything.' },
    pillars: [
      'A world you can change: every tile can be mined or placed. The player digs, builds and shapes the land.',
      'Depth is progression: the surface is safe; deeper layers (underground, caverns, underworld) hold rarer ore and harder enemies. Going down is going up in power.',
      'Crafting tiers: materials from deeper layers unlock new tools, armour and crafting stations, which let the player reach even deeper.',
      'Bosses are gates: defeating a boss changes the world and unlocks the next tier of materials and enemies.',
      'Towns of helpers: build a valid room and a townsperson moves in and sells things. Building has a reward.',
      'Freedom in how to play: melee, ranged, magic and summoner gear, building, exploring, or events. Players set their own goals.',
    ],
    philosophy: 'The world is a 2D array of tile ids plus a wall layer and a small liquid and light layer, stored in chunks. Tiles, walls, items, recipes, enemies and loot are data tables. World generation is a pipeline of passes seeded by a world seed: surface shape from noise, caves, ore veins by depth, biomes, then structures. Only the area near the player is simulated and drawn; far chunks sleep. Lighting is a flood fill that only updates dirty chunks. Liquids move by a small cellular rule. Physics is simple box-versus-tile collision, no physics engine. Saving writes chunks in a compact form (run-length encoding). Simulation and rendering are separate so the same code can run on a server for co-op.',
    avoid: [
      'Do not copy names, characters, items, bosses, art, music or text from the original game. Recreate the design principles only.',
      'Do not simulate the whole world each frame: only active chunks near the player.',
      'Do not store tiles as objects: use compact arrays of ids or the world will not fit in memory.',
      'No grinding walls: each tier should need new materials from a new place, not more of the same.',
      'Do not skip a guidance moment: tell the player what to do next with a helper character\'s hints, never a quest log.',
    ],
    art: 'Bright, readable pixel art on a roughly 16x16 tile grid in a side view. Parallax backgrounds change by layer and biome. Tiles have clear edges and many variants so terrain looks natural when autotiled. Lighting darkens the world with depth, so torches and glow items matter. Enemy and item sprites are small, colourful and easy to tell apart.',
    music: 'A different track for each place: a bright, adventurous theme on the surface by day, a calmer one at night, an eerie one underground, an ominous one in the deepest layer, and a fast intense one for each boss. Chiptune, guitar and synth together. Tracks fade smoothly when the player changes layer.',
    sound: 'Crunchy and satisfying digging that sounds different per material (dirt, stone, ore, wood). Coin pings for ore. Squelchy enemy hits and short death sounds. Chests, crafting stations and doors have clear cues. Ambience by layer: birds and wind on the surface, drips and echoes in caves, rumble and crackle in the deepest layer. No voices.',
    skip: ['Gathering Resources', 'Building / Shelter', 'Day/Night & Weather'],
    steps: {
      'Camera': 'Use a side view that follows the player, with smooth lag, a zoom setting, and chunk loading around the view.',
      'Player Controller': 'Run, jump and fall with box-versus-tile collision. Add mining and placing with the mouse: a reach range, a swing animation, and a block outline on the target tile.',
      'Art & Asset Pipeline': 'Set up autotiling so ground, stone and wood tiles pick the right edge sprite from their neighbours.',
      'Sound Identity': 'Plan a sound bank per material, and ambience and music per layer (surface day, surface night, underground, deep).',
      'Save & Load': 'Save the world in chunks, only chunks that changed, in a compact form. Store the world seed, the player, and flags for bosses defeated.',
    },
    add: [
      [1, 0, 'Tile World Data & Chunk Rendering', 'The world is data.', 'Store the world as arrays of tile ids and wall ids in chunks. Draw only the chunks in view. Add functions to get and set a tile that mark the chunk dirty for lighting and saving.', 'I can see a big world and change a tile without slowing down.'],
      [1, 0, 'Mine & Place Tiles', 'Digging is the fun.', 'Add mining (a tool with a power and a speed, per-tile hardness, drops) and placing blocks from the inventory. Tiles that lose support do not need to fall yet.', 'I can dig a tunnel and build a wall.'],
      [1, 0, 'Procedural World Generation', 'A new world every time.', 'Generate the world in passes from a seed: a surface line from noise, a layer of dirt and stone, caves, ore veins that appear only below set depths, and one or two biomes. Add depth layers (surface, underground, caverns, deep).', 'The same seed gives the same world, and deeper layers have rarer ore.'],
      [1, 0, 'Inventory, Hotbar & Crafting Stations', 'Gather, then make.', 'Add an inventory with a hotbar, a recipe table (inputs, output, required station) and crafting at nearby stations. Start with hand crafting, a workbench and a furnace.', 'I can craft a better pick from ore and wood.'],
      [1, 1, 'Lighting & Liquids', 'Darkness and water.', 'Add light that spreads from sources by flood fill and dims with depth, updated only for changed areas. Add water that flows down and sideways with a simple rule and does not flood the whole world.', 'Caves get dark, torches light them, and poured water flows.'],
      [1, 1, 'Combat, Weapons & Classes', 'Several ways to fight.', 'Add a melee weapon, a ranged weapon with ammo, and a magic weapon with a mana cost, each as data. Give them damage, speed and knockback, and show damage numbers.', 'I can fight with three different weapon types.'],
      [2, 1, 'Enemy Spawning by Place & Time', 'The world pushes back.', 'Spawn enemies near but off-screen using rules by layer, biome and day or night, with a cap. Despawn them when far away. Enemies drop loot from a table.', 'Different places and times give different enemies.'],
      [2, 1, 'Townspeople, Rooms & Shops', 'A reason to build.', 'Define a valid room (enclosed, lit, with a door, a table and a chair). When a valid room is empty and a condition is met, a townsperson moves in and opens a shop with a price list.', 'Building a proper room brings a character who sells things.'],
      [2, 2, 'Boss Fights & Progression Gates', 'Bosses open the next tier.', 'Add two bosses summoned by an item, each with simple phases, an arena rule and a loot drop. Beating each sets a world flag that adds new ore, enemies and recipes.', 'Beating a boss changes what I can find and craft.'],
      [3, 2, 'World Events & Invasions', 'Surprises that need preparation.', 'Add one timed event (for example a night raid) that sends waves of enemies at the player\'s town, with a warning, a progress bar and a reward.', 'An event happens, I defend my town, and I get a reward.'],
    ],
    differ: ['Change the world: a floating sky world, a frozen sea or a giant tree.', 'Change digging for another core verb (grappling, planting, flooding).', 'Add a twist to bosses, such as bosses that wander the world.', 'Make town-building the main goal and combat the side activity.'],
    notes: 'Layer names and the room rule are described in general terms. Mechanic numbers are not given because they were not checked.',
  },
];

// ---- helpers (pure) ----
const tplOf = p => TEMPLATES.find(t => t.id === (p && p.template));
// puts the template's answers into an answers object (the user can still change any of them afterwards)
function applyTemplate(a) { const t = tplOf(a); if (t) Object.assign(a, JSON.parse(JSON.stringify(t.answers))); return a; }
// short text added to every step prompt
function tplBrief(p, full) { // full for the early build steps, a short reminder for the rest
  const t = tplOf(p); if (!t) return '';
  const head = `TEMPLATE: ${t.label}, inspired by ${t.inspired}. Learn from its design; do NOT copy names, characters, places, lore, art, music or code from the original.`;
  return full ? `${head} WHY IT WORKS: ${t.pillars.join(' ')} CODING PHILOSOPHY: ${t.philosophy} AVOID: ${t.avoid.join(' ')}` : `${head} Keep to its pillars (${t.pillars.map(x => x.split(':')[0]).join('; ')}). AVOID: ${t.avoid.slice(1).join(' ')}`;
}
