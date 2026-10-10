/* HAY Watches — inspiration slider under the 3D gift box (gifts.html). RTL-aware scroll-snap carousel. */
(function(){
  var track=document.getElementById('ggTrack'); if(!track) return;
  var prev=document.getElementById('ggPrev'), next=document.getElementById('ggNext'), dotsBox=document.getElementById('ggDots');
  var slides=[].slice.call(track.querySelectorAll('.gg-slide')), dots=[], idx=0;
  var rtl=function(){ return getComputedStyle(track).direction==='rtl'; };
  var step=function(){ var gap=parseFloat(getComputedStyle(track).columnGap)||0; return slides[0].offsetWidth+gap; };
  var atEnd=function(){ return Math.abs(track.scrollLeft)>=track.scrollWidth-track.clientWidth-2; };

  slides.forEach(function(sl,i){
    var d=document.createElement('button'); d.type='button'; d.className='gg-dot'; d.setAttribute('role','tab');
    d.setAttribute('aria-label','תמונה '+(i+1)+' מתוך '+slides.length);
    d.addEventListener('click',function(){ go(i); }); dotsBox.appendChild(d); dots.push(d);
  });
  function go(i){
    i=Math.max(0,Math.min(slides.length-1,i));
    track.scrollTo({left:(rtl()?-1:1)*i*step(),behavior:'smooth'});
  }
  function sync(){
    var i=Math.round(Math.abs(track.scrollLeft)/step());
    if(atEnd()) i=slides.length-1;
    idx=Math.max(0,Math.min(slides.length-1,i));
    dots.forEach(function(d,k){ d.setAttribute('aria-selected',k===idx?'true':'false'); });
    prev.disabled=Math.abs(track.scrollLeft)<=2; next.disabled=atEnd();
  }
  prev.addEventListener('click',function(){ go(idx-1); });
  next.addEventListener('click',function(){ go(idx+1); });
  var t; track.addEventListener('scroll',function(){ clearTimeout(t); t=setTimeout(sync,40); },{passive:true});
  window.addEventListener('resize',sync);
  /* the sticky 3D stage listens for drags on its own element only, so swiping here never rotates the box */
  sync();
})();
