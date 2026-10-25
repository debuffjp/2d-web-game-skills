# Accessibility

Sources: the Game Accessibility Guidelines (gameaccessibilityguidelines.com) and WCAG
2.3.1 for flashing. These rules are the ones cheap enough to do in every small game.

## A11Y-1: remappable controls

With actions mapped to keys (INPUT-1), remapping is a settings screen that edits the
bindings and saves them (LIFE-2). At minimum, support two layouts (arrows and WASD) and
don't require holding several keys at once for basic play.

## A11Y-2: reduced motion

Read `matchMedia("(prefers-reduced-motion: reduce)")` and use it as the default for a
"reduce motion" option: less or no screenshake (FEEL-4), gentler camera motion, no
full-screen flashes, slower parallax. Let the player override it in settings.

## A11Y-3: not colour alone

Teams, item types, safe and dangerous tiles: tell them apart by shape, icon or pattern
as well as colour. Check the palette with a colour-blindness simulator.

## A11Y-4: flashing

Don't flash the screen or large areas more than three times in any one second (WCAG
2.3.1). Rapid strobing during explosions or damage is the usual offender. Use a single
flash, or a fade.

## A11Y-5: text and pause

Text must stay readable at the smallest window you support. With a 320x180 logical
resolution scaled 2x, a 5 px font is too small. Pause must be reachable from every
gameplay state with one input (Escape, P, Start, and a visible on-screen button on
touch devices).
