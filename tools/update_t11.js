/* Cập nhật 3 tab Hội viên Tết · Tăng doanh số · Combo của trang chính bằng file Excel mới (dùng cho Claude).
   node tools/update_t11.js <thư mục repo> [--asof dd/mm] <file1.xlsx> [file2.xlsx ...]
   - Nhận loại file theo tiêu đề cột: PROMOTION - OUTLET DETAIL (combo) · PERFORMANCE CHI TIẾT THEO NHÃN HÀNG (HỘI VIÊN) · data tăng doanh số (MBS ONTOP)
   - Dựng dữ liệu bằng js/mt-lib.js (cùng logic với nút "Nạp file Excel mới" trên trang)
   - Ghi đè data/COMBO11.js + data/CBT11.js (combo), data/HVT11.js (hội viên), data/TDS11.js (tăng DS); đổi số ?v= trong index.html để trình duyệt tải bản mới
   - --asof: ngày dữ liệu cho file hội viên / tăng DS (file không ghi ngày). Combo tự lấy theo ORDER_DATE lớn nhất.
   Cần: npm i xlsx@0.18.5 */
const fs=require('fs'),path=require('path'),zlib=require('zlib'),XLSX=require('xlsx');
const a=process.argv.slice(2);if(!a.length){console.log('node tools/update_t11.js <repo> [--asof dd/mm] file1.xlsx ...');process.exit(1);}
const REPO=a.shift();let asof=null;const files=[];for(let i=0;i<a.length;i++){if(a[i]==='--asof')asof=a[++i];else files.push(a[i]);}
const L=require(path.resolve(REPO,'js/mt-lib.js'));
const HEAD={CBT11:'/* Combo tracking T11: [sri,g,nKH,ctso,dsMTD,KHmua,KHnhan,suat,ctsoNhom,dsNhom,dsDonCombo] — KHnhan/suat cập nhật theo file combo mới */',
  COMBO11:'/* Combo T11 — 1 dòng = (KH, ngày, mã CT): [srIdx, mã KH, tên KH, nhóm(0 OFF/1 ON/2 NHÀ HÀNG), idx CT, ngày, suất, SL mua, DS, trong tuyến(1/0)] */',
  HVT11:'/* Hội viên Tết T11 — 1 dòng = KH: [sri, mã KH, tên, loại(0 VIP/1 Đại sứ), đơn chờ, DS newsale, chỉ tiêu nền, QL, point, reward, Chanté, Chinsu, Kokomi, Nam Ngư (SALE2), type] */',
  TDS11:'/* Tăng doanh số T11 (gắn kết ONTOP) — 1 dòng = KH × CT: [sri, mã KH, tên KH, ct(0 Mì/1 Chanté/2 Cà phê/3 Bia), DS nền, DS thực hiện, QualifiedLevel, điểm thưởng dự kiến] */'};
const ld=k=>{const s=fs.readFileSync(path.join(REPO,'data',k+'.js'),'utf8');return JSON.parse(zlib.inflateSync(Buffer.from(s.match(/__z\("([^"]+)"\)/)[1],'base64')));};
const ctx={};['CBT11','COMBO11','HVT11','TDS11'].forEach(k=>ctx[k]=ld(k));
const changed=new Set();
for(const f of files){
  const wb=XLSX.read(fs.readFileSync(f),{type:'buffer',dense:true}),sh=wb.Sheets[wb.SheetNames.find(n=>/^Export$/i.test(n))||wb.SheetNames[0]];
  const aoa=XLSX.utils.sheet_to_json(sh,{header:1,raw:true,blankrows:false}),kind=L.detect(aoa[0]||[]);
  if(kind==='combo'){const r=L.buildCombo(aoa,ctx);ctx.COMBO11=r.COMBO11;changed.add('COMBO11');if(r.CBT11){ctx.CBT11=r.CBT11;changed.add('CBT11');}console.log('✔',path.basename(f),'→',r.info);}
  else if(kind==='hv'){if(!asof)console.log('⚠ thiếu --asof cho file hội viên');const r=L.buildHV(aoa,ctx,asof);ctx.HVT11=r.HVT11;changed.add('HVT11');console.log('✔',path.basename(f),'→',r.info);}
  else if(kind==='tds'){if(!asof)console.log('⚠ thiếu --asof cho file tăng DS');const r=L.buildTDS(aoa,ctx,asof);ctx.TDS11=r.TDS11;changed.add('TDS11');console.log('✔',path.basename(f),'→',r.info);}
  else console.log('✖',path.basename(f),': không nhận ra loại file');
}
const v=new Date().toISOString().replace(/\D/g,'').slice(0,12);
let idx=fs.readFileSync(path.join(REPO,'index.html'),'utf8');
changed.forEach(k=>{const z=zlib.deflateSync(Buffer.from(JSON.stringify(ctx[k])),{level:9}).toString('base64');
  fs.writeFileSync(path.join(REPO,'data',k+'.js'),HEAD[k]+'\nconst '+k+' = __z("'+z+'");\n');
  idx=idx.replace(new RegExp('data/'+k+'\\.js\\?v=\\d+'),'data/'+k+'.js?v='+v);});
if(changed.size)fs.writeFileSync(path.join(REPO,'index.html'),idx);
console.log('Đã ghi:',[...changed].map(k=>'data/'+k+'.js').join(', ')||'không có thay đổi',changed.size?'· index.html (đổi ?v=)':'');
