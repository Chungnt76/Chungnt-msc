/* Tab COMBO T11 — bố cục giống tab Combo KPI Studio (Team SS Pháp), dữ liệu toàn Miền Trung
   Nguồn: data/CBT11.js  — tập KH combo theo ĐDKD: [sri,g,nKH,ctso,dsMTD,KHmua,KHnhan,suat,ctsoNhom,dsNhom,dsDonCombo]
                           g=0 OFF · g=1 toàn bộ ON (đã gồm Quán ăn/Nhà hàng) · g=2 Quán ăn + Nhà hàng
          data/COMBO11.js — đơn combo KH × ngày × chương trình (file PROMOTION - OUTLET DETAIL), đã loại KH hội viên ở t11x.js
   Tách tệp: ON = g1 − g2 (phần danh sách KH: số KH, CTSO, DS MTD, KH mua). Thực hiện ON = KH nhận combo ON (Wake up 247).
   Total combo = OFF + ON (đã tách) + Quán ăn/Nhà hàng = tập KH combo, KH nhận đếm không trùng. */
(function(){
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const N0=n=>Math.round(n||0).toLocaleString('vi-VN');
const P1=(a,b)=>b?(a/b*100).toFixed(1).replace('.',',')+'%':'–';
const M1=n=>(Math.round((n||0)/1e5)/10).toLocaleString('vi-VN',{minimumFractionDigits:1,maximumFractionDigits:1});
const PK=['all','off','on','nh'], PL={all:'Tất cả',off:'KH lẻ L1 OFF',on:'Total KH L1 ON',nh:'L2 Quán ăn + Nhà hàng'}, PG={off:0,on:1,nh:2}, GK=['off','on','nh'];
const S={asm:'',npp:'',ss:'',sr:'',pf:'all',open:new Set(),dopen:new Set()};
let SR=null, AGG=null, UNQ=null;

/* ---------- Chuẩn bị dữ liệu ---------- */
function prep(){
  if(SR&&prep.k===CBT11&&prep.c===COMBO11&&prep.v===(window.__mtv||0))return; prep.k=CBT11;prep.c=COMBO11;prep.v=window.__mtv||0; SR=new Map(); S.open.clear(); S.dopen.clear();
  const put=(x,k,i)=>{const c=String(x[0]);let o=SR.get(c);if(!o){o={code:c,name:x[1],asm:x[2]||'—',npp:x[3]||'—',ss:x[4]||'—',cb:-1,co:-1};SR.set(c,o);}
    if(k==='cb'){o.asm=x[2]||o.asm;o.npp=x[3]||o.npp;o.ss=x[4]||o.ss;if(x[1]&&x[1]!==c)o.name=x[1];} else if(o.name===c&&x[1])o.name=x[1]; o[k]=i;};
  CBT11.sr.forEach((x,i)=>put(x,'cb',i)); COMBO11.sr.forEach((x,i)=>put(x,'co',i));
  /* AGG: mã ĐDKD → {off,on,nh} mỗi nhóm 9 chỉ số [n,ctso,ds,mua,nhan,suat,ctsoM,dsM,dsF] */
  AGG=new Map(); const g=c=>{let a=AGG.get(c);if(!a){a={off:Z(),on:Z(),nh:Z(),onAll:Z()};AGG.set(c,a);}return a;};
  CBT11.rows.forEach(r=>{const o=SR.get(String(CBT11.sr[r[0]][0])),a=g(o.code),t=r[1]===0?a.off:r[1]===2?a.nh:a.onAll; for(let k=0;k<9;k++)t[k]+=r[k+2];});
  AGG.forEach(a=>{for(let k=0;k<9;k++)a.on[k]=k<4?a.onAll[k]-a.nh[k]:a.onAll[k];});
  /* KH nhận không trùng theo ĐDKD cho "Tất cả" */
  /* KH nhận cả combo ON lẫn Quán ăn/Nhà hàng: trừ 1 lần khi cộng "Tất cả" */
  const gk=new Map(); COMBO11.rows.forEach(r=>{const k=r[1];if(!gk.has(k))gk.set(k,{g:new Set(),c:String(COMBO11.sr[r[0]][0])});gk.get(k).g.add(r[3]);});
  UNQ=new Map(); gk.forEach(v=>{if(v.g.size>1)UNQ.set(v.c,(UNQ.get(v.c)||0)+v.g.size-1);});
}
function Z(){return [0,0,0,0,0,0,0,0,0];}
const ym=()=>({y:COMBO11.meta.y||2026,m:COMBO11.meta.m||11});
const inScope=o=>(!S.asm||o.asm===S.asm)&&(!S.npp||o.npp===S.npp)&&(!S.ss||o.ss===S.ss)&&(!S.sr||o.code===S.sr);
const scopeLabel=()=>S.sr?(SR.get(S.sr)||{}).name:S.ss?'SS '+S.ss:S.npp?'NPP '+S.npp:S.asm?'ASM '+S.asm:'Toàn Miền';
function vec(code,pf){const a=AGG.get(code);if(!a)return Z();if(pf!=='all')return a[pf];
  const v=Z();GK.forEach(k=>{for(let i=0;i<9;i++)v[i]+=a[k][i];});v[4]-=UNQ.get(code)||0;return v;}
const add=(a,b)=>{for(let i=0;i<9;i++)a[i]+=b[i];return a;};

/* ---------- Bộ lọc ---------- */
function filterHtml(){
  const all=[...SR.values()].filter(o=>o.asm!=='—'&&AGG.has(o.code));
  const uniq=(arr,f)=>[...new Set(arr.map(f))].sort((a,b)=>a.localeCompare(b,'vi'));
  const A=all, Nn=A.filter(o=>!S.asm||o.asm===S.asm), Ss=Nn.filter(o=>!S.npp||o.npp===S.npp), Rr=Ss.filter(o=>!S.ss||o.ss===S.ss).sort((a,b)=>String(a.name).localeCompare(String(b.name),'vi'));
  const sel=(k,list,lab,val=v=>v,txt=v=>v)=>`<select data-cb-f="${k}"><option value="">${lab}</option>${list.map(v=>`<option value="${esc(val(v))}"${val(v)===S[k]?' selected':''}>${esc(txt(v))}</option>`).join('')}</select>`;
  const nA=uniq(A,o=>o.asm),nN=uniq(Nn,o=>o.npp),nS=uniq(Ss,o=>o.ss);
  return `<div class="flt"><b>Lọc:</b><button class="btn ${S.asm||S.npp||S.ss||S.sr?'':'on'}" data-cb-reset="1">Toàn Miền</button>${sel('asm',nA,`– Chọn ASM (${nA.length}) –`)}${sel('npp',nN,`– Chọn NPP (${nN.length}) –`)}${sel('ss',nS,`– Chọn SS (${nS.length}) –`)}${sel('sr',Rr,`– Chọn ĐDKD (${Rr.length}) –`,o=>o.code,o=>o.name)}<span style="color:#6a7596">Đang xem: <b>${esc(scopeLabel())}</b></span></div>`;
}

/* ---------- Thẻ chương trình ---------- */
function cardsHtml(){
  const sc=[...SR.values()].filter(inScope).map(o=>o.code);
  const tot=pf=>sc.reduce((a,c)=>add(a,vec(c,pf)),Z());
  const card=(k,name,sub,col,gift,rule,mx,cls)=>{const a=tot(k);return `<div class="pc ${cls||''}"><div class="hd" style="background:${col}"><b>${name}</b><span>${sub}</span></div><div class="bd"><div class="gift">${gift}</div><div class="rule">${rule}</div><div class="mx">${mx}</div><div class="st"><div><b>${N0(a[0])}</b><small>KH áp dụng</small></div><div><b>${N0(a[4])}</b><small>KH đã nhận combo</small></div><div><b>${N0(a[5])}</b><small>Suất tặng</small></div><div><b>${P1(a[4],a[0])}</b><small>KH tham gia</small></div></div></div></div>`;};
  return `<div class="banner">KH LẺ</div><div class="cards prog">`+
   card('off','KH lẻ L1 OFF','Off premise · ngoài nhóm hội viên','linear-gradient(90deg,#1c3fb5,#10183a)','TẶNG 01 CHAI TƯƠNG ỚT 250GR','khi mua bill <b>800K total Masan</b> trong đó có ít nhất <b>100k từ 04 nhãn hàng trọng điểm</b> (Chinsu, Nam Ngư, Kokomi, Chanté)','Tối đa: 2 suất/đơn')+
   card('on','Total KH L1 ON','quầy ON trong MCP · trừ Quán ăn + Nhà hàng','linear-gradient(90deg,#6a2fe0,#2a1070)','TẶNG 01 CHAI WAKEUP 247','khi mua bill <b>250K total Bev</b> trong đó có ít nhất <b>80k sp mới</b> (WK247 Amazon, Bupnon 365 các vị)','Tối đa: 3 suất/đơn')+
   card('nh','L2 Quán ăn + Nhà hàng','VIP2 · VIP3','linear-gradient(90deg,#c2500c,#6a2a00)','TẶNG 01 CHAI TƯƠNG ỚT 250GR','bill <b>500K total Gia vị</b> có 200K NN STK · hoặc bill <b>400K total Gia vị</b> có 32K TTT Nhị Ca','Tối đa: 3 suất/đơn')+
   card('all','TOTAL COMBO','OFF + ON + Quán ăn/Nhà hàng','linear-gradient(90deg,#0f766e,#083344)','TỔNG 3 CHƯƠNG TRÌNH COMBO','= KH lẻ L1 OFF + Total KH L1 ON + L2 Quán ăn + Nhà hàng · <b>3 tệp KH tách riêng, không trùng</b>','KH đã nhận đếm không trùng','total')+`</div>`;
}

/* ---------- Cây ASM → NPP → SS → ĐDKD ---------- */
const LV=['asm','npp','ss'];
function levels(){const st=S.sr?3:S.ss?2:S.npp?1:S.asm?0:-1;return LV.slice(st+1);}
function tree(codes){
  const L=levels();
  const mk=(arr,li,path)=>{ if(li>=L.length)return arr.map(c=>({leaf:true,code:c,name:SR.get(c).name,path:path+'|'+c,codes:[c]}));
    const m=new Map();arr.forEach(c=>{const k=SR.get(c)[L[li]];if(!m.has(k))m.set(k,[]);m.get(k).push(c);});
    return [...m].map(([k,a])=>({k,name:k,lv:L[li],path:path+'|'+k,codes:a,kids:mk(a,li+1,path+'|'+k)}));};
  return mk(codes,0,'');
}
function walk(nodes,open,val,key,emit,d){nodes.map(n=>({n,v:val(n.codes)})).filter(x=>key(x.v)>0).sort((p,q)=>key(q.v)-key(p.v)).forEach(({n,v})=>{const op=!n.leaf&&open.has(n.path);emit(n,v,d,op);if(op)walk(n.kids,open,val,key,emit,d+1);});}
const LVN={asm:'ASM ',npp:'NPP ',ss:'SS '};
function nmCell(n,d,op,cnt){if(n.leaf)return `<td class="nm">${esc(n.name)}</td>`;return `<td class="nm">${op?'▾':'▸'} ${d?LVN[n.lv]:''}${esc(n.name)} <small>(${cnt})</small></td>`;}
function trCls(n,d){return n.leaf?`class="rep l${Math.min(3,d)}"`:d===0?`class="team" data-cb-t="${esc(n.path)}"`:`class="rep l${d}" data-cb-t="${esc(n.path)}"`;}
const nSr=n=>n.codes.length;

/* ---------- 1. Summary ---------- */
function summaryHtml(){
  const pf=S.pf, codes=[...SR.values()].filter(o=>inScope(o)&&AGG.has(o.code)).map(o=>o.code);
  const val=cs=>cs.reduce((a,c)=>add(a,vec(c,pf)),Z());
  const cells=(a,tot)=>{const p=(x,y)=>tot?`<b>${P1(x,y)}</b>`:`<span class="pill o">${P1(x,y)}</span>`;
    return `<td>${N0(a[0])}</td><td>${M1(a[1])}</td><td>${M1(a[2])}</td><td>${p(a[2],a[1])}</td><td>${N0(a[3])}</td><td>${P1(a[3],a[0])}</td><td>${N0(a[4])}</td><td>${N0(a[5])}</td><td>${P1(a[4],a[0])}</td><td>${M1(a[6])}</td><td>${M1(a[7])}</td><td>${p(a[7],a[6])}</td>`;};
  const used=codes.filter(c=>val([c])[0]>0);
  let body=`<tr class="tot"><td class="nm">TỔNG (${N0(used.length)} ĐDKD)</td>${cells(val(codes),true)}</tr>`;
  walk(tree(codes),S.open,val,a=>a[0],(n,a,d,op)=>{body+=`<tr ${trCls(n,d)}>${nmCell(n,d,op,nSr(n))}${cells(a)}</tr>`;},0);
  const pb=k=>`<button class="btn ${S.pf===k?'on':''}" data-cb-pf="${k}">${PL[k]}</button>`, m=CBT11.meta;
  return `<div class="sec"><b>1</b>SUMMARY THEO ASM / NPP / SS / ĐDKD</div><div class="ttl">Summary combo theo ASM / NPP / SS / ĐDKD<small>(Triệu)</small></div>
  <div class="tools"><span class="lb">Chương trình:</span>${PK.map(pb).join('')}</div>
  <div class="tools"><button class="btn" data-cb-all="1">Mở hết ĐDKD</button><button class="btn" data-cb-all="0">Thu gọn</button><button class="btn dark" data-cb-shot="cb-s1">📷 Chụp ảnh bảng</button></div>
  <div class="wrap" id="cb-s1"><table><thead><tr><th rowspan="2" class="g5" style="text-align:left">ASM / NPP / SS / ĐDKD</th><th colspan="4" class="g1">Danh sách KH combo</th><th colspan="5" class="g2">Thực hiện combo</th><th colspan="3" class="g6">Nhóm KH đã nhận combo</th></tr><tr><th class="s1">Số lượng KH</th><th class="s1">CTSO</th><th class="s1">DS MTD</th><th class="s1">% chỉ tiêu</th><th class="s2">KH đã mua</th><th class="s2">% KH mua</th><th class="s2">KH đã nhận</th><th class="s2">Suất combo</th><th class="s2">% KH tham gia</th><th class="s6">CTSO nhóm</th><th class="s6">DS MTD nhóm</th><th class="s6">%</th></tr></thead><tbody>${body}</tbody></table></div>
  <div class="note">Tập KH combo = MCP (${N0(m.mcp)} KH) − nhóm hội viên (${N0(m.hv)} KH) − vãng lai = <b>${N0(m.universe)} KH</b>, chia 3 tệp không trùng: KH lẻ L1 OFF · Total KH L1 ON (đã trừ Quán ăn + Nhà hàng) · L2 Quán ăn + Nhà hàng. CTSO = chỉ tiêu KH tháng (Tr, TB 3 tháng gần nhất) · DS MTD = doanh số lũy kế đến ${m.asof} · KH đã nhận combo xác định từ dòng hàng tặng combo · "Nhóm KH đã nhận combo" = CT và DS của các KH đã nhận combo. "Tất cả": KH nhận cả 2 chương trình chỉ đếm 1 lần. Bấm vào dòng để khoan sâu đến ĐDKD.</div>`;
}

/* ---------- 2. Theo ngày ---------- */
function coRows(){const gs=S.pf==='all'?[0,1,2]:[PG[S.pf]];return COMBO11.rows.filter(r=>{if(!gs.includes(r[3]))return false;const o=SR.get(String(COMBO11.sr[r[0]][0]));return o&&inScope(o);});}
function dayHtml(){
  const m=COMBO11.meta, asOf=m.asof_day, dn=['CN','T2','T3','T4','T5','T6','T7'], YM=ym(), dow=d=>new Date(YM.y,YM.m-1,d).getDay();
  const days=Array.from({length:m.cal_days},(_,i)=>i+1).filter(d=>dow(d)!==0), past=days.filter(d=>d<=asOf).length;
  const R=coRows(), cnt=new Map(); R.forEach(r=>{const c=String(COMBO11.sr[r[0]][0]);let x=cnt.get(c);if(!x){x=new Map();cnt.set(c,x);}x.set(r[5],(x.get(r[5])||0)+1);});
  const val=cs=>{const t=new Map();let n=0;cs.forEach(c=>{const x=cnt.get(c);if(x)x.forEach((v,d)=>{t.set(d,(t.get(d)||0)+v);n+=v;});});return {t,n};};
  const tds=(v,tot)=>{let s='',sold=0;days.forEach(d=>{const c=v.t.get(d)||0;if(d>asOf)s+='<td class="cf">·</td>';else if(c){sold++;s+=`<td class="cs">${N0(c)}</td>`;}else s+='<td class="cr">0</td>';});
    return s+`<td><b>${N0(v.n)}</b></td>`+(tot?'<td>–</td><td>–</td>':`<td><b class="gn">${sold}</b></td><td><b class="rd">${past-sold}</b></td>`);};
  const codes=[...cnt.keys()];
  let body=`<tr class="tot"><td class="nm">TỔNG (${N0(codes.length)} ĐDKD)</td>${tds(val(codes),true)}</tr>`;
  walk(tree(codes),S.dopen,val,v=>v.n,(n,v,d,op)=>{body+=`<tr ${trCls(n,d).replace('data-cb-t','data-cb-d')}>${nmCell(n,d,op,nSr(n))}${tds(v)}</tr>`;},0);
  const head=`<tr><th class="nm" rowspan="2" style="text-align:left;min-width:190px">ASM / NPP / SS / ĐDKD</th>${days.map(d=>`<th>${d}</th>`).join('')}<th rowspan="2">Tổng đơn</th><th rowspan="2">Ngày đã bán</th><th rowspan="2" class="red">Ngày chưa bán</th></tr><tr>${days.map(d=>`<th style="font-weight:600;font-size:10.5px">${dn[dow(d)]}</th>`).join('')}</tr>`;
  const sun=R.filter(r=>m.sundays.includes(r[5])).length;
  return `<div class="sec"><b>2</b>COMBO BÁN THEO NGÀY · TỪNG ĐƠN VỊ</div><div class="ttl">Số đơn combo bán mỗi ngày<small>(xanh = có bán, đỏ = chưa bán · tính đến ${m.asof} · ${S.pf==='all'?'tất cả chương trình':PL[S.pf]})</small></div>
  <div class="tools"><button class="btn" data-cb-dall="1">Mở hết ĐDKD</button><button class="btn" data-cb-dall="0">Thu gọn</button><button class="btn dark" data-cb-shot="cb-s2">📷 Chụp ảnh bảng</button></div>
  <div class="ovf cdy" id="cb-s2"><table class="cdt"><thead>${head}</thead><tbody>${body}</tbody></table></div>
  <div class="note">Mỗi số = số đơn có hàng tặng combo trong ngày (KH × ngày × chương trình). Ô <b style="color:#12a66a">xanh</b>: ngày có bán · ô <b style="color:#d6244f">đỏ</b>: ngày làm việc chưa bán · đã bỏ các ngày Chủ Nhật · dấu “·”: ngày chưa đến. Ngày đã bán / chưa bán tính cho từng dòng trên ${past} ngày làm việc đến ${m.asof}${sun?` · Tổng đơn gồm ${N0(sun)} đơn phát sinh ngày Chủ nhật`:''}.</div>`;
}

/* ---------- 3. Top KH ---------- */
function topHtml(){
  const R=coRows(), K=new Map(), GN=['OFF','ON','NH'], GC=['off','on','nh'];
  R.forEach(r=>{let k=K.get(r[1]);if(!k){k={c:r[1],n:r[2],o:SR.get(String(COMBO11.sr[r[0]][0])),od:0,su:0,v:0,d:new Set(),g:new Set()};K.set(r[1],k);}k.od++;k.su+=r[6];k.v+=r[8];k.d.add(r[5]);k.g.add(r[3]);});
  const A=[...K.values()].sort((a,b)=>b.od-a.od||b.su-a.su||b.v-a.v), top=A.slice(0,30);
  const nOd=R.length, nSu=R.reduce((t,r)=>t+r[6],0), rep2=A.filter(o=>o.od>=2).length;
  const rows=top.map((o,i)=>`<tr><td>${i+1}</td><td class="nm" style="text-align:left">${esc(o.n)} <small style="color:#6a7596;font-weight:600">${esc(o.c)}</small></td><td style="text-align:left">${esc(o.o.name)}<small class="s">${esc(o.o.npp)}</small></td><td>${[...o.g].sort().map(g=>`<span class="pill ${GC[g]}">${GN[g]}</span>`).join(' ')}</td><td><b>${o.od}</b></td><td><b class="pos">${N0(o.su)}</b></td><td>${M1(o.v)}</td><td style="text-align:left;font-size:12px">${[...o.d].sort((a,b)=>a-b).map(d=>String(d).padStart(2,'0')+'/'+String(ym().m).padStart(2,'0')).join(', ')}</td></tr>`).join('');
  return `<div class="sec o"><b>3</b>TOP KH CÓ ĐƠN COMBO NHIỀU · ${esc(scopeLabel().toUpperCase())}</div><div class="ttl">Top ${top.length} KH nhận combo nhiều nhất<small>(${S.pf==='all'?'tất cả chương trình':PL[S.pf]} · đến ${COMBO11.meta.asof}/${ym().y})</small></div>
  <div class="cards"><div class="kc"><small>KH đã nhận combo</small><b>${N0(A.length)}</b><span>${N0(nOd)} đơn · ${N0(nSu)} suất khuyến mãi</span></div><div class="kc c2"><small>KH nhận từ 2 đơn trở lên</small><b>${N0(rep2)}</b><span>${P1(rep2,A.length)} KH đã nhận combo</span></div></div>
  <div class="tools"><button class="btn dark" data-cb-shot="cb-s3">📷 Chụp ảnh bảng</button></div>
  <div class="wrap" id="cb-s3"><table class="bt"><thead><tr><th class="g5">#</th><th class="g5" style="text-align:left">Khách hàng</th><th class="g5" style="text-align:left">ĐDKD</th><th class="g5">Combo</th><th class="g5">Số đơn combo</th><th class="g5">Số KM đã nhận (suất)</th><th class="g5">DS hàng combo (Tr)</th><th class="g5" style="text-align:left">Ngày nhận</th></tr></thead><tbody>${rows||'<tr><td colspan="8">Chưa có KH nhận combo</td></tr>'}</tbody></table></div>
  <div class="note">Số đơn = số đơn có dòng hàng tặng combo. Số KM đã nhận = tổng số suất quà tặng (Tương ớt CHIN-SU / Wake up 247). DS hàng combo = doanh số các dòng hàng đủ điều kiện combo (RETAILER_AMOUNT).</div>`;
}

/* ---------- Render ---------- */
function render(){
  const root=$('cbv11'), m=COMBO11.meta, y=window.scrollY;
  root.innerHTML=`<div class="h1">Combo đơn hàng – Tháng ${ym().m}/${ym().y}</div><div class="sub">Theo dõi từ file PROMOTION – OUTLET DETAIL (dòng hàng tặng combo) · đơn đến ${m.asof} · ngày công ${m.wd_passed}/${m.wd_total} · ${esc(scopeLabel())}</div>`+
   filterHtml()+cardsHtml()+summaryHtml()+dayHtml()+topHtml()+
   `<details style="margin:16px 0 6px"><summary style="font-weight:700;cursor:pointer">Chương trình combo đang chạy (${COMBO11.promos.length})</summary><div class="wrap" style="margin-top:8px"><table><thead><tr><th class="g5">Nhóm</th><th class="g5">Mã CT</th><th class="g5" style="text-align:left">Tên chương trình</th><th class="g5">Thời gian</th></tr></thead><tbody>${COMBO11.promos.map(p=>`<tr><td>${esc(p[1])}</td><td>${esc(p[0])}</td><td style="text-align:left;white-space:normal">${esc(p[2])}</td><td>${p[3]} – ${p[4]}</td></tr>`).join('')}</tbody></table></div></details>`;
  window.scrollTo(0,y);
}
function allPaths(codes){const s=new Set();const rec=ns=>ns.forEach(n=>{if(!n.leaf){s.add(n.path);rec(n.kids);}});rec(tree(codes));return s;}
function shot(id,btn){
  const el=$(id); if(!el)return; const go=()=>{const old=btn.textContent;btn.textContent='Đang chụp…';
    const sec=el.closest('#cbv11'); const w=el.scrollWidth; const box=el.style.cssText; el.style.overflow='visible';el.style.maxHeight='none';el.style.width=w+'px';
    window.html2canvas(el,{scale:2,backgroundColor:'#ffffff',width:w,windowWidth:w+40}).then(c=>{el.style.cssText=box;const a=document.createElement('a');a.download='Combo_T11_'+scopeLabel().replace(/\s+/g,'_')+'.png';a.href=c.toDataURL('image/png');a.click();btn.textContent=old;}).catch(()=>{el.style.cssText=box;btn.textContent=old;});};
  if(window.html2canvas)return go();
  const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';s.onload=go;s.onerror=()=>alert('Không tải được công cụ chụp ảnh, kiểm tra mạng.');document.head.appendChild(s);
}
function init(){
  const root=$('cbv11'); if(root._i)return; root._i=1; prep();
  root.addEventListener('change',e=>{const f=e.target.dataset.cbF;if(!f)return;S[f]=e.target.value;const o=['asm','npp','ss','sr'];o.slice(o.indexOf(f)+1).forEach(k=>S[k]='');S.open.clear();S.dopen.clear();render();});
  root.addEventListener('click',e=>{const t=e.target;let x;
    if(x=t.closest('[data-cb-reset]')){S.asm=S.npp=S.ss=S.sr='';S.open.clear();S.dopen.clear();return render();}
    if(x=t.closest('[data-cb-pf]')){S.pf=x.dataset.cbPf;S.dopen.clear();return render();}
    if(x=t.closest('[data-cb-all]')){S.open=x.dataset.cbAll==='1'?allPaths([...SR.values()].filter(o=>inScope(o)&&AGG.has(o.code)).map(o=>o.code)):new Set();return render();}
    if(x=t.closest('[data-cb-dall]')){S.dopen=x.dataset.cbDall==='1'?allPaths([...new Set(coRows().map(r=>String(COMBO11.sr[r[0]][0])))]):new Set();return render();}
    if(x=t.closest('[data-cb-shot]'))return shot(x.dataset.cbShot,x);
    if(x=t.closest('tr[data-cb-t]')){const p=x.dataset.cbT;S.open.has(p)?S.open.delete(p):S.open.add(p);return render();}
    if(x=t.closest('tr[data-cb-d]')){const p=x.dataset.cbD;S.dopen.has(p)?S.dopen.delete(p):S.dopen.add(p);return render();}
  });
}
window.renderCombo=function(){try{if(typeof CBT11==='undefined'||typeof COMBO11==='undefined'||!$('cbv11'))return;init();render();}catch(e){console.error('COMBO',e);}};
})();
