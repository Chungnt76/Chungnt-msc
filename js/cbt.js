/* Combo tracking T11 (data/CBT11.js): thẻ 3 chương trình + bảng ASM → NPP → SS → ĐDKD */
(function(){
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const M=n=>gFmt((n||0)); const pc=(a,b)=>b?fp(a/b*100):'—';
const S={g:'oo',asm:'all',open:{a:new Set(),n:new Set(),s:new Set()},tree:null};
const GR={oo:[0,1],0:[0],1:[1],2:[2]};
const Z=()=>[0,0,0,0,0,0,0,0,0];       // n,ctso,ds,mua,nhan,suat,ctsoM,dsM,dsF
function add(a,r){for(let i=0;i<9;i++)a[i]+=r[i+2];return a;}
function tree(){const T=new Map(); CBT11.sr.forEach((s,i)=>{const a=s[2]||'—',n=s[3]||'—',ss=s[4]||'—';
  if(!T.has(a))T.set(a,new Map()); const N=T.get(a); if(!N.has(n))N.set(n,new Map()); const SS=N.get(n); if(!SS.has(ss))SS.set(ss,[]); SS.get(ss).push(i);}); return T;}
const byS=new Map(); function bySr(){byS.clear(); CBT11.rows.forEach(r=>{if(!GR[S.g].includes(r[1]))return; let a=byS.get(r[0]); if(!a){a=Z();byS.set(r[0],a);} add(a,r);});}
const sum=ids=>{const a=Z(); ids.forEach(i=>{const b=byS.get(i); if(b)for(let k=0;k<9;k++)a[k]+=b[k];}); return a;};
const leaves=x=>x instanceof Map?[...x.values()].flatMap(leaves):x;
function row(name,a,o){
  const lvl=o.lvl||0,pad=12+lvl*22, caret=o.open==null?'<span class="cx leaf">•</span>':`<span class="cx">${o.open?'▾':'▸'}</span>`;
  const at=o.ds?Object.entries(o.ds).map(([k,v])=>`data-${k}="${esc(v)}"`).join(' '):'';
  const pk=a[1]?a[2]/a[1]*100:0, pn=a[6]?a[7]/a[6]*100:0, c=p=>p>=100?'#047857':p>=60?'#b45309':'#b91c1c';
  return `<tr class="${o.tot?'tot':'lvl'+lvl}" ${at} data-lvl="${lvl}"><td style="padding-left:${o.tot?12:pad}px;text-align:left;white-space:nowrap">${o.tot?'':caret}<span class="nm">${esc(name)}</span></td>`+
   `<td>${fi(a[0])}</td><td>${M(a[1])}</td><td>${M(a[2])}</td><td style="font-weight:700">${pc(a[2],a[1])}</td>`+
   `<td>${fi(a[3])}</td><td>${pc(a[3],a[0])}</td><td>${fi(a[4])}</td><td>${fi(a[5])}</td><td style="font-weight:700">${pc(a[4],a[0])}</td>`+
   `<td>${M(a[6])}</td><td>${M(a[7])}</td><td style="font-weight:700">${pc(a[7],a[6])}</td><td>${M(a[8])}</td></tr>`;}
function rows(){
  const T=S.tree; let h=''; const asms=[...T.keys()].filter(a=>S.asm==='all'||a===S.asm);
  const A=asms.map(a=>({k:a,a:sum(leaves(T.get(a)))})).filter(x=>x.a[0]>0).sort((p,q)=>q.a[0]-p.a[0]);
  A.forEach(x=>{const ao=S.open.a.has(x.k); h+=row(x.k,x.a,{lvl:0,open:ao,ds:{a:x.k}}); if(!ao)return;
    const N=[...T.get(x.k).keys()].map(n=>({k:n,a:sum(leaves(T.get(x.k).get(n)))})).filter(y=>y.a[0]>0).sort((p,q)=>q.a[0]-p.a[0]);
    N.forEach(y=>{const no=S.open.n.has(x.k+'|'+y.k); h+=row(y.k,y.a,{lvl:1,open:no,ds:{a:x.k,n:y.k}}); if(!no)return;
      const SS=[...T.get(x.k).get(y.k).keys()].map(s=>({k:s,a:sum(leaves(T.get(x.k).get(y.k).get(s)))})).filter(z=>z.a[0]>0).sort((p,q)=>q.a[0]-p.a[0]);
      SS.forEach(z=>{const so=S.open.s.has(x.k+'|'+y.k+'|'+z.k); h+=row(z.k,z.a,{lvl:2,open:so,ds:{a:x.k,n:y.k,s:z.k}}); if(!so)return;
        T.get(x.k).get(y.k).get(z.k).map(i=>({i,a:sum([i])})).filter(d=>d.a[0]>0).sort((p,q)=>q.a[0]-p.a[0]).forEach(d=>{h+=row(CBT11.sr[d.i][1],d.a,{lvl:3,open:null});});});});});
  const tot=sum(A.flatMap(x=>leaves(S.tree.get(x.k))));
  return row('TỔNG'+(S.asm==='all'?'':' (theo ASM)'),tot,{tot:true})+h;}
function cards(){
  const inS=i=>S.asm==='all'||CBT11.sr[i][2]===S.asm;
  const g=k=>{const a=Z(); CBT11.rows.forEach(r=>{if(r[1]===k&&inS(r[0]))add(a,r);}); return a;};
  const card=(t,sub,col,a,note)=>`<div style="border-radius:14px;overflow:hidden;box-shadow:0 1px 4px #0002;background:var(--card,#fff);border:1px solid #e2e8f0"><div style="background:${col};color:#fff;text-align:center;padding:12px 8px"><div style="font-size:17px;font-weight:800">${t}</div><div style="font-size:11px;opacity:.85">${sub}</div></div><div style="padding:10px 14px;text-align:center"><div style="font-weight:800;color:${col.includes('#')?'#c2410c':'#c2410c'};font-size:13.5px">${note[0]}</div><div style="font-size:12px;margin:6px 0">${note[1]}</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;border-top:1px dashed #cbd5e1;padding-top:8px">`+
   [[fi(a[0]),'KH áp dụng'],[fi(a[4]),'KH đã nhận combo'],[fi(a[5]),'Suất tặng'],[pc(a[4],a[0]),'KH tham gia']].map(([v,l])=>`<div><div style="font-size:21px;font-weight:800">${v}</div><div style="font-size:11px;color:#64748b">${l}</div></div>`).join('')+`</div><div style="font-size:11.5px;color:#64748b;margin-top:6px">DS mang về (toàn đơn có combo): <b>${M(a[8])}</b></div></div></div>`;
  document.getElementById('cbtCards').innerHTML=
    card('KH lẻ L1 OFF','Off premise · ngoài nhóm hội viên','linear-gradient(135deg,#1e40af,#0f172a)',g(0),['TẶNG 01 CHAI TƯƠNG ỚT 250GR','đơn <b>800K</b> total Masan, có ≥100K nhãn trọng điểm (Chinsu, Nam Ngư, Kokomi, Chanté) · tối đa 2 suất/đơn'])+
    card('Total KH L1 ON','toàn bộ quầy ON trong MCP','linear-gradient(135deg,#6d28d9,#1e1b4b)',g(1),['TẶNG 01 CHAI WAKEUP 247','đơn <b>250K</b> total Bev, có ≥80K SP mới (WK247 Amazon, Bupnon 365) · tối đa 3 suất/đơn'])+
    card('L2 Quán ăn + Nhà hàng','nằm trong nhóm ON · VIP2 · VIP3','linear-gradient(135deg,#c2410c,#431407)',g(2),['TẶNG 01 CHAI TƯƠNG ỚT 250GR','đơn <b>500K</b> Gia vị có 200K NN STK, hoặc <b>400K</b> Gia vị có 32K TTT Nhị Ca']);
}
function render(){
  if(typeof CBT11==='undefined'||!document.getElementById('cbtBody'))return;
  if(!S.tree){S.tree=tree();}
  bySr(); cards();
  document.getElementById('cbtBody').innerHTML=rows();
  const m=CBT11.meta, tot=sum([...byS.keys()]);
  document.getElementById('cbtNote').innerHTML=`Tập KH áp dụng = MCP (${fi(m.mcp)} KH) − nhóm hội viên (${fi(m.hv)} KH) − Vãng lai = <b>${fi(m.universe)} KH</b> (OFF + ON; Quán ăn/Nhà hàng nằm trong ON). · DS MTD = sell-out đến ${m.asof}. · <b>CTSO = TB 3 tháng gần nhất</b> (chưa có chỉ tiêu T11 theo từng KH). · KH đã mua = KH có đơn MTD · KH đã nhận = KH nhận combo · % KH tham gia = KH nhận ÷ số KH · <b>Nhóm KH đã nhận combo</b> = CTSO/DS MTD của riêng KH đã mua đạt combo (không gồm KH mua nhưng chưa có combo).`;
  [...document.querySelectorAll('#cbtGrp button')].forEach(b=>b.classList.toggle('on',b.dataset.v===S.g));
  [...document.querySelectorAll('#cbtAsm button')].forEach(b=>b.classList.toggle('on',b.dataset.v===S.asm));
}
function init(){
  const el=id=>document.getElementById(id); if(!el('cbtBody')||el('cbtBody')._i)return; el('cbtBody')._i=1;
  const asms=[...new Set(CBT11.sr.map(s=>s[2]))].filter(a=>CBT11.rows.some(r=>CBT11.sr[r[0]][2]===a)).sort();
  el('cbtAsm').innerHTML='<button data-v="all" class="on">Cả miền</button>'+asms.map(a=>`<button data-v="${esc(a)}">${esc(a)}</button>`).join('');
  el('cbtGrp').onclick=e=>{const b=e.target.closest('button'); if(b){S.g=b.dataset.v; render();}};
  el('cbtAsm').onclick=e=>{const b=e.target.closest('button'); if(b){S.asm=b.dataset.v; render();}};
  el('cbtCtl').onclick=e=>{const b=e.target.closest('button'); if(!b)return;
    if(b.dataset.a==='expand'){S.tree.forEach((N,a)=>{S.open.a.add(a);N.forEach((_,n)=>S.open.n.add(a+'|'+n));});} else{S.open.a.clear();S.open.n.clear();S.open.s.clear();} render();};
  el('cbtBody').addEventListener('click',e=>{const tr=e.target.closest('tr'); if(!tr)return; const d=tr.dataset,l=d.lvl; const tg=(set,k)=>set.has(k)?set.delete(k):set.add(k);
    if(l==='0'&&d.a)tg(S.open.a,d.a); else if(l==='1')tg(S.open.n,d.a+'|'+d.n); else if(l==='2')tg(S.open.s,d.a+'|'+d.n+'|'+d.s); else return; render();});
}
const prev=window.renderCombo;
window.renderCombo=function(){ if(prev)prev(); try{init();render();}catch(e){console.error('CBT',e);} };
})();
