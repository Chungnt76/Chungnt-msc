/* Tab TĂNG DOANH SỐ T11 — bố cục giống tab Tăng doanh số KPI Studio (Team SS Pháp), dữ liệu toàn Miền Trung
   Nguồn: data/TDS11.js (file "data tăng doanh số Miền", MBS ONTOP T11/2026): 1 dòng = KH × chương trình
   [sri, mã KH, tên KH, ct(0 Mì/1 Chanté/2 Cà phê/3 Bia), DS nền, DS thực hiện (Paid + Invoiced), QualifiedLevel, điểm thưởng dự kiến]
   Chỉ tiêu = DS nền × mức tăng trưởng của chương trình · Đạt = DS thực hiện ≥ chỉ tiêu
   Thưởng dự kiến = điểm thưởng dự kiến (ONTOP) ÷ 100 = DS × hệ số điểm ÷ 100, giới hạn mức tối đa/KH */
(function(){
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const N0=n=>Math.round(n||0).toLocaleString('vi-VN');
const P1=(a,b)=>b?(a/b*100).toFixed(1).replace('.',',')+'%':'–';
const M1=n=>(Math.round((n||0)/1e5)/10).toLocaleString('vi-VN',{minimumFractionDigits:1,maximumFractionDigits:1});
const M2=n=>((n||0)/1e6).toLocaleString('vi-VN',{minimumFractionDigits:2,maximumFractionDigits:2});
const RW=v=>v>=1e6?M1(v)+' Tr':Math.round(v/1000).toLocaleString('vi-VN')+'k';
let WD=8, WT=25, PROG=WD/WT, MY={y:2026,m:11};
/* [mã, tên, màu thẻ, mức tăng trưởng, hệ số điểm, thưởng tối đa đ/KH, phạm vi] */
const GP=[[0,'Ngành Mì','linear-gradient(90deg,#c2500c,#2a1a10)',1.2,1,3e6,'Mì Omachi (trừ Sườn, Bò, Spa Bò dạng gói) + Kokomi 75 & 90 (gói, trộn gói)'],
          [1,'Chanté','linear-gradient(90deg,#1c3fb5,#10183a)',1.15,3,2e5,'nhãn Chanté'],
          [2,'Cà phê','linear-gradient(90deg,#6a2fe0,#2a1070)',1.3,0.8,0,'All Cà phê'],
          [3,'Bia các loại','linear-gradient(90deg,#0f766e,#083344)',1.2,3,1e6,'Bia các loại']];
const PCL=['nh','off','on','g'];
const S={asm:'',npp:'',ss:'',sr:'',pf:'all',open:new Set(),det:new Set(),st:'push'};
let SR=null, I=null;

function prep(){
  if(I&&prep.d===TDS11&&prep.v===(window.__mtv||0))return; prep.d=TDS11;prep.v=window.__mtv||0; S.open.clear(); S.det.clear();
  const M=TDS11.meta||{}; MY={y:M.y||2026,m:M.m||11}; if(M.wd_total){WD=M.wd_passed;WT=M.wd_total;} else {WD=8;WT=25;} PROG=WD/WT; SR=TDS11.sr.map(x=>({code:String(x[0]),name:x[1],asm:'Chưa gán SS',npp:'Chưa gán SS',ss:'Chưa gán SS'}));
  const look=new Map(); [typeof HVT11!=='undefined'?HVT11.sr:[],typeof COMBO11!=='undefined'?COMBO11.sr:[],typeof CBT11!=='undefined'?CBT11.sr:[]].forEach(L=>L.forEach(x=>{if(x[2]&&x[2]!=='Chưa gán SS')look.set(String(x[0]),x);}));
  SR.forEach(o=>{const x=look.get(o.code);if(x){o.asm=x[2];o.npp=x[3]||'—';o.ss=x[4]||'—';}});
  I=TDS11.rows.map(r=>{const p=GP[r[3]],ct=r[4]*p[3],th=r[5];return {o:SR[r[0]],c:String(r[1]),n:r[2],pg:r[3],base:r[4],ct,th,ok:th>0&&th>=ct-0.5,ql:r[6],rw:(r[7]||0)/100};});
}
const inScope=o=>(!S.asm||o.asm===S.asm)&&(!S.npp||o.npp===S.npp)&&(!S.ss||o.ss===S.ss)&&(!S.sr||o.code===S.sr);
const scopeLabel=()=>S.sr?(SR.find(o=>o.code===S.sr)||{}).name:S.ss?'SS '+S.ss:S.npp?'NPP '+S.npp:S.asm?'ASM '+S.asm:'Toàn Miền';
const sm=(L,f)=>L.reduce((a,x)=>a+(typeof f==='function'?f(x):x[f]||0),0);
const near=x=>!x.ok&&x.ct&&x.th/x.ct>=.7;

function filterHtml(){
  const all=SR, uq=(a,f)=>[...new Set(a.map(f))].sort((x,y)=>x.localeCompare(y,'vi'));
  const Nn=all.filter(o=>!S.asm||o.asm===S.asm), Ss=Nn.filter(o=>!S.npp||o.npp===S.npp), R=Ss.filter(o=>!S.ss||o.ss===S.ss).sort((a,b)=>String(a.name).localeCompare(String(b.name),'vi'));
  const sel=(k,list,lab,val=v=>v,txt=v=>v)=>`<select data-td-f="${k}"><option value="">${lab}</option>${list.map(v=>`<option value="${esc(val(v))}"${val(v)===S[k]?' selected':''}>${esc(txt(v))}</option>`).join('')}</select>`;
  const a=uq(all,o=>o.asm),n=uq(Nn,o=>o.npp),s=uq(Ss,o=>o.ss);
  return `<div class="flt"><b>Lọc:</b><button class="btn ${S.asm||S.npp||S.ss||S.sr?'':'on'}" data-td-reset="1">Toàn Miền</button>${sel('asm',a,`– Chọn ASM (${a.length}) –`)}${sel('npp',n,`– Chọn NPP (${n.length}) –`)}${sel('ss',s,`– Chọn SS (${s.length}) –`)}${sel('sr',R,`– Chọn ĐDKD (${R.length}) –`,o=>o.code,o=>o.name)}<span style="color:#6a7596">Đang xem: <b>${esc(scopeLabel())}</b></span></div>`;
}
function cells(L,tot){
  const kh=new Set(L.map(x=>x.c)).size,buy=L.filter(x=>x.th>0).length,ct=sm(L,'ct'),th=sm(L,'th'),ok=L.filter(x=>x.ok).length,nr=L.filter(near).length,rw=sm(L,'rw');
  const pl=(v,good)=>tot?`<b>${v}</b>`:`<span class="pill ${good?'':'o'}">${v}</span>`;
  return `<td>${N0(L.length)}<small class="s">${N0(kh)} KH</small></td><td>${N0(buy)}</td><td>${pl(P1(buy,L.length),L.length&&buy/L.length>=PROG)}</td><td>${M1(ct)}</td><td><b>${M1(th)}</b></td><td>${pl(P1(th,ct),ct&&th/ct>=PROG)}</td><td class="pos">${N0(ok)}</td><td>${P1(ok,L.length)}</td><td style="color:#a86500;font-weight:800">${N0(nr)}</td><td><b>${RW(rw)}</b></td>`;
}
const HEAD=first=>`<tr><th rowspan="2" class="g5" style="text-align:left">${first}</th><th colspan="3" class="g1">Khách hàng tham gia</th><th colspan="3" class="g2">Doanh số so với chỉ tiêu</th><th colspan="3" class="g3">Kết quả đạt chỉ tiêu</th><th rowspan="2" class="g6">Thưởng<br>dự kiến KH</th></tr><tr><th class="s1">Lượt KH</th><th class="s1">Đã mua</th><th class="s1">% mua</th><th class="s2">Chỉ tiêu</th><th class="s2">DS MTD</th><th class="s2">%TH</th><th class="s3">Đạt CT</th><th class="s3">% đạt</th><th class="s3">Gần đạt ≥70%</th></tr>`;

/* ---------- cây ---------- */
const LV=['asm','npp','ss'], LVN={asm:'ASM ',npp:'NPP ',ss:'SS '};
function levels(){const st=S.sr?3:S.ss?2:S.npp?1:S.asm?0:-1;return LV.slice(st+1);}
function tree(T){
  const L=levels();
  const mk=(arr,li,path)=>{ if(li>=L.length){const m=new Map();arr.forEach(h=>{const k=h.o.code;if(!m.has(k))m.set(k,[]);m.get(k).push(h);});return [...m].map(([c,a])=>({leaf:true,name:a[0].o.name,code:c,path:path+'|'+c,L:a}));}
    const m=new Map();arr.forEach(h=>{const k=h.o[L[li]];if(!m.has(k))m.set(k,[]);m.get(k).push(h);});
    return [...m].map(([k,a])=>({k,name:k,lv:L[li],path:path+'|'+k,L:a,kids:mk(a,li+1,path+'|'+k)}));};
  return mk(T,0,'');
}
function detail(L0){
  const st=S.st, f=x=>st==='all'?true:st==='push'?!x.ok:st==='near'?near(x):st==='none'?x.th<=0:x.ok;
  const L=L0.filter(f).sort((a,b)=>(b.ct-b.th)-(a.ct-a.th));
  const rows=L.slice(0,500).map(x=>{const pc=x.ct?x.th/x.ct:0,need=Math.max(x.ct-x.th,0);return `<tr><td class="nm" style="text-align:left">${esc(x.n)} <small style="color:#6a7596;font-weight:600">${esc(x.c)}</small></td><td><span class="pill ${PCL[x.pg]}">${esc(GP[x.pg][1])}</span></td><td>${M2(x.base)}</td><td>${M2(x.ct)}</td><td><b>${M2(x.th)}</b></td><td><span class="pill ${pc>=1?'':'o'}">${x.th>0?P1(x.th,x.ct):'Chưa mua'}</span></td><td class="${need?'neg':'pos'}">${need?M2(need):'✓'}</td><td>${x.rw?`<b class="pos">${N0(x.rw)}</b>`:'–'}</td></tr>`;}).join('');
  const bt=(k,t)=>`<button class="btn ${st===k?'on':''}" data-td-st="${k}">${t}</button>`;
  return `<div class="det"><div class="tools"><b class="lb">${esc(L0[0].o.name)} · ${N0(L0.length)} lượt KH</b>${bt('push','Chưa đạt CT')}${bt('near','Gần đạt (≥70%)')}${bt('none','Chưa mua')}${bt('ok','Đã đạt')}${bt('all','Tất cả')}</div><div class="wrap"><table class="st2"><thead><tr><th class="s1" style="text-align:left">Khách hàng</th><th class="s1">Chương trình</th><th class="s2">DS nền</th><th class="s2">Chỉ tiêu</th><th class="s3">DS MTD</th><th class="s3">%TH</th><th class="s4">Còn thiếu</th><th class="s6">Thưởng KH (đ)</th></tr></thead><tbody>${rows||'<tr><td colspan="8">Không có KH</td></tr>'}</tbody></table></div>${L.length>500?`<div class="note">Hiển thị 500/${N0(L.length)} lượt KH thiếu nhiều nhất.</div>`:''}</div>`;
}
function table1(T){
  const uS=new Set(T.map(x=>x.o.code)).size;
  let h=`<tr class="tot"><td class="nm">TỔNG (${N0(uS)} ĐDKD)</td>${cells(T,true)}</tr>`;
  const walk=(nodes,d)=>nodes.slice().sort((a,b)=>sm(b.L,'ct')-sm(a.L,'ct')).forEach(n=>{
    if(n.leaf){const op=S.det.has(n.code);h+=`<tr class="rep${d?' l'+Math.min(3,d):''}" data-td-det="${esc(n.code)}"><td class="nm">${op?'▾':'▸'} ${esc(n.name)}</td>${cells(n.L)}</tr>`+(op?`<tr><td colspan="30" class="dtd">${detail(n.L)}</td></tr>`:'');return;}
    const op=S.open.has(n.path);h+=`<tr class="${d===0?'team':'rep l'+d}" data-td-t="${esc(n.path)}"><td class="nm">${op?'▾':'▸'} ${d?LVN[n.lv]:''}${esc(n.name)} <small>(${N0(new Set(n.L.map(x=>x.o.code)).size)})</small></td>${cells(n.L)}</tr>`;if(op)walk(n.kids,d+1);});
  walk(tree(T),0);
  const pb=(k,t)=>`<button class="btn ${String(S.pf)===String(k)?'on':''}" data-td-pf="${k}">${t}</button>`;
  return `<div class="sec"><b>1</b>GẮN KẾT · THEO ASM / NPP / SS / ĐDKD</div><div class="ttl">Gắn kết theo ASM / NPP / SS / ĐDKD · ${S.pf==='all'?'Tất cả chương trình':esc(GP[S.pf][1])}<small>(Triệu, sau chiết khấu)</small></div>
  <div class="tools"><span class="lb">Chương trình:</span>${pb('all','Tất cả')}${GP.map(p=>pb(p[0],p[1])).join('')}</div>
  <div class="tools"><button class="btn" data-td-all="1">Mở hết ĐDKD</button><button class="btn" data-td-all="0">Thu gọn</button><button class="btn dark" data-td-shot="td-s1">📷 Chụp ảnh bảng</button></div>
  <div class="wrap" id="td-s1"><table><thead>${HEAD('ASM / NPP / SS / ĐDKD')}</thead><tbody>${h}</tbody></table></div>`;
}
function table2(T0){
  const rows=GP.map(p=>{const L=S.pf!=='all'&&String(S.pf)!==String(p[0])?[]:T0.filter(x=>x.pg===p[0]);return `<tr><td class="nm" style="text-align:left">${esc(p[1])}</td>${cells(L)}</tr>`;}).join('');
  const T=S.pf==='all'?T0:T0.filter(x=>String(x.pg)===String(S.pf));
  return `<div class="sec o"><b>2</b>GẮN KẾT · THEO CHƯƠNG TRÌNH</div><div class="ttl">Gắn kết theo chương trình · ${esc(scopeLabel())}<small>(Triệu)</small></div>
  <div class="tools"><button class="btn dark" data-td-shot="td-s2">📷 Chụp ảnh bảng</button></div>
  <div class="wrap" id="td-s2"><table><thead>${HEAD('Chương trình')}</thead><tbody>${rows}<tr class="tot"><td class="nm" style="text-align:left">Tổng Gắn kết</td>${cells(T,true)}</tr></tbody></table></div>
  <div class="note">Chỉ tiêu = DS nền × mức tăng trưởng: Mì ≥120% · Chanté ≥115% · Cà phê ≥130% · Bia ≥120%. DS nền = DS bình quân T7–T9/2026 của chính KH; DS MTD = DS thực hiện (Paid + Invoiced) đến ${TDS11.meta.asof}. Đạt CT = DS MTD ≥ chỉ tiêu. Thưởng dự kiến = điểm thưởng dự kiến ONTOP trong file ÷ 100 (DS tích lũy × hệ số điểm: Mì 1 · Chanté 3 · Cà phê 0,8 · Bia 3; tối đa Mì 3.000.000đ · Chanté 200.000đ · Bia 1.000.000đ/KH; Cà phê không giới hạn), chỉ tính KH đã đạt. Gần đạt = %TH ≥ 70% chỉ tiêu. Bấm vào ĐDKD để khoan xuống từng cửa hàng.</div>`;
}

function render(){
  const root=$('tdsv11'), y=window.scrollY, T0=I.filter(x=>inScope(x.o)), T=S.pf==='all'?T0:T0.filter(x=>String(x.pg)===String(S.pf));
  const ct=sm(T,'ct'),th=sm(T,'th'),ok=T.filter(x=>x.ok).length,nr=T.filter(near).length,buy=T.filter(x=>x.th>0).length,rw=sm(T,'rw');
  const qlDiff=T.filter(x=>x.ok&&!x.ql).length;
  const pcard=GP.map(p=>{const L=T0.filter(x=>x.pg===p[0]),o=L.filter(x=>x.ok),b=L.filter(x=>x.th>0);
    return `<div class="pc ${String(S.pf)===String(p[0])?'sel':''}" data-td-pf="${p[0]}" style="cursor:pointer"><div class="hd" style="background:${p[2]}"><b>${esc(p[1])}</b><span>${N0(L.length)} lượt KH trong danh sách</span></div><div class="bd"><div class="rule">Chỉ tiêu tăng trưởng <b>≥${Math.round(p[3]*100)}%</b></div><div class="gift" style="font-size:12px">${String(p[4]).replace('.',',')} điểm / 1 đ DS · ${p[5]?'tối đa '+N0(p[5])+' đ/KH':'không giới hạn'}</div><div class="mx" style="font-weight:600;color:#6a7596">${esc(p[6])}</div><div class="st"><div><b>${N0(L.length)}</b><small>KH áp dụng</small></div><div><b>${N0(b.length)}</b><small>KH đã mua</small></div><div><b>${N0(o.length)}</b><small>KH đạt CT</small></div><div><b>${RW(sm(L,'rw')).replace(' Tr','M')}</b><small>Thưởng KH</small></div></div></div></div>`;}).join('');
  root.innerHTML=`<div class="h1">GẮN KẾT – TĂNG DOANH SỐ – THÁNG ${MY.m}/${MY.y}</div><div class="sub">Tính từ file data tăng doanh số Miền (MBS ONTOP) đến ${TDS11.meta.asof} · ${esc(scopeLabel())} · tiến độ thời gian ${P1(WD,WT)}</div>${filterHtml()}
  <div class="ttl" style="background:linear-gradient(90deg,#1f6f5f,#1c4d44);font-size:20px">A · GẮN KẾT – TĂNG DOANH SỐ<small>Chỉ tiêu theo từng KH · 4 chương trình</small></div>
  <div class="cards k4"><div class="kc"><small>KH tham gia gắn kết</small><b>${N0(T.length)}</b><span>${N0(new Set(T.map(x=>x.c)).size)} KH · ${S.pf==='all'?'tất cả chương trình':esc(GP[S.pf][1])}</span></div>
  <div class="kc c2"><small>DS tích lũy / chỉ tiêu</small><b>${P1(th,ct)}</b><div class="bar"><i style="width:${Math.min(100,ct?th/ct*100:0)}%"></i></div><span>${M1(th)} / ${M1(ct)} Tr · tiến độ ${P1(WD,WT)}</span></div>
  <div class="kc c3"><small>Lượt KH đã đạt chỉ tiêu</small><b style="color:#168a52">${N0(ok)}</b><span>Đã mua ${N0(buy)} (${P1(buy,T.length)}) · gần đạt (≥70%) ${N0(nr)}</span></div>
  <div class="kc c4"><small>Thưởng dự kiến cho KH</small><b>${RW(rw)}</b><span>Tính trên DS đã đạt chỉ tiêu · 100 điểm = 1 đ</span></div></div>
  <div class="banner" style="font-size:22px;background:linear-gradient(90deg,#3f6b1a,#7aa63a)">CHƯƠNG TRÌNH GẮN KẾT · BẤM THẺ ĐỂ LỌC</div><div class="cards k4">${pcard}</div>
  ${table1(T)}${table2(T0)}
  ${qlDiff?`<div class="note">Lưu ý: ${N0(qlDiff)} lượt KH đã có DS ≥ chỉ tiêu (đã có điểm thưởng dự kiến) nhưng cột QualifiedLevel trong file vẫn = 0; tab tính theo doanh số.</div>`:''}`;
  window.scrollTo(0,y);
}
function shot(id,btn){const el=$(id);if(!el)return;const go=()=>{const o=btn.textContent;btn.textContent='Đang chụp…';const box=el.style.cssText,w=el.scrollWidth;el.style.overflow='visible';el.style.maxHeight='none';el.style.width=w+'px';
  window.html2canvas(el,{scale:2,backgroundColor:'#ffffff',width:w,windowWidth:w+40}).then(c=>{el.style.cssText=box;const a=document.createElement('a');a.download='TangDS_T11_'+scopeLabel().replace(/\s+/g,'_')+'.png';a.href=c.toDataURL('image/png');a.click();btn.textContent=o;}).catch(()=>{el.style.cssText=box;btn.textContent=o;});};
  if(window.html2canvas)return go();const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';s.onload=go;s.onerror=()=>alert('Không tải được công cụ chụp ảnh, kiểm tra mạng.');document.head.appendChild(s);}
function init(){
  const root=$('tdsv11'); if(root._i)return; root._i=1; prep();
  root.addEventListener('change',e=>{const f=e.target.dataset.tdF;if(!f)return;S[f]=e.target.value;const o=['asm','npp','ss','sr'];o.slice(o.indexOf(f)+1).forEach(k=>S[k]='');S.open.clear();S.det.clear();render();});
  root.addEventListener('click',e=>{const t=e.target;let x;
    if(x=t.closest('[data-td-reset]')){S.asm=S.npp=S.ss=S.sr='';S.open.clear();S.det.clear();return render();}
    if(x=t.closest('[data-td-pf]')){const v=x.dataset.tdPf;S.pf=v==='all'||String(S.pf)===v&&x.classList.contains('pc')?'all':+v;return render();}
    if(x=t.closest('[data-td-st]')){S.st=x.dataset.tdSt;return render();}
    if(x=t.closest('[data-td-shot]'))return shot(x.dataset.tdShot,x);
    if(x=t.closest('[data-td-all]')){S.det.clear();if(x.dataset.tdAll==='1'){const rec=ns=>ns.forEach(n=>{if(!n.leaf){S.open.add(n.path);rec(n.kids);}});rec(tree(I.filter(h=>inScope(h.o))));}else S.open.clear();return render();}
    if(x=t.closest('tr[data-td-t]')){const p=x.dataset.tdT;S.open.has(p)?S.open.delete(p):S.open.add(p);return render();}
    if(x=t.closest('tr[data-td-det]')){const c=x.dataset.tdDet;S.det.has(c)?S.det.delete(c):S.det.add(c);return render();}
  });
}
window.renderTds=function(){try{if(typeof TDS11==='undefined'||!$('tdsv11'))return;init();render();}catch(e){console.error('TDS',e);}};
})();
