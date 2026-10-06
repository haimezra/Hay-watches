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

let CATALOG = null;
function catalog() {
  if (!CATALOG) {
    const src = fs.readFileSync(path.join(process.cwd(), 'data.js'), 'utf8');
    CATALOG = vm.runInNewContext(src + '\n;PRODUCTS', {}, { timeout: 1000 });
  }
  return CATALOG;
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
  return origin === 'https://' + host || extra.includes(origin);
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

  const product = catalog().find((x) => x.id === String(body.id || ''));
  if (!product) return res.status(400).json({ ok: false, error: 'unknown_product' });
  if (product.sold === true || product.available === false) {
    return res.status(409).json({ ok: false, error: 'not_available' });
  }

  let qty = 1;
  let info = product.name.he;
  if (product.strap) {
    const o = body.opts || {};
    const color = (product.colors || []).find((c) => c.id === o.color);
    const length = (product.lengths || []).find((l) => l.id === o.length);
    const size = (product.sizes || []).find((n) => n === Number(o.size));
    if (!color || !length || !size) return res.status(400).json({ ok: false, error: 'bad_options' });
    if (!((color.imgs && color.imgs.length > 0) || color.available === true)) {
      return res.status(409).json({ ok: false, error: 'not_available' });
    }
    qty = Math.max(1, Math.min(20, parseInt(o.qty, 10) || 1));
    info = `${product.name.he}, ${color.he}, ${length.he}, ${size} מ״מ, כמות ${qty}`;
  }

  const subtotal = Math.round(Number(product.price) * qty * 100) / 100; // computed here, never from the client
  const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const amount = subtotal + shipping;
  info = shipping ? `${info} (כולל משלוח ${SHIPPING_FEE} ש״ח)` : `${info} (משלוח חינם)`;
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
