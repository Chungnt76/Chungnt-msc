/* Gói các mục (.sec) của 3 tab Hội viên Tết · Tăng doanh số · Combo thành .panel để có nút Tập trung / Trình chiếu như các tab khác */
(function(){
  const ROOTS=['hvv11','tdsv11','cbv11'];
  function panelize(root){
    const kids=[...root.children]; if(!kids.length||kids.every(c=>c.classList.contains('panel')))return;
    const groups=[]; let cur=null;
    kids.forEach(c=>{ if(c.classList.contains('panel')){groups.push({el:c});cur=null;return;}
      if(!cur||c.classList.contains('sec')){cur={items:[]};groups.push(cur);} cur.items.push(c);});
    groups.forEach(g=>{ if(g.el||!g.items.length)return; const p=document.createElement('div'); p.className='panel'; p.style.position='relative'; g.items[0].before(p); g.items.forEach(x=>p.appendChild(x)); });
    if(window.v2AddFocus)try{window.v2AddFocus();}catch(e){}
  }
  function watch(){ROOTS.forEach(id=>{const r=document.getElementById(id); if(!r||r._pnz)return; r._pnz=1; new MutationObserver(()=>panelize(r)).observe(r,{childList:true}); panelize(r);});}
  window.addEventListener('load',()=>setTimeout(watch,400)); if(document.readyState==='complete')setTimeout(watch,400);
})();
