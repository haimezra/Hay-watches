// Site is Hebrew-only. Force Hebrew and clear any previously saved language preference.
document.documentElement.lang = 'he';
document.documentElement.dir = 'rtl';
try{ localStorage.removeItem('hay_lang'); }catch(e){}

function qs(name){
  return new URLSearchParams(window.location.search).get(name);
}

// Product photos come only from the catalog (data.js). Visitors can NOT add photos.
// Clear any photos that were stored locally by the old upload feature.
try{
  Object.keys(localStorage).filter(k => k.indexOf('hay_photos:') === 0).forEach(k => localStorage.removeItem(k));
}catch(e){}

function bestProductImg(p){ return p.img || null; }

// ===== Image protection: no drag, no long-press save menu, no right-click on images =====
document.addEventListener('dragstart', function(e){
  if(e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO')) e.preventDefault();
});
document.addEventListener('contextmenu', function(e){
  if(e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO')) e.preventDefault();
});
document.addEventListener('selectstart', function(e){
  if(e.target && e.target.tagName === 'IMG') e.preventDefault();
});

function toggleMobileMenu(){
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('mobileMenuBtn');
  if(!nav) return;
  const open = nav.classList.toggle('open');
  if(btn) btn.textContent = open ? '✕' : '☰';
}

// ===== Header music toggle (home page only) =====
(function(){
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  if(!btn || !audio) return;
  const playIcon = document.getElementById('musicPlayIcon');
  const stopIcon = document.getElementById('musicStopIcon');
  btn.addEventListener('click', function(){
    if(audio.paused){
      audio.play().catch(function(){});
      btn.setAttribute('aria-pressed','true');
      playIcon.style.display = 'none';
      stopIcon.style.display = '';
    } else {
      audio.pause();
      btn.setAttribute('aria-pressed','false');
      playIcon.style.display = '';
      stopIcon.style.display = 'none';
    }
  });
})();
