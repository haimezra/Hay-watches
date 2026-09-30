// Vercel serverless function: newsletter sign-up. Emails each new subscriber to the site owner via Resend.
// Uses the same env vars as api/contact.js:
//   RESEND_API_KEY (required), CONTACT_TO (default info@haywatches.co.il), CONTACT_FROM

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const hits = new Map();
const limited = (ip) => { const now = Date.now(); const a = (hits.get(ip) || []).filter((t) => now - t < 600000); a.push(now); hits.set(ip, a); return a.length > 5; };

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ ok: false, error: 'too_many_requests' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  if (body.website) return res.status(200).json({ ok: true }); // honeypot

  const email = String(body.email || '').trim().slice(0, 160);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'bad_email' });

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(500).json({ ok: false, error: 'not_configured' });

  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.7">
    <h2>הרשמה חדשה לניוזלטר VIP</h2>
    <p><b>אימייל:</b> ${esc(email)}</p></div>`;
  const text = `הרשמה חדשה לניוזלטר VIP\nאימייל: ${email}`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'HAY Watches <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO || 'info@haywatches.co.il'],
        reply_to: email,
        subject: `הרשמה לניוזלטר: ${email}`,
        html,
        text,
      }),
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: 'send_failed' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
};
