# Evals

Three tasks, each run three times with the skills installed and three times without, same model and prompt. Each output is scored against 10 checks in that task's `graders.md`.

| Task | With skills | Without |
|---|---|---|
| `canvas-platformer`: build a platformer in plain canvas | 26/30 | 18/30 |
| `phaser-arena-shooter`: build an arena shooter in Phaser 3 | 30/30 | 13/30 |
| `refactor-messy-shooter`: fix a stuttering, buggy shooter | 30/30 | 22/30 |
| **Total** | **86/90** | **53/90** |

Run on 2026-10-26 with Claude Code 2.1.310 headless, model alias `sonnet`. Scores per run are in `results-2026-10-26.json`.

The four missed checks with the skills all come from one run (`canvas-platformer` with-2) where the agent didn't load the skill. It scored 6/10, the same as each run without it. With the skill loaded, every run scored 10/10.

**Rerun after a description fix.** The miss was a triggering problem, so the skill description now names plain HTML canvas and JavaScript games explicitly. Six fresh `canvas-platformer` runs with the skills: the skill loaded in 6/6 and every run scored 10/10 (60/60).

Checks without the skills that failed most often: pausing when the tab is hidden (LIFE-1, 0/9), clearing held keys on blur (INPUT-7, 1/6), input buffering or coyote time, `devicePixelRatio` sizing, audio buses and voice caps, and start screens.

## What this doesn't show

- Three runs per arm on one model. Treat the gap as a direction, not a precise number.
- The checks come from the same rule list the skill teaches, so they measure whether the agent follows the rules, not whether the rules are the right ones.
- Grading reads code; nothing was played in a browser. Runtime checks (frame time, GC, input latency) aren't automated yet.
- Triggering was measured on these three prompts only: 8/9 before the description fix, 6/6 after.

## Running it

`run.sh <case> <with|without> <rep> <outdir> <repo>` runs one session with the Claude Code CLI; the `with` arm loads this repo as a plugin with `--plugin-dir`. Grade the outputs blind: shuffle the run folders and score them against `graders.md`.
