/* Tô đỏ chỉ số thấp hơn mức Toàn Miền (cùng cột) cho các tab Tháng 11: ASM / NPP / SS / ĐDKD.
   Áp dụng cho cột %, cột chênh (pp, đ) và LPPC; không tô cột số tuyệt đối. Chạy lại mỗi khi bảng được vẽ lại. */
(function(){
  var TABS={t11:1,nv5:1,hs:1,spt:1,tb:1,hvt:1,tds:1,combo:1};
  var st=document.createElement('style');
  st.textContent='td.lowN{background:#FEE2E2!important;color:#B91C1C!important;font-weight:700!important}tr.tot td.lowN,tr.team td.lowN{background:#FECACA!important}';
  document.head.appendChild(st);
  var TOT=/^\s*(To[àa]n Mi[ềe]n|TOÀN MIỀN|TỔNG MIỀN|TỔNG\s*\(\d+\s*ĐDKD\))/i;
  var BAD=/chưa|thiếu|giảm|hụt|còn/i;
  function pv(t,pl){
    t=String(t==null?'':t).split('\n')[0].trim();
    var m=t.match(/^[▲▼▾▴↑↓\s]*([+−–-]?)\s*(\d[\d.]*(?:,\d+)?)\s*(%|pp|đ)(?:[\s(]|$)/);
    if(!m&&pl)m=t.match(/^()(\d+,\d+)()$/)||t.match(/→\s*()(\d+,\d+)()/);
    if(!m)return null;
    var x=parseFloat(m[2].replace(/\./g,'').replace(',','.'));
    return /[−–-]/.test(m[1])?-x:x;
  }
  function heads(tb){ // lưới tiêu đề (xử lý colspan/rowspan)
    var G=[],rows=tb.querySelectorAll('thead tr');
    rows.forEach(function(tr,ri){G[ri]=G[ri]||[];var c=0;
      Array.prototype.forEach.call(tr.children,function(th){while(G[ri][c]!==undefined)c++;
        var cs=+th.getAttribute('colspan')||1,rs=+th.getAttribute('rowspan')||1;
        for(var a=0;a<rs;a++){G[ri+a]=G[ri+a]||[];for(var b=0;b<cs;b++)G[ri+a][c+b]=th.innerText;}c+=cs;});});
    var out=[];G.forEach(function(r){r.forEach(function(t,j){out[j]=(out[j]||'')+' '+t;});});return out;
  }
  function mark(c,on){
    var tot=c.parentElement.classList.contains('tot');
    var els=[c].concat(Array.prototype.slice.call(c.querySelectorAll('*')));
    els.forEach(function(e){
      if(on){
        if(e!==c){var bg=getComputedStyle(e).backgroundColor;if(!bg||bg==='rgba(0, 0, 0, 0)'||bg==='transparent'){e.style.setProperty('color','#B91C1C','important');e.style.setProperty('font-weight','700','important');return;}}
        e.style.setProperty('background','#FEE2E2','important');e.style.setProperty('color','#B91C1C','important');e.style.setProperty('font-weight','700','important');
      }else if(c.classList.contains('lowN')){e.style.removeProperty('background');e.style.removeProperty('color');e.style.removeProperty('font-weight');}
    });
    if(on){c.classList.add('lowN');}else c.classList.remove('lowN');
  }
  function run(){
    var on=document.querySelector('#nav2 button.on');var k=on&&on.dataset.k;if(!TABS[k])return;
    document.querySelectorAll('table').forEach(function(tb){
      if(!tb.offsetParent)return;
      var body=tb.tBodies[0];if(!body)return;
      var rows=Array.prototype.slice.call(body.rows);
      var tot=rows.filter(function(r){return r.classList.contains('tot')&&r.cells.length>3&&TOT.test(r.cells[0].innerText);})[0];
      if(!tot)return;
      var H=heads(tb),nc=tot.cells.length,need=[];
      for(var j=1;j<nc;j++){
        var h=H[j]||'',pl=/LPPC/i.test(h);
        if(BAD.test(h)){need[j]=null;continue;}
        var v=pv(tot.cells[j].innerText,pl);
        need[j]=v==null?null:{v:v,pl:pl};
      }
      rows.forEach(function(r){
        if(r===tot||r.cells.length!==nc)return;
        for(var j=1;j<nc;j++){var n=need[j];if(!n)continue;var c=r.cells[j];
          var x=pv(c.innerText,n.pl);
          mark(c,x!=null&&x<n.v-1e-9);}
      });
    });
  }
  var tm=null;function sch(){clearTimeout(tm);tm=setTimeout(run,120);}
  new MutationObserver(sch).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',sch,true);
  setTimeout(run,800);
})();
