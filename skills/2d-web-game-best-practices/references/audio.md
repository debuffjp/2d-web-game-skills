# Audio

## AUDIO-1: unlock on first gesture

Browsers start an `AudioContext` suspended until the user interacts with the page. Call
`ctx.resume()` inside the first `pointerdown`, `keydown` or `touchend` handler. A title
screen with "press any key" or a play button gives you that gesture naturally. Never
assume sound is playing because `play()` returned without throwing.

```ts
const ctx = new AudioContext();
const unlock = () => { void ctx.resume(); };
for (const ev of ["pointerdown", "keydown", "touchend"]) {
  window.addEventListener(ev, unlock, { once: true, capture: true });
}
```

## AUDIO-2: buses

One `AudioContext` for the whole game. Route through gain nodes:
`source -> sfx or music gain -> master gain -> destination`. Volume settings and mute
then change one node, and music can duck under important sounds.

## AUDIO-3: voices and variation (feel)

- Cap simultaneous plays of the same sound (starting point 4-8). Twenty overlapping
  coin sounds are noise and can clip.
- Randomise pitch slightly on repeated sounds (playback rate 0.9-1.1) so they don't
  sound mechanical.
- Clamp the master output, or use a `DynamicsCompressorNode`, to avoid clipping when
  many sounds play at once.

## AUDIO-4: hidden tabs

Suspend the context (`ctx.suspend()`) when the tab is hidden and resume when it returns
and the game unpauses (LIFE-1). Music that keeps playing in a background tab annoys
players and drains batteries.

## AUDIO-5: decode up front

Fetch and `decodeAudioData` during loading, keep the `AudioBuffer`s, and play each sound
by creating a cheap `AudioBufferSourceNode`. `new Audio(src).play()` per shot has
latency, can't be mixed and leaks elements. Use Opus (`.webm`/`.ogg`) with an AAC
(`.m4a`) fallback for Safari, or check what the target browsers support.
