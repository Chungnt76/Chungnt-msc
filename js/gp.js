/* Tab "Giải pháp T11–T12": mọi số lấy từ dữ liệu có sẵn (T11, T10, T10CY, DATA, T11S, T10CYS, HVT11, CBT11, APQ). Không dùng chart. */
(function(){
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const LS={g(k){try{return localStorage.getItem('gp:'+k);}catch(e){return null;}},s(k,v){try{localStorage.setItem('gp:'+k,v);}catch(e){}},d(k){try{localStorage.removeItem('gp:'+k);}catch(e){}}};
const nf=(n,d)=>(n==null||isNaN(n))?'—':n.toLocaleString('vi-VN',{minimumFractionDigits:d==null?1:d,maximumFractionDigits:d==null?1:d});
const ty=n=>(n==null||isNaN(n))?'—':nf(n/1e9,2);      // đồng → tỷ
const pc=(a,b)=>b?nf(a/b*100,1)+'%':'—';
const pn=s=>{s=String(s||'').trim(); if(!s)return null; if(s.includes(','))s=s.replace(/\./g,'').replace(',','.'); const v=parseFloat(s); return isNaN(v)?null:v;};
const WD={7:27,8:26,9:24,10:27};            // ngày làm việc T7–T10 (giống WORKDAYS của dashboard)
const ASMS_=()=>{try{return ASMS.slice();}catch(e){return [...new Set(DATA.map(r=>r.asm))].sort();}};
const SHORT={'Đặng Quang Vinh':'Quảng Ngãi','Lê Nguyễn Thành Vinh':'Khánh Hoà','Nguyễn Thanh Hải':'Gia Lai','Nguyễn Thành Nhuận':'Đà Nẵng','Nguyễn Văn Quyền':'Đắk Lắk'};
const lab=a=>a==='all'?'Toàn Miền':a+(SHORT[a]?' · '+SHORT[a]:'');
/* snapshot dữ liệu lịch sử ngay khi tải (trước khi các tab cũ đổi khe tháng) */
const SNAP=(()=>{try{
  const o={m:{7:{},8:{},9:{},10:{}},nb:{},cy:{}};
  DATA.forEach(r=>{[7,8,9,10].forEach(m=>{o.m[m][r.asm]=(o.m[m][r.asm]||0)+(r['s'+m]||0);}); if(r.oo==='OFF')o.nb[r.asm]=(o.nb[r.asm]||0)+(r.nb10||0);});
  T10CY.forEach(r=>{o.cy[r.asm]=(o.cy[r.asm]||0)+((r.v['a|all']||{}).so||0);});
  return o;}catch(e){console.error('GP snap',e);return null;}})();
const S={asm:'all'};
const sc=a=>S.asm==='all'||a===S.asm;
const sum=(o,keys)=>keys.reduce((t,k)=>t+(o[k]||0),0);
/* ---- tính toán lõi ---- */
function core(a){      // a = 'all' hoặc tên ASM
  const rows=T11.filter(r=>a==='all'||r.asm===a);
  const mtd=rows.reduce((t,r)=>t+((r.v['a|all']||{}).so||0),0);
  const tg=rows.reduce((t,r)=>t+((((r.tgm||{})['11'])||[r.target||0])[0]||0),0);
  const d=T11_META.mtd_days, D=T11_META.days_total, rem=Math.max(0,D-d);
  const ks=a==='all'?Object.keys(SNAP.m[10]):[a];
  const day=m=>sum(SNAP.m[m],ks)/WD[m];
  const hist={7:day(7),8:day(8),9:day(9),10:day(10)}; const mx=Math.max(hist[7],hist[8],hist[9],hist[10]);
  const cur=d?mtd/d:0, need=rem?Math.max(0,tg-mtd)/rem:0;
  return {mtd,tg,d,D,rem,cur,need,hist,mx,pct:tg?mtd/tg:0};
}
function accel(){      // hệ số tăng tốc T10 (toàn Miền): SO/ngày các ngày còn lại ÷ SO/ngày 9 ngày đầu
  const full=sum(SNAP.m[10],Object.keys(SNAP.m[10])), cy=sum(SNAP.cy,Object.keys(SNAP.cy)), d1=9, d2=WD[10]-d1;
  const a=cy/d1, b=(full-cy)/d2; return {k:a?b/a:1,a,b,full,cy,d1,d2};
}
function forecast(c,k){return c.mtd+c.cur*k*c.rem;}
const camKey=a=>'cam:'+a;
function camVal(a,fc){const s=LS.g(camKey(a)); const v=pn(s); return v==null?fc/1e9:v;}   // tỷ
/* ---- hội viên / combo / ngành hàng / quầy ---- */
function hvStat(){
  const sr=HVT11.sr, o={n:0,chua:0,nv1x:0,sap:0,pend:0};
  HVT11.rows.forEach(r=>{ if(!sc(sr[r[0]][2]))return; const base=r[6],ds=r[5],t=r[3];
    o.n++; if(!(ds>0))o.chua++; o.pend+=r[4]||0;
    const m1=base>0&&ds/base>=0.95, b=[r[10],r[11],r[12],r[13]], s4=b[0]+b[1]+b[2]+b[3], nv2=t===1?b.every(x=>x>=150000):s4>=500000;
    if(m1&&!nv2)o.nv1x++;
    if(!m1&&base>0&&(0.95*base-ds)<=0.3*base)o.sap++; });
  return o;}
function comboOff(){const o={n:0,nhan:0}; CBT11.rows.forEach(r=>{ if(r[1]!==0||!sc(CBT11.sr[r[0]][2]))return; o.n+=r[2]; o.nhan+=r[6];}); return o;}
const CATN={GiaVi:'Gia vị',Mi:'Mì',CaPhe:'Cà phê',HPC:'HPC',BEV:'Bev',Nutrition:'Nutrition',PMeat:'Meat',Bia:'Bia'};
let SSASM=null;
function cats(){
  if(!SSASM){SSASM={}; T11.forEach(r=>{SSASM[r.ssn+'|'+r.npp]=r.asm; SSASM[r.ss+'|'+r.npp]=r.asm;});}
  const f=(rows,days)=>{const o={}; rows.forEach(r=>{ if(r[3]!=='all')return; const a=SSASM[r[0]]; if(a==null||!sc(a))return; o[r[2]]=(o[r[2]]||0)+r[4];}); Object.keys(o).forEach(k=>o[k]/=days); return o;};
  const a=f(T11S.CATD,T11_META.mtd_days), b=f(T10CYS.CATD,9);
  return Object.keys(CATN).map(k=>({k,n:CATN[k],a:a[k]||0,b:b[k]||0})).filter(x=>x.b>0).map(x=>Object.assign(x,{g:x.a/x.b-1})).sort((p,q)=>p.g-q.g);
}
function apq(a){const o={e:0,he:0,o:0}; APQ.forEach(r=>{ if(a!=='all'&&r[0]!==a)return; o.e+=r[5][2]; o.he+=r[6][2]; o.o+=r[7][2];}); return o;}
/* ---- giao diện ---- */
const TH='background:#0369A1;color:#fff;padding:7px 8px;font-size:12px;text-align:right';
const THL=TH.replace('text-align:right','text-align:left');
const inp=(id,val,ph,w)=>`<input data-gp="${id}" value="${esc(val)}" placeholder="${esc(ph||'')}" inputmode="decimal" style="width:${w||88}px;text-align:right;border:1px solid #38BDF8;background:#f0f9ff;border-radius:6px;padding:4px 6px;font:inherit;color:inherit">`;
const card=(l,v,s,ac)=>`<div class="kpi" style="border-top:3px solid ${ac||'#0EA5E9'}"><div class="k-lab">${l}</div><div class="k-val">${v}</div><div class="k-sub">${s||''}</div></div>`;
const H=t=>`<h3 style="display:inline;color:#0369A1">${t}</h3>`;
const st=r=>r>=1?'background:#d1fae5;color:#065f46':r>=0.85?'background:#fef3c7;color:#92400e':'background:#fee2e2;color:#991b1b';
function block1(c,k){
  const warn=c.need>c.mx&&c.mx>0;
  return `<div class="kpis" style="grid-template-columns:repeat(4,1fr)">`+
    card('SO MTD',ty(c.mtd)+' tỷ','đến hết '+T11_META.last_date)+
    card('Chỉ tiêu T11',ty(c.tg)+' tỷ','có P.Meat & Bia')+
    card('%Đạt chỉ tiêu',pc(c.mtd,c.tg),'Time gone '+c.d+'/'+c.D+' ngày công = '+pc(c.d,c.D),c.tg&&c.mtd/c.tg>=c.d/c.D?'#16a34a':'#d97706')+
    card('Ngày công còn lại',c.rem+' ngày','từ '+(Number(T11_META.last_date.split('/')[0])+1)+'/11 đến 30/11')+
    card('SO/ngày hiện tại',ty(c.cur)+' tỷ','SO MTD ÷ '+c.d+' ngày công')+
    card('SO/ngày cần để đạt 100%',ty(c.need)+' tỷ',c.cur?'gấp '+nf(c.need/c.cur,2)+' lần hiện tại':'—',warn?'#dc2626':'#0EA5E9')+
    card('SO/ngày cao nhất T7–T10',ty(c.mx)+' tỷ','T7 '+ty(c.hist[7])+' · T8 '+ty(c.hist[8])+' · T9 '+ty(c.hist[9])+' · T10 '+ty(c.hist[10]),'#38BDF8')+
    card('Hệ số tăng tốc (từ T10)',nf(k.k,2),'SO/ngày '+k.d2+' ngày sau ÷ '+k.d1+' ngày đầu T10 ('+ty(k.b)+' ÷ '+ty(k.a)+' tỷ)','#38BDF8')+
  `</div>`+(warn?`<div class="t8norm" style="margin-top:8px;background:#fef2f2;border:1px solid #fca5a5;color:#991b1b;padding:9px 12px;border-radius:8px"><b>⚠ Cảnh báo:</b> SO/ngày cần (${ty(c.need)} tỷ) cao hơn mức cao nhất T7–T10 (${ty(c.mx)} tỷ) ${nf((c.need/c.mx-1)*100,1)}% — chỉ tiêu T11 khó đạt nếu chỉ giữ nhịp cũ, cần thêm giải pháp ở khối 4 và 5.</div>`:'');
}
function block2(k){
  const A=ASMS_(); let h='',tot={mtd:0,tg:0,fc:0,cam:0,need:0};
  const row=(a,c,fc,cam,isT)=>{const camIn=isT?`<b>${nf(cam,2)}</b>`:inp('cam|'+a,nf(cam,2),'',80);
    return `<tr${isT?' class="tot"':''}><td style="text-align:left;white-space:nowrap">${esc(isT?'TOÀN MIỀN':lab(a))}</td><td>${ty(c.mtd)}</td><td>${ty(c.tg)}</td><td><b>${pc(c.mtd,c.tg)}</b></td><td>${ty(c.need)}</td><td>${ty(fc)}</td><td>${pc(fc,c.tg)}</td><td>${camIn}</td><td><b>${pc(cam*1e9,c.tg)}</b></td></tr>`;};
  A.forEach(a=>{const c=core(a),fc=forecast(c,k.k),cam=camVal(a,fc); tot.mtd+=c.mtd;tot.tg+=c.tg;tot.fc+=fc;tot.cam+=cam;tot.need+=c.need; h+=row(a,c,fc,cam,false);});
  const ct=core('all'); const ft=forecast(ct,k.k);
  return {html:`<div style="overflow-x:auto"><table class="t8asmtbl"><thead><tr><th style="${THL}">ASM</th><th style="${TH}">SO MTD (tỷ)</th><th style="${TH}">Chỉ tiêu (tỷ)</th><th style="${TH}">%Đạt</th><th style="${TH}">SO/ngày cần để 100% (tỷ)</th><th style="${TH}">Dự kiến nếu giữ đà (tỷ, ước tính)</th><th style="${TH}">%Đạt dự kiến</th><th style="${TH}">Cam kết (tỷ) · nhập tay</th><th style="${TH}">%Đạt cam kết</th></tr></thead><tbody>${h}${row('all',ct,ft,tot.cam,true)}</tbody></table></div>`,
    cam:tot.cam,fc:ft,needSum:tot.need,needAll:ct.need};
}
function mocDates(){const m=Number(String(T11_META.month).split('/')[0]), y=Number(String(T11_META.month).split('/')[1]); const wd=d=>{let n=0;for(let i=1;i<=d;i++){if(new Date(y,m-1,i).getDay()!==0)n++;}return n;}; return [14,21,28,30].map(d=>({d,wd:wd(d)}));}
function snap(c){const last=Number(T11_META.last_date.split('/')[0]); const s=JSON.parse(LS.g('snap')||'{}'); if(S.asm==='all'&&s[last]==null){s[last]=c.mtd; LS.s('snap',JSON.stringify(s));} return s;}
function block3(c){
  const last=Number(T11_META.last_date.split('/')[0]), sn=snap(c); let h='',prev=c.d,prevSo=c.mtd;
  mocDates().forEach(x=>{
    const w=Math.max(x.wd,c.d), so=c.mtd+c.need*(w-c.d), perDay=w>prev?(so-prevSo)/(w-prev):c.need;
    let act='<span class="fx" title="Chưa đến mốc / chưa có dữ liệu">chưa có</span>',ratio=null,stt='—',sty='';
    let a=null; if(S.asm==='all'){ if(last===x.d)a=c.mtd; else if(sn[x.d]!=null)a=sn[x.d]; }
    else if(last===x.d)a=c.mtd;
    if(a!=null){ratio=so?a/so:null; act=`<b>${ty(a)}</b>`+(last===x.d?'':'<div class="k-sub">MTD lưu lúc xem ngày '+x.d+'</div>'); stt=ratio>=1?'Đạt mốc':ratio>=0.85?'Gần đạt (85–99%)':'Dưới 85%'; sty=st(ratio);}
    h+=`<tr><td style="text-align:left"><b>${x.d}/11</b></td><td>${x.wd}/${c.D}</td><td>${ty(perDay)}</td><td>${ty(so)}</td><td><b>${pc(so,c.tg)}</b></td><td>${act}</td><td style="${sty}">${ratio==null?'—':pc(a,so)}</td><td style="${sty}">${stt}</td></tr>`;
    prev=w;prevSo=so;});
  return `<div style="overflow-x:auto"><table class="t8asmtbl"><thead><tr><th style="${THL}">Mốc</th><th style="${TH}">Ngày công lũy kế</th><th style="${TH}">SO/ngày mục tiêu (tỷ)</th><th style="${TH}">SO lũy kế mục tiêu (tỷ)</th><th style="${TH}">%Đạt chỉ tiêu</th><th style="${TH}">Thực tế lũy kế (tỷ)</th><th style="${TH}">Thực tế ÷ mốc</th><th style="${TH}">Kết quả</th></tr></thead><tbody>${h}</tbody></table></div>
  <div class="pnote" style="margin-top:6px">Đường về đích: giữ SO/ngày cần đều trên các ngày công còn lại để chạm 100% ngày 30/11. Mục tiêu mốc là <b>ước tính</b> theo đường này, không phải chỉ tiêu chính thức. Cột Thực tế tự điền khi dữ liệu T11 đã đến đúng ngày mốc (hoặc khi đã mở tab vào đúng ngày đó). Tô xanh đạt mốc · vàng 85–99% · đỏ dưới 85%.</div>`;
}
function plans(c,hv,cb,cat,nb){
  const A=n=>core(n), hai=A('Nguyễn Thanh Hải'), vinh=A('Đặng Quang Vinh');
  const weak=cat.filter(x=>x.g<0).map(x=>x.n+' '+nf(x.g*100,1)+'%').join(' · ')||'không có ngành thấp hơn';
  const g=k=>cat.find(x=>x.k===k); const f=k=>g(k)?nf(g(k).g*100,1)+'%':'—';
  const want=0.35, more=Math.max(0,Math.round(want*cb.n-cb.nhan));
  return [
   ['a','Cứu số Gia Lai và Quảng Ngãi: làm việc với NPP TM Gia Lai, lấp ĐDKD vacant, rà lại tuyến','ASM Hải (Gia Lai) · ASM Vinh (Quảng Ngãi)',`%Đạt MTD Gia Lai ${pc(hai.mtd,hai.tg)} · Quảng Ngãi ${pc(vinh.mtd,vinh.tg)} (time gone ${pc(hai.d,hai.D)}) · SO/ngày cần ${ty(hai.need)} / ${ty(vinh.need)} tỷ`,'14/11'],
   ['b','Hội viên Tết: ưu tiên KH đạt NV1 chưa đạt NV2 và KH sắp đạt; xác nhận đơn chờ trong 24 giờ','5 ASM',`${nf(hv.nv1x,0)} KH đạt NV1 chưa NV2 · ${nf(hv.sap,0)} KH sắp đạt NV1 · đơn chờ ${ty(hv.pend)} tỷ`,'Hằng ngày · chốt 30/11'],
   ['c','Combo: nâng tỷ lệ KH L1 Off nhận combo lên khoảng 35%','5 ASM',`KH L1 Off nhận combo ${pc(cb.nhan,cb.n)} (${nf(cb.nhan,0)}/${nf(cb.n,0)}) → mục tiêu ~35%: thêm ~${nf(more,0)} KH`,'21/11'],
   ['d','Ngành hàng: dồn Gia vị và Mì, kéo lại HPC, giữ Cà phê ở mức khả thi','ASM + ngành hàng',`SO/ngày so T10 cùng kỳ: Gia vị ${f('GiaVi')} · Mì ${f('Mi')} · HPC ${f('HPC')} · Cà phê ${f('CaPhe')}`,'14/11'],
   ['e','Đánh thức quầy Off 2 tháng liền không mua và quầy chưa phát sinh','SS',`${nf(nb.v,0)} quầy Off không mua T9–T10 (dữ liệu mới nhất có sẵn)`,'21/11'],
   ['f','Họp chốt SO/ngày mỗi sáng, đối chiếu dashboard cuối ngày','RSM + 5 ASM',`SO/ngày hiện tại ${ty(c.cur)} tỷ so với cần ${ty(c.need)} tỷ`,'Hằng ngày từ '+(Number(T11_META.last_date.split('/')[0])+2)+'/11']];
}
function block4(c,hv,cb,cat,nb){
  const P=plans(c,hv,cb,cat,nb); const opts=['Chưa làm','Đang làm','Xong'];
  return `<div style="overflow-x:auto"><table class="t8asmtbl"><thead><tr><th style="${THL}">#</th><th style="${THL}">Giải pháp</th><th style="${THL}">Phụ trách</th><th style="${THL}">KPI đo (số live)</th><th style="${THL}">Hạn</th><th style="${THL}">Trạng thái</th></tr></thead><tbody>`+
  P.map((p,i)=>{const cur=LS.g('st|'+p[0])||opts[0]; const bg=cur==='Xong'?'#d1fae5':cur==='Đang làm'?'#fef3c7':'#f1f5f9';
    return `<tr><td>${i+1}</td><td style="text-align:left;white-space:normal;min-width:260px">${esc(p[1])}</td><td style="text-align:left;white-space:normal">${esc(p[2])}</td><td style="text-align:left;white-space:normal;min-width:260px">${esc(p[3])}</td><td style="text-align:left;white-space:nowrap">${esc(p[4])}</td><td><select data-gpst="${p[0]}" style="border:1px solid #38BDF8;border-radius:6px;padding:4px 6px;background:${bg};font:inherit;color:#0f172a">${opts.map(o=>`<option${o===cur?' selected':''}>${o}</option>`).join('')}</select></td></tr>`;}).join('')+`</tbody></table></div>`;
}
function oppRows(c,hv,cb,cat,nb){
  const neg=cat.filter(x=>x.g<0);
  const brk=Object.keys(nb.by).map(a=>(SHORT[a]||a)+' '+nf(nb.by[a],0)).join(' · ');
  return [
   ['hvchua','Hội viên chưa mua (chưa phát sinh DS T11)',nf(hv.chua,0)+' KH',`trên ${nf(hv.n,0)} KH hội viên`,'ví dụ: số KH kích hoạt × tỷ lệ mua × DS bình quân/KH'],
   ['hvsap','Hội viên sắp đạt NV1 (còn thiếu ≤30% chỉ tiêu nền)',nf(hv.sap,0)+' KH','thiếu đến 95% nền ≤ 30% nền','ví dụ: số KH kéo lên đạt × phần DS còn thiếu bình quân'],
   ['hvnv','KH đạt NV1 chưa đạt NV2 (thiếu nhãn trọng điểm)',nf(hv.nv1x,0)+' KH','đã đủ doanh số, thiếu 4 nhãn','ví dụ: số KH × DS nhãn còn thiếu để đủ NV2'],
   ['cbo','KH L1 Off chưa nhận combo',nf(cb.n-cb.nhan,0)+' KH',`${nf(cb.n,0)} KH áp dụng · đã nhận ${nf(cb.nhan,0)}`,'ví dụ: KH chuyển nhận × DS mang về bình quân/KH (xem tab Combo)'],
   ['nb','Quầy Off 2 tháng liền không mua (T9–T10)',nf(nb.v,0)+' quầy',brk,'ví dụ: số quầy đánh thức × tỷ lệ mua lại × SO/quầy/tháng'],
   ['cat','Ngành hàng có SO/ngày thấp hơn T10 cùng kỳ',nf(neg.length,0)+' ngành',neg.map(x=>x.n+' '+nf(x.g*100,1)+'%').join(' · ')||'không có','ví dụ: (SO/ngày T10 cùng kỳ − SO/ngày hiện tại) × ngày công còn lại × tỷ lệ kéo lại']];
}
function block5(c,hv,cb,cat,nb,gap){
  const R=oppRows(c,hv,cb,cat,nb); let t=0;
  const rows=R.map(r=>{const v=pn(LS.g('opp|'+r[0])); if(v!=null)t+=v; const as=LS.g('asu|'+r[0])||'';
    return `<tr><td style="text-align:left;white-space:normal;min-width:240px">${esc(r[1])}</td><td><b>${r[2]}</b></td><td style="text-align:left;white-space:normal">${esc(r[3])}</td><td>${inp('opp|'+r[0],v==null?'':nf(v,2),'nhập tỷ')}</td><td style="text-align:left"><input data-gpt="asu|${r[0]}" value="${esc(as)}" placeholder="${esc(r[4])}" style="width:100%;min-width:230px;border:1px solid #38BDF8;background:#f0f9ff;border-radius:6px;padding:4px 6px;font:inherit;color:inherit"></td></tr>`;}).join('');
  return `<div style="overflow-x:auto"><table class="t8asmtbl"><thead><tr><th style="${THL}">Cơ hội</th><th style="${TH}">Số lượng</th><th style="${THL}">Phạm vi</th><th style="${TH}">Ước tính SO thêm (tỷ) · nhập tay</th><th style="${THL}">Giả định của ước tính</th></tr></thead><tbody>${rows}<tr class="tot"><td style="text-align:left"><b>Tổng ước tính SO thêm</b></td><td></td><td style="text-align:left">khoảng thiếu so với dự kiến giữ đà: <b>${ty(gap)} tỷ</b></td><td><b>${nf(t,2)}</b></td><td style="text-align:left">${gap>0?'bù được '+pc(t*1e9,gap)+' khoảng thiếu':''}</td></tr></tbody></table></div><div class="pnote" style="margin-top:6px">Các ô SO thêm là <b>ước tính</b> do anh nhập, dashboard không điền số cứng. Các cơ hội có thể chồng nhau (một KH nằm ở nhiều dòng) nên cộng tổng chỉ để tham khảo.</div>`;
}
function block6(c,cam){
  const ct=pn(LS.g('t12|ct')), nd=pn(LS.g('t12|nd')); const need=(ct!=null&&nd)?ct*1e9/nd:null;
  const cd=cam*1e9/c.D, up=(need!=null&&cd)?need/cd-1:null;
  const apl=(l,v)=>`<td><b>${ty(v)}</b>${nd?`<div class="k-sub">cần ${ty(v/nd)} tỷ/ngày</div>`:''}</td>`;
  return `<div class="kpis" style="grid-template-columns:repeat(4,1fr)">`+
   `<div class="kpi" style="border-top:3px solid #0EA5E9"><div class="k-lab">Chỉ tiêu SO T12 (tỷ) <span style="color:#dc2626">· ANH ĐIỀN</span></div><div style="margin-top:6px">${inp('t12|ct',ct==null?'':nf(ct,2),'nhập tỷ',130)}</div></div>`+
   `<div class="kpi" style="border-top:3px solid #0EA5E9"><div class="k-lab">Số ngày công T12 <span style="color:#dc2626">· ANH ĐIỀN</span></div><div style="margin-top:6px">${inp('t12|nd',nd==null?'':nf(nd,0),'nhập ngày',130)}</div></div>`+
   card('SO/ngày cần T12',need==null?'—':ty(need)+' tỷ',need==null?'điền chỉ tiêu và ngày công để tính':'chỉ tiêu ÷ ngày công')+
   card('Mức tăng so với SO/ngày T11 cam kết',up==null?'—':(up>=0?'+':'')+nf(up*100,1)+'%','SO/ngày T11 cam kết = '+ty(cd)+' tỷ (cam kết '+nf(cam,2)+' tỷ ÷ '+c.D+' ngày công)')+`</div>`+
   `<div style="overflow-x:auto;margin-top:10px"><table class="t8asmtbl"><thead><tr><th style="${THL}">AP Quý 4 · tháng 12 (tham chiếu)</th><th style="${TH}">E (tỷ)</th><th style="${TH}">HE (tỷ)</th><th style="${TH}">O (tỷ)</th></tr></thead><tbody>${['all'].concat(ASMS_()).map(a=>{const ap=apq(a);return `<tr${a==='all'?' class="tot"':''}><td style="text-align:left">${esc(lab(a))}</td>${apl('E',ap.e)}${apl('HE',ap.he)}${apl('O',ap.o)}</tr>`;}).join('')}</tbody></table></div><div class="pnote" style="margin-top:6px">E/HE/O lấy từ chỉ tiêu AP Quý 4 (tháng 12) có sẵn trong dashboard. Chưa điền chỉ tiêu T12 thì các ô tính toán để trống, không lỗi.</div>`;
}
function build(){
  const c=core(S.asm), k=accel(), hv=hvStat(), cb=comboOff(), cat=cats();
  const nb={v:0,by:{}}; Object.keys(SNAP.nb).forEach(a=>{if(sc(a)){nb.v+=SNAP.nb[a];} nb.by[a]=SNAP.nb[a];});
  if(S.asm!=='all'){nb.by={}; nb.by[S.asm]=SNAP.nb[S.asm]||0;}
  const b2=block2(k), gap=Math.max(0,c.tg-(S.asm==='all'?b2.fc:forecast(c,k.k)));
  return {c,k,hv,cb,cat,nb,b2,gap};
}
function body(m){
  const {c,k,hv,cb,cat,nb,b2,gap}=m;
  const cam=S.asm==='all'?b2.cam:camVal(S.asm,forecast(c,k.k));
  const sec=(n,t,inner,note)=>`<div class="panel" style="margin-top:14px;border-top:3px solid #0EA5E9"><div class="tbl-head"><div>${H(n+'. '+t)}${note?` <span class="pnote" style="display:inline">${note}</span>`:''}</div></div>${inner}</div>`;
  return sec(1,'Hiện trạng · '+esc(lab(S.asm)),block1(c,k))+
   sec(2,'Dự kiến và cam kết theo ASM',b2.html+`<div class="pnote" style="margin-top:6px">Dự kiến (<b>ước tính</b>) = SO MTD + SO/ngày hiện tại × hệ số tăng tốc (${nf(k.k,2)}) × ngày công còn lại (${c.rem}). Hệ số lấy từ T10 toàn Miền và áp cho mọi ASM. Cam kết mặc định bằng dự kiến, sửa ô để nhập cam kết (lưu trên trình duyệt). Tổng SO/ngày cần của 5 ASM = ${ty(b2.needSum)} tỷ, bằng Toàn Miền ${ty(b2.needAll)} tỷ.</div>`)+
   sec(3,'Mốc theo tuần · '+esc(lab(S.asm)),block3(c))+
   sec(4,'Bảng giải pháp',block4(c,hv,cb,cat,nb),'trạng thái lưu trên trình duyệt')+
   sec(5,'Cơ hội bán hàng · '+esc(lab(S.asm)),block5(c,hv,cb,cat,nb,gap))+
   sec(6,'Tháng 12 · Toàn Miền',block6(core('all'),b2.cam));
}
function render(){
  const pg=document.getElementById('pgGp'); if(!pg||!SNAP||typeof T11==='undefined')return;
  let host=document.getElementById('gpHost'); if(!host){host=document.createElement('div');host.id='gpHost';pg.appendChild(host);}
  const A=ASMS_(); const m=build();
  host.innerHTML=`<div class="panel" style="margin-top:14px;border-top:3px solid #0EA5E9"><div class="t8norm" style="margin-bottom:8px"><b>Ngày cắt dữ liệu:</b> SO T11 đến hết <b>${T11_META.last_date}</b> (${T11_META.mtd_days}/${T11_META.days_total} ngày công) · Hội viên đến hết 10/11 · Combo đến 09/11 · SO T7–T10 và AP Quý 4 là số đã chốt trong dashboard.</div>
   <div class="flt2" style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end"><div class="fg"><label>Phạm vi</label><div class="seg" id="gpScope"><button data-v="all">Toàn Miền</button>${A.map(a=>`<button data-v="${esc(a)}">${esc(lab(a))}</button>`).join('')}</div></div><div style="flex:1"></div><button type="button" class="v3btn on" id="gpPrint" style="height:34px;padding:0 14px">🖨 Xuất 1 trang họp ASM</button></div></div>`+body(m);
  [...host.querySelectorAll('#gpScope button')].forEach(b=>b.classList.toggle('on',b.dataset.v===S.asm));
  host.querySelector('#gpScope').onclick=e=>{const b=e.target.closest('button');if(b){S.asm=b.dataset.v;render();}};
  host.querySelector('#gpPrint').onclick=openPrint;
  host.querySelectorAll('input[data-gp]').forEach(i=>{i.onchange=()=>{const [t,id]=i.dataset.gp.split('|'); const v=pn(i.value);
    if(t==='cam'){ if(v==null)LS.d('cam:'+id); else LS.s('cam:'+id,String(v)); }
    else LS.s(i.dataset.gp,v==null?'':String(v)); render();};});
  host.querySelectorAll('input[data-gpt]').forEach(i=>{i.onchange=()=>{LS.s(i.dataset.gpt,i.value);};});
  host.querySelectorAll('select[data-gpst]').forEach(s=>{s.onchange=()=>{LS.s('st|'+s.dataset.gpst,s.value);render();};});
}
/* ---- Xuất 1 trang họp ASM (dùng khung in sẵn #v3print / .v3pp) ---- */
function printHtml(a){
  const keep=S.asm; S.asm=a;
  try{
    const m=build(), {c,k,hv,cb,cat,nb}=m; const P=plans(c,hv,cb,cat,nb); const warn=c.need>c.mx&&c.mx>0;
    const kp=(l,v,s)=>`<div class="pk"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${s||''}</div></div>`;
    const cam=a==='all'?m.b2.cam:camVal(a,forecast(c,k.k));
    const mo=mocDates().map(x=>{const w=Math.max(x.wd,c.d),so=c.mtd+c.need*(w-c.d);return `<tr><td>${x.d}/11</td><td>${x.wd}/${c.D}</td><td>${ty(so)}</td><td>${pc(so,c.tg)}</td></tr>`;}).join('');
    return `<div class="v3pp"><div class="pph"><div><div class="eb">Masan Consumer · Kênh GT · Miền Trung</div><h1>Họp ASM · Giải pháp T11–T12 <small>${esc(lab(a))}</small></h1></div><div class="meta">SO T11 đến hết ${T11_META.last_date}<br>ngày công ${c.d}/${c.D}</div></div>`+
     `<h2>1. Hiện trạng</h2><div class="pks">${kp('SO MTD',ty(c.mtd)+' tỷ',pc(c.mtd,c.tg)+' chỉ tiêu '+ty(c.tg)+' tỷ')}${kp('SO/ngày hiện tại',ty(c.cur)+' tỷ','cần '+ty(c.need)+' tỷ để đạt 100%')}${kp('Ngày công còn lại',c.rem,'time gone '+pc(c.d,c.D))}${kp('Dự kiến giữ đà (ước tính)',ty(forecast(c,k.k))+' tỷ',pc(forecast(c,k.k),c.tg)+' · hệ số '+nf(k.k,2))}${kp('Cam kết',nf(cam,2)+' tỷ',pc(cam*1e9,c.tg)+' chỉ tiêu')}${kp('SO/ngày cao nhất T7–T10',ty(c.mx)+' tỷ',warn?'⚠ cần cao hơn '+nf((c.need/c.mx-1)*100,1)+'%':'trong khả năng')}</div>`+
     `<h2>2. Mốc theo tuần (ước tính theo đường về đích)</h2><table class="pt"><thead><tr><th>Mốc</th><th>Ngày công</th><th>SO lũy kế (tỷ)</th><th>%Đạt chỉ tiêu</th></tr></thead><tbody>${mo}</tbody></table>`+
     `<h2>3. Giải pháp</h2><table class="pt"><thead><tr><th>Giải pháp</th><th>Phụ trách</th><th>KPI đo</th><th>Hạn</th><th>Trạng thái</th></tr></thead><tbody>${P.map(p=>`<tr><td>${esc(p[1])}</td><td>${esc(p[2])}</td><td>${esc(p[3])}</td><td>${esc(p[4])}</td><td>${esc(LS.g('st|'+p[0])||'Chưa làm')}</td></tr>`).join('')}</tbody></table>`+
     `<footer>Nguồn: dashboard Sell-out Miền Trung. Dự kiến và mốc là ước tính từ số liệu, cần ASM xác nhận cam kết.</footer></div>`;
  }finally{S.asm=keep;}
}
function openPrint(){
  let ov=document.getElementById('v3print'); if(!ov){ov=document.createElement('div');ov.id='v3print';document.body.appendChild(ov);}
  const A=ASMS_(), cur=S.asm;
  ov.innerHTML=`<div class="pbar"><label>Phạm vi <select id="gpPrSel"><option value="all"${cur==='all'?' selected':''}>Toàn Miền</option>${A.map(x=>`<option value="${esc(x)}"${x===cur?' selected':''}>${esc(x)}</option>`).join('')}</select></label><button type="button" class="v3btn on" id="gpPrGo">In / Lưu PDF</button><button type="button" class="v3btn" id="gpPrX">Đóng</button></div><div id="gpPrBody"></div>`;
  const draw=()=>{document.getElementById('gpPrBody').innerHTML=printHtml(document.getElementById('gpPrSel').value);};
  draw(); document.getElementById('gpPrSel').onchange=draw;
  document.getElementById('gpPrX').onclick=()=>{ov.remove();document.body.classList.remove('v3printing');};
  document.getElementById('gpPrGo').onclick=()=>{document.body.classList.add('v3printing');window.print();};
  ov.hidden=false;
}
window.renderGp=function(){try{render();}catch(e){console.error('GP',e);}};
})();
