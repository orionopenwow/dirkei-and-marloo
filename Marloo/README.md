# Queen's Domain Architecture Engine

<p align="center">
  <img src="app/icon.png" width="128" height="128" alt="Queen's Domain Logo" />
</p>

<p align="center">
  <strong>Autonomous AI Game Prompt Generator, Modular CC0 Asset Synthesizer & Zero-Debt Studio</strong><br>
  <em>Turn natural game ideas and dropped visual inspiration into modular, production-ready AI agent prompts with pre-matched CC0 asset sheets, 60Hz deterministic architecture, and 1-click starter bundles.</em>
</p>

<p align="center">
  <a href="https://github.com/orionopenwow/queens-domain/releases/tag/v1.0.0"><img src="https://img.shields.io/badge/Release-v1.0.0-gold?style=for-the-badge&logo=github" alt="Release v1.0.0" /></a>
  <a href="https://github.com/orionopenwow/queens-domain/releases/download/v1.0.0/QueensDomain.exe"><img src="https://img.shields.io/badge/Download-QueensDomain.exe-blue?style=for-the-badge&logo=windows" alt="Download EXE" /></a>
  <a href="https://github.com/orionopenwow/queens-domain/releases/download/v1.0.0/QueensDomain-v1.0.0-windows-x64.zip"><img src="https://img.shields.io/badge/Download-Starter_Bundle-cyan?style=for-the-badge" alt="Download Bundle" /></a>
  <img src="https://img.shields.io/badge/Dependencies-Zero_npm-green?style=for-the-badge" alt="Zero Dependencies" />
  <img src="https://img.shields.io/badge/Tests-100%25_Passing-brightgreen?style=for-the-badge" alt="Tests 100% Passing" />
</p>

---

## ⚡ The AI Game Prompt Generator in Action

**Queen's Domain** acts as your **Senior AI Systems Architect**. Instead of asking an AI coding assistant to "build a whole game" (which immediately produces bloated spaghetti code, memory leaks, and hallucinated assets), Queen's Domain greets you with an ultra-clean **Zen creation canvas**, detects your vision, auto-injects verified CC0 2D/3D assets from its local database, and compiles an **Ever-Evolving Game Architecture Prompt** formatted for **Claude Code, Cursor, Codex, and Ollama**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HOW IT WORKS                                    │
│                                                                        │
│   [ 1. Natural Vision / Dropped 3D Art ]                               │
│       "3D Low-Poly Souls with committed stamina combat"               │
│                            │                                           │
│                            ▼                                           │
│   [ 2. Auto-Detection & CC0 Asset Injection ]                         │
│       • Protagonist: Guardian [3D Mesh] (guardian.glb)                │
│       • Environment: Kenney Castle & Dungeon Kit [3D]                  │
│       • UI & HUD: Retro RPG UI Pack & Borders                          │
│       • Audio: RPG SFX Pack (Footsteps, Swings, Impacts)               │
│                            │                                           │
│                            ▼                                           │
│   [ 3. Ever-Evolving Architecture Prompt Generated ]                   │
│       • Pure State Structs (GameState, PlayerInput)                    │
│       • Fixed 60Hz Timestep Runner (dt = 0.01667s)                     │
│       • Decoupled Interpolated Presentation Layer                      │
│       • Ponytail Strict Zero-GC Object Allocation Rules                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📜 Example: Live Generated Architecture Prompt

Here is a full, real-world example of an architecture prompt compiled by the **Ever-Evolving Prompt Engine** when given a 3D Souls concept:

```markdown
[PONYTAIL ARCHITECTURE ENGINE - TARGET: UNITY C#]
Game Vision: "3D Low-Poly Souls with committed stamina combat, dark castle kit, and boss phase at 50% HP"
Pacing: SOULS | Mechanic: ACTION | Style: 3D (Ponytail Zero-GC)

CC0 ASSET MANIFEST (AUTO-INJECTED):
- Protagonist: Queen's Domain Guardian [3D Mesh] -> assets/characters/guardian.glb
- World/Environment: Kenney Castle & Dungeon Kit [3D] -> assets/world/castle_kit/
- Weapons/Gear: Medieval Weapons Pack [3D] -> assets/gear/weapons_pack/
- UI & HUD Kit: Retro RPG UI Pack & Borders -> assets/ui/retro_hud/
- Audio Mix SFX: RPG Audio + Footsteps + Impact SFX -> assets/audio/rpg_sfx/

Act as a senior systems architect. Build an ultra-decoupled, zero-debt fixed 60Hz simulation runner in pure Unity C#:
1. Pure State Struct:
   - Define 'GameState' containing Vector3 position, Vector3 velocity, float stamina (0-100), and EntityState enum.
   - Enforce zero garbage collection: no allocations inside the update loop.
2. System Logic:
   - Create 'SimulationRunner' as a pure isolated class operating strictly on GameState inputs with fixed dt = 0.016667f.
   - Decouple simulation ticks from monitor refresh rate.
3. Decoupled Presentation Layer:
   - Create 'PlayerView' MonoBehaviour that interpolates transforms visually.
   - Zero gameplay logic or collision calculation allowed inside Update().
4. Input Event Broker:
   - Implement a fixed 128-slot circular ring buffer for FrameInput struct (uint tick, ushort buttonMask, Vector2 moveDir).
5. Invariant Assertion:
   - Assert that physics and combat resolution run deterministically whether rendering at 30, 60, or 144 FPS.
```

When you click **[Send to Agent]** or **[Copy Prompt]**, this prompt is immediately loaded into your clipboard or executed via Claude Code CLI (`claude -p "..."`) or Codex (`codex exec "..."`), producing deterministic, test-covered code from turn one.

---

## 🔮 Progressive Unfolding & Inspiration Detection

Queen's Domain overhauls game creation with **Progressive Disclosure**:

1. **The Zen Blank Square**: Opens to a focused, distraction-free square asking: *"What kind of game would you like to create?"*
2. **Instant Inspiration Detection**:
   - **3D Models (`.glb`, `.gltf`)**: Drag and drop any 3D model; Queen's Domain detects the mesh, sets the art mode to 3D, and auto-binds it into the Protagonist slot.
   - **Concept Art / Sprites (`.png`, `.jpg`, `.svg`)**: Drag and drop concept art or sprite sheets; the engine reads the palette, detects pixel density, and updates the asset sheet with matching tilesets.
   - **Inspiration Web Links**: Paste any Pinterest, Sketchfab, ArtStation, or GitHub link directly into the canvas to auto-bind it into the game's manifest.
   - **Audio & SFX (`.wav`, `.mp3`)**: Automatically assigns sound to audio banks.
3. **Dynamic Unfolding**: As you type, the studio smoothly unfolds into:
   - **Live Detection Banner**: Detected Genre, Target Engine, Scope calibration (12, 24, or 50 steps).
   - **Full Background Presets**: Visual preset cards for 2D Pixel RPG, 3D Souls, 2D Cozy Farm Sim, and 2D Sandbox Miner.
   - **Curated Game Asset Sheet**: Direct slots with CC0 substitutes and preview handles.
   - **Live Prompt Dock**: Ever-evolving streaming technical prompt ready to copy or dispatch to your AI agent.
   - **Created Projects**: A clean project gallery showing thumbnails, compiled prompts, with 1-click **[Copy Prompt]** and **[Work on Project]** buttons.

---

## 🕹️ Supported Engine Targets

| Engine | Primary Language | Loop Standard | Code Style |
| :--- | :--- | :--- | :--- |
| **Unity C#** | C# (.NET Standard) | FixedUpdate 60Hz Runner | Pure Structs, Ponytail Zero-GC |
| **Godot 4** | GDScript 4 / C# | `_physics_process(delta)` | Static Typed, Signal-Driven |
| **Unreal Engine 5** | C++ / Blueprints | Sub-stepped Physics Tick | UObject Pools, Subsystems |
| **Spawn.co** | TypeScript / Savi WebGL | RequestAnimationFrame + Tick | Deterministic WebGL Entities |

---

## 🚀 Quick Start & Native Desktop Launcher

### Option 1: Native Windows App (Recommended)
Download and run **[QueensDomain.exe](https://github.com/orionopenwow/queens-domain/releases/download/v1.0.0/QueensDomain.exe)**.
- Single lightweight `.exe` (C# WebView2 launcher).
- Completely self-contained, launches in under 500ms.
- Auto-detects local development tools (Unity, Godot, Blender, Git, Ollama).

### Option 2: Run with Node.js
```bash
git clone https://github.com/orionopenwow/queens-domain.git
cd queens-domain
node server/server.js
```
Open [http://localhost:4242](http://localhost:4242) in your browser.

### Option 3: Run Full Invariant Test Suite
```bash
node tests/run.js
```
*Zero external npm dependencies required. 100% test coverage out of the box.*

---

## 📄 License
MIT © 2026 Orion Open Source. All bundled starter assets are licensed under **CC0 / Public Domain**.
