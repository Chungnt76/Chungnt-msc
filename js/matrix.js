/* Giao diện ma trận: hàng dọc = Tab (nội dung), hàng ngang = Tháng phân tích.
   Thanh điều hướng mới thay cho dải tab ngang; bấm 1 ô (Tab × Tháng) sẽ đặt tháng và mở tab đó.
   Không đổi dữ liệu: chỉ gọi nút #fMonth và hàm window.v2go sẵn có. */
(function(){
  var MONTHS=[7,8,9,10,11];
  var GROUPS=[
    ['1 · MCP tracking',['ov','on7']],
    ['2 · Fundamental: Hiệu suất, PC, LPPC',['hs','pc','nv5']],
    ['3 · SO',['t11','so','cat','ap','spt','tb','r360']],
    ['4 · Tăng trưởng',['gr']],
    ['5 · Hội viên',['hv','hvt']],
    ['6 · Combo',['combo']],
    ['7 · Tăng doanh số',['tds']]];
  /* tháng có số liệu riêng cho từng tab (kiểm bằng cách đổi tháng và so nội dung tab) */
  var AV={t11:[11],nv5:[11],hs:[11],spt:[11],tb:[11],hvt:[11],tds:[11],combo:[11],
          ov:[7,8,9,10,11],so:[7,8,9,10,11],pc:[7,8,9,10,11],cat:[7,8,9,10,11],gr:[10],
          hv:[9,10],r360:[10,11],ap:[10,11],on7:[10]};
  var NOTE={gr:'10 tháng 2026 so với các năm trước',hv:'Hội viên Doanh nhân: T9 và T10',ap:'Chỉ tiêu E · HE · O quý 4',on7:'Số tháng 10 MTD',r360:'Review 360 theo tháng 10 và 11'};
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  function ready(f){if(document.getElementById('v3sticky')&&window.v2go)f();else setTimeout(function(){ready(f)},150);}
  ready(function(){
    var sticky=$('#v3sticky'), nav=$('#nav2'); if(!sticky||!nav)return;
    var info={}; $$('#nav2 button[data-k]').forEach(function(b){info[b.dataset.k]={t:b.textContent.trim(),ic:(b.querySelector('.ic')||{}).innerHTML||''};});

    var st=document.createElement('style'); st.textContent=
    '#nav2{display:none!important}.flt .fg:has(#fMonth){display:none!important}'+
    '#mx{position:relative;margin:0 0 8px}'+
    '#mxbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:6px 8px}'+
    '#mxbtn{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 14px;border-radius:9px;border:0;background:var(--sky);color:#fff;font:700 13px/1 inherit;cursor:pointer}'+
    '#mxbtn:hover{background:var(--sky7)}#mxbtn svg{width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'+
    '#mxcur{flex:1;min-width:160px;font-size:14px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '#mxcur .ic svg{width:16px;height:16px;stroke:var(--sky7);fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}'+
    '#mxcur small{font-weight:600;color:var(--muted);font-size:12px}'+
    '#mxm{display:flex;gap:4px}#mxm button{height:36px;min-width:52px;padding:0 12px;border-radius:9px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:700 13px/1 inherit;cursor:pointer}'+
    '#mxm button:hover:not(:disabled){border-color:var(--sky);color:var(--sky7)}'+
    '#mxm button.on{background:var(--sky7);border-color:var(--sky7);color:#fff}'+
    '#mxm button:disabled{opacity:.35;cursor:not-allowed;background:var(--chip)}'+
    '#mxp{position:absolute;left:0;top:calc(100% + 6px);z-index:1000;width:min(820px,calc(100vw - 24px));max-height:72vh;overflow:auto;background:var(--card);border:1px solid var(--line);border-radius:14px;box-shadow:0 18px 44px rgba(15,23,42,.22);padding:10px}'+
    '#mxp[hidden]{display:none}'+
    '#mxp table{width:100%;border-collapse:separate;border-spacing:0;font-size:13.5px}'+
    '#mxp thead th{position:sticky;top:-10px;z-index:2;background:var(--card);padding:8px 6px;text-align:center;font-size:12px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid var(--line)}'+
    '#mxp thead th:first-child{text-align:left;padding-left:10px}'+
    '#mxp thead th.cm{color:var(--sky7)}#mxp thead th small{display:block;font-size:10.5px;font-weight:600;letter-spacing:0;text-transform:none;color:var(--muted)}'+
    '#mxp tr.gh td{padding:12px 10px 4px;font-size:11px;font-weight:800;letter-spacing:.9px;text-transform:uppercase;color:var(--sky7)}'+
    '#mxp td{padding:3px 4px;border-bottom:1px solid var(--line);text-align:center}'+
    '#mxp td.rl{text-align:left;padding:0}'+
    '#mxp td.rl button{width:100%;display:flex;align-items:center;gap:9px;border:0;background:transparent;color:var(--ink);font:600 13.5px/1.2 inherit;padding:9px 10px;border-radius:8px;cursor:pointer;text-align:left}'+
    '#mxp td.rl button:hover{background:var(--chip)}#mxp tr.cur td.rl button{color:var(--sky7);font-weight:800;background:var(--skybg)}'+
    '#mxp td.rl .ic{display:inline-flex;width:16px;height:16px;flex:none}#mxp td.rl .ic svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}'+
    '#mxp .c{display:inline-flex;align-items:center;justify-content:center;width:100%;height:34px;border:0;border-radius:8px;background:transparent;cursor:pointer}'+
    '#mxp .c i{width:14px;height:14px;border-radius:50%;background:var(--sky4);display:block}'+
    '#mxp .c:hover{background:var(--skybg)}#mxp .c:hover i{background:var(--sky)}'+
    '#mxp .c.on{background:var(--sky7)}#mxp .c.on i{background:#fff}'+
    '#mxp .c.no{cursor:default;pointer-events:none}#mxp .c.no i{width:10px;height:2px;border-radius:2px;background:var(--line)}'+
    '#mxp .hint{font-size:12px;color:var(--muted);padding:8px 10px 2px}'+
    '@media(max-width:700px){#mxm button{min-width:44px;padding:0 8px}#mxcur{min-width:100%;order:3}}';
    document.head.appendChild(st);

    var mx=document.createElement('div'); mx.id='mx';
    mx.innerHTML='<div id="mxbar"><button type="button" id="mxbtn" aria-expanded="false" aria-controls="mxp"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>Bản đồ báo cáo</button><div id="mxcur"></div><div id="mxm" role="group" aria-label="Tháng phân tích"></div></div><div id="mxp" hidden></div>';
    sticky.insertBefore(mx,sticky.firstChild);

    var p=$('#mxp',mx);
    var h='<table><thead><tr><th>Tab (nội dung)</th>'+MONTHS.map(function(m){return '<th class="'+(m===11?'cm':'')+'">T'+m+'<small>'+(m===11?'MTD':'')+'</small></th>';}).join('')+'</tr></thead><tbody>';
    GROUPS.forEach(function(g){
      h+='<tr class="gh"><td colspan="'+(MONTHS.length+1)+'">'+g[0]+'</td></tr>';
      g[1].forEach(function(k){ if(!info[k])return;
        h+='<tr data-k="'+k+'"><td class="rl"><button type="button" data-row="'+k+'" title="'+(NOTE[k]||'')+'"><span class="ic">'+info[k].ic+'</span>'+info[k].t+'</button></td>'+
          MONTHS.map(function(m){var a=AV[k].indexOf(m)>=0;return '<td>'+(a?'<button type="button" class="c" data-k="'+k+'" data-m="'+m+'" aria-label="'+info[k].t+' tháng '+m+'" title="'+info[k].t+' · Tháng '+m+'"><i></i></button>':'<span class="c no"><i></i></span>')+'</td>';}).join('')+'</tr>';
      });
    });
    h+='</tbody></table><div class="hint">Chấm = có số liệu của tab ở tháng đó. Bấm chấm để mở tab và đổi tháng phân tích; bấm tên tab để giữ tháng đang chọn.</div>';
    p.innerHTML=h;

    function curTab(){var b=$('#nav2 button.on');return b?b.dataset.k:'ov';}
    function curMonth(){var b=$('#fMonth button.on');return b?+b.dataset.m:11;}
    function open(v){p.hidden=!v;$('#mxbtn').setAttribute('aria-expanded',v?'true':'false');}
    function pick(k,m){
      open(false);
      var mb=m&&$('#fMonth button[data-m="'+m+'"]');
      if(mb&&!mb.classList.contains('on'))mb.click();
      setTimeout(function(){window.v2go(k);update();var t=$('#v3sticky');if(t&&window.scrollY>t.offsetTop+200)window.scrollTo({top:t.offsetTop,behavior:'auto'});},70);
    }
    function defMonth(k){var a=AV[k],c=curMonth();return a.indexOf(c)>=0?c:(a.indexOf(11)>=0?11:a[a.length-1]);}
    function update(){
      var k=curTab(),m=curMonth(),a=AV[k]||MONTHS;
      $('#mxcur').innerHTML='<span class="ic">'+(info[k]?info[k].ic:'')+'</span>'+(info[k]?info[k].t:'')+'<small>· Tháng '+(a.indexOf(m)>=0?m:a[a.length-1])+(NOTE[k]?' · '+NOTE[k]:'')+'</small>';
      $('#mxm').innerHTML=MONTHS.map(function(x){var ok=a.indexOf(x)>=0,on=(a.indexOf(m)>=0?m:a[a.length-1])===x;return '<button type="button" data-m="'+x+'"'+(ok?'':' disabled')+(on?' class="on"':'')+'>T'+x+'</button>';}).join('');
      $$('#mxp tr[data-k]').forEach(function(r){r.classList.toggle('cur',r.dataset.k===k);});
      $$('#mxp .c[data-k]').forEach(function(c){c.classList.toggle('on',c.dataset.k===k&&+c.dataset.m===(a.indexOf(m)>=0?m:a[a.length-1]));});
    }
    mx.addEventListener('click',function(e){
      var t=e.target;
      if(t.closest('#mxbtn')){open(p.hidden);return;}
      var c=t.closest('.c[data-k]'); if(c){pick(c.dataset.k,+c.dataset.m);return;}
      var r=t.closest('button[data-row]'); if(r){pick(r.dataset.row,defMonth(r.dataset.row));return;}
      var mm=t.closest('#mxm button[data-m]'); if(mm&&!mm.disabled){pick(curTab(),+mm.dataset.m);return;}
    });
    document.addEventListener('click',function(e){if(!p.hidden&&!e.target.closest('#mx'))open(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!p.hidden){open(false);$('#mxbtn').focus();}});
    var mo=new MutationObserver(function(){update();});
    mo.observe(nav,{attributes:true,subtree:true,attributeFilter:['class']});
    var fm=$('#fMonth'); if(fm)mo.observe(fm,{attributes:true,subtree:true,attributeFilter:['class']});
    update();
  });
})();
