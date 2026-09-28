// Vercel serverless function: receives the contact form and emails it via Resend.
// Required env vars (Vercel Project Settings > Environment Variables):
//   RESEND_API_KEY  - API key from resend.com
// Optional env vars:
//   CONTACT_TO      - where messages are delivered (default: info@haywatches.co.il)
//   CONTACT_FROM    - sender, must be on a domain verified in Resend
//                     (default: "HAY Watches <onboarding@resend.dev>", which only delivers to the Resend account owner's email)
//   ALLOWED_ORIGINS - comma separated extra origins allowed to call this API from another domain

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = async (req, res) => {
  const origin = req.headers.origin || '';
  const allowed = ['https://haimezra.github.io'].concat((process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean));
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  // Honeypot: real users never fill this hidden field
  if (body.website) return res.status(200).json({ ok: true });

  const name = String(body.name || '').trim().slice(0, 120);
  const phone = String(body.phone || '').trim().slice(0, 40);
  const email = String(body.email || '').trim().slice(0, 160);
  const message = String(body.message || '').trim().slice(0, 4000);

  if (!name || !message) return res.status(400).json({ ok: false, error: 'missing_fields' });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'bad_email' });

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(500).json({ ok: false, error: 'not_configured' });

  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.7">
    <h2>פנייה חדשה מהאתר</h2>
    <p><b>שם:</b> ${esc(name)}</p>
    <p><b>טלפון:</b> ${esc(phone) || '-'}</p>
    <p><b>אימייל:</b> ${esc(email) || '-'}</p>
    <p><b>הודעה:</b><br>${esc(message).replace(/\n/g, '<br>')}</p></div>`;
  const text = `פנייה חדשה מהאתר\nשם: ${name}\nטלפון: ${phone || '-'}\nאימייל: ${email || '-'}\n\n${message}`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'HAY Watches <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO || 'info@haywatches.co.il'],
        reply_to: email || undefined,
        subject: `פנייה מהאתר: ${name}`,
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
