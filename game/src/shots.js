// Coral Dusk — shot driver: renders the four scenes to screenshots/*.jpg at
// 1280x720 using the headless Chromium shell, then converts PNG to JPEG.
// Run from the repo root: node game/src/shots.js
const { execFileSync, spawnSync } = require('node:child_process');
const { existsSync, mkdirSync, statSync } = require('node:fs');
const { join, dirname } = require('node:path');
const os = require('node:os');

const SHELL = join(os.homedir(), '.cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell');
const REPO = join(__dirname, '..', '..');
const SHOTS = [
  { scene: 'start', file: '1-start.jpg', caption: 'Title screen on the beachfront' },
  { scene: 'drive', file: '2-drive.jpg', caption: 'Cruising the boardwalk' },
  { scene: 'chase', file: '3-chase.jpg', caption: 'Three-star police chase' },
  { scene: 'mission', file: '4-mission.jpg', caption: 'Dossier after three missions' }
];
function shot(s) {
  const png = join(os.tmpdir(), 'coral-dusk-' + s.scene + '.png');
  const url = 'file://' + join(REPO, 'game', 'index.html') + '?scene=' + s.scene;
  const r = spawnSync(SHELL, ['--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--screenshot=' + png, '--window-size=1280,720', '--virtual-time-budget=5000', url], { encoding: 'utf8', timeout: 60000 });
  if (r.status !== 0) throw new Error('headless shell failed for ' + s.scene + ': ' + (r.stderr || r.stdout || r.status));
  if (!existsSync(png)) throw new Error('no PNG for ' + s.scene);
  const jpg = join(REPO, 'screenshots', s.file);
  // Quality 90 keeps the sunset gradients crisp; every shot must stay under
  // the 256 KiB gate cap, so the driver prints each file's size below.
  execFileSync('python3', ['-c', 'from PIL import Image; import sys; im = Image.open(sys.argv[1]).convert("RGB"); im.save(sys.argv[2], "JPEG", quality=90)', png, jpg], { encoding: 'utf8' });
  return jpg;
}
mkdirSync(join(REPO, 'screenshots'), { recursive: true });
for (const s of SHOTS) {
  const out = shot(s);
  console.log(s.file + ' <- ' + s.scene + ' (' + s.caption + ') -> ' + out + ' (' + statSync(out).size + ' bytes)');
}
console.log('shots done: ' + SHOTS.length);
