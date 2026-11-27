// Gebruik: node scripts/reels/maakB.js <map met reel.json en c0.jpg ...>. reel.json: naam, k1, hook, eind1, eind3, zoek, eindsub, datum, p[{f, n, s, pr, gloed}].
// Reelstijl B 'donker podium met gloed' (gekozen door Marius 26-11-2026). node maakB.js Sinds 27-11-2026 (Marius: "er moet overal leukekeuze.nl op staan") staat op elke productfoto een gouden label leukekeuze.nl.
const {chromium}=require('playwright');const fs=require('fs');const {execSync}=require('child_process');
const D=process.argv[2]||process.cwd();const R=JSON.parse(fs.readFileSync(D+'/reel.json','utf8'));const F=process.env.LK_FONTS||(__dirname+'/../../assets/fonts/');
const ff=`@font-face{font-family:M;src:url(${F}manrope-800-latin.woff2);font-weight:800}@font-face{font-family:M;src:url(${F}manrope-700-latin.woff2);font-weight:700}`;
const css=`*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;font-family:M,sans-serif;background:#05070f}
.bg{position:absolute;inset:0}.foto{position:absolute;left:90px;right:90px;top:560px;height:860px;border-radius:40px;overflow:hidden}
.foto img{width:100%;height:100%;object-fit:cover;transform-origin:50% 50%}
.k1{position:absolute;top:300px;left:0;right:0;text-align:center;color:#F2CB74;font-weight:800;font-size:40px;letter-spacing:8px}
.k2{position:absolute;top:360px;left:40px;right:40px;text-align:center;color:#fff;font-weight:800;font-size:80px;line-height:1}
.t{position:absolute;top:330px;left:40px;right:40px;text-align:center;color:#fff;font-weight:800;font-size:88px;line-height:1}
.s{position:absolute;top:440px;left:60px;right:60px;text-align:center;color:rgba(255,255,255,.78);font-weight:700;font-size:40px}
.pr{position:absolute;top:1445px;left:0;right:0;text-align:center;color:#fff;font-weight:800;font-size:100px}
.web{position:absolute;top:1500px;left:0;right:0;text-align:center;color:rgba(255,255,255,.55);font-weight:700;font-size:30px;display:none}`;
function scene(p,i){const g=p.gloed;const hook=i===0;
 return `<div class="bg" style="background:radial-gradient(ellipse at 50% 50%,${g.replace('rgb','rgba').replace(')',',.38)')} 0,#0b1022 52%,#05070f 100%)"></div>
 <div class="foto" style="box-shadow:0 0 130px 34px ${g.replace('rgb','rgba').replace(')',',.5)')}"><img id="im" src="${p.f}"></div>
 ${hook?`<div class="k1">${R.k1.toUpperCase()}</div><div class="k2">${R.hook}</div>`:`<div class="t"><span style="color:#F2CB74">${i+1}</span> ${p.n}</div><div class="s">${p.s}</div>`}
 <div style="position:absolute;top:1372px;left:0;right:0;text-align:center"><span style="display:inline-block;background:#F2CB74;color:#0b1022;font-weight:800;font-size:42px;padding:12px 38px;border-radius:40px;box-shadow:0 6px 24px rgba(0,0,0,.45)">leukekeuze.nl</span></div>
 <div class="pr" id="pr" style="text-shadow:0 0 34px ${g}">${p.pr}</div>`;}
function eind(){return `<div class="bg" style="background:radial-gradient(ellipse at 50% 45%,#22345f 0,#0b1022 55%,#05070f 100%)"></div>
 <div style="position:absolute;top:520px;left:0;right:0;text-align:center;color:#F2CB74;font-weight:800;font-size:40px;letter-spacing:8px">${R.eind1.toUpperCase()}</div>
 <div style="position:absolute;top:590px;left:40px;right:40px;text-align:center;color:#fff;font-weight:800;font-size:96px;line-height:1.05">${R.eind3}</div>
 <div style="position:absolute;top:800px;left:110px;right:110px;height:130px;border-radius:65px;background:#fff;display:flex;align-items:center;padding:0 48px;font-weight:800;font-size:54px;color:#0b1022;box-shadow:0 0 80px rgba(242,203,116,.45)">🔍&nbsp; ${R.zoek}</div>
 <div style="position:absolute;top:990px;left:0;right:0;text-align:center"><span style="display:inline-block;background:#F2CB74;color:#0b1022;font-weight:800;font-size:50px;padding:24px 54px;border-radius:60px">op leukekeuze.nl</span></div>
 <div style="position:absolute;top:1180px;left:0;right:0;text-align:center;color:#fff;font-weight:700;font-size:44px">${R.eindsub}</div>
 <div style="position:absolute;top:1300px;left:0;right:0;text-align:center;color:rgba(255,255,255,.55);font-weight:700;font-size:30px">Prijzen gecontroleerd op ${R.datum}</div>`;}
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
 const out=D+'/'+R.naam+'-B';fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out);const lijst=[];const fps=30;
 const sc=R.p.map((p,i)=>({h:scene(p,i),dur:i===0?2.6:1.9,zoom:true})).concat([{h:eind(),dur:2.6}]);
 for(let s=0;s<sc.length;s++){const hp=D+'/_s.html';fs.writeFileSync(hp,`<html><head><meta charset=utf-8><style>${ff}${css}</style></head><body>${sc[s].h}</body></html>`);
  await pg.goto('file://'+hp);await pg.waitForTimeout(250);await pg.screenshot({path:`${out}/${R.naam}-foto-${s+1}.jpg`,type:'jpeg',quality:92});
  const fd=`${out}/f${s}`;fs.mkdirSync(fd);const n=Math.round(sc[s].dur*fps);
  for(let f=0;f<n;f++){const u=f/n;
   await pg.evaluate(([u,z])=>{const im=document.getElementById('im');if(im&&z)im.style.transform='scale('+(1.0+0.09*u)+')';
    const pr=document.getElementById('pr');if(pr){const k=Math.min(1,u*5);pr.style.transform='scale('+(0.6+0.4*k+0.06*Math.sin(Math.min(1,u*5)*Math.PI))+')';pr.style.opacity=k;}
    document.body.style.opacity=Math.min(1,u*8);},[u,sc[s].zoom]);
   await pg.screenshot({path:`${fd}/${String(f).padStart(4,'0')}.jpg`,type:'jpeg',quality:90});}
  execSync(`ffmpeg -y -loglevel error -framerate ${fps} -i ${fd}/%04d.jpg -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p ${out}/tmp_${s}.mp4 && mv ${out}/tmp_${s}.mp4 ${out}/sc_${s}.mp4`);fs.rmSync(fd,{recursive:true,force:true});lijst.push(`file 'sc_${s}.mp4'`);}
 fs.writeFileSync(out+'/lijst.txt',lijst.join('\n'));
 execSync(`cd ${out} && ffmpeg -y -loglevel error -f concat -safe 0 -i lijst.txt -c copy beeld.mp4 && ffmpeg -y -loglevel error -i beeld.mp4 -f lavfi -i anullsrc=r=44100:cl=stereo -shortest -c:v copy -c:a aac -b:a 96k tmp.mp4 && mv tmp.mp4 leukekeuze-${R.naam}.mp4 && rm -f sc_*.mp4 beeld.mp4 lijst.txt`);
 await b.close();console.log('klaar',out);})();
