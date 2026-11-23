// Coral Dusk — a tiny stdlib-only static server: node serve.ts serves game/
// on http://localhost:8080 (or $PORT). No dependencies.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(join(fileURLToPath(import.meta.url), '..', 'game'));
const TYPES: Record<string, string> = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg'
};
const server = createServer((req, res) => {
  const path = normalize(join(ROOT, decodeURIComponent((req.url || '/').split('?')[0])));
  const file = path.endsWith('/') || path === ROOT ? join(path, 'index.html') : path;
  if (!file.startsWith(ROOT) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404); res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
const port = Number(process.env.PORT || 8080);
server.listen(port, () => console.log('Coral Dusk at http://localhost:' + port));
