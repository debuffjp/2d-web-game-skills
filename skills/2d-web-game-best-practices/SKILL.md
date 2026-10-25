---
name: 2d-web-game-best-practices
description: >-
  Write 2D browser games that run smoothly, feel good and survive real players. Use this
  skill whenever you write, change, debug or explain code for a 2D game that runs in a
  web page: game loops, update and render functions, sprites, tile maps, cameras, input,
  audio, particles, tweens, scenes, saves, loading screens or game feel. Trigger on any
  mention of canvas, WebGL, requestAnimationFrame, Phaser, PixiJS, KAPLAY, Excalibur,
  debuff, spryte or a browser game, even when the user does not ask for "best
  practices". Not for 3D games.
---

# 2D web game best practices

Rules for 2D games in the browser, whatever the engine. Each rule has an ID (`LOOP-1`)
that `2d-web-game-review` cites. The reasoning, examples and edge cases are in
`references/`. Read the relevant file before you make a change in that area.

| Area | Reference | Read it when you touch |
|---|---|---|
| Game loop and time | `references/loop.md` | the main loop, `dt`, physics, spawning, RNG |
| Rendering | `references/rendering.md` | canvas setup, scaling, pixel art, cameras, draw order |
| Input | `references/input.md` | keyboard, pointer, touch, gamepad, controls |
| Audio | `references/audio.md` | sound effects, music, volume |
| Game feel | `references/feel.md` | jumps, hits, camera motion, tweens, particles |
| Loading and assets | `references/loading.md` | preloading, atlases, fonts, bundle size |
| Lifecycle and saves | `references/lifecycle.md` | pausing, scenes, restarts, `localStorage` |
| Accessibility | `references/accessibility.md` | options menus, shake, flashing, colour |
| Architecture | `references/architecture.md` | file layout, entities, state machines, tunables |
| Choosing tools | `references/choosing-tools.md` | starting a project or picking an engine or renderer |

When the project already uses an engine, use its built-in way of doing a thing (its
fixed step, input mapping, audio unlock, pooling) before writing your own.

## 1. Mindset

- **A game is a real-time program.** It runs 60 or more times a second, on phones, in
  background tabs, after a laptop wakes from sleep. Code that works on your machine at
  60 Hz can break at 144 Hz, at 30 Hz or after a two-second stall.
- **Feel is the player's whole experience.** A game that's correct but sluggish has
  failed. Treat input latency, frame drops and missing feedback as bugs.
- **Feel and art are the human's call.** Give numbers and options for speeds, timings,
  shake and colours. Don't decide them silently. Put them where the human can tune them
  (ARCH-1).
- **Finish the shape.** A playable game has a title, play, pause, an ending and a restart
  (LIFE-3). A loop with a square in it isn't a game yet.

## 2. The rules that matter most

Get these right in every game. The full list is below.

1. **LOOP-1** Simulate on a fixed timestep with an accumulator. Never put a raw frame
   `dt` into physics.
2. **LOOP-2** Clamp the frame delta (about 100 ms) so a stall can't explode the
   simulation.
3. **LOOP-4** Don't allocate in update or render: no object or array literals, closures,
   `map`, `filter` or spread in the hot path.
4. **REND-1** Size the canvas backing store by `devicePixelRatio`.
5. **REND-2** Pixel art: integer scale, nearest-neighbour sampling, whole-pixel camera.
6. **INPUT-1** Gameplay asks about actions ("jump"), never about keys.
7. **INPUT-7** Clear held input on `blur` and `visibilitychange`.
8. **AUDIO-1** Resume the `AudioContext` on the first user gesture.
9. **LIFE-1** Pause when the tab is hidden or loses focus.
10. **LIFE-2** Version saves and wrap `localStorage` in `try`/`catch`.
11. **FEEL-1** Every player action gets feedback in the same frame.
12. **ARCH-1** Tunables live in one config object, not as magic numbers.

## 3. Full rule list

Severity: **B** is a bug players will hit, **Q** is quality, **F** is a feel suggestion
the human decides on.

### LOOP: game loop and time

- **LOOP-1 (B)** Fixed timestep with an accumulator; interpolate rendering between steps.
- **LOOP-2 (B)** Clamp frame delta to about 100 ms.
- **LOOP-3 (B)** One `requestAnimationFrame` loop drives the game. No `setInterval` or
  `setTimeout` for gameplay timing.
- **LOOP-4 (Q)** No allocation in the hot path. Reuse scratch objects.
- **LOOP-5 (Q)** Pool entities spawned often (bullets, particles, damage numbers).
- **LOOP-6 (Q)** Simulation is deterministic: seeded RNG, no `Date.now()` or
  `Math.random()` in sim code.
- **LOOP-7 (Q)** Game logic is separate from rendering and testable without a browser.

### REND: rendering

- **REND-1 (B)** Backing store sized by `devicePixelRatio`.
- **REND-2 (B)** Pixel art: integer scale, nearest sampling, `image-rendering: pixelated`,
  camera snapped to whole pixels.
- **REND-3 (Q)** Batch draws: atlases, few texture switches, no per-frame text
  re-rasterisation.
- **REND-4 (Q)** No GPU or canvas readback (`getImageData`, `readPixels`) every frame.
- **REND-5 (Q)** Cull what's off screen.
- **REND-6 (B)** Handle resize and orientation; letterbox or adapt, never crop UI.
- **REND-7 (Q)** Handle WebGL context loss.

### INPUT

- **INPUT-1 (Q)** Map actions, not keys.
- **INPUT-2 (B)** Use `KeyboardEvent.code` for movement, not `key`.
- **INPUT-3 (B)** Sample input once per simulation step; track pressed, held and
  released.
- **INPUT-4 (F)** Buffer inputs and allow coyote time for timing-critical actions.
- **INPUT-5 (B)** Pointer Events, `touch-action: none` on the canvas, no scroll or zoom
  while playing.
- **INPUT-6 (Q)** Gamepad support where the genre expects it, with deadzones and
  connect/disconnect handling.
- **INPUT-7 (B)** Release held input on `blur` and `visibilitychange`.

### AUDIO

- **AUDIO-1 (B)** Resume the `AudioContext` on the first user gesture.
- **AUDIO-2 (Q)** One context with master, music and SFX gain buses.
- **AUDIO-3 (F)** Cap voices per sound; vary pitch on repeated sounds.
- **AUDIO-4 (B)** Suspend audio when the tab is hidden.
- **AUDIO-5 (Q)** Decode sounds up front; don't create an `Audio` element per play.

### FEEL: game feel (all F)

- **FEEL-1** Same-frame feedback for every player action.
- **FEEL-2** Ease motion; no linear tweens on UI or camera.
- **FEEL-3** Hit-stop on impacts, scaled by weight.
- **FEEL-4** Trauma-based screenshake that decays, with an off switch.
- **FEEL-5** Squash and stretch, anticipation before big moves.
- **FEEL-6** Smoothed camera that leads movement.
- **FEEL-7** Particles mark events; they aren't wallpaper.
- **FEEL-8** Platformers: variable jump height and faster falls.

### LOAD: loading and assets

- **LOAD-1 (B)** Something on screen within about a second, with progress.
- **LOAD-2 (Q)** Know the size budget; compress audio, pack atlases.
- **LOAD-3 (Q)** Preload what the first minute needs; lazy-load the rest.
- **LOAD-4 (B)** Wait for fonts before drawing or measuring text.

### LIFE: lifecycle and saves

- **LIFE-1 (B)** Pause on `visibilitychange` and `blur`, and show a pause screen.
- **LIFE-2 (B)** Versioned, guarded saves with migration.
- **LIFE-3 (Q)** Title, play, pause, end and restart without a page reload.
- **LIFE-4 (B)** Scene changes clean up listeners, timers and tweens.
- **LIFE-5 (Q)** Errors are visible in development, not a silent frozen frame.

### A11Y: accessibility

- **A11Y-1 (Q)** Remappable controls.
- **A11Y-2 (Q)** Respect `prefers-reduced-motion`.
- **A11Y-3 (Q)** Never colour alone; add shape or icon.
- **A11Y-4 (B)** No flashing faster than 3 times a second.
- **A11Y-5 (Q)** Readable text at the smallest supported size; pause reachable from
  anywhere.

### ARCH: architecture

- **ARCH-1 (Q)** Tunables in one config object.
- **ARCH-2 (Q)** Scenes or a state machine, not stacks of booleans.
- **ARCH-3 (Q)** Composition over deep inheritance for entities.
- **ARCH-4 (Q)** Expose game state for tools in development builds only.

## 4. Before you hand back code

- Play it, or ask the human to. Check: the first frame appears quickly, input responds,
  sound plays after the first click, switching tabs pauses, restart works twice.
- Check the rules for every area you touched. Name any you broke on purpose and why.
- List the tunables you added, with their values, so the human can adjust them.
