/* ===== 2 tab Tháng 11: HỘI VIÊN THƯỞNG (data/HVT11.js) và COMBO (data/COMBO11.js) =====
   Chỉ đọc dữ liệu của 2 file trên; không đụng dữ liệu / mã của các tab cũ. */
(function(){
const dash='<span class="fx">—</span>', TD='<span class="fx" title="Thiếu dữ liệu" style="font-size:10.5px">Thiếu dữ liệu</span>';
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const ASM_ALL=()=>ASMS.concat(['Chưa gán SS']);
const fmtM=n=>gFmt(n||0);
/* ---- cây ASM → NPP → SS → ĐDKD dùng chung ---- */
function buildTree(SR){
  const T=new Map();
  SR.forEach((s,i)=>{const[a,n,ss]=[s[2],s[3],s[4]];
    if(!T.has(a))T.set(a,new Map()); const A=T.get(a); if(!A.has(n))A.set(n,new Map()); const N=A.get(n); if(!N.has(ss))N.set(ss,[]); N.get(ss).push(i);});
  return T;
}
const leaves=(x)=>x instanceof Map?[...x.values()].flatMap(leaves):x;
const sortKeys=(map,keyFn)=>[...map.keys()];
/* ===================== HỘI VIÊN THƯỞNG ===================== */
const H={type:'all',asm:'all',open:{a:new Set(),n:new Set(),s:new Set()},tree:null,acc:null,sap:0.3};
function hvAcc(){
  const SR=HVT11.sr, acc=SR.map(()=>({n:0,dat:0,sap:0,thieu:0,pend:0,base:0,rw:0,pr:0,chua:0}));
  HVT11.rows.forEach(r=>{
    if(H.type!=='all'&&String(r[3])!==H.type)return;
    const a=acc[r[0]],pend=r[4],base=r[6],dat=r[7]>0,thieu=Math.max(0,base-pend);
    a.n++; a.pend+=pend; a.base+=base; a.rw+=r[9]; a.pr+=r[8]; a.thieu+=dat?0:thieu;
    if(dat)a.dat++; else {a.chua++; if(base>0&&thieu<=H.sap*base)a.sap++;}
  });
  return acc;
}
const hvSum=(idxs)=>{const o={n:0,dat:0,sap:0,thieu:0,pend:0,base:0,rw:0,pr:0,chua:0};idxs.forEach(i=>{const a=H.acc[i];for(const k in o)o[k]+=a[k];});return o;};
function hvRow(name,m,o){
  const lvl=o.lvl||0,pad=12+lvl*22,caret=(o.open==null)?'<span class="cx leaf">•</span>':`<span class="cx">${o.open?'▾':'▸'}</span>`;
  const at=o.ds?Object.entries(o.ds).map(([k,v])=>`data-${k}="${esc(v)}"`).join(' '):'';
  const p=m.n?m.dat/m.n*100:null;
  return `<tr class="${o.tot?'tot':'lvl'+lvl}" ${at} data-lvl="${lvl}"><td style="padding-left:${o.tot?12:pad}px">${o.tot?'':caret}<span class="nm">${esc(name)}</span></td>`+
   `<td>${o.rank?o.rank:''}</td><td>${fi(m.n)}</td><td style="font-weight:700">${fi(m.dat)}</td><td>${p==null?dash:fp(p)}</td><td>${fi(m.chua)}</td><td>${fi(m.sap)}</td><td>${m.thieu?fmtM(m.thieu):dash}</td><td>${fmtM(m.pend)}</td><td>${m.rw?fmtM(m.rw):dash}</td></tr>`;
}
function hvTable(){
  const T=H.tree; let h=''; const rankOf=(arr)=>arr.sort((x,y)=>(y.m.dat/(y.m.n||1))-(x.m.dat/(x.m.n||1))||y.m.dat-x.m.dat);
  const asmList=ASM_ALL().filter(a=>T.has(a)&&(H.asm==='all'||H.asm===a));
  const A=asmList.map(a=>({k:a,m:hvSum(leaves(T.get(a)))})).filter(x=>x.m.n>0); rankOf(A); A.sort((x,y)=>(x.k==='Chưa gán SS')-(y.k==='Chưa gán SS'));
  A.forEach((x,ai)=>{const ao=H.open.a.has(x.k); h+=hvRow(x.k,x.m,{lvl:0,open:ao,ds:{a:x.k},rank:x.k==='Chưa gán SS'?'':ai+1}); if(!ao)return;
    const N=[...T.get(x.k).keys()].map(n=>({k:n,m:hvSum(leaves(T.get(x.k).get(n)))})).filter(y=>y.m.n>0); rankOf(N);
    N.forEach((y,ni)=>{const no=H.open.n.has(x.k+'|'+y.k); h+=hvRow(y.k,y.m,{lvl:1,open:no,ds:{a:x.k,n:y.k},rank:ni+1}); if(!no)return;
      const S=[...T.get(x.k).get(y.k).keys()].map(s=>({k:s,m:hvSum(leaves(T.get(x.k).get(y.k).get(s)))})).filter(z=>z.m.n>0); rankOf(S);
      S.forEach((z,si)=>{const so=H.open.s.has(x.k+'|'+y.k+'|'+z.k); h+=hvRow(z.k,z.m,{lvl:2,open:so,ds:{a:x.k,n:y.k,s:z.k},rank:si+1}); if(!so)return;
        const D=T.get(x.k).get(y.k).get(z.k).map(i=>({i,m:hvSum([i])})).filter(d=>d.m.n>0); rankOf(D);
        D.forEach((d,di)=>{h+=hvRow(HVT11.sr[d.i][1],d.m,{lvl:3,open:null,rank:di+1});});});});});
  const tot=hvSum(A.flatMap(x=>leaves(T.get(x.k))));
  return h+hvRow('Toàn Miền'+(H.asm==='all'?'':' (theo bộ lọc)'),tot,{tot:true});
}
function hvCards(){
  const SR=HVT11.sr, scope=i=>H.asm==='all'||SR[i][2]===H.asm;
  const g={all:{n:0,dat:0,thieu:0,sap:0},0:{n:0,dat:0,thieu:0,sap:0},1:{n:0,dat:0,thieu:0,sap:0}};
  HVT11.rows.forEach(r=>{if(!scope(r[0]))return; const dat=r[7]>0,th=Math.max(0,r[6]-r[4]);
    [g.all,g[r[3]]].forEach(o=>{o.n++; if(dat)o.dat++; else{o.thieu+=th; if(r[6]>0&&th<=H.sap*r[6])o.sap++;}});});
  const card=(lab,val,sub,ac)=>`<div class="kpi" style="border-top:3px solid ${ac}"><div class="k-lab" style="color:${ac}">${lab}</div><div class="k-val">${val}</div><div class="k-sub">${sub}</div></div>`;
  const grp=(title,o,ac)=>`<div style="margin-top:12px"><b style="color:${ac}">${title}</b></div><div class="kpis" style="grid-template-columns:repeat(4,1fr)">`+
    card('Tổng hội viên',fi(o.n),'KH trong danh sách',ac)+card('Đã đạt thưởng',fi(o.dat),(o.n?fp(o.dat/o.n*100):'—')+' tổng hội viên',ac)+
    card('Chưa đạt',fi(o.n-o.dat),'trong đó sắp đạt: '+fi(o.sap),ac)+card('Còn thiếu đến nền',fmtM(o.thieu),'KH chưa đạt · Σ max(0, nền − DS)',ac)+'</div>';
  document.getElementById('hvtCards').innerHTML=grp('Tất cả hội viên',g.all,'#0369a1')+grp('VIP',g[0],'#0ea5e9')+grp('VIP đại sứ',g[1],'#7c5cbf');
}
function hvList(){
  const SR=HVT11.sr, L=[];
  HVT11.rows.forEach(r=>{ if(H.asm!=='all'&&SR[r[0]][2]!==H.asm)return; if(H.type!=='all'&&String(r[3])!==H.type)return;
    if(r[7]>0||r[6]<=0)return; const th=Math.max(0,r[6]-r[4]); if(th<=H.sap*r[6])L.push([th,r]);});
  L.sort((a,b)=>a[0]-b[0]||b[1][4]-a[1][4]);
  const top=L.slice(0,100);
  document.getElementById('hvtListN').textContent=fi(L.length)+' KH sắp đạt (hiển thị 100 KH thiếu ít nhất)';
  document.getElementById('hvtList').innerHTML=top.map(([th,r],i)=>{const s=SR[r[0]];
    return `<tr><td>${i+1}</td><td style="text-align:left">${esc(s[1])}</td><td style="text-align:left">${esc(s[4])}</td><td style="text-align:left">${esc(s[3])}</td><td style="text-align:left">${esc(s[2])}</td><td style="text-align:left">${esc(r[2])} <span class="kv">· ${esc(r[1])}</span></td><td>${r[3]?'VIP đại sứ':'VIP'}</td><td>${fmtM(r[4])}</td><td>${fmtM(r[6])}</td><td style="font-weight:700;color:var(--accent)">${th?fmtM(th):'Đủ nền'}</td><td>${fp(r[4]/r[6]*100)}</td></tr>`;}).join('')||'<tr><td colspan="11">Không có KH thỏa điều kiện</td></tr>';
}
function hvRender(){
  if(!document.getElementById('hvtBody'))return;
  H.acc=hvAcc();
  const m=HVT11.meta;
  document.getElementById('hvtWarn').innerHTML=`⚠ <b>Ngày cắt dữ liệu: chưa rõ</b> — file hội viên không ghi ngày (xuất cùng lúc file Combo, dữ liệu đến 09/11 — chưa xác nhận). ${m.unmapped_sr?`<b>${m.unmapped_sr} SR mới</b> chưa có trong dữ liệu T10 nên xếp ở dòng "Chưa gán SS" (không xếp hạng).`:''}`;
  hvCards();
  document.getElementById('hvtBody').innerHTML=hvTable();
  hvList();
  [['hvtType','type'],['hvtAsm','asm']].forEach(([id,k])=>[...document.getElementById(id).children].forEach(b=>b.classList.toggle('on',b.dataset.v===H[k])));
}
function hvInit(){
  const el=id=>document.getElementById(id); if(!el('hvtBody')||el('hvtBody')._i)return; el('hvtBody')._i=1;
  H.tree=buildTree(HVT11.sr);
  el('hvtAsm').innerHTML='<button data-v="all" class="on">Cả miền</button>'+ASMS.map(a=>`<button data-v="${esc(a)}">${esc(a)}</button>`).join('');
  el('hvtType').onclick=e=>{const b=e.target.closest('button');if(b){H.type=b.dataset.v;hvRender();}};
  el('hvtAsm').onclick=e=>{const b=e.target.closest('button');if(b){H.asm=b.dataset.v;hvRender();}};
  el('hvtCtl').onclick=e=>{const b=e.target.closest('button');if(!b)return; const T=H.tree;
    if(b.dataset.a==='expand'){T.forEach((A,a)=>{H.open.a.add(a);A.forEach((N,n)=>{H.open.n.add(a+'|'+n);});});} else{H.open.a.clear();H.open.n.clear();H.open.s.clear();} hvRender();};
  el('hvtBody').addEventListener('click',e=>{const tr=e.target.closest('tr');if(!tr)return; const d=tr.dataset,l=d.lvl;
    const tg=(set,k)=>set.has(k)?set.delete(k):set.add(k);
    if(l==='0'&&d.a)tg(H.open.a,d.a); else if(l==='1')tg(H.open.n,d.a+'|'+d.n); else if(l==='2')tg(H.open.s,d.a+'|'+d.n+'|'+d.s); else return; hvRender();});
}
window.renderHvt=function(){try{hvInit();hvRender();}catch(e){console.error('HVT',e);}};

/* ===================== COMBO ===================== */
const C={grp:'all',asm:'all',open:{a:new Set(),n:new Set(),s:new Set()},tree:null,acc:null};
const cmb=()=>COMBO11.meta;
function cbAcc(){
  const SR=COMBO11.sr, acc=SR.map(()=>({don:0,suat:0,kh:new Set(),amt:0,ngoai:0,days:new Map()}));
  COMBO11.rows.forEach(r=>{ if(C.grp!=='all'&&String(r[3])!==C.grp)return;
    const a=acc[r[0]]; a.don++; a.suat+=r[6]; a.kh.add(r[1]); a.amt+=r[8]; if(!r[9])a.ngoai++;
    if(!a.days.has(r[5]))a.days.set(r[5],new Set()); a.days.get(r[5]).add(r[1]); });
  return acc;
}
function cbSum(idxs){
  const o={don:0,suat:0,kh:new Set(),amt:0,ngoai:0,days:new Map()};
  idxs.forEach(i=>{const a=C.acc[i]; o.don+=a.don;o.suat+=a.suat;o.amt+=a.amt;o.ngoai+=a.ngoai; a.kh.forEach(k=>o.kh.add(k));
    a.days.forEach((s,d)=>{if(!o.days.has(d))o.days.set(d,new Set()); s.forEach(k=>o.days.get(d).add(k));});});
  return o;
}
function cell(m,d){
  const M=cmb(), n=m.days.has(d)?m.days.get(d).size:0, sun=M.sundays.includes(d);
  if(d>M.asof_day)return `<td style="background:var(--bg,#f1f5f9);color:#94a3b8">·</td>`;
  if(n>0)return `<td style="background:#d1fae5;color:#065f46;font-weight:700">${n}</td>`;
  if(sun)return `<td style="background:#f1f5f9;color:#94a3b8" title="Chủ nhật">CN</td>`;
  return `<td style="background:#fee2e2;color:#b91c1c;font-weight:700">0</td>`;
}
function cbRows(kind){
  const T=C.tree,M=cmb(); let h='';
  const one=(name,m,o)=>{
    const lvl=o.lvl||0,pad=12+lvl*22,caret=(o.open==null)?'<span class="cx leaf">•</span>':`<span class="cx">${o.open?'▾':'▸'}</span>`;
    const at=o.ds?Object.entries(o.ds).map(([k,v])=>`data-${k}="${esc(v)}"`).join(' '):'';
    let body;
    if(kind==='mx'){body=''; for(let d=1;d<=M.cal_days;d++)body+=cell(m,d); body+=`<td style="font-weight:700">${fi(m.kh.size)}</td>`;}
    else{body=`<td style="font-weight:700">${fi(m.kh.size)}</td><td>${fi(m.don)}</td><td>${fi(m.suat)}</td><td>${fmtM(m.amt)}</td><td>${fi(m.ngoai)}${m.don?' · '+fp(m.ngoai/m.don*100):''}</td><td>${TD}</td><td>${TD}</td><td>${TD}</td><td>${TD}</td>`;}
    return `<tr class="${o.tot?'tot':'lvl'+lvl}" ${at} data-lvl="${lvl}"><td style="padding-left:${o.tot?12:pad}px;text-align:left;white-space:nowrap">${o.tot?'':caret}<span class="nm">${esc(name)}</span></td>${body}</tr>`;};
  const asmList=ASM_ALL().filter(a=>T.has(a)&&(C.asm==='all'||C.asm===a));
  const A=asmList.map(a=>({k:a,m:cbSum(leaves(T.get(a)))})).filter(x=>x.m.don>0).sort((p,q)=>q.m.kh.size-p.m.kh.size);
  A.forEach(x=>{const ao=C.open.a.has(x.k); h+=one(x.k,x.m,{lvl:0,open:ao,ds:{a:x.k}}); if(!ao)return;
    const N=[...T.get(x.k).keys()].map(n=>({k:n,m:cbSum(leaves(T.get(x.k).get(n)))})).filter(y=>y.m.don>0).sort((p,q)=>q.m.kh.size-p.m.kh.size);
    N.forEach(y=>{const no=C.open.n.has(x.k+'|'+y.k); h+=one(y.k,y.m,{lvl:1,open:no,ds:{a:x.k,n:y.k}}); if(!no)return;
      const S=[...T.get(x.k).get(y.k).keys()].map(s=>({k:s,m:cbSum(leaves(T.get(x.k).get(y.k).get(s)))})).filter(z=>z.m.don>0).sort((p,q)=>q.m.kh.size-p.m.kh.size);
      S.forEach(z=>{const so=C.open.s.has(x.k+'|'+y.k+'|'+z.k); h+=one(z.k,z.m,{lvl:2,open:so,ds:{a:x.k,n:y.k,s:z.k}}); if(!so)return;
        T.get(x.k).get(y.k).get(z.k).map(i=>({i,m:cbSum([i])})).filter(d=>d.m.don>0).sort((p,q)=>q.m.kh.size-p.m.kh.size).forEach(d=>{h+=one(COMBO11.sr[d.i][1],d.m,{lvl:3,open:null});});});});});
  const tot=cbSum(A.flatMap(x=>leaves(T.get(x.k))));
  return h+one('Toàn Miền'+(C.asm==='all'?'':' (theo bộ lọc)'),tot,{tot:true});
}
function cbCards(){
  const SR=COMBO11.sr, scope=i=>C.asm==='all'||SR[i][2]===C.asm, names=cmb().groups;
  const agg=g=>{const o={don:0,suat:0,kh:new Set(),amt:0};COMBO11.rows.forEach(r=>{if(!scope(r[0]))return;if(g!=='all'&&r[3]!==g)return;o.don++;o.suat+=r[6];o.kh.add(r[1]);o.amt+=r[8];});return o;};
  const card=(lab,val,sub,ac)=>`<div class="kpi" style="border-top:3px solid ${ac}"><div class="k-lab" style="color:${ac}">${lab}</div><div class="k-val">${val}</div><div class="k-sub">${sub}</div></div>`;
  const grp=(t,o,ac)=>`<div style="margin-top:12px"><b style="color:${ac}">${t}</b></div><div class="kpis" style="grid-template-columns:repeat(4,1fr)">`+card('Số đơn combo',fi(o.don),'KH × ngày × chương trình',ac)+card('Số suất',fi(o.suat),'Σ SumQTY_REWARD',ac)+card('KH đã nhận combo',fi(o.kh.size),'KH duy nhất',ac)+card('DS hàng combo',fmtM(o.amt),'Σ RETAILER_AMOUNT (chưa gồm DS nhóm KH ngoài combo)',ac)+'</div>';
  document.getElementById('cbCards').innerHTML=grp('Tất cả combo',agg('all'),'#0369a1')+grp('KH combo OFF',agg(0),'#0ea5e9')+grp('KH combo ON',agg(1),'#7c5cbf')+grp('KH combo Nhà hàng',agg(2),'#2e7d5b');
}
function cbStale(){
  const SR=COMBO11.sr,M=cmb(),la=new Map(),ln=new Map();
  COMBO11.rows.forEach(r=>{const s=SR[r[0]]; la.set(s[2],Math.max(la.get(s[2])||0,r[5])); const k=s[2]+' › '+s[3]; ln.set(k,Math.max(ln.get(k)||0,r[5]));});
  const sa=[...la].filter(([k,d])=>d<M.asof_day&&k!=='Chưa gán SS'), sn=[...ln].filter(([k,d])=>d<M.asof_day&&!k.startsWith('Chưa gán'));
  return {sa,sn};
}
function cbRender(){
  if(!document.getElementById('cbBody'))return;
  const M=cmb(); C.acc=cbAcc();
  const st=cbStale(), pct=M.wd_passed/M.wd_total*100;
  let w=`Dữ liệu combo <b>đến hết ngày ${M.asof}</b> (ngày công ${M.wd_passed}/${M.wd_total} = tiến độ thời gian ${fp(pct)}) · ${COMBO11.promos.length} chương trình đang chạy. `+
    `<b>${COMBO11.sr.filter(s=>s[2]==='Chưa gán SS').length} SR mới</b> chưa có trong dữ liệu T10 nằm ở dòng "Chưa gán SS". `;
  if(st.sa.length)w+=`<br>⚠ <b>ASM dữ liệu dừng sớm hơn</b> (không so sánh như đủ dữ liệu): ${st.sa.map(([k,d])=>esc(k)+' (đến '+d+'/11)').join(', ')}.`;
  if(st.sn.length)w+=`<br>⚠ NPP có đơn combo cuối cùng trước ${M.asof}: ${st.sn.map(([k,d])=>esc(k)+' ('+d+'/11)').join('; ')}.`;
  document.getElementById('cbWarn').innerHTML=w;
  cbCards();
  document.getElementById('cbMxHead').innerHTML='<tr><th style="text-align:left">ASM → NPP → SS → ĐDKD</th>'+Array.from({length:M.cal_days},(_,i)=>`<th style="min-width:30px;padding:6px 3px">${i+1}</th>`).join('')+'<th>KH nhận</th></tr>';
  document.getElementById('cbMx').innerHTML=cbRows('mx');
  document.getElementById('cbBody').innerHTML=cbRows('tb');
  document.getElementById('cbPromos').innerHTML=COMBO11.promos.map(p=>`<tr><td>${esc(p[1])}</td><td style="text-align:left;white-space:normal">${esc(p[2])}</td><td>${p[3]} – ${p[4]}</td></tr>`).join('');
  [['cbGrp','grp'],['cbAsm','asm']].forEach(([id,k])=>[...document.getElementById(id).children].forEach(b=>b.classList.toggle('on',b.dataset.v===C[k])));
}
function cbInit(){
  const el=id=>document.getElementById(id); if(!el('cbBody')||el('cbBody')._i)return; el('cbBody')._i=1;
  C.tree=buildTree(COMBO11.sr);
  el('cbAsm').innerHTML='<button data-v="all" class="on">Cả miền</button>'+ASMS.map(a=>`<button data-v="${esc(a)}">${esc(a)}</button>`).join('');
  el('cbGrp').onclick=e=>{const b=e.target.closest('button');if(b){C.grp=b.dataset.v==='all'?'all':+b.dataset.v;cbRender();}};
  el('cbAsm').onclick=e=>{const b=e.target.closest('button');if(b){C.asm=b.dataset.v;cbRender();}};
  el('cbCtl').onclick=e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.a==='expand'){C.tree.forEach((A,a)=>{C.open.a.add(a);A.forEach((N,n)=>{C.open.n.add(a+'|'+n);});});} else{C.open.a.clear();C.open.n.clear();C.open.s.clear();} cbRender();};
  const clk=e=>{const tr=e.target.closest('tr');if(!tr)return; const d=tr.dataset,l=d.lvl; const tg=(set,k)=>set.has(k)?set.delete(k):set.add(k);
    if(l==='0'&&d.a)tg(C.open.a,d.a); else if(l==='1')tg(C.open.n,d.a+'|'+d.n); else if(l==='2')tg(C.open.s,d.a+'|'+d.n+'|'+d.s); else return; cbRender();};
  el('cbBody').addEventListener('click',clk); el('cbMx').addEventListener('click',clk);
}
window.renderCombo=function(){try{cbInit();cbRender();}catch(e){console.error('COMBO',e);}};
})();
