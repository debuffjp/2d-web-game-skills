# canvas-platformer graders

Each check passes (1) or fails (0). Judge from the code only.

1. LOOP-1: physics runs on a fixed timestep (accumulator or equivalent); position and velocity are not integrated with a raw per-frame dt.
2. LOOP-2: the frame delta is clamped (any cap of 250 ms or less).
3. REND-1: the canvas backing store is sized using devicePixelRatio.
4. INPUT-2: movement keys are read with KeyboardEvent.code, not .key or keyCode.
5. INPUT-7: held keys are cleared on window blur or visibilitychange.
6. INPUT-4: there is coyote time or a jump input buffer.
7. FEEL-8: jump height is variable (releasing jump early cuts the jump) or fall gravity is higher than rise gravity.
8. LIFE-1: the game pauses when the tab is hidden or the window loses focus.
9. LIFE-3: after winning, the player can restart without reloading the page.
10. ARCH-1: movement and jump tunables are named constants or a config object, not magic numbers inline in the physics.
