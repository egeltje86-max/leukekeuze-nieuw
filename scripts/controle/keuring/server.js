// Lokale server zoals GitHub Pages: gzip voor tekst, index.html per map, 404.html als de pagina niet bestaat.
// node server.js <map> <poort> [cache-seconden]
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const ROOT = process.argv[2], PORT = +process.argv[3], MAXAGE = process.argv[4];
const TYPE = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon', '.gz': 'application/gzip' };
const cache = {};
http.createServer((req, res) => {
  let p; try { p = decodeURIComponent(req.url.split('?')[0]); } catch (e) { p = '/'; }
  let f = path.join(ROOT, p), status = 200;
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { f = path.join(ROOT, '404.html'); status = 404; }
  if (!fs.existsSync(f)) { f = path.join(ROOT, '404.html'); status = 404; }
  const ext = path.extname(f), t = TYPE[ext] || 'application/octet-stream';
  let body = fs.readFileSync(f);
  const h = { 'Content-Type': t, 'Cache-Control': MAXAGE ? 'max-age=' + MAXAGE : 'no-cache' };
  if (/text|javascript|json|xml|svg/.test(t) && /gzip/.test(req.headers['accept-encoding'] || '')) { const k = f + fs.statSync(f).mtimeMs; body = cache[k] || (cache[k] = zlib.gzipSync(body, { level: 6 })); h['Content-Encoding'] = 'gzip'; }
  h['Content-Length'] = body.length;
  res.writeHead(status, h); res.end(req.method === 'HEAD' ? undefined : body);
}).listen(PORT, '0.0.0.0', () => console.log('klaar', PORT));
