# Wizard & step generator

## Flow

`QUESTIONS` (25) → answers = a **profile** object (`DEFAULTS` + overrides) → `generate(profile)` → `[{t, f, ph, prompt}]`.

`generate` builds a module list with `modules(profile)`, keeps modules whose `min` ≤ project size (0 jam, 1 small, 2 medium, 3 large), and wraps each in a prompt:

```
[Ponytail rules]            (if coding style = ponytail)
PROJECT: name, pitch, size, dimension, camera, genre, art, multiplayer, devices, controls, refs, loop, session, budget
STEP n OF N: title
TASK: what to build
HOW: platform-specific instructions (code vs plain-language spec)
[experience note] [AI-tool note]
DONE WHEN: acceptance check
```

Phases: I Foundation · II Core Gameplay (genre) · III Content & Progression · IV Feel & Polish · V Ship.

## Extending

**Add a platform**: append `O(id, label, desc, {kind, lang, dims, folders, how})` to `PLATFORMS`. `kind` is `engine`, `web` or `declarative` (declarative = never output code). Add a row to `REQ` for the hardware check.

**Add a genre**: add an `O(...)` to `GENRES` and an entry to `G` with `[minScope, title, flavor, task, doneWhen]` rows. Aim for ~3 rows at `0`, 2 at `1`, 1 at `2`, 1 at `3`.

**Add a sub-genre**: add to `SUBS` and `SUB_MOD`. The default list is GameDiscoverCo's last *public* top-Steam-tags data (Sept 2022); their current rankings are paywalled.

**Add a question**: add to `QUESTIONS` (types: `text`, `single`, `multi`, `allowEmpty` for optional multi), add a default to `DEFAULTS`, then use it in `generate`/`modules`. Disable invalid choices in `blocked()`.

**Add a step module**: call `add(phase, minScope, title, flavor, task, doneWhen)` inside `modules()`.

## Compatibility rules

`blocked()` greys out invalid options: platform vs dimension (e.g. Unreal has no 2D), camera vs dimension (`CAM_OK`). `fixAnswers()` in the page repairs earlier answers when a platform change invalidates them.

## Editing a profile

`applyProfile()` regenerates steps and carries progress over by **step title**. Steps whose title depends on the changed answer (e.g. "Visual Style Pass: Pixel art") lose their checkmark.

## Auditor rules

`rulesFor(profile)` returns 12 rules tuned to the platform, camera, controls and multiplayer choice. The preset keeps its own `RULES12` and `SYS_QD` prompt in `index.html`.
