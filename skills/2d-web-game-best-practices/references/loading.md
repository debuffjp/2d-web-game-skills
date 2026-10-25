# Loading and assets

## LOAD-1: show something fast

The page should show something within about a second, even on a slow connection: a
background colour, the title, a progress bar. Put the minimal loader in the HTML so it
appears before the game's JavaScript downloads. Report progress by bytes or file count,
not a spinner that never moves.

## LOAD-2: size budget

Know what the game weighs and report it (gzip or brotli for code, file sizes for
assets). Web game portals and mobile players care. Usual wins:

- Audio is often the biggest asset. Encode music as Opus or AAC at a sensible bitrate,
  mono for most SFX.
- Pack sprites into atlases; use PNG for pixel art, WebP or AVIF for painted art if the
  target browsers support it.
- Tree-shake the engine; don't import a whole library for one helper.

## LOAD-3: preload versus lazy load

Preload what the title screen and first level need. Load later levels, music for later
areas and rarely used assets in the background or on demand. Never block the first
frame on assets the player won't see for minutes.

## LOAD-4: fonts

A canvas draws text with whatever font is ready. If the web font hasn't loaded, the
first frames use a fallback, and text measured then has the wrong width. Wait for
`document.fonts.load('16px "My Font"')` (or `document.fonts.ready`) before measuring or
caching text. Bitmap fonts avoid the problem for pixel art.
