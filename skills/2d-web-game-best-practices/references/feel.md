# Game feel

Everything here is a suggestion with starting numbers. The human decides how the game
should feel. Expose each value as a tunable (ARCH-1), report what you chose, and offer
alternatives ("hit-stop at 3 frames now; 5 reads heavier, 0 keeps it snappy").

## FEEL-1: same-frame feedback

When the player presses a button, something visible or audible changes that frame: the
sprite moves, a sound starts, a flash or a small pop. Delayed or missing feedback reads
as lag even when the logic is instant. Start animations from a strong pose, not a
neutral one.

## FEEL-2: easing

Linear motion looks mechanical. Use ease-out for things arriving (UI panels, the camera
settling), ease-in for things leaving, and a small overshoot (back or elastic easing)
for playful pops. For values chasing a target every frame, use frame-rate independent
smoothing: `x += (target - x) * (1 - Math.exp(-speed * dt))`, not `x += (target - x) *
0.1`.

## FEEL-3: hit-stop

Freeze (or slow) the action for a few frames when a hit lands. Starting point: 2-4
frames for light hits, 6-10 for heavy ones or kills. Freeze the simulation, keep input
buffering (INPUT-4) running, and let effects like shake continue so the moment doesn't
look stuck.

## FEEL-4: screenshake

Use a trauma value: events add trauma (0-1), it decays over time (starting point 1-2 per
second), and shake strength is `trauma²` or `trauma³` so small hits barely shake and big
ones really do. Offset (and optionally rotate) the camera with smooth noise rather than
random jumps each frame. Cap the maximum offset, and give players an off switch tied to
`prefers-reduced-motion` (A11Y-2).

## FEEL-5: squash, stretch and anticipation

Stretch along the direction of motion when jumping or moving fast, squash on landing and
impact, and keep the area roughly constant (scale x up when y goes down). A short
anticipation pose before a big move (wind-up before a dash) makes it readable. Keep these
short: 3-8 frames for most.

## FEEL-6: camera

- Smooth the follow with exponential smoothing (FEEL-2), not instant snapping.
- Lead the player: offset the camera toward the direction of movement or aim so they
  see what's coming.
- Platformers: a dead zone horizontally, and vertical follow that only moves when the
  player lands on a new height (platform snapping) avoids seasick bobbing.
- Pixel art: smooth in floats, round when drawing (REND-2).

## FEEL-7: particles

Particles mark events: a burst of dust on landing, sparks on a hit, a puff on a jump.
Short bursts with a few strong particles beat constant streams. Vary size, speed and
lifetime randomly, and shrink or fade at the end of life. Pool them (LOOP-5).

## FEEL-8: platformer jumps

- **Variable height:** when the jump button is released while rising, cut the upward
  velocity (multiply by 0.4-0.5) or increase gravity.
- **Faster falls:** gravity while falling at 1.5-2.5x rising gravity makes jumps feel
  weighty instead of floaty.
- **Apex hang:** briefly reduce gravity near the top of the jump for control.
- Design jumps from height and time to apex, then derive gravity and launch speed:
  `g = 2h / t²`, `v = 2h / t`. That makes the numbers mean something to the designer.
