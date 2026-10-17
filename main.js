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

// ===== Keep the accessibility button on the same baseline as the cookie-settings button =====
// (fixes in-app browsers such as Facebook's, where the two floating buttons drift apart)
(function(){
  function align(){
    var ck = document.querySelector('.cky-btn-revisit-wrapper');
    if(!ck) return;
    var cr = ck.getBoundingClientRect();
    if(!cr.width || !cr.height) return;
    var kids = document.body.children;
    for(var i = 0; i < kids.length; i++){
      var el = kids[i];
      if(el === ck || ck.contains(el) || el.contains(ck)) continue;
      var cls = String(el.className || '');
      if(cls.indexOf('cky') > -1 || cls.indexOf('hay-wa') > -1) continue;
      var cs = getComputedStyle(el);
      if(cs.position !== 'fixed') continue;
      var r = el.getBoundingClientRect();
      if(r.width < 36 || r.width > 120 || r.height < 36 || r.height > 120) continue;
      if(r.left < window.innerWidth / 2 || r.bottom < window.innerHeight / 2) continue;
      var delta = cr.bottom - r.bottom;
      if(Math.abs(delta) < 2) continue;
      var b = parseFloat(cs.bottom);
      if(isNaN(b)) continue;
      el.style.setProperty('bottom', (b - delta) + 'px', 'important');
      el.style.setProperty('top', 'auto', 'important');
    }
  }
  var t = null;
  function soon(){ clearTimeout(t); t = setTimeout(align, 150); }
  window.addEventListener('load', function(){
    var n = 0;
    var iv = setInterval(function(){ align(); if(++n > 12) clearInterval(iv); }, 700);
  });
  window.addEventListener('resize', soon);
  window.addEventListener('orientationchange', soon);
  window.addEventListener('scroll', soon, {passive: true});
})();


// ===== Floating WhatsApp button (number comes from WHATSAPP_NUMBER in data.js) =====
(function(){
  try{
    if(typeof WHATSAPP_NUMBER === 'undefined') return;
    if(/(^|\/)(gifts|cart)(\.html)?$/.test(location.pathname)) return; // keep checkout/builder flows clear
    var a = document.createElement('a');
    a.className = 'hay-wa';
    a.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent('היי, אשמח לקבל פרטים נוספים');
    a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('aria-label', 'שלחו לנו הודעה בוואטסאפ');
    a.innerHTML = '<svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M16.04 4C9.4 4 4 9.38 4 16c0 2.1.55 4.15 1.6 5.96L4 28l6.22-1.63A12.04 12.04 0 0 0 16.04 28C22.66 28 28 22.62 28 16S22.66 4 16.04 4zm0 21.9c-1.8 0-3.56-.48-5.1-1.4l-.37-.22-3.7.97.99-3.6-.24-.38A9.85 9.85 0 0 1 6.1 16c0-5.47 4.46-9.9 9.94-9.9 5.47 0 9.9 4.43 9.9 9.9 0 5.46-4.43 9.9-9.9 9.9zm5.44-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.5.7.3 1.26.48 1.7.62.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/></svg>';
    document.body.appendChild(a);
    // Stack the button directly above the accessibility widget wherever the browser puts it
    // (Facebook / Instagram in-app browsers shift fixed elements, so a fixed offset made them overlap)
    function stack(){
      try{
        var W = window.innerWidth, H = window.innerHeight, x = W - 34, top = null;
        for(var y = H - 6; y > H * 0.4; y -= 12){
          var el = document.elementFromPoint(x, y);
          if(!el || el === document.body || el === document.documentElement) continue;
          if(el.closest && el.closest('.hay-wa')) continue;
          var n = el, found = null;
          while(n && n !== document.body && n !== document.documentElement){
            if(getComputedStyle(n).position === 'fixed'){ found = n; break; }
            n = n.parentElement;
          }
          if(!found && el.shadowRoot) found = el;               // widget living in a shadow root
          if(!found || String(found.className || '').indexOf('cky') > -1) continue;
          var r = found.getBoundingClientRect();
          if(r.width < 36 || r.width > 140 || r.height < 36 || r.height > 140) continue;
          if(top === null || r.top < top) top = r.top;
          y = r.top;                                             // keep looking above this element
        }
        if(top === null){ a.style.removeProperty('bottom'); return; }
        a.style.setProperty('bottom', Math.max(12, Math.round(H - top + 10)) + 'px', 'important');
      }catch(e){}
    }
    var st = null;
    function soonStack(){ clearTimeout(st); st = setTimeout(stack, 200); }
    var runs = 0, iv = setInterval(function(){ if(!document.hidden) stack(); if(++runs > 15) clearInterval(iv); }, 1000);
    window.addEventListener('load', soonStack);
    window.addEventListener('resize', soonStack);
    window.addEventListener('orientationchange', soonStack);
    window.addEventListener('scroll', soonStack, {passive: true});
    if(window.visualViewport) window.visualViewport.addEventListener('resize', soonStack);
    // Fade the button out while the footer is on screen so it never covers footer links
    var ft = document.querySelector('footer');
    if('IntersectionObserver' in window && ft){
      new IntersectionObserver(function(es){ a.classList.toggle('hide', es[0].isIntersecting); }, {threshold:0.05}).observe(ft);
    }
  }catch(e){}
})();


// ===== Customer reviews (renders only real entries from REVIEWS in data.js) =====
(function(){
  try{
    var sec = document.getElementById('reviews'), grid = document.getElementById('revGrid');
    if(!sec || !grid || typeof REVIEWS === 'undefined' || !REVIEWS.length) return;
    function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
    grid.innerHTML = REVIEWS.map(function(r){
      var n = Math.max(1, Math.min(5, +r.stars || 5));
      var meta = [r.source, r.date].filter(Boolean).map(esc).join(' · ');
      return '<figure class="rev-card"><div class="rev-stars" role="img" aria-label="' + n + ' מתוך 5">' + '★'.repeat(n) + '<span>' + '★'.repeat(5 - n) + '</span></div>' +
        '<blockquote>' + esc(r.text) + '</blockquote><figcaption><b>' + esc(r.name) + '</b>' + (meta ? '<span>' + meta + '</span>' : '') + '</figcaption></figure>';
    }).join('');
    sec.hidden = false;
  }catch(e){}
})();


// ===== Performance: only animate / play what is on screen =====
(function(){
  try{
    if(!('IntersectionObserver' in window)) return;
    // 1) Videos: play only while visible (autoplay videos otherwise keep decoding off-screen)
    var vio = new IntersectionObserver(function(es){
      es.forEach(function(e){
        var v = e.target;
        if(e.isIntersecting){ var pr = v.play(); if(pr && pr.catch) pr.catch(function(){}); }
        else { v.pause(); }
      });
    }, {rootMargin:'120px 0px', threshold:0.01});
    function watchVideos(root){
      (root || document).querySelectorAll('video').forEach(function(v){
        if(v.__hayWatched) return; v.__hayWatched = true;
        if(!v.classList.contains('hero-video')) v.preload = 'metadata';
        vio.observe(v);
      });
    }
    watchVideos();
    // videos injected later (magazine / category hero)
    new MutationObserver(function(){ watchVideos(); }).observe(document.body, {childList:true, subtree:true});

    // 2) Infinite CSS animations (shimmer headings, starfield button): pause when off-screen
    var aio = new IntersectionObserver(function(es){
      es.forEach(function(e){ e.target.classList.toggle('anim-off', !e.isIntersecting); });
    }, {rootMargin:'80px 0px'});
    document.querySelectorAll('.section-head h2, .gift-copy h2, .polish-sec h2, .gift-cta, .hero h1, .hero p').forEach(function(el){ aio.observe(el); });
  }catch(e){}
})();


/* Start the (deferred) hero videos only after the page has loaded, so the first paint isn't competing
   with a ~1MB download (noticeably faster in in-app browsers such as Facebook's). */
(function(){
  try{
    var c = navigator.connection || {};
    if(c.saveData || /(^|-)2g$/.test(c.effectiveType || '')) return;
    function start(){
      document.querySelectorAll('video[data-src]').forEach(function(v){
        if(v.getAttribute('src')) return;
        v.src = v.getAttribute('data-src'); v.load();
        var r = v.getBoundingClientRect();
        if(r.bottom > -120 && r.top < window.innerHeight + 120){ var p = v.play(); if(p && p.catch) p.catch(function(){}); }
      });
    }
    if(document.readyState === 'complete') setTimeout(start, 300);
    else window.addEventListener('load', function(){ setTimeout(start, 300); });
  }catch(e){}
})();
