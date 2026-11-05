# Question audit (session 6)

Every question, what changed, and what is still missing. "Done" means built and covered by `npm test`; nothing here was tried on a real project.

## Changed in this pass
| Question | Change |
|---|---|
| Main genre | 10 to 16: added Cozy Game, Adventure, Metroidvania, Survival Horror, Tower Defense, Deckbuilder. Each has 6-7 core steps, a loop line, sound hooks, tone and variety text. |
| Art style | Shows free tools for the chosen look: Krita, Blender, Blockbench, Inkscape, GIMP (one-click install, winget ids checked) plus web pages (Pixelorama, MagicaVoxel, Meshy, Gemini images, Quaternius, Kenney). Install shows a progress bar. |
| Ambience | Added Adaptive (indoors muffled, caves echo, weather and time of day), Sea, Weather and seasons, Space. Adaptive adds an "ambience zone system" to the sound step. |
| Voices | Added Gibberish talk (Animal Crossing style), Text blips (Undertale style), Creature sounds. |
| Content | Each option now says its length and pacing, plus a new Endless / replayable option. The level and variety steps carry a pacing line. |
| Accessibility | 5 to 12 options (deaf, low vision, contrast, dyslexia, flashing, no-hold, assist, clear goals, text-to-speech, vibration, large touch targets). Touch-size and vibration are greyed out without touch, mobile or gamepad. |
| Performance | Added retro looks: Game Boy, NES, GBA (2D only), PS1, N64, PS2. A "Retro Hardware Look" step spells out resolution, palette and frame cap. |
| Art and sound source | Added "The platform makes it" (Spawn, Rosebud). Declarative platforms get an "Art Direction & Shader Look" step. AI option says this app writes prompts and does not generate art itself. |
| Coding style | Now multi-select: Ponytail, Standard, Test-first, Data-driven, ECS, Teach me, Performance-first. Clashing pairs are greyed out. The line under the tiles explains the combination. Old profiles (one word) still work. |

## Honest answers
- **What generates the art?** Nothing in this app. It writes the prompts and the pipeline step. You run them in a tool (Gemini, Meshy, Krita...). On Spawn and Rosebud the platform makes the art; the plan adds a look brief with palette, lighting and shader words.
- **One click setup:** the "Install all missing" button installs every free app listed. Web tools open a page. A true "everything including accounts" install is not possible, since Meshy and Gemini need your sign-in.

## Still missing (proposed, not built)
- **Team and time:** solo or team, hours per week (drives step pacing).
- **Launch target:** Steam, itch.io, mobile stores, web portal (changes the ship steps and store rules).
- **Save style:** autosave, checkpoints, permadeath.
- **Procedural generation** and **physics weight** (arcade vs realistic).
- **UI style:** diegetic, minimal, retro; **animation level**.
- **Languages** (localisation scope), **mod support**, **online accounts and leaderboards**.
- **Narrative viewpoint** (first/third, silent hero, ensemble) next to the story question.
- **Merge dim and camera**, **access and difficulty** into single questions: kept separate (same screen) so saved profiles keep working.
- Installer checks: Blender and others are found in the usual folders only; a custom install shows as missing. The Visual Studio check does not look for the C++ part.

## Added later in session 6 (15 new questions, now 51 in total)
World layout, failure rule, growth type, control feel, story viewpoint, ending, randomness, team, time per week, release stores, saving, interface style, languages, mod support, online services. All have a place on the 6 screens and feed the project line and these steps: Milestone Plan (always), Procedural Generation, Mod Support, Online Services, plus wording added to Save & Load, HUD, Player Controller, Store Page and Localization. "No saving" removes Save & Load. Screen 6 now has 14 questions: the Normal / Hell / Nightmare modes (next) are what make that manageable.

## Template guardrails (`validateTemplate` in `app/wizard.js`)
Every template must pass it before it is usable. It checks: id format and uniqueness; real answer ids and option values, with 11 answers required; camera valid for the dimension; limits on every text block; 6-12 added steps of the right shape, at least 3 for the smallest size and one in a later phase; added titles that do not clash with built-in steps; skip and step keys that point at real steps; no links, markup, control characters or instructions aimed at the AI; none of the original's proper names (the `forbidden` list); the original-not-copied line; status `memory` or `researched`, where researched needs 3 sources on 2 sites; and a trial build on every fitting platform with a brief under 3600 characters. 19 bad-template cases are tested. What it cannot check: whether a description is factually right, or whether a new idea is too close to the original. A person approves each generated template.
