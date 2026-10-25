# phaser-arena-shooter graders

Each check passes (1) or fails (0). Judge from the code only.

1. LOOP-5: bullets are pooled (a Phaser Group with maxSize/get/killAndHide or a manual pool), not created and destroyed per shot.
2. LOOP-3: enemy spawning uses scene time (this.time.addEvent, a timer counted in update) rather than setInterval/setTimeout.
3. AUDIO-1: the AudioContext is resumed or created inside a user gesture (click, key or pointer handler, or a start screen).
4. AUDIO-2: sound goes through a shared gain node (master volume), using one AudioContext.
5. AUDIO-3: repeated sounds have a voice cap or randomised pitch.
6. LIFE-1: the game pauses (scene pause or physics pause) when the tab is hidden or the window loses focus.
7. LIFE-3: there is a title or start screen and a game over screen, and restarting works without reloading the page.
8. LIFE-4: restart resets state cleanly (scene.restart or full reset of score, enemies, timers), without leaving timers or listeners from the previous run.
9. FEEL-1/3/4: hits on enemies produce extra feedback beyond removing the enemy (any of: hit-stop, screenshake, flash, particles).
10. ARCH-1: player speed, bullet speed, fire rate and spawn rate are named constants or a config object.
