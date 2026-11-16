/* Layout 4 · chỉ ẩn thành phần trùng lặp, không đụng dữ liệu */
(function(){
  function tidy(){
    var c=document.getElementById('v3chips');
    if(c)c.querySelectorAll('.chip').forEach(function(e){
      if(e.children.length)return;
      var keep=/MTD/.test(e.textContent);
      e.style.display=keep?'':'none';
    });
    var cur=document.getElementById('mxcur');
    if(cur){var s=cur.querySelector('small'),b=cur.textContent.replace(s?s.textContent:'','').trim();
      if(s&&/^· Tháng 11/.test(s.textContent)&&/^Tháng 11/.test(b))s.style.display='none';else if(s)s.style.display='';}
    var bt=document.querySelectorAll('.hdrbtns .themebtn');
    bt.forEach(function(b){if(!b.title)b.title=b.textContent.trim();});
  }
  var t;function q(){clearTimeout(t);t=setTimeout(tidy,40);}
  function init(){tidy();new MutationObserver(q).observe(document.body,{childList:true,subtree:true,characterData:true});}
  if(document.readyState!=='loading')init();else document.addEventListener('DOMContentLoaded',init);
})();
