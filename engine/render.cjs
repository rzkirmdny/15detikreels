// usage: node render.cjs stills t1,t2,...   |  node render.cjs frames a b out.mp4
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const ROOT = __dirname, FPS = 30;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
function serve() {
  return new Promise(res => {
    const s = http.createServer((q, r) => {
      const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
      fs.readFile(p, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); r.end(b); });
    }).listen(0, () => res(s));
  });
}
(async () => {
  const [mode, a, b, out] = process.argv.slice(2);
  const srv = await serve(); const port = srv.address().port;
  const br = await chromium.launch({ executablePath: process.env.PW_CHROME || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('console', m => console.log('[page]', m.text())); pg.on('pageerror', e => console.log('[err]', e.message));
  await pg.goto(`http://localhost:${port}/index.html`);
  await pg.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
  if (mode === 'stills') {
    fs.mkdirSync(path.join(ROOT, 'stills'), { recursive: true });
    for (const t of a.split(',').map(Number)) {
      const d = await pg.evaluate(t => { renderAt(t); return grab(); }, t);
      fs.writeFileSync(path.join(ROOT, 'stills', `t${t.toFixed(2)}.jpg`), Buffer.from(d.split(',')[1], 'base64'));
    }
  } else {
    const f0 = +a, f1 = +b;
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = f0; f < f1; f++) {
      const d = await pg.evaluate(t => { renderAt(t); return grab(); }, f / FPS);
      const buf = Buffer.from(d.split(',')[1], 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 50 === 0) console.log(out, f, ((Date.now() - t0) / 1000 / (f - f0 + 1)).toFixed(2), 's/frame');
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await br.close(); srv.close();
})();
