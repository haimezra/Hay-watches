// Vercel serverless function: builds a SIGNED Hypay (Yaad) payment link.
// The price is ALWAYS taken from data.js on the server. Anything the browser sends about price is ignored.
//
// Required env vars (Vercel Project Settings > Environment Variables):
//   HYP_MASOF  - terminal number (Masof) from Hypay
//   HYP_KEY    - API key (KEY) from the Hypay dashboard
//   HYP_PASSP  - PassP password from Hypay
// Optional:
//   ALLOWED_ORIGINS - comma separated extra origins allowed to call this API

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

// Shipping policy shown on the site: free over 1,500, otherwise a flat 45.
const FREE_SHIPPING_OVER = 1500;
const SHIPPING_FEE = 45;

let DATA = null;
function data() {
  if (!DATA) {
    const src = fs.readFileSync(path.join(process.cwd(), 'data.js'), 'utf8');
    DATA = vm.runInNewContext(
      src + '\n;({ PRODUCTS, GIFT_BOXES: (typeof GIFT_BOXES !== "undefined" ? GIFT_BOXES : []), GIFT_EXTRAS: (typeof GIFT_EXTRAS !== "undefined" ? GIFT_EXTRAS : []) })',
      {},
      { timeout: 1000 }
    );
  }
  return DATA;
}
function catalog() { return data().PRODUCTS; }

const unavailable = (p) => p.sold === true || p.available === false;

// Validates strap options exactly like a single-product purchase. Returns { qty, label } or { status, error }.
function resolveStrap(product, o) {
  o = o || {};
  const color = (product.colors || []).find((c) => c.id === o.color);
  const length = (product.lengths || []).find((l) => l.id === o.length);
  const size = (product.sizes || []).find((n) => n === Number(o.size));
  if (!color || !length || !size) return { status: 400, error: 'bad_options' };
  if (!((color.imgs && color.imgs.length > 0) || color.available === true)) return { status: 409, error: 'not_available' };
  const qty = Math.max(1, Math.min(20, parseInt(o.qty, 10) || 1));
  return { qty, label: `${product.name.he}, ${color.he}, ${length.he}, ${size} מ״מ, כמות ${qty}` };
}

// Gift bundle: box (price from GIFT_BOXES) + one available watch + up to 4 available accessories/straps.
function buildGift(g) {
  const box = data().GIFT_BOXES.find((b) => b.id === String(g.box || ''));
  if (!box) return { status: 400, error: 'bad_gift' };
  const watch = catalog().find((x) => x.id === String(g.watch || ''));
  if (!watch || (watch.cat !== 'men' && watch.cat !== 'women')) return { status: 400, error: 'unknown_product' };
  if (unavailable(watch)) return { status: 409, error: 'not_available' };

  const list = Array.isArray(g.addons) ? g.addons.slice(0, 4) : [];
  const seen = new Set();
  let roseSeen = false;
  let subtotal = Number(box.price) + Number(watch.price);
  for (const a of list) {
    const aid = String((a && a.id) || '');
    const p = catalog().find((x) => x.id === aid) || data().GIFT_EXTRAS.find((x) => x.id === aid);
    if (!p || (p.cat !== 'accessories' && p.cat !== 'gift-extra' && !p.strap) || seen.has(p.id)) return { status: 400, error: 'bad_gift' };
    if (p.cat === 'gift-extra') { if (roseSeen) return { status: 400, error: 'bad_gift' }; roseSeen = true; }
    seen.add(p.id);
    if (unavailable(p)) return { status: 409, error: 'not_available' };
    if (p.strap) {
      const r = resolveStrap(p, Object.assign({}, a.opts, { qty: 1 }));
      if (r.error) return r;
    }
    subtotal += Number(p.price);
  }
  const note = String(g.note || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const info = `מארז: ${box.short} | ${watch.name.he.slice(0, 24)} | +${seen.size}` + (note ? ` | ברכה: ${note}` : '');
  return { subtotal, info };
}

// Best-effort rate limit per IP (resets when the serverless instance recycles)
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 10;
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false; // browsers always send Origin on cross-origin/POST fetches
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const extra = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  // www.example.com and example.com are the same site: accept either spelling on either side.
  const bare = (h) => String(h || '').replace(/^https:\/\//, '').replace(/^www\./, '');
  return origin === 'https://' + host || bare(origin) === bare(host) && /^https:\/\//.test(origin) || extra.includes(origin);
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: 'forbidden' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ ok: false, error: 'too_many_requests' });

  const { HYP_MASOF, HYP_KEY, HYP_PASSP } = process.env;
  if (!HYP_MASOF || !HYP_KEY || !HYP_PASSP) {
    return res.status(503).json({ ok: false, error: 'payment_not_configured' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  let subtotal;
  let info;
  let isGift = false;
  if (body.gift && typeof body.gift === 'object') {
    const g = buildGift(body.gift);
    if (g.error) return res.status(g.status).json({ ok: false, error: g.error });
    subtotal = Math.round(g.subtotal * 100) / 100; // computed here, never from the client
    info = g.info;
    isGift = true;
  } else {
    const product = catalog().find((x) => x.id === String(body.id || ''));
    if (!product) return res.status(400).json({ ok: false, error: 'unknown_product' });
    if (unavailable(product)) return res.status(409).json({ ok: false, error: 'not_available' });

    let qty = 1;
    info = product.name.he;
    if (product.strap) {
      const r = resolveStrap(product, body.opts);
      if (r.error) return res.status(r.status).json({ ok: false, error: r.error });
      qty = r.qty;
      info = r.label;
    }
    subtotal = Math.round(Number(product.price) * qty * 100) / 100; // computed here, never from the client
  }
  const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const amount = subtotal + shipping;
  if (!isGift) info = shipping ? `${info} (כולל משלוח ${SHIPPING_FEE} ש״ח)` : `${info} (משלוח חינם)`;
  if (!(amount > 0)) return res.status(500).json({ ok: false, error: 'bad_price' });

  const order = crypto.randomUUID().replace(/-/g, '').slice(0, 20);
  const params = new URLSearchParams({
    action: 'APISign',
    What: 'SIGN',
    KEY: HYP_KEY,
    PassP: HYP_PASSP,
    Masof: HYP_MASOF,
    Amount: String(amount),
    Info: info.slice(0, 120),
    Order: order,
    Coin: '1',
    UTF8: 'True',
    UTF8out: 'True',
    sendemail: 'True',
    Sign: 'True',
  });

  // Hyp's current host first, the legacy Yaad host as a fallback.
  const HOSTS = ['https://pay.hyp.co.il', 'https://icom.yaad.net'];
  const redact = (t) => [HYP_KEY, HYP_PASSP, HYP_MASOF].reduce((a, v) => (v ? a.split(v).join('***') : a), String(t));
  let detail = '';
  for (const host of HOSTS) {
    try {
      const r = await fetch(host + '/p/?' + params.toString());
      const text = (await r.text()).trim();
      if (r.ok && /signature=/i.test(text)) {
        return res.status(200).json({ ok: true, url: host + '/p/?action=pay&' + text });
      }
      detail = redact(text).replace(/\s+/g, ' ').slice(0, 160);
    } catch (e) {
      detail = 'fetch_error';
    }
  }
  return res.status(502).json({ ok: false, error: 'sign_failed', detail });
};
