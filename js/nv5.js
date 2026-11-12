/* Tab "5 nhiệm vụ T11": giải pháp đạt chỉ tiêu T11 theo 5 nhiệm vụ trọng tâm, khoan sâu ASM → NPP → SS.
   Số liệu live từ dữ liệu dashboard (T11, T10, DATA T11S, ON7_11, GP11, CBT11, HVT11, TDS11, CATD). Mọi số DS thêm là ƯỚC TÍNH. */
(function(){
const X=()=>window.GPX;
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const nf=(n,d)=>(n==null||isNaN(n))?'—':n.toLocaleString('vi-VN',{minimumFractionDigits:d==null?1:d,maximumFractionDigits:d==null?1:d});
const ty=n=>(n==null||isNaN(n))?'—':nf(n/1e9,2);
const pc=(a,b,d)=>b?nf(a/b*100,d==null?1:d)+'%':'—';
const LSK='nv5:';
const LS={g(k){try{return localStorage.getItem(LSK+k);}catch(e){return null;}},s(k,v){try{localStorage.setItem(LSK+k,v);}catch(e){}}};
const PAR0={pc:13.6,lp:5.75,cap:12,aso:95,on:75,cat:0.3,hc:50,cb1:35,ov:30};
const par=k=>{const v=X().pn(LS.g('p|'+k)); return v==null?PAR0[k]:v;};
const S={asm:'all',m:'aso',open:new Set()};
const clean=s=>String(s||'').replace(/ \(.*\)/,'').trim(), base=s=>String(s||'').replace(' - Chi nhánh','').trim();
const TH='background:#0369A1;color:#fff;padding:7px 8px;font-size:12px;text-align:right;white-space:normal',THL=TH.replace('text-align:right','text-align:left');
const card=(l,v,s,ac)=>`<div class="kpi" style="border-top:3px solid ${ac||'#0EA5E9'}"><div class="k-lab">${l}</div><div class="k-val">${v}</div><div class="k-sub">${s||''}</div></div>`;
const sub=t=>`<div style="margin:16px 0 4px;font-weight:700;color:#0369A1">${t}</div>`;
const inp=(id,val,w)=>`<input data-nv="${id}" value="${esc(val)}" inputmode="decimal" style="width:${w||60}px;text-align:right;border:1px solid #38BDF8;background:#f0f9ff;border-radius:6px;padding:4px 6px;font:inherit;color:inherit">`;
const cv=c=>c>2?'>200%':nf(c*100,0)+'%';
const stc=r=>r>=1?'background:#d1fae5;color:#065f46':r>=0.8?'background:#fef3c7;color:#92400e':'background:#fee2e2;color:#991b1b';
const FLT=()=>F.oo!=='all'||F.vip!=='all'||(typeof MEAT!=='undefined'&&MEAT==='excl');
const vk=oo=>((typeof MEAT!=='undefined'&&MEAT==='excl')?'x':'a')+'|'+(oo||F.oo)+(F.vip==='all'?'':'|'+F.vip);
const vo=(r,oo)=>{ if(oo==='OFF'&&F.oo==='ON')return {}; if(oo==='ON'&&F.oo==='OFF')return {}; return r.v[vk(oo)]||{}; };
let CACHE=null,CK='';
function compute(){
  const key=[F.oo,F.vip,typeof MEAT!=='undefined'?MEAT:'',T11_META.last_date,['hc','pc','lp','cap','aso','on','cat','cb1'].map(par).join(',')].join('|');
  if(CACHE&&CK===key)return CACHE; CK=key;
  const x=X(), d=T11_META.mtd_days, D=T11_META.days_total, rem=D-d, k=x.accel().k, rf=rem/D;
  const SS=new Map(), byClean=new Map(), ALI=new Map();
  T11.forEach(r=>{ if(((r.v['a|all']||{}).so||0)>0)return; const c=T11.find(q=>q!==r&&q.asm===r.asm&&base(q.npp)===base(r.npp)&&((q.v['a|all']||{}).so||0)>0); if(c)ALI.set(r.asm+'|'+r.ssn,c.asm+'|'+c.ssn);});
  const K=(a,n)=>{const k=a+'|'+n; return ALI.get(k)||k;};
  const mk=(r)=>({asm:r.asm,npps:[],ss:r.ssn,so:0,tg:0,pc:0,li:0,aso:0,sm:0,mcp:0,asoOff:0,mcpOff:0,asoOn:0,mcpOn:0,t10:{so:0,aso:0,offSo:0,offAso:0,onSo:0,onAso:0,pc:0,sm:0,li:0},t9:{off:0,on:0,pc:0,sm:0,li:0,so:0},on7:{q:0,a:0},drop:0,dropSO:0,srn:0,top:[],hv:{n:0,chua:0,m1:0,sap:[],nv1x:0,gapSap:0},cbN:0,cbNhan:0,td:{n:0,ct:0,th:0,ok:0,near:0},cat:0,sr:[]});
  [...T11].sort((x,y)=>(ALI.has(x.asm+'|'+x.ssn)?1:0)-(ALI.has(y.asm+'|'+y.ssn)?1:0)).forEach(r=>{const kk=K(r.asm,r.ssn); let o=SS.get(kk); if(!o){o=mk(r);SS.set(kk,o);} const a=r.v[vk()]||{};
    if(o.npps.indexOf(r.npp)<0)o.npps.push(r.npp);
    o.so+=a.so||0;o.pc+=a.pc||0;o.li+=a.lines||0;o.aso+=a.aso||0;o.sm+=a.sm||0;o.mcp+=r.mcp||0;o.tg+=(F.oo!=='all'||F.vip!=='all')?0:((((r.tgm||{})['11'])||[r.target||0])[(typeof MEAT!=='undefined'&&MEAT==='excl')?1:0])||0;
    o.asoOff+=vo(r,'OFF').aso||0; o.asoOn+=vo(r,'ON').aso||0;
    byClean.set(clean(r.ss)+'|'+base(r.npp),o); byClean.set(clean(r.ssn)+'|'+base(r.npp),o);});
  T10.forEach(r=>{const o=SS.get(K(r.asm,r.ssn)); if(!o)return; const f=vo(r,'OFF'),n=vo(r,'ON'),a10=r.v[vk()]||{};
    o.t10.pc+=a10.pc||0;o.t10.sm+=a10.sm||0;o.t10.li+=a10.lines||0;o.t10.so+=a10.so||0;o.t10.aso+=a10.aso||0;o.t10.offSo+=f.so||0;o.t10.offAso+=f.aso||0;o.t10.onSo+=n.so||0;o.t10.onAso+=n.aso||0;});
  T9.forEach(r=>{const o=SS.get(K(r.asm,r.ssn)); if(!o)return; const a=r.v[vk()]||{};o.t9.off+=vo(r,'OFF').aso||0;o.t9.on+=vo(r,'ON').aso||0;o.t9.pc+=a.pc||0;o.t9.sm+=a.sm||0;o.t9.li+=a.lines||0;o.t9.so+=a.so||0;});
  T11S.DATA.forEach(r=>{const o=byClean.get(clean(r.ss)+'|'+base(r.npp)); if(!o)return; if((F.vip!=='all'&&r.vip!==F.vip)||(F.oo!=='all'&&r.oo!==F.oo))return; if(r.oo==='OFF')o.mcpOff+=r.q11||0; else o.mcpOn+=r.q11||0;});
  const on=ON7_11; const onIdx=on.k.map(q=>{let o=null; SS.forEach(v=>{if(!o&&v.asm===q[1]&&clean(v.ss)===clean(q[0]))o=v;}); return o;});
  on.r.forEach(r=>{const o=onIdx[r[1]]; if(!o||r[2]>6)return; o.on7.q+=r[4];o.on7.a+=r[5];});
  const ssOf=m=>SS.get(K(m[2],m[4]));
  GP11.rows.forEach(r=>{const o=ssOf(x.srOf(r[0])); if(!o)return; o.drop+=r[4];o.dropSO+=r[5];o.srn++;});
  GP11.top.forEach(t=>{const o=ssOf(x.srOf(t[0])); if(o)o.top.push({code:t[1],name:t[2],so:t[3],sr:x.srOf(t[0])[1]});});
  HVT11.rows.forEach(r=>{const m=HVT11.sr[r[0]], o=SS.get(K(m[2],m[4])); if(!o)return; const base=r[6],ds=r[5],t=r[3], b=[r[10],r[11],r[12],r[13]], s4=b[0]+b[1]+b[2]+b[3], nv2=t===1?b.every(q=>q>=150000):s4>=500000, m1=base>0&&ds/base>=0.95;
    o.hv.n++; if(!(ds>0))o.hv.chua++; if(m1)o.hv.m1++; if(m1&&!nv2)o.hv.nv1x++;
    if(!m1&&base>0&&(0.95*base-ds)<=0.3*base){o.hv.sap.push({code:r[1],name:r[2],gap:0.95*base-ds,sr:m[1]});o.hv.gapSap+=0.95*base-ds;}});
  CBT11.rows.forEach(r=>{ if(r[1]!==0)return; const o=ssOf(CBT11.sr[r[0]]); if(o){o.cbN+=r[2];o.cbNhan+=r[6];}});
  const tsr=TDS11.sr.map(q=>{let m=null; [HVT11.sr,COMBO11.sr,CBT11.sr].forEach(L=>{if(m)return; const f=L.find(z=>String(z[0])===String(q[0])&&z[2]&&z[2]!=='Chưa gán SS'); if(f)m=f;}); return m;});
  const MU=[1.2,1.15,1.3,1.2];
  TDS11.rows.forEach(r=>{const m=tsr[r[0]]; if(!m)return; const o=SS.get(K(m[2],m[4])); if(!o)return; const ct=r[4]*MU[r[3]],th=r[5],ok=th>0&&th>=ct-0.5; o.td.n++;o.td.ct+=ct;o.td.th+=th; if(ok)o.td.ok++; else if(ct&&th/ct>=0.7)o.td.near++;});
  const sk=new Map(); T11.forEach(r=>{sk.set(r.ss+'|'+base(r.npp),K(r.asm,r.ssn)); sk.set(r.ssn+'|'+base(r.npp),K(r.asm,r.ssn));});
  const cs={}; T11S.CATD.forEach(r=>{ if(r[3]!=='all')return; const [s,n]=r[0].split('|'); const kk=sk.get(s+'|'+base(n)); if(!kk)return; cs[kk]=(cs[kk]||0)+r[5];});
  SS.forEach((o,kk)=>{o.cat=o.aso?(cs[kk]||0)/o.aso:0;});
  const pidx=DDK.p.length, nm=i=>i<pidx?DDK.p[i][1]:((T11S.DDK.newp[i-pidx]||[])[1]||('SR '+i));
  const byName=new Map(); SS.forEach(o=>{byName.set(clean(o.ss),o);});
  T11S.DDK.rows.forEach(r=>{const o=byName.get(clean(DDK.k[r[1]]||'')); if(!o)return; const v=r[4]['a|all|all']; if(!v||!v[2])return; o.sr.push({name:nm(r[0]),pc:v[2]/d,lp:v[3]/v[2],so:v[0]});});
  const A=[]; SS.forEach(o=>{
    o.cur=o.so/d; o.B=o.cur*k*rem; o.fc=o.so+o.B; o.short=Math.max(0,o.tg-o.fc);
    const srN=Math.max(1,o.srn);
    // N1 Off / On
    const tOff=par('aso')/100*o.mcpOff, dOff=Math.max(0,tOff-o.t10.offAso), kOff=o.t10.offAso?o.t10.offSo/o.t10.offAso:0;
    o.n1={tOff,dOff,dsOff:dOff*kOff*rf,pOff:o.mcpOff?o.asoOff/o.mcpOff:0,pOff10:o.mcpOff?o.t10.offAso/o.mcpOff:0};
    const tOn=par('on')/100*o.mcpOn, dOn=Math.max(0,tOn-o.t10.onAso), kOn=o.t10.onAso?o.t10.onSo/o.t10.onAso:0;
    o.n1.tOn=tOn;o.n1.dOn=dOn;o.n1.dsOn=dOn*kOn*rf;o.n1.pOn=o.mcpOn?o.asoOn/o.mcpOn:0;o.n1.pOn10=o.mcpOn?o.t10.onAso/o.mcpOn:0;o.n1.p7=o.on7.q?o.on7.a/o.on7.q:0;
    // N2/N3
    const pcd=o.sm&&d?o.pc/(o.sm*d):0, lp=o.pc?o.li/o.pc:0, cap=1+par('cap')/100;
    const tp=pcd?Math.max(pcd,Math.min(par('pc'),pcd*cap)):0, tl=lp?Math.max(lp,Math.min(par('lp'),lp*cap)):0;
    const fp=pcd?tp/pcd:1, fl=lp?tl/lp:1;
    o.n2={pcd,tp,lp,tl,dsPc:o.B*(fp-1),dsLp:o.B*(fl-1)*fp,dsAll:o.B*(fp*fl-1)};
    // N4
    const h=x.hvCb({asm:o.asm,ss:o.ss}); o.n4={hv:h.hv,cb:h.cb,more:h.more,sapN:h.sapN,tot:h.hv+h.cb,cbp:o.cbN?o.cbNhan/o.cbN:0};
    // N5
    o.n5={cat:o.cat,ds:o.aso*par('cat')*150000*rf};
    o.n1.net=(o.n1.dsOff+o.n1.dsOn)*(1-par('ov')/100); o.core=o.n1.net+o.n2.dsAll+o.n4.tot; o.srN=srN; A.push(o);});
  const hc=par('hc')/100;
  CACHE={d,D,rem,k,rf,hc,list:A.sort((p,q)=>q.short-p.short)}; return CACHE;
}
const sumBy=(arr,f)=>arr.reduce((t,o)=>t+f(o),0);
function rollup(arr){
  const r={asoNet:0,so:0,tg:0,B:0,fc:0,short:0,mcpOff:0,asoOff:0,t10OffAso:0,tOff:0,dOff:0,dsOff:0,mcpOn:0,asoOn:0,dOn:0,dsOn:0,on7q:0,on7a:0,pc:0,li:0,sm:0,aso:0,dsPc:0,dsLp:0,dsAll:0,hv:0,cb:0,tot:0,core:0,cat:0,catDs:0,hvN:0,hvChua:0,hvM1:0,hvSap:0,hvNv1x:0,cbN:0,cbNhan:0,tdN:0,tdCt:0,tdTh:0,tdOk:0,tdNear:0,drop:0,dropSO:0,srn:0,t10OnAso:0};
  arr.forEach(o=>{r.so+=o.so;r.tg+=o.tg;r.B+=o.B;r.fc+=o.fc;r.mcpOff+=o.mcpOff;r.asoOff+=o.asoOff;r.t10OffAso+=o.t10.offAso;r.tOff+=o.n1.tOff;r.dOff+=o.n1.dOff;r.dsOff+=o.n1.dsOff;r.asoNet+=o.n1.net;r.mcpOn+=o.mcpOn;r.asoOn+=o.asoOn;r.t10OnAso+=o.t10.onAso;r.dOn+=o.n1.dOn;r.dsOn+=o.n1.dsOn;r.on7q+=o.on7.q;r.on7a+=o.on7.a;
    r.pc+=o.pc;r.li+=o.li;r.sm+=o.sm;r.aso+=o.aso;r.dsPc+=o.n2.dsPc;r.dsLp+=o.n2.dsLp;r.dsAll+=o.n2.dsAll;r.hv+=o.n4.hv;r.cb+=o.n4.cb;r.core+=o.core;r.cat+=o.cat*o.aso;r.catDs+=o.n5.ds;
    r.hvN+=o.hv.n;r.hvChua+=o.hv.chua;r.hvM1+=o.hv.m1;r.hvSap+=o.hv.sap.length;r.hvNv1x+=o.hv.nv1x;r.cbN+=o.cbN;r.cbNhan+=o.cbNhan;r.tdN+=o.td.n;r.tdCt+=o.td.ct;r.tdTh+=o.td.th;r.tdOk+=o.td.ok;r.tdNear+=o.td.near;r.drop+=o.drop;r.dropSO+=o.dropSO;r.srn+=o.srn;
    r.short+=o.short;});
  r.tot=r.hv+r.cb; r.gap=Math.max(0,r.tg-r.fc); return r;
}
const NTF=()=>F.oo!=='all'||F.vip!=='all';
const sc=a=>F.asm!=='all'?a===F.asm:(S.asm==='all'||a===S.asm);
const FLT_NOTE=()=>{const m=[F.oo==='OFF'?'kênh Off Premise':F.oo==='ON'?'kênh On Premise':'',F.vip!=='all'?'nhóm '+F.vip:''].filter(Boolean); if(!m.length&&!(typeof MEAT!=='undefined'&&MEAT==='excl')&&F.asm==='all')return ''; return `<div class="pnote" style="margin:8px 0;padding:8px 10px;background:#fff7ed;border:1px solid #fdba74;border-radius:8px">Đang lọc theo bộ lọc chung: <b>${[F.asm!=='all'?F.asm:'',...m,(typeof MEAT!=='undefined'&&MEAT==='excl')?'không P.Meat &amp; Bia':''].filter(Boolean).join(' · ')}</b>. SO, PC, LPPC và ASO tính theo bộ lọc. ${(F.oo!=='all'||F.vip!=='all')?'Chỉ tiêu và GAP chỉ có cấp Toàn Miền nên không hiện khi lọc kênh/nhóm. ':''}Hội viên Tết, combo, gắn kết, CAT và quầy rơi là số toàn bộ KH, không chia theo kênh/nhóm.</div>`;};
function blockSummary(C){
  const L=C.list.filter(o=>sc(o.asm)), r=rollup(L), hc=C.hc;
  const gap=r.tg-r.fc, rawCover=r.core, cov=gap>0?rawCover/gap:0, exec=rawCover*hc, scen=r.fc+exec;
  const warn=gap>0&&rawCover<gap, NT=F.oo!=='all'||F.vip!=='all';
  return `<div class="kpis" style="grid-template-columns:repeat(5,1fr)">`+
   card('Chỉ tiêu T11',NT?'—':ty(r.tg)+' tỷ','SO MTD '+ty(r.so)+' tỷ · '+pc(r.so,r.tg)+' đến '+T11_META.last_date)+
   card('Dự kiến giữ đà',ty(r.fc)+' tỷ',pc(r.fc,r.tg)+' chỉ tiêu · hệ số tăng tốc '+nf(C.k,2))+
   card('GAP cần lấp',NT?'—':gap>0?ty(gap)+' tỷ':'Đủ (dư '+ty(-gap)+')',(NT?'Chỉ tiêu chỉ có cấp Toàn Miền':'SO/ngày '+ty(r.so/C.d)+' → cần '+ty(Math.max(0,r.tg-r.so)/C.rem)+' tỷ'),gap>0?'#dc2626':'#16a34a')+
   card('Nhiệm vụ 1+2+3+4 (ASO·PC·LPPC·MBS)','+'+ty(rawCover)+' tỷ',(NT?'SO thêm nếu làm đủ 100%':'đủ '+nf(cov*100,0)+'% GAP nếu làm 100%')+' · CAT là lớp đệm, không cộng',cov>=1?'#16a34a':'#d97706')+
   card('Thực thi '+nf(hc*100,0)+'%','+'+ty(exec)+' tỷ','→ '+ty(scen)+' tỷ'+(NT?'':' = '+pc(scen,r.tg)+' chỉ tiêu')+' (mức cam kết sàn)',(NT||scen>=r.tg)?'#16a34a':'#d97706')+`</div>`+
  `${FLT_NOTE()}<div class="pnote" style="margin:8px 0">Cách tính: mỗi nhiệm vụ tính SO thêm cho từng SS trên <b>${C.rem} ngày công còn lại</b> (từ ${Number(T11_META.last_date.split('/')[0])+1}/11). ASO: kéo số KH có đơn về ${nf(par('aso'),0)}% MCP Off / ${nf(par('on'),0)}% On (mục tiêu Miền), trừ ${nf(par('ov'),0)}% phần chồng lấn với PC. PC và LPPC: mỗi SS tiến về mục tiêu Miền (PC ${nf(par('pc'),1)}, LPPC ${nf(par('lp'),2)}) nhưng không quá +${nf(par('cap'),0)}% so với hiện tại (không đòi SS vượt quá khả năng). MBS: hội viên sắp đạt + chưa mua, combo L1 Off lên ${nf(par('cb1'),0)}%. Tăng CAT: +${nf(par('cat'),1)} ngành/KH × 150K. Tất cả là <b>ước tính</b>; ô xanh sửa được, lưu trên trình duyệt.</div>`;
}
const T=(h,rows)=>`<div style="overflow-x:auto"><table class="t8asmtbl"><thead><tr>${h}</tr></thead><tbody>${rows}</tbody></table></div>`;
function lines(arr,asmOn){ // bảng theo ASM hoặc NPP: GAP + 3 nhóm giải pháp
  return arr.map(([name,L,isT])=>{const r=rollup(L), gap=r.tg-r.fc, cov=gap>0?r.core/gap:null;
    return `<tr${isT?' class="tot"':''}><td style="text-align:left;white-space:nowrap">${esc(name)}</td><td>${ty(r.tg)}</td><td>${pc(r.so,r.tg)}</td><td>${ty(r.fc)}</td><td><b>${NTF()?'—':gap>0?ty(gap):'Đủ'}</b></td><td>+${ty(r.asoNet)}</td><td>+${ty(r.dsAll)}</td><td>+${ty(r.tot)}</td><td><b>+${ty(r.core)}</b></td><td style="${cov==null?'':stc(cov)}">${cov==null?'—':cv(cov)}</td><td>${NTF()?'—':gap>0?(r.core>=gap?'Đủ, dư '+ty(r.core-gap):'Thiếu '+ty(gap-r.core)):'Dư '+ty(-gap+r.core)}</td><td>${ty(r.catDs)}</td></tr>`;}).join('');
}
const H1=`<th style="${THL}">Phạm vi</th><th style="${TH}">Chỉ tiêu (tỷ)</th><th style="${TH}">%Đạt MTD</th><th style="${TH}">Dự kiến giữ đà (tỷ)</th><th style="${TH}">GAP (tỷ)</th><th style="${TH}">NV 1: ASO (tỷ)</th><th style="${TH}">NV 2+3: PC + LPPC (tỷ)</th><th style="${TH}">NV 4: hội viên + combo (tỷ)</th><th style="${TH}">Cộng 1+2+3+4 (tỷ)</th><th style="${TH}">% lấp GAP (làm đủ)</th><th style="${TH}">Còn thiếu / dư (tỷ)</th><th style="${TH}">NV 5: CAT (đệm, tỷ)</th>`;
function blockAsm(C){
  const A=X().ASMS_(), L=C.list;
  const rows=lines(A.map(a=>[X().lab(a),L.filter(o=>o.asm===a)]).concat([['TOÀN MIỀN',L,true]]));
  return T(H1,rows)+`<div class="pnote" style="margin-top:6px">% lấp GAP = SO thêm của nhiệm vụ 1+2+3+4 (làm đủ 100%) ÷ GAP. ASO đã trừ phần chồng lấn với PC; CAT chồng với PC/LPPC nên chỉ là lớp đệm. Nếu thực tế chỉ làm được ${nf(C.hc*100,0)}%: xem thẻ "Thực thi" ở trên.</div>`;
}
function blockMetrics(C){
  const A=X().ASMS_(), L=C.list;
  const row=(name,arr,isT)=>{const r=rollup(arr), tp=r.pc/Math.max(1,r.sm)/C.d, lp=r.pc?r.li/r.pc:0, tdp=r.tdCt?r.tdTh/r.tdCt:0;
    return `<tr${isT?' class="tot"':''}><td style="text-align:left;white-space:nowrap">${esc(name)}</td>
    <td>${pc(r.asoOff,r.mcpOff)}</td><td>${pc(r.t10OffAso,r.mcpOff)}</td><td>${nf(r.dOff,0)}</td>
    <td>${pc(r.on7a,r.on7q)}</td><td>${nf(r.dOn,0)}</td>
    <td>${nf(tp,1)}</td><td>${nf(lp,2)}</td>
    <td>${pc(r.hvM1,r.hvN)}</td><td>${nf(r.hvChua,0)}</td><td>${nf(r.hvSap,0)}</td><td>${pc(r.cbNhan,r.cbN)}</td><td>${pc(r.tdTh,r.tdCt)}</td><td>${nf(r.tdNear,0)}</td><td>${nf(r.aso?r.cat/r.aso:0,2)}</td><td>${nf(r.drop,0)}</td></tr>`;};
  const rows=A.map(a=>row(X().lab(a),L.filter(o=>o.asm===a))).join('')+row('TOÀN MIỀN',L,true);
  const h=`<th style="${THL}" rowspan="2">Phạm vi</th><th style="${TH};text-align:center" colspan="3">NV1 · ASO Off (mục tiêu ${nf(par('aso'),0)}%)</th><th style="${TH};text-align:center" colspan="2">NV1 · ASO On (${nf(par('on'),0)}%)</th><th style="${TH};text-align:center" colspan="2">NV2 · NV3 (mục tiêu ${nf(par('pc'),1)} · ${nf(par('lp'),2)})</th><th style="${TH};text-align:center" colspan="6">NV4 · MBS Tết</th><th style="${TH}" rowspan="2">NV5 · Ngành / KH active (+${nf(par('cat'),1)})</th><th style="${TH}" rowspan="2">Quầy rơi (gọi lại)</th></tr><tr><th style="${TH}">MTD</th><th style="${TH}">T10 cả tháng</th><th style="${TH}">KH Off cần thêm vs T10</th><th style="${TH}">7 loại hình MTD</th><th style="${TH}">KH On cần thêm vs T10</th><th style="${TH}">PC/ĐDKD/ngày</th><th style="${TH}">LPPC</th><th style="${TH}">HV đạt NV1</th><th style="${TH}">HV chưa mua</th><th style="${TH}">HV sắp đạt</th><th style="${TH}">Combo L1 Off %KH</th><th style="${TH}">Gắn kết %TH</th><th style="${TH}">Gắn kết gần đạt (KH)`;
  return T(h,rows)+`<div class="pnote" style="margin-top:6px">ASO MTD là số 9 ngày công nên thấp hơn T10 cả tháng; cột "KH cần thêm" so mục tiêu với T10 cả tháng, đúng cách bài PowerPoint tính. HV đạt NV1 = DS ≥ 95% chỉ tiêu nền. Gắn kết gần đạt = đã đạt ≥70% chỉ tiêu nhưng chưa đạt.</div>`;
}
function blockNpp(C){
  const g=new Map(); C.list.filter(o=>sc(o.asm)&&o.tg>0).forEach(o=>{o.npps.forEach(n=>{});const kk=o.asm+'|'+o.npps.join(' / '); if(!g.has(kk))g.set(kk,{asm:o.asm,npp:o.npps.join(' / '),L:[]}); g.get(kk).L.push(o);});
  const rows=[...g.values()].map(n=>({n,r:rollup(n.L)})).sort((p,q)=>(q.r.tg-q.r.fc)-(p.r.tg-p.r.fc)).map(({n,r})=>{const gap=r.tg-r.fc, cov=gap>0?r.core/gap:null, tp=r.pc/Math.max(1,r.sm)/C.d, lp=r.pc?r.li/r.pc:0;
    const lead=[['ASO Off',r.dsOff],['PC',r.dsPc],['LPPC',r.dsLp],['Hội viên',r.hv],['Combo',r.cb]].sort((a,b)=>b[1]-a[1])[0];
    return `<tr><td style="text-align:left">${esc(X().SHORT[n.asm]||n.asm)}</td><td style="text-align:left;white-space:normal">${esc(n.npp)}</td><td>${ty(r.tg)}</td><td>${pc(r.so,r.tg)}</td><td><b>${gap>0?ty(gap):'Đủ'}</b></td><td>${pc(r.asoOff,r.mcpOff)}</td><td>${nf(tp,1)}</td><td>${nf(lp,2)}</td><td>+${ty(r.asoNet)}</td><td>+${ty(r.dsAll)}</td><td>+${ty(r.tot)}</td><td><b>+${ty(r.core)}</b></td><td style="${cov==null?'':stc(cov)}">${cov==null?'—':cv(cov)}</td><td style="text-align:left">${lead[1]>0?lead[0]+' (+'+ty(lead[1])+')':'—'}</td><td>${nf(r.drop,0)}</td></tr>`;}).join('');
  const h=`<th style="${THL}">ASM</th><th style="${THL}">NPP</th><th style="${TH}">Chỉ tiêu (tỷ)</th><th style="${TH}">%Đạt MTD</th><th style="${TH}">GAP (tỷ)</th><th style="${TH}">ASO Off MTD</th><th style="${TH}">PC/ĐDKD/ngày</th><th style="${TH}">LPPC</th><th style="${TH}">ASO (tỷ)</th><th style="${TH}">PC + LPPC (tỷ)</th><th style="${TH}">Hội viên + combo (tỷ)</th><th style="${TH}">Cộng (tỷ)</th><th style="${TH}">% lấp GAP</th><th style="${THL}">Đòn bẩy lớn nhất</th><th style="${TH}">Quầy rơi</th>`;
  return T(h,rows)+`<div class="pnote" style="margin-top:6px">Xếp theo GAP giảm dần. NPP có nhiều SS được gộp theo cặp NPP của SS đó.</div>`;
}
function ssRow(o,C){
  const gap=o.short, cov=gap>0?o.core/gap:null, n2=o.n2, pr=[];
  return {gap,cov};
}
function actions(o,C){
  const rem=C.rem, srN=o.srN, A=[];
  if(o.drop>0)A.push([o.drop*0+o.dropSO*0.668*0.1/1,`Gọi/thăm lại <b>${nf(o.drop,0)}</b> quầy rơi (mua kỳ trước, chưa mua T11; SO kỳ trước ${ty(o.dropSO)} tỷ): <b>${nf(o.drop/srN/5,1)}</b> quầy/SR/ngày trong 5 ngày công đầu`]);
  if(o.n1.dOff>0)A.push([o.n1.dsOff,`ASO Off: cần thêm <b>${nf(o.n1.dOff,0)}</b> KH có đơn so với T10 (${nf(o.n1.dOff/srN/rem,1)} KH mới/SR/ngày); MTD ${pc(o.asoOff,o.mcpOff)} MCP Off`]);
  if(o.n2.tp>o.n2.pcd+0.05)A.push([o.n2.dsPc,`PC/ĐDKD/ngày từ <b>${nf(o.n2.pcd,1)}</b> lên <b>${nf(o.n2.tp,1)}</b> (+${nf(o.n2.tp-o.n2.pcd,1)} đơn/SR/ngày)`]);
  if(o.n2.tl>o.n2.lp+0.01)A.push([o.n2.dsLp,`LPPC từ <b>${nf(o.n2.lp,2)}</b> lên <b>${nf(o.n2.tl,2)}</b>: mỗi đơn chào thêm 1 line ngành yếu`]);
  if(o.hv.sap.length)A.push([o.n4.hv*0.7,`Hội viên: chốt <b>${o.hv.sap.length}</b> KH sắp đạt NV1 (thiếu ${nf(o.hv.gapSap/1e6,0)} triệu) và đưa <b>${nf(o.hv.chua,0)}</b> HV chưa mua phát sinh đơn`]);
  if(o.n4.more>0)A.push([o.n4.cb,`Combo L1 Off: thêm <b>${nf(o.n4.more,0)}</b> KH nhận combo để lên ${nf(par('cb1'),0)}% (hiện ${pc(o.cbNhan,o.cbN)})`]);
  if(o.td.near>0)A.push([0,`Gắn kết: <b>${o.td.near}</b> KH gần đạt chỉ tiêu Mì/Chanté/Cà phê/Bia, chốt trước 21/11`]);
  return A.sort((p,q)=>q[0]-p[0]);
}
function blockSs(C){
  const L=C.list.filter(o=>sc(o.asm));
  const rows=L.map(o=>{const gap=o.short, cov=gap>0?o.core/gap:null, a=actions(o,C), top=a.slice(0,3).map((x,i)=>(i+1)+'. '+x[1]).join('<br>');
    return `<tr><td style="text-align:left;white-space:nowrap">${esc(X().SHORT[o.asm]||o.asm)}</td><td style="text-align:left;white-space:normal">${esc(o.npps.join(' / '))}</td><td style="text-align:left;white-space:nowrap"><b>${esc(o.ss)}</b></td><td>${pc(o.so,o.tg)}</td><td><b>${gap>0?ty(gap):'Đủ'}</b></td><td>${pc(o.asoOff,o.mcpOff)}</td><td>${nf(o.n2.pcd,1)}</td><td>${nf(o.n2.lp,2)}</td><td>+${ty(o.n1.net)}</td><td>+${ty(o.n2.dsAll)}</td><td>+${ty(o.n4.tot)}</td><td><b>+${ty(o.core)}</b></td><td style="${cov==null?'':stc(cov)}">${cov==null?'—':cv(cov)}</td><td style="text-align:left;white-space:normal;min-width:360px">${top||'—'}</td></tr>`;}).join('');
  const h=`<th style="${THL}">ASM</th><th style="${THL}">NPP</th><th style="${THL}">SS</th><th style="${TH}">%Đạt MTD</th><th style="${TH}">GAP (tỷ)</th><th style="${TH}">ASO Off MTD</th><th style="${TH}">PC/ĐDKD/ngày</th><th style="${TH}">LPPC</th><th style="${TH}">ASO (tỷ)</th><th style="${TH}">PC + LPPC (tỷ)</th><th style="${TH}">Hội viên + combo (tỷ)</th><th style="${TH}">Cộng (tỷ)</th><th style="${TH}">% lấp GAP</th><th style="${THL}">3 việc ưu tiên (xếp theo SO thêm)</th>`;
  return T(h,rows)+`<div class="pnote" style="margin-top:6px">Xếp theo GAP giảm dần. Ô % lấp GAP: xanh ≥100%, vàng 80–99%, đỏ &lt;80%: SS đỏ không tự đủ, ASM phải điều SR kèm hoặc chốt cam kết thấp hơn.</div>`;
}
function blockSheet(C){
  const L=C.list.filter(o=>sc(o.asm)); let h='';
  L.forEach((o,i)=>{const a=actions(o,C), cov=o.short>0?o.core/o.short:null, id=o.asm+'|'+o.ss;
    const topD=o.top.sort((p,q)=>q.so-p.so).slice(0,5).map(t=>`<li>${esc(t.name)} (${esc(t.code)}) — SO kỳ trước ${nf(t.so/1e6,1)} tr · SR ${esc(t.sr)}</li>`).join('');
    const hv=o.hv.sap.sort((p,q)=>p.gap-q.gap).slice(0,5).map(t=>`<li>${esc(t.name)} (${esc(t.code)}) — thiếu ${nf(t.gap/1e6,2)} tr đến 95% nền · SR ${esc(t.sr)}</li>`).join('');
    const tp=o.n2.tp, tl=o.n2.tl, sr=o.sr.slice().sort((p,q)=>(p.pc/Math.max(tp,1)+p.lp/Math.max(tl,1))-(q.pc/Math.max(tp,1)+q.lp/Math.max(tl,1))).slice(0,4).map(t=>`<li>${esc(t.name)} — PC ${nf(t.pc,1)}/ngày, LPPC ${nf(t.lp,2)}${t.pc<tp?' (dưới mục tiêu '+nf(tp,1)+')':''}</li>`).join('');
    h+=`<details${i<3?' open':''} style="margin:6px 0;border:1px solid #bae6fd;border-radius:8px;padding:6px 10px;background:#fff"><summary style="cursor:pointer;font-weight:700;color:#0369A1">${esc(X().SHORT[o.asm]||o.asm)} · ${esc(o.npps.join(' / '))} · SS ${esc(o.ss)} <span style="font-weight:400;color:#475569">— GAP ${o.short>0?ty(o.short)+' tỷ':'đủ'} · ${o.srN} SR · cộng +${ty(o.core)} tỷ${cov==null?'':' ('+nf(cov*100,0)+'% GAP)'}</span></summary>
     <div style="margin:8px 0"><b>Việc giao cho SS (xếp theo SO thêm):</b><ol style="margin:4px 0 0 18px">${a.map(x=>`<li>${x[1]}</li>`).join('')||'<li>Giữ nhịp hiện tại</li>'}</ol></div>
     ${o.hv.n?`<div class="pnote">Hội viên SS: ${o.hv.n} KH · đạt NV1 ${pc(o.hv.m1,o.hv.n)} · đạt NV1 chưa đủ nhãn ${o.hv.nv1x} · gắn kết %TH ${pc(o.td.th,o.td.ct)} · ngành/KH active ${nf(o.cat,2)}</div>`:''}
     <div style="display:grid;grid-template-columns:repeat(3,minmax(220px,1fr));gap:12px;margin-top:6px"><div><b>Quầy rơi lớn nhất cần gọi lại</b><ul style="margin:4px 0 0 16px">${topD||'<li>—</li>'}</ul></div><div><b>Hội viên sắp đạt NV1 (chốt trước 14/11)</b><ul style="margin:4px 0 0 16px">${hv||'<li>—</li>'}</ul></div><div><b>ĐDKD thấp nhất về PC/LPPC (SS kèm)</b><ul style="margin:4px 0 0 16px">${sr||'<li>—</li>'}</ul></div></div></details>`;});
  return h||'<div class="pnote">Không có SS trong phạm vi.</div>';
}
function blockMoc(C){
  const L=C.list.filter(o=>sc(o.asm)), r=rollup(L), lastD=Number(T11_META.last_date.split('/')[0]);
  const wd=day=>{let n=0;for(let i=1;i<=day;i++){if(new Date(2026,10,i).getDay()!==0)n++;}return n;};
  const rows=[14,21,28,30].map(dd=>{const w=Math.max(wd(dd),C.d), f=(w-C.d)/Math.max(1,C.rem), tgt=Math.min(1,f);
    const so=r.so+Math.max(0,r.tg-r.so)*tgt;
    const aso=r.mcpOff?(r.asoOff+(r.tOff-r.t10OffAso+r.t10OffAso-r.asoOff)*0)/r.mcpOff:0; 
    const cb=dd<=21?par('cb1'):45;
    return `<tr><td style="text-align:left"><b>${dd}/11</b></td><td>${w}/${C.D}</td><td>${ty(so)} (${pc(so,r.tg,1)})</td><td>${pc(r.asoOff+(r.tOff-r.asoOff)*f,r.mcpOff)}</td><td>${nf(Math.min(par('pc'),(r.pc/Math.max(1,r.sm)/C.d)*(1+f*0.1)),1)} · ${nf(Math.min(par('lp'),(r.pc?r.li/r.pc:0)*(1+f*0.1)),2)}</td><td>${nf(cb,0)}%</td><td>${dd===14?'Chốt HV sắp đạt NV1 · bổ sung nhãn':dd===21?'Hội viên đều có đơn · chốt gắn kết':dd===28?'Dồn hội viên sắp đạt · NV1+NV2':'Chốt tháng · danh sách kéo sang T12'}</td></tr>`;}).join('');
  const h=`<th style="${THL}">Mốc</th><th style="${TH}">Ngày công lũy kế</th><th style="${TH}">SO lũy kế cần (đường về đích)</th><th style="${TH}">ASO Off lũy kế (tiến dần về ${nf(par('aso'),0)}%)</th><th style="${TH}">PC/ĐDKD · LPPC (đường tiến)</th><th style="${TH}">Combo L1 Off</th><th style="${THL}">Việc chốt</th>`;
  return T(h,rows)+`<div class="pnote" style="margin-top:6px">Mốc là đường tiến đều từ hiện tại đến mục tiêu, không phải chỉ tiêu chính thức. Review 14/11 · 21/11 · 28/11: dưới 85% mốc thì ASM báo nguyên nhân và bù trong tuần kế tiếp.</div>`;
}

const WD=m=>{try{return WORKDAYS[m];}catch(e){return m==='9'?26:27;}};
const sum=(L,f)=>L.reduce((t,o)=>t+f(o),0);
const dv=(a,b)=>b?a/b:null;
const fPct=v=>v==null?'—':nf(v*100,1)+'%', fN1=v=>v==null?'—':nf(v,1), fN2=v=>v==null?'—':nf(v,2);
const METS={
 aso:{t:'ASO Off',f:fPct,u:'pp',tg:()=>par('aso')/100,den:o=>o.mcpOff,
  v:(L,C)=>[dv(sum(L,o=>o.t9.off),sum(L,o=>o.mcpOff)),dv(sum(L,o=>o.t10.offAso),sum(L,o=>o.mcpOff)),dv(sum(L,o=>o.asoOff),sum(L,o=>o.mcpOff))],
  need:L=>nf(sum(L,o=>o.n1.dOff),0)+' KH',so:L=>sum(L,o=>o.n1.dsOff),what:'Mục tiêu = % KH có đơn trên MCP Off. T9, T10 là cả tháng, T11 là MTD đến '+'${T11_META.last_date}'+' nên thấp hơn. "KH cần thêm" so với T10 cả tháng; SO thêm = KH thêm × SO/KH Off T10 × phần tháng còn lại.'},
 on:{t:'ASO On (7 loại hình)',f:fPct,tg:()=>par('on')/100,
  v:(L,C)=>[dv(sum(L,o=>o.t9.on),sum(L,o=>o.mcpOn)),dv(sum(L,o=>o.t10.onAso),sum(L,o=>o.mcpOn)),dv(sum(L,o=>o.asoOn),sum(L,o=>o.mcpOn))],
  need:L=>nf(sum(L,o=>o.n1.dOn),0)+' KH',so:L=>sum(L,o=>o.n1.dsOn),what:'Cách tính như ASO Off, trên MCP kênh On.'},
 pc:{t:'PC/ĐDKD/ngày',f:fN1,tg:()=>par('pc'),
  v:(L,C)=>[dv(sum(L,o=>o.t9.pc),sum(L,o=>o.t9.sm)*WD('9')),dv(sum(L,o=>o.t10.pc),sum(L,o=>o.t10.sm)*WD('10')),dv(sum(L,o=>o.pc),sum(L,o=>o.sm)*C.d)],
  need:(L,C)=>{const a=dv(sum(L,o=>o.pc),sum(L,o=>o.sm)*C.d);return a==null?'—':'+'+nf(Math.max(0,par('pc')-a),1)+' đơn/SR/ngày';},so:L=>sum(L,o=>o.n2.dsPc),what:'Mỗi SS tiến về mục tiêu nhưng không quá +'+'${par("cap")}'+'% so với hiện tại. SS đã vượt mục tiêu không bị trừ.'},
 lp:{t:'LPPC',f:fN2,tg:()=>par('lp'),
  v:(L,C)=>[dv(sum(L,o=>o.t9.li),sum(L,o=>o.t9.pc)),dv(sum(L,o=>o.t10.li),sum(L,o=>o.t10.pc)),dv(sum(L,o=>o.li),sum(L,o=>o.pc))],
  need:L=>{const a=dv(sum(L,o=>o.li),sum(L,o=>o.pc));return a==null?'—':'+'+nf(Math.max(0,par('lp')-a),2)+' line/đơn';},so:L=>sum(L,o=>o.n2.dsLp),what:'Mỗi đơn chào thêm line ngành yếu; tính nối tiếp sau PC để không trùng.'},
 hv:{t:'Hội viên Tết',f:fPct,tg:()=>null,tgTxt:'Đạt NV1 (≥95% nền)',
  v:(L,C)=>[null,null,dv(sum(L,o=>o.hv.m1),sum(L,o=>o.hv.n))],
  need:L=>nf(sum(L,o=>o.hv.sap.length),0)+' HV sắp đạt · '+nf(sum(L,o=>o.hv.chua),0)+' chưa mua',so:L=>sum(L,o=>o.n4.hv),what:'Không có số T9/T10 cho hội viên Tết. SO thêm = chốt hội viên sắp đạt + kích hoạt hội viên chưa mua.'},
 cb:{t:'Combo L1 Off',f:fPct,tg:()=>par('cb1')/100,
  v:(L,C)=>[null,null,dv(sum(L,o=>o.cbNhan),sum(L,o=>o.cbN))],
  need:L=>nf(sum(L,o=>o.n4.more),0)+' KH nhận thêm',so:L=>sum(L,o=>o.n4.cb),what:'% KH Off nhận combo mức 1 so mục tiêu; SO thêm theo hiệu quả combo của dashboard Combo.'},
 cat:{t:'Tăng CAT',f:fN2,tg:L=>null,tgTxt:'+'+'${par("cat")}'+' ngành/KH',
  v:(L,C)=>[null,null,dv(sum(L,o=>o.cat*o.aso),sum(L,o=>o.aso))],
  need:()=>'+'+nf(par('cat'),1)+' ngành/KH',so:L=>sum(L,o=>o.n5.ds),what:'Là lớp đệm, chồng một phần với PC/LPPC nên không cộng vào tổng.'}
};
Object.keys(METS).forEach(k=>{const m=METS[k]; if(m.what)m.what=m.what.replace("${T11_META.last_date}",T11_META.last_date).replace('${par("cap")}',nf(par('cap'),0)).replace('${par("cat")}',nf(par('cat'),1)); if(m.tgTxt)m.tgTxt=m.tgTxt.replace('${par("cat")}',nf(par('cat'),1));});
function blockTarget(C){
  const m=METS[S.m]||METS.aso, tgv=m.tg(), tg=tgv==null?null:tgv;
  const grp=new Map(); C.list.filter(o=>sc(o.asm)).forEach(o=>{const nk=o.asm+'|'+o.npps.join(' / ');if(!grp.has(o.asm))grp.set(o.asm,new Map());const g=grp.get(o.asm);if(!g.has(nk))g.set(nk,{name:o.npps.join(' / '),L:[]});g.get(nk).L.push(o);});
  const tgTxt=tg==null?(m.tgTxt||'—'):m.f(tg);
  const cells=(L)=>{const v=m.v(L,C), a=v[2], so=m.so(L), gap=tg!=null&&a!=null?a-tg:null;
    const col=gap==null?'':(gap>=0?'color:#16a34a':'color:#dc2626');
    const dTxt=gap==null?'—':(m.f===fPct?(gap>=0?'+':'')+nf(gap*100,1)+' pp':(gap>=0?'+':'')+nf(gap,m.f===fN2?2:1));
    return `<td>${m.f(v[0])}</td><td>${m.f(v[1])}</td><td><b>${m.f(a)}</b></td><td>${tgTxt}</td><td style="${col};font-weight:700">${dTxt}</td><td>${m.need(L,C)}</td><td><b>+${ty(so)}</b></td>`;};
  let rows=''; const AS=X().ASMS_().filter(a=>grp.has(a));
  const row=(lv,id,pid,name,L,show,hasKids)=>{const ind=lv*16; const op=S.open.has(id);
    return `<tr data-id="${esc(id)}" data-p="${esc(pid)}" data-lv="${lv}" ${show?'':'hidden'} style="${lv===0?'font-weight:700;background:#f0f9ff':''}${lv===2?';font-size:12px':''}"><td style="text-align:left;white-space:normal;padding-left:${8+ind}px">${hasKids?`<span class="nvt" style="cursor:pointer;color:#0369A1">${op?'▾':'▸'}</span> `:'&nbsp;&nbsp;'}${esc(name)}</td>${cells(L)}</tr>`;};
  AS.forEach(a=>{const g=grp.get(a), all=[]; g.forEach(n=>all.push(...n.L));
    rows+=row(0,'a|'+a,'',X().lab(a),all,true,true);
    [...g.values()].sort((p,q)=>sum(q.L,o=>o.short)-sum(p.L,o=>o.short)).forEach(n=>{const nid='n|'+a+'|'+n.name; rows+=row(1,nid,'a|'+a,n.name,n.L,S.open.has('a|'+a),n.L.length>0);
      n.L.sort((p,q)=>q.short-p.short).forEach(o=>{rows+=row(2,'s|'+a+'|'+n.name+'|'+o.ss,nid,'SS '+o.ss,[o],S.open.has('a|'+a)&&S.open.has(nid),false);});});});
  const all=C.list.filter(o=>sc(o.asm));
  rows+=`<tr class="tot" style="font-weight:700"><td style="text-align:left">TOÀN MIỀN${S.asm==='all'?'':' (phạm vi chọn)'}</td>${cells(all)}</tr>`;
  const btn=Object.keys(METS).map(k=>`<button data-m="${k}" class="${k===S.m?'on':''}">${METS[k].t}</button>`).join('');
  const h=`<th style="${THL}">ASM › NPP › SS <span style="font-weight:400">(bấm ▸ để mở)</span></th><th style="${TH}">Thực đạt T9</th><th style="${TH}">Thực đạt T10 (cả tháng)</th><th style="${TH}">T11 MTD đến ${T11_META.last_date}</th><th style="${TH}">Mục tiêu T11</th><th style="${TH}">Chênh T11 vs mục tiêu</th><th style="${TH}">Cần thêm để đạt</th><th style="${TH}">SO thêm nếu đạt (tỷ)</th>`;
  return `<div class="seg" id="nvMet" style="margin-bottom:8px">${btn}</div><div style="margin-bottom:6px"><button class="seg-b" id="nvOpenAll" style="padding:4px 10px;border:1px solid #38BDF8;background:#fff;border-radius:6px;cursor:pointer">Mở hết</button> <button id="nvCloseAll" style="padding:4px 10px;border:1px solid #38BDF8;background:#fff;border-radius:6px;cursor:pointer">Thu gọn</button></div>`+T(h,rows)+`<div class="pnote" style="margin-top:6px"><b>${m.t}:</b> ${m.what} SO thêm là ước tính, cộng được từ SS lên NPP, ASM và Miền (SS đã đạt mục tiêu ghi +0). Các mục tiêu cùng cộng vào kế hoạch sẽ trùng nhau một phần nên tổng ở trên phần GAP đã trừ chồng lấn ASO–PC.</div>`;
}
function render(){
  const pg=document.getElementById('pgNv'); const sn=document.getElementById('scopeNote'); if(sn){sn.innerHTML='';sn.hidden=true;} if(!pg||typeof T11==='undefined'||!window.GPX)return;
  let host=document.getElementById('nvHost'); if(!host){host=document.createElement('div');host.id='nvHost';pg.appendChild(host);}
  const C=compute(), A=X().ASMS_();
  const sec=(n,t,b,s)=>`<div class="panel" style="margin-top:14px"><div class="tbl-head"><div><h3 style="display:inline;color:#0369A1">${n}. ${t}</h3> ${s?`<span class="pnote" style="display:inline">— ${s}</span>`:''}</div></div>${b}</div>`;
  const pin=(k,l,w)=>`<label style="display:inline-flex;gap:4px;align-items:center;margin-right:10px">${l} ${inp('p|'+k,nf(par(k),k==='lp'?2:1),w)}</label>`;
  host.innerHTML=`<div class="panel" style="margin-top:14px;border-top:3px solid #0EA5E9"><div class="t8norm" style="margin-bottom:8px"><b>5 nhiệm vụ trọng tâm T11</b> (ASO · PC/ĐDKD · LPPC · MBS Tết · Tăng CAT) · số liệu SO đến hết <b>${T11_META.last_date}</b> (${C.d}/${C.D} ngày công, còn ${C.rem} ngày) · hội viên đến ${HVT11.meta.asof||'—'} · combo đến ${COMBO11.meta.asof||'—'} · gắn kết đến ${TDS11.meta.asof||'—'}</div>
   <div class="flt2" style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end"><div class="fg"><label>Phạm vi</label><div class="seg" id="nvScope"><button data-v="all">Toàn Miền</button>${A.map(a=>`<button data-v="${esc(a)}">${esc(X().lab(a))}</button>`).join('')}</div></div></div>
   <div style="margin:10px 0">${pin('aso','ASO Off %')}${pin('on','ASO On %')}${pin('pc','PC/ĐDKD')}${pin('lp','LPPC',56)}${pin('cap','Trần tăng %')}${pin('cb1','Combo %')}${pin('ov','Chồng lấn ASO–PC %')}${pin('cat','+ngành/KH')}${pin('hc','Thực thi %')}</div>
   ${blockSummary(C)}</div>`+
   sec(1,'GAP và mức lấp theo ASM',blockAsm(C),'SO thêm của từng nhiệm vụ trên số ngày còn lại')+
   sec(2,'Từng mục tiêu: thực đạt vs mục tiêu và SO thêm nếu đạt · ASM → NPP → SS',blockTarget(C),'chọn mục tiêu ở hàng nút')+
   sec(3,'Phiếu giao việc theo SS (có tên quầy, hội viên, ĐDKD)',blockSheet(C),'mở từng SS để xem danh sách')+
   sec(4,'Mốc kiểm soát 14/11 · 21/11 · 28/11 · 30/11',blockMoc(C));
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
