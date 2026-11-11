/* ===== Tab Tháng 11 — tracking SO / Active / PC / LPPC (T11 so với T10 & T9) =====
   Dữ liệu: data/T11.js (T11, T11CH, T11_META). Chưa có dữ liệu thì tab hiện khung + cột T9, T10 để đối chiếu. */
(function(){
const D9=24, D10=27;                       // ngày làm việc T9, T10
const S={meat:'a',oo:'all',vip:'all',asm:new Set(),npp:new Set()};
const dash='<span class="fx">—</span>';
const mx=()=>T11_META||{};
const d11=()=>(mx().has_data&&mx().mtd_days>0)?mx().mtd_days:null;
const dTot=()=>mx().days_total||25;
const ALIAS={'Võ Minh Huy':'Lê Văn Lực','Mai Văn Khanh':'Phùng Anh Minh'};           // SS đã nghỉ → gộp vào SS nhận
const NGHI=new Set(['Võ Minh Huy','Mai Văn Khanh']);   // SS nghỉ việc từ T11: ẩn dòng, số lịch sử vẫn tính vào tổng NPP/ASM
const MERGE=new Set();   // gộp SS chỉ áp dụng từ T11 (dữ liệu HVT/Combo); lịch sử T9, T10 giữ nguyên
const bn=n=>String(n).replace(' - Chi nhánh','');
const cs=r=>ALIAS[r.ssn]||r.ssn;
const k3=r=>MERGE.has(r.ssn)?(r.asm+'|'+bn(r.npp)+'|'+cs(r)):(r.asm+'|'+r.npp+'|'+r.ssn);
function mrg(a,b){ if(!a)return b; if(!b)return a;
  const o=Object.assign({},a); o.v={}; const ks=new Set(Object.keys(a.v||{}).concat(Object.keys(b.v||{})));
  ks.forEach(k=>{const x=(a.v||{})[k]||{},y=(b.v||{})[k]||{};o.v[k]={};['so','aso','pc','lines','sm'].forEach(f=>{o.v[k][f]=(x[f]||0)+(y[f]||0);});});
  o.target=(a.target||0)+(b.target||0);
  if(a.tgm||b.tgm){o.tgm={};const t1=(a.tgm||{})['11']||[0,0],t2=(b.tgm||{})['11']||[0,0];o.tgm['11']=[t1[0]+t2[0],t1[1]+t2[1]];}
  return o;}
const put=(m,r)=>{const k=k3(r);m[k]=MERGE.has(r.ssn)?mrg(m[k],r):r;};
const src9=()=>window.T11ORIG?T11ORIG.T9:((typeof FULL!=='undefined'&&FULL)?FULL.T9:T9);
const src10=()=>window.T11ORIG?T11ORIG.T10:((typeof FULL!=='undefined'&&FULL)?FULL.T10:T10);
let MAPS=null;
function maps(){
  if(MAPS)return MAPS;
  const m9={},m10={},m11={},seen={},list=[];
  src9().forEach(r=>put(m9,r));
  src10().forEach(r=>put(m10,r));
  (T11||[]).forEach(r=>put(m11,r));
  src10().concat(src9(),T11||[]).forEach(r=>{const k=k3(r);if(!seen[k]){seen[k]=1;const mm=MERGE.has(r.ssn);list.push({asm:r.asm,npp:mm?bn(r.npp):r.npp,ssn:cs(r),ss:mm?cs(r):(r.ss||r.ssn),k});}});
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
      M.list.filter(x=>x.asm===A.a&&x.npp===N.n&&!NGHI.has(x.ssn)&&!NGHI.has(x.ss)).map(x=>({x,m:agg(y=>y.k===x.k)})).sort((p,q)=>key(q.m)-key(p.m)).forEach(Z=>{
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
function avail(){
  const el=document.getElementById('t11Avail'); if(!el)return;
  const card=(l,v,sb,ac)=>`<div class="kpi" style="border-top:3px solid ${ac}"><div class="k-lab" style="color:${ac}">${l}</div><div class="k-val">${v}</div><div class="k-sub">${sb}</div></div>`;
  let h='<div class="panel" style="margin-top:14px;border-top:3px solid #7c5cbf"><div class="tbl-head"><div><h3 style="display:inline;color:#7c5cbf">📌 Số liệu Tháng 11 đã có (MTD)</h3> <span class="pnote" style="display:inline">— SO / Active / PC / LPPC đã cập nhật đến hết 10/11; Hội viên Tết và Combo đã có số</span></div></div><div class="kpis" style="grid-template-columns:repeat(4,1fr)">';
  if(typeof HVT11!=='undefined'){let n=0,d=0,sp=0,ps=0;HVT11.rows.forEach(r=>{n++;if(r[4]>0)ps++;if(r[7]>0)d++;else if(r[6]>0&&r[6]-r[4]<=0.3*r[6])sp++;});
    h+=card('Hội viên Tết · đạt',fi(d),fp(n?d/n*100:0)+' của '+fi(n)+' hội viên · sắp đạt '+fi(sp)+' · phát sinh DS '+fi(ps),'#0369a1');}
  if(typeof COMBO11!=='undefined'){const kh=new Set();let su=0,ng=0;COMBO11.rows.forEach(r=>{kh.add(r[1]);su+=r[6];if(!r[9])ng++;});
    h+=card('Combo · KH đã nhận',fi(kh.size),fi(COMBO11.rows.length)+' đơn · '+fi(su)+' suất','#0ea5e9')+card('Combo ngoài tuyến',fp(ng/COMBO11.rows.length*100),fi(ng)+' đơn','#7c5cbf')+card('Dữ liệu combo đến hết',COMBO11.meta.asof,'ngày công '+COMBO11.meta.wd_passed+'/'+COMBO11.meta.wd_total,'#2e7d5b');}
  h+='</div><div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="t11GoHv" type="button" style="padding:7px 14px;border-radius:8px;border:1px solid var(--line);background:var(--card);cursor:pointer;font-weight:600">🏆 Mở Hội viên Tết</button><button class="btn" id="t11GoCb" type="button" style="padding:7px 14px;border-radius:8px;border:1px solid var(--line);background:var(--card);cursor:pointer;font-weight:600">🎟️ Mở Combo</button></div></div>';
  el.innerHTML=h;
  const go=k=>()=>{const n=document.querySelector('#nav2 button[data-k="'+k+'"]');if(n)n.click();};
  document.getElementById('t11GoHv').onclick=go('hvt'); document.getElementById('t11GoCb').onclick=go('combo');
}
window.renderT11=function(){try{init();render();avail();}catch(e){console.error('T11',e);}};
})();

/* Nút "Tháng 11" trong bộ lọc "Tháng phân tích": T11 = tab Tháng 11 + Hội viên Tết + Combo (không đổi tháng của các tab cũ) */
(function(){
  const IDS=['pgT11','pgHvt','pgCombo'];
  const vis=id=>{const e=document.getElementById(id);return !!(e&&!e.hidden);};
  const onT11=()=>IDS.some(vis);
  function chip(on){
    const c=document.getElementById('v3chips'); if(!c)return;
    c.querySelectorAll('.chip').forEach(e=>{
      if(e.children.length)return; const t=e.textContent;
      if(on&&/^Tháng \d+ · MTD đến \d+\/\d+ \(/.test(t)){e.dataset.orig=t; e.textContent='Tháng 11 · MTD đến hết 10/11 (hội viên) · 09/11 (combo)';}
      else if(!on&&e.dataset.orig){e.textContent=e.dataset.orig; delete e.dataset.orig;}});
  }
  const shiftOn=()=>!!(window.T11SHIFT&&T11SHIFT.on);
  const SUP=['pgOv','pgSoM','pgPc','pgCat','pgR360'];            // tab chạy được chế độ Tháng 11 (dịch khe tháng)
  const NOTE={pgGrow:'Tăng trưởng 10T là lũy kế 10 tháng so cùng kỳ 2025/2024/2023 — chưa có số cùng kỳ T11 nên chưa chạy được Tháng 11. Số T11 xem ở tab Tháng 11.',
    pgApq:'AP Quý 4: đang xem Tháng 11 — SO T11 sell-out MTD đến 10/11 so với chỉ tiêu AP tháng 11 (đổi tháng ở bộ chọn riêng của tab).',pgAp9:'Thực hiện AP 9 tháng — không theo bộ lọc tháng.',pgPlan:'Plan AP Quý 4 — không theo bộ lọc tháng.',pgOn7:'Kênh On 7 loại hình chưa có số T11 (cần file chi tiết loại hình T11).'};
  function banner(){
    let b=document.getElementById('t11Banner2'); const on=shiftOn()||onT11();
    const pg=Object.keys(NOTE).find(k=>vis(k)); const msg=(on&&pg)?NOTE[pg]:'';
    if(!b){if(!msg)return; b=document.createElement('div'); b.id='t11Banner2'; b.className='note'; b.style.cssText='margin:8px 0;padding:10px 14px;border-radius:10px;background:#fff7ed;border:1px solid #fdba74;color:#9a3412;font-size:13px';
      const flt=document.querySelector('.flt'); if(flt)flt.appendChild(b);}
    if(b){b.hidden=!msg; b.textContent=msg;}
  }
  function sync(){
    const fm=document.getElementById('fMonth'); if(!fm)return;
    const on=onT11()||shiftOn();
    [...fm.children].forEach(b=>b.classList.toggle('on',on?b.dataset.m==='11':b.dataset.m===F.month));
    chip(onT11()); banner();
  }
  const navTo=k=>{const n=document.querySelector('#nav2 button[data-k="'+k+'"]'); if(n)n.click();};
  function bind(){
    const fm=document.getElementById('fMonth'); if(!fm||fm._t11)return; fm._t11=1;
    fm.addEventListener('click',e=>{const b=e.target.closest('button'); if(!b)return;
      if(b.dataset.m==='11'){e.stopImmediatePropagation();e.stopPropagation();
        if(onT11()){setTimeout(sync,30);return;}
        if(vis('pgMbs78')){navTo('hvt');setTimeout(sync,60);return;}
        if(SUP.some(vis)){try{t11shiftEnter();}catch(er){console.error(er);} }
        else if(!NOTE_PAGES()){navTo('t11');}
        setTimeout(sync,60);}
      else{ if(shiftOn()){try{t11shiftExit();}catch(er){console.error(er);}}
        if(onT11())setTimeout(()=>navTo('ov'),30); setTimeout(sync,120);}},true);
    const nv=document.getElementById('nav2');
    if(nv){nv.addEventListener('click',e=>{const bt=e.target.closest('button'); if(!bt)return;
        if(bt.dataset.k==='hv'&&(shiftOn()||onT11())){e.stopImmediatePropagation();e.stopPropagation();navTo('hvt');setTimeout(sync,60);return;}
        if(bt.dataset.k==='ap'&&(shiftOn()||onT11()))setTimeout(()=>{const b=document.querySelector('#apqM button[data-m="1"]');if(b)b.click();},150);
        setTimeout(sync,80);},true);
      nv.addEventListener('click',()=>setTimeout(sync,120));}
    const ch=document.getElementById('v3chips'); if(ch)new MutationObserver(()=>{if(onT11())chip(true);}).observe(ch,{childList:true,subtree:true,characterData:true});
  }
  const NOTE_PAGES=()=>Object.keys(NOTE).some(vis);
  window.addEventListener('load',()=>setTimeout(bind,300)); if(document.readyState==='complete')setTimeout(bind,300);
})();

/* Ẩn nút "Tháng 11" ở thanh tab trên cùng (vẫn mở được bằng nút Tháng 11 ở bộ lọc "Tháng phân tích") */
(function(){const st=document.createElement('style');st.textContent='#nav2 button[data-k="t11"]{display:none!important}';document.head.appendChild(st);})();
