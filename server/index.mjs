import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLiveMiddleware } from './live-api.mjs';

const root = join(fileURLToPath(new URL('..', import.meta.url)), 'dist');
const port = Number(process.env.PORT ?? 4173);
const liveApi = createLiveMiddleware();
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml' };

function staticFile(req, res) {
  const pathname = decodeURIComponent(new URL(req.url, 'http://tokenburner.local').pathname);
  const safe = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '');
  let file = join(root, safe === '/' ? 'index.html' : safe);
  try { if (!statSync(file).isFile()) file = join(root, 'index.html'); }
  catch { file = join(root, 'index.html'); }
  res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': file.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable' });
  createReadStream(file).pipe(res);
}

createServer((req, res) => liveApi(req, res, () => staticFile(req, res))).listen(port, '127.0.0.1', () => {
  console.log(`TokenBurner 3000 live server: http://127.0.0.1:${port}`);
});
