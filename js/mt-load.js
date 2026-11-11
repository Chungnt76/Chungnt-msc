/* NẠP FILE EXCEL MỚI cho 3 tab Hội viên Tết · Tăng doanh số · Combo (ngay trên trang chính)
   - Đọc file Excel xuất Power BI bằng SheetJS (lib/xlsx.full.min.js, tải khi bấm nút)
   - Dựng dữ liệu bằng js/mt-lib.js, cập nhật TẠI CHỖ các biến CBT11 / COMBO11 / HVT11 / TDS11 (các tab khác dùng chung thấy số mới)
   - "Tải dữ liệu cập nhật" → file .zip chứa data/*.js mới để up đè lên GitHub (link giữ nguyên) */
(function(){
const $=id=>document.getElementById(id);
const PAGES=[['pgHvt','hvv11','renderHvt'],['pgTds','tdsv11','renderTds'],['pgCombo','cbv11','renderCombo']];
const HEAD={CBT11:'/* Combo tracking T11: [sri,g,nKH,ctso,dsMTD,KHmua,KHnhan,suat,ctsoNhom,dsNhom,dsDonCombo] — KHnhan/suat cập nhật theo file combo mới */',
  COMBO11:'/* Combo T11 — 1 dòng = (KH, ngày, mã CT): [srIdx, mã KH, tên KH, nhóm(0 OFF/1 ON/2 NHÀ HÀNG), idx CT, ngày, suất, SL mua, DS, trong tuyến(1/0)] */',
  HVT11:'/* Hội viên Tết T11 — 1 dòng = KH: [sri, mã KH, tên, loại(0 VIP/1 Đại sứ), đơn chờ, DS newsale, chỉ tiêu nền, QL, point, reward, Chanté, Chinsu, Kokomi, Nam Ngư (SALE2), type] */',
  TDS11:'/* Tăng doanh số T11 (gắn kết ONTOP) — 1 dòng = KH × CT: [sri, mã KH, tên KH, ct(0 Mì/1 Chanté/2 Cà phê/3 Bia), DS nền, DS thực hiện, QualifiedLevel, điểm thưởng dự kiến] */'};
const RAW={}, CHANGED=new Set();
const G=k=>{try{return eval(k);}catch(e){return undefined;}}; /* đọc biến const toàn cục */

function css(){if($('mtlCss'))return;const s=document.createElement('style');s.id='mtlCss';s.textContent=`
.mtl{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;margin:4px 0 12px;padding:10px 14px;border:1px dashed #94a3b8;border-radius:12px;background:#f8fafc;font-size:12.5px;color:#475569}
.mtl button{border:1px solid #cfd6e6;background:#fff;color:#1f2a44;border-radius:8px;padding:7px 12px;font-weight:700;font-size:12.5px;cursor:pointer}
.mtl button.pri{background:#f2c200;border-color:#e0b400;color:#10183a}.mtl button.go{background:#16a34a;border-color:#16a34a;color:#fff}
.mtl .st b{color:#1c3fb5}.mtl .dirty{color:#b45309;font-weight:800}
:root[data-theme="dark"] .mtl{background:#111827;border-color:#334155;color:#cbd5e1}:root[data-theme="dark"] .mtl button{background:#1f2937;color:#e2e8f0;border-color:#334155}
.mtl-toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);max-width:min(760px,92vw);background:#10183a;color:#fff;border-radius:12px;padding:12px 18px;font-size:13px;line-height:1.55;box-shadow:0 10px 30px rgba(0,0,0,.35);z-index:9999;display:none}
.mtl-toast.on{display:block}.mtl-toast.err{background:#7f1d1d}`;document.head.appendChild(s);}
function toast(msg,err){let t=$('mtlToast');if(!t){t=document.createElement('div');t.id='mtlToast';t.className='mtl-toast';document.body.appendChild(t);}
  t.innerHTML=msg;t.className='mtl-toast on'+(err?' err':'');clearTimeout(t._t);if(!/Đang/.test(msg))t._t=setTimeout(()=>t.className='mtl-toast',err?14000:9000);}
function stampHtml(){const c=(G('COMBO11')||{}).meta||{},h=(G('HVT11')||{}).meta||{},t=(G('TDS11')||{}).meta||{};
  return `Dữ liệu: Combo đến <b>${c.asof||'–'}</b> · Hội viên đến <b>${h.asof||'10/11'}</b> · Tăng DS đến <b>${t.asof||'–'}</b>`+(CHANGED.size?` · <span class="dirty">đã nạp số mới (${[...CHANGED].join(', ')}) – bấm “Tải dữ liệu cập nhật” rồi up lên GitHub để link lưu số mới</span>`:'');}
function bar(){
  css();
  PAGES.forEach(([pg,box])=>{const P=$(pg),B=$(box);if(!P||!B)return;let el=P.querySelector('.mtl');
    if(!el){el=document.createElement('div');el.className='mtl';B.parentNode.insertBefore(el,B);
      el.innerHTML=`<button type="button" class="pri" data-mtl="load" title="File PROMOTION - OUTLET DETAIL (combo) · PERFORMANCE hội viên · data tăng doanh số — chọn 1 hoặc nhiều file">⇪ Nạp file Excel mới</button><button type="button" class="go" data-mtl="save" title="Tải .zip chứa data/*.js mới để up đè lên GitHub">⤓ Tải dữ liệu cập nhật</button><span class="st"></span>`;
      el.addEventListener('click',e=>{const b=e.target.closest('[data-mtl]');if(!b)return;if(b.dataset.mtl==='load')pick();else save();});}
    el.querySelector('.st').innerHTML=stampHtml();});
}
function pick(){let f=$('mtlFile');if(!f){f=document.createElement('input');f.type='file';f.id='mtlFile';f.accept='.xlsx,.xls';f.multiple=true;f.hidden=true;document.body.appendChild(f);
  f.onchange=e=>{run([...e.target.files]);e.target.value='';};}f.click();}
function needXlsx(){return new Promise((ok,ko)=>{if(window.XLSX&&XLSX.read&&XLSX.utils&&XLSX.utils.sheet_to_json&&XLSX.version&&window.__mtlFull)return ok();
  const s=document.createElement('script');s.src='lib/xlsx.full.min.js?v=0185';s.onload=()=>{window.__mtlFull=1;ok();};s.onerror=()=>ko(new Error('Không tải được lib/xlsx.full.min.js'));document.head.appendChild(s);});}
function askDate(kind){const d=new Date(Date.now()-864e5),def=String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0');
  const v=prompt(`File ${kind} không ghi ngày cắt dữ liệu.\nNhập ngày dữ liệu (dd/mm):`,def);
  return v&&/^\d{1,2}\/\d{1,2}$/.test(v.trim())?v.trim().split('/').map(x=>x.padStart(2,'0')).join('/'):def;}
/* thay nội dung object const tại chỗ */
function put(name,src){const t=G(name);if(!t)return;Object.keys(t).forEach(k=>delete t[k]);Object.assign(t,JSON.parse(JSON.stringify(src)));RAW[name]=src;CHANGED.add(name);}
/* chuẩn hóa như lúc tải trang: ASM/NPP/SS cho ĐDKD mới; loại KH hội viên khỏi đơn combo */
function fix(){const CB=G('CBT11'),CO=G('COMBO11'),HV=G('HVT11');const m=new Map((CB?CB.sr:[]).map(x=>[String(x[0]),x]));
  [CO,HV,G('TDS11')].forEach(D=>{if(!D||!D.sr)return;D.sr.forEach(x=>{if(x.length>=5&&x[2]==='Chưa gán SS'){const y=m.get(String(x[0]));if(y&&y[2]&&y[2]!=='Chưa gán SS'){x[2]=y[2];x[3]=y[3];x[4]=y[4];}}});});
  if(CO&&HV&&CHANGED.has('COMBO11')){const hs=new Set(HV.rows.map(r=>String(r[1])));CO.rows=CO.rows.filter(r=>!hs.has(String(r[1])));CO.__nohv=1;}}
async function run(files){
  if(!files.length)return;const log=[];
  try{toast('Đang tải công cụ đọc Excel…');await needXlsx();}catch(e){return toast(e.message,true);}
  for(const f of files){
    try{toast(`Đang đọc <b>${f.name}</b>…`);await new Promise(r=>setTimeout(r,30));
      const wb=XLSX.read(new Uint8Array(await f.arrayBuffer()),{type:'array',dense:true}),sh=wb.Sheets[wb.SheetNames.find(n=>/^Export$/i.test(n))||wb.SheetNames[0]];
      const aoa=XLSX.utils.sheet_to_json(sh,{header:1,raw:true,blankrows:false}),kind=MTLIB.detect(aoa[0]||[]);
      const ctx={CBT11:RAW.CBT11||G('CBT11'),COMBO11:RAW.COMBO11||G('COMBO11'),HVT11:RAW.HVT11||G('HVT11'),TDS11:RAW.TDS11||G('TDS11')};
      if(kind==='combo'){const r=MTLIB.buildCombo(aoa,ctx);put('COMBO11',r.COMBO11);if(r.CBT11)put('CBT11',r.CBT11);log.push('✔ '+r.info);}
      else if(kind==='hv'){const r=MTLIB.buildHV(aoa,ctx,askDate('hội viên'));put('HVT11',r.HVT11);log.push('✔ '+r.info);}
      else if(kind==='tds'){const r=MTLIB.buildTDS(aoa,ctx,askDate('tăng doanh số'));put('TDS11',r.TDS11);log.push('✔ '+r.info);}
      else log.push(`✖ ${f.name}: không nhận ra loại file (cần PROMOTION - OUTLET DETAIL, PERFORMANCE hội viên hoặc data tăng doanh số)`);
    }catch(e){console.error(e);log.push(`✖ ${f.name}: ${e.message}`);}
  }
  fix(); window.__mtv=(window.__mtv||0)+1; bar();
  PAGES.forEach(([pg,,fn])=>{const P=$(pg);if(P&&!P.hidden&&window[fn])window[fn]();});
  const ok=log.some(x=>x[0]==='✔');
  toast(log.join('<br>')+(ok?'<br>Số trên trang đã đổi (chỉ trên máy này). Bấm <b>⤓ Tải dữ liệu cập nhật</b> rồi up thư mục <b>data</b> trong file .zip lên GitHub để link lưu số mới.':''),!ok);
}
function b64(u8){let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s);}
function save(){
  if(!CHANGED.size)return toast('Chưa nạp file mới nào. Bấm <b>⇪ Nạp file Excel mới</b> trước.',true);
  const files={},en=s=>fflate.strToU8(s);
  CHANGED.forEach(k=>{const z=b64(fflate.zlibSync(fflate.strToU8(JSON.stringify(RAW[k])),{level:9}));files['data/'+k+'.js']=en(HEAD[k]+'\nconst '+k+' = __z("'+z+'");\n');});
  files['HUONG_DAN_UP_GITHUB.txt']=en('Up lên GitHub repo chungnt76/Chungnt-msc:\n1. Giải nén file .zip này.\n2. Vào repo → mở thư mục data → Add file → Upload files → kéo thả các file trong thư mục data của gói ('+[...CHANGED].map(k=>k+'.js').join(', ')+').\n3. Bấm Commit changes. Chờ 1-2 phút, mở link, bấm Ctrl+F5.\nLink giữ nguyên, chỉ thay số.\n');
  const d=new Date(),tag=String(d.getDate()).padStart(2,'0')+'-'+String(d.getMonth()+1).padStart(2,'0');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([fflate.zipSync(files,{level:0})],{type:'application/zip'}));a.download='Cap_nhat_du_lieu_T11_'+tag+'.zip';a.click();
  toast('Đã tải <b>'+a.download+'</b>. Up các file trong thư mục <b>data</b> lên đúng thư mục data của repo GitHub (đè file cũ).');
}
/* gắn thanh nạp file mỗi lần mở 1 trong 3 tab */
['renderHvt','renderTds','renderCombo'].forEach(fn=>{const o=window[fn];if(typeof o!=='function')return;window[fn]=function(){const r=o.apply(this,arguments);try{bar();}catch(e){}return r;};});
window.MTLOAD={run,save};
})();
