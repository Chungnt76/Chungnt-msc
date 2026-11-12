/* Tab HỘI VIÊN TẾT T11 — bố cục giống tab Hội viên KPI Studio (Team SS Pháp), dữ liệu toàn Miền Trung
   Nguồn: data/HVT11.js (file PERFORMANCE CHI TIẾT THEO NHÃN HÀNG (HỘI VIÊN) · MBS TẾT 2027)
   1 dòng KH: [sri, mã KH, tên, loại(0 VIP/1 VIP Đại sứ), đơn chờ, DS (cột L newsale), chỉ tiêu nền (cột Q), QualifiedLevel, point, reward, Chanté, Chinsu, Kokomi, Nam Ngư (cột J SALE2), type(0 Lẻ/1 VIP3/2 VIP5/3 VIP Sỉ)]
   NV1 = DS cột L ≥ 95% chỉ tiêu nền (M1 ≥95%, M2 ≥100%, M3 ≥105%)
   NV2 = cột J 4 nhãn trọng điểm: VIP Đại sứ mỗi nhãn ≥150k · VIP tổng 4 nhãn ≥500k
   Đủ ĐK xét thưởng = NV1 + NV2 (khớp QualifiedLevel của hệ thống). Thưởng ước tính = DS × 1,2% / 1,5% / 2,0% theo M1/M2/M3. */
(function(){
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const N0=n=>Math.round(n||0).toLocaleString('vi-VN');
const P1=(a,b)=>b?(a/b*100).toFixed(1).replace('.',',')+'%':'–';
const M1=n=>(Math.round((n||0)/1e5)/10).toLocaleString('vi-VN',{minimumFractionDigits:1,maximumFractionDigits:1});
const BR=['Chanté','Chinsu','Kokomi','Nam Ngư'], NVB=150000, NVT=500000; let WD=8, WT=25, PROG=WD/WT, AS='11/11', MY={y:2026,m:11};
const S={asm:'',npp:'',ss:'',sr:'',tab:'all',open:new Set(),det:new Set(),fl:'push'};
let SR=null, K=null;

function prep(){
  if(K&&prep.d===HVT11&&prep.v===(window.__mtv||0))return; prep.d=HVT11;prep.v=window.__mtv||0; S.open.clear(); S.det.clear();
  const M=HVT11.meta||{}; AS=M.asof||'11/11'; MY={y:M.y||2026,m:M.m||11}; if(M.wd_total){WD=M.wd_passed;WT=M.wd_total;} else {WD=8;WT=25;} PROG=WD/WT; SR=new Map();
  HVT11.sr.forEach((x,i)=>{const c=String(x[0]);SR.set(i,{i,code:c,name:x[1],asm:x[2]||'—',npp:x[3]||'—',ss:x[4]||'—'});});
  K=HVT11.rows.map(r=>{const b=[r[10],r[11],r[12],r[13]],ds=r[5]||0,base=r[6]||0,isDs=r[3]===1,pct=base?ds/base:0,sum4=b.reduce((a,v)=>a+(v||0),0);
    const lvl=pct>=1.05?3:pct>=1?2:pct>=.95?1:0, ok4=b.every(v=>v>=NVB), nv2=isDs?ok4:sum4>=NVT, ok=lvl>0&&nv2;
    return {o:SR.get(r[0]),c:String(r[1]),n:r[2],isDs,ds,base,pct,lvl,b,oth:Math.max(ds-sum4,0),sum4,ok4:isDs&&ok4,nv2,ok,ql:r[7]||0,vc:r[14]||0,pd:r[4]||0,
      m3:base*1.05,th:ok?ds*(lvl===3?.02:lvl===2?.015:.012):0,nhip:ds>0&&pct>=.7*PROG};});
}
const inScope=o=>(!S.asm||o.asm===S.asm)&&(!S.npp||o.npp===S.npp)&&(!S.ss||o.ss===S.ss)&&(!S.sr||o.code===S.sr);
const scopeLabel=()=>S.sr?([...SR.values()].find(o=>o.code===S.sr)||{}).name:S.ss?'SS '+S.ss:S.npp?'NPP '+S.npp:S.asm?'ASM '+S.asm:'Toàn Miền';
const sm=(L,f)=>L.reduce((a,x)=>a+(typeof f==='function'?f(x):x[f]||0),0);

function filterHtml(){
  const all=[...SR.values()].filter(o=>o.asm!=='—'), uq=(a,f)=>[...new Set(a.map(f))].sort((x,y)=>x.localeCompare(y,'vi'));
  const Nn=all.filter(o=>!S.asm||o.asm===S.asm), Ss=Nn.filter(o=>!S.npp||o.npp===S.npp), Rr=Ss.filter(o=>!S.ss||o.ss===S.ss).sort((a,b)=>String(a.name).localeCompare(String(b.name),'vi'));
  const seen=new Set(), R=Rr.filter(o=>!seen.has(o.code)&&seen.add(o.code));
  const sel=(k,list,lab,val=v=>v,txt=v=>v)=>`<select data-hv-f="${k}"><option value="">${lab}</option>${list.map(v=>`<option value="${esc(val(v))}"${val(v)===S[k]?' selected':''}>${esc(txt(v))}</option>`).join('')}</select>`;
  const a=uq(all,o=>o.asm),n=uq(Nn,o=>o.npp),s=uq(Ss,o=>o.ss);
  return `<div class="flt"><b>Lọc:</b><button class="btn ${S.asm||S.npp||S.ss||S.sr?'':'on'}" data-hv-reset="1">Toàn Miền</button>${sel('asm',a,`– Chọn ASM (${a.length}) –`)}${sel('npp',n,`– Chọn NPP (${n.length}) –`)}${sel('ss',s,`– Chọn SS (${s.length}) –`)}${sel('sr',R,`– Chọn ĐDKD (${R.length}) –`,o=>o.code,o=>o.name)}<span style="color:#6a7596">Đang xem: <b>${esc(scopeLabel())}</b></span></div>`;
}

/* ---------- Thẻ ---------- */
function topCards(T){
  const dsn=T.filter(h=>h.isDs), ct=sm(T,'base'), th=sm(T,'ds'), buy=T.filter(h=>h.ds>0).length, lv=n=>T.filter(h=>h.lvl>=n).length, x=T.filter(h=>h.lvl>0&&!h.nv2);
  return `<div class="cards k5"><div class="kc"><small>Khách hàng hội viên</small><b>${N0(T.length)}</b><span>VIP ${N0(T.length-dsn.length)} · VIP Đại sứ ${N0(dsn.length)} · đã mua ${N0(buy)} (${P1(buy,T.length)})</span></div>
  <div class="kc c2"><small>Doanh số / chỉ tiêu nền</small><b>${P1(th,ct)}</b><div class="bar"><i style="width:${Math.min(100,ct?th/ct*100:0)}%"></i></div><span>${M1(th)} / ${M1(ct)} Tr · mục tiêu Mức 3: ${M1(sm(T,'m3'))} Tr</span></div>
  <div class="kc c3"><small>NV1 · KH đạt ≥95% chỉ tiêu nền</small><b>${N0(lv(1))}</b><span>Mức 2 (≥100%): ${N0(lv(2))} · Mức 3 (≥105%): ${N0(lv(3))}</span></div>
  <div class="kc win"><small>🏆 KH ĐÃ ĐẠT THƯỞNG (NV1 + NV2)</small><b>${N0(T.filter(h=>h.ok).length)} KH</b><em>${P1(T.filter(h=>h.ok).length,T.length)} KH hội viên · thưởng ước tính ${M1(sm(T,'th'))} Tr</em><span>Mức 1: ${N0(T.filter(h=>h.ok&&h.lvl===1).length)} · Mức 2: ${N0(T.filter(h=>h.ok&&h.lvl===2).length)} · Mức 3: ${N0(T.filter(h=>h.ok&&h.lvl===3).length)} · VIP ${N0(T.filter(h=>h.ok&&!h.isDs).length)} · Đại sứ ${N0(dsn.filter(h=>h.ok).length)}</span><span>Đại sứ đủ 4 nhãn ≥150k: ${N0(dsn.filter(h=>h.ok4).length)} / ${N0(dsn.length)}</span></div>
  <div class="kc c3"><small>⚠ Đạt NV1 – chưa đạt NV2</small><b>${N0(x.length)} KH</b><span>DS đạt nền nhưng chưa được thưởng ${M1(sm(x,'ds'))} Tr · thiếu nhãn trọng điểm</span></div></div>`;
}
function grpCards(title,cls,L,isDs){
  const c=sm(L,'base'),t=sm(L,'ds'),b=L.filter(h=>h.ds>0).length,l=n=>L.filter(h=>h.lvl>=n).length,ok=L.filter(h=>h.ok).length,x=L.filter(h=>h.lvl>0&&!h.nv2);
  return `<div class="sec ${cls}"><b>★</b>${title} · ${N0(L.length)} KH</div><div class="cards k5"><div class="kc"><small>Số KH · đã mua</small><b>${N0(L.length)}</b><span>Đã mua ${N0(b)} (${P1(b,L.length)}) · chưa mua ${N0(L.length-b)}</span></div>
  <div class="kc c2"><small>Doanh số / chỉ tiêu nền</small><b>${P1(t,c)}</b><div class="bar"><i style="width:${Math.min(100,c?t/c*100:0)}%"></i></div><span>${M1(t)} / ${M1(c)} Tr · Mức 3: ${M1(sm(L,'m3'))} Tr</span></div>
  <div class="kc c3"><small>KH theo mức đạt</small><b>${N0(l(1))}</b><span>≥95%: ${N0(l(1))} · Mức 2 (≥100%): ${N0(l(2))} · Mức 3 (≥105%): ${N0(l(3))}</span></div>
  <div class="kc win"><small>🏆 KH ĐÃ ĐẠT THƯỞNG</small><b>${N0(ok)} KH</b><em>${P1(ok,L.length)} · thưởng ước tính ${M1(sm(L.filter(h=>h.ok),'th'))} Tr</em><span>${isDs?'Đủ 4 nhãn ≥150k: '+N0(L.filter(h=>h.ok4).length)+' / '+N0(L.length):'Đạt NV2 (500k từ 4 nhãn): '+N0(L.filter(h=>h.nv2).length)} · M1 ${N0(L.filter(h=>h.ok&&h.lvl===1).length)} · M2 ${N0(L.filter(h=>h.ok&&h.lvl===2).length)} · M3 ${N0(L.filter(h=>h.ok&&h.lvl===3).length)}</span></div>
  <div class="kc c3"><small>⚠ Đạt NV1 – chưa NV2</small><b>${N0(x.length)} KH</b><span>DS chưa được thưởng ${M1(sm(x,'ds'))} Tr</span></div></div>`;
}

/* ---------- 1. Bảng theo đơn vị ---------- */
const LV=['asm','npp','ss'];
function levels(){const st=S.sr?3:S.ss?2:S.npp?1:S.asm?0:-1;return LV.slice(st+1);}
function tree(T){
  const L=levels();
  const mk=(arr,li,path)=>{ if(li>=L.length){const m=new Map();arr.forEach(h=>{const k=h.o.code;if(!m.has(k))m.set(k,[]);m.get(k).push(h);});return [...m].map(([c,a])=>({leaf:true,name:a[0].o.name,code:c,path:path+'|'+c,L:a}));}
    const m=new Map();arr.forEach(h=>{const k=h.o[L[li]];if(!m.has(k))m.set(k,[]);m.get(k).push(h);});
    return [...m].map(([k,a])=>({k,name:k,lv:L[li],path:path+'|'+k,L:a,kids:mk(a,li+1,path+'|'+k)}));};
  return mk(T,0,'');
}
const LVN={asm:'ASM ',npp:'NPP ',ss:'SS '};
function cells(L,tot){
  const ds=L.filter(h=>h.isDs),ct=sm(L,'base'),th=sm(L,'ds'),m3=sm(L,'m3'),buy=L.filter(h=>h.ds>0).length,pl=(v,good)=>tot?`<b>${v}</b>`:`<span class="pill ${good?'':'o'}">${v}</span>`;
  return `<td>${N0(L.length)}<small class="s">VIP ${N0(L.length-ds.length)} · ĐS ${N0(ds.length)}</small></td><td>${N0(buy)}</td><td>${pl(P1(buy,L.length),L.length&&buy/L.length>=.3)}</td><td>${M1(ct)}</td><td><b>${M1(th)}</b></td><td>${pl(P1(th,ct),ct&&th/ct>=1)}</td><td class="${th-m3<0?'neg':'pos'}">${M1(th-m3)}</td>`+
   `<td>${N0(L.filter(h=>h.lvl>=1).length)}</td><td>${N0(L.filter(h=>h.lvl>=2).length)}</td><td>${N0(L.filter(h=>h.lvl>=3).length)}</td><td>${N0(L.filter(h=>h.ok4).length)} / ${N0(ds.length)}</td>`+
   `<td class="winc">${(()=>{const n=L.filter(h=>h.ok).length;return n?`<span class="winp">🏆 ${N0(n)} KH</span>`:'<span class="pill g">0 KH</span>';})()}</td>`+
   [1,2,3,0].map(v=>`<td>${N0(L.filter(h=>h.vc===v).length)}</td>`).join('')+
   `<td>${N0(L.filter(h=>h.lvl>0).length)}</td><td>${N0(L.filter(h=>h.nv2).length)}</td><td>${(()=>{const n=L.filter(h=>h.lvl>0&&!h.nv2).length;return n?`<b class="neg">${N0(n)}</b>`:0;})()}</td><td>${N0(sm(L,'th'))}</td><td>${N0(L.filter(h=>h.nhip).length)}</td>`;
}
function detail(code,L0){
  const fl=S.fl, L=L0.filter(h=>fl==='all'?true:fl==='none'?h.ds<=0:fl==='m1'?h.lvl>=1:fl==='nv2'?h.lvl>0&&!h.nv2:fl==='win'?h.ok:h.ds<h.m3).sort((a,b)=>(b.m3-b.ds)-(a.m3-a.ds));
  const mo=v=>v>0?`<span class="pos">${v>=1e6?M1(v):Math.round(v/1000)+'k'}</span>`:'–';
  const rows=L.slice(0,400).map(h=>{const need=Math.max(h.m3-h.ds,0),n95=Math.max(h.base*.95-h.ds,0),nb=h.b.filter(v=>v>=NVB).length;
    const miss=h.isDs?BR.filter((n,i)=>h.b[i]<NVB):[], nv2t=h.nv2?'<span class="pos">Đạt</span>':h.isDs?`<span class="neg">Thiếu ${esc(miss.join(', '))}</span>`:`<span class="neg">Thiếu ${M1(NVT-h.sum4)} Tr</span>`;
    return `<tr><td class="nm" style="text-align:left">${esc(h.n)} <small style="color:#6a7596;font-weight:600">${esc(h.c)}</small></td><td><span class="tp ${h.isDs?'ds':''}">${h.isDs?'Đại sứ':'VIP'}</span></td><td>${M1(h.base)}</td><td>${h.ds?M1(h.ds):'0,0'}</td><td><span class="pill ${h.pct>=1?'':'o'}">${P1(h.pct,1)}</span></td><td class="${n95?'neg':'pos'}">${n95?M1(n95):'✓'}</td><td class="${need?'neg':'pos'}">${need?M1(need):'✓'}</td>${h.b.map(mo).join('')}<td>${mo(h.oth)}</td><td>${h.ok?'<span class="winp">🏆 M'+h.lvl+'</span>':h.lvl?'M'+h.lvl:'–'}${h.isDs?`<small class="s">${nb}/4 nhãn</small>`:''}</td><td style="text-align:left;font-size:11.5px">${nv2t}</td></tr>`;}).join('');
  const fb=(k,t)=>`<button class="btn ${fl===k?'on':''}" data-hv-fl="${k}">${t}</button>`;
  return `<div class="det"><div class="tools"><b class="lb">${esc(L0[0].o.name)} · ${N0(L0.length)} KH hội viên</b>${fb('push','Cần đẩy (dưới 105%)')}${fb('none','Chưa mua')}${fb('m1','Đạt M1+')}${fb('win','🏆 Đã đạt thưởng')}${fb('nv2','Đạt NV1 – chưa NV2')}${fb('all','Tất cả')}</div><div class="wrap"><table class="st2"><thead><tr><th>Khách hàng</th><th>Loại</th><th>CT nền</th><th>Đã mua</th><th>%</th><th>Thiếu đến 95%</th><th>Thiếu đến 105% (M3)</th><th>Chanté</th><th>Chinsu</th><th>Kokomi</th><th>Nam Ngư</th><th>Others</th><th>Mức</th><th>NV2 · 4 nhãn</th></tr></thead><tbody>${rows||'<tr><td colspan="14">Không có KH phù hợp</td></tr>'}</tbody></table></div>${L.length>400?`<div class="note">Hiển thị 400/${N0(L.length)} KH.</div>`:''}</div>`;
}
function table1(T){
  let h=`<tr class="tot"><td class="nm">TỔNG (${N0(new Set(T.map(x=>x.o.code)).size)} ĐDKD)</td>${cells(T,true)}</tr>`;
  const walk=(nodes,d)=>nodes.slice().sort((a,b)=>sm(b.L,'base')-sm(a.L,'base')).forEach(n=>{
    if(n.leaf){const op=S.det.has(n.code);h+=`<tr class="rep${d?' l'+Math.min(3,d):''}" data-hv-det="${esc(n.code)}"><td class="nm">${op?'▾':'▸'} ${esc(n.name)}</td>${cells(n.L)}</tr>`+(op?`<tr><td colspan="30" class="dtd">${detail(n.code,n.L)}</td></tr>`:'');return;}
    const op=S.open.has(n.path);h+=`<tr class="${d===0?'team':'rep l'+d}" data-hv-t="${esc(n.path)}"><td class="nm">${op?'▾':'▸'} ${d?LVN[n.lv]:''}${esc(n.name)} <small>(${N0(new Set(n.L.map(x=>x.o.code)).size)})</small></td>${cells(n.L)}</tr>`;if(op)walk(n.kids,d+1);});
  walk(tree(T),0);
  return `<div class="sec"><b>1</b>THEO ASM / NPP / SS / ĐDKD</div><div class="ttl">Hội viên Tết theo ASM / NPP / SS / ĐDKD<small>(Triệu, sau chiết khấu)</small></div>
  <div class="tools"><button class="btn" data-hv-all="1">Mở hết ĐDKD</button><button class="btn" data-hv-all="0">Thu gọn</button><button class="btn dark" data-hv-shot="hv-s1">📷 Chụp ảnh bảng</button></div>
  <div class="wrap" id="hv-s1"><table><thead><tr><th rowspan="2" class="g5" style="text-align:left">ASM / NPP / SS / ĐDKD</th><th colspan="3" class="g1">Khách hàng hội viên</th><th colspan="4" class="g2">Doanh số so với chỉ tiêu nền</th><th colspan="3" class="g3">Số KH theo mức đạt</th><th class="g4">VIP Đại sứ</th><th rowspan="2" class="g5 winh">🏆 KH ĐÃ<br>ĐẠT THƯỞNG</th><th colspan="4" class="g1">Phân loại KH (Type)</th><th colspan="3" class="g3">Nhiệm vụ</th><th colspan="2" class="g2">Thưởng &amp; nhịp</th></tr><tr><th class="s1">Tổng KH</th><th class="s1">Đã mua</th><th class="s1">% mua</th><th class="s2">CT nền</th><th class="s2">Thực hiện</th><th class="s2">%TH</th><th class="s2">Còn thiếu đến 105%</th><th class="s3">≥95% (M1)</th><th class="s3">≥100% (M2)</th><th class="s3">≥105% (M3)</th><th class="s4">Đủ 4 nhãn ≥150k</th><th class="s1">VIP3</th><th class="s1">VIP5</th><th class="s1">VIP Sỉ</th><th class="s1">Lẻ</th><th class="s3">Đạt NV1 (DS)</th><th class="s3">Đạt NV2 (nhãn)</th><th class="s3">NV1 đạt – NV2 chưa</th><th class="s2">Thưởng ước tính (đ)</th><th class="s2">Bám nhịp</th></tr></thead><tbody>${h}</tbody></table></div>
  <div class="note">Thực hiện = DS cột L (newsale) · %TH so với chỉ tiêu nền; tiến độ thời gian ${P1(WD,WT)} (${WD}/${WT} ngày). Mức đạt NV1: M1 ≥95%, M2 ≥100%, M3 ≥105% — <b>mục tiêu theo dõi là Mức 3 (105%)</b>. NV2 theo cột J (SALE2): VIP Đại sứ đủ 4 nhãn Chanté, Chinsu, Kokomi, Nam Ngư mỗi nhãn ≥150.000đ · VIP tổng 4 nhãn ≥500.000đ. KH đủ ĐK xét thưởng = đạt cả NV1 và NV2 (khớp QualifiedLevel của hệ thống). Thưởng ước tính = DS × 1,2% / 1,5% / 2,0% theo M1/M2/M3. Bám nhịp = KH đã mua có %TH ≥ 70% tiến độ thời gian. Bấm vào ĐDKD để xem từng cửa hàng.</div>`;
}

/* ---------- 2. Theo nhãn hàng ---------- */
function table2(T){
  const calc=(L,k)=>{const v=L.map(h=>k===4?h.oth:h.b[k]||0);return {ds:v.reduce((a,b)=>a+b,0),n:v.filter(x=>x>0).length,k:v.filter(x=>x>=NVB).length};};
  const grp=[['VIP',T.filter(h=>!h.isDs)],['VIP Đại sứ',T.filter(h=>h.isDs)],['Tổng',T]];
  return `<div class="sec o"><b>2</b>THEO NHÃN HÀNG</div><div class="ttl">Doanh số hội viên theo nhãn hàng<small>(Triệu, sau chiết khấu · ${esc(scopeLabel())})</small></div>
  <div class="tools"><button class="btn dark" data-hv-shot="hv-s2">📷 Chụp ảnh bảng</button></div>
  <div class="wrap" id="hv-s2"><table class="bt"><thead><tr><th rowspan="2" class="g5" style="text-align:left">Nhóm hội viên</th>${BR.map(b=>`<th colspan="3" class="g5">${b}</th>`).join('')}<th colspan="3" class="g5">Others</th><th rowspan="2" class="g5">Tổng DS</th></tr><tr>${[0,1,2,3,4].map(()=>'<th class="s1">Doanh số</th><th class="s1">KH mua</th><th class="s1">KH ≥150k</th>').join('')}</tr></thead><tbody>${grp.map(([n,L],i)=>`<tr class="${i==2?'tt':''}"><td class="nm" style="text-align:left">${n}<small class="s">${N0(L.length)} KH</small></td>${[0,1,2,3,4].map(k=>{const c=calc(L,k);return `<td>${M1(c.ds)}</td><td>${N0(c.n)}</td><td>${k===4?'–':N0(c.k)}</td>`;}).join('')}<td><b>${M1(sm(L,'ds'))}</b></td></tr>`).join('')}</tbody></table></div>
  <div class="note">Doanh số từng nhãn = cột J (SALE2). "Others" = doanh số ngoài 4 nhãn trọng điểm. KH ≥150k = số KH mua nhãn đó từ 150.000đ (điều kiện 4 nhãn trọng điểm của VIP Đại sứ).</div>`;
}

/* ---------- 3. Đạt NV1 – chưa NV2 ---------- */
function table3(T){
  const X=T.filter(h=>h.lvl>0&&!h.nv2), xd=X.filter(h=>h.isDs), xv=X.filter(h=>!h.isDs);
  const brRows=BR.map((b,i)=>{const L=xd.filter(h=>h.b[i]<NVB);return `<tr><td class="nm" style="text-align:left">⚠ ${b}</td><td class="neg">${N0(L.length)}</td><td>${M1(sm(L,h=>NVB-Math.min(h.b[i],NVB)))}</td><td>${M1(sm(L,'ds'))}</td></tr>`;}).join('');
  const L=X.slice().sort((a,b)=>b.ds-a.ds).slice(0,30);
  const rows=L.map(h=>{const miss=h.isDs?'Thiếu nhãn: '+BR.filter((n,i)=>h.b[i]<NVB).join(', '):'Thiếu '+M1(NVT-h.sum4)+' Tr từ 4 nhãn (cần 500k)';
    return `<tr><td class="nm" style="text-align:left">${esc(h.n)} <small style="color:#6a7596;font-weight:600">${esc(h.c)}</small></td><td>${esc(h.o.name)}<small class="s">${esc(h.o.ss)} · ${esc(h.o.npp)}</small></td><td>${h.isDs?'Đại sứ':'VIP'}</td><td>${M1(h.ds)}</td><td><span class="pill ${h.pct>=1?'':'o'}">${P1(h.pct,1)}</span></td><td style="text-align:left"><b class="neg">${esc(miss)}</b></td></tr>`;}).join('');
  return `<div class="sec r"><b>⚠</b>ĐẠT NV1 (DOANH SỐ) · CHƯA ĐẠT NV2 (4 NHÃN TRỌNG ĐIỂM)</div>
  <div class="note" style="border-left:3px solid #d6244f;padding-left:8px"><b>⚠ Đạt NV1 chưa đạt NV2:</b> ${N0(X.length)} KH (VIP Đại sứ ${N0(xd.length)} · VIP ${N0(xv.length)}) đã đạt ≥95% chỉ tiêu nền nhưng chưa đủ nhãn trọng điểm, DS <b class="neg">${M1(sm(X,'ds'))} Tr</b> chưa được thưởng. Bổ sung nhãn còn thiếu là KH đủ điều kiện ngay.</div>
  <div class="ttl">VIP Đại sứ theo nhãn còn thiếu<small>(KH đã đạt NV1 · nhãn dưới 150k)</small></div>
  <div class="wrap"><table class="bt"><thead><tr><th class="g5" style="text-align:left">Nhãn trọng điểm</th><th class="g5">KH thiếu nhãn</th><th class="g5">Cần mua thêm (Tr)</th><th class="g5">DS KH chưa được thưởng (Tr)</th></tr></thead><tbody>${brRows}<tr class="tt"><td class="nm" style="text-align:left">Tổng VIP Đại sứ</td><td>${N0(xd.length)} KH</td><td>–</td><td>${M1(sm(xd,'ds'))}</td></tr><tr class="tt"><td class="nm" style="text-align:left">VIP (chưa đủ 500k từ 4 nhãn)</td><td>${N0(xv.length)} KH</td><td>${M1(sm(xv,h=>NVT-h.sum4))}</td><td>${M1(sm(xv,'ds'))}</td></tr></tbody></table></div>
  <div class="ttl">KH đạt NV1 chưa NV2 có doanh số lớn nhất<small>(cần bổ sung nhãn)</small></div>
  <div class="wrap"><table class="bt"><thead><tr><th class="g5" style="text-align:left">Khách hàng</th><th class="g5">ĐDKD</th><th class="g5">Loại</th><th class="g5">DS (Tr)</th><th class="g5">% nền</th><th class="g5" style="text-align:left">Còn thiếu</th></tr></thead><tbody>${rows||'<tr><td colspan="6">Không có KH</td></tr>'}</tbody></table></div>
  <div class="note">Hiển thị ${L.length} KH có DS lớn nhất / ${N0(X.length)} KH. Mở ĐDKD ở bảng 1, chọn "Đạt NV1 – chưa NV2" để xem đủ danh sách theo từng cửa hàng.</div>`;
}

function render(){
  const root=$('hvv11'), y=window.scrollY, T=K.filter(h=>h.o&&inScope(h.o)), tb=(k,t)=>`<button class="btn ${S.tab===k?'on':''}" data-hv-tab="${k}">${t}</button>`;
  root.innerHTML=`<div class="h1">Hội viên Tết 2027 – Tháng ${MY.m}/${MY.y}</div><div class="sub">Doanh số theo file PERFORMANCE CHI TIẾT THEO NHÃN HÀNG (MBS TẾT 2027) đến ${esc(AS)} · ${esc(scopeLabel())} · tiến độ thời gian ${P1(WD,WT)}</div>${filterHtml()}
  ${topCards(T)}${grpCards('VIP','',T.filter(h=>!h.isDs),false)}${grpCards('VIP ĐẠI SỨ','o',T.filter(h=>h.isDs),true)}
  <div class="tools">${tb('all','Tất cả')}${tb('tbl','① Theo ASM / ĐDKD')}${tb('brand','② Theo nhãn hàng')}${tb('nv2','③ Đạt NV1 – chưa NV2')}</div>
  ${S.tab==='all'||S.tab==='nv2'?table3(T):''}${S.tab==='all'||S.tab==='tbl'?table1(T):''}${S.tab==='all'||S.tab==='brand'?table2(T):''}`;
  window.scrollTo(0,y);
}
function shot(id,btn){const el=$(id);if(!el)return;const go=()=>{const o=btn.textContent;btn.textContent='Đang chụp…';const box=el.style.cssText,w=el.scrollWidth;el.style.overflow='visible';el.style.maxHeight='none';el.style.width=w+'px';
  window.html2canvas(el,{scale:2,backgroundColor:'#ffffff',width:w,windowWidth:w+40}).then(c=>{el.style.cssText=box;const a=document.createElement('a');a.download='HoiVien_T11_'+scopeLabel().replace(/\s+/g,'_')+'.png';a.href=c.toDataURL('image/png');a.click();btn.textContent=o;}).catch(()=>{el.style.cssText=box;btn.textContent=o;});};
  if(window.html2canvas)return go();const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';s.onload=go;s.onerror=()=>alert('Không tải được công cụ chụp ảnh, kiểm tra mạng.');document.head.appendChild(s);}
function init(){
  const root=$('hvv11'); if(root._i)return; root._i=1; prep();
  root.addEventListener('change',e=>{const f=e.target.dataset.hvF;if(!f)return;S[f]=e.target.value;const o=['asm','npp','ss','sr'];o.slice(o.indexOf(f)+1).forEach(k=>S[k]='');S.open.clear();S.det.clear();render();});
  root.addEventListener('click',e=>{const t=e.target;let x;
    if(x=t.closest('[data-hv-reset]')){S.asm=S.npp=S.ss=S.sr='';S.open.clear();S.det.clear();return render();}
    if(x=t.closest('[data-hv-tab]')){S.tab=x.dataset.hvTab;return render();}
    if(x=t.closest('[data-hv-fl]')){S.fl=x.dataset.hvFl;return render();}
    if(x=t.closest('[data-hv-shot]'))return shot(x.dataset.hvShot,x);
    if(x=t.closest('[data-hv-all]')){S.det.clear();if(x.dataset.hvAll==='1'){const T=K.filter(h=>h.o&&inScope(h.o));const rec=ns=>ns.forEach(n=>{if(!n.leaf){S.open.add(n.path);rec(n.kids);}});rec(tree(T));}else S.open.clear();return render();}
    if(x=t.closest('tr[data-hv-t]')){const p=x.dataset.hvT;S.open.has(p)?S.open.delete(p):S.open.add(p);return render();}
    if(x=t.closest('tr[data-hv-det]')){const c=x.dataset.hvDet;S.det.has(c)?S.det.delete(c):S.det.add(c);return render();}
  });
}
window.renderHvt=function(){try{if(typeof HVT11==='undefined'||!$('hvv11'))return;init();render();}catch(e){console.error('HVT2',e);}};
})();
