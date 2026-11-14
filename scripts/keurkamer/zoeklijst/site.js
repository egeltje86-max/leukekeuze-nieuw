const fs=require('fs'),vm=require('vm');const R=require('path').resolve(__dirname,'../../..')+'/';
const ctx={window:{dispatchEvent(){}},document:{createEvent(){return {initEvent(){}}}},console,Event:function(){}};ctx.window.window=ctx.window;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(R+'assets/js/producten-lean.js','utf8'),ctx);
const P=ctx.window.LK_PRODUCTEN.filter(p=>p.status==='goedgekeurd'&&!p.samengevoegd);
fs.writeFileSync(__dirname+'/site.json',JSON.stringify(P.map(p=>({id:p.id,t:p.titel,m:p.merk||'',p:p.prijs,w:p.shop||p.winkel||'',v:[p.afd,p.groep,p.vak].join('/'),c:p.cat||'',s:p.sub||''}))));
console.log(P.length, Object.keys(P[0]).join(','));
