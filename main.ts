// Coral Dusk — entrypoint: hands the game to /output and prints its dossier.
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const SEED = 1337;
const MISSIONS = ['Sunset Pickup', 'Boardwalk Dash', 'Marina Heist', 'Rooftop Signal', 'Harbor Chase', 'Dawn Getaway'];
const mulberry32 = (a: number): (() => number) => (): number => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const run = (seed: number): { game: string; seed: number; missions: { name: string; seconds: number; wantedPeak: number }[]; bestSeconds: number; wantedPeak: number; completed: number } => {
  const rnd = mulberry32(seed);
  const missions = MISSIONS.map((name, i) => {
    const seconds = Math.round((150 + i * 45 + rnd() * 90) * 10) / 10;
    const wantedPeak = Math.min(5, Math.floor(rnd() * 6));
    return { name, seconds, wantedPeak };
  });
  return { game: 'Coral Dusk', seed, missions, bestSeconds: Math.min(...missions.map((m) => m.seconds)), wantedPeak: Math.max(...missions.map((m) => m.wantedPeak)), completed: missions.length };
};
const repo = dirname(fileURLToPath(import.meta.url));
const out = '/output';
mkdirSync(out, { recursive: true });
const dossier = run(SEED);
console.log(JSON.stringify(dossier));
cpSync(join(repo, 'game'), join(out, 'game'), { recursive: true });
cpSync(join(repo, 'screenshots'), join(out, 'screenshots'), { recursive: true });
writeFileSync(join(out, 'dossier.json'), buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, game_max_files: 993, game_max_bytes: 50331648 }));
