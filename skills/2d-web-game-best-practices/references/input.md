# Input

## INPUT-1: actions, not keys

```ts
const bindings = {
  left:  ["ArrowLeft", "KeyA"],
  right: ["ArrowRight", "KeyD"],
  jump:  ["Space", "KeyW", "ArrowUp", "pad:0"],
} as const;

if (input.pressed("jump")) player.jump();
```

Gameplay code never mentions a key. That makes remapping (A11Y-1), gamepad support and
touch buttons a change in one place.

## INPUT-2: `code` for movement

`KeyboardEvent.key` depends on the layout: WASD on AZERTY is ZQSD, and `key` gives "z".
`code` names the physical key ("KeyW"), so movement stays where the player's fingers
are. Use `key` only for text entry and for showing labels.

## INPUT-3: sample per step

Collect DOM events into a buffer, then once per simulation step compute for each action:
`down` (held now), `pressed` (down now, up last step) and `released`. Reading DOM state
in the middle of `update` gives different results depending on when events land, and a
tap shorter than one frame can be missed entirely. Latch presses: if a key went down and
up between two steps, `pressed` is still true for one step.

## INPUT-4: buffering and coyote time (feel)

- **Input buffer:** remember a press for a short window (starting point 100-150 ms, or
  6-9 steps at 60 Hz) and act on it when it becomes valid. A jump pressed just before
  landing still jumps.
- **Coyote time:** allow a jump for a short window after walking off a ledge (starting
  point 80-120 ms).

Both values are tunables (ARCH-1). The human picks the final numbers.

## INPUT-5: touch and pointer

- Use Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) for
  mouse, pen and touch together. Track pointers by `pointerId` for multi-touch.
- Set `touch-action: none` on the canvas so the browser doesn't pan or zoom.
- Call `setPointerCapture` on drag starts so moves outside the canvas still arrive.
- Prevent the context menu and text selection on the game area. Disable double-tap zoom
  with the viewport meta tag.
- Convert client coordinates to game coordinates through the same scale and letterbox
  offsets the renderer uses (REND-6).

## INPUT-6: gamepad

Poll `navigator.getGamepads()` once per step (it isn't event driven). Apply a radial
deadzone (starting point 0.15-0.25) to sticks. Handle `gamepadconnected` and
`gamepaddisconnected`; pause when the active pad disconnects. Use the `standard` mapping
when `gamepad.mapping === "standard"`.

## INPUT-7: stuck keys

If the window loses focus while a key is held, the `keyup` never arrives and the player
keeps running. On `blur` and on `visibilitychange` to hidden, clear all held input.
