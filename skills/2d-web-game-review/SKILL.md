---
name: 2d-web-game-review
description: >-
  Review a 2D browser game, a file or a diff for bugs players will hit, performance
  problems, missing polish and accessibility gaps, and write a prioritised report where
  every finding cites a rule and shows the fix. Use this whenever the user asks to
  review, audit, critique or check a 2D web game or its code, asks why their game
  stutters, feels floaty or laggy, or asks what is wrong with it, even if they don't say
  "review". Pairs with 2d-web-game-best-practices, which covers writing new code.
---

# 2D web game review

Review the code against the rules in the `2d-web-game-best-practices` skill and report
what to change. The output is a review, not a rewrite: the reader decides what to fix.
Only change code when the user asks.

## 1. Decide the scope

- Review exactly what the user pointed at: a game, a file, a module or a diff. For a
  diff, review the changed lines and what they break.
- Identify the engine or renderer (package.json, imports). Judge the code against what
  that engine already provides: don't flag a missing fixed step if the engine supplies
  one and the code uses it.
- Say at the top of the report which engine you assumed and what you didn't read.

## 2. Read in this order

1. The main loop and where `update` and `render` are called (LOOP).
2. Input setup and how gameplay reads it (INPUT).
3. Canvas or renderer setup, resize handling, camera (REND).
4. Audio setup (AUDIO).
5. Scene and state handling, pause, restart, saves (LIFE, ARCH).
6. The hot paths: per-frame entity updates and drawing (LOOP-4, LOOP-5, REND-3).
7. Player actions and their feedback (FEEL), last.

Load the matching file in `2d-web-game-best-practices/references/` when you need a
rule's full reasoning or a fix example.

## 3. If you can run the game

Running beats reading. If you can open the game in a browser (a dev server, a static
folder), check:

- Time to first visible frame.
- Sound plays after the first click or key press.
- Switching tabs pauses the game; holding a key and switching tabs doesn't leave the
  player running (INPUT-7).
- Resizing to phone portrait and landscape crops no UI.
- Restarting twice doesn't double input or entity counts (LIFE-4).
- Frame time stays steady with the most entities on screen.

Say which checks you ran and which you could only infer from code.

## 4. Severity

- **Bug (B):** players will hit it: wrong behaviour, a crash, broken on some devices,
  stuck input, no sound.
- **Quality (Q):** performance, maintainability or polish problems that don't break play.
- **Feel (F):** suggestions about game feel. Phrase as options with numbers; the human
  decides.

Order findings by severity, then by how many players they affect.

## 5. Report format

```markdown
# Review: <game or file>

Engine: <engine>. Scope: <what you read>. Ran the game: <yes, which checks / no>.

## Summary
<two or three sentences: overall state and the most important fixes>

## Bugs
### 1. <short title> (LOOP-2)
`src/main.ts:42`. <what's wrong and what the player sees>

<code: before and after, minimal>

## Quality
...

## Feel suggestions
...

## What's good
<things done well, briefly, so they aren't "fixed" away>
```

Rules for findings:

- Every finding cites one rule ID and a file and line.
- Show the smallest fix, in the project's style and engine.
- Don't report style preferences that no rule covers.
- Don't pad: five real findings beat twenty weak ones.
- When the right fix is a tool change (an engine with a built-in fixed step, a faster
  renderer), say so once, in the summary, following
  `2d-web-game-best-practices/references/choosing-tools.md`. Never make a tool change
  the fix for a single finding that a few lines would solve.
