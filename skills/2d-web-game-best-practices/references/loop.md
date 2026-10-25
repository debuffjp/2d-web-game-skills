# Game loop and time

## LOOP-1: fixed timestep

Physics with a variable `dt` gives different results at 60 Hz and 144 Hz: jumps reach
different heights, fast objects pass through walls at low frame rates, and replays don't
reproduce. Step the simulation at a fixed rate and let rendering run at whatever rate
the display gives you.

```ts
const STEP = 1 / 60;          // seconds per simulation step
const MAX_FRAME = 0.1;        // LOOP-2
let acc = 0;
let last = performance.now();

function frame(now: number) {
  let dt = (now - last) / 1000;
  last = now;
  if (dt > MAX_FRAME) dt = MAX_FRAME;
  acc += dt;
  while (acc >= STEP) {
    readInput();               // INPUT-3: once per step
    update(STEP);
    acc -= STEP;
  }
  render(acc / STEP);          // alpha in [0, 1) for interpolation
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

Interpolate: keep each entity's previous position and draw at
`prev + (curr - prev) * alpha`. Without it, a 60 Hz sim on a 144 Hz screen judders. For
slow games at a fixed 60 Hz this can be skipped; say so if you skip it.

Some engines have a fixed step built in and some only cap the frame rate, which isn't
the same thing. Check the engine's docs, and use its fixed step if it has one.

## LOOP-2: clamp the delta

After a tab switch, a breakpoint or a GC pause, `dt` can be seconds. Without a clamp the
accumulator runs hundreds of steps (the "spiral of death") or one huge step moves
objects through walls. 100 ms is a common cap: the game slows down instead of breaking.

## LOOP-3: one rAF loop

`setInterval` keeps firing in background tabs (throttled to about 1 Hz), drifts against
the display refresh, and can't be paused with the rest of the game. Timers for gameplay
("spawn every 2 s") should count simulation time inside `update`, not wall time.

```ts
// Bad
setInterval(spawnEnemy, 2000);

// Good
spawnTimer -= STEP;
if (spawnTimer <= 0) { spawnEnemy(); spawnTimer += SPAWN_EVERY; }
```

## LOOP-4: no allocation in the hot path

Every object created per frame is garbage. Enough garbage causes collection pauses that
show up as hitches every few seconds. Common culprits:

- `{ x, y }` or `[x, y]` returned from vector helpers. Write into an `out` parameter or
  reuse a module-level scratch vector.
- `entities.filter(e => e.alive).forEach(...)`: two arrays and a closure per frame. Use
  a plain `for` loop and swap-remove dead entries.
- Template strings for HUD text every frame. Only rebuild when the value changes.
- Spread (`{...state}`) and `Array.from` in update.

Allocation at load time and on rare events is fine. Measure before micro-optimising
code that runs once per frame on ten objects.

## LOOP-5: pools

Spawn-heavy objects (bullets, particles, pickups, damage numbers) should come from a
pool: a preallocated array with an `active` flag, or a free list. This also caps the
worst case, which matters more than the average on phones.

## LOOP-6: determinism

Seed one RNG (mulberry32, sfc32 or the engine's) and pass it to the simulation. With a
fixed step, a seeded RNG and recorded inputs, a bug can be replayed exactly, and logic
tests become possible. Use `Math.random()` only for cosmetic effects that don't affect
state, and say so in a comment.

## LOOP-7: separate logic from rendering

Keep the state and the rules in plain data and functions that don't touch the canvas,
DOM or audio. Rendering reads state; it never changes it. Then `update(state, input,
STEP)` can run in a unit test with no browser.
