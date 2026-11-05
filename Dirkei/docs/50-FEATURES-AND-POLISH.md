# Queen's Domain: 50 Feature & Design Polish Specifications

This document outlines 50 curated architectural features and visual polish enhancements designed to elevate Queen's Domain into the premier autonomous vibe-coding studio while maintaining extreme simplicity, zero npm dependencies, and an uncluttered spatial layout centered on the **evolution of the prompt**.

---

## ⚡ Cluster 1: Prompt Evolution & Prompt Engine (Features 1–10)

1. **Prompt Density Modes (Lite / Standard / Deep)**: Instant toggle between *Lite* (concise instructions for Cursor/inline LLMs), *Standard* (balanced game loops), and *Architectural / Deep* (exhaustive zero-GC invariants for Claude 3.7 Sonnet & Opus).
2. **Context & Token Fitness Meter**: Real-time token estimation with color-coded safety indicators (Green: <2k tokens, Gold: 2-8k tokens, Cyan: 8k+ deep context).
3. **Interactive "Nuance Chips" Injector**: 1-click toggles above the prompt box to instantly append specific sub-systems:
   - `+ Procedural Map Generation`
   - `+ Controller / Gamepad Buffer`
   - `+ Local Split-Screen / Co-Op`
   - `+ Dynamic Fog of War`
   - `+ Day / Night Clock`
   - `+ Save Monuments & Checkpoints`
   - `+ Branching Dialogue Tree`
   - `+ Screen-Shake & Combat Juice`
4. **Prompt History Scrubber**: Undo/redo slider to step backward and forward through previous prompt iterations as you tweak settings.
5. **Prompt Diff Viewer**: Subtle visual indicators highlighting exactly what text changed in the prompt when an asset slot or engine parameter is swapped.
6. **Syntax-Highlighted Output View**: Formatted syntax blocks differentiating rules (`[PONYTAIL]`), manifests (`CC0 ASSETS`), and code instructions.
7. **Agent-Specific Prompt Compilers**: 1-click formatting switches that re-target prompt layout specifically for Claude Code CLI (`-p`), OpenAI Codex (`exec`), Cursor (`.cursorrules`), or Ollama (`/api/chat`).
8. **Variable Substitution Legend**: Interactive badge pills showing `${HERO}`, `${WORLD}`, `${ENGINE}`, and `${TIMESTEP}` mappings.
9. **Invariant Assertion Injection**: Checkbox to inject automated unit test assertions (e.g., asserting deterministic 60Hz tick across 30, 60, and 144 FPS).
10. **Multi-Format Export**: Quick export as Markdown (`.md`), Plain Text (`.txt`), or System Prompt JSON.

---

## 📦 Cluster 2: Curated Asset Sheet & CC0 Database (Features 11–20)

11. **"Surprise Combo / Randomize" Dice**: 1-click button that randomizes compatible asset pairings (Hero + World + UI + SFX) from the local CC0 database.
12. **Slot Locking System**: Lock specific slots (e.g., keep *Guardian 3D* locked while cycling through different dungeon or weapon packs).
13. **Asset Pack Footprint & Polycount Badges**: Visual indicators of estimated memory footprint (e.g. `Low-Poly 45k`, `16x16 Pixel Sheet`, `48kHz WAV`).
14. **Quick Search Filter in Sub Drawer**: Real-time search filter inside the `[🔁 Sub In / Out]` drawer to instantly find packs by keyword.
15. **Custom Asset Path Override**: Allow developers to type custom file paths into any slot without breaking prompt injection.
16. **CC0 License & Attribution Generator**: Generates a standardized `ATTRIBUTION.md` crediting Kenney.nl CC0 assets ready for shipping.
17. **Asset Dependency Graph**: Visual indicator showing how tileset colliders connect to character collision hulls.
18. **2D vs 3D Dimension Matcher**: Guardrail flagging when a 2D sprite pack is paired with a 3D low-poly environment with auto-resolve suggestions.
19. **Audio SFX Mixer Matrix**: Shows voice pool capacity and pitch randomization ranges for selected audio packs.
20. **Visual Shader / Palette Previews**: Color swatch previews for Dawnbringer 16, Game Boy 4-Color, and PS1 retro shaders.

---

## 🎨 Cluster 3: Inspiration & Idea Discovery (Features 21–30)

21. **Preset Category Filtering**: Filter cards by *All*, *RPG*, *Action*, *Cozy / Sim*, *Sandbox*, *Arcade*, and *Retro*.
22. **Live Typing Preset Search**: Typing in the search bar dynamically filters and highlights matching preset cards.
23. **"Instant Idea Synthesizer" (Surprise Me)**: Generates unique game pitches by combining random genre + pacing + artistic style.
24. **Preset Difficulty & Scope Rating**: Badges showing project complexity (`Weekend Jam ~9 steps`, `Indie Prototype ~24 steps`, `Commercial ARPG ~50 steps`).
25. **Game Theory & Mechanics Tooltip**: Hovering over preset cards reveals core win/fail loops, risk/reward matrices, and player motivation vectors.
26. **Custom Preset Saver**: Save your current prompt, asset choices, and engine settings as a reusable custom preset.
27. **Preset Favorites Bookmarking**: Star favourite presets so they always appear pinned at the top.
28. **Engine Compatibility Badges**: Clear visual tags showing optimal engines for each preset (e.g., Godot for 2D Cozy, Unity for 3D Souls).
29. **Target Platform Tags**: Displays whether a preset targets Desktop, Web (Spawn/HTML5), Mobile, or Console.
30. **Quick Sample Code Peeker**: Peek at a 5-line sample architecture snippet for any preset before selecting it.

---

## 🖥️ Cluster 4: UI/UX, Glassware Polish & Spatial Ergonomics (Features 31–40)

31. **Collapsible Spatial Sections**: Accordion containers that keep the main studio card focused and tidy.
32. **Global Keyboard Shortcuts**:
    - `/`: Focus search bar
    - `Ctrl + Enter`: Build prompt / Deconstruct
    - `Ctrl + Shift + C`: 1-Click copy prompt
    - `Ctrl + Shift + A`: Send to agent
    - `M`: Toggle menu sidebar
    - `F11`: Desktop fullscreen
33. **Micro-Interactions & Smooth Transitions**: Subtle glow borders, button lift animations, and sleek hover states.
34. **Active Status Header Pills**: Displays current engine, loaded agent model, and asset count in the top navigation bar.
35. **Animated Copy Feedback**: Button transforms with checkmark and toast indicator upon successful copy.
36. **Ultra-Clean Dark OLED Glassware Palette**: Deep background (`#08090e`), frosted glass cards (`backdrop-filter: blur(24px)`), and crisp cyan/gold accents.
37. **Spatial Breadcrumb Navigation**: Interactive 5-step pipeline header allowing 1-click jumps between *Idea*, *Asset Sheet*, *Evolving Prompt*, *Agent Mode*, and *Ship*.
38. **Interactive Help & Guided Tooltips**: Informative hover cards explaining architectural concepts without cluttering prose.
39. **Sleek Custom Scrollbars**: Ultra-narrow, rounded minimalist scrollbars that blend into the glassware aesthetic.
40. **Dynamic Window Title & Meta Synchronization**: Updates window title bar to reflect current active game project.

---

## 🛠️ Cluster 5: Developer Tooling, Starter Bundles & Agent Integrations (Features 41–50)

41. **Starter Bundle File Tree Preview**: Interactive dropdown showing the files inside the `.zip` before downloading.
42. **1-Click Claude Code CLI Command Generator**: Formats and copies `claude -p "..."` with escaped strings ready to paste in terminal.
43. **1-Click Codex CLI Command Generator**: Formats and copies `codex exec "..."` in bypass approvals mode.
44. **Instant `.cursorrules` Generator**: Tailors `.cursorrules` to the active engine (Unity C# vs Godot GDScript).
45. **Genre-Specific `AGENTS.md` Specs**: Auto-populates agent crew roles based on game genre (e.g., Farming Agent vs Combat Agent).
46. **12-Rule Code Hygiene Checklist**: Compact inline checklist verifying state isolation, 60Hz tick, and zero-GC pooling.
47. **Conventional Git Commit Suggester**: Auto-generates structured commit messages for each milestone (e.g., `feat(simulation): implement 60hz deterministic runner`).
48. **Engine Toolchain Quick Links**: 1-click buttons to launch or download Godot 4.3, Blender 4.2, Pixelorama, and Audacity.
49. **Launcher Auto-Update Checker**: 1-click update check against GitHub repo directly in the top navigation bar.
50. **Offline Documentation Launcher**: Direct links to official Godot, Unity, and Spawn API documentation.
