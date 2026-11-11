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
const NV2_BRAND=150000, NV2_TOTAL=500000, BR=['Chanté','Chinsu','Kokomi','Nam Ngư'];
/* 1 dòng KH → các chỉ số theo chương trình T11: NV1 = DS ≥ 95% chỉ tiêu nền; NV2 = Đại sứ: đủ 4 nhãn ≥150k · VIP: 500k từ 4 nhãn */
function kh(r){
  const base=r[6], ds=r[5], b=[r[10],r[11],r[12],r[13]], t=r[3], pct=base?ds/base:0;
  const m1=pct>=0.95, m2=pct>=1, m3=pct>=1.05, sum4=b[0]+b[1]+b[2]+b[3];
  const nv2=t===1?b.every(x=>x>=NV2_BRAND):sum4>=NV2_TOTAL, ok=m1&&nv2, rate=m3?0.02:m2?0.015:m1?0.012:0;
  return {base,ds,b,t,pct,m1,m2,m3,nv2,ok,sum4,vc:r[14],ps:ds>0,thuong:ok?ds*rate:0,mi105:Math.max(0,1.05*base-ds),dai4:t===1&&nv2};
}
const emptyAcc=()=>({n:0,ps:0,base:0,ds:0,mi:0,m1:0,m2:0,m3:0,dai4:0,ok:0,vc:[0,0,0,0],nv1:0,nv2:0,nv1x:0,th:0,dsx:0});
function addKh(a,k){
  a.n++; if(k.ps)a.ps++; a.base+=k.base; a.ds+=k.ds; a.mi+=k.mi105; if(k.m1)a.m1++; if(k.m2)a.m2++; if(k.m3)a.m3++; if(k.dai4)a.dai4++; if(k.ok)a.ok++;
  a.vc[k.vc]++; if(k.m1)a.nv1++; if(k.nv2)a.nv2++; if(k.m1&&!k.nv2){a.nv1x++;a.dsx+=k.ds;} a.th+=k.thuong;}
function hvAcc(){
  const SR=HVT11.sr, acc=SR.map(emptyAcc);
  HVT11.rows.forEach(r=>{ if(H.type!=='all'&&String(r[3])!==H.type)return; addKh(acc[r[0]],kh(r)); });
  return acc;
}
const hvSum=(idxs)=>{const o=emptyAcc();idxs.forEach(i=>{const a=H.acc[i];for(const k in o){if(k==='vc')a.vc.forEach((v,j)=>o.vc[j]+=v);else o[k]+=a[k];}});return o;};
const Tr=v=>v?gFmt(v):dash, pc=(a,b)=>b?fp(a/b*100):dash;
function pctCell(v){return v==null?dash:`<span style="font-weight:700;color:${v>=100?'var(--green)':(v>=95?'#0369a1':(v<60?'var(--accent)':'var(--ink)'))}">${fp(v)}</span>`;}
function hvRow(name,m,o){
  const lvl=o.lvl||0,pad=12+lvl*22,caret=(o.open==null)?'<span class="cx leaf">•</span>':`<span class="cx">${o.open?'▾':'▸'}</span>`;
  const at=o.ds?Object.entries(o.ds).map(([k,v])=>`data-${k}="${esc(v)}"`).join(' '):'';
  const th=m.th?fi(Math.round(m.th)):dash;
  return `<tr class="${o.tot?'tot':'lvl'+lvl}" ${at} data-lvl="${lvl}"><td style="padding-left:${o.tot?12:pad}px">${o.tot?'':caret}<span class="nm">${esc(name)}</span></td>`+
   `<td>${fi(m.n)}</td><td style="font-weight:700">${fi(m.ps)}</td><td>${pc(m.ps,m.n)}</td>`+
   `<td>${Tr(m.base)}</td><td style="font-weight:700">${Tr(m.ds)}</td><td>${pctCell(m.base?m.ds/m.base*100:null)}</td><td>${Tr(m.mi)}</td>`+
   `<td>${fi(m.m1)}</td><td>${fi(m.m2)}</td><td>${fi(m.m3)}</td>`+
   `<td>${fi(m.dai4)}</td><td style="font-weight:800;color:#0f172a">${fi(m.ok)}</td>`+
   `<td>${fi(m.vc[1])}</td><td>${fi(m.vc[2])}</td><td>${fi(m.vc[3])}</td><td>${fi(m.vc[0])}</td>`+
   `<td>${fi(m.nv1)}</td><td>${fi(m.nv2)}</td><td style="font-weight:700;color:${m.nv1x?'var(--accent)':'inherit'}">${fi(m.nv1x)}</td><td>${th}</td></tr>`;
}
function hvTable(){
  const T=H.tree; let h=''; const rankOf=(arr)=>arr.sort((x,y)=>(y.m.base?y.m.ds/y.m.base:0)-(x.m.base?x.m.ds/x.m.base:0));
  const asmList=ASM_ALL().filter(a=>T.has(a)&&(H.asm==='all'||H.asm===a));
  const A=asmList.map(a=>({k:a,m:hvSum(leaves(T.get(a)))})).filter(x=>x.m.n>0); rankOf(A); A.sort((x,y)=>(x.k==='Chưa gán SS')-(y.k==='Chưa gán SS'));
  A.forEach(x=>{const ao=H.open.a.has(x.k); h+=hvRow(x.k,x.m,{lvl:0,open:ao,ds:{a:x.k}}); if(!ao)return;
    const N=[...T.get(x.k).keys()].map(n=>({k:n,m:hvSum(leaves(T.get(x.k).get(n)))})).filter(y=>y.m.n>0); rankOf(N);
    N.forEach(y=>{const no=H.open.n.has(x.k+'|'+y.k); h+=hvRow(y.k,y.m,{lvl:1,open:no,ds:{a:x.k,n:y.k}}); if(!no)return;
      const S=[...T.get(x.k).get(y.k).keys()].map(s=>({k:s,m:hvSum(leaves(T.get(x.k).get(y.k).get(s)))})).filter(z=>z.m.n>0); rankOf(S);
      S.forEach(z=>{const so=H.open.s.has(x.k+'|'+y.k+'|'+z.k); h+=hvRow(z.k,z.m,{lvl:2,open:so,ds:{a:x.k,n:y.k,s:z.k}}); if(!so)return;
        const D=T.get(x.k).get(y.k).get(z.k).map(i=>({i,m:hvSum([i])})).filter(d=>d.m.n>0); rankOf(D);
        D.forEach(d=>{h+=hvRow(HVT11.sr[d.i][1],d.m,{lvl:3,open:null});});});});});
  const tot=hvSum(A.flatMap(x=>leaves(T.get(x.k))));
  return h+hvRow('Toàn Miền'+(H.asm==='all'?'':' (theo bộ lọc)'),tot,{tot:true});
}
/* thẻ KPI theo mẫu "Hội viên doanh nhân": Tất cả · Brand VIP · VIP Đại sứ */
function hvCards(){
  const SR=HVT11.sr, scope=i=>H.asm==='all'||SR[i][2]===H.asm;
  const g={all:emptyAcc(),0:emptyAcc(),1:emptyAcc()};
  HVT11.rows.forEach(r=>{if(!scope(r[0]))return; const k=kh(r); addKh(g.all,k); addKh(g[r[3]],k);});
  const card=(lab,val,sub,ac,bar)=>`<div class="kpi" style="border-top:3px solid ${ac}"><div class="k-lab">${lab}</div><div class="k-val" style="color:${ac}">${val}</div>${bar!=null?`<div style="height:5px;border-radius:99px;background:#e2e8f0;margin:4px 0"><div style="height:5px;border-radius:99px;background:${ac};width:${Math.min(100,bar)}%"></div></div>`:''}<div class="k-sub">${sub}</div></div>`;
  const grp=(title,o,ac,nv2lab)=>`<div style="margin:14px 0 6px;display:flex;align-items:center;gap:8px"><span style="background:${ac};color:#fff;border-radius:6px;padding:2px 8px;font-size:11px;font-weight:700">★</span><b style="color:#334155;letter-spacing:.4px">${title} · ${fi(o.n)} KH</b></div><div class="kpis" style="grid-template-columns:repeat(5,1fr)">`+
    card('Số KH · đã mua',fi(o.n),`Đã mua ${fi(o.ps)} (${pc(o.ps,o.n)}) · chưa mua ${fi(o.n-o.ps)}`,'#2563eb')+
    card('Doanh số / chỉ tiêu nền',o.base?fp(o.ds/o.base*100):'—',`${Tr(o.ds)} / ${Tr(o.base)} · mục tiêu Mức 3 (105%): ${Tr(o.base*1.05)}`,'#d97706',o.base?o.ds/o.base*100:0)+
    card('NV1 · KH đạt ≥95% chỉ tiêu nền',fi(o.m1),`Mức 2 (≥100%): ${fi(o.m2)} · Mức 3 (≥105%): ${fi(o.m3)}`,'#dc2626')+
    card('NV2 · '+nv2lab,fi(o.nv2)+' / '+fi(o.n),`KH đủ điều kiện thưởng (NV1 + NV2): <b>${fi(o.ok)}</b>`,'#7c3aed')+
    card('Đạt NV1 – chưa đạt NV2',fi(o.nv1x),`DS đã đạt nền nhưng chưa được thưởng: ${Tr(o.dsx)}`,'#e11d48')+'</div>';
  document.getElementById('hvtCards').innerHTML=grp('TẤT CẢ HỘI VIÊN',g.all,'#0369a1','đủ nhãn trọng điểm')+grp('BRAND VIP',g[0],'#2563eb','đủ 500k từ 4 nhãn')+grp('VIP ĐẠI SỨ',g[1],'#ea580c','đủ 4 nhãn ≥150k');
  return g;
}
/* bảng: KH đạt NV1 (doanh số) nhưng chưa đạt NV2 (4 nhãn) — tách VIP / VIP đại sứ */
function hvNv(g){
  const SR=HVT11.sr, scope=i=>H.asm==='all'||SR[i][2]===H.asm;
  const mk=()=>({n:0,nv1:0,nv2:0,ok:0,x:0,y:0,z:0,miss:[0,0,0,0],gap:0,dsx:0});
  const o={0:mk(),1:mk()};
  HVT11.rows.forEach(r=>{if(!scope(r[0]))return; const k=kh(r),a=o[r[3]]; a.n++; if(k.m1)a.nv1++; if(k.nv2)a.nv2++; if(k.ok)a.ok++;
    if(k.m1&&!k.nv2){a.x++;a.dsx+=k.ds; if(r[3]===1)k.b.forEach((v,i)=>{if(v<NV2_BRAND)a.miss[i]++;}); else a.gap+=Math.max(0,NV2_TOTAL-k.sum4);}
    else if(!k.m1&&k.nv2)a.y++; else if(!k.m1&&!k.nv2)a.z++;});
  const row=(lab,a,cls,vip)=>`<tr class="${cls||''}"><td style="text-align:left;font-weight:700">${lab}</td><td>${fi(a.n)}</td><td>${fi(a.nv1)}</td><td>${fi(a.nv2)}</td><td style="font-weight:800">${fi(a.ok)}</td><td style="font-weight:800;color:var(--accent)">${fi(a.x)}</td><td>${a.nv1?fp(a.x/a.nv1*100):dash}</td><td>${fi(a.y)}</td><td>${fi(a.z)}</td>`+
    (vip===1?a.miss.map(v=>`<td>${fi(v)}</td>`).join('')+'<td>'+dash+'</td>':(vip===0?`<td>${dash}</td><td>${dash}</td><td>${dash}</td><td>${dash}</td><td>${a.gap?gFmt(a.gap):dash}</td>`:`<td colspan="5">${dash}</td>`))+`<td>${Tr(a.dsx)}</td></tr>`;
  const tot=mk(); [0,1].forEach(t=>{for(const k in tot){if(k==='miss')continue;tot[k]+=o[t][k];}});
  document.getElementById('hvtNvBody').innerHTML=row('VIP (Brand VIP)',o[0],'',0)+row('VIP Đại sứ',o[1],'',1)+row('Tổng',tot,'tot',2);
}
/* danh sách KH đạt NV1 nhưng chưa NV2 (hành động: bổ sung nhãn) */
function hvNvList(){
  const SR=HVT11.sr, L=[];
  HVT11.rows.forEach(r=>{ if(H.asm!=='all'&&SR[r[0]][2]!==H.asm)return; if(H.type!=='all'&&String(r[3])!==H.type)return;
    const k=kh(r); if(k.m1&&!k.nv2)L.push([k,r]);});
  L.sort((a,b)=>b[0].ds-a[0].ds);
  document.getElementById('hvtNvN').textContent=fi(L.length)+' KH đạt NV1 chưa đạt NV2 (hiển thị 100 KH có DS lớn nhất)';
  document.getElementById('hvtNvList').innerHTML=L.slice(0,100).map(([k,r],i)=>{const s=SR[r[0]];
    const need=r[3]===1?BR.filter((n,j)=>k.b[j]<NV2_BRAND).join(', '):('còn thiếu '+gFmt(NV2_TOTAL-k.sum4)+' từ 4 nhãn');
    return `<tr><td>${i+1}</td><td style="text-align:left">${esc(s[1])}</td><td style="text-align:left">${esc(s[4])}</td><td style="text-align:left">${esc(s[3])}</td><td style="text-align:left">${esc(s[2])}</td><td style="text-align:left">${esc(r[2])} <span class="kv">· ${esc(r[1])}</span></td><td>${r[3]?'VIP đại sứ':'VIP'}</td><td>${gFmt(k.ds)}</td><td>${fp(k.pct*100)}</td>`+k.b.map(v=>`<td style="${r[3]===1&&v<NV2_BRAND?'color:var(--accent);font-weight:700':''}">${v?gFmt(v):dash}</td>`).join('')+`<td style="text-align:left">${esc(need)}</td></tr>`;}).join('');
}
function hvList(){
  const SR=HVT11.sr, L=[];
  HVT11.rows.forEach(r=>{ if(H.asm!=='all'&&SR[r[0]][2]!==H.asm)return; if(H.type!=='all'&&String(r[3])!==H.type)return;
    const k=kh(r); if(k.m1||k.base<=0)return; const th=Math.max(0,0.95*k.base-k.ds); if(th<=H.sap*k.base)L.push([th,r,k]);});
  L.sort((a,b)=>a[0]-b[0]||b[1][5]-a[1][5]);
  document.getElementById('hvtListN').textContent=fi(L.length)+' KH sắp đạt NV1 (hiển thị 100 KH thiếu ít nhất)';
  document.getElementById('hvtList').innerHTML=L.slice(0,100).map(([th,r,k],i)=>{const s=SR[r[0]];
    return `<tr><td>${i+1}</td><td style="text-align:left">${esc(s[1])}</td><td style="text-align:left">${esc(s[4])}</td><td style="text-align:left">${esc(s[3])}</td><td style="text-align:left">${esc(s[2])}</td><td style="text-align:left">${esc(r[2])} <span class="kv">· ${esc(r[1])}</span></td><td>${r[3]?'VIP đại sứ':'VIP'}</td><td>${gFmt(k.ds)}</td><td>${gFmt(k.base)}</td><td style="font-weight:700">${gFmt(th)}</td><td>${fp(k.pct*100)}</td></tr>`;}).join('');
}
function hvRender(){
  if(!document.getElementById('hvtBody'))return;
  H.acc=hvAcc();
  const m=HVT11.meta;
  document.getElementById('hvtWarn').innerHTML=`Ngày cắt dữ liệu: <b>hết 10/11</b> (theo anh Chung báo; file hội viên không ghi ngày). ${m.unmapped_sr?`<b>${m.unmapped_sr} SR mới</b> chưa có trong dữ liệu T10 nên xếp ở dòng "Chưa gán SS".`:''}`;
  const g=hvCards(); hvNv(g);
  document.getElementById('hvtBody').innerHTML=hvTable();
  hvNvList(); hvList();
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
  w+=`<br>ℹ File combo có đơn <b>đến ngày ${M.asof}</b>; chưa có đơn ngày 10/11 — nếu anh muốn tính hết 10/11, cần xuất lại file sau khi chốt ngày.`; document.getElementById('cbWarn').innerHTML=w;
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
