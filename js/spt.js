/* Tab "SP tập trung T11": chương trình Sản phẩm tập trung (Đại sứ ngành hàng, KH Trọng điểm, B'fast, Tea 365, Xúc xích) · ASM → NPP → SS → ĐDKD */
(function(){
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const nf=(n,d)=>(n==null||isNaN(n))?'—':n.toLocaleString('vi-VN',{minimumFractionDigits:d==null?0:d,maximumFractionDigits:d==null?0:d});
const pct=(a,b,d)=>b?nf(a/b*100,d==null?1:d)+'%':'—';
const tr=n=>nf(n/1e6,1);
const S={asm:'all',open:new Set(),m:'dat'};
const TH='background:#0369A1;color:#fff;padding:8px 8px;font-size:13px;text-align:right;white-space:normal',THL=TH.replace('text-align:right','text-align:left');
const card=(l,v,s,ac)=>`<div class="kpi" style="border-top:3px solid ${ac||'#0EA5E9'}"><div class="k-lab">${l}</div><div class="k-val">${v}</div><div class="k-sub">${s||''}</div></div>`;
const T=(h,rows)=>`<div style="overflow-x:auto"><table class="t8asmtbl" style="font-size:14px"><thead><tr>${h}</tr></thead><tbody>${rows}</tbody></table></div>`;
const lab=a=>window.GPX&&window.GPX.lab?window.GPX.lab(a):a;
const ASMS=()=>window.GPX&&window.GPX.ASMS_?window.GPX.ASMS_():[...new Set(SPT11.rows.map(r=>r[0]))];
const sc=a=>(typeof F!=='undefined'&&F.asm!=='all')?a===F.asm:(S.asm==='all'||a===S.asm);
const npn=n=>String(n).replace(/^Kho NPP /,'');
const IX={n:5,mua:6,dat:7,gan:8,thieu:9,ds:10,pts:11};
const sv=(L,k)=>{let s=0;L.forEach(r=>{s+=r[IX[k]]||0;});return s;};
const MET={dat:['KH đạt ngưỡng thưởng','dat'],gan:['KH gần đạt (≥70% ngưỡng)','gan'],mua:['KH đã mua','mua'],n:['KH áp dụng','n'],pts:['Thưởng ước tính (triệu đ)','pts']};
const mv=(L,k)=>k==='pts'?sv(L,'pts')/100/1e6:sv(L,k);
function tree(rows,ka,kn,ks,kr){ // gom ASM > NPP > SS (> SR)
  const m=new Map(); rows.forEach(r=>{const a=ka(r),n=kn(r),s=ks(r); if(!m.has(a))m.set(a,new Map()); const A=m.get(a); if(!A.has(n))A.set(n,new Map()); const N=A.get(n); if(!N.has(s))N.set(s,new Map()); const SS=N.get(s); if(kr){const x=kr(r); if(!SS.has(x))SS.set(x,[]); SS.get(x).push(r);}else{if(!SS.has(''))SS.set('',[]);SS.get('').push(r);}});
  return m;
}
const flat=(m)=>{let o=[];m.forEach(v=>{o=o.concat(v instanceof Map?flat(v):v);});return o;};
function drill(rows,ka,kn,ks,kr,cellsFn,head,sortFn,extra){
  const t=tree(rows,ka,kn,ks,kr); let h='';
  const row=(lv,id,show,name,L,kids)=>`<tr data-id="${esc(id)}" ${show?'':'hidden'} style="${lv===0?'font-weight:700;background:#f0f9ff':''}"><td style="text-align:left;white-space:normal;padding-left:${8+lv*18}px">${kids?`<span class="spt" style="cursor:pointer;color:#0369A1">${S.open.has(id)?'▾':'▸'}</span> `:'&nbsp;&nbsp;'}${esc(name)}</td>${cellsFn(L)}</tr>`;
  const sk=(a,b)=>sortFn(flat(b[1]))-sortFn(flat(a[1]));
  const AS=ASMS().filter(a=>t.has(a)&&sc(a));
  AS.forEach(a=>{const A=t.get(a),ai='a|'+a; h+=row(0,ai,true,lab(a),flat(A),true);
    [...A.entries()].sort(sk).forEach(([n,N])=>{const ni='n|'+a+'|'+n; h+=row(1,ni,S.open.has(ai),npn(n),flat(N),true);
      [...N.entries()].sort(sk).forEach(([s,SS])=>{const si='s|'+a+'|'+n+'|'+s; const v=S.open.has(ai)&&S.open.has(ni); h+=row(2,si,v,'SS '+s,flat(SS),!!kr);
        if(kr)[...SS.entries()].sort(sk).forEach(([x,L])=>{h+=row(3,'r|'+si+'|'+x,v&&S.open.has(si),x,L,false);});});});});
  const all=rows.filter(r=>sc(r[0]));
  h+=`<tr class="tot" style="font-weight:700"><td style="text-align:left">TOÀN MIỀN${S.asm==='all'&&!(typeof F!=='undefined'&&F.asm!=='all')?'':' (phạm vi chọn)'}</td>${cellsFn(all)}</tr>`;
  return `<div style="margin-bottom:6px"><button class="sptOA" style="padding:5px 12px;border:1px solid #38BDF8;background:#fff;border-radius:6px;cursor:pointer;font-size:14px">Mở hết</button> <button class="sptCA" style="padding:5px 12px;border:1px solid #38BDF8;background:#fff;border-radius:6px;cursor:pointer;font-size:14px">Thu gọn</button></div>`+T(head,h);
}

const P=()=>SPT11.progs;
const rowsIn=()=>SPT11.rows.filter(r=>sc(r[0]));
function blockProg(){
  const R=rowsIn(); let rows='',T0={n:0,mua:0,dat:0,gan:0,ds:0,pts:0};
  P().forEach((p,i)=>{const L=R.filter(r=>r[4]===i); const n=sv(L,'n'),mu=sv(L,'mua'),d=sv(L,'dat'),g=sv(L,'gan'),ds=sv(L,'ds'),pt=sv(L,'pts');
    ['n','mua','dat','gan','ds','pts'].forEach(k=>T0[k]+={n,mua:mu,dat:d,gan:g,ds,pts:pt}[k]);
    rows+=`<tr><td style="text-align:left;white-space:normal"><b>${esc(p.n)}</b></td><td>${nf(n)}</td><td>${nf(mu)}</td><td>${pct(mu,n)}</td><td><b>${nf(d)}</b></td><td style="color:${mu&&d/mu>=0.3?'#16a34a':'#d97706'};font-weight:700">${pct(d,mu)}</td><td>${nf(g)}</td><td>${tr(sv(L,'thieu'))}</td><td>${tr(ds)}</td><td style="text-align:left;white-space:normal;font-size:13px">≥ ${nf(p.min/1000)}k${p.mul?' · ×'+nf(p.mul,1):' · cố định'} · trần ${nf(p.cap/100/1000)}k</td><td><b>${tr(pt/100)}</b></td></tr>`;});
  rows+=`<tr class="tot" style="font-weight:700"><td style="text-align:left">Tổng lượt KH × chương trình</td><td>${nf(T0.n)}</td><td>${nf(T0.mua)}</td><td>${pct(T0.mua,T0.n)}</td><td>${nf(T0.dat)}</td><td>${pct(T0.dat,T0.mua)}</td><td>${nf(T0.gan)}</td><td></td><td>${tr(T0.ds)}</td><td></td><td>${tr(T0.pts/100)}</td></tr>`;
  const h=`<th style="${THL}">Chương trình</th><th style="${TH}">KH áp dụng</th><th style="${TH}">KH đã mua</th><th style="${TH}">% mua</th><th style="${TH}">KH đạt ngưỡng</th><th style="${TH}">% đạt / đã mua</th><th style="${TH}">KH gần đạt (≥70% ngưỡng)</th><th style="${TH}">DS còn thiếu của KH gần đạt (triệu)</th><th style="${TH}">DS tích lũy (triệu)</th><th style="${THL}">Điều kiện thưởng</th><th style="${TH}">Thưởng ước tính (triệu đ)</th>`;
  return T(h,rows)+`<div class="pnote" style="margin-top:6px;font-size:13.5px">Thưởng ước tính = điểm thưởng trong file (Max_reward) ÷ 100 điểm/đồng. KH đạt ngưỡng = DS tích lũy ≥ mức tối thiểu của chương trình. Ngũ cốc B'fast, Tea 365, Xúc xích áp dụng cho toàn bộ MCP (~90.880 KH) nên % mua thấp là bình thường. Đại sứ Tết (Kệ Chinsu Food) có 403 KH áp dụng nhưng file chưa ghi nhận doanh số.</div>`;
}
function blockMatrix(){
  const k=S.m, btn=Object.keys(MET).map(x=>`<button data-m="${x}" class="${x===k?'on':''}">${MET[x][0]}</button>`).join('');
  const cells=L=>P().map((p,i)=>{const v=mv(L.filter(r=>r[4]===i),k);return `<td>${k==='pts'?nf(v,1):nf(v)}</td>`;}).join('')+`<td><b>${k==='pts'?nf(mv(L,k),1):nf(mv(L,k))}</b></td>`;
  const h=`<th style="${THL}">ASM › NPP › SS › ĐDKD <span style="font-weight:400">(bấm ▸ để mở)</span></th>`+P().map(p=>`<th style="${TH}">${esc(p.n)}</th>`).join('')+`<th style="${TH}">Tổng</th>`;
  const sortF=L=>mv(L,k);
  return `<div class="seg sptM" style="margin-bottom:8px">${btn}</div>`+drill(SPT11.rows,r=>r[0],r=>r[1],r=>r[2],r=>r[3],cells,h,sortF)+`<div class="pnote" style="margin-top:6px;font-size:13.5px">Mỗi cột là một chương trình; cột Tổng cộng lượt KH × chương trình (một KH có thể thuộc nhiều chương trình).</div>`;
}
function blockGan(){
  const m=new Map(); rowsIn().forEach(r=>{const k=r[0]+'|'+r[1]+'|'+r[2]; if(!m.has(k))m.set(k,{a:r[0],n:r[1],s:r[2],g:0,t:0,d:0}); const o=m.get(k); o.g+=r[8];o.t+=r[9];o.d+=r[7];});
  const L=[...m.values()].filter(o=>o.g>0).sort((a,b)=>b.t-a.t).slice(0,15);
  const rows=L.map(o=>`<tr><td style="text-align:left">${esc(lab(o.a))} · ${esc(npn(o.n))} · SS ${esc(o.s)}</td><td>${nf(o.d)}</td><td><b>${nf(o.g)}</b></td><td>${tr(o.t)}</td></tr>`).join('');
  return T(`<th style="${THL}">ASM · NPP · SS</th><th style="${TH}">KH đã đạt ngưỡng</th><th style="${TH}">KH gần đạt (≥70% ngưỡng)</th><th style="${TH}">DS còn thiếu để đạt (triệu)</th>`,rows)+`<div class="pnote" style="margin-top:6px;font-size:13.5px">15 SS có DS còn thiếu lớn nhất ở nhóm KH gần đạt: chốt các KH này trước khi hết tháng là cách nhanh nhất để tăng số KH nhận thưởng.</div>`;
}
function render(){
  const pg=document.getElementById('pgSpt'); if(!pg||typeof SPT11==='undefined')return;
  const sn=document.getElementById('scopeNote'); if(sn){sn.innerHTML='';sn.hidden=true;}
  let host=document.getElementById('sptHost'); if(!host){host=document.createElement('div');host.id='sptHost';pg.appendChild(host);}
  const R=rowsIn(), n=sv(R,'n'), mu=sv(R,'mua'), d=sv(R,'dat'), g=sv(R,'gan'), pt=sv(R,'pts');
  const sec=(n_,t,b,s)=>`<div class="panel" style="margin-top:14px;position:relative"><div class="tbl-head"><div><h3 style="display:inline;color:#0369A1;font-size:18px">${n_}. ${t}</h3> ${s?`<span class="pnote" style="display:inline;font-size:13.5px">— ${s}</span>`:''}</div></div>${b}</div>`;
  host.innerHTML=`<div class="panel" style="margin-top:14px;border-top:3px solid #0EA5E9;position:relative"><div class="tbl-head"><h3 style="display:inline;color:#0369A1;font-size:20px">Sản phẩm tập trung Tháng 11</h3> <span class="pnote" style="display:inline;font-size:13.5px">${esc(SPT11.meta.src)} · ${SPT11.progs.length} chương trình</span></div>
   <div class="fg"><label>Phạm vi</label><div class="seg" id="sptScope"><button data-v="all">Toàn Miền</button>${ASMS().map(a=>`<button data-v="${esc(a)}">${esc(lab(a))}</button>`).join('')}</div></div>
   <div class="kpis" style="grid-template-columns:repeat(5,1fr);margin-top:10px">`+
   card('Lượt KH áp dụng',nf(n),SPT11.progs.length+' chương trình')+
   card('KH đã mua',nf(mu),pct(mu,n)+' lượt áp dụng','#0EA5E9')+
   card('KH đạt ngưỡng thưởng',nf(d),pct(d,mu)+' KH đã mua',d/mu>=0.3?'#16a34a':'#d97706')+
   card('KH gần đạt (≥70% ngưỡng)',nf(g),'DS còn thiếu '+tr(sv(R,'thieu'))+' triệu','#d97706')+
   card('Thưởng ước tính',tr(pt/100)+' triệu','điểm thưởng ÷ 100')+`</div></div>`+
   sec(1,'Theo chương trình: KH áp dụng, đã mua, đạt ngưỡng, thưởng',blockProg(),'toàn phạm vi đang chọn')+
   sec(2,'Chương trình × ASM › NPP › SS › ĐDKD',blockMatrix(),'chọn chỉ số ở hàng nút')+
   sec(3,'SS cần chốt KH gần đạt',blockGan(),'theo phạm vi đang chọn');
  [...host.querySelectorAll('#sptScope button')].forEach(b=>b.classList.toggle('on',b.dataset.v===S.asm));
  host.querySelector('#sptScope').onclick=e=>{const b=e.target.closest('button');if(b){S.asm=b.dataset.v;render();}};
  host.querySelectorAll('.sptM').forEach(m=>m.onclick=e=>{const b=e.target.closest('button');if(b){S.m=b.dataset.m;render();}});
  host.querySelectorAll('tr[data-id] .spt').forEach(t=>{t.onclick=()=>{const id=t.closest('tr').dataset.id; if(S.open.has(id))S.open.delete(id);else S.open.add(id); render();};});
  host.querySelectorAll('.sptOA').forEach(b=>b.onclick=()=>{host.querySelectorAll('tr[data-id]').forEach(r=>S.open.add(r.dataset.id));render();});
  host.querySelectorAll('.sptCA').forEach(b=>b.onclick=()=>{S.open.clear();render();});
}
window.renderSpt=function(){try{render();}catch(e){console.error('SPT',e);}};
})();
