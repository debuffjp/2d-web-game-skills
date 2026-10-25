# Rendering

## REND-1: devicePixelRatio

A canvas sized only with CSS is blurry on high-density screens. Size the backing store
in device pixels and scale drawing:

```ts
function fit(canvas: HTMLCanvasElement, cssW: number, cssH: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap: 3x costs a lot on phones
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  return dpr;
}
```

Recompute on `resize`, and watch `matchMedia(`(resolution: ${dpr}dppx)`)` for the window
moving between monitors.

## REND-2: pixel art

- Render at a low logical resolution (for example 320x180) and scale by a whole number.
  1.5x scaling makes some pixels one wide and some two wide, which shimmers when things
  move.
- Pick the largest integer scale that fits, letterbox the rest (REND-6).
- Nearest-neighbour sampling: `ctx.imageSmoothingEnabled = false` on canvas, `NEAREST`
  filtering in WebGL, and `image-rendering: pixelated` on the canvas element.
- Round the camera and sprite positions to whole logical pixels when drawing. Keep the
  simulation in floats.
- Add a 1 px transparent gap (or extrusion) around atlas frames so neighbours don't bleed
  in at fractional positions.

## REND-3: batching

GPU renderers are fast when many sprites share a texture and state. Pack sprites into
atlases, draw by layer rather than jumping between textures, and avoid changing blend
modes per sprite. On Canvas 2D, `fillText` is expensive: cache static text to an
offscreen canvas and redraw it only when it changes.

## REND-4: no readback

`getImageData`, `readPixels` and `toDataURL` stall the pipeline until the GPU catches up.
Use them for screenshots and tools, not per-frame collision. Collide against data
(tile maps, shapes), not pixels.

## REND-5: culling

Skip entities whose bounds are outside the camera view plus a margin. For big tile maps,
draw only the visible tile range. Engines with a scene graph often cull for you; check
before adding your own.

## REND-6: resize and orientation

Decide on one policy and implement it fully:

- **Fixed aspect, letterbox:** scale to fit, centre, fill bars with a colour.
- **Adaptive:** extend the visible world on the longer axis and anchor UI to edges.

Test at a phone portrait size, a phone landscape size and an ultrawide window. UI must
never be cropped. Use `dvh` units or `visualViewport` on mobile, since `100vh` includes
the hidden address bar on some browsers.

## REND-7: context loss

WebGL contexts can be lost (GPU reset, too many contexts, mobile backgrounding). Listen
for `webglcontextlost` (call `preventDefault()`), and on `webglcontextrestored` recreate
textures and buffers. Engines usually handle this; custom WebGL code must.
