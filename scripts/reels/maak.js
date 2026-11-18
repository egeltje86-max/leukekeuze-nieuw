// Fotoreel-sjabloon (18-11-2026). Gebruik: node maak.js <naam> [dia] in een map met reels.json en de foto's (c0.jpg ...). Geen winkelnamen op de foto's, alleen leukekeuze.nl; veilige zone zie veilig.css en CLAUDE.md §12.
const fs = require('fs'); const { chromium } = require('playwright'); const { execSync } = require('child_process');
const R = JSON.parse(fs.readFileSync(__dirname + '/reels.json', 'utf8')); const welke = process.argv[2]; const alleenDia = process.argv[3] === 'dia';
const CSS = `*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:#F7F3EC;font-family:'Manrope',sans-serif;color:#141A2A}
.s{position:absolute;inset:0;display:none;overflow:hidden}
.navy{background:#0A1020 url(bokeh.png) center/cover no-repeat;color:#fff}
.merk{position:absolute;left:0;right:0;top:150px;text-align:center;font-weight:800;font-size:34px;letter-spacing:.3em;color:#8F6620;text-transform:uppercase}
.lijn{position:absolute;left:50%;top:214px;width:120px;height:3px;margin-left:-60px;background:#B8862E;border-radius:2px}
.kaart{position:absolute;left:60px;right:60px;top:290px;height:960px;background:#fff;border:2px solid #E5D7BE;border-radius:44px;box-shadow:0 30px 80px rgba(20,26,42,.16);overflow:hidden;display:flex;align-items:center;justify-content:center}
.kaart img{width:88%;height:88%;object-fit:contain}
.kaart.vul img{width:100%;height:100%;object-fit:cover}
.soort{position:absolute;left:50px;right:50px;top:1300px;text-align:center;font-family:'Playfair Display',serif;font-weight:700;font-size:84px;line-height:1.08;color:#0A1020}
.sub{position:absolute;left:80px;right:80px;top:1418px;text-align:center;font-size:44px;line-height:1.35;color:#3a4256;font-weight:500}
.prijs small{font-size:36px;font-weight:700;margin-right:10px;color:#F7F3EC;letter-spacing:.02em}
.prijs{position:absolute;right:90px;top:236px;z-index:3;background:#0A1020;color:#F2CB74;font-weight:800;font-size:68px;padding:24px 42px;border:4px solid #F2CB74;border-radius:999px;box-shadow:0 14px 34px rgba(10,16,32,.35)}
.nr{position:absolute;left:90px;top:236px;z-index:3;width:112px;height:112px;border-radius:50%;background:linear-gradient(#f8dc95,#e6b452);color:#221b1f;font-family:'Playfair Display',serif;font-weight:700;font-size:66px;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(10,16,32,.3)}
.voet{position:absolute;left:0;right:0;bottom:250px;text-align:center;font-weight:800;font-size:38px;color:#0A1020;letter-spacing:.02em}
.voet b{color:#B8862E}
.t1{position:absolute;left:60px;right:60px;top:540px;text-align:center;font-weight:800;font-size:36px;letter-spacing:.3em;color:#F2CB74;text-transform:uppercase}
.t2{position:absolute;left:50px;right:50px;top:630px;text-align:center;font-family:'Playfair Display',serif;font-weight:700;font-size:136px;line-height:1.04;color:#fff}
.t3{position:absolute;left:80px;right:80px;top:1010px;text-align:center;font-size:56px;line-height:1.35;color:#F7F3EC;font-weight:500}
.t4{position:absolute;left:50%;top:1170px;white-space:nowrap;background:linear-gradient(#f8dc95,#e6b452);color:#221b1f;font-weight:800;font-size:44px;padding:26px 54px;border-radius:999px;box-shadow:0 10px 0 #9c6c24}
.rij{position:absolute;left:50px;right:50px;top:1040px;display:flex;justify-content:space-between}
.rij span{width:180px;height:180px;border-radius:50%;overflow:hidden;border:5px solid #F2CB74;background:#fff;box-shadow:0 12px 30px rgba(0,0,0,.45)}
.rij img{width:100%;height:100%;object-fit:cover}
#kop .t1{top:420px}#kop .t2{top:510px}#kop .t3{top:880px}#kop .t4{top:1310px}
#p0 .kaart{top:420px;height:920px}#p0 .nr,#p0 .prijs{top:366px}#p0 .soort{top:1372px;font-size:80px}#p0 .sub{top:1480px;font-size:42px}#p0 .merk,#p0 .lijn{display:none}
.kk1{position:absolute;left:40px;right:40px;top:120px;text-align:center;font-weight:800;font-size:38px;letter-spacing:.24em;color:#8F6620;text-transform:uppercase}
.kk2{position:absolute;left:30px;right:30px;top:180px;text-align:center;font-family:'Playfair Display',serif;font-weight:700;font-size:96px;line-height:1.04;white-space:nowrap;color:#0A1020}
.kk2 em{font-style:normal;color:#B8862E}
.zoek{left:90px!important;right:90px!important}.zb{display:flex;align-items:center;gap:26px;background:#fff;border:4px solid #F2CB74;border-radius:999px;padding:34px 48px;box-shadow:0 16px 40px rgba(0,0,0,.45)}.zb i{font-style:normal;font-weight:800;font-size:68px;color:#141A2A}.zb u{display:inline-block;width:5px;height:74px;background:#B8862E;margin-left:-14px;text-decoration:none}.eindsub{position:absolute;left:60px;right:60px;top:1270px;text-align:center;font-size:46px;color:#F7F3EC;font-weight:500}
.bgp{background:#0A1020 url(bg.png) center/cover no-repeat!important;color:#fff}
.bgp::before{content:'';position:absolute;inset:0;z-index:0;background:linear-gradient(rgba(10,16,32,.72),rgba(10,16,32,.6) 30%,rgba(10,16,32,.7) 60%,rgba(10,16,32,.9) 68%,rgba(10,16,32,.95))}
.bgp>*{z-index:1}.bgp>.nr,.bgp>.prijs{z-index:3}
.prod.bgp .merk{color:#F2CB74;top:120px;text-shadow:0 2px 10px rgba(0,0,0,.9)}.prod.bgp .lijn{top:184px}
.prod.bgp .soort{color:#fff}.prod.bgp .sub{color:#F7F3EC}.prod.bgp .voet{color:#fff}.prod.bgp .voet b{color:#F2CB74}
.prod.bgp .kaart{border-color:#F2CB74;box-shadow:0 30px 90px rgba(0,0,0,.55)}
#p0.bgp::before{background:linear-gradient(rgba(10,16,32,.85),rgba(10,16,32,.55) 20%,rgba(10,16,32,.1) 34%,rgba(10,16,32,.1) 62%,rgba(10,16,32,.88) 72%,rgba(10,16,32,.94))}
#p0.bgp .kk1{color:#F2CB74;text-shadow:0 2px 10px rgba(0,0,0,.9)}#p0.bgp .kk2{color:#fff;text-shadow:0 4px 18px rgba(0,0,0,.8)}#p0.bgp .kk2 em{color:#F2CB74}
#eind.bgp::before{background:linear-gradient(rgba(10,16,32,.6),rgba(10,16,32,.45) 40%,rgba(10,16,32,.82) 66%,rgba(10,16,32,.93))}
.klein{position:absolute;left:0;right:0;bottom:250px;text-align:center;font-size:26px;color:#b9bfd0}
/* VEILIG (18-11-2026): TikTok legt de zoekbalk bovenaan (tot ~260px) en naam en tekst onderaan (vanaf ~1600px) over de foto, en de knoppen rechts (x>920, y 820-1680). Alles wat gelezen moet worden staat daartussen. Nooit een winkelnaam: alleen leukekeuze.nl. */
.merk{top:290px!important}.lijn{top:350px!important}
.nr{top:385px!important;left:90px!important}.prijs{top:385px!important;right:90px!important}
.kaart{top:430px!important;height:760px!important;left:80px!important;right:80px!important}
.soort{top:1215px!important;font-size:70px!important;left:150px!important;right:150px!important}
.sub{top:1305px!important;font-size:38px!important;left:150px!important;right:150px!important}
.voet{bottom:auto!important;top:1440px!important;font-size:44px!important;background:#0A1020;color:#fff!important;left:0!important;right:0!important;margin:0 auto;width:fit-content;padding:16px 40px;border-radius:999px;white-space:nowrap}
.voet b{color:#F2CB74!important}
#p0 .kk1{top:285px!important;font-size:34px!important}#p0 .kk2{top:335px!important}
#p0 .nr,#p0 .prijs{top:480px!important}#p0 .kaart{top:520px!important;height:680px!important}
#p0 .soort{top:1222px!important;font-size:68px!important}#p0 .sub{top:1310px!important;font-size:36px!important}
.klein{bottom:auto!important;top:1420px!important}
#eind .t1{top:420px!important}#eind .t2{top:500px!important}#eind .zoek{top:820px!important;left:150px!important;right:150px!important}#eind .t4{top:1050px!important}#eind .eindsub{top:1230px!important}
`;
function html(r) {
  const P = r.p.map((p, i) => `<div class="s prod${r.bg?' bgp':''}" id="p${i}">${i===0?'<div class="kk1">'+r.k1+'</div><div class="kk2">'+r.k2+'</div>':''}<div class="merk">${r.merk}</div><div class="lijn"></div><div class="nr">${i + 1}</div><div class="prijs">${p.pr}</div><div class="kaart${p.vul ? ' vul' : ''}"><img src="${p.f}"></div><div class="soort">${p.n}</div><div class="sub">${p.s}</div><div class="voet">Alles op leukekeuze<b>.nl</b></div></div>`).join('\n');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="s navy" id="kop" style="display:none"><div class="t1">${r.t1}</div><div class="t2">${r.t2}</div><div class="t3">${r.t3}</div><div class="rij">${r.p.map(p => '<span><img src="' + p.f + '"></span>').join('')}</div><div class="t4">Veeg door &rarr;</div></div>
${P}
<div class="s navy${r.bg?' bgp':''}" id="eind"><div class="t1" style="top:470px">${r.eind1}</div><div class="t2" style="top:560px;font-size:104px;line-height:1.1">${r.eind3}</div><div class="t3 zoek" style="top:860px"><span class="zb"><svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="#8F6620" stroke-width="2.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg><i>${r.zoek||"lamp"}</i><u></u></span></div><div class="t4" style="top:1090px">op leukekeuze.nl</div><div class="eindsub">${r.eindsub||"Alle cadeaus: link in bio"}</div><div class="klein">Prijzen gecontroleerd ${r.datum}</div></div>
<script>
const SC=${JSON.stringify(sc(r))};
const cl=(x,a,b)=>Math.max(0,Math.min(1,(x-a)/(b-a))), eo=t=>1-Math.pow(1-t,3), q=(e,s)=>e.querySelector(s);
function st(e,o,y,sc,b){ if(!e) return; e.style.opacity=o; e.style.transform=(b||'')+' translateY('+(y||0)+'px) scale('+(sc==null?1:sc)+')'; }
window.zet=function(t){
  for(const [id,a,b] of SC){ const e=document.getElementById(id); const aan=t>=a&&t<b; e.style.display=aan?'block':'none'; if(!aan) continue; const u=t-a, d=b-a, uit=1-cl(u,d-0.22,d);
    if(id==='kop'||id==='eind'){ if(!e.classList.contains('bgp')) e.style.backgroundSize=(118-8*u/d)+'%';
      ['.t1','.t2','.t3','.t4'].forEach((s,i)=>{ const x=q(e,s); const v=eo(cl(u,0.12+i*0.24,0.66+i*0.24)); st(x,v*(id==='kop'?uit:1),(1-v)*50,1,s==='.t4'?'translateX(-50%)':''); }); const k=q(e,'.klein'); if(k) k.style.opacity=cl(u,1.2,1.6); const rj=q(e,'.rij'); if(rj) [...rj.children].forEach((x,i)=>{ const v=eo(cl(u,0.7+i*0.1,1.1+i*0.1)); st(x,v*uit,(1-v)*40,0.8+0.2*v); }); }
    else if(id==='p0'){ ['.kaart','.nr','.prijs','.soort','.sub','.voet','.kk1','.kk2'].forEach(c=>st(q(e,c),uit,0,1)); q(e,'.kaart img').style.transform='scale('+(1+0.07*u/d)+')'; }
    else { const v=eo(cl(u,0,0.5)); st(q(e,'.kaart'),v*uit,(1-v)*70,0.94+0.06*v); q(e,'.kaart img').style.transform='scale('+(1+0.06*u/d)+')';
      const m=eo(cl(u,0.05,0.45)); st(q(e,'.merk'),m*uit,(1-m)*-20); q(e,'.lijn').style.transform='scaleX('+eo(cl(u,0.15,0.7))+')'; q(e,'.lijn').style.opacity=uit;
      const n=cl(u,0.2,0.5); st(q(e,'.nr'),cl(u,0.2,0.35)*uit,0,n<=0?0.5:(n<1?eo(n)*1.12:1+0.12*(1-cl(u,0.5,0.7))));
      const s1=eo(cl(u,0.3,0.8)); st(q(e,'.soort'),s1*uit,(1-s1)*46); const s2=eo(cl(u,0.5,1.0)); st(q(e,'.sub'),s2*uit,(1-s2)*40);
      const p=cl(u,0.75,1.05), pp=p<1?eo(p)*1.12:1+0.12*(1-cl(u,1.05,1.25)); st(q(e,'.prijs'),cl(u,0.75,0.9)*uit,0,p<=0?0.6:pp); st(q(e,'.voet'),cl(u,0.3,0.8)*uit,0); }
  }
};
</script></body></html>`;
}
function sc(r) { const o = []; let t = 0; r.p.forEach((p, i) => { const d = i === 0 ? 3.6 : 2.9; o.push(['p' + i, t, t + d]); t += d; }); o.push(['eind', t, t + 2.8]); return o; }
(async () => {
  const b = await chromium.launch();
  for (const r of R) { if (welke && welke !== 'alle' && r.naam !== welke) continue;
    const dir = __dirname + '/' + r.naam; fs.mkdirSync(dir, { recursive: true }); const hp = __dirname + '/' + r.naam + '.html'; fs.writeFileSync(hp, html(r));
    const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage();
    await p.goto('file://' + hp); await p.evaluate(() => document.fonts.ready); await p.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {})))); await p.waitForTimeout(600);
    const S = sc(r);
    for (let i = 0; i < S.length; i++) { const [id, a, e] = S[i]; await p.evaluate(t => window.zet(t), id === 'eind' ? e - 0.05 : e - 0.4); await p.screenshot({ path: dir + '/' + r.naam + '-foto-' + (i + 1) + '.jpg', type: 'jpeg', quality: 93 }); }
    if (!alleenDia) {
      const lijst = [];
      for (const [id, a, e] of S) { const d = dir + '/f_' + id; fs.rmSync(d, { recursive: true, force: true }); fs.mkdirSync(d); const n = Math.round((e - a) * 30);
        for (let i = 0; i < n; i++) { await p.evaluate(t => window.zet(t), a + i / 30 + 0.0001); await p.screenshot({ path: d + '/' + String(i).padStart(4, '0') + '.jpg', type: 'jpeg', quality: 92 }); }
        execSync(`ffmpeg -y -loglevel error -framerate 30 -i ${d}/%04d.jpg -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p ${dir}/tmp_${id}.mp4 && mv ${dir}/tmp_${id}.mp4 ${dir}/sc_${id}.mp4`); fs.rmSync(d, { recursive: true, force: true }); lijst.push("file 'sc_" + id + ".mp4'"); }
      fs.writeFileSync(dir + '/lijst.txt', lijst.join('\n') + '\n');
      execSync(`cd ${dir} && ffmpeg -y -loglevel error -f concat -safe 0 -i lijst.txt -c copy beeld.mp4 && ffmpeg -y -loglevel error -i beeld.mp4 -f lavfi -i anullsrc=r=44100:cl=stereo -shortest -c:v copy -c:a aac -b:a 96k tmp.mp4 && mv tmp.mp4 leukekeuze-${r.naam}.mp4`);
    }
    console.log('klaar', r.naam); await p.close(); }
  await b.close();
})();
