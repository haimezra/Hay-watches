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

// ===== Newsletter sign-up (footer form on every page) =====
document.querySelectorAll('form.newsletter').forEach(function(form){
  const input = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button[type="submit"]');
  const note = document.createElement('div');
  note.setAttribute('role', 'status');
  note.style.cssText = 'margin-top:10px;font-size:.9rem;min-height:1.2em;';
  form.appendChild(note);
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const email = (input.value || '').trim();
    if(!email) return;
    btn.disabled = true;
    note.style.color = '';
    note.textContent = 'שולח...';
    try{
      const r = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: email})
      });
      if(!r.ok) throw new Error('fail');
      note.style.color = '#7fd18b';
      note.textContent = 'תודה! נרשמת בהצלחה לניוזלטר.';
      form.reset();
    }catch(err){
      note.style.color = '#e07a7a';
      note.textContent = 'משהו השתבש. נסו שוב או כתבו לנו ל-info@haywatches.co.il';
    }
    btn.disabled = false;
  });
});
