You are continuing work on Queen's Domain Lab, a StarCraft-styled Windows game-planner app (Edge window + local Node helper `server/server.js`, UI in `app/index.html`, pure logic in `app/wizard.js`).

Read `HANDOFF.md` and `CLAUDE.md` first.

Current state: everything is committed on `dev` and fast-forwarded into local `main`; nothing after origin dev 86fb48a is pushed. `npm test` passes. The Ponytail panel (off/lite/full/ultra, Review/Audit, cost/tokens/time/audit tiles) was just added but only tested with fake data.

Next 3 things:
1. Run one real agent chat and one real Spawn build and confirm the Ponytail tiles fill with true numbers.
2. Try Review and Audit in a live Claude agent chat (slash commands) and in a non-Claude chat (plain text).
3. Re-test the Spawn wizard question and a full Spawn build with the real service; add a tests tile only if a real test count is available.

Rules: ponytail style (smallest change that fully works, keep validation and error handling); ask before pushing; never kill port 47831 (test with QD_PORT); edit `app/index.html` in small Edit steps; commit with `git commit -F`; keep replies short and in plain words.
