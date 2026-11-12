/* Tab "Giải pháp T11–12": 7 mục tiêu T11 (ASO Off 95% · ASO On 75% · LPPC Off +1 line/PC · PC/Call plan Off 70% · On 50% · Hội viên Tết 70% · Combo Off 70%)
   Khoan sâu ASM → NPP → SS. Số liệu live từ dashboard (T11, T10, T9, T11S, ON7_11, GP11, HS11, HVT11, CBT11). Mọi số SO thêm là ƯỚC TÍNH, tham số sửa được. */
(function(){
const X=()=>window.GPX;
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const nf=(n,d)=>(n==null||isNaN(n))?'—':n.toLocaleString('vi-VN',{minimumFractionDigits:d==null?1:d,maximumFractionDigits:d==null?1:d});
const ty=n=>(n==null||isNaN(n))?'—':nf(n/1e9,2);
const pc=(a,b,d)=>b?nf(a/b*100,d==null?1:d)+'%':'—';
const LSK='nv5:';
const LS={g(k){try{return localStorage.getItem(LSK+k);}catch(e){return null;}},s(k,v){try{localStorage.setItem(LSK+k,v);}catch(e){}}};
const PAR0={aso:95,on:75,lpAdd:1,lpe:50,hsO:70,hsN:50,hsq:70,hvT:70,cbT:70,ov:30,hc:50};
const PK=Object.keys(PAR0);
const par12=k=>{const v=X().pn(LS.g('p|'+k+'12')); if(v!=null)return v; if(k==='so'){let e=0; try{APQ.forEach(r=>{ if(S.asm!=='all'&&r[0]!==S.asm)return; e+=r[5][2];});}catch(x){} return e/1e9;} return par(k);};
const par=k=>{const v=X().pn(LS.g('p|'+k)); return v==null?PAR0[k]:v;};
const S={asm:'all',m:'aso',open:new Set()};
const VN=['LẺ','VIP3','VIP5','VIPSI'];
const clean=s=>String(s||'').replace(/ \(.*\)/,'').trim(), base=s=>String(s||'').replace(' - Chi nhánh','').trim();
const TH='background:#0369A1;color:#fff;padding:7px 8px;font-size:13px;text-align:right;white-space:normal',THL=TH.replace('text-align:right','text-align:left');
const card=(l,v,s,ac)=>`<div class="kpi" style="border-top:3px solid ${ac||'#0EA5E9'}"><div class="k-lab">${l}</div><div class="k-val">${v}</div><div class="k-sub">${s||''}</div></div>`;
const inp=(id,val,w)=>`<input data-nv="${id}" value="${esc(val)}" inputmode="decimal" style="width:${w||56}px;text-align:right;border:1px solid #38BDF8;background:#f0f9ff;border-radius:6px;padding:4px 6px;font:inherit;color:inherit">`;
const stc=r=>r>=1?'background:#d1fae5;color:#065f46':r>=0.8?'background:#fef3c7;color:#92400e':'background:#fee2e2;color:#991b1b';
const vk=oo=>((typeof MEAT!=='undefined'&&MEAT==='excl')?'x':'a')+'|'+(oo||F.oo)+(F.vip==='all'?'':'|'+F.vip);
const vo=(r,oo)=>{ if(oo==='OFF'&&F.oo==='ON')return {}; if(oo==='ON'&&F.oo==='OFF')return {}; return r.v[vk(oo)]||{}; };
let CACHE=null,CK='';
function compute(){
  const key=[F.oo,F.vip,typeof MEAT!=='undefined'?MEAT:'',T11_META.last_date,PK.map(par).join(',')].join('|');
  if(CACHE&&CK===key)return CACHE; CK=key;
  const x=X(), d=T11_META.mtd_days, D=T11_META.days_total, rem=D-d, k=x.accel().k, rf=rem/D;
  const bench=GP11.meta.bench||{}, cmbP=x.par('cmb')/100, cbVal=Math.max(0,(bench.ord_combo||0)-(bench.ord_non||0));
  const SS=new Map(), byClean=new Map(), ALI=new Map();
  T11.forEach(r=>{ if(((r.v['a|all']||{}).so||0)>0)return; const c=T11.find(q=>q!==r&&q.asm===r.asm&&base(q.npp)===base(r.npp)&&((q.v['a|all']||{}).so||0)>0); if(c)ALI.set(r.asm+'|'+r.ssn,c.asm+'|'+c.ssn);});
  const K=(a,n)=>{const kk=a+'|'+n; return ALI.get(kk)||kk;};
  const hh=()=>({cp:0,pc:0,so:0,cpr:0});
  const mk=(r)=>({asm:r.asm,npps:[],ss:r.ssn,so:0,tg:0,tgFull:0,pc:0,li:0,aso:0,sm:0,mcp:0,asoOff:0,mcpOff:0,asoOn:0,mcpOn:0,soOff:0,pcOff:0,liOff:0,
    t10:{so:0,soAll:0,offSo:0,offAso:0,onSo:0,onAso:0,offPc:0,offLi:0,sm:0,onPc:0},t9:{off:0,on:0,offPc:0,offLi:0,sm:0,onPc:0},hv9:{n:0,dat:0,n9:0,dat9:0},on7:{q:0,a:0},drop:0,dropSO:0,srn:0,top:[],
    hv:{n:0,m1:0,auto:0,L:[],need:0,pick:[],inc:0},cb:{n:0,mua:0,nhan:0,more:0,ds:0},hs:{O:hh(),N:hh()},hsM:new Map()});
  [...T11].sort((p,q)=>(ALI.has(p.asm+'|'+p.ssn)?1:0)-(ALI.has(q.asm+'|'+q.ssn)?1:0)).forEach(r=>{const kk=K(r.asm,r.ssn); let o=SS.get(kk); if(!o){o=mk(r);SS.set(kk,o);} const a=r.v[vk()]||{}, f=vo(r,'OFF'), n=vo(r,'ON');
    if(o.npps.indexOf(r.npp)<0)o.npps.push(r.npp);
    o.soA=(o.soA||0)+((r.v[((typeof MEAT!=='undefined'&&MEAT==='excl')?'x':'a')+'|all']||{}).so||0);o.so+=a.so||0;o.pc+=a.pc||0;o.li+=a.lines||0;o.aso+=a.aso||0;o.sm+=a.sm||0;o.mcp+=r.mcp||0;
    o.tgFull+=((((r.tgm||{})['11'])||[r.target||0])[(typeof MEAT!=='undefined'&&MEAT==='excl')?1:0])||0;
    o.asoOff+=f.aso||0; o.asoOn+=n.aso||0; o.soOff+=f.so||0; o.pcOff+=f.pc||0; o.liOff+=f.lines||0;
    byClean.set(clean(r.ss)+'|'+base(r.npp),o); byClean.set(clean(r.ssn)+'|'+base(r.npp),o);});
  T10.forEach(r=>{const o=SS.get(K(r.asm,r.ssn)); if(!o)return; const f=vo(r,'OFF'),n=vo(r,'ON'),a10=r.v[vk()]||{};
    o.t10.so+=a10.so||0;o.t10.soAll+=((r.v[((typeof MEAT!=='undefined'&&MEAT==='excl')?'x':'a')+'|all']||{}).so)||0;o.t10.offSo+=f.so||0;o.t10.offAso+=f.aso||0;o.t10.onSo+=n.so||0;o.t10.onAso+=n.aso||0;o.t10.offPc+=f.pc||0;o.t10.offLi+=f.lines||0;o.t10.sm+=a10.sm||0;o.t10.onPc+=n.pc||0;});
  T9.forEach(r=>{const o=SS.get(K(r.asm,r.ssn)); if(!o)return; const f=vo(r,'OFF');o.t9.off+=f.aso||0;o.t9.on+=vo(r,'ON').aso||0;o.t9.offPc+=f.pc||0;o.t9.offLi+=f.lines||0;o.t9.sm+=(r.v[vk()]||{}).sm||0;o.t9.onPc+=vo(r,'ON').pc||0;});
  T11S.DATA.forEach(r=>{const o=byClean.get(clean(r.ss)+'|'+base(r.npp)); if(!o)return; if((F.vip!=='all'&&r.vip!==F.vip)||(F.oo!=='all'&&r.oo!==F.oo))return; if(r.oo==='OFF')o.mcpOff+=r.q11||0; else o.mcpOn+=r.q11||0;});
  const on=ON7_11; const onIdx=on.k.map(q=>{let o=null; SS.forEach(v=>{if(!o&&v.asm===q[1]&&clean(v.ss)===clean(q[0]))o=v;}); return o;});
  on.r.forEach(r=>{const o=onIdx[r[1]]; if(!o||r[2]>6)return; o.on7.q+=r[4];o.on7.a+=r[5];});
  const ssOf=m=>SS.get(K(m[2],m[4]));
  GP11.rows.forEach(r=>{const o=ssOf(x.srOf(r[0])); if(!o)return; o.drop+=r[4];o.dropSO+=r[5];o.srn++;});
  GP11.top.forEach(t=>{const o=ssOf(x.srOf(t[0])); if(o)o.top.push({code:t[1],name:t[2],so:t[3],sr:x.srOf(t[0])[1]});});
  // Hiệu suất PC / Call plan (HS11): MTD đến last_day, call plan còn lại = các ngày sau đó
  const cm=new Map(); [HVT11.sr,COMBO11.sr,CBT11.sr].forEach(L=>L.forEach(z=>{ if(z[2]&&z[3]&&z[4]&&z[4]!=='Chưa gán SS'&&!cm.has(String(z[0])))cm.set(String(z[0]),z);}));
  const HM=HS11.meta, LD=HM.last_day;
  HS11.rows.forEach(r=>{ if(F.oo!=='all'&&(r[3]===1?'ON':'OFF')!==F.oo)return; if(F.vip!=='all'&&VN[r[4]]!==F.vip)return;
    const m=cm.get(String(r[2])); if(!m)return; const o=ssOf(m); if(!o)return; let cp=0,pcv=0,so=0,cpr=0;
    for(let j=0;j<HM.days;j++){ if(j<LD){cp+=r[5][j];pcv+=r[6][j];so+=r[9][j]*1e3;} else cpr+=r[5][j]; }
    const h=r[3]===1?o.hs.N:o.hs.O; h.cp+=cp;h.pc+=pcv;h.so+=so;h.cpr+=cpr;
    const sk=String(r[2])+'|'+r[3]; let e=o.hsM.get(sk); if(!e){e={name:r[1],oo:r[3]===1?'On':'Off',cp:0,pc:0};o.hsM.set(sk,e);} e.cp+=cp;e.pc+=pcv;});
  // Hội viên Tết: KH đạt NV1 (DS ≥ 95% nền); dự phóng cuối tháng = DS + DS/ngày × ngày còn lại × hệ số tăng tốc
  HVT11.rows.forEach(r=>{const m=HVT11.sr[r[0]], o=m&&ssOf(m); if(!o)return; const b=r[6],ds=r[5]; const h=o.hv; h.n++; if(!(b>0))return;
    if(ds>=0.95*b)h.m1++; const proj=ds+ds/d*rem*k; if(proj>=0.95*b)h.auto++; else h.L.push({gap:0.95*b-proj,code:r[1],name:r[2],sr:m[1],ds,base:b});});
  // Hội viên Doanh nhân T9/T10 (tab Hội viên): % KH đạt, dùng làm mốc so sánh T9/T10 cho Hội viên Tết
  try{ const byAS=new Map(); SS.forEach(o=>byAS.set(o.asm+'|'+clean(o.ss),o));
    HV10.rows.forEach(r=>{ if(HV_STALE&&r[7]>=3)return; const a=hvA(r[2]), sn=hvS(r[4]); const o=SS.get(K(a,sn))||byAS.get(a+'|'+clean(sn)); if(!o)return; const g=o.hv9; g.n++; g.dat+=r[11]; if(r[14]){g.n9++;g.dat9+=r[14][3];}});
  }catch(e){console.error('NV5 HV10',e);}
  // Combo Off: KH có đơn combo / KH Off đã mua
  CBT11.rows.forEach(r=>{ if(r[1]!==0)return; const o=ssOf(CBT11.sr[r[0]]); if(o){o.cb.n+=r[2];o.cb.mua+=r[5];o.cb.nhan+=r[6];}});
  const EST=F.oo!=='all'||F.vip!=='all';
  const A=[]; SS.forEach(o=>{
    o.tg=o.tgFull; o.so=o.soA||0;
    o.cur=o.so/d; o.B=o.cur*k*rem; o.fc=o.so+o.B; o.short=Math.max(0,o.tg-o.fc);
    // 1) ASO Off / On
    const tOff=par('aso')/100*o.mcpOff, dOff=Math.max(0,tOff-o.t10.offAso), kOff=o.t10.offAso?o.t10.offSo/o.t10.offAso:0;
    o.n1={tOff,dOff,dsOff:dOff*kOff*rf};
    const tOn=par('on')/100*o.mcpOn, dOn=Math.max(0,tOn-o.t10.onAso), kOn=o.t10.onAso?o.t10.onSo/o.t10.onAso:0;
    o.n1.tOn=tOn;o.n1.dOn=dOn;o.n1.dsOn=dOn*kOn*rf;
    // 2) PC / call plan Off + On
    const hs=(h,t)=>{const cur=h.cp?h.pc/h.cp:0, ex=h.cp&&cur<t?(t-cur)*h.cpr:0, sp=h.pc?h.so/h.pc:0; return {cur,ex,ds:ex*sp*par('hsq')/100,sp};};
    const hO=hs(o.hs.O,par('hsO')/100), hN=hs(o.hs.N,par('hsN')/100);
    o.n2={curO:hO.cur,curN:hN.cur,exO:hO.ex,exN:hN.ex,dsO:hO.ds,dsN:hN.ds};
    // 3) LPPC Off +1 line/PC
    const lpO=o.pcOff?o.liOff/o.pcOff:0, Boff=o.soOff/d*k*rem;
    o.n3={lp:lpO,ds:lpO?Boff*(par('lpAdd')/lpO)*par('lpe')/100:0};
    // 4) Hội viên Tết đạt 70%
    const h=o.hv; h.need=Math.max(0,Math.ceil(par('hvT')/100*h.n)-h.auto); h.L.sort((p,q)=>p.gap-q.gap); h.pick=h.L.slice(0,h.need); h.inc=h.pick.reduce((t,q)=>t+q.gap,0);
    // 5) Combo Off
    const c=o.cb; c.auto=c.nhan; c.more=Math.max(0,Math.ceil(par('cbT')/100*c.n)-Math.round(c.auto)); c.ds=c.more*cbVal*cmbP;
    o.gross=o.n1.dsOff+o.n1.dsOn+o.n2.dsO+o.n2.dsN+o.n3.ds+h.inc+c.ds;
    o.core=(o.n1.dsOff+o.n1.dsOn+o.n2.dsO+o.n2.dsN+h.inc+c.ds)*(1-par('ov')/100)+o.n3.ds;
    o.srN=Math.max(1,o.srn); A.push(o);});
  CACHE={d,D,rem,k,rf,hc:par('hc')/100,list:A.sort((p,q)=>q.short-p.short)}; return CACHE;
}
const sum=(L,f)=>L.reduce((t,o)=>t+f(o),0);
const dv=(a,b)=>b?a/b:null;
const fPct=v=>v==null?'—':nf(v*100,1)+'%', fN2=v=>v==null?'—':nf(v,2);
function rollup(arr){
  const r={so:0,tg:0,B:0,fc:0,aso:0,hs:0,lp:0,hv:0,cb:0,gross:0,core:0};
  arr.forEach(o=>{r.so+=o.so;r.tg+=o.tg;r.B+=o.B;r.fc+=o.fc;r.aso+=o.n1.dsOff+o.n1.dsOn;r.hs+=o.n2.dsO+o.n2.dsN;r.lp+=o.n3.ds;r.hv+=o.hv.inc;r.cb+=o.cb.ds;r.gross+=o.gross;r.core+=o.core;});
  r.gap=Math.max(0,r.tg-r.fc); return r;
}
const NTF=()=>false, EST=()=>F.oo!=='all'||F.vip!=='all';
const sc=a=>F.asm!=='all'?a===F.asm:(S.asm==='all'||a===S.asm);
const FLT_NOTE=()=>{const m=[F.oo==='OFF'?'kênh Off Premise':F.oo==='ON'?'kênh On Premise':'',F.vip!=='all'?'nhóm '+F.vip:''].filter(Boolean); if(!m.length&&!(typeof MEAT!=='undefined'&&MEAT==='excl')&&F.asm==='all')return '';
  return `<div class="pnote" style="margin:8px 0;padding:8px 10px;background:#fff7ed;border:1px solid #fdba74;border-radius:8px">Đang lọc${m.length?' <b>'+m.join(' · ')+'</b>':''}${F.asm!=='all'?' · ASM <b>'+esc(X().lab(F.asm))+'</b>':''}${(typeof MEAT!=='undefined'&&MEAT==='excl')?' · không gồm Meat':''}. ASO, LPPC và hiệu suất PC/Call plan theo bộ lọc; Hội viên Tết và Combo luôn tính toàn bộ KH; Chỉ tiêu SO lấy đúng theo file (chỉ có cấp SS, không tách kênh/nhóm KH) nên SO, dự kiến giữ đà và GAP luôn tính trên toàn kênh.</div>`;};
const T=(h,rows)=>`<div style="overflow-x:auto"><table class="t8asmtbl" style="font-size:14px"><thead><tr>${h}</tr></thead><tbody>${rows}</tbody></table></div>`;
/* ---------- bảng mục tiêu ---------- */
const WDM=m=>{try{return WORKDAYS[m]||26;}catch(e){return 26;}};
// PC/Call plan T9/T10 (ước tính): call plan = call plan/ĐDKD/ngày T11 × ĐDKD tháng đó × ngày công tháng đó
const est=(L,mo,ch)=>{const t=mo===9?'t9':'t10', pcK=ch==='O'?'offPc':'onPc', h=ch==='O'?'O':'N', d=CACHE?CACHE.d:9;
  const pcv=sum(L,o=>o[t][pcK]), cp=sum(L,o=>o.sm?o.hs[h].cp/(o.sm*d)*o[t].sm*WDM(String(mo)):0); return cp?pcv/cp:null;};
const METS={
 aso:{t:'ASO Off 95%',f:fPct,tg:()=>par('aso')/100,
  v:L=>[dv(sum(L,o=>o.t9.off),sum(L,o=>o.mcpOff)),dv(sum(L,o=>o.t10.offAso),sum(L,o=>o.mcpOff)),dv(sum(L,o=>o.asoOff),sum(L,o=>o.mcpOff))],
  need:L=>nf(sum(L,o=>o.n1.dOff),0)+' KH',so:L=>sum(L,o=>o.n1.dsOff),
  what:'ASO Off = số KH Off có đơn / MCP Off. T9, T10 là cả tháng, T11 là MTD nên thấp hơn. "Cần thêm" so với T10 cả tháng; SO thêm = KH thêm × SO/KH Off T10 × phần tháng còn lại.'},
 on:{t:'ASO On 75%',f:fPct,tg:()=>par('on')/100,
  v:L=>[dv(sum(L,o=>o.t9.on),sum(L,o=>o.mcpOn)),dv(sum(L,o=>o.t10.onAso),sum(L,o=>o.mcpOn)),dv(sum(L,o=>o.asoOn),sum(L,o=>o.mcpOn))],
  need:L=>nf(sum(L,o=>o.n1.dOn),0)+' KH',so:L=>sum(L,o=>o.n1.dsOn),what:'Cách tính như ASO Off, trên MCP kênh On.'},
 hsO:{t:'PC/Call plan Off 70%',f:fPct,tg:()=>par('hsO')/100,
  v:L=>[est(L,9,'O'),est(L,10,'O'),dv(sum(L,o=>o.hs.O.pc),sum(L,o=>o.hs.O.cp))],mark:'*',
  need:L=>nf(sum(L,o=>o.n2.exO),0)+' PC thêm',so:L=>sum(L,o=>o.n2.dsO),
  what:'Hiệu suất = số đơn (PC) / số KH trong call plan (lịch MCP) đến '+'${LAST}'+'. PC thêm = (mục tiêu − hiện tại) × call plan các ngày còn lại; SO thêm = PC thêm × SO/PC của SS × '+'${HSQ}'+'% (đơn thêm thường nhỏ hơn bình quân). SS đã vượt mục tiêu không bị trừ.'},
 hsN:{t:'PC/Call plan On 50%',f:fPct,tg:()=>par('hsN')/100,
  v:L=>[est(L,9,'N'),est(L,10,'N'),dv(sum(L,o=>o.hs.N.pc),sum(L,o=>o.hs.N.cp))],mark:'*',
  need:L=>nf(sum(L,o=>o.n2.exN),0)+' PC thêm',so:L=>sum(L,o=>o.n2.dsN),what:'Cách tính như Off, trên call plan kênh On.'},
 lp:{t:'LPPC Off +1 line',f:fN2,u:'line',tg:L=>(dv(sum(L,o=>o.liOff),sum(L,o=>o.pcOff))||0)+par('lpAdd'),
  v:L=>[dv(sum(L,o=>o.t9.offLi),sum(L,o=>o.t9.offPc)),dv(sum(L,o=>o.t10.offLi),sum(L,o=>o.t10.offPc)),dv(sum(L,o=>o.liOff),sum(L,o=>o.pcOff))],
  need:L=>{const a=dv(sum(L,o=>o.liOff),sum(L,o=>o.pcOff));return a==null?'—':'→ '+nf(a+par('lpAdd'),2)+' line/PC';},so:L=>sum(L,o=>o.n3.ds),
  what:'LPPC Off = số line / số đơn kênh Off. Mục tiêu mỗi SS tăng thêm '+'${LPA}'+' line/PC so với T11 hiện tại; SO thêm = SO Off còn lại × (line thêm ÷ LPPC) × '+'${LPE}'+'% (line thêm là ngành yếu nên nhỏ hơn bình quân).'},
 hv:{t:'Hội viên Tết 70%',f:fPct,tg:()=>par('hvT')/100,
  v:L=>[dv(sum(L,o=>o.hv9.dat9),sum(L,o=>o.hv9.n9)),dv(sum(L,o=>o.hv9.dat),sum(L,o=>o.hv9.n)),dv(sum(L,o=>o.hv.m1),sum(L,o=>o.hv.n))],mark:'†',
  need:L=>nf(sum(L,o=>o.hv.need),0)+' KH thêm · tự đạt ~'+pc(sum(L,o=>o.hv.auto),sum(L,o=>o.hv.n),0),so:L=>sum(L,o=>o.hv.inc),
  what:'Mẫu số = toàn bộ KH hội viên ở tab Hội viên Tết (VIP + Đại sứ); mục tiêu = 70% số KH đó đạt DS ≥ 95% chỉ tiêu nền (NV1). T11 hiện tại là % KH đã đạt đến '+'${HV}'+'; "tự đạt" là % KH dự kiến đạt nếu giữ đà. Cần thêm = số KH phải kéo để đủ mục tiêu, chọn KH gần đạt nhất trước; SO thêm = DS còn thiếu của các KH đó so với giữ đà. Chưa xét NV2 (đủ nhãn trọng điểm) để nhận thưởng.'},
 cb:{t:'Combo Off 70%',f:fPct,tg:()=>par('cbT')/100,
  v:L=>[null,null,dv(sum(L,o=>o.cb.nhan),sum(L,o=>o.cb.n))],na:'CT mới T11',
  need:L=>nf(sum(L,o=>o.cb.more),0)+' KH thêm · tự đạt ~'+pc(sum(L,o=>o.cb.auto),sum(L,o=>o.cb.n),0),so:L=>sum(L,o=>o.cb.ds),
  what:'Tỷ lệ KH đã nhận combo (mua đạt chương trình) / KH áp dụng combo Off (tab Combo). Mục tiêu = ${CBT}% số KH áp dụng. KH thêm = mục tiêu − KH đã nhận combo đến hết ngày dữ liệu (không cộng dự phóng vì KH nhận combo tăng chậm dần); '+'SO thêm = KH thêm × chênh giá trị đơn combo so với đơn thường (dashboard) × '+'${CMB}'+'% do combo tạo ra.'}
};
const fillWhat=m=>String(m.what||'').replace('${LAST}',T11_META.last_date).replace('${HSQ}',nf(par('hsq'),0)).replace('${LPA}',nf(par('lpAdd'),1)).replace('${LPE}',nf(par('lpe'),0)).replace('${HV}',HVT11.meta.asof||'').replace('${CMB}',nf(X().par('cmb'),0)).replace('${CBT}',nf(par('cbT'),0));
const LVL={0:['Cao','#16a34a','#d1fae5'],1:['Khá','#4d7c0f','#ecfccb'],2:['Khó','#b45309','#fef3c7'],3:['Rất khó','#b91c1c','#fee2e2']};
function feas(m,L,C){
  const v=m.v(L,C), tg=m.tg(L), a=v[2]; if(tg==null)return null;
  const hist=[v[0],v[1]].filter(x=>x!=null), base=hist.length?Math.max(...hist):a, src=hist.length?'T9–T10':'T11 MTD';
  if(base==null)return null; const g=tg-base, t1=m.u==='line'?0.15:0.05, t2=m.u==='line'?0.30:0.10;
  const lv=g<=0?0:g<=t1?1:g<=t2?2:3;
  return {g,lv,src,base,d10:v[1]!=null?tg-v[1]:null,d9:v[0]!=null?tg-v[0]:null,dm:a!=null?tg-a:null};
}
const fD=(m,x)=>x==null?'<span style="color:#94a3b8">—</span>':m.u==='line'?(x>=0?'+':'')+nf(x,2):(x>=0?'+':'')+nf(x*100,1)+' pp';
const badge=f=>f?`<span style="background:${LVL[f.lv][2]};color:${LVL[f.lv][1]};padding:2px 8px;border-radius:10px;font-weight:700;white-space:nowrap">${LVL[f.lv][0]}</span>`:'—';
function mcells(m,L,C){
  const v=m.v(L,C), a=v[2], mk=m.mark?`<sup style="color:#64748b">${m.mark}</sup>`:'', tgv=m.tg(L), so=m.so(L), gap=tgv!=null&&a!=null?a-tgv:null, nz=x=>x==null?`<span style="color:#94a3b8;font-size:12px">${m.na||'—'}</span>`:m.f(x);
  const col=gap==null?'':(gap>=0?'color:#16a34a':'color:#dc2626'), F_=feas(m,L,C);
  const dTxt=gap==null?'—':m.u==='line'?(gap>=0?'+':'')+nf(gap,2)+' line':(gap>=0?'+':'')+nf(gap*100,1)+' pp';
  const tTxt=tgv!=null?m.f(tgv):(m.tgTxt?m.tgTxt(L):'—');
  return `<td>${nz(v[0])}${v[0]!=null?mk:''}</td><td>${nz(v[1])}${v[1]!=null?mk:''}</td><td><b>${m.f(a)}</b></td><td>${tTxt}</td><td style="${col};font-weight:700">${dTxt}</td><td>${F_?fD(m,F_.d10):'—'}</td><td>${F_?fD(m,F_.d9):'—'}</td><td>${m.need(L,C)}</td><td><b>+${ty(so)}</b></td><td title="${F_?'So mục tiêu với mức cao nhất của '+F_.src:''}">${badge(F_)}</td>`;
}
function blockSummary(C){
  const L=C.list.filter(o=>sc(o.asm)), r=rollup(L), hc=C.hc, NT=NTF();
  const gap=r.tg-r.fc, cov=gap>0?r.core/gap:0, exec=r.core*hc, scen=r.fc+exec;
  return `<div class="kpis" style="grid-template-columns:repeat(5,1fr)">`+
   card('Chỉ tiêu SO T11',ty(r.tg)+' tỷ','SO MTD '+ty(r.so)+' tỷ · '+pc(r.so,r.tg)+' đến '+T11_META.last_date+(EST()?' · chỉ tiêu theo file, SO toàn kênh':''))+
   card('Dự kiến giữ đà',ty(r.fc)+' tỷ',pc(r.fc,r.tg)+' chỉ tiêu · hệ số tăng tốc '+nf(C.k,2))+
   card('GAP cần lấp',NT?'—':gap>0?ty(gap)+' tỷ':'Đủ (dư '+ty(-gap)+')',(NT?'Chỉ tiêu chỉ có cấp Toàn Miền':'SO/ngày '+ty(r.so/C.d)+' → cần '+ty(Math.max(0,r.tg-r.so)/C.rem)+' tỷ'),gap>0?'#dc2626':'#16a34a')+
   card('Đạt đủ 7 mục tiêu','+'+ty(r.core)+' tỷ','gộp '+ty(r.gross)+' − chồng lấn '+ty(r.gross-r.core-0)+(NT?'':' · lấp '+nf(cov*100,0)+'% GAP'),cov>=1?'#16a34a':'#d97706')+
   card('Thực thi '+nf(hc*100,0)+'%','+'+ty(exec)+' tỷ','→ '+ty(scen)+' tỷ'+(NT?'':' = '+pc(scen,r.tg)+' chỉ tiêu'),(NT||scen>=r.tg)?'#16a34a':'#d97706')+`</div>`+
  `${FLT_NOTE()}<div class="pnote" style="margin:8px 0;font-size:14px">Cách tính: mỗi mục tiêu tính SO thêm cho từng SS trên <b>${C.rem} ngày công còn lại</b>, so với kịch bản giữ đà. Chồng lấn: ASO, PC/Call plan, Hội viên, Combo cùng làm tăng số đơn nên trừ <b>${nf(par('ov'),0)}%</b> khi cộng; LPPC tính riêng. Thực thi ${nf(hc*100,0)}% là mức cam kết sàn. Mọi tham số ở hàng nhập phía trên đều sửa được. Số SO thêm là ước tính, không phải chỉ tiêu giao.</div>`;
}
function blockGoals(C){
  const L=C.list.filter(o=>sc(o.asm));
  const rows=Object.keys(METS).map(k=>{const m=METS[k]; return `<tr><td style="text-align:left"><b>${m.t}</b></td>${mcells(m,L,C)}</tr>`;}).join('');
  const r=rollup(L);
  const tot=`<tr class="tot" style="font-weight:700"><td style="text-align:left">Cộng 7 mục tiêu (sau chồng lấn ${nf(par('ov'),0)}%)</td><td colspan="8"></td><td>+${ty(r.core)}</td><td></td></tr>`;
  const h=`<th style="${THL}">Mục tiêu T11</th><th style="${TH}">Thực đạt T9</th><th style="${TH}">Thực đạt T10 (cả tháng)</th><th style="${TH}">T11 MTD đến ${T11_META.last_date}</th><th style="${TH}">Mục tiêu T11</th><th style="${TH}">Chênh T11 MTD</th><th style="${TH}">Phải tăng vs T10</th><th style="${TH}">Phải tăng vs T9</th><th style="${TH}">Cần thêm để đạt</th><th style="${TH}">SO thêm (tỷ)</th><th style="${TH}">Khả thi</th>`;
  return T(h,rows+tot)+`<div class="pnote" style="margin-top:6px">* PC/Call plan T9, T10 là <b>ước tính</b>: call plan = call plan/ĐDKD/ngày của T11 × số ĐDKD × ngày công tháng đó (chưa có lịch ghé T9–T10). † Hội viên T9, T10 là % KH đạt Hội viên Doanh nhân (tab Hội viên), T11 là % KH đạt NV1 Hội viên Tết: cùng ý nghĩa KH đạt, khác chương trình. Combo bắt đầu từ T11 nên chưa có T9, T10. SO thêm của từng dòng là tiềm năng riêng lẻ (chưa trừ chồng lấn). <b>Khả thi</b> = so mục tiêu với mức cao nhất đã đạt ở T9–T10 (cả tháng): <b>Cao</b> đã từng đạt mức này; <b>Khá</b> cần tăng thêm ≤5 pp (LPPC ≤0,15 line); <b>Khó</b> ≤10 pp (LPPC ≤0,30); <b>Rất khó</b> trên mức đó. Combo chưa có T9–T10 nên so với T11 MTD. Chọn từng mục tiêu ở mục 5 để khoan ASM › NPP › SS.</div>`;
}
const H1=`<th style="${THL}">Phạm vi</th><th style="${TH}">Chỉ tiêu (tỷ)</th><th style="${TH}">%Đạt MTD</th><th style="${TH}">Giữ đà (tỷ)</th><th style="${TH}">GAP (tỷ)</th><th style="${TH}">ASO Off+On (tỷ)</th><th style="${TH}">PC/Call plan (tỷ)</th><th style="${TH}">LPPC Off (tỷ)</th><th style="${TH}">Hội viên Tết (tỷ)</th><th style="${TH}">Combo Off (tỷ)</th><th style="${TH}">Cộng sau chồng lấn (tỷ)</th><th style="${TH}">% lấp GAP</th>`;
function lines(arr){
  return arr.map(([name,L,isT])=>{const r=rollup(L), gap=r.tg-r.fc, cov=gap>0?r.core/gap:null;
    return `<tr${isT?' class="tot"':''}><td style="text-align:left;white-space:nowrap">${esc(name)}</td><td>${ty(r.tg)}</td><td>${pc(r.so,r.tg)}</td><td>${ty(r.fc)}</td><td><b>${NTF()?'—':gap>0?ty(gap):'Đủ'}</b></td><td>+${ty(r.aso)}</td><td>+${ty(r.hs)}</td><td>+${ty(r.lp)}</td><td>+${ty(r.hv)}</td><td>+${ty(r.cb)}</td><td><b>+${ty(r.core)}</b></td><td style="${cov==null?'':stc(cov)};font-weight:700">${cov==null?'—':cov>5?'>500%':nf(cov*100,0)+'%'}</td></tr>`;}).join('');
}
function blockAsm(C){
  const A=X().ASMS_(), L=C.list;
  return T(H1,lines(A.map(a=>[X().lab(a),L.filter(o=>o.asm===a)]).concat([['TOÀN MIỀN',L,true]])))+`<div class="pnote" style="margin-top:6px">% lấp GAP = SO thêm sau chồng lấn ÷ GAP. Xanh ≥100%, vàng 80–99%, đỏ dưới 80%. Hội viên Tết thường là khoản lớn nhất vì mục tiêu 70% KH đạt rất xa mức hiện tại, nên cần xem cột thực thi trước khi cam kết.</div>`;
}
function blockTarget(C){
  const m=METS[S.m]||METS.aso;
  const grp=new Map(); C.list.filter(o=>sc(o.asm)).forEach(o=>{const nk=o.asm+'|'+o.npps.join(' / ');if(!grp.has(o.asm))grp.set(o.asm,new Map());const g=grp.get(o.asm);if(!g.has(nk))g.set(nk,{name:o.npps.join(' / '),L:[]});g.get(nk).L.push(o);});
  let rows=''; const AS=X().ASMS_().filter(a=>grp.has(a));
  const row=(lv,id,pid,name,L,show,hasKids)=>{const op=S.open.has(id);
    return `<tr data-id="${esc(id)}" data-p="${esc(pid)}" data-lv="${lv}" ${show?'':'hidden'} style="${lv===0?'font-weight:700;background:#f0f9ff':''}${lv===2?';font-size:13px':''}"><td style="text-align:left;white-space:normal;padding-left:${8+lv*16}px">${hasKids?`<span class="nvt" style="cursor:pointer;color:#0369A1">${op?'▾':'▸'}</span> `:'&nbsp;&nbsp;'}${esc(name)}</td>${mcells(m,L,C)}</tr>`;};
  AS.forEach(a=>{const g=grp.get(a), all=[]; g.forEach(n=>all.push(...n.L));
    rows+=row(0,'a|'+a,'',X().lab(a),all,true,true);
    [...g.values()].sort((p,q)=>sum(q.L,o=>o.short)-sum(p.L,o=>o.short)).forEach(n=>{const nid='n|'+a+'|'+n.name; rows+=row(1,nid,'a|'+a,n.name,n.L,S.open.has('a|'+a),n.L.length>0);
      n.L.sort((p,q)=>q.short-p.short).forEach(o=>{rows+=row(2,'s|'+a+'|'+n.name+'|'+o.ss,nid,'SS '+o.ss,[o],S.open.has('a|'+a)&&S.open.has(nid),false);});});});
  const all=C.list.filter(o=>sc(o.asm));
  rows+=`<tr class="tot" style="font-weight:700"><td style="text-align:left">TOÀN MIỀN${S.asm==='all'?'':' (phạm vi chọn)'}</td>${mcells(m,all,C)}</tr>`;
  const btn=Object.keys(METS).map(k=>`<button data-m="${k}" class="${k===S.m?'on':''}">${METS[k].t}</button>`).join('');
  const h=`<th style="${THL}">ASM › NPP › SS <span style="font-weight:400">(bấm ▸ để mở)</span></th><th style="${TH}">Thực đạt T9</th><th style="${TH}">Thực đạt T10 (cả tháng)</th><th style="${TH}">T11 MTD đến ${T11_META.last_date}</th><th style="${TH}">Mục tiêu T11</th><th style="${TH}">Chênh T11 MTD</th><th style="${TH}">Phải tăng vs T10</th><th style="${TH}">Phải tăng vs T9</th><th style="${TH}">Cần thêm để đạt</th><th style="${TH}">SO thêm (tỷ)</th><th style="${TH}">Khả thi</th>`;
  return `<div class="seg" id="nvMet" style="margin-bottom:8px">${btn}</div><div style="margin-bottom:6px"><button id="nvOpenAll" style="padding:5px 12px;border:1px solid #38BDF8;background:#fff;border-radius:6px;cursor:pointer;font-size:14px">Mở hết</button> <button id="nvCloseAll" style="padding:5px 12px;border:1px solid #38BDF8;background:#fff;border-radius:6px;cursor:pointer;font-size:14px">Thu gọn</button></div>`+T(h,rows)+`<div class="pnote" style="margin-top:6px">${fillWhat(m)}</div>`;
}
function blockFeas(C){
  const keys=Object.keys(METS), A=X().ASMS_(), cell=(m,L)=>{const f=feas(m,L,C), so=m.so(L); return `<td style="${f?'background:'+LVL[f.lv][2]:''};line-height:1.35"><b style="color:${f?LVL[f.lv][1]:'#64748b'}">${f?LVL[f.lv][0]:'—'}</b> <span style="color:#334155">${f?fD(m,f.g):''}</span><br><span style="font-size:12.5px;color:#0369A1;font-weight:700">+${ty(so)} tỷ</span></td>`;};
  const h=`<th style="${THL}">ASM › SS</th>`+keys.map(k=>`<th style="${TH}">${METS[k].t}</th>`).join('')+`<th style="${TH}">Cộng sau chồng lấn</th>`;
  let rows='';
  const row=(name,L,cls,pad)=>`<tr class="${cls||''}" style="${cls==='tot'?'font-weight:700':pad?'font-size:13px':'font-weight:700;background:#f0f9ff'}"><td style="text-align:left;white-space:nowrap;padding-left:${pad||8}px">${esc(name)}</td>${keys.map(k=>cell(METS[k],L)).join('')}<td><b>+${ty(rollup(L).core)}</b></td></tr>`;
  A.filter(a=>sc(a)).forEach(a=>{const L=C.list.filter(o=>o.asm===a); rows+=row(X().lab(a),L); L.slice().sort((p,q)=>q.core-p.core).forEach(o=>{rows+=row('SS '+o.ss+' · '+o.npps.join(' / '),[o],'',26);});});
  rows+=row('TOÀN MIỀN'+(S.asm==='all'?'':' (phạm vi chọn)'),C.list.filter(o=>sc(o.asm)),'tot');
  return T(h,rows)+`<div class="pnote" style="margin-top:6px">Mỗi ô: mức khả thi · số phải tăng so với mức cao nhất T9–T10 (pp; LPPC là line; Combo so với T11 MTD) · SO thêm nếu đạt (tỷ). Khả thi so với mức cao nhất T9–T10 của chính ASM/SS đó. PC/Call plan T9–T10 là ước tính (*); Hội viên T9–T10 là Hội viên Doanh nhân (†).</div>`;
}
function actions(o,C){
  const rem=C.rem, srN=o.srN, A=[], hvN=o.hv.need;
  if(o.drop>0)A.push([o.dropSO*0.0668,`Gọi/thăm lại <b>${nf(o.drop,0)}</b> quầy rơi (mua kỳ trước, chưa mua T11; SO kỳ trước ${ty(o.dropSO)} tỷ): <b>${nf(o.drop/srN/5,1)}</b> quầy/ĐDKD/ngày trong 5 ngày công đầu`]);
  if(o.n1.dOff>0)A.push([o.n1.dsOff,`ASO Off lên ${nf(par('aso'),0)}%: thêm <b>${nf(o.n1.dOff,0)}</b> KH có đơn so với T10 (${nf(o.n1.dOff/srN/rem,1)} KH mới/ĐDKD/ngày); MTD ${pc(o.asoOff,o.mcpOff)}`]);
  if(o.n1.dOn>0)A.push([o.n1.dsOn,`ASO On lên ${nf(par('on'),0)}%: thêm <b>${nf(o.n1.dOn,0)}</b> KH On có đơn; MTD ${pc(o.asoOn,o.mcpOn)}`]);
  if(o.n2.exO>0)A.push([o.n2.dsO,`PC/Call plan Off từ <b>${pc(o.hs.O.pc,o.hs.O.cp,1)}</b> lên ${nf(par('hsO'),0)}%: thêm <b>${nf(o.n2.exO,0)}</b> đơn (${nf(o.n2.exO/srN/rem,1)} đơn/ĐDKD/ngày) bằng cách ghé đủ KH trong lịch`]);
  if(o.n2.exN>0)A.push([o.n2.dsN,`PC/Call plan On từ <b>${pc(o.hs.N.pc,o.hs.N.cp,1)}</b> lên ${nf(par('hsN'),0)}%: thêm <b>${nf(o.n2.exN,0)}</b> đơn kênh On`]);
  if(o.n3.ds>0)A.push([o.n3.ds,`LPPC Off từ <b>${nf(o.n3.lp,2)}</b> lên <b>${nf(o.n3.lp+par('lpAdd'),2)}</b>: mỗi đơn Off chào thêm ${nf(par('lpAdd'),0)} line ngành yếu`]);
  if(hvN>0)A.push([o.hv.inc,`Hội viên Tết: kéo <b>${nf(hvN,0)}</b> KH đạt NV1 (hiện ${pc(o.hv.m1,o.hv.n,0)}, tự đạt ~${pc(o.hv.auto,o.hv.n,0)}, mục tiêu ${nf(par('hvT'),0)}%), ưu tiên KH thiếu ít nhất`]);
  if(o.cb.more>0)A.push([o.cb.ds,`Combo Off: thêm <b>${nf(o.cb.more,0)}</b> KH nhận combo để lên ${nf(par('cbT'),0)}% KH áp dụng (hiện ${pc(o.cb.nhan,o.cb.n,0)}, tự đạt ~${pc(o.cb.auto,o.cb.n,0)})`]);
  return A.sort((p,q)=>q[0]-p[0]);
}
function blockSheet(C){
  const L=C.list.filter(o=>sc(o.asm)); let h='';
  L.forEach((o,i)=>{const a=actions(o,C), cov=o.short>0?o.core/o.short:null;
    const topD=o.top.sort((p,q)=>q.so-p.so).slice(0,5).map(t=>`<li>${esc(t.name)} (${esc(t.code)}) — SO kỳ trước ${nf(t.so/1e6,1)} tr · ĐDKD ${esc(t.sr)}</li>`).join('');
    const hv=o.hv.pick.slice(0,5).map(t=>`<li>${esc(t.name)} (${esc(t.code)}) — thiếu ${nf(t.gap/1e6,2)} tr so với giữ đà · ĐDKD ${esc(t.sr)}</li>`).join('');
    const sr=[...o.hsM.values()].filter(t=>t.cp>=20).sort((p,q)=>p.pc/p.cp-q.pc/q.cp).slice(0,4).map(t=>`<li>${esc(t.name)} (${t.oo}) — PC/Call plan ${pc(t.pc,t.cp,1)} (${nf(t.pc,0)}/${nf(t.cp,0)})</li>`).join('');
    h+=`<details${i<3?' open':''} style="margin:6px 0;border:1px solid #bae6fd;border-radius:8px;padding:6px 10px;background:#fff"><summary style="cursor:pointer;font-weight:700;color:#0369A1;font-size:15px">${esc(X().SHORT[o.asm]||o.asm)} · ${esc(o.npps.join(' / '))} · SS ${esc(o.ss)} <span style="font-weight:400;color:#475569">— GAP ${o.short>0?ty(o.short)+' tỷ':'đủ'} · ${o.srN} ĐDKD · cộng +${ty(o.core)} tỷ${cov==null?'':' ('+nf(cov*100,0)+'% GAP)'}</span></summary>
     <div style="margin:8px 0;font-size:14px"><b>Việc giao cho SS (xếp theo SO thêm):</b><ol style="margin:4px 0 0 18px">${a.map(x=>`<li>${x[1]}</li>`).join('')||'<li>Giữ nhịp hiện tại</li>'}</ol></div>
     <div style="display:grid;grid-template-columns:repeat(3,minmax(220px,1fr));gap:12px;margin-top:6px;font-size:13.5px"><div><b>Quầy rơi lớn nhất cần gọi lại</b><ul style="margin:4px 0 0 16px">${topD||'<li>—</li>'}</ul></div><div><b>Hội viên gần đạt NV1 nhất (chốt trước)</b><ul style="margin:4px 0 0 16px">${hv||'<li>—</li>'}</ul></div><div><b>ĐDKD thấp nhất về PC/Call plan (SS kèm)</b><ul style="margin:4px 0 0 16px">${sr||'<li>—</li>'}</ul></div></div></details>`;});
  return h||'<div class="pnote">Không có SS trong phạm vi.</div>';
}
function blockMoc(C){
  const L=C.list.filter(o=>sc(o.asm)), r=rollup(L);
  const wd=day=>{let n=0;for(let i=1;i<=day;i++){if(new Date(2026,10,i).getDay()!==0)n++;}return n;};
  const cur={aso:dv(sum(L,o=>o.asoOff),sum(L,o=>o.mcpOff))||0,on:dv(sum(L,o=>o.asoOn),sum(L,o=>o.mcpOn))||0,hsO:dv(sum(L,o=>o.hs.O.pc),sum(L,o=>o.hs.O.cp))||0,hsN:dv(sum(L,o=>o.hs.N.pc),sum(L,o=>o.hs.N.cp))||0,lp:dv(sum(L,o=>o.liOff),sum(L,o=>o.pcOff))||0,hv:dv(sum(L,o=>o.hv.m1),sum(L,o=>o.hv.n))||0,cb:dv(sum(L,o=>o.cb.nhan),sum(L,o=>o.cb.mua))||0};
  const act={14:'Chốt hội viên gần đạt NV1 · gọi quầy rơi · ghé đủ call plan',21:'Combo: đẩy KH chưa có đơn combo · chào line ngành yếu',28:'Rà KH hội viên còn thiếu · bù ASO kênh On',30:'Chốt số · đánh giá để sang T12'};
  const ln=(a,b,f)=>a+(b-a)*f;
  const rows=[14,21,28,30].map(dd=>{const w=Math.max(wd(dd),C.d), f=Math.min(1,(w-C.d)/Math.max(1,C.rem));
    const so=r.so+Math.max(0,r.tg-r.so)*f;
    return `<tr><td style="text-align:left"><b>${dd}/11</b></td><td>${w}/${C.D}</td><td>${NTF()?'—':ty(so)+' ('+pc(so,r.tg,1)+')'}</td><td>${fPct(ln(cur.aso,par('aso')/100,f))} · ${fPct(ln(cur.on,par('on')/100,f))}</td><td>${fPct(ln(cur.hsO,par('hsO')/100,f))} · ${fPct(ln(cur.hsN,par('hsN')/100,f))}</td><td>${fN2(cur.lp+par('lpAdd')*f)}</td><td>${fPct(ln(cur.hv,par('hvT')/100,f))}</td><td>${fPct(ln(cur.cb,par('cbT')/100,f))}</td><td style="text-align:left;white-space:normal">${act[dd]}</td></tr>`;}).join('');
  const h=`<th style="${THL}">Mốc</th><th style="${TH}">Ngày công lũy kế</th><th style="${TH}">SO lũy kế cần</th><th style="${TH}">ASO Off · On</th><th style="${TH}">PC/Call plan Off · On</th><th style="${TH}">LPPC Off</th><th style="${TH}">Hội viên đạt NV1</th><th style="${TH}">Combo Off</th><th style="${THL}">Việc chốt</th>`;
  return T(h,rows)+`<div class="pnote" style="margin-top:6px">Mốc là đường tiến đều từ số hiện tại đến mục tiêu, không phải chỉ tiêu chính thức. Review 14/11 · 21/11 · 28/11: dưới 85% mốc thì ASM báo nguyên nhân và bù trong tuần kế tiếp.</div>`;
}
function blockT12(C){
  const A=X().ASMS_(), wd12=(typeof WORKDAYS!=='undefined'&&WORKDAYS['12'])||27;
  const ap=a=>{const o={e:0,he:0,o:0}; APQ.forEach(r=>{ if(a!=='all'&&r[0]!==a)return; o.e+=r[5][2];o.he+=r[6][2];o.o+=r[7][2];}); return o;};
  const row=(name,L,isT,a)=>{const r=rollup(L), cam=r.fc+r.core*C.hc, cd=cam/C.D, q=ap(a); if(a==='all'&&X().pn(LS.g('p|so1212'))==null&&X().pn(LS.g('p|so12'))!=null)q.e=X().pn(LS.g('p|so12'))*1e9; need=q.e/wd12, up=cd?need/cd-1:null;
    return `<tr${isT?' class="tot"':''}><td style="text-align:left;white-space:nowrap">${esc(name)}</td><td>${ty(cam)}</td><td>${ty(cd)}</td><td>${ty(q.e)}</td><td>${ty(q.he)}</td><td>${ty(q.o)}</td><td><b>${ty(need)}</b></td><td style="${up==null?'':up>0.15?'color:#dc2626':up>0?'color:#d97706':'color:#16a34a'};font-weight:700">${up==null?'—':(up>=0?'+':'')+nf(up*100,1)+'%'}</td></tr>`;};
  const rows=A.map(a=>row(X().lab(a),C.list.filter(o=>o.asm===a),false,a)).join('')+row('TOÀN MIỀN',C.list,true,'all');
  const h1=`<th style="${THL}">Phạm vi</th><th style="${TH}">SO T11 cam kết (tỷ)</th><th style="${TH}">SO/ngày T11 cam kết (tỷ)</th><th style="${TH}">AP T12 · E (tỷ)</th><th style="${TH}">HE (tỷ)</th><th style="${TH}">O (tỷ)</th><th style="${TH}">SO/ngày cần cho E (tỷ)</th><th style="${TH}">Tăng so với T11 cam kết</th>`;
  const acts=[
   ['ASO Off · On',`≥ ${nf(par12('aso'),0)}% · ${nf(par12('on'),0)}%`,'Giữ danh sách KH mới mở T11; gọi lại KH rơi tuần 1','Rà KH không đơn 2 tuần liên tiếp, đổi ĐDKD kèm'],
   ['PC/Call plan Off · On',`≥ ${nf(par12('hsO'),0)}% · ${nf(par12('hsN'),0)}%`,'Báo hiệu suất từng ĐDKD hằng ngày; ĐDKD dưới 60% có SS kèm','Cố định lịch ghé theo MCP, giảm KH bỏ lịch'],
   ['LPPC Off',`T11 chốt + ${nf(par12('lpAdd'),1)} line/PC`,'Chào đủ bộ ngành yếu theo checklist Tết','Gắn thưởng line mới cho ĐDKD'],
   ['Hội viên Tết',`≥ ${nf(par12('hvT'),0)}% KH đạt NV1`,'Mở theo dõi NV2 (nhãn trọng điểm) cho KH đạt NV1','Chốt danh sách KH đạt thưởng cuối kỳ, bổ sung nhãn thiếu'],
   ['Combo Off',`≥ ${nf(par12('cbT'),0)}% KH áp dụng nhận combo`,'Đẩy combo cho KH chưa có đơn combo','Đánh giá lại KH nhận combo, giữ nhóm đã nhận']];
  const h2=`<th style="${THL}">Mục tiêu</th><th style="${TH}">Chuẩn giữ T12 (đề xuất)</th><th style="${THL}">Tuần 1–2/12</th><th style="${THL}">Tuần 3–4/12</th>`;
  return T(h1,rows)+`<div class="pnote" style="margin:6px 0 10px">AP T12 lấy từ chỉ tiêu AP Quý 4 trong dashboard (E/HE/O). SO/ngày cần = E ÷ ${wd12} ngày công T12; SO/ngày T11 cam kết = (giữ đà + 7 mục tiêu × thực thi ${nf(C.hc*100,0)}%) ÷ ${C.D} ngày công. Cột tăng: đỏ trên 15%, vàng 0–15%, xanh khi T11 cam kết đã vượt mức cần.</div>`+
   T(h2,acts.map(r=>`<tr><td style="text-align:left"><b>${r[0]}</b></td><td>${r[1]}</td><td style="text-align:left;white-space:normal">${r[2]}</td><td style="text-align:left;white-space:normal">${r[3]}</td></tr>`).join(''))+`<div class="pnote" style="margin-top:6px">Chuẩn T12 lấy từ cột mục tiêu T12 ở mục Mục tiêu T11–12 (mặc định bằng T11, anh sửa được). Combo bắt đầu từ T11 nên chưa có số T9, T10.</div>`;
}
function blockGoalsSet(C){
  const L=C.list.filter(o=>sc(o.asm)), U={aso:'%',on:'%',hsO:'%',hsN:'%',lpAdd:'line/PC',hvT:'%',cbT:'%'};
  const rows=[['aso','ASO Off','aso','% KH Off có đơn / MCP Off'],['on','ASO On','on','% KH On có đơn / MCP On'],['hsO','PC/Call plan Off','hsO','Số đơn / KH trong call plan, kênh Off'],['hsN','PC/Call plan On','hsN','Số đơn / KH trong call plan, kênh On'],['lpAdd','LPPC total MCH kênh Off tăng','lp','Số line / đơn, thêm so với hiện tại'],['hvT','KH đạt Hội viên Tết','hv','KH đạt NV1 (DS ≥ 95% nền) / tổng KH hội viên (tab Hội viên Tết)'],['cbT','KH active đơn Combo kênh Off','cb','KH đã nhận combo / KH áp dụng combo Off (tab Combo)']];
  const cur=k=>{const m=METS[k]; const v=m.v(L,C)[2]; return m.f(v);};
  const h=`<th style="${THL}">Mục tiêu</th><th style="${TH}">Đơn vị</th><th style="${TH}">Mục tiêu T11</th><th style="${TH}">Mục tiêu T12</th><th style="${TH}">T11 MTD đến ${T11_META.last_date}</th><th style="${THL}">Cách tính</th>`;
  const rt=rollup(L), ap0=(()=>{let e=0; APQ.forEach(r=>{ if(S.asm!=='all'&&r[0]!==S.asm)return; e+=r[5][2];}); return e;})();
  const soRow=`<tr><td style="text-align:left"><b>Chỉ tiêu SO (tỷ)</b></td><td>tỷ</td><td><b>${ty(rt.tg)}</b></td><td>${inp('p|so12',nf(par12('so'),2),70)}</td><td>${ty(rt.so)}</td><td style="text-align:left;white-space:normal">T11 lấy từ chỉ tiêu SO trong dashboard${EST()?' (theo file, không tách kênh)':''}; T12 mặc định theo AP Quý 4 (E)</td></tr>`;
  const tr=soRow+rows.map(([pk,t,mk,d])=>`<tr><td style="text-align:left"><b>${t}</b></td><td>${U[pk]}</td><td>${inp('p|'+pk,nf(par(pk),pk==='lpAdd'?1:0),70)}</td><td>${inp('p|'+pk+'12',nf(par12(pk),pk==='lpAdd'?1:0),70)}</td><td>${cur(mk)}</td><td style="text-align:left;white-space:normal">${d}</td></tr>`).join('');
  const as=[['hsq','SO/PC của đơn thêm so với bình quân (%)'],['lpe','Hiệu quả của line thêm so với bình quân (%)'],['ov','Chồng lấn giữa ASO, PC/Call plan, Hội viên, Combo (%)'],['hc','Mức thực thi cam kết (%)']].map(([k,l])=>`<label style="display:inline-flex;gap:6px;align-items:center;margin:0 16px 6px 0;font-size:14px">${l} ${inp('p|'+k,nf(par(k),0),60)}</label>`).join('');
  return T(h,tr)+`<div style="margin-top:10px"><b style="font-size:14px;color:#0369A1">Giả định tính SO thêm</b><div style="margin-top:6px">${as}</div></div><div class="pnote" style="margin-top:6px">Sửa số ở ô xanh, toàn tab tính lại ngay. Mục tiêu T12 để trống thì lấy bằng T11. Mục tiêu T11 dùng cho mục 1–5, mục tiêu T12 dùng cho mục 6.</div>`;
}
function render(){
  const pg=document.getElementById('pgNv'); const sn=document.getElementById('scopeNote'); if(sn){sn.innerHTML='';sn.hidden=true;} if(!pg||typeof T11==='undefined'||!window.GPX)return;
  let host=document.getElementById('nvHost'); if(!host){host=document.createElement('div');host.id='nvHost';pg.appendChild(host);}
  const C=compute(), A=X().ASMS_();
    let secN=0; const sec=(t,b,sb)=>`<div class="panel" style="margin-top:14px"><div class="tbl-head"><div><h3 style="display:inline;color:#0369A1;font-size:18px">${++secN}. ${t}</h3> ${sb?`<span class="pnote" style="display:inline">— ${sb}</span>`:''}</div></div>${b}</div>`;
  host.innerHTML=`<div class="panel" style="margin-top:14px;border-top:3px solid #0EA5E9"><div class="t8norm" style="margin-bottom:8px;font-size:15px"><b>Giải pháp T11–12</b> · SO đến hết <b>${T11_META.last_date}</b> (${C.d}/${C.D} ngày công, còn ${C.rem} ngày) · hội viên đến ${HVT11.meta.asof||'—'} · combo đến ${COMBO11.meta.asof||'—'} · call plan đến ${HS11.meta.asof||'—'}</div>
   <div class="flt2" style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end"><div class="fg"><label>Phạm vi</label><div class="seg" id="nvScope"><button data-v="all">Toàn Miền</button>${A.map(a=>`<button data-v="${esc(a)}">${esc(X().lab(a))}</button>`).join('')}</div></div></div></div>`+
   sec('Mục tiêu tháng 11–12',blockGoalsSet(C),'nhập mục tiêu, toàn tab tính theo các số này')+
   `<div class="panel" style="margin-top:14px">${blockSummary(C)}</div>`+
   sec('7 mục tiêu T11: thực đạt vs mục tiêu và SO thêm',blockGoals(C),'toàn phạm vi đang chọn')+
   sec('GAP và mức lấp theo ASM',blockAsm(C),'SO thêm của từng mục tiêu trên số ngày còn lại')+
   sec('Từng mục tiêu: ASM → NPP → SS',blockTarget(C),'chọn mục tiêu ở hàng nút')+
   sec('Khả thi 7 mục tiêu theo ASM › SS: phải tăng bao nhiêu và đem về bao nhiêu SO',blockFeas(C),'so với T9, T10')+
   sec('Phiếu giao việc theo SS (có tên quầy, hội viên, ĐDKD)',blockSheet(C),'mở từng SS để xem danh sách')+
   sec('Mốc kiểm soát 14/11 · 21/11 · 28/11 · 30/11',blockMoc(C))+
   sec('Tháng 12: giữ nhịp sau T11',blockT12(C),'theo mục tiêu T12 đã nhập');
  [...host.querySelectorAll('#nvScope button')].forEach(b=>b.classList.toggle('on',b.dataset.v===S.asm));
  host.querySelector('#nvScope').onclick=e=>{const b=e.target.closest('button');if(b){S.asm=b.dataset.v;render();}};
  const mt=host.querySelector('#nvMet'); if(mt)mt.onclick=e=>{const b=e.target.closest('button');if(b){S.m=b.dataset.m;render();}};
  host.querySelectorAll('tr[data-id] .nvt').forEach(t=>{t.onclick=()=>{const id=t.closest('tr').dataset.id; if(S.open.has(id))S.open.delete(id);else S.open.add(id); render();};});
  const oa=host.querySelector('#nvOpenAll'); if(oa)oa.onclick=()=>{host.querySelectorAll('tr[data-id]').forEach(r=>S.open.add(r.dataset.id));render();};
  const ca=host.querySelector('#nvCloseAll'); if(ca)ca.onclick=()=>{S.open.clear();render();};
  host.querySelectorAll('input[data-nv]').forEach(i=>{i.onchange=()=>{const id=i.dataset.nv; const v=X().pn(i.value); LS.s(id,v==null?'':String(v)); CACHE=null; render();};});
}
window.renderNv5=function(){try{render();}catch(e){console.error('NV5',e);}};
})();
