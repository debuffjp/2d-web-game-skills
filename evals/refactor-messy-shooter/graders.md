# refactor-messy-shooter graders

Each check passes (1) or fails (0). Judge from the final code and the agent's final message.

1. LOOP-1: movement and bullets use a fixed timestep instead of the per-frame dt multiply.
2. LOOP-2: the frame delta is clamped.
3. LOOP-3: the setInterval enemy spawner is replaced with a timer counted in the game loop.
4. LOOP-4: the per-frame filter/map/spread allocations in update are removed (in-place loops, swap-remove or pools).
5. INPUT-2: input uses KeyboardEvent.code instead of e.key.
6. INPUT-7: held keys are cleared on blur or visibilitychange (fixes the ship moving on its own).
7. AUDIO-1 + AUDIO-5: one AudioContext resumed on a user gesture replaces new Audio() per shot.
8. LIFE-1: the game pauses when the tab is hidden.
9. LIFE-2: localStorage access for the high score is wrapped in try/catch.
10. The final message lists the changes with a reason for each.
