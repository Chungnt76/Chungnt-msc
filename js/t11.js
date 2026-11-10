/* ===== Tab Tháng 11 — tracking SO / Active / PC / LPPC (T11 so với T10 & T9) =====
   Dữ liệu: data/T11.js (T11, T11CH, T11_META). Chưa có dữ liệu thì tab hiện khung + cột T9, T10 để đối chiếu. */
(function(){
const D9=24, D10=27;                       // ngày làm việc T9, T10
const S={meat:'a',oo:'all',vip:'all',asm:new Set(),npp:new Set()};
const dash='<span class="fx">—</span>';
const mx=()=>T11_META||{};
const d11=()=>(mx().has_data&&mx().mtd_days>0)?mx().mtd_days:null;
const dTot=()=>mx().days_total||25;
const k3=r=>r.asm+'|'+r.npp+'|'+r.ssn;
const src9=()=>(typeof FULL!=='undefined'&&FULL)?FULL.T9:T9;
const src10=()=>(typeof FULL!=='undefined'&&FULL)?FULL.T10:T10;
let MAPS=null;
function maps(){
  if(MAPS)return MAPS;
  const m9={},m10={},m11={},seen={},list=[];
  src9().forEach(r=>{m9[k3(r)]=r;});
  src10().forEach(r=>{m10[k3(r)]=r;});
  (T11||[]).forEach(r=>{m11[k3(r)]=r;});
  src10().concat(src9(),T11||[]).forEach(r=>{const k=k3(r);if(!seen[k]){seen[k]=1;list.push({asm:r.asm,npp:r.npp,ssn:r.ssn,ss:r.ss||r.ssn,k});}});
  MAPS={m9,m10,m11,list}; return MAPS;
}
const vkey=(oo)=>S.meat+'|'+(oo||S.oo)+(S.vip==='all'?'':'|'+S.vip);
function val(r,oo){const s=r&&r.v&&r.v[vkey(oo)];return s||{so:0,aso:0,pc:0,lines:0};}
function tgt(r){
  if(!r)return 0; if((S.oo!=='all')||S.vip!=='all')return 0;
  const t=r.tgm&&r.tgm['11']; if(t)return (S.meat==='x'?t[1]:t[0])||0;
  return r.target||0;
}
function agg(sel,oo){
  const M=maps(), o={so9:0,a9:0,pc9:0,l9:0,so10:0,a10:0,pc10:0,l10:0,so11:0,a11:0,pc11:0,l11:0,tg:0};
  M.list.forEach(x=>{ if(!sel(x))return;
    const a=val(M.m9[x.k],oo),b=val(M.m10[x.k],oo),c=val(M.m11[x.k],oo);
    o.so9+=a.so;o.a9+=a.aso;o.pc9+=a.pc;o.l9+=a.lines;
    o.so10+=b.so;o.a10+=b.aso;o.pc10+=b.pc;o.l10+=b.lines;
    o.so11+=c.so;o.a11+=c.aso;o.pc11+=c.pc;o.l11+=c.lines;
    o.tg+=tgt(M.m11[x.k]);
  });
  return o;
}
const lp=(pc,l)=>pc?l/pc:null;
const gd=(a,b)=>(a==null||b==null||!b)?dash:`<span style="color:${a>=b?'var(--green)':'var(--accent)'};font-weight:700">${ovSg((a/b-1)*100)}</span>`;
function tien(pct){const d=d11();if(pct==null||d==null)return dash;const idx=pct/(d/dTot()*100)*100;
  return `<span style="color:${idx>=100?C_GREEN:(idx<90?C_ACC:'var(--ink)')};font-weight:700">${idx>=100?'▲':'▼'} ${fp(idx)}</span>`;}
function rowHtml(name,m,o){
  const d=d11(),has=d!=null,s11=has?m.so11/d:null,pct=(has&&m.tg)?m.so11/m.tg*100:null;
  const lvl=o.lvl||0,pad=12+lvl*22,caret=(o.open===null||o.open===undefined)?'<span class="cx leaf">•</span>':`<span class="cx">${o.open?'▾':'▸'}</span>`;
  const at=o.ds?Object.entries(o.ds).map(([k,v])=>`data-${k}="${String(v).replace(/"/g,'&quot;')}"`).join(' '):'';
  return `<tr class="${o.tot?'tot':'lvl'+lvl}" ${at} data-lvl="${lvl}"><td style="padding-left:${o.tot?12:pad}px">${o.tot?'':caret}<span class="nm">${name}</span></td>`+
   `<td>${gFmt(m.so9)}</td><td>${gFmt(m.so10)}</td><td style="font-weight:700">${has?gFmt(m.so11):dash}</td><td>${has?gFmt(s11):dash}</td>`+
   `<td>${has?gd(s11,m.so10/D10):dash}</td><td>${has?gd(s11,m.so9/D9):dash}</td>`+
   `<td>${m.tg?gFmt(m.tg):dash}</td><td>${pct==null?dash:fp(pct)}</td><td>${tien(pct)}</td>`+
   `<td>${fi(m.a9)}</td><td>${fi(m.a10)}</td><td style="font-weight:700">${has?fi(m.a11):dash}</td>`+
   `<td>${fi(m.pc10/D10)}</td><td>${has?fi(m.pc11/d):dash}</td><td>${ovL(lp(m.pc10,m.l10))}</td><td>${has?ovL(lp(m.pc11,m.l11)):dash}</td></tr>`;
}
function tree(){
  const M=maps(); let h='';
  const asms=ASMS.filter(a=>M.list.some(x=>x.asm===a));
  const key=m=>(mx().has_data?m.so11:m.so10);
  asms.map(a=>({a,m:agg(x=>x.asm===a)})).sort((p,q)=>key(q.m)-key(p.m)).forEach(A=>{
    const ao=S.asm.has(A.a); h+=rowHtml(A.a,A.m,{lvl:0,open:ao,ds:{asm:A.a}});
    if(!ao)return;
    [...new Set(M.list.filter(x=>x.asm===A.a).map(x=>x.npp))].map(n=>({n,m:agg(x=>x.asm===A.a&&x.npp===n)})).sort((p,q)=>key(q.m)-key(p.m)).forEach(N=>{
      const no=S.npp.has(A.a+'|'+N.n); h+=rowHtml(N.n,N.m,{lvl:1,open:no,ds:{asm:A.a,npp:N.n}});
      if(!no)return;
      M.list.filter(x=>x.asm===A.a&&x.npp===N.n).map(x=>({x,m:agg(y=>y.k===x.k)})).sort((p,q)=>key(q.m)-key(p.m)).forEach(Z=>{
        h+=rowHtml(Z.x.ss,Z.m,{lvl:2,open:null});});
    });
  });
  return h+rowHtml('Toàn Miền',agg(()=>true),{tot:true});
}
function chanTbl(){
  const d=d11(),has=d!=null;
  let h='<thead><tr><th rowspan="2" style="text-align:left">ASM</th><th colspan="5">Off Premise</th><th colspan="5">On Premise</th></tr><tr>'+
    ['SO T10','SO T11','SO/ngày Δ vs T10','Active T10','Active T11'].map(t=>`<th>${t}</th>`).join('').repeat(2)+'</tr></thead><tbody>';
  const one=(oo,sel)=>{const m=agg(sel,oo);
    return `<td>${gFmt(m.so10)}</td><td style="font-weight:700">${has?gFmt(m.so11):dash}</td><td>${has?gd(m.so11/d,m.so10/D10):dash}</td><td>${fi(m.a10)}</td><td style="font-weight:700">${has?fi(m.a11):dash}</td>`;};
  ASMS.forEach(a=>{const sel=x=>x.asm===a;h+=`<tr><td style="text-align:left;font-weight:600">${a}</td>${one('OFF',sel)}${one('ON',sel)}</tr>`;});
  h+=`<tr class="tot"><td style="text-align:left">Toàn Miền</td>${one('OFF',()=>true)}${one('ON',()=>true)}</tr></tbody>`;
  return h;
}
function render(){
  const el=id=>document.getElementById(id); if(!el('t11Body'))return;
  MAPS=null;
  const d=d11(),has=d!=null,M=agg(()=>true),s11=has?M.so11/d:null;
  el('t11Banner').innerHTML=has?
    `Dữ liệu Tháng 11 đã cập nhật <b>đến ngày ${mx().last_date}</b> (MTD · ${d}/${dTot()} ngày làm việc) — so sánh theo bình quân/ngày làm việc; Tiến độ = %Đạt chia % ngày làm việc đã qua (100 = đúng tiến độ).`:
    `⏳ <b>Chưa có dữ liệu Tháng 11</b> — khung đã dựng sẵn (T11 có ${dTot()} ngày làm việc). Khi có file sell-out T11 (cùng định dạng T10), toàn bộ cột T11 sẽ tự hiện; hiện các cột T9 &amp; T10 để đối chiếu.`;
  const row=(lab,a,b,c,fmt,g)=>`<tr><td style="text-align:left;font-weight:600">${lab}</td><td>${fmt(a)}</td><td>${fmt(b)}</td><td style="font-weight:700">${has?fmt(c):dash}</td><td>${has&&g?gd(c,b):dash}</td><td>${has&&g?gd(c,a):dash}</td></tr>`;
  el('t11CmpTbl').innerHTML=`<thead><tr><th style="text-align:left">Chỉ số toàn Miền</th><th>Tháng 9</th><th>Tháng 10</th><th>Tháng 11</th><th>Δ % T11 vs T10</th><th>Δ % T11 vs T9</th></tr></thead><tbody>`+
    row('SO (tổng tháng)',M.so9,M.so10,M.so11,gFmt,false)+
    row('SO bình quân/ngày',M.so9/D9,M.so10/D10,s11,gFmt,true)+
    row('Active (ASO)',M.a9,M.a10,M.a11,fi,false)+
    row('PC bình quân/ngày',M.pc9/D9,M.pc10/D10,has?M.pc11/d:null,fi,true)+
    row('LPPC',lp(M.pc9,M.l9),lp(M.pc10,M.l10),lp(M.pc11,M.l11),ovL,true)+
    `<tr><td style="text-align:left;font-weight:600">Chỉ tiêu SO / %Đạt / Tiến độ</td><td>—</td><td>—</td><td>${M.tg?gFmt(M.tg)+(has?' · '+fp(M.so11/M.tg*100):''):'—'}</td><td colspan="2">${has&&M.tg?tien(M.so11/M.tg*100):'—'}</td></tr></tbody>`;
  const v9=ASMS.map(a=>agg(x=>x.asm===a).so9/D9),v10=ASMS.map(a=>agg(x=>x.asm===a).so10/D10),v11=ASMS.map(a=>agg(x=>x.asm===a).so11/(d||1));
  const ser=[{name:'T9',color:C_SLATE,values:v9},{name:'T10',color:C_ACC,values:v10}]; if(has)ser.push({name:'T11',color:'#0ea5e9',values:v11});
  const top=Math.max(4e9,Math.ceil(Math.max(...v9,...v10,...(has?v11:[0]))/4e9)*4e9);
  groupedBar(el('t11Chart'),ASMS,ser,{h:290,kv:true,labels:true,max:top,vfmt:v=>(v/1e9).toFixed(2).replace('.',',')});
  legend(el('t11Leg'),ser.map(s=>({c:s.color,t:'SO/ngày '+s.name})));
  el('t11Body').innerHTML=tree();
  el('t11ChTbl').innerHTML=chanTbl();
  ['t11Meat','t11Oo','t11Vip'].forEach(id=>{const k={t11Meat:'meat',t11Oo:'oo',t11Vip:'vip'}[id];[...el(id).children].forEach(b=>b.classList.toggle('on',b.dataset.v===S[k]));});
}
function init(){
  const el=id=>document.getElementById(id); if(!el('t11Body')||el('t11Body')._i)return; el('t11Body')._i=1;
  const seg=(id,k)=>el(id).onclick=e=>{const b=e.target.closest('button');if(!b)return;S[k]=b.dataset.v;render();};
  seg('t11Meat','meat');seg('t11Oo','oo');seg('t11Vip','vip');
  el('t11Ctl').onclick=e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.a==='expand'){maps().list.forEach(x=>{S.asm.add(x.asm);S.npp.add(x.asm+'|'+x.npp);});}else{S.asm.clear();S.npp.clear();} render();};
  el('t11Body').addEventListener('click',e=>{const tr=e.target.closest('tr');if(!tr)return;
    if(tr.dataset.lvl==='0'&&tr.dataset.asm){const k=tr.dataset.asm;S.asm.has(k)?S.asm.delete(k):S.asm.add(k);render();}
    else if(tr.dataset.lvl==='1'){const k=tr.dataset.asm+'|'+tr.dataset.npp;S.npp.has(k)?S.npp.delete(k):S.npp.add(k);render();}});
}
window.renderT11=function(){try{init();render();}catch(e){console.error('T11',e);}};
})();

/* Nút "Tháng 11" trong bộ lọc "Tháng phân tích": bấm = mở tab Tháng 11 (không đổi tháng của các tab khác) */
(function(){
  function sync(){
    const fm=document.getElementById('fMonth'), pg=document.getElementById('pgT11'); if(!fm)return;
    const on=!!(pg&&!pg.hidden);
    [...fm.children].forEach(b=>b.classList.toggle('on',on?b.dataset.m==='11':b.dataset.m===F.month));
  }
  function bind(){
    const fm=document.getElementById('fMonth'); if(!fm||fm._t11)return; fm._t11=1;
    fm.addEventListener('click',e=>{const b=e.target.closest('button');
      if(b&&b.dataset.m==='11'){e.stopImmediatePropagation();e.stopPropagation();
        const n=document.querySelector('#nav2 button[data-k="t11"]'); if(n)n.click(); setTimeout(sync,0);}
      else{ if(b){const pg=document.getElementById('pgT11'); if(pg&&!pg.hidden)setTimeout(()=>{const o=document.querySelector('#nav2 button[data-k="ov"]'); if(o)o.click();},30);} setTimeout(sync,90);}},true);
    const nv=document.getElementById('nav2'); if(nv)nv.addEventListener('click',()=>setTimeout(sync,60));
  }
  window.addEventListener('load',()=>setTimeout(bind,300)); if(document.readyState==='complete')setTimeout(bind,300);
})();
