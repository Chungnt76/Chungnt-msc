/* ===== Chế độ Tháng 11 cho các tab cũ (Tổng quan, SO & Chỉ tiêu, PC & LPPC, Ngành hàng, Review 360) =====
   Các tab này chạy theo 4 "khe tháng" 7→10 (khe 10 = tháng MTD). Khi chọn Tháng 11, dữ liệu được DỊCH khe:
   khe7←T8, khe8←T9, khe9←T10, khe10←T11 (MTD đến 10/11); nhãn "T7..T10 / Tháng 7..10" được cộng 1 khi hiển thị.
   Dữ liệu T11 lấy từ data/T11S.js (sinh từ raw đơn hàng + Visit Schedule + TARGETACTUAL). Thoát chế độ = khôi phục nguyên trạng. */
(function(){
const ST={on:false,orig:null,txt:new Map(),outs:new Set()};
window.T11SHIFT=ST;
const WD11={'7':26,'8':24,'9':27,'10':25};
const k3=r=>r.asm+'|'+r.npp+'|'+r.ssn;
const clone=o=>Object.assign({},o);
function baseRow(r){            // đưa dòng T9/T10 về giá trị gốc (trước bộ lọc Kênh/Nhóm KH/Phạm vi SO)
  const o=clone(r); delete o._a; delete o._tm; const b=(r.v&&r.v['a|all'])||{};
  ['so','aso','pc','lines','sm'].forEach(f=>{if(b[f]!=null)o[f]=b[f];});
  o.target=r._a?r._a.target:r.target; o.mcp=r._a?r._a.mcp:r.mcp; return o;}
function baseCH(r){const o=clone(r);delete o._a;if(r._a){o.so=r._a.so;o.aso=r._a.aso;o.pc=r._a.pc;}return o;}
function shiftTg(t){t=t||{};return {'7':t['8'],'8':t['9'],'9':t['10'],'10':t['11']};}

function rebuildDDK(){
  [DDKI,DDKP].forEach(o=>Object.keys(o).forEach(k=>delete o[k]));
  Object.entries(DDK.m).forEach(([mo,rows])=>{const o=DDKI[mo]={},q=DDKP[mo]={};rows.forEach(r=>{const k=DDK.k[r[1]];(o[k]=o[k]||[]).push(r);q[r[0]]=r;});});
}
function rebuildCat(){
  Object.keys(catIdx).forEach(k=>delete catIdx[k]); Object.keys(_cts).forEach(k=>delete _cts[k]);
  CATD.forEach(r=>{(catIdx[r[1]]=catIdx[r[1]]||[]).push(r);});
}
function rerender(){
  try{applyMeat(MEAT);}catch(e){console.error('t11s applyMeat',e);}
  try{renderAll();renderSoM();if(!document.getElementById('pgR360').hidden)render360();}catch(e){console.error('t11s render',e);}
  try{updScope();}catch(e){}
}
function snapshot(){
  ensureFull();
  if(ST.orig)return;
  ST.orig={T9:FULL.T9,T10:FULL.T10,T9CH:FULL.T9CH,T10CH:FULL.T10CH,DATA:FULL.DATA,FUND:FUNDRAW.slice(),CATD:CATD.slice(),
    m:Object.assign({},DDK.m),pn:DDK.p.length,q:DDK.q,meta:Object.assign({},T10_META),wd:Object.assign({},WORKDAYS)};
  window.T11ORIG={T9:FULL.T9,T10:FULL.T10};
}
function enter(){
  if(ST.on)return; snapshot(); const O=ST.orig, S=T11S;
  const m9={}; O.T9.forEach(r=>m9[k3(r)]=r);
  FULL.T9=O.T10.map(r=>{const o=baseRow(r),p=m9[k3(r)];
    o.smm={'7':(r.smm||{})['8'],'8':p&&p.v&&p.v['a|all']?p.v['a|all'].sm:0}; o.tgm=shiftTg(r.tgm); return o;});
  FULL.T10=S.T.map(r=>{const o=clone(r); o.tgm={'10':(r.tgm||{})['11']}; delete o._a; delete o._tm; return o;});
  FULL.T9CH=O.T10CH.map(baseCH); FULL.T10CH=T11CH.map(clone);
  const dk={}; S.DATA.forEach(d=>dk[d.npp+'|'+d.ss+'|'+d.oo+'|'+d.vip]=d);
  const sv=(r,m)=>r._a&&r._a['s'+m]!=null?r._a['s'+m]:r['s'+m];
  const nd=O.DATA.map(r=>{const d=dk[r.npp+'|'+r.ss+'|'+r.oo+'|'+r.vip]||{a11:0,s11:0,xs11:0,q11:0,nbT10:0,nb11:0};
    const o={asm:r.asm,npp:r.npp,ss:r.ss,oo:r.oo,vip:r.vip,
      q:(r.q10!=null?r.q10:(r._q!=null?r._q:r.q)),q10:d.q11,nb:r.nb,nb9:d.nbT10,nb10:d.nb11,
      a7:r.a8,a8:r.a9,a9:r.a10,a10:d.a11,s7:sv(r,8),s8:sv(r,9),s9:sv(r,10),s10:d.s11,
      xs7:r.xs8,xs8:r.xs9,xs9:r.xs10,xs10:d.xs11};return o;});
  FULL.DATA=nd; DATA.length=0; nd.forEach(r=>DATA.push(r));
  FUNDRAW.length=0;
  O.FUND.forEach(r=>{const mo=+r.month.slice(5); if(mo>=8&&mo<=10){const o=clone(r);o.month='2026-0'+(mo-1);FUNDRAW.push(o);}});
  S.FR.forEach(r=>{const o=clone(r);o.month='2026-10';FUNDRAW.push(o);});
  CATD.length=0;
  O.CATD.forEach(r=>{const mo=+r[1]; if(mo>=8&&mo<=10){const o=r.slice();o[1]=String(mo-1);CATD.push(o);}});
  S.CATD.forEach(r=>{const o=r.slice();o[1]='10';CATD.push(o);});
  rebuildCat();
  DDK.m['7']=O.m['8'];DDK.m['8']=O.m['9'];DDK.m['9']=O.m['10'];DDK.m['10']=S.DDK.rows;
  DDK.p.length=O.pn; S.DDK.newp.forEach(p=>DDK.p.push(p));
  DDK.q=Object.assign({},O.q,S.DDK.q);
  rebuildDDK();
  Object.assign(T10_META,{mtd_days:T11_META.mtd_days,last_date:T11_META.last_date,has_data:true,days_total:T11_META.days_total});
  Object.assign(WORKDAYS,WD11);
  ST.on=true; F.month='10';
  rerender(); hdr(true); document.body.classList.add('t11shift'); startTr();
}
function exit(){
  if(!ST.on)return; const O=ST.orig;
  FULL.T9=O.T9;FULL.T10=O.T10;FULL.T9CH=O.T9CH;FULL.T10CH=O.T10CH;FULL.DATA=O.DATA;
  DATA.length=0;O.DATA.forEach(r=>DATA.push(r));
  FUNDRAW.length=0;O.FUND.forEach(r=>FUNDRAW.push(r));
  CATD.length=0;O.CATD.forEach(r=>CATD.push(r)); rebuildCat();
  Object.keys(O.m).forEach(k=>{DDK.m[k]=O.m[k];}); DDK.p.length=O.pn; DDK.q=O.q; rebuildDDK();
  Object.keys(T10_META).forEach(k=>delete T10_META[k]); Object.assign(T10_META,O.meta);
  Object.keys(WORKDAYS).forEach(k=>delete WORKDAYS[k]); Object.assign(WORKDAYS,O.wd);
  ST.on=false; stopTr(); hdr(false); document.body.classList.remove('t11shift'); rerender();
}
let HDR=null;
function hdr(on){
  const tg=document.querySelector('.h2 .tg'),sub=document.querySelector('.h2 .sub'); if(!tg)return;
  if(on){ if(!HDR)HDR={tg:tg.innerHTML,ti:tg.title,sub:sub?sub.innerHTML:''};
    const md=T11_META.mtd_days,dt=T11_META.days_total,p=md/dt*100,r=24,c=2*Math.PI*r,o=c*(1-p/100);
    const cs=tg.querySelectorAll('circle'); if(cs[1])cs[1].setAttribute('stroke-dashoffset',o.toFixed(1));
    const tv=tg.querySelector('.tv'); if(tv)tv.textContent=p.toFixed(1).replace('.',',')+'%';
    const tl=tg.querySelectorAll('.tl'); if(tl[0])tl[0].textContent='Time gone T11 · '+md+'/'+dt+' ngày làm việc'; if(tl[1])tl[1].innerHTML='Dữ liệu T11 MTD đến <b>'+T11_META.last_date+'</b>';
    tg.title='Time gone tháng 11 = số ngày làm việc đã qua ÷ '+dt;
    if(sub)sub.innerHTML='Tháng 8–10 đủ tháng & Tháng 11 MTD · <b>'+Math.round(DATA.reduce((a,r)=>a+(r.q10||0),0)).toLocaleString('vi-VN')+'</b> quầy · <b>5</b> ASM · Off/On Premise · Lẻ · VIP3 · VIP5 · VIP Sỉ';
  } else if(HDR){ tg.innerHTML=HDR.tg; tg.title=HDR.ti; if(sub)sub.innerHTML=HDR.sub; HDR=null; }
}
/* ---- cộng 1 vào nhãn tháng (T7..T10 → T8..T11) trong các tab chạy bằng khe tháng ---- */
const RE=/((?<![A-Za-zÀ-ỹ0-9])T|[Tt]háng |THÁNG )(7|8|9|10)(?!\d)/g;
const sh=s=>s.replace(RE,(m,p,n)=>p+(+n+1));
const ROOTS=['pgOv','pgSoM','pgPc','pgCat','pgR360','v3chips','context','tblNote'];
let OBS=null;
function tr(node){
  if(node.nodeType!==3)return; const v=node.nodeValue; if(ST.txt.has(node)&&ST.txt.get(node).out===v)return;
  if(ST.outs.has(v))return;               // bản sao của chữ đã dịch (v3 copy từ thẻ gốc) → không dịch lần 2
  const o=sh(v); if(o!==v){ST.txt.set(node,{orig:v,out:o}); ST.outs.add(o); node.nodeValue=o;}
}
function walk(n){
  if(n.nodeType===3){tr(n);return;}
  if(n.nodeType===1){ if(/^(SCRIPT|STYLE)$/.test(n.tagName))return; for(let c=n.firstChild;c;c=c.nextSibling)walk(c); }
}
function startTr(){
  stopTr(); OBS=new MutationObserver(ms=>{ms.forEach(m=>{ if(m.type==='characterData')tr(m.target); else m.addedNodes.forEach(walk); });});
  ROOTS.forEach(id=>{const e=document.getElementById(id); if(e){walk(e); OBS.observe(e,{childList:true,subtree:true,characterData:true});}});
}
function stopTr(){
  if(OBS){OBS.disconnect();OBS=null;}
  ST.txt.forEach((v,n)=>{ if(n.nodeValue===v.out)n.nodeValue=v.orig; }); ST.txt.clear(); ST.outs.clear();
}
/* AP Quý 4: SO T11 (MTD) theo ĐDKD → APQ[r][10] */
try{const rt=DDK.p.map(p=>p[0]).concat(T11S.DDK.newp.map(p=>p[0])),so={};
  T11S.DDK.rows.forEach(r=>{const v=r[4]['a|all|all'];so[rt[r[0]]]=v?v[0]:0;});
  APQ.forEach(r=>{r[10]=so[r[3]]||0;});}catch(e){console.error('APQ T11',e);}
window.t11shiftEnter=enter; window.t11shiftExit=exit; window.t11shiftWalk=()=>{if(ST.on)startTr();};
})();
