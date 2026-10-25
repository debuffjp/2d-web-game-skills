# Architecture

Small games stay small. These rules are about keeping a game easy to tune and change,
not about frameworks.

## ARCH-1: tunables in one place

```ts
export const TUNING = {
  runSpeed: 140,       // px/s
  jumpHeight: 48,      // px
  jumpTime: 0.35,      // s to apex
  coyoteTime: 0.1,     // s
  hitStopFrames: 3,
};
```

Feel values buried in logic (`vy = -312`) can't be found or tuned. In one object, they
can be listed for the human, shown as sliders in a debug panel, and changed without
reading the code. Prefer designer units (height, time) and derive the physics values.

## ARCH-2: states, not booleans

`if (playing && !paused && !dead && !levelComplete)` grows a bug for every new
combination. Use scenes (title, play, pause, game over) or an explicit state machine
for both the game and complex entities (a player that can be idle, running, jumping,
dashing, hurt). Each state owns its enter, update and exit.

## ARCH-3: composition

Deep class hierarchies (`Entity > Actor > Enemy > FlyingEnemy > FlyingShootingEnemy`)
break when a design change crosses branches. Build entities from small parts (position,
sprite, collider, health, an AI behaviour) as plain data plus functions, or with the
engine's component system. A full ECS is rarely needed for a small game.

## ARCH-4: state for tools

Expose a read-only view of the game state in development builds (for example
`window.__GAME_STATE__`, or the engine's devtools hook) so debugging tools, tests and
coding agents can see what's happening. Guard it with the bundler's development flag
(`import.meta.env.DEV`) so it's stripped from production.
