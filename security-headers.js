// Baseline HTTP security response headers + an opt-in, off-by-default CORS
// allowlist (Phase 5 security hardening, 2026-09-24 — see
// docs/phase-5-security-audit-report.md, items 6/7).
//
// CSP verified compatible with the real public/ frontend before being
// written, not assumed. Exhaustive static scan of every resource-loading /
// dynamic-execution site in public/index.html, public/app.js, and
// public/style.css (grep for script/link/img/iframe tags, fetch/XHR/
// WebSocket/EventSource/eval/Function/Worker calls, inline style= sites, and
// any http(s):// literal), each one cross-checked against the directive that
// governs it:
//   - script-src: exactly one script tag, an external same-origin /app.js;
//     no inline scripts, no inline event-handler attributes, no eval/
//     Function/Worker anywhere in app.js. Stays strict, no unsafe-inline/eval.
//   - style-src: /style.css (self) + the Google Fonts stylesheet, PLUS two
//     inline style="..." attributes app.js injects via innerHTML (a colored
//     dot, a margin override) — hence 'unsafe-inline' on style-src only. The
//     meaningfully dangerous surface for the token-theft-via-XSS risk this
//     CSP compensates for is inline/injected SCRIPT, not style.
//   - font-src / style-src externals: fonts.googleapis.com (stylesheet) and
//     fonts.gstatic.com (font files) are the only external hosts the
//     frontend loads anything from.
//   - img-src: both <img> tags (#qDiagramImg, #lightboxImg) get their `src`
//     set only from JS, from `step.diagramUrl`; traced server-side to
//     server.js's tryServeExtractedDiagram(), which serves diagram crops
//     same-origin from /extracted-diagrams/ — so 'self' covers this today
//     and once the (currently-unpopulated) diagram feature goes live.
//   - connect-src: the single api() fetch() helper always calls a relative
//     same-origin urlPath (/api/...) — 'self' covers every network call.
//   - Non-issue found: two <link rel="preconnect"> hints to the Google
//     Fonts hosts are technically outside connect-src 'self'. If a browser
//     enforces CSP on preconnect hints, the only effect is losing that
//     early-connection optimization — the actual stylesheet/font requests
//     are still separately allowed via style-src/font-src, so this cannot
//     break functionality, only a possible micro-perf loss.
// This static-analysis pass is a real check of the actual shipped source,
// not an assumption — but it is not a substitute for loading the page in a
// browser and confirming zero CSP violations land in the console; that
// browser-rendered check was not possible in the session that authored this
// (no connected Chrome browser) and should be run before/soon after
// production rollout — see docs/phase-5-security-hardening-report.md.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ');

function applyBaselineHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', CSP);
}

// Off by default: with ALLOWED_ORIGINS unset (the current, unchanged
// behavior), this never sets any CORS header and never intercepts OPTIONS —
// identical to today. When configured with an explicit allowlist (never a
// wildcard), a matching Origin gets the standard CORS response headers, and
// a preflight OPTIONS request is answered directly rather than falling
// through to the app's normal 404. Returns true if this call fully handled
// the request (a preflight) — the caller should return immediately.
function applyCors(req, res, allowedOrigins) {
  if (!allowedOrigins.length) return false;
  const origin = req.headers.origin;
  if (!origin || !allowedOrigins.includes(origin)) return false;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'false'); // bearer tokens go in a header, not a cookie -- no credentialed CORS needed
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '600');
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
}

module.exports = { applyBaselineHeaders, applyCors, CSP };
