/* ===== Chế độ Tháng 11 cho các tab cũ (Tổng quan, SO & Chỉ tiêu, PC & LPPC, Ngành hàng, Review 360) =====
   Các tab này chạy theo 4 "khe tháng" 7→10 (khe 10 = tháng MTD). Khi chọn Tháng 11, dữ liệu được DỊCH khe:
   khe7←T8, khe8←T9, khe9←T10, khe10←T11 (MTD đến 10/11); nhãn "T7..T10 / Tháng 7..10" được cộng 1 khi hiển thị.
   Dữ liệu T11 lấy từ data/T11S.js (sinh từ raw đơn hàng + Visit Schedule + TARGETACTUAL). Thoát chế độ = khôi phục nguyên trạng. */
(function(){
const ST={on:false,orig:null,txt:new Map(),outs:new Set()};
window.T11SHIFT=ST;
const KCY=9/27;   // chỉ tiêu T10 quy về cùng kỳ 01–10/10: 9/27 ngày làm việc
const WD11={'7':26,'8':24,'9':9,'10':25};   // khe 9 = T10 cùng kỳ 01–10/10 (9 ngày làm việc)
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
  const cy={}; if(typeof T10CY!=='undefined')T10CY.forEach(r=>cy[k3(r)]=r);
  FULL.T9=O.T10.map(r=>{const o=baseRow(r),p=m9[k3(r)],c=cy[k3(r)]; if(c){o.v=c.v;['so','aso','pc','lines','sm'].forEach(f=>{o[f]=c[f];});}
    o.smm={'7':(r.smm||{})['8'],'8':p&&p.v&&p.v['a|all']?p.v['a|all'].sm:0}; o.tgm=shiftTg(r.tgm);
    if(c&&o.tgm['9']){o.tgm['9']=o.tgm['9'].map(x=>(x||0)*KCY);} if(c&&o.target)o.target=o.target*KCY; return o;});
  FULL.T10=S.T.map(r=>{const o=clone(r); o.tgm={'10':(r.tgm||{})['11']}; delete o._a; delete o._tm; return o;});
  const cyCH=r=>{const o=baseCH(r), c=cy[k3(r)]; if(!c||!c.v)return o; const f=k=>{const b=c.v[k]||{}; return {so:b.so||0,aso:b.aso||0,pc:b.pc||0};};
    const A=f('a|'+r.oo); o.so=A.so;o.aso=A.aso;o.pc=A.pc;o.x=f('x|'+r.oo);
    if(r.vv){o.vv={}; Object.keys(r.vv).forEach(g=>{o.vv[g]=Object.assign({},r.vv[g],f('a|'+r.oo+'|'+g),{x:f('x|'+r.oo+'|'+g)});});}
    return o;};            // T10 cùng kỳ (01–10/10) theo kênh: lấy từ T10CY, không dùng cả tháng T10
  FULL.T9CH=O.T10CH.map(cyCH); FULL.T10CH=T11CH.map(clone);
  const dk={}; S.DATA.forEach(d=>dk[d.npp+'|'+d.ss+'|'+d.oo+'|'+d.vip]=d);
  const sv=(r,m)=>r._a&&r._a['s'+m]!=null?r._a['s'+m]:r['s'+m];
  const CS=(typeof T10CYS!=='undefined')?T10CYS:null, cd={};
  if(CS&&!CS._tg){CS._tg=1; const om={}; (O.m['10']||[]).forEach(r=>om[r[0]]=r);
    CS.DDK.rows.forEach(r=>{const q=om[r[0]]; if(q){r[2]=Math.round((q[2]||0)*KCY); r[3]=Math.round((q[3]||0)*KCY);}});
    const oc={}; O.CATD.forEach(r=>{if(+r[1]===10)oc[r[0]+'|'+r[2]+'|'+r[3]]=r;});
    CS.CATD.forEach(r=>{const q=oc[r[0]+'|'+r[2]+'|'+r[3]]; if(q&&r[3]==='all')r[8]=Math.round((q[8]||0)*KCY);});} if(CS)CS.DATA.forEach(d=>cd[d.npp+'|'+d.ss+'|'+d.oo+'|'+d.vip]=d);
  const nd=O.DATA.map(r=>{const d=dk[r.npp+'|'+r.ss+'|'+r.oo+'|'+r.vip]||{a11:0,s11:0,xs11:0,q11:0,nbT10:0,nb11:0};
    const c=cd[r.npp+'|'+r.ss+'|'+r.oo+'|'+r.vip];
    const o={asm:r.asm,npp:r.npp,ss:r.ss,oo:r.oo,vip:r.vip,
      q:(r.q10!=null?r.q10:(r._q!=null?r._q:r.q)),q10:d.q11,nb:r.nb,nb9:d.nbT10,nb10:d.nb11,
      a7:r.a8,a8:r.a9,a9:c?c.a11:r.a10,a10:d.a11,s7:sv(r,8),s8:sv(r,9),s9:c?c.s11:sv(r,10),s10:d.s11,
      xs7:r.xs8,xs8:r.xs9,xs9:c?c.xs11:r.xs10,xs10:d.xs11};return o;});
  FULL.DATA=nd; DATA.length=0; nd.forEach(r=>DATA.push(r));
  FUNDRAW.length=0;
  O.FUND.forEach(r=>{const mo=+r.month.slice(5); if(mo>=8&&mo<=(CS?9:10)){const o=clone(r);o.month='2026-0'+(mo-1);FUNDRAW.push(o);}});
  if(CS)CS.FR.forEach(r=>{const o=clone(r);o.month='2026-09';FUNDRAW.push(o);});
  S.FR.forEach(r=>{const o=clone(r);o.month='2026-10';FUNDRAW.push(o);});
  CATD.length=0;
  O.CATD.forEach(r=>{const mo=+r[1]; if(mo>=8&&mo<=(CS?9:10)){const o=r.slice();o[1]=String(mo-1);CATD.push(o);}});
  if(CS)CS.CATD.forEach(r=>{const o=r.slice();o[1]='9';CATD.push(o);});
  S.CATD.forEach(r=>{const o=r.slice();o[1]='10';CATD.push(o);});
  rebuildCat();
  DDK.m['7']=O.m['8'];DDK.m['8']=O.m['9'];DDK.m['9']=CS?CS.DDK.rows:O.m['10'];DDK.m['10']=S.DDK.rows;
  DDK.p.length=O.pn; S.DDK.newp.forEach(p=>DDK.p.push(p)); if(CS)CS.DDK.newp.forEach(p=>DDK.p.push(p));
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
  if(on){ if(!HDR)HDR={sub:sub?sub.innerHTML:''};
    if(sub)sub.innerHTML='Tháng 8–10 đủ tháng & Tháng 11 MTD · <b>'+Math.round(DATA.reduce((a,r)=>a+(r.q10||0),0)).toLocaleString('vi-VN')+'</b> quầy · <b>5</b> ASM · Off/On Premise · Lẻ · VIP3 · VIP5 · VIP Sỉ';
  } else if(HDR){ if(sub)sub.innerHTML=HDR.sub; HDR=null; }
}
/* ---- cộng 1 vào nhãn tháng (T7..T10 → T8..T11) trong các tab chạy bằng khe tháng ---- */
const RE=/((?<![A-Za-zÀ-ỹ0-9])T|[Tt]háng |THÁNG )(7|8|9|10)(?!\d)/g;
const sh=s=>s.replace(RE,(m,p,n)=>p+(+n+1)).replace(/T10 \(cả tháng\)|T10 cả tháng/g,'T10 cùng kỳ (01–10/10)').replace(/(T10|[Tt]háng 10|THÁNG 10)(?!\d)(?! cùng)(?! CÙNG)(?!–T11)(?!\s*→)/g,'$1 cùng kỳ');
ST.sh=sh;
const ROOTS=['pgOv','pgSoM','pgPc','pgCat','pgR360','v3chips','context','tblNote'];
let OBS=null; const POKE=new Set();
function tr(node){
  if(node.nodeType!==3)return; const v=node.nodeValue; const nm=x=>x.replace(/^[^A-Za-z0-9À-ỹ]+/,''); if(ST.txt.has(node)&&nm(ST.txt.get(node).out)===nm(v))return;   // đã dịch (kể cả khi script khác bỏ emoji đầu dòng)
  if(node.parentElement&&node.parentElement.closest('#v3kpis,#pcTblA,#pcTblB'))return;   // bản sao của chữ đã dịch (v3 / mirror copy từ nguồn) → không dịch lần 2
  if(node.parentElement&&node.parentElement.closest('#pgR360')){const h=node.parentElement.closest('li,p,.k-lab,.k-sub,td,th')||node.parentElement; if(/\bHV\b|Hội viên|HỘI VIÊN|hội viên/.test(h.textContent))return;}   // số Hội viên trong R360 vẫn là T10 (chưa có chương trình T11 ở khung này) → giữ nhãn T10
  const o=sh(v); if(o!==v){ST.txt.set(node,{orig:v,out:o}); node.nodeValue=o;
    const src=node.parentElement&&node.parentElement.closest('#somTbl,#tbl'); if(src){POKE.add(src); if(!POKE.t)POKE.t=setTimeout(()=>{POKE.t=0;POKE.forEach(t=>{const b=t.tBodies[0];if(b){const x=document.createTextNode('');b.appendChild(x);x.remove();}});POKE.clear();},0);}}
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
/* PC & LPPC (bảng Δ): ghi rõ tháng ở đầu cột — lấy nhãn từ bảng PC/ngày cùng tab */
(function(){let busy=false;
  function fix(){ if(busy)return; const a=document.getElementById('pcTblA'),b=document.getElementById('pcTblB'); if(!a||!b||!a.tHead||!b.tHead)return;
    const hs=[...a.tHead.rows[0].cells].map(c=>c.textContent.replace(/\s+/g,' ').trim()); const pa=hs.filter(t=>/^PC\/ngày /i.test(t)).map(t=>t.replace(/^PC\/ngày /i,'').replace(/ \(MTD\)/,''));
    const cur=hs.filter(t=>/^PC\/ngày /i.test(t)).slice(-1)[0]; if(pa.length<2||!cur)return;
    const lab=pa[0]+' → '+pa[1]+(/cùng kỳ/.test(pa[0])?' · lũy kế 9 → 8 ngày':''); busy=true;
    try{[...b.tHead.querySelectorAll('th')].forEach(th=>{ if(!/^(PC|LPPC) — /.test(th.firstChild&&th.firstChild.nodeValue?th.firstChild.nodeValue.trim():th.textContent.trim()))return;
      let sub=th.querySelector('.thsub'); if(!sub){sub=document.createElement('div');sub.className='thsub';th.appendChild(sub);} if(sub.textContent!==lab)sub.textContent=lab;});}finally{busy=false;}}
  function bind(){const a=document.getElementById('pcTblA'),b=document.getElementById('pcTblB'); if(!a||!b||a._pf)return; a._pf=1;
    [a,b].forEach(t=>new MutationObserver(()=>setTimeout(fix,0)).observe(t,{childList:true,subtree:true,characterData:true})); fix();}
  window.addEventListener('load',()=>setTimeout(bind,500)); if(document.readyState==='complete')setTimeout(bind,500);})();
window.t11shiftEnter=enter; window.t11shiftExit=exit; window.t11shiftWalk=()=>{if(ST.on)startTr();};
})();
