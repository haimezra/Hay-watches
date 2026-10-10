/* HAY Watches — gift box inspiration slider (homepage teaser). RTL-aware scroll-snap carousel; works for every [data-slider]. */
(function(){
  [].forEach.call(document.querySelectorAll('[data-slider]'),function(root){
    var track=root.querySelector('.hs-track'), prev=root.querySelector('[data-prev]'), next=root.querySelector('[data-next]'), dotsBox=root.querySelector('.hs-dots');
    var slides=[].slice.call(track.querySelectorAll('.hs-slide')), dots=[], idx=0;
    if(!slides.length) return;
    var rtl=function(){ return getComputedStyle(track).direction==='rtl'; };
    var step=function(){ var gap=parseFloat(getComputedStyle(track).columnGap)||0; return slides[0].offsetWidth+gap; };
    var atEnd=function(){ return Math.abs(track.scrollLeft)>=track.scrollWidth-track.clientWidth-2; };
    slides.forEach(function(sl,i){
      var d=document.createElement('button'); d.type='button'; d.className='hs-dot'; d.setAttribute('role','tab');
      d.setAttribute('aria-label',(i+1)+' / '+slides.length);
      d.addEventListener('click',function(){ go(i); }); dotsBox.appendChild(d); dots.push(d);
    });
    function go(i){ i=Math.max(0,Math.min(slides.length-1,i)); track.scrollTo({left:(rtl()?-1:1)*i*step(),behavior:'smooth'}); }
    function sync(){
      var i=Math.round(Math.abs(track.scrollLeft)/step()); if(atEnd()) i=slides.length-1;
      idx=Math.max(0,Math.min(slides.length-1,i));
      dots.forEach(function(d,k){ d.setAttribute('aria-selected',k===idx?'true':'false'); });
      if(prev) prev.disabled=Math.abs(track.scrollLeft)<=2; if(next) next.disabled=atEnd();
    }
    if(prev) prev.addEventListener('click',function(){ go(idx-1); });
    if(next) next.addEventListener('click',function(){ go(idx+1); });
    var t; track.addEventListener('scroll',function(){ clearTimeout(t); t=setTimeout(sync,40); },{passive:true});
    window.addEventListener('resize',sync); sync();
  });

  /* ---- lightbox: click / Enter on a slide opens the full-size image ---- */
  var lb, lbImg, lbCap, lbCount, lbPrev, lbNext, list=[], cur=0, lastFocus=null;
  function build(){
    if(lb) return;
    lb=document.createElement('div'); lb.className='hs-lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true'); lb.setAttribute('aria-label','תמונה מוגדלת'); lb.hidden=true;
    lb.innerHTML='<button type="button" class="hs-lb-x" aria-label="סגירה">&times;</button>'+
      '<button type="button" class="hs-lb-n hs-lb-prev" aria-label="הקודם"></button>'+
      '<figure class="hs-lb-fig"><img alt="" draggable="false"><figcaption><span class="hs-lb-cap"></span><span class="hs-lb-count"></span></figcaption></figure>'+
      '<button type="button" class="hs-lb-n hs-lb-next" aria-label="הבא"></button>';
    document.body.appendChild(lb);
    lbImg=lb.querySelector('img'); lbCap=lb.querySelector('.hs-lb-cap'); lbCount=lb.querySelector('.hs-lb-count');
    lbPrev=lb.querySelector('.hs-lb-prev'); lbNext=lb.querySelector('.hs-lb-next');
    lb.addEventListener('wheel',function(e){ e.preventDefault(); },{passive:false});
    lb.querySelector('.hs-lb-x').addEventListener('click',close);
    lbPrev.addEventListener('click',function(e){ e.stopPropagation(); show(cur-1); });
    lbNext.addEventListener('click',function(e){ e.stopPropagation(); show(cur+1); });
    lb.addEventListener('click',function(e){ if(e.target===lb || e.target.classList.contains('hs-lb-fig')) close(); });
    var x0=null;
    lb.addEventListener('touchstart',function(e){ x0=e.touches.length===1?e.touches[0].clientX:null; },{passive:true});
    lb.addEventListener('touchend',function(e){
      if(x0===null) return; var dx=e.changedTouches[0].clientX-x0; x0=null;
      if(Math.abs(dx)>50) show(cur+(dx<0?1:-1)*(getComputedStyle(lb).direction==='rtl'?-1:1));
    },{passive:true});
  }
  function show(i){
    i=(i+list.length)%list.length; cur=i;
    var sl=list[i], im=sl.querySelector('img'), cap=sl.querySelector('figcaption');
    lbImg.src=sl.getAttribute('data-full')||im.src; lbImg.alt=im.alt;
    var tx=cap?(cap.innerText!==undefined?cap.innerText:cap.textContent):''; lbCap.textContent=tx.trim().replace(/\s*\n+\s*/g,' · '); lbCount.textContent=(i+1)+' / '+list.length;
  }
  function open(slides,i){
    build(); list=slides; lastFocus=document.activeElement;
    var rtl=getComputedStyle(document.documentElement).direction==='rtl';
    lbPrev.textContent=rtl?'\u203A':'\u2039'; lbNext.textContent=rtl?'\u2039':'\u203A';
    lb.hidden=false; show(i);
    lb.querySelector('.hs-lb-x').focus();
    document.addEventListener('keydown',onKey);
  }
  function close(){
    if(!lb||lb.hidden) return;
    lb.hidden=true; lbImg.removeAttribute('src');
    document.removeEventListener('keydown',onKey); if(lastFocus&&lastFocus.focus) lastFocus.focus();
  }
  function onKey(e){
    var rtl=getComputedStyle(document.documentElement).direction==='rtl';
    if(e.key==='Escape') close();
    else if(e.key==='ArrowRight') show(cur+(rtl?-1:1));
    else if(e.key==='ArrowLeft') show(cur+(rtl?1:-1));
    else if(e.key==='Tab'){ /* keep focus inside the dialog */
      var f=[].slice.call(lb.querySelectorAll('button')); var a=document.activeElement, k=f.indexOf(a);
      e.preventDefault(); f[(k+(e.shiftKey?-1:1)+f.length)%f.length].focus();
    }
  }
  [].forEach.call(document.querySelectorAll('[data-slider]'),function(root){
    var slides=[].slice.call(root.querySelectorAll('.hs-slide[data-full]')); /* only image galleries open the lightbox */
    slides.forEach(function(sl,i){
      sl.addEventListener('click',function(){ open(slides,i); });
      sl.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(slides,i); } });
    });
  });
})();
