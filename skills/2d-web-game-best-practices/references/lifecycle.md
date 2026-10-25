# Lifecycle and saves

## LIFE-1: pause when hidden

```ts
document.addEventListener("visibilitychange", () => {
  if (document.hidden) game.pause();
});
window.addEventListener("blur", () => game.pause());
```

Show a pause screen and wait for the player to resume. Don't auto-resume on focus: the
player may not be looking yet. Also clear held input (INPUT-7) and suspend audio
(AUDIO-4). Browsers throttle `requestAnimationFrame` in hidden tabs, so an unpaused game
either freezes mid-action or jumps ahead when the clamp (LOOP-2) is missing.

## LIFE-2: saves

`localStorage` can throw: private browsing modes, full quota, storage disabled by the
user or by a game portal's iframe. And saves outlive code: the next version of the game
will read an old save.

```ts
const SAVE_KEY = "my-game:save";
const SAVE_VERSION = 2;

function load(): Save {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultSave();
    return migrate(JSON.parse(raw));
  } catch {
    return defaultSave();
  }
}

function migrate(data: any): Save {
  if (data.version === 1) data = { ...data, version: 2, volume: 1 };
  if (data.version !== SAVE_VERSION) return defaultSave();
  return data;
}
```

Prefix keys with the game's name: games on the same portal domain share storage.

## LIFE-3: the full shape

A finished game has: a title screen (which also provides the audio unlock gesture), play,
pause with resume and quit, an end state (game over or win) with the score, and restart
without reloading the page. Restart must reset all state; test it twice in a row.

## LIFE-4: cleanup

Scenes that add `window` listeners, timers, tweens or pooled objects must remove or
return them when the scene ends. Leaks show up as input firing twice after a restart,
or memory and entity counts climbing with each play. Register cleanup next to setup:

```ts
const off = on(window, "keydown", handler); // returns the remover
scene.onExit(off);
```

## LIFE-5: visible errors

An exception inside `requestAnimationFrame` stops the loop and leaves a frozen frame
with nothing on screen to say why. In development, catch errors in the loop, stop
cleanly and show the message and stack on top of the game. In production, show a short
"something went wrong" with a reload button, and log the error.
