/* MT-LIB — dựng lại dữ liệu 3 tab (Combo · Hội viên Tết · Tăng doanh số) từ file Excel xuất Power BI.
   Chạy được trong trình duyệt (nút "Nạp file") và trong Node (update.js cho Claude).
   Đầu vào mỗi hàm: aoa = mảng dòng của sheet đầu tiên (dòng 0 = tiêu đề), đọc bằng SheetJS với raw:true (ngày là số serial Excel).
   ctx = {CBT11, COMBO11, HVT11, TDS11} hiện có (để giữ phân cấp ASM/NPP/SS và loại KH VIP3/VIP5/Sỉ/Lẻ). */
(function(root){
const pad=n=>String(n).padStart(2,'0');
/* ngày Excel (serial hoặc Date hoặc chuỗi) → {y,m,d} */
function ymd(v){
  if(v==null||v==='')return null;
  if(typeof v==='number'){const t=new Date(Math.round((v-25569)*864e5));return {y:t.getUTCFullYear(),m:t.getUTCMonth()+1,d:t.getUTCDate()};}
  if(v instanceof Date){const t=new Date(v.getTime()+12*36e5);return {y:t.getUTCFullYear(),m:t.getUTCMonth()+1,d:t.getUTCDate()};}
  const s=String(v),a=s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);if(a)return {y:+a[1],m:+a[2],d:+a[3]};
  const b=s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);if(b)return {y:+b[3],m:+b[2],d:+b[1]};return null;
}
/* lịch tháng: số ngày, Chủ nhật, ngày công đến ngày d */
function cal(y,m,d){
  const nd=new Date(Date.UTC(y,m,0)).getUTCDate(),sun=[];for(let i=1;i<=nd;i++)if(new Date(Date.UTC(y,m-1,i)).getUTCDay()===0)sun.push(i);
  const wd=x=>{let c=0;for(let i=1;i<=x;i++)if(!sun.includes(i))c++;return c;};
  return {cal_days:nd,sundays:sun,wd_total:wd(nd),wd_passed:wd(d||0)};
}
/* tìm cột theo phần cuối tên tiêu đề (bỏ tiền tố bảng Power BI) */
function cols(head,spec){
  const H=head.map(h=>String(h||'').trim()),o={},miss=[];
  for(const k in spec){const pats=[].concat(spec[k]);let i=-1;
    for(const p of pats){i=H.findIndex(h=>h===p);if(i<0)i=H.findIndex(h=>h.endsWith(p));if(i>=0)break;}
    if(i<0)miss.push(pats[0]);o[k]=i;}
  if(miss.length)throw new Error('Thiếu cột: '+miss.join(', '));
  return o;
}
const num=v=>{const n=+v;return isFinite(n)?n:0;};
/* bảng phân cấp ĐDKD: mã → [mã, tên, ASM, NPP, SS] từ dữ liệu sẵn có */
function srMap(ctx){
  const m=new Map();
  ['COMBO11','HVT11','TDS11','CBT11'].forEach(k=>{const D=ctx[k];if(!D||!D.sr)return;D.sr.forEach(x=>{const c=String(x[0]);if(x.length>=5&&x[2]&&x[2]!=='Chưa gán SS')m.set(c,[c,x[1],x[2],x[3],x[4]]);else if(!m.has(c))m.set(c,[c,x[1],'Chưa gán SS','Chưa gán SS','Chưa gán SS']);});});
  return m;
}
/* loại file theo tiêu đề */
function detect(head){
  const H=head.map(h=>String(h||'')).join('|');
  if(/PROMO_GROUP|SumQTY_REWARD/.test(H))return 'combo';
  if(/newsale|MEMBER_TYPE|Chỉ_tiêu_nền/.test(H))return 'hv';
  if(/Chỉ_tiêu_doanh_số|Doanh_số_thực_hiện|ONTOP/.test(H))return 'tds';
  return null;
}

/* ===== COMBO: file PROMOTION - OUTLET DETAIL ===== */
function buildCombo(aoa,ctx){
  const c=cols(aoa[0],{sr:'SF_LV5_UID]',srn:'SF_LV5_FULLNAME]',kh:'OUTLET_CD]',khn:['MCP-MASTER[OUTLET]','OUTLET]'],T2:'MCP[T2]',T3:'MCP[T3]',T4:'MCP[T4]',T5:'MCP[T5]',T6:'MCP[T6]',T7:'MCP[T7]',
    grp:'PROMO_GROUP]',pid:'PROMO_ID]',pname:'PAR_PROMOTION_NAME]',st:'PROG_START_DT]',en:'PROG_END_DT]',date:'ORDER_DATE]',qty:'[TOTAL_QTY]',rew:'[SumQTY_REWARD]',amt:'[SumRETAILER_AMOUNT]'});
  const SRM=srMap(ctx),sr=[],si=new Map(),promos=[],pi=new Map(),agg=new Map();let mx=null;
  const G=g=>/NH[ÀA] H[ÀA]NG/i.test(g)?2:/\bON\b/i.test(g)?1:0, GN=['Combo OFF','Combo ON','Combo NHÀ HÀNG'];
  const fd=v=>{const t=ymd(v);return t?pad(t.d)+'/'+pad(t.m):'';};
  for(let i=1;i<aoa.length;i++){const r=aoa[i];if(!r||r[c.kh]==null||r[c.kh]==='')continue;
    const t=ymd(r[c.date]);if(!t)continue;if(!mx||t.y*1e4+t.m*100+t.d>mx.y*1e4+mx.m*100+mx.d)mx=t;
    const code=String(r[c.sr]);if(!si.has(code)){const x=SRM.get(code)||[code,r[c.srn],'Chưa gán SS','Chưa gán SS','Chưa gán SS'];si.set(code,sr.length);sr.push([code,r[c.srn]||x[1],x[2],x[3],x[4]]);}
    const pid=String(r[c.pid]);if(!pi.has(pid)){pi.set(pid,promos.length);promos.push([pid,GN[G(r[c.grp])],String(r[c.pname]||''),fd(r[c.st]),fd(r[c.en])]);}
    const kh=String(r[c.kh]),k=kh+'|'+t.d+'|'+pid;let a=agg.get(k);
    if(!a){const wd=new Date(Date.UTC(t.y,t.m-1,t.d)).getUTCDay(),col=['',c.T2,c.T3,c.T4,c.T5,c.T6,c.T7][wd];
      a=[si.get(code),kh,String(r[c.khn]||''),G(r[c.grp]),pi.get(pid),t.d,0,0,0,col!==''&&col!=null&&String(r[col]).toUpperCase()==='Y'?1:0];agg.set(k,a);}
    a[6]+=num(r[c.rew]);a[7]+=num(r[c.qty]);a[8]+=num(r[c.amt]);}
  if(!mx)throw new Error('File combo không có ngày đặt hàng');
  const rows=[...agg.values()];rows.forEach(a=>a[8]=Math.round(a[8]));
  const C=cal(mx.y,mx.m,mx.d);
  const COMBO11={meta:Object.assign({asof:pad(mx.d)+'/'+pad(mx.m),asof_day:mx.d,y:mx.y,m:mx.m},C,{groups:GN,src:'PROMOTION - OUTLET DETAIL (MBS_CT COMBO) · T'+mx.m+'/'+mx.y}),promos,sr,rows,ex:sr.map(()=>[0,0,0,0,0])};
  /* cập nhật KH nhận / suất combo trong CBT11 theo đơn combo mới (loại KH hội viên) */
  let CBT11=ctx.CBT11;
  if(CBT11){CBT11=JSON.parse(JSON.stringify(CBT11));
    const hv=new Set(ctx.HVT11?ctx.HVT11.rows.map(r=>String(r[1])):[]),idx=new Map(CBT11.sr.map((x,i)=>[String(x[0]),i])),acc=new Map();
    rows.forEach(r=>{if(hv.has(r[1]))return;let i=idx.get(sr[r[0]][0]);
      if(i==null){const x=sr[r[0]];i=CBT11.sr.length;CBT11.sr.push([x[0],x[1],x[2],x[3],x[4]]);idx.set(x[0],i);} /* ĐDKD mới chưa có tập KH combo: thêm để không mất KH nhận */
      const k=i+'|'+r[3];let a=acc.get(k);if(!a){a={kh:new Set(),su:0};acc.set(k,a);}a.kh.add(r[1]);a.su+=r[6];});
    const have=new Set();CBT11.rows.forEach(r=>{const k=r[0]+'|'+r[1],a=acc.get(k);have.add(k);r[6]=a?a.kh.size:0;r[7]=a?a.su:0;});
    acc.forEach((a,k)=>{if(have.has(k))return;const[i,g]=k.split('|').map(Number);CBT11.rows.push([i,g,0,0,0,0,a.kh.size,a.su,0,0,0]);});
    CBT11.meta=Object.assign({},CBT11.meta,{asof:COMBO11.meta.asof,asof_day:mx.d,combo_note:'KH nhận / suất cập nhật theo file combo '+COMBO11.meta.asof+'; Số KH, CTSO, DS MTD, KH mua, nhóm KH nhận giữ theo bản '+(ctx.CBT11.meta.asof||'')});}
  return {COMBO11,CBT11,info:`Combo: ${rows.length.toLocaleString('vi-VN')} đơn KH-ngày, ${promos.length} chương trình, đến ${COMBO11.meta.asof}`};
}

/* ===== HỘI VIÊN: file PERFORMANCE CHI TIẾT THEO NHÃN HÀNG (HỘI VIÊN) ===== */
function buildHV(aoa,ctx,asof){
  const c=cols(aoa[0],{sr:'SF_LV5_UID]',srn:'SF_LV5_FULLNAME]',ym:'YearMonthnumber]',kh:'OUTLET_CODE]',khn:'OUTLET_NAME]',mt:'MEMBER_TYPE]',cat:'[CAT]',sale2:'[SALE2]',newsale:'[newsale]',pend:'ORDER_NET_AMT_PENDING]',ql:'[QualifiedLevel]',pt:'[PointReward]',rw:'[rewardl3Value]',ctn:['[Chỉ_tiêu_nền]','[basesale]']});
  const SRM=srMap(ctx),sr=[],si=new Map(),K=new Map(),BR={'Chanté':10,'Chinsu':11,'Kokomi':12,'Nam Ngư':13};
  const vc=new Map(ctx.HVT11?ctx.HVT11.rows.map(r=>[String(r[1]),r[14]||0]):[]);let ym='';
  for(let i=1;i<aoa.length;i++){const r=aoa[i];if(!r||r[c.kh]==null||r[c.kh]==='')continue;ym=ym||String(r[c.ym]||'');
    const code=String(r[c.sr]);if(!si.has(code)){const x=SRM.get(code)||[code,r[c.srn],'Chưa gán SS','Chưa gán SS','Chưa gán SS'];si.set(code,sr.length);sr.push([code,r[c.srn]||x[1],x[2],x[3],x[4]]);}
    const kh=String(r[c.kh]);let a=K.get(kh);
    if(!a){a=[si.get(code),kh,String(r[c.khn]||''),/DAISU|ĐẠI SỨ/i.test(String(r[c.mt]))?1:0,0,num(r[c.newsale]),num(r[c.ctn]),0,0,0,0,0,0,0,vc.get(kh)||0];K.set(kh,a);}
    a[4]+=num(r[c.pend]);a[7]=Math.max(a[7],num(r[c.ql]));a[8]+=num(r[c.pt]);a[9]+=num(r[c.rw]);
    const bi=BR[String(r[c.cat]).trim()];if(bi!=null)a[bi]+=num(r[c.sale2]);}
  const rows=[...K.values()].map(a=>a.map((v,i)=>i>=4&&i!==7&&typeof v==='number'?Math.round(v):v));
  const m=(ym.match(/(\d{1,2})\/(\d{4})/)||[]);const mo=+m[1]||11,yr=+m[2]||2026;
  const d=asof?+String(asof).split('/')[0]:null;
  const HVT11={meta:Object.assign({asof:asof||null,y:yr,m:mo,src:'PERFORMANCE_CHI_TIẾT_THEO_NHÃN_HÀNG (HỘI VIÊN) · T'+mo+'/'+yr,cols:'sr,code,name,type,pend,ds,base,ql,pr,rw,b_chante,b_chinsu,b_kokomi,b_namngu,vipclass'},d?cal(yr,mo,d):{}),sr,rows};
  return {HVT11,info:`Hội viên: ${rows.length.toLocaleString('vi-VN')} KH${asof?', đến '+asof:''}`};
}

/* ===== TĂNG DOANH SỐ: file data tăng doanh số (MBS ONTOP) ===== */
function buildTDS(aoa,ctx,asof){
  const c=cols(aoa[0],{sr:'SF_LV5_UID]',srn:'SF_LV5_FULLNAME]',ym:'YearMonthnumber]',kh:'OUTLET_CODE]',khn:['MCP-MASTER[OUTLET]','OUTLET]'],desc:'[DESCRIPTION]',ql:'[QualifiedLevel]',ct:'[Chỉ_tiêu_doanh_số]',th:'[Doanh_số_thực_hiện__Paid___Invoiced_]',pt:'[Điểm_thưởng_dự_kiến__ONTOP_]'});
  const P=s=>/Bia/i.test(s)?3:/Chant/i.test(s)?1:/Mì|Mi\b/i.test(s)?0:/Cà phê|Ca phe/i.test(s)?2:-1;
  const SRM=srMap(ctx),sr=[],si=new Map(),rows=[],skip=new Map();let ym='';
  for(let i=1;i<aoa.length;i++){const r=aoa[i];if(!r||r[c.kh]==null||r[c.kh]==='')continue;ym=ym||String(r[c.ym]||'');
    const g=P(String(r[c.desc]||''));if(g<0){const k=String(r[c.desc]);skip.set(k,(skip.get(k)||0)+1);continue;}
    const code=String(r[c.sr]);if(!si.has(code)){const x=SRM.get(code)||[code,r[c.srn],'Chưa gán SS','Chưa gán SS','Chưa gán SS'];si.set(code,sr.length);sr.push([code,r[c.srn]||x[1]]);}
    rows.push([si.get(code),String(r[c.kh]),String(r[c.khn]||''),g,Math.round(num(r[c.ct])),Math.round(num(r[c.th])),num(r[c.ql]),Math.round(num(r[c.pt]))]);}
  const m=(ym.match(/(\d{1,2})\/(\d{4})/)||[]);const mo=+m[1]||11,yr=+m[2]||2026,d=asof?+String(asof).split('/')[0]:null;
  const TDS11={meta:Object.assign({asof:asof||null,y:yr,m:mo,src:'data tăng doanh số Miền (MBS ONTOP T'+mo+'/'+yr+')',progs:['mi','ch','cf','bia'],
    cols:'sri,mã KH,tên KH,ct(0 Mì/1 Chanté/2 Cà phê/3 Bia),DS nền,DS thực hiện,QualifiedLevel,điểm thưởng dự kiến'},d?cal(yr,mo,d):{}),sr,rows};
  const sk=[...skip].map(([k,v])=>k+' ('+v+' dòng)');
  return {TDS11,info:`Tăng DS: ${rows.length.toLocaleString('vi-VN')} lượt KH${asof?', đến '+asof:''}`+(sk.length?` · BỎ QUA chương trình chưa có trong tab: ${sk.join('; ')}`:'')};
}

const API={ymd,cal,cols,detect,srMap,buildCombo,buildHV,buildTDS};
if(typeof module!=='undefined'&&module.exports)module.exports=API; else root.MTLIB=API;
})(typeof window!=='undefined'?window:globalThis);
