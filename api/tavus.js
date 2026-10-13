// Vercel serverless function: starts / ends a Tavus CVI video conversation (the on-site AI watch advisor).
// The Tavus API key NEVER reaches the browser. The browser only receives the room URL.
//
// Required env vars (Vercel Project Settings > Environment Variables):
//   TAVUS_API_KEY            - API key from the Tavus developer portal
//   TAVUS_PAL_ID             - the persona ("PAL") id.  TAVUS_PERSONA_ID is accepted as an alias.
// Optional:
//   TAVUS_FACE_ID            - face/replica id; only needed if the persona has no default face. TAVUS_REPLICA_ID alias.
//   TAVUS_MAX_SECONDS        - hard cap for one conversation (default 300, max 900)
//   TAVUS_DAILY_LIMIT        - max conversations started per UTC day across the site (default 60)
//   ALLOWED_ORIGINS          - comma separated extra origins allowed to call this API

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const API = 'https://tavusapi.com/v2';
const ROOM_HOST = 'tavus.daily.co';

// ---- config ------------------------------------------------------------------------------------------------------
const clean = (v) => String(v == null ? '' : v).trim().replace(/^["']|["']$/g, '').trim();
function cfg() {
  const e = process.env;
  return {
    key: clean(e.TAVUS_API_KEY),
    pal: clean(e.TAVUS_PAL_ID || e.TAVUS_PERSONA_ID),
    face: clean(e.TAVUS_FACE_ID || e.TAVUS_REPLICA_ID),
    maxSeconds: Math.max(60, Math.min(900, parseInt(e.TAVUS_MAX_SECONDS, 10) || 300)),
    dailyLimit: Math.max(1, parseInt(e.TAVUS_DAILY_LIMIT, 10) || 60),
  };
}
const configured = (c) => !!(c.key && c.pal);

// ---- same-origin guard + tiny best-effort rate limits (per warm instance) --------------------------------------------
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').toLowerCase();
  const bare = (s) => String(s).toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
  const extra = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return origin === 'https://' + host || (bare(origin) === bare(host) && /^https:\/\//.test(origin)) || extra.includes(origin);
}
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 15 * 60 * 1000, max = 3;
  const arr = (hits.get(ip) || []).filter((t) => now - t < win);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 2000) for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > win) hits.delete(k);
  return arr.length > max;
}
let day = '', dayCount = 0;
function overDailyLimit(limit) {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) { day = today; dayCount = 0; }
  if (dayCount >= limit) return true;
  dayCount += 1; return false;
}

// ---- catalog (read from data.js, same approach as checkout.js) -------------------------------------------------
let DATA = null;
function data() {
  if (!DATA) {
    const src = fs.readFileSync(path.join(process.cwd(), 'data.js'), 'utf8');
    DATA = vm.runInNewContext(
      src + '\n;({ PRODUCTS, GIFT_BOXES: (typeof GIFT_BOXES !== "undefined" ? GIFT_BOXES : []), GIFT_EXTRAS: (typeof GIFT_EXTRAS !== "undefined" ? GIFT_EXTRAS : []) })',
      {}, { timeout: 1000 }
    );
  }
  return DATA;
}
const CAT = { men: 'שעוני גברים', women: 'שעוני נשים', straps: 'רצועות', accessories: 'אביזרים' };
const unavailable = (p) => p.sold === true || p.available === false;
const clip = (s, n) => String(s || '').replace(/\s+/g, ' ').slice(0, n);

function catalogText(focusId) {
  const d = data();
  const lines = [];
  for (const p of d.PRODUCTS) {
    const name = (p.name && (p.name.he || p.name.en)) || p.id;
    const state = unavailable(p) ? 'אזל מהמלאי' : 'במלאי';
    const cond = p.cond === 'used' ? 'יד שנייה' : 'חדש';
    lines.push(`- ${CAT[p.cat] || p.cat}: ${clip(name, 80)} | ${p.price} ₪ | ${cond} | ${state}${p.dHe ? ' | ' + clip(p.dHe, 140) : ''}`);
  }
  let out = 'קטלוג האתר (מחירים בשקלים):\n' + lines.join('\n');
  if (d.GIFT_BOXES.length) {
    out += '\n\nמארז מתנה: ניתן לבנות באתר מארז מתנה (עמוד "מתנות") מקופסה, שעון ותוספות. קופסאות: ' +
      d.GIFT_BOXES.map((b) => `${b.name} ${b.price} ₪`).join(', ') + '. ' +
      (d.GIFT_EXTRAS.length ? 'תוספות: ' + d.GIFT_EXTRAS.map((x) => `${x.he || x.id} ${x.price} ₪`).join(', ') + '.' : '');
  }
  if (focusId) {
    const p = d.PRODUCTS.find((x) => x.id === focusId);
    if (p) out += `\n\nהמבקר צופה כרגע בעמוד של: ${clip((p.name && p.name.he) || p.id, 80)} (${p.price} ₪, ${unavailable(p) ? 'אזל' : 'במלאי'}).`;
  }
  return out;
}

const POLICY = [
  'מדיניות האתר (רק מה שכתוב כאן, אסור להמציא מעבר לזה):',
  '- שעונים מקוריים בלבד, עם תעודת מקוריות. אין העתקים.',
  '- אחריות: שעון חדש - שנתיים אחריות יצרן. יד שנייה - תעודת בדיקה ו-6 חודשי אחריות על התנועה.',
  '- משלוח: חינם בהזמנה מעל 1,500 ₪, אחרת 45 ₪. שליח עד הבית, 2-4 ימי עסקים, עם מעקב.',
  '- החזרות: עד 14 יום מקבלת המוצר, במצב מקורי ועם כל האריזות והתעודות.',
  '- תשלום: כרטיס אשראי בסליקה מאובטחת, אפשר גם בתשלומים לפי מדיניות חברת האשראי.',
  '- יצירת קשר: טלפון ו-WhatsApp 02-9999119.',
].join('\n');

// ---- Tavus calls ----------------------------------------------------------------------------------------------
async function tavus(method, p, key, body) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const r = await fetch(API + p, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-api-key': key },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
    let json = null; try { json = await r.json(); } catch (e) { /* empty body */ }
    return { status: r.status, json };
  } finally { clearTimeout(t); }
}

const GREETING = {
  he: 'שלום! אני היועץ הווירטואלי של HAY Watches. מחפשים שעון, רצועה או מתנה? אשמח לעזור לכם לבחור.',
  en: 'Hi! I am the virtual advisor at HAY Watches. Looking for a watch, a strap or a gift? I would love to help you choose.',
};

async function startConversation(c, lang, focusId) {
  const language = lang === 'en' ? 'english' : 'hebrew';
  const context = [
    lang === 'en' ? 'Speak English with this visitor.' : 'דברו בעברית עם המבקר.',
    POLICY, catalogText(focusId),
  ].join('\n\n');
  const props = {
    max_call_duration: c.maxSeconds,
    participant_left_timeout: 20,
    participant_absent_timeout: 90,
    enable_closed_captions: true,
  };
  const common = { conversation_name: 'HAY Watches - site advisor', conversational_context: context, custom_greeting: GREETING[lang === 'en' ? 'en' : 'he'] };

  // Current API names first (pal_id / face_id / languages); fall back to the legacy names if the account rejects them.
  let r = await tavus('POST', '/conversations', c.key, Object.assign({}, common, { pal_id: c.pal }, c.face ? { face_id: c.face } : {}, { properties: Object.assign({}, props, { languages: [lang === 'en' ? 'en' : 'he'] }) }));
  if (r.status === 400 || r.status === 422) {
    const legacy = await tavus('POST', '/conversations', c.key, Object.assign({}, common, { persona_id: c.pal }, c.face ? { replica_id: c.face } : {}, { properties: Object.assign({}, props, { language }) }));
    if (legacy.status >= 200 && legacy.status < 300) r = legacy; else if (legacy.status !== 400 && legacy.status !== 422) r = legacy;
  }
  return r;
}

// ---- handler ------------------------------------------------------------------------------------------------
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const c = cfg();

  // Lets the site decide whether to show the chat button at all. Reveals nothing but a boolean.
  if (req.method === 'GET') return res.status(200).json({ enabled: configured(c) });
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: 'forbidden' });
  if (!configured(c)) return res.status(503).json({ ok: false, error: 'not_configured' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  // Ending a call early stops the billing clock.
  if (body.action === 'end') {
    const id = String(body.id || '');
    if (!/^[A-Za-z0-9_-]{4,64}$/.test(id)) return res.status(400).json({ ok: false, error: 'bad_id' });
    try { await tavus('POST', `/conversations/${id}/end`, c.key); } catch (e) { /* best effort */ }
    return res.status(200).json({ ok: true });
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ ok: false, error: 'too_many_requests' });
  if (overDailyLimit(c.dailyLimit)) return res.status(429).json({ ok: false, error: 'daily_limit' });

  const lang = body.lang === 'en' ? 'en' : 'he';
  const focus = /^[a-z0-9_-]{1,40}$/i.test(String(body.product || '')) ? String(body.product) : '';

  try {
    const r = await startConversation(c, lang, focus);
    const j = r.json || {};
    let host = '';
    try { host = new URL(j.conversation_url).hostname; } catch (e) { /* invalid */ }
    if (r.status >= 200 && r.status < 300 && j.conversation_id && host === ROOM_HOST) {
      return res.status(200).json({ ok: true, id: j.conversation_id, url: j.conversation_url, seconds: c.maxSeconds });
    }
    console.error('tavus start failed', r.status, JSON.stringify(j).slice(0, 300));
    if (r.status === 401) return res.status(502).json({ ok: false, error: 'upstream_auth' });
    if (r.status === 429 || (j && /concurrent/i.test(String(j.message || j.error || '')))) return res.status(503).json({ ok: false, error: 'busy' });
    return res.status(502).json({ ok: false, error: 'upstream' });
  } catch (e) {
    console.error('tavus start error', e && e.message);
    return res.status(502).json({ ok: false, error: 'upstream' });
  }
};
