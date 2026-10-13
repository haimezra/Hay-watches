/* HAY Watches - AI watch advisor (Tavus video agent). Shows a small chat button on every page,
   but ONLY when /api/tavus reports the integration is configured. The Tavus API key stays on the server. */
(function () {
  'use strict';
  if (window.__tvWidget) return; window.__tvWidget = true;

  var T = {
    he: {
      fab: 'דברו עם היועץ', title: 'יועץ HAY Watches', ai: 'בינה מלאכותית', close: 'סגירה', dialog: 'שיחת וידאו עם יועץ וירטואלי',
      introTitle: 'שיחת וידאו עם היועץ שלנו',
      introText: 'דמות בינה מלאכותית שמכירה את הקטלוג, האחריות והמשלוחים, ויכולה לעזור לבחור שעון, רצועה או מתנה.',
      introNote: 'השיחה בעברית, מוגבלת לכמה דקות, ונדרשת גישה למיקרופון (מצלמה אופציונלית). השיחה מעובדת על ידי Tavus.',
      start: 'התחלת שיחה', loading: 'מתחבר ליועץ…', again: 'שיחה חדשה', ended: 'השיחה הסתיימה. תודה שדיברתם איתנו!',
      busy: 'היועץ עסוק כרגע. נסו שוב בעוד כמה דקות, או כתבו לנו ב-WhatsApp.',
      fail: 'לא הצלחנו להתחבר ליועץ כרגע. אפשר לנסות שוב, או לכתוב לנו ב-WhatsApp.', wa: 'WhatsApp', min: 'דק׳'
    },
    en: {
      fab: 'Talk to our advisor', title: 'HAY Watches advisor', ai: 'AI', close: 'Close', dialog: 'Video chat with a virtual advisor',
      introTitle: 'Video chat with our advisor',
      introText: 'An AI character who knows our catalog, warranty and shipping, and can help you choose a watch, a strap or a gift.',
      introNote: 'The call is in English, limited to a few minutes, and needs microphone access (camera optional). Calls are processed by Tavus.',
      start: 'Start the chat', loading: 'Connecting to the advisor…', again: 'New chat', ended: 'The chat has ended. Thanks for talking with us!',
      busy: 'The advisor is busy right now. Please try again in a few minutes, or message us on WhatsApp.',
      fail: 'We could not connect to the advisor right now. You can try again or message us on WhatsApp.', wa: 'WhatsApp', min: 'min'
    }
  };
  var lang = function () { return document.documentElement.lang === 'en' ? 'en' : 'he'; };
  var t = function (k) { return T[lang()][k]; };

  var fab, panel, body, timerEl, titleEl, aiEl, closeBtn, conv = null, tick = null, state = 'intro';

  function css() {
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'tavus-widget.css?v=1'; document.head.appendChild(l);
  }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function waLink() { return '<a class="tv-wa" href="https://wa.me/97229999119" target="_blank" rel="noopener">' + t('wa') + '</a>'; }

  function mount() {
    css();
    fab = el('button', 'tv-fab',
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10.5l5-3v9l-5-3z"/></svg><span class="tv-fab-t"></span>');
    fab.type = 'button'; fab.setAttribute('aria-haspopup', 'dialog'); fab.setAttribute('aria-expanded', 'false');
    if (document.querySelector('.gb-bar')) fab.classList.add('tv-lift'); // keep clear of the gift builder's sticky bar

    panel = el('div', 'tv-panel'); panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'false');
    var head = el('div', 'tv-head');
    var tt = el('div', 'tv-title'); titleEl = el('b'); aiEl = el('span', 'tv-ai'); tt.appendChild(titleEl); tt.appendChild(aiEl);
    timerEl = el('span', 'tv-timer');
    closeBtn = el('button', 'tv-x', '&times;'); closeBtn.type = 'button';
    head.appendChild(tt); head.appendChild(timerEl); head.appendChild(closeBtn);
    body = el('div', 'tv-body'); body.setAttribute('aria-live', 'polite');
    panel.appendChild(head); panel.appendChild(body);
    document.body.appendChild(fab); document.body.appendChild(panel);

    fab.addEventListener('click', function () { panel.hidden ? open() : close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
    window.addEventListener('pagehide', function () { endCall(true); });
    labels(); intro();
  }

  function labels() {
    fab.querySelector('.tv-fab-t').textContent = t('fab'); fab.setAttribute('aria-label', t('fab'));
    titleEl.textContent = t('title'); aiEl.textContent = t('ai'); closeBtn.setAttribute('aria-label', t('close')); panel.setAttribute('aria-label', t('dialog'));
  }

  function open() { labels(); panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); fab.classList.add('tv-on'); if (state === 'intro') intro(); closeBtn.focus(); }
  function close() { endCall(false); panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); fab.classList.remove('tv-on'); intro(); }

  function setTimer(txt) { timerEl.textContent = txt || ''; }

  function intro() {
    state = 'intro'; setTimer('');
    body.innerHTML = '<div class="tv-msg"><h3>' + t('introTitle') + '</h3><p>' + t('introText') + '</p><p class="tv-note">' + t('introNote') + '</p>' +
      '<button type="button" class="tv-btn" data-tv="start">' + t('start') + '</button></div>';
    body.querySelector('[data-tv=start]').addEventListener('click', start);
  }
  function loading() { state = 'loading'; body.innerHTML = '<div class="tv-msg"><div class="tv-spin" aria-hidden="true"></div><p>' + t('loading') + '</p></div>'; }
  function message(text, withRetry) {
    state = 'msg'; setTimer('');
    body.innerHTML = '<div class="tv-msg"><p>' + text + '</p>' + (withRetry ? '<button type="button" class="tv-btn" data-tv="start">' + t('again') + '</button>' : '') + '<p>' + waLink() + '</p></div>';
    var b = body.querySelector('[data-tv=start]'); if (b) b.addEventListener('click', start);
  }

  function productId() {
    if (!/product(\.html)?$/.test(location.pathname)) return '';
    var m = /[?&]id=([^&]+)/.exec(location.search); return m ? decodeURIComponent(m[1]) : '';
  }

  function start() {
    loading();
    fetch('/api/tavus', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: lang(), product: productId() }) })
      .then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); })
      .then(function (r) {
        if (!r.j || !r.j.ok || !r.j.url) {
          var e = r.j && r.j.error; return message(e === 'busy' || e === 'too_many_requests' || e === 'daily_limit' ? t('busy') : t('fail'), e !== 'daily_limit');
        }
        live(r.j);
      })
      .catch(function () { message(t('fail'), true); });
  }

  function live(j) {
    conv = j.id; state = 'live';
    var f = document.createElement('iframe');
    f.className = 'tv-frame'; f.src = j.url; f.title = t('dialog');
    f.setAttribute('allow', 'camera; microphone; autoplay; fullscreen'); f.setAttribute('referrerpolicy', 'no-referrer');
    body.innerHTML = ''; body.appendChild(f);
    var left = parseInt(j.seconds, 10) || 300;
    var draw = function () { var m = Math.floor(left / 60), s = left % 60; setTimer(m + ':' + (s < 10 ? '0' : '') + s); };
    draw();
    tick = setInterval(function () {
      left -= 1; draw();
      if (left <= 0) { endCall(false); message(t('ended'), true); }
    }, 1000);
  }

  function endCall(unloading) {
    if (tick) { clearInterval(tick); tick = null; }
    var id = conv; conv = null;
    var f = body && body.querySelector('iframe'); if (f && !unloading) { f.src = 'about:blank'; f.remove(); }
    if (!id) return;
    var payload = JSON.stringify({ action: 'end', id: id });
    try {
      if (unloading && navigator.sendBeacon) navigator.sendBeacon('/api/tavus', new Blob([payload], { type: 'application/json' }));
      else fetch('/api/tavus', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(function () {});
    } catch (e) { /* nothing else to do */ }
  }

  fetch('/api/tavus', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) { if (j && j.enabled) { if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount); } })
    .catch(function () { /* integration off or offline: the button simply never appears */ });
})();
