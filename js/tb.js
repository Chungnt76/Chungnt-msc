/* Tab "Trưng bày T11": chương trình trưng bày, KH tham gia, hình chụp, thưởng · ASM → NPP → SS → ĐDKD */
(function(){
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const nf=(n,d)=>(n==null||isNaN(n))?'—':n.toLocaleString('vi-VN',{minimumFractionDigits:d==null?0:d,maximumFractionDigits:d==null?0:d});
const pct=(a,b,d)=>b?nf(a/b*100,d==null?1:d)+'%':'—';
const tr=n=>nf(n/1e6,1);
const S={asm:'all',open:new Set(),m:'kh'};
const TH='background:#0369A1;color:#fff;padding:8px 8px;font-size:13px;text-align:right;white-space:normal',THL=TH.replace('text-align:right','text-align:left');
const card=(l,v,s,ac)=>`<div class="kpi" style="border-top:3px solid ${ac||'#0EA5E9'}"><div class="k-lab">${l}</div><div class="k-val">${v}</div><div class="k-sub">${s||''}</div></div>`;
const T=(h,rows)=>`<div style="overflow-x:auto"><table class="t8asmtbl" style="font-size:14px"><thead><tr>${h}</tr></thead><tbody>${rows}</tbody></table></div>`;
const lab=a=>window.GPX&&window.GPX.lab?window.GPX.lab(a):a;
const ASMS=()=>window.GPX&&window.GPX.ASMS_?window.GPX.ASMS_():[...new Set(TB11.sum.map(r=>r[0]))];
const sc=a=>(typeof F!=='undefined'&&F.asm!=='all')?a===F.asm:(S.asm==='all'||a===S.asm);
const npn=n=>String(n).replace(/^Kho NPP /,'');
const GS=['Gia vị','Mì','Cà phê','NGK','HPC','Meat','KH trọng điểm','Tủ mát NGK','Xốt CHIN-SU','Kệ Homey','Tủ mát TDC','NGK TDC'];
const IDX={kh:0,suat:1,chup:2,chua:3,bo:4,dat:5,rot:6,rtlC:7,rtlN:8,rtl3:9,rtl6:10,rtlBo:11,rtlDat:12,dkdC:13,dkdN:14,dkdBo:15,dkdDat:16,diem:17,tien:18,ds:19};
const sv=(L,k)=>{let s=0;L.forEach(r=>{s+=r[3+IDX[k]]||0;});return s;};
function tree(rows,ka,kn,ks,kr){ // gom ASM > NPP > SS (> SR)
  const m=new Map(); rows.forEach(r=>{const a=ka(r),n=kn(r),s=ks(r); if(!m.has(a))m.set(a,new Map()); const A=m.get(a); if(!A.has(n))A.set(n,new Map()); const N=A.get(n); if(!N.has(s))N.set(s,new Map()); const SS=N.get(s); if(kr){const x=kr(r); if(!SS.has(x))SS.set(x,[]); SS.get(x).push(r);}else{if(!SS.has(''))SS.set('',[]);SS.get('').push(r);}});
  return m;
}
const flat=(m)=>{let o=[];m.forEach(v=>{o=o.concat(v instanceof Map?flat(v):v);});return o;};
function drill(rows,ka,kn,ks,kr,cellsFn,head,sortFn,extra){
  const t=tree(rows,ka,kn,ks,kr); let h='';
  const row=(lv,id,show,name,L,kids)=>`<tr data-id="${esc(id)}" ${show?'':'hidden'} style="${lv===0?'font-weight:700;background:#f0f9ff':''}"><td style="text-align:left;white-space:normal;padding-left:${8+lv*18}px">${kids?`<span class="tbt" style="cursor:pointer;color:#0369A1">${S.open.has(id)?'▾':'▸'}</span> `:'&nbsp;&nbsp;'}${esc(name)}</td>${cellsFn(L)}</tr>`;
  const sk=(a,b)=>sortFn(flat(b[1]))-sortFn(flat(a[1]));
  const AS=ASMS().filter(a=>t.has(a)&&sc(a));
  AS.forEach(a=>{const A=t.get(a),ai='a|'+a; h+=row(0,ai,true,lab(a),flat(A),true);
    [...A.entries()].sort(sk).forEach(([n,N])=>{const ni='n|'+a+'|'+n; h+=row(1,ni,S.open.has(ai),npn(n),flat(N),true);
      [...N.entries()].sort(sk).forEach(([s,SS])=>{const si='s|'+a+'|'+n+'|'+s; const v=S.open.has(ai)&&S.open.has(ni); h+=row(2,si,v,'SS '+s,flat(SS),!!kr);
        if(kr)[...SS.entries()].sort(sk).forEach(([x,L])=>{h+=row(3,'r|'+si+'|'+x,v&&S.open.has(si),x,L,false);});});});});
  const all=rows.filter(r=>sc(r[0]));
  h+=`<tr class="tot" style="font-weight:700"><td style="text-align:left">TOÀN MIỀN${S.asm==='all'&&!(typeof F!=='undefined'&&F.asm!=='all')?'':' (phạm vi chọn)'}</td>${cellsFn(all)}</tr>`;
  return `<div style="margin-bottom:6px"><button class="tbOA" style="padding:5px 12px;border:1px solid #38BDF8;background:#fff;border-radius:6px;cursor:pointer;font-size:14px">Mở hết</button> <button class="tbCA" style="padding:5px 12px;border:1px solid #38BDF8;background:#fff;border-radius:6px;cursor:pointer;font-size:14px">Thu gọn</button></div>`+T(head,h);
}
function blockSum(){
  const cells=L=>{const kh=sv(L,'kh'),su=sv(L,'suat'),ch=sv(L,'chup'),dt=sv(L,'dat'),bo=sv(L,'bo');
    const col=(v,t)=>`color:${v>=t?'#16a34a':v>=t*0.85?'#d97706':'#dc2626'};font-weight:700`;
    return `<td>${nf(kh)}</td><td>${nf(su)}</td><td>${nf(kh?su/kh:0,2)}</td><td>${nf(ch)}</td><td style="${col(kh?ch/kh*100:0,80)}">${pct(ch,kh)}</td><td>${nf(sv(L,'chua'))}</td><td>${nf(bo)}</td><td style="${col(bo?dt/bo*100:0,95)}">${pct(dt,bo)}</td><td>${nf(sv(L,'rtlC'))}</td><td>${nf(sv(L,'rtl3'))}</td><td>${nf(sv(L,'dkdC'))}</td><td>${nf(sv(L,'dkdN'))}</td><td>${tr(sv(L,'tien'))}</td><td>${pct(sv(L,'tien'),sv(L,'ds'),2)}</td>`;};
  const h=`<th style="${THL}">ASM › NPP › SS <span style="font-weight:400">(bấm ▸ để mở)</span></th><th style="${TH}">KH tham gia</th><th style="${TH}">Tổng suất</th><th style="${TH}">Suất/KH</th><th style="${TH}">KH có chụp hình</th><th style="${TH}">% KH chụp</th><th style="${TH}">KH chưa chụp</th><th style="${TH}">Bộ hình chụp</th><th style="${TH}">% bộ hình đạt</th><th style="${TH}">KH RTL có chụp</th><th style="${TH}">KH RTL 3 ngày chưa chụp</th><th style="${TH}">KH ĐDKD có chụp</th><th style="${TH}">KH ĐDKD chưa chụp</th><th style="${TH}">Tiền thưởng (triệu)</th><th style="${TH}">Thưởng / DS</th>`;
  const rows=TB11.sum.map(r=>r);
  return drill(rows,r=>r[0],r=>r[1],r=>r[2],null,cells,h,L=>sv(L,'chua'))+`<div class="pnote" style="margin-top:6px;font-size:13.5px">KH tham gia = số cửa hàng được tham gia trưng bày (một KH có thể tham gia nhiều chương trình, mỗi chương trình tính 1 suất). % KH chụp xanh ≥80%, % bộ hình đạt xanh ≥95%. RTL = KH tự chụp, ĐDKD = nhân viên chụp. Xếp theo số KH chưa chụp giảm dần. Thưởng/DS = tiền thưởng quy đổi trên doanh số của nhóm KH tham gia theo file data_58.</div>`;
}
const PG=()=>TB11.prog.filter(r=>sc(r[0]));
function blockProg(){
  const P=PG(), G=TB11.meta.groups; const tot={}; 
  const all=P.filter(r=>r[4]===-1); const khAll=all.reduce((t,r)=>t+r[5],0);
  const mk=(name,L,isT)=>{const kh=L.reduce((t,r)=>t+r[5],0),n=L.reduce((t,r)=>t+r[6],0),bo=L.reduce((t,r)=>t+r[7],0),dt=L.reduce((t,r)=>t+r[8],0),rt=L.reduce((t,r)=>t+r[9],0),m3=L.reduce((t,r)=>t+r[10],0);
    return `<tr${isT?' class="tot" style="font-weight:700"':''}><td style="text-align:left;white-space:normal">${esc(name)}</td><td><b>${nf(kh)}</b></td><td>${pct(kh,khAll)}</td><td>${nf(bo)}</td><td>${nf(dt)}</td><td style="color:${bo&&dt/bo>=0.95?'#16a34a':'#d97706'};font-weight:700">${pct(dt,bo)}</td><td>${nf(rt)}</td><td>${nf(m3)}</td><td>${kh?nf(bo/kh,1):'—'}</td></tr>`;};
  let rows=''; G.forEach((g,i)=>{const L=P.filter(r=>r[4]===i); if(L.length)rows+=mk(g,L);}); rows+=mk('Tổng KH (không trùng giữa các chương trình)',all,true);
  const h=`<th style="${THL}">Nhóm chương trình</th><th style="${TH}">KH tham gia (có hình)</th><th style="${TH}">% trên KH có chụp hình</th><th style="${TH}">Bộ hình chụp</th><th style="${TH}">Bộ hình đạt</th><th style="${TH}">% đạt</th><th style="${TH}">Bộ hình rớt</th><th style="${TH}">KH 3 ngày chưa chụp</th><th style="${TH}">Bộ hình / KH</th>`;
  // chi tiết từng chương trình
  const C=TB11.ct.filter(r=>sc(r[2])), cm=new Map(); C.forEach(r=>{const k=r[0]; if(!cm.has(k))cm.set(k,{g:r[1],kh:0,bo:0,dat:0}); const o=cm.get(k); o.kh+=r[5];o.bo+=r[6];o.dat+=r[7];});
  const cr=[...cm.entries()].sort((a,b)=>b[1].kh-a[1].kh).map(([k,o])=>`<tr><td style="text-align:left;white-space:normal">${esc(TB11.meta.cts[k])}</td><td style="text-align:left">${esc(G[o.g])}</td><td><b>${nf(o.kh)}</b></td><td>${nf(o.bo)}</td><td>${pct(o.dat,o.bo)}</td></tr>`).join('');
  return T(h,rows)+`<div class="pnote" style="margin:6px 0;font-size:13.5px">KH tham gia theo chương trình là số KH đã có dữ liệu chụp hình của chương trình đó (file raw chỉ gồm KH có hình). Một KH tham gia nhiều chương trình nên cột này không cộng được thành tổng KH.</div>`+
   `<details style="margin-top:6px"><summary style="cursor:pointer;font-weight:700;color:#0369A1;font-size:14px">Chi tiết ${cm.size} chương trình (tên đầy đủ)</summary>`+T(`<th style="${THL}">Tên chương trình</th><th style="${THL}">Nhóm</th><th style="${TH}">KH có hình</th><th style="${TH}">Bộ hình chụp</th><th style="${TH}">% đạt</th>`,cr)+`</details>`;
}
const MET={kh:['KH tham gia (có hình)',r=>r[5]],dat:['Bộ hình đạt',r=>r[8]],m3:['KH 3 ngày chưa chụp',r=>r[10]],bo:['Bộ hình chụp',r=>r[7]]};
function blockMatrix(){
  const G=TB11.meta.groups, f=MET[S.m][1];
  const cells=L=>{const s=i=>L.filter(r=>r[4]===i).reduce((t,r)=>t+f(r),0); return `<td><b>${nf(s(-1))}</b></td>`+G.map((g,i)=>`<td>${nf(s(i))||'0'}</td>`).join('');};
  const h=`<th style="${THL}">ASM › NPP › SS › ĐDKD <span style="font-weight:400">(bấm ▸ để mở)</span></th><th style="${TH}">Tổng${S.m==='kh'?' KH':''}</th>`+G.map((g,i)=>`<th style="${TH}">${esc(GS[i])}</th>`).join('');
  const btn=Object.keys(MET).map(k=>`<button data-m="${k}" class="${k===S.m?'on':''}">${MET[k][0]}</button>`).join('');
  const sortF=L=>L.filter(r=>r[4]===-1).reduce((t,r)=>t+f(r),0);
  return `<div class="seg tbM" style="margin-bottom:8px">${btn}</div>`+drill(TB11.prog,r=>r[0],r=>r[1],r=>r[2],r=>r[3],cells,h,sortF)+`<div class="pnote" style="margin-top:6px;font-size:13.5px">Mỗi cột là một nhóm chương trình; cột Tổng là số KH không trùng. Khoan đến từng ĐDKD để biết ai phụ trách số KH nào.</div>`;
}
function render(){
  const pg=document.getElementById('pgTb'); if(!pg||typeof TB11==='undefined')return;
  const sn=document.getElementById('scopeNote'); if(sn){sn.innerHTML='';sn.hidden=true;}
  let host=document.getElementById('tbHost'); if(!host){host=document.createElement('div');host.id='tbHost';pg.appendChild(host);}
  const L=TB11.sum.filter(r=>sc(r[0])), kh=sv(L,'kh'),su=sv(L,'suat'),ch=sv(L,'chup'),bo=sv(L,'bo'),dt=sv(L,'dat');
  const sec=(n,t,b,s)=>`<div class="panel" style="margin-top:14px;position:relative"><div class="tbl-head"><div><h3 style="display:inline;color:#0369A1;font-size:18px">${n}. ${t}</h3> ${s?`<span class="pnote" style="display:inline;font-size:13.5px">— ${s}</span>`:''}</div></div>${b}</div>`;
  const nt=(typeof F!=='undefined'&&(F.oo!=='all'||F.vip!=='all'))?`<div class="pnote" style="margin:6px 0;padding:8px 10px;background:#fff7ed;border:1px solid #fdba74;border-radius:8px;font-size:13.5px">Bộ lọc Kênh và Nhóm KH chưa áp dụng cho tab Trưng bày (dữ liệu chương trình không chia theo kênh/nhóm). Bộ lọc ASM vẫn áp dụng.</div>`:'';
  host.innerHTML=`<div class="panel" style="margin-top:14px;border-top:3px solid #0EA5E9;position:relative"><div class="tbl-head"><h3 style="display:inline;color:#0369A1;font-size:20px">Trưng bày Tháng 11</h3> <span class="pnote" style="display:inline;font-size:13.5px">— chụp hình đến ${TB11.meta.asof} · ${TB11.meta.groups.length} nhóm chương trình · ${nf(TB11.sum.length)} SS</span></div>${nt}
   <div class="fg"><label>Phạm vi</label><div class="seg" id="tbScope"><button data-v="all">Toàn Miền</button>${ASMS().map(a=>`<button data-v="${esc(a)}">${esc(lab(a))}</button>`).join('')}</div></div>
   <div class="kpis" style="grid-template-columns:repeat(5,1fr);margin-top:10px">`+
   card('KH tham gia trưng bày',nf(kh),nf(su)+' suất · '+nf(kh?su/kh:0,2)+' suất/KH')+
   card('KH đã chụp hình',nf(ch),pct(ch,kh)+' KH tham gia · chưa chụp '+nf(sv(L,'chua')),ch/kh>=0.8?'#16a34a':'#d97706')+
   card('Bộ hình đạt',pct(dt,bo),nf(dt)+' / '+nf(bo)+' bộ · rớt '+nf(sv(L,'rot')),dt/bo>=0.95?'#16a34a':'#d97706')+
   card('KH RTL / ĐDKD có chụp',nf(sv(L,'rtlC'))+' / '+nf(sv(L,'dkdC')),'RTL 3 ngày chưa chụp '+nf(sv(L,'rtl3'))+' · RTL chưa đủ 6 bộ '+nf(sv(L,'rtl6')))+
   card('Tiền thưởng quy đổi',tr(sv(L,'tien'))+' triệu',pct(sv(L,'tien'),sv(L,'ds'),2)+' doanh số nhóm KH tham gia')+`</div></div>`+
   sec(1,'Theo ASM › NPP › SS: KH tham gia, hình chụp, thưởng',blockSum())+
   sec(2,'Theo từng chương trình: số KH tham gia',blockProg(),'toàn phạm vi đang chọn')+
   sec(3,'Chương trình × ASM › NPP › SS › ĐDKD',blockMatrix(),'số KH theo từng chương trình');
  [...host.querySelectorAll('#tbScope button')].forEach(b=>b.classList.toggle('on',b.dataset.v===S.asm));
  host.querySelector('#tbScope').onclick=e=>{const b=e.target.closest('button');if(b){S.asm=b.dataset.v;render();}};
  host.querySelectorAll('.tbM').forEach(m=>m.onclick=e=>{const b=e.target.closest('button');if(b){S.m=b.dataset.m;render();}});
  host.querySelectorAll('tr[data-id] .tbt').forEach(t=>{t.onclick=()=>{const id=t.closest('tr').dataset.id; if(S.open.has(id))S.open.delete(id);else S.open.add(id); render();};});
  host.querySelectorAll('.tbOA').forEach(b=>b.onclick=()=>{host.querySelectorAll('tr[data-id]').forEach(r=>S.open.add(r.dataset.id));render();});
  host.querySelectorAll('.tbCA').forEach(b=>b.onclick=()=>{S.open.clear();render();});
}
window.renderTb=function(){try{render();}catch(e){console.error('TB',e);}};
})();
