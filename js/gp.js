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
/* ---- cấp NPP / SS / SR (T11 theo SS; GP11 theo SR; HVT11 theo KH) ---- */
const BM=()=>GP11.meta.bench;
const srOf=i=>CBT11.sr[i];                      // [mã, tên, asm, npp, ss]
let AGG=null;
function agg(){
  if(AGG)return AGG; const k=accel().k;
  const ss={}, npp={};
  T11.forEach(r=>{ const so=(r.v['a|all']||{}).so||0, tg=((r.tgm||{})['11']||[r.target||0])[0]||0;
    const ks=r.asm+'|'+r.ssn, kn=r.asm+'|'+r.npp;
    const o=ss[ks]||(ss[ks]={asm:r.asm,npp:r.npp,ss:r.ssn,so:0,tg:0,drop:0,dropSO:0,srn:0,srv:0,hv:0,hvGap:0});
    o.so+=so;o.tg+=tg; const p=npp[kn]||(npp[kn]={asm:r.asm,npp:r.npp,so:0,tg:0}); p.so+=so;p.tg+=tg;});
  GP11.rows.forEach(r=>{const m=srOf(r[0]); const o=ss[m[2]+'|'+m[4]]; if(!o)return; o.drop+=r[4]; o.dropSO+=r[5]; o.srn+=r[1]; o.srv+=r[2];});
  HVT11.rows.forEach(r=>{const m=HVT11.sr[r[0]]; const o=ss[m[2]+'|'+m[4]]; if(!o)return; const base=r[6],ds=r[5];
    if(base>0&&ds/base<0.95&&(0.95*base-ds)<=0.3*base){o.hv++;o.hvGap+=0.95*base-ds;}});
  const d=T11_META.mtd_days, rem=T11_META.days_total-d;
  const fx=o=>{o.fc=o.so+(o.so/d)*k*rem; o.short=Math.max(0,o.tg-o.fc); o.cur=o.so/d; o.need=rem?Math.max(0,o.tg-o.so)/rem:0; return o;};
  AGG={ss:Object.values(ss).map(fx),npp:Object.values(npp).map(fx)}; return AGG;
}
function gp11(){   // tổng cơ hội cấp SR theo phạm vi
  const o={mcp:0,a11:0,a10:0,drop:0,dropSO:0,near:0,nearGap:0,so11:0,so10:0,srn:0,srv:0};
  GP11.rows.forEach(r=>{const m=srOf(r[0]); if(!sc(m[2]))return; o.mcp+=r[1];o.a11+=r[2];o.a10+=r[3];o.drop+=r[4];o.dropSO+=r[5];o.so11+=r[6];o.so10+=r[7];o.near+=r[8];o.nearGap+=r[9];o.srn+=r[1]; o.srv+=r[2];});
  return o;}
function hvMore(){
  const o={sapGap:0,chuaBase:0,chua:0}; HVT11.rows.forEach(r=>{ if(!sc(HVT11.sr[r[0]][2]))return; const base=r[6],ds=r[5];
    if(base>0&&ds/base<0.95&&(0.95*base-ds)<=0.3*base)o.sapGap+=0.95*base-ds; if(!(ds>0)){o.chua++;o.chuaBase+=base;} }); return o;}
/* tham số giả định (sửa được, lưu trên trình duyệt) */
const PAR={hc:70,lift:10,lift2:5,cmb:40,hvs:50,hvc:15,hvb:30,cat:50,dor:10,near:30};
const par=k=>{const v=pn(LS.g('par|'+k)); return v==null?PAR[k]:v;};
const parIn=k=>inp('par|'+k,nf(par(k),0),'',56);
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
const topN=(arr,key,n)=>arr.slice().sort((p,q)=>q[key]-p[key]).slice(0,n);
function plans(c,hv,cb,cat,nb,g){
  const hai=core('Nguyễn Thanh Hải'), vinh=core('Đặng Quang Vinh'), A=agg();
  const npp=a=>topN(A.npp.filter(x=>x.asm===a),'short',2).map(x=>x.npp+' (thiếu '+ty(x.short)+' tỷ)').join(', ');
  const asmSr=a=>{let m0=0,a0=0,dr=0; GP11.rows.forEach(r=>{const m=srOf(r[0]); if(m[2]!==a)return; m0+=r[1]; a0+=r[2]; dr+=r[4];}); return {m:m0,a:a0,dr};};
  const sh=asmSr('Nguyễn Thanh Hải'), sv=asmSr('Đặng Quang Vinh');
  const f=k=>{const x=cat.find(y=>y.k===k); return x?nf(x.g*100,1)+'%':'—';};
  const ssTop=topN(A.ss.filter(x=>sc(x.asm)&&x.hv>0),'hv',3).map(x=>x.ss+' ('+x.hv+' KH)').join(', ');
  const want=0.35, more=Math.max(0,Math.round(want*cb.n-cb.nhan));
  return [
   ['a','Cứu số Gia Lai và Quảng Ngãi','ASM Hải lo NPP TM Gia Lai: chốt trong 12/11 danh sách ĐDKD vacant/thiếu và người kèm tuyến; rà lại tuyến có quầy không phát sinh; ĐDKD ưu tiên phủ danh sách quầy rơi (khối 4). ASM Vinh làm tương tự cho Quảng Ngãi.','ASM Hải (Gia Lai) · ASM Vinh (Quảng Ngãi)',`%Đạt MTD Gia Lai ${pc(hai.mtd,hai.tg)} · Quảng Ngãi ${pc(vinh.mtd,vinh.tg)} (time gone ${pc(hai.d,hai.D)}). NPP thiếu nhiều nhất: Gia Lai ${npp('Nguyễn Thanh Hải')}; Quảng Ngãi ${npp('Đặng Quang Vinh')}. Quầy MCP đã mua T11: Gia Lai ${pc(sh.a,sh.m)}, Quảng Ngãi ${pc(sv.a,sv.m)} · quầy rơi: ${nf(sh.dr,0)} / ${nf(sv.dr,0)}`,'Chốt kế hoạch 12/11 · kiểm tra 14/11'],
   ['b','Hội viên Tết: chốt KH sắp đạt và KH đạt NV1 chưa đạt NV2','SS gọi/nhắn từng KH trong danh sách (tab Hội viên Tết, mục 4 và 5): nhắc thiếu nhãn nào, chốt đơn bù; ASM xác nhận đơn chờ trong 24 giờ; ưu tiên SS có nhiều KH sắp đạt.','5 ASM · SS',`${nf(hv.nv1x,0)} KH đạt NV1 chưa NV2 · ${nf(hv.sap,0)} KH sắp đạt NV1 · đơn chờ ${ty(hv.pend)} tỷ. SS nhiều KH sắp đạt nhất: ${ssTop||'—'}`,'Hằng ngày · chốt 28/11'],
   ['c','Combo: nâng tỷ lệ KH L1 Off nhận combo lên khoảng 35%','ĐDKD chào combo đúng ngưỡng đơn 800K cho KH Off chưa nhận; ưu tiên KH có đơn 500–800K (chỉ cần nâng đơn lên ngưỡng). SS theo dõi số KH nhận mỗi ngày.','5 ASM · SS',`KH L1 Off nhận combo ${pc(cb.nhan,cb.n)} (${nf(cb.nhan,0)}/${nf(cb.n,0)}) → ~35% cần thêm ${nf(more,0)} KH, bình quân ${nf(more/Math.max(1,c.rem),0)} KH/ngày công · KH có đơn 500–800K chưa nhận: ${nf(g.near,0)}`,'21/11'],
   ['d','Ngành hàng: dồn Gia vị và Mì, kéo lại HPC, giữ Cà phê ở mức khả thi','ASM + NPP đặt mục tiêu ngành theo SO/ngày cần: Gia vị, Mì dồn đơn lớn; HPC rà tồn kho, trưng bày và đơn thiếu; Cà phê giữ nhịp, không kéo thêm.','5 ASM · NPP',`SO/ngày so T10 cùng kỳ: Gia vị ${f('GiaVi')} · Mì ${f('Mi')} · HPC ${f('HPC')} · Cà phê ${f('CaPhe')}`,'14/11 chốt mục tiêu ngành'],
   ['e','Đánh thức quầy Off 2 tháng liền không mua và quầy chưa phát sinh','SS xuất danh sách theo SR; SR thăm trong 5 ngày công đầu, ưu tiên quầy có SO kỳ trước lớn (khối 4); báo kết quả cuối ngày.','SS · SR',`${nf(nb.v,0)} quầy Off không mua T9–T10 · ${nf(g.drop,0)} quầy đã mua đầu T10 nhưng chưa mua đầu T11 (SO kỳ trước ${ty(g.dropSO)} tỷ) · ${nf((g.mcp-g.a11)-g.drop,0)} quầy chưa mua cả hai kỳ`,'21/11'],
   ['f','Họp chốt SO/ngày mỗi sáng, đối chiếu dashboard cuối ngày','Họp 15 phút đầu ngày: đối chiếu SO/ngày hôm trước với mức cần, chốt SS/NPP hụt và việc trong ngày; cuối ngày đối chiếu số trên dashboard.','RSM + 5 ASM',`SO/ngày hiện tại ${ty(c.cur)} tỷ, cần ${ty(c.need)} tỷ (thiếu ${ty(Math.max(0,c.need-c.cur))} tỷ mỗi ngày)`,'Hằng ngày từ '+(Number(T11_META.last_date.split('/')[0])+1)+'/11']];
}
function block4(c,hv,cb,cat,nb,g){
  const P=plans(c,hv,cb,cat,nb,g); const opts=['Chưa làm','Đang làm','Xong'];
  return `<div style="overflow-x:auto"><table class="t8asmtbl"><thead><tr><th style="${THL}">#</th><th style="${THL}">Giải pháp</th><th style="${THL}">Việc cụ thể</th><th style="${THL}">Phụ trách</th><th style="${THL}">KPI đo (số live)</th><th style="${THL}">Hạn</th><th style="${THL}">Trạng thái</th></tr></thead><tbody>`+
  P.map((p,i)=>{const cur=LS.g('st|'+p[0])||opts[0]; const bg=cur==='Xong'?'#d1fae5':cur==='Đang làm'?'#fef3c7':'#f1f5f9';
    return `<tr><td>${i+1}</td><td style="text-align:left;white-space:normal;min-width:170px"><b>${esc(p[1])}</b></td><td style="text-align:left;white-space:normal;min-width:260px">${esc(p[2])}</td><td style="text-align:left;white-space:normal">${esc(p[3])}</td><td style="text-align:left;white-space:normal;min-width:260px">${esc(p[4])}</td><td style="text-align:left;white-space:normal">${esc(p[5])}</td><td><select data-gpst="${p[0]}" style="border:1px solid #38BDF8;border-radius:6px;padding:4px 6px;background:${bg};font:inherit;color:#0f172a">${opts.map(o=>`<option${o===cur?' selected':''}>${o}</option>`).join('')}</select></td></tr>`;}).join('')+`</tbody></table></div>`;
}
/* ---- điểm nóng: NPP / SS / quầy cụ thể ---- */
function block4b(c){
  const A=agg(), N=topN(A.npp.filter(x=>sc(x.asm)),'short',8), S4=topN(A.ss.filter(x=>sc(x.asm)),'short',10);
  const lh=(h,l)=>`<th style="${l?THL:TH}">${h}</th>`;
  const t1=`<table class="t8asmtbl"><thead><tr>${lh('ASM',1)}${lh('NPP',1)}${lh('SO MTD (tỷ)')}${lh('%Đạt')}${lh('SO/ngày hiện → cần (tỷ)')}${lh('Thiếu dự kiến (tỷ, ước tính)')}</tr></thead><tbody>`+N.map(x=>`<tr><td style="text-align:left">${esc(SHORT[x.asm]||x.asm)}</td><td style="text-align:left">${esc(x.npp)}</td><td>${ty(x.so)}</td><td><b>${pc(x.so,x.tg)}</b></td><td>${ty(x.cur)} → ${ty(x.need)}</td><td><b>${ty(x.short)}</b></td></tr>`).join('')+`</tbody></table>`;
  const t2=`<table class="t8asmtbl"><thead><tr>${lh('ASM',1)}${lh('NPP',1)}${lh('SS',1)}${lh('%Đạt')}${lh('Thiếu dự kiến (tỷ)')}${lh('Quầy rơi (SO kỳ trước)')}${lh('Quầy MCP đã mua T11')}${lh('HV sắp đạt (thiếu, tr)')}</tr></thead><tbody>`+S4.map(x=>`<tr><td style="text-align:left">${esc(SHORT[x.asm]||x.asm)}</td><td style="text-align:left">${esc(x.npp)}</td><td style="text-align:left"><b>${esc(x.ss)}</b></td><td>${pc(x.so,x.tg)}</td><td><b>${ty(x.short)}</b></td><td>${nf(x.drop,0)} (${ty(x.dropSO)} tỷ)</td><td>${nf(x.srv,0)}/${nf(x.srn,0)} (${pc(x.srv,x.srn)})</td><td>${nf(x.hv,0)} (${nf(x.hvGap/1e6,0)})</td></tr>`).join('')+`</tbody></table>`;
  const Q=GP11.top.filter(r=>sc(srOf(r[0])[2])).sort((p,q)=>q[3]-p[3]).slice(0,10);
  const t3=`<table class="t8asmtbl"><thead><tr>${lh('Quầy',1)}${lh('Mã',1)}${lh('SS',1)}${lh('NPP',1)}${lh('SO kỳ trước (T10 01–10/10, tr)')}</tr></thead><tbody>`+Q.map(r=>{const m=srOf(r[0]);return `<tr><td style="text-align:left">${esc(r[2])}</td><td style="text-align:left">${esc(r[1])}</td><td style="text-align:left">${esc(m[4])}</td><td style="text-align:left">${esc(m[3])}</td><td>${nf(r[3]/1e6,1)}</td></tr>`;}).join('')+`</tbody></table>`;
  const sub=t=>`<div style="margin:12px 0 4px;font-weight:700;color:#0369A1">${t}</div><div style="overflow-x:auto">`;
  return sub('NPP thiếu nhiều nhất so với chỉ tiêu (thiếu dự kiến = chỉ tiêu − dự kiến giữ đà)')+t1+'</div>'+sub('SS cần can thiệp trước: quầy rơi, ĐDKD chưa phát sinh đơn, hội viên sắp đạt')+t2+`</div><div class="pnote" style="margin-top:6px">Quầy rơi = quầy mua trong 01–10/10 nhưng chưa mua trong 01–10/11. Quầy MCP đã mua = quầy có đơn T11 trên tổng quầy MCP của SS. Số quầy theo MCP T11 và raw đơn hàng.</div>`+sub('10 quầy rơi có SO kỳ trước lớn nhất (danh sách gọi/thăm trước)')+t3+'</div>';
}
/* ---- cơ hội định lượng (giả định sửa được) ---- */
function opps(c,k){
  const g=gp11(), hs=hvStat(), hm=hvMore(), cb=comboOff(), cat=cats(), b=BM(), rem=c.rem, nb=nbScope();
  const R=[];
  R.push({id:'wb',t:'Quầy rơi: đã mua đầu T10, chưa mua đầu T11',n:g.drop,u:'quầy',base:`SO kỳ trước ${ty(g.dropSO)} tỷ. Tham chiếu T10: ${nf(b.late_rate*100,1)}% quầy chưa mua đầu tháng vẫn mua cuối tháng (phần này đã nằm trong dự kiến giữ đà)`,pr:[['lift','Tăng tỷ lệ mua lại thêm (điểm %)']],est:g.drop*par('lift')/100*b.late_avg,how:`quầy × điểm % tăng thêm × SO bình quân/quầy mua lại cuối tháng T10 (${nf(b.late_avg/1e6,2)} tr)`});
  R.push({id:'idle',t:'Quầy MCP chưa mua cả hai kỳ (đầu T10 và đầu T11)',n:Math.max(0,(g.mcp-g.a11)-g.drop),u:'quầy',base:'quầy trong MCP chưa có đơn ở cả hai kỳ so sánh',pr:[['lift2','Tăng tỷ lệ phát sinh thêm (điểm %)']],est:Math.max(0,(g.mcp-g.a11)-g.drop)*par('lift2')/100*b.late_avg,how:`quầy × điểm % × SO bình quân/quầy (${nf(b.late_avg/1e6,2)} tr)`});
  R.push({id:'dor',t:'Quầy Off 2 tháng liền không mua (T9–T10)',n:nb.v,u:'quầy',base:'số từ dữ liệu T9–T10 (mới nhất có sẵn); có thể trùng với hai dòng trên',pr:[['dor','Đánh thức được (%)']],est:nb.v*par('dor')/100*b.late_avg,how:`quầy × % đánh thức × SO bình quân/quầy (${nf(b.late_avg/1e6,2)} tr)`});
  R.push({id:'near',t:'KH Off có đơn 500–800K chưa nhận combo (gần ngưỡng)',n:g.near,u:'KH',base:`cần thêm tổng ${nf(g.nearGap/1e6,0)} tr để mỗi KH lên đủ ngưỡng đơn 800K`,pr:[['near','Nâng được đơn lên ngưỡng (%)']],est:g.nearGap*par('near')/100,how:'tổng phần thiếu đến 800K × % nâng được'});
  const more=Math.max(0,Math.round(0.35*cb.n-cb.nhan)), up=Math.max(0,b.ord_combo-b.ord_non);
  R.push({id:'cmb',t:'Nâng KH L1 Off nhận combo lên 35%',n:more,u:'KH cần thêm',base:`hiện ${pc(cb.nhan,cb.n)}; đơn có combo bình quân ${nf(b.ord_combo/1e6,2)} tr so với ${nf(b.ord_non/1e6,2)} tr đơn không combo (chênh ${nf(up/1e6,2)} tr, có thể do KH vốn mua lớn)`,pr:[['cmb','Phần chênh đơn thực sự do combo (%)']],est:more*up*par('cmb')/100,how:'KH cần thêm × chênh giá trị đơn × % do combo tạo ra (1 đơn/KH)'});
  R.push({id:'hvs',t:'Hội viên sắp đạt NV1 (thiếu ≤30% chỉ tiêu nền)',n:hs.sap,u:'KH',base:`tổng DS còn thiếu để đạt 95% nền: ${ty(hm.sapGap)} tỷ`,pr:[['hvs','KH bù đủ phần thiếu (%)']],est:hm.sapGap*par('hvs')/100,how:'DS còn thiếu × % KH bù đủ (phần này có thể đã nằm trong nhịp mua thường)'});
  R.push({id:'hvc',t:'Hội viên chưa mua T11',n:hs.chua,u:'KH',base:`tổng chỉ tiêu nền của nhóm này ${ty(hm.chuaBase)} tỷ`,pr:[['hvc','KH mua được (%)'],['hvb','Mua bằng % nền']],est:hm.chuaBase*par('hvc')/100*par('hvb')/100,how:'chỉ tiêu nền × % KH mua được × % nền mua được trong tháng'});
  const neg=cat.filter(x=>x.g<0), cg=neg.reduce((t,x)=>t+(x.b-x.a),0);
  R.push({id:'cat',t:'Ngành hàng thấp hơn T10 cùng kỳ: '+(neg.map(x=>x.n).join(', ')||'không có'),n:neg.length,u:'ngành',base:neg.map(x=>x.n+' '+nf(x.g*100,1)+'%').join(' · ')||'—',pr:[['cat','Kéo lại được (%)']],est:cg*rem*par('cat')/100,how:'(SO/ngày T10 cùng kỳ − SO/ngày hiện tại) × ngày công còn lại × % kéo lại'});
  return R;
}
function nbScope(){const o={v:0}; Object.keys(SNAP.nb).forEach(a=>{if(sc(a))o.v+=SNAP.nb[a];}); return o;}
function block5(c,k,gap){
  const R=opps(c,k); let t=0; R.forEach(r=>{t+=r.est;});
  const hc=par('hc')/100, adj=t*hc, fcs=forecast(c,k.k), scen=fcs+adj;
  const rows=R.map(r=>`<tr><td style="text-align:left;white-space:normal;min-width:210px"><b>${esc(r.t)}</b></td><td><b>${nf(r.n,0)}</b> ${r.u}</td><td style="text-align:left;white-space:normal;min-width:220px">${esc(r.base)}</td><td style="text-align:left;white-space:normal">${r.pr.map(p=>`<div style="margin-bottom:3px">${esc(p[1])}: ${parIn(p[0])}</div>`).join('')}</td><td><b>${ty(r.est)}</b></td><td style="text-align:left;white-space:normal;min-width:200px;font-size:11.5px;color:#475569">${esc(r.how)}</td></tr>`).join('');
  return `<div style="overflow-x:auto"><table class="t8asmtbl"><thead><tr><th style="${THL}">Cơ hội</th><th style="${TH}">Số lượng (live)</th><th style="${THL}">Cơ sở số liệu</th><th style="${THL}">Giả định (sửa được)</th><th style="${TH}">Ước tính SO thêm (tỷ)</th><th style="${THL}">Cách tính</th></tr></thead><tbody>${rows}<tr class="tot"><td style="text-align:left"><b>Cộng thô các cơ hội</b></td><td></td><td style="text-align:left;white-space:normal">các dòng có thể chồng nhau (một quầy nằm ở nhiều dòng)</td><td style="text-align:left">Hệ số thận trọng (loại trùng, thực thi thấp hơn kế hoạch): ${parIn('hc')}%</td><td><b>${ty(adj)}</b></td><td style="text-align:left;font-size:11.5px">cộng thô ${ty(t)} tỷ × hệ số thận trọng</td></tr></tbody></table></div>`+
  `<div style="margin-top:10px" class="kpis"><div class="kpi" style="border-top:3px solid #38BDF8"><div class="k-lab">Dự kiến giữ đà (ước tính)</div><div class="k-val">${ty(fcs)} tỷ</div><div class="k-sub">${pc(fcs,c.tg)} chỉ tiêu</div></div><div class="kpi" style="border-top:3px solid #0EA5E9"><div class="k-lab">+ Cơ hội sau thận trọng (ước tính)</div><div class="k-val">${ty(adj)} tỷ</div><div class="k-sub">${pc(adj,c.tg)} chỉ tiêu</div></div><div class="kpi" style="border-top:3px solid #0369A1"><div class="k-lab">Kịch bản thực tế (ước tính)</div><div class="k-val">${ty(scen)} tỷ</div><div class="k-sub">${pc(scen,c.tg)} chỉ tiêu</div></div><div class="kpi" style="border-top:3px solid ${scen>=c.tg?'#16a34a':'#d97706'}"><div class="k-lab">${scen>=c.tg?'Vượt chỉ tiêu':'Còn thiếu so với 100%'}</div><div class="k-val">${ty(Math.abs(c.tg-scen))} tỷ</div><div class="k-sub">${scen>=c.tg?'':'cần thêm '+ty((c.tg-scen)/Math.max(1,c.rem))+' tỷ mỗi ngày công, ngoài các cơ hội trên'}</div></div></div>`+
  `<div class="pnote" style="margin-top:6px">Tất cả là <b>ước tính</b>. Số lượng và cơ sở là số live từ dữ liệu; giả định là ô sửa được (lưu trên trình duyệt). Tham chiếu tỷ lệ mua lại lấy từ T10: ${nf(BM().late_rate*100,1)}% quầy chưa mua trong 10 ngày đầu vẫn mua sau đó, SO bình quân ${nf(BM().late_avg/1e6,2)} tr/quầy. Nếu kịch bản còn thiếu, phần thiếu cần quyết định thêm (đẩy đơn lớn theo ngành, chương trình, nhân lực), không nên coi là đã có.</div>`;
}
/* ---- timeline triển khai ---- */
function block7(c,k){
  const g=gp11(), b=BM(), R=opps(c,k), rate=b.late_rate+par('lift')/100, rem=c.rem, last=Number(T11_META.last_date.split('/')[0]);
  const wds=mocDates().map(x=>Math.max(0,x.wd-c.d)/Math.max(1,rem));     // tỷ lệ tiến độ ngày công còn lại tại mỗi mốc
  const rw=i=>nf(g.drop*rate*wds[i],0);
  const hv=hvStat(), cb=comboOff(), more=Math.max(0,Math.round(0.35*cb.n-cb.nhan));
  const rows=[
   [(last+1)+'/11','Chốt kế hoạch: họp ASM, chia danh sách quầy rơi, hội viên sắp đạt, KH gần ngưỡng combo theo SS/SR từ dashboard','RSM · 5 ASM','100% SS nhận danh sách; ASM chốt cam kết trong tab',`Cam kết toàn Miền ≥ dự kiến giữ đà ${ty(forecast(core('all'),k.k))} tỷ`],
   [(last+2)+'–14/11','Giai đoạn 1: thăm/gọi quầy rơi có SO kỳ trước lớn; chốt đơn cho KH hội viên sắp đạt; xác nhận đơn chờ trong 24 giờ','SS · SR · ASM',`Quầy rơi mua lại lũy kế ≥ ${rw(0)} quầy; đơn chờ ${ty(hv.pend)} tỷ được xác nhận hàng ngày`,'Mốc 14/11: SO lũy kế ≥ '+ty(core('all').mtd+core('all').need*(mocDates()[0].wd-c.d))+' tỷ'],
   ['15–21/11','Giai đoạn 2: chào combo cho KH Off gần ngưỡng đơn 800K; dồn Gia vị, Mì; HPC rà tồn và trưng bày; đánh thức quầy 2 tháng không mua','ĐDKD · SS · NPP',`KH Off nhận combo thêm ≥ ${nf(more*wds[1],0)} (lũy kế); quầy rơi mua lại lũy kế ≥ ${rw(1)}`,'Mốc 21/11: SO lũy kế ≥ '+ty(core('all').mtd+core('all').need*(mocDates()[1].wd-c.d))+' tỷ · nhập chỉ tiêu T12 trước 25/11'],
   ['22–28/11','Giai đoạn 3: dồn KH hội viên đạt NV1 và NV2 (thiếu nhãn), chốt đơn lớn cuối tuần; ASM rà NPP còn hụt, điều SR kèm cặp','ASM · SS',`${nf(hv.sap,0)} KH sắp đạt NV1 chuyển thành đạt; quầy rơi mua lại lũy kế ≥ ${rw(2)}`,'Mốc 28/11: SO lũy kế ≥ '+ty(core('all').mtd+core('all').need*(mocDates()[2].wd-c.d))+' tỷ'],
   ['29–30/11','Chốt tháng: xác nhận hết đơn chờ, đơn tồn NPP; đối chiếu số cuối ngày; chốt danh sách kéo sang T12','RSM · ASM · NPP',`Quầy rơi mua lại ≥ ${rw(3)}; không còn đơn chờ quá 24 giờ`,'Chốt 30/11: SO ≥ '+ty(core('all').tg)+' tỷ (chỉ tiêu)']];
  return `<div style="overflow-x:auto"><table class="t8asmtbl"><thead><tr><th style="${THL}">Thời gian</th><th style="${THL}">Việc triển khai</th><th style="${THL}">Phụ trách</th><th style="${THL}">KPI đầu việc (số live)</th><th style="${THL}">Mốc kết quả</th></tr></thead><tbody>`+rows.map(r=>`<tr><td style="text-align:left;white-space:nowrap"><b>${r[0]}</b></td><td style="text-align:left;white-space:normal;min-width:300px">${esc(r[1])}</td><td style="text-align:left;white-space:normal">${esc(r[2])}</td><td style="text-align:left;white-space:normal;min-width:240px">${esc(r[3])}</td><td style="text-align:left;white-space:normal;min-width:200px">${esc(r[4])}</td></tr>`).join('')+`</tbody></table></div><div class="pnote" style="margin-top:6px">Mục tiêu quầy rơi mua lại = tỷ lệ mua lại tham chiếu T10 (${nf(BM().late_rate*100,1)}%) cộng ${nf(par('lift'),0)} điểm % (giả định ở khối cơ hội), chia theo tỷ lệ ngày công còn lại. Mốc SO là ước tính theo đường về đích ở khối 3.</div>`;
}
/* ---- KPI hằng ngày theo ASM ---- */
function block8(k){
  const b=BM(), A=['all'].concat(ASMS_()); const rate=b.late_rate+par('lift')/100;
  const rows=A.map(a=>{const c=core(a); const rws=T11.filter(r=>a==='all'||r.asm===a); const pcD=rws.reduce((t,r)=>t+((r.v['a|all']||{}).pc||0),0)/c.d;
    let srn=0,drop=0; GP11.rows.forEach(r=>{const m=srOf(r[0]); if(a!=='all'&&m[2]!==a)return; if(r[1]>0)srn++; drop+=r[4];});
    const mul=c.cur?c.need/c.cur:0, add=(c.need-c.cur);
    return `<tr${a==='all'?' class="tot"':''}><td style="text-align:left;white-space:nowrap">${esc(lab(a))}</td><td>${ty(c.cur)}</td><td><b>${ty(c.need)}</b></td><td><b>${c.cur?(mul>=1?'+':'')+nf((mul-1)*100,1)+'%':'—'}</b></td><td>${nf(srn,0)}</td><td>${srn?nf(Math.max(0,add)/srn/1e6,2):'—'}</td><td>${nf(pcD,0)}</td><td>${nf(pcD*mul,0)}</td><td>${nf(drop*rate/Math.max(1,c.rem),0)}</td><td>${srn?nf(drop*rate/Math.max(1,c.rem)/srn,1):'—'}</td></tr>`;}).join('');
  return `<div style="overflow-x:auto"><table class="t8asmtbl"><thead><tr><th style="${THL}">Phạm vi</th><th style="${TH}">SO/ngày hiện tại (tỷ)</th><th style="${TH}">SO/ngày cần (tỷ)</th><th style="${TH}">Cần tăng</th><th style="${TH}">Số ĐDKD (có MCP)</th><th style="${TH}">Cần thêm / ĐDKD / ngày (tr)</th><th style="${TH}">PC/ngày hiện tại</th><th style="${TH}">PC/ngày cần (ước tính)</th><th style="${TH}">Quầy rơi cần mua lại / ngày</th><th style="${TH}">Mỗi ĐDKD / ngày</th></tr></thead><tbody>${rows}</tbody></table></div><div class="pnote" style="margin-top:6px">PC/ngày cần là <b>ước tính</b>: giữ nguyên số line/PC và giá trị/line hiện tại, SO tăng thì PC tăng cùng tỷ lệ. Quầy rơi cần mua lại/ngày theo mục tiêu ở khối timeline.</div>`;
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
  const c=core(S.asm), k=accel(), hv=hvStat(), cb=comboOff(), cat=cats(), g=gp11();
  const nb=nbScope(); nb.by={}; Object.keys(SNAP.nb).forEach(a=>{if(sc(a))nb.by[a]=SNAP.nb[a];});
  const b2=block2(k), gap=Math.max(0,c.tg-(S.asm==='all'?b2.fc:forecast(c,k.k)));
  return {c,k,hv,cb,cat,nb,b2,gap,g};
}
function body(m){
  const {c,k,hv,cb,cat,nb,b2,gap,g}=m;
  const sec=(n,t,inner,note)=>`<div class="panel" style="margin-top:14px;border-top:3px solid #0EA5E9"><div class="tbl-head"><div>${H(n+'. '+t)}${note?` <span class="pnote" style="display:inline">${note}</span>`:''}</div></div>${inner}</div>`;
  return sec(1,'Hiện trạng · '+esc(lab(S.asm)),block1(c,k))+
   sec(2,'Dự kiến và cam kết theo ASM',b2.html+`<div class="pnote" style="margin-top:6px">Dự kiến (<b>ước tính</b>) = SO MTD + SO/ngày hiện tại × hệ số tăng tốc (${nf(k.k,2)}) × ngày công còn lại (${c.rem}). Hệ số lấy từ T10 toàn Miền và áp cho mọi ASM. Cam kết mặc định bằng dự kiến, sửa ô để nhập cam kết (lưu trên trình duyệt). Tổng SO/ngày cần của 5 ASM = ${ty(b2.needSum)} tỷ, bằng Toàn Miền ${ty(b2.needAll)} tỷ.</div>`)+
   sec(3,'Mốc theo tuần · '+esc(lab(S.asm)),block3(c))+
   sec(4,'Điểm nóng: NPP, SS và quầy cần xử lý trước · '+esc(lab(S.asm)),block4b(c))+
   sec(5,'Giải pháp cụ thể',block4(c,hv,cb,cat,nb,g),'việc, phụ trách, KPI live, hạn · trạng thái lưu trên trình duyệt')+
   sec(6,'Cơ hội bán hàng định lượng và kịch bản · '+esc(lab(S.asm)),block5(c,k,gap))+
   sec(7,'Timeline triển khai',block7(c,k),'theo ngày công còn lại')+
   sec(8,'KPI theo dõi hằng ngày theo ASM',block8(k))+
   sec(9,'Tháng 12 · Toàn Miền',block6(core('all'),b2.cam));
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
    const m=build(), {c,k,hv,cb,cat,nb,g}=m; const P=plans(c,hv,cb,cat,nb,g); const warn=c.need>c.mx&&c.mx>0;
    const kp=(l,v,s)=>`<div class="pk"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${s||''}</div></div>`;
    const cam=a==='all'?m.b2.cam:camVal(a,forecast(c,k.k));
    const mo=mocDates().map(x=>{const w=Math.max(x.wd,c.d),so=c.mtd+c.need*(w-c.d);return `<tr><td>${x.d}/11</td><td>${x.wd}/${c.D}</td><td>${ty(so)}</td><td>${pc(so,c.tg)}</td></tr>`;}).join('');
    return `<div class="v3pp"><div class="pph"><div><div class="eb">Masan Consumer · Kênh GT · Miền Trung</div><h1>Họp ASM · Giải pháp T11–T12 <small>${esc(lab(a))}</small></h1></div><div class="meta">SO T11 đến hết ${T11_META.last_date}<br>ngày công ${c.d}/${c.D}</div></div>`+
     `<h2>1. Hiện trạng</h2><div class="pks">${kp('SO MTD',ty(c.mtd)+' tỷ',pc(c.mtd,c.tg)+' chỉ tiêu '+ty(c.tg)+' tỷ')}${kp('SO/ngày hiện tại',ty(c.cur)+' tỷ','cần '+ty(c.need)+' tỷ để đạt 100%')}${kp('Ngày công còn lại',c.rem,'time gone '+pc(c.d,c.D))}${kp('Dự kiến giữ đà (ước tính)',ty(forecast(c,k.k))+' tỷ',pc(forecast(c,k.k),c.tg)+' · hệ số '+nf(k.k,2))}${kp('Cam kết',nf(cam,2)+' tỷ',pc(cam*1e9,c.tg)+' chỉ tiêu')}${kp('SO/ngày cao nhất T7–T10',ty(c.mx)+' tỷ',warn?'⚠ cần cao hơn '+nf((c.need/c.mx-1)*100,1)+'%':'trong khả năng')}</div>`+
     `<h2>2. Mốc theo tuần (ước tính theo đường về đích)</h2><table class="pt"><thead><tr><th>Mốc</th><th>Ngày công</th><th>SO lũy kế (tỷ)</th><th>%Đạt chỉ tiêu</th></tr></thead><tbody>${mo}</tbody></table>`+
     `<h2>3. Giải pháp</h2><table class="pt"><thead><tr><th>Giải pháp</th><th>Phụ trách</th><th>KPI đo</th><th>Hạn</th><th>Trạng thái</th></tr></thead><tbody>${P.map(p=>`<tr><td><b>${esc(p[1])}</b><br>${esc(p[2])}</td><td>${esc(p[3])}</td><td>${esc(p[4])}</td><td>${esc(p[5])}</td><td>${esc(LS.g('st|'+p[0])||'Chưa làm')}</td></tr>`).join('')}</tbody></table>`+
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
