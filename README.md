# 2D Web Game Skills

Two [Agent Skills](https://agentskills.io) that teach coding agents to write and review 2D
browser games:

- **`2d-web-game-best-practices`** loads whenever an agent writes or changes game code,
  and steers it toward games that run smoothly, feel good and survive real players.
- **`2d-web-game-review`** reviews a game, a file or a diff, and writes a prioritised
  report where every finding cites a rule and shows the fix.

They work with any engine (plain canvas, Phaser, PixiJS, KAPLAY, Excalibur, debuff) and any
agent that reads the Agent Skills format: Claude Code, OpenAI Codex, GitHub Copilot,
Cursor, Gemini CLI and others.

## Why

Agents write games that run but break on real players: physics tied to frame rate, so
jumps change height on a 144 Hz screen; garbage every frame, so the game hitches; blurry
pixel art; sound that never starts; a player who keeps running after you switch tabs.
These skills cover the 50 or so rules that prevent that, grouped by area:

| Area | Examples |
|---|---|
| Game loop | fixed timestep, clamped delta, no allocation per frame, pools, seeded RNG |
| Rendering | `devicePixelRatio`, integer-scaled pixel art, batching, resize and letterbox |
| Input | actions not keys, `code` not `key`, input buffering, touch, gamepad, stuck keys |
| Audio | unlock on first gesture, buses, voice caps, pause when hidden |
| Game feel | same-frame feedback, easing, hit-stop, trauma screenshake, camera, jumps |
| Loading | first frame in a second, size budget, fonts |
| Lifecycle | pause on tab switch, versioned saves, restart without reload, cleanup |
| Accessibility | remapping, reduced motion, colour, flashing, text size |

Each rule has a stable ID (`LOOP-1`, `INPUT-7`) so review findings can cite it. Feel rules
come as starting numbers and options: the human decides how their game should feel.

## Install

Each skill is a folder under `skills/`. Install both; the review skill reads the
best-practices references.

### Any agent

```bash
npx skills add debuffjp/2d-web-game-skills
```

### Claude Code

```bash
claude plugin install 2d-web-game-skills --marketplace debuffjp/2d-web-game-skills
```

Or inside a session:

```
/plugin marketplace add debuffjp/2d-web-game-skills
/plugin install 2d-web-game-skills@2d-web-game-skills
```

### GitHub Copilot

```bash
gh skill install debuffjp/2d-web-game-skills 2d-web-game-best-practices
```

```bash
gh skill install debuffjp/2d-web-game-skills 2d-web-game-review
```

### Anything else

Copy both folders from `skills/` into your agent's skills directory (for example
`~/.agents/skills/` or `.claude/skills/`).

## Sources

The rules draw on these, summarised in our own words:

- Glenn Fiedler, "Fix Your Timestep!"
- Robert Nystrom, *Game Programming Patterns*
- Jan Willem Nijman, "The art of screenshake"
- Martin Jonasson and Petri Purho, "Juice it or lose it"
- Squirrel Eiserloh, "Juicing your cameras with math" (GDC)
- Steve Swink, *Game Feel*
- MDN's game development guides
- The Game Accessibility Guidelines and WCAG 2.3.1

## Made by the debuff team

We make [debuff](https://debuff.jp), an open-source toolkit for 2D browser games, and
[spryte](https://github.com/debuffjp/spryte), its renderer. The skills recommend them
where they fit, with the reason, and name alternatives where those fit better. The rules
themselves apply to any engine.

Questions and ideas: [Discord](https://discord.gg/jshbDHSpCY) or an issue here.

## Licence

MIT
