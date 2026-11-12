/* Tab "Hiệu suất bán hàng": PC / Call plan theo MCP T11 và đơn hàng hàng ngày, ASM → NPP → SS → ĐDKD */
(function(){
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const nf=(n,d)=>(n==null||isNaN(n))?'—':n.toLocaleString('vi-VN',{minimumFractionDigits:d==null?1:d,maximumFractionDigits:d==null?1:d});
const ty=n=>(n==null||isNaN(n))?'—':nf(n/1e9,2);
const pct=(a,b,d)=>b?nf(a/b*100,d==null?1:d)+'%':'—';
const LSK='hs:'; const LS={g(k){try{return localStorage.getItem(LSK+k);}catch(e){return null;}},s(k,v){try{localStorage.setItem(LSK+k,v);}catch(e){}}};
const S={asm:'all',open:new Set(),sort:'so'};
const TH='background:#0369A1;color:#fff;padding:7px 8px;font-size:12px;text-align:right;white-space:normal',THL=TH.replace('text-align:right','text-align:left');
const card=(l,v,s,ac)=>`<div class="kpi" style="border-top:3px solid ${ac||'#0EA5E9'}"><div class="k-lab">${l}</div><div class="k-val">${v}</div><div class="k-sub">${s||''}</div></div>`;
const T=(h,rows)=>`<div style="overflow-x:auto"><table class="t8asmtbl"><thead><tr>${h}</tr></thead><tbody>${rows}</tbody></table></div>`;
const clean=s=>String(s||'').replace(/ \(.*\)/,'').trim(), base=s=>String(s||'').replace(' - Chi nhánh','').trim();
let C=null;
function build(){
  if(C)return C; const M=HS11.meta, L=M.last_day, D=M.days;
  const ALI=new Map(); T11.forEach(r=>{ if(((r.v['a|all']||{}).so||0)>0)return; const c=T11.find(q=>q!==r&&q.asm===r.asm&&base(q.npp)===base(r.npp)&&((q.v['a|all']||{}).so||0)>0); if(c)ALI.set(r.asm+'|'+r.ssn,c);});
  const sum=(a,f,t)=>{let s=0;for(let i=f;i<t;i++)s+=a[i];return s;};
  const R=HS11.rows.map(r=>{const t=T11[r[0]]; const al=ALI.get(t.asm+'|'+t.ssn)||t;
    return {asm:al.asm,npp:al.npp,ss:al.ssn,sr:r[1],code:r[2],cp:r[3],pc:r[4],ip:r[5],op:r[6],so:r[7],
      cpM:sum(r[3],0,L),pcM:sum(r[4],0,L),ipM:sum(r[5],0,L),opM:sum(r[6],0,L),soM:sum(r[7],0,L)*1e3,cpR:sum(r[3],L,D)};});
  const SSm=new Map(); R.forEach(r=>{const k=r.asm+'|'+r.ss; if(!SSm.has(k))SSm.set(k,{cp:0,pc:0}); const o=SSm.get(k);o.cp+=r.cpM;o.pc+=r.pcM;});
  const ef=[...SSm.values()].filter(o=>o.cp>0).map(o=>o.pc/o.cp).sort((a,b)=>a-b);
  const p75=ef.length?ef[Math.floor(ef.length*0.75)]:0.7;
  C={R,L,D,M,p75:Math.round(p75*1000)/10}; return C;
}
const tgt=()=>{const v=parseFloat(String(LS.g('tg')||'').replace(',','.')); return isNaN(v)?build().p75:v;};
const agg=(L)=>{const o={cp:0,pc:0,ip:0,op:0,so:0,cpR:0,n:L.length};L.forEach(r=>{o.cp+=r.cpM;o.pc+=r.pcM;o.ip+=r.ipM;o.op+=r.opM;o.so+=r.soM;o.cpR+=r.cpR;});return o;};
// SO thêm nếu đạt mục tiêu: từng ĐDKD dưới mục tiêu, trên call plan còn lại, × SO/PC của chính ĐDKD
const gain=(L)=>{const t=tgt()/100;let pc=0,so=0;L.forEach(r=>{const e=r.cpM?r.pcM/r.cpM:0; if(!r.cpM||e>=t)return; const add=(t-e)*r.cpR; pc+=add; so+=add*(r.pcM?r.soM/r.pcM:0);});return {pc,so};};
const sc=a=>S.asm==='all'||a===S.asm;
const DOW=['CN','T2','T3','T4','T5','T6','T7'];
function dayBlock(){
  const c=build(), M=c.M, rs=c.R.filter(r=>sc(r.asm)); let rows='';
  for(let j=0;j<M.days;j++){ const w=M.wd[j]; if(w===6)continue; const act=j<c.L;
    let cp=0,pc=0,ip=0,op=0,so=0; rs.forEach(r=>{cp+=r.cp[j];pc+=r.pc[j];ip+=r.ip[j];op+=r.op[j];so+=r.so[j]*1e3;});
    rows+=`<tr style="${act?'':'color:#64748b;background:#f8fafc'}"><td style="text-align:left"><b>${j+1}/11</b> ${DOW[w+1]}</td><td>${nf(cp,0)}</td><td>${act?nf(pc,0):'—'}</td><td>${act?'<b>'+pct(pc,cp)+'</b>':'—'}</td><td>${act?pct(ip,cp):'—'}</td><td>${act?nf(op,0):'—'}</td><td>${act?ty(so):'—'}</td><td>${act&&pc?nf(so/pc/1e6,2):'—'}</td></tr>`;}
  const a=agg(rs);
  rows+=`<tr class="tot" style="font-weight:700"><td style="text-align:left">MTD 1–${c.L}/11</td><td>${nf(a.cp,0)}</td><td>${nf(a.pc,0)}</td><td>${pct(a.pc,a.cp)}</td><td>${pct(a.ip,a.cp)}</td><td>${nf(a.op,0)}</td><td>${ty(a.so)}</td><td>${a.pc?nf(a.so/a.pc/1e6,2):'—'}</td></tr>`;
  const h=`<th style="${THL}">Ngày</th><th style="${TH}">Call plan (KH theo lịch MCP)</th><th style="${TH}">PC (đơn)</th><th style="${TH}">Hiệu suất PC/Call plan</th><th style="${TH}">KH đúng lịch có đơn / Call plan</th><th style="${TH}">KH ngoài lịch có đơn</th><th style="${TH}">SO (tỷ)</th><th style="${TH}">SO/PC (triệu)</th>`;
  return T(h,rows)+`<div class="pnote" style="margin-top:6px">Call plan = số KH có lịch viếng thăm ngày đó theo MCP T11 (cờ T2–T7, tần suất F2 tuần chẵn/lẻ, F4 hằng tuần, F8 hai buổi/tuần). PC = số đơn có phát sinh trong ngày. Ngày xám là call plan còn lại, chưa có số. Hiệu suất có thể &gt; "đúng lịch" vì có KH bán ngoài lịch.</div>`;
}
function asmBlock(){
  const c=build(), AS=window.GPX&&window.GPX.ASMS_?window.GPX.ASMS_():[...new Set(c.R.map(r=>r.asm))];
  const lab=a=>window.GPX&&window.GPX.lab?window.GPX.lab(a):a; const t=tgt()/100; let rows='';
  const ln=(name,L,tot)=>{const a=agg(L),g=gain(L),e=a.cp?a.pc/a.cp:0; return `<tr${tot?' class="tot" style="font-weight:700"':''}><td style="text-align:left;white-space:nowrap">${esc(name)}</td><td>${nf(a.cp,0)}</td><td>${nf(a.pc,0)}</td><td><b>${pct(a.pc,a.cp)}</b></td><td>${pct(a.ip,a.cp)}</td><td style="color:${e>=t?'#16a34a':'#dc2626'};font-weight:700">${nf((e-t)*100,1)} pp</td><td>${nf(a.cpR,0)}</td><td>+${nf(g.pc,0)}</td><td><b>+${ty(g.so)}</b></td></tr>`;};
  AS.forEach(a=>{rows+=ln(lab(a),c.R.filter(r=>r.asm===a));});
  rows+=ln('TOÀN MIỀN',c.R,true);
  const h=`<th style="${THL}">ASM</th><th style="${TH}">Call plan MTD</th><th style="${TH}">PC MTD</th><th style="${TH}">Hiệu suất</th><th style="${TH}">Đúng lịch có đơn</th><th style="${TH}">Chênh vs mục tiêu</th><th style="${TH}">Call plan còn lại (12–30/11)</th><th style="${TH}">PC thêm nếu đạt</th><th style="${TH}">SO thêm nếu đạt (tỷ)</th>`;
  return T(h,rows);
}
function drillBlock(){
  const c=build(), t=tgt()/100, rs=c.R.filter(r=>sc(r.asm)); const grp=new Map();
  rs.forEach(r=>{if(!grp.has(r.asm))grp.set(r.asm,new Map()); const g=grp.get(r.asm); const nk=r.npp; if(!g.has(nk))g.set(nk,new Map()); const s=g.get(nk); if(!s.has(r.ss))s.set(r.ss,[]); s.get(r.ss).push(r);});
  const lab=a=>window.GPX&&window.GPX.lab?window.GPX.lab(a):a;
  const cells=L=>{const a=agg(L),g=gain(L),e=a.cp?a.pc/a.cp:null,d=e==null?null:(e-t)*100;
    return `<td>${nf(a.cp,0)}</td><td>${nf(a.pc,0)}</td><td><b>${e==null?'—':nf(e*100,1)+'%'}</b></td><td>${pct(a.ip,a.cp)}</td><td>${nf(a.op,0)}</td><td style="color:${d==null?'':d>=0?'#16a34a':'#dc2626'};font-weight:700">${d==null?'—':(d>=0?'+':'')+nf(d,1)+' pp'}</td><td>+${nf(g.pc,0)}</td><td><b>+${ty(g.so)}</b></td>`;};
  const row=(lv,id,pid,name,L,show,kids)=>`<tr data-id="${esc(id)}" data-lv="${lv}" ${show?'':'hidden'} style="${lv===0?'font-weight:700;background:#f0f9ff':''}${lv===3?';font-size:12px':''}"><td style="text-align:left;white-space:normal;padding-left:${8+lv*16}px">${kids?`<span class="hst" style="cursor:pointer;color:#0369A1">${S.open.has(id)?'▾':'▸'}</span> `:'&nbsp;&nbsp;'}${esc(name)}</td>${cells(L)}</tr>`;
  let rows='';
  const gs=L=>gain(L).so;
  (window.GPX&&window.GPX.ASMS_?window.GPX.ASMS_().filter(a=>grp.has(a)):[...grp.keys()]).forEach(a=>{const g=grp.get(a),all=[];g.forEach(s=>s.forEach(l=>all.push(...l))); const ai='a|'+a; rows+=row(0,ai,'',lab(a),all,true,true);
    [...g.entries()].sort((p,q)=>gs([].concat(...[...q[1].values()]))-gs([].concat(...[...p[1].values()]))).forEach(([n,s])=>{const nid='n|'+a+'|'+n,nl=[].concat(...[...s.values()]); rows+=row(1,nid,ai,n,nl,S.open.has(ai),true);
      [...s.entries()].sort((p,q)=>gs(q[1])-gs(p[1])).forEach(([ss,l])=>{const sid='s|'+a+'|'+n+'|'+ss; const vis2=S.open.has(ai)&&S.open.has(nid); rows+=row(2,sid,nid,'SS '+ss,l,vis2,true);
        l.slice().sort((p,q)=>gain([q]).so-gain([p]).so).forEach(r=>{rows+=row(3,'r|'+r.code,sid,r.sr&&r.sr!==r.code?r.sr:r.code,[r],vis2&&S.open.has(sid),false);});});});});
  const h=`<th style="${THL}">ASM › NPP › SS › ĐDKD <span style="font-weight:400">(bấm ▸ để mở)</span></th><th style="${TH}">Call plan MTD</th><th style="${TH}">PC MTD</th><th style="${TH}">Hiệu suất</th><th style="${TH}">Đúng lịch có đơn</th><th style="${TH}">KH ngoài lịch có đơn</th><th style="${TH}">Chênh vs mục tiêu ${nf(tgt(),1)}%</th><th style="${TH}">PC thêm nếu đạt</th><th style="${TH}">SO thêm nếu đạt (tỷ)</th>`;
  return `<div style="margin-bottom:6px"><button id="hsOA" style="padding:4px 10px;border:1px solid #38BDF8;background:#fff;border-radius:6px;cursor:pointer">Mở hết</button> <button id="hsCA" style="padding:4px 10px;border:1px solid #38BDF8;background:#fff;border-radius:6px;cursor:pointer">Thu gọn</button></div>`+T(h,rows)+`<div class="pnote" style="margin-top:6px">SO thêm nếu đạt: mỗi ĐDKD dưới mục tiêu được kéo lên mục tiêu trên call plan còn lại (12–30/11) × SO/PC của chính ĐDKD đó; ĐDKD đã đạt ghi +0. Là ước tính, cộng được từ ĐDKD lên SS, NPP, ASM. Chưa trừ chồng lấn với PC/ASO ở tab "5 nhiệm vụ T11".</div>`;
}
function render(){
  const pg=document.getElementById('pgHs'); if(!pg||typeof T11==='undefined'||typeof HS11==='undefined')return;
  let host=document.getElementById('hsHost'); if(!host){host=document.createElement('div');host.id='hsHost';pg.appendChild(host);}
  const c=build(), rs=c.R.filter(r=>sc(r.asm)), a=agg(rs), g=gain(rs), AS=window.GPX&&window.GPX.ASMS_?window.GPX.ASMS_():[...new Set(c.R.map(r=>r.asm))];
  const lab=x=>window.GPX&&window.GPX.lab?window.GPX.lab(x):x;
  const sec=(n,t,b)=>`<div class="panel" style="margin-top:14px"><div class="tbl-head"><h3 style="display:inline;color:#0369A1">${n}. ${t}</h3></div>${b}</div>`;
  host.innerHTML=`<div class="panel" style="margin-top:14px;border-top:3px solid #0EA5E9"><div class="t8norm" style="margin-bottom:8px"><b>Hiệu suất bán hàng: PC / Call plan</b> · MCP T11 (${nf(c.M.mcp,0)} KH, bỏ Vãng lai) · đơn hàng đến hết <b>${c.M.asof}</b> (${T11_META.mtd_days} ngày làm việc đầu tháng)</div>
   <div class="fg"><label>Phạm vi</label><div class="seg" id="hsScope"><button data-v="all">Toàn Miền</button>${AS.map(x=>`<button data-v="${esc(x)}">${esc(lab(x))}</button>`).join('')}</div></div>
   <div style="margin:10px 0"><label style="display:inline-flex;gap:6px;align-items:center">Mục tiêu hiệu suất % <input id="hsTg" value="${nf(tgt(),1)}" inputmode="decimal" style="width:64px;text-align:right;border:1px solid #38BDF8;background:#f0f9ff;border-radius:6px;padding:4px 6px;font:inherit"></label> <span class="pnote" style="display:inline">mặc định = mức top 25% SS của Miền (${nf(c.p75,1)}%), sửa được</span></div>
   <div class="kpis" style="grid-template-columns:repeat(5,1fr)">`+
   card('Call plan MTD',nf(a.cp,0),'KH theo lịch MCP, 1–'+c.L+'/11')+
   card('PC MTD',nf(a.pc,0),'số đơn phát sinh')+
   card('Hiệu suất PC / Call plan',pct(a.pc,a.cp),'KH đúng lịch có đơn '+pct(a.ip,a.cp),a.pc/a.cp>=tgt()/100?'#16a34a':'#d97706')+
   card('Ngoài lịch có đơn',nf(a.op,0),pct(a.op,a.ip+a.op)+' KH-ngày có đơn nằm ngoài lịch MCP')+
   card('SO thêm nếu đạt '+nf(tgt(),1)+'%','+'+ty(g.so)+' tỷ','+'+nf(g.pc,0)+' PC trên '+nf(a.cpR,0)+' call plan còn lại')+`</div></div>`+
   sec(1,'Theo ngày: call plan, PC, hiệu suất',dayBlock())+sec(2,'Theo ASM',asmBlock())+sec(3,'Khoan sâu ASM → NPP → SS → ĐDKD',drillBlock());
  [...host.querySelectorAll('#hsScope button')].forEach(b=>b.classList.toggle('on',b.dataset.v===S.asm));
  host.querySelector('#hsScope').onclick=e=>{const b=e.target.closest('button');if(b){S.asm=b.dataset.v;render();}};
  host.querySelector('#hsTg').onchange=e=>{const v=parseFloat(e.target.value.replace(',','.')); LS.s('tg',isNaN(v)?'':String(v)); render();};
  host.querySelectorAll('tr[data-id] .hst').forEach(t=>{t.onclick=()=>{const id=t.closest('tr').dataset.id; if(S.open.has(id))S.open.delete(id);else S.open.add(id); render();};});
  host.querySelector('#hsOA').onclick=()=>{host.querySelectorAll('tr[data-id]').forEach(r=>S.open.add(r.dataset.id));render();};
  host.querySelector('#hsCA').onclick=()=>{S.open.clear();render();};
}
window.renderHs=function(){try{render();}catch(e){console.error('HS',e);}};
})();
