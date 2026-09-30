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

  // Privacy-policy consent checkbox (required before sending)
  const consent = document.createElement('label');
  consent.style.cssText = 'display:flex;align-items:flex-start;gap:8px;margin-top:12px;font-size:.85rem;line-height:1.5;cursor:pointer;';
  consent.innerHTML = '<input type="checkbox" id="nlConsent" style="margin-top:3px;flex:none;width:16px;height:16px;accent-color:#9b6ef3;cursor:pointer;">' +
    '<span>קראתי ואני מאשר/ת את <a href="index.html#policy" target="_blank" rel="noopener" style="text-decoration:underline;">מדיניות הפרטיות</a> ומסכים/ה לקבל עדכונים למייל.</span>';
  form.insertAdjacentElement('afterend', consent);
  const cb = consent.querySelector('input');

  const note = document.createElement('div');
  note.setAttribute('role', 'status');
  note.style.cssText = 'margin-top:12px;font-size:.95rem;min-height:1.4em;display:flex;align-items:center;gap:8px;';
  consent.insertAdjacentElement('afterend', note);

  let sending = false;
  function sync(){
    btn.disabled = sending || !cb.checked;
    btn.style.opacity = btn.disabled ? '.5' : '';
    btn.style.cursor = btn.disabled ? 'not-allowed' : '';
  }
  cb.addEventListener('change', function(){
    if(cb.checked && note.dataset.kind === 'consent'){ note.textContent = ''; note.dataset.kind = ''; }
    sync();
  });
  sync();

  const CHECK = '<span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#2e9e5b;color:#fff;font-size:14px;font-weight:700;flex:none;">✓</span>';
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const email = (input.value || '').trim();
    if(!email) return;
    if(!cb.checked){
      note.dataset.kind = 'consent';
      note.style.color = '#e07a7a';
      note.textContent = 'כדי להירשם יש לאשר את מדיניות הפרטיות.';
      return;
    }
    sending = true; sync();
    note.dataset.kind = '';
    note.style.color = '';
    note.textContent = 'שולח...';
    const ctrl = new AbortController();
    const timer = setTimeout(function(){ ctrl.abort(); }, 15000);
    try{
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        signal: ctrl.signal,
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({
          access_key: '95b8a106-1310-471e-be43-03182c258c41',
          subject: 'הרשמה חדשה לניוזלטר VIP',
          from_name: 'HAY Watches',
          name: 'מנוי ניוזלטר',
          email: email,
          message: 'הרשמה חדשה לניוזלטר VIP\nאימייל: ' + email + '\nאישור מדיניות פרטיות: כן'
        })
      });
      let j = null;
      try{ j = await r.clone().json(); }catch(_){}
      if(!r.ok || !j || j.success !== true) throw new Error('HTTP ' + r.status + ' ' + ((j && j.message) || ''));
      note.style.color = '#7fd18b';
      note.innerHTML = CHECK + '<span>תודה! הפרטים נקלטו בהצלחה.</span>';
      form.reset();
      cb.checked = false;
    }catch(err){
      note.style.color = '#e07a7a';
      note.textContent = 'משהו השתבש. נסו שוב או כתבו לנו ל-info@haywatches.co.il';
      if(/[?&]ucdebug=1/.test(location.search)){
        const d = document.createElement('div');
        d.dir = 'ltr';
        d.style.cssText = 'font:12px monospace;color:#bbb;margin-top:6px;word-break:break-all;';
        d.textContent = 'DEBUG: ' + String(err && (err.name + ': ' + err.message));
        note.appendChild(d);
      }
    }finally{
      clearTimeout(timer);
      sending = false; sync();
    }
  });
});
