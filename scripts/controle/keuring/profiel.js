// Waar gaat de rekentijd heen bij het starten van een pagina? (CPU-profiel van de start, zonder pak)
// node profiel.js <pad> [poort]
const { chromium } = require('playwright');
(async () => {
  const pad = process.argv[2], poort = process.argv[3] || 8765, BASIS = 'http://localhost:' + poort;
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
  await c.route('**/*', r => r.request().url().startsWith(BASIS) ? r.continue() : r.abort());
  const p = await c.newPage(); const s = await c.newCDPSession(p);
  await s.send('Profiler.enable'); await s.send('Profiler.setSamplingInterval', { interval: 200 }); await s.send('Profiler.start');
  await p.goto(BASIS + pad + (pad.indexOf('?') === -1 ? '?' : '&') + 'proef=pak-uit', { waitUntil: 'load' });
  await p.waitForFunction(() => document.documentElement.classList.contains('lk-gestart'), null, { timeout: 60000 }); await p.waitForTimeout(800);
  const { profile } = await s.send('Profiler.stop');
  const byId = {}; profile.nodes.forEach(n => byId[n.id] = n);
  const dt = profile.timeDeltas, self = {}; let tot = 0;
  profile.samples.forEach((id, i) => { const n = byId[id]; const k = (n.callFrame.functionName || '(anoniem)') + ' ' + n.callFrame.url.replace(/^.*\//, '').replace(/\?.*$/, '') + ':' + (n.callFrame.lineNumber + 1); self[k] = (self[k] || 0) + (dt[i] || 0); tot += dt[i] || 0; });
  // inclusief: tel per functie de tijd van alle samples waar hij in de stapel zit
  const ouder = {}; profile.nodes.forEach(n => (n.children || []).forEach(ch => ouder[ch] = n.id));
  const incl = {}; profile.samples.forEach((id, i) => { const gezien = {}; for (let x = id; x; x = ouder[x]) { const n = byId[x]; const k = (n.callFrame.functionName || '(anoniem)') + ' ' + n.callFrame.url.replace(/^.*\//, '').replace(/\?.*$/, '') + ':' + (n.callFrame.lineNumber + 1); if (!gezien[k]) { gezien[k] = 1; incl[k] = (incl[k] || 0) + (dt[i] || 0); } } });
  const top = o => Object.entries(o).filter(([k]) => !/^\(idle\)|^\(program\)|^\(root\)/.test(k)).sort((a, b) => b[1] - a[1]).slice(0, 28).map(([k, v]) => (v / 1000).toFixed(0).padStart(6) + ' ms  ' + k).join('\n');
  console.log('EIGEN TIJD\n' + top(self)); console.log('\nINCLUSIEF\n' + top(incl));
  await b.close();
})();
