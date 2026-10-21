// Vercel Routing Middleware: customers-only password gate for the whole site.
//
// HOW IT SWITCHES ON:  set SITE_PASSWORD in Vercel (Project Settings > Environment Variables) and redeploy.
//                      Remove the variable and redeploy to open the site again.  (No variable = site stays public.)
// Optional:            SITE_AUTH_SECRET  - random string used to sign the login cookie (defaults to the password,
//                      so changing the password logs everybody out).
//
// How it works: visitors without a valid signed cookie are sent to /login.html. The form POSTs to /login, which checks the
// password and sets an HttpOnly cookie valid for 30 days. Every page, image, script and API call goes through this check,
// so prices and the catalog are not served to anyone who is not logged in.

import { next } from '@vercel/functions';

export const config = { matcher: '/:path*' };

const COOKIE = 'hay_auth';
const MAX_AGE = 60 * 60 * 24 * 30;
const OPEN = new Set(['/login.html', '/login', '/logout', '/robots.txt', '/favicon-32.png', '/apple-touch-icon.png', '/icon-512.png']);

const enc = new TextEncoder();
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(msg)));
}
async function digest(s) { return new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(s))); }
function same(a, b) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i]; return d === 0; }
async function passwordOk(given, real) { return same(await digest('pw|' + given), await digest('pw|' + real)); }

async function makeToken(secret) {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return exp + '.' + (await hmac(secret, 'hay-auth:' + exp));
}
async function validToken(secret, token) {
  const [exp, sig] = String(token || '').split('.');
  if (!exp || !sig || !/^\d{9,12}$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  return same(enc.encode(sig), enc.encode(await hmac(secret, 'hay-auth:' + exp)));
}
function cookieOf(req, name) {
  const m = new RegExp('(?:^|;\\s*)' + name + '=([^;]+)').exec(req.headers.get('cookie') || '');
  return m ? decodeURIComponent(m[1]) : '';
}
const setCookie = (value, maxAge) => `${COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
const safeNext = (n) => (typeof n === 'string' && /^\/(?!\/|\\)[^\r\n]*$/.test(n) && !n.startsWith('/login') && !n.startsWith('/logout')) ? n : '/';
const redirect = (url, headers) => new Response(null, { status: 303, headers: Object.assign({ Location: url, 'Cache-Control': 'no-store' }, headers || {}) });

// Slow down password guessing (best effort per edge instance) on top of a short delay after each failure.
const fails = new Map();
function blocked(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const a = (fails.get(ip) || []).filter((t) => now - t < win); fails.set(ip, a);
  if (fails.size > 3000) for (const [k, v] of fails) if (!v.length || now - v[v.length - 1] > win) fails.delete(k);
  return a.length >= 8;
}
const noteFail = (ip) => { const a = fails.get(ip) || []; a.push(Date.now()); fails.set(ip, a); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// SITE OFFLINE SWITCH: true = every visitor gets a 404 "site not active" page (pages, images and API).
// To reopen the site set this to false and redeploy.
const SITE_OFFLINE = true;
const OFFLINE_HTML = '<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>404</title><style>html,body{height:100%;margin:0}body{background:#0A0A10;color:#EDEAF2;font-family:Heebo,Arial,sans-serif;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}h1{font-size:clamp(3rem,12vw,6rem);margin:0 0 8px;font-weight:500;letter-spacing:.05em}p{color:#9A97A6;font-size:1.15rem;margin:0}</style></head><body><main><h1>404</h1><p>האתר לא פעיל</p><p dir="ltr" style="margin-top:10px;font-size:.95rem">Site not active</p></main></body></html>';

export default async function middleware(request) {
  if (SITE_OFFLINE) return new Response(OFFLINE_HTML, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
  const password = process.env.SITE_PASSWORD;
  if (!password) return next(); // gate is OFF until SITE_PASSWORD is set

  const secret = process.env.SITE_AUTH_SECRET || password;
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/logout') return redirect('/login.html', { 'Set-Cookie': setCookie('', 0) });

  if (path === '/login' && request.method === 'POST') {
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
    if (blocked(ip)) return redirect('/login.html?e=2');
    let given = '', nxt = '/';
    try { const f = await request.formData(); given = String(f.get('password') || '').slice(0, 200); nxt = safeNext(f.get('next')); } catch (e) { /* bad body */ }
    if (given && (await passwordOk(given, password))) return redirect(nxt, { 'Set-Cookie': setCookie(await makeToken(secret), MAX_AGE) });
    noteFail(ip); await sleep(700);
    return redirect('/login.html?e=1' + (nxt !== '/' ? '&next=' + encodeURIComponent(nxt) : ''));
  }

  if (OPEN.has(path) && (request.method === 'GET' || request.method === 'HEAD')) return next();

  if (await validToken(secret, cookieOf(request, COOKIE))) return next();

  // Not logged in. APIs get a JSON 401, pages are sent to the login form.
  if (path.startsWith('/api/')) return new Response(JSON.stringify({ ok: false, error: 'login_required' }), { status: 401, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  const back = path + url.search;
  return redirect('/login.html' + (back !== '/' && !/\.(?:png|jpe?g|webp|svg|gif|ico|css|js|woff2?|mp4|webm|map)$/i.test(path) ? '?next=' + encodeURIComponent(back) : ''));
}
