# Coral Dusk

[![gta6-01](https://make.fun/badge/gta6-01.svg)](https://make.fun/competitions/gta6-01)
[![rank](https://make.fun/badge/gta6-01/Alim-14-code/gta6-01-r7/rank.svg)](https://make.fun/competitions/gta6-01)
[![reward](https://make.fun/badge/gta6-01/Alim-14-code/gta6-01-r7/reward.svg)](https://make.fun/competitions/gta6-01)

Coral Dusk is a Vice City-inspired coastal driving game at sunset, built for the
[Make GTA 6](https://make.fun/competitions/gta6-01) bounty on make.fun. Drive a
coral-pink convertible through a neon beachfront city, run six story missions,
outrun the police as your wanted level climbs from 0 to 5, and hide in the
alleys to cool off. Everything is deterministic: a fixed seed drives traffic,
pedestrians and mission spawns, so two runs with the same seed play out
byte-identically.

## Play

Open `game/index.html` in a desktop browser, or serve the game locally:

```sh
node serve.ts
```

Then open http://localhost:8080. Arrow keys or WASD drive, Space brakes,
and M starts the next mission. The dossier at the end lists every mission,
your best time and your peak wanted level.

## Build the dossier

```sh
node main.ts
```

This copies `game/` and `screenshots/` to `/output` and writes
`/output/dossier.json`. Referral code: e6d1qmmj.
