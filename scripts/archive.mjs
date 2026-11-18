// Turn a built site folder into a quiet archive. Runs in the Pages workflow after every
// version has been copied into <dir>; the tagged commits themselves stay untouched.
//   node scripts/archive.mjs <dir>
// - adds a noindex meta tag to every HTML page and a robots.txt that disallows everything
// - removes the trackers (Google Analytics, StatCounter, Smartlook, Facebook SDK)
// - keeps the contact form, whose contact.php no longer exists, but makes Send show a note
// - loads external scripts and styles over https
// - points the static versions' root-relative paths into their /<tag>/ folder
// - swaps the dead Google map for a greyscale embed, and the RateYourDive badge for a saved copy
// Written for Node 14, the version the Vue build needs.
import fs from 'fs';
import path from 'path';

const dir = path.resolve(process.argv[2] || 'dist');

const TRACKER = /google-analytics\.com|googletagmanager\.com|statcounter|sc_project|smartlook|fbAsyncInit|connect\.facebook\.net|recaptcha/i;
// The form keeps its look; sending it only shows this message. A capture-phase listener on
// window runs before the site's own jQuery handler and stops it, so nothing is posted.
const FORM_ALERT =
  'Bu sayfa bir arşiv, iletişim formu artık mesaj göndermiyor. Bana nevcan.com üzerinden ulaşabilirsiniz.\\n\\n' +
  'This page is an archive and the contact form no longer sends messages. You can reach me at nevcan.com.';
const FORM_SCRIPT =
  '<script>window.addEventListener("submit",function(e){if(e.target&&e.target.id==="contact-form")' +
  `{e.preventDefault();e.stopImmediatePropagation();alert("${FORM_ALERT}");}},true);</script>`;

// The static versions drew a grey Google map with Maplace and the keyless Maps API v3.7, which
// no longer loads. A keyless, greyscale embed of the same place and zoom takes its place, and a
// stub keeps the site's own `new Maplace({...}).Load()` call from failing.
const MAP_EMBED =
  '<iframe src="https://maps.google.com/maps?q=40.985747,29.025306&amp;z=5&amp;output=embed" title="Map" ' +
  'loading="lazy" style="border:0;width:100%;height:100%;filter:grayscale(1)"></iframe>';
const MAPLACE_STUB = '<script>window.Maplace=function(){this.Load=function(){return this}};</script>';
// RateYourDive's widget is gone; a version that ships a copy in rateyourdive/ shows that instead.
const RYD_WIDGET = /https?:\/\/embed\.rateyourdive\.com\/en\/widget\.php\?id=\d+/gi;

// HTML files are handled as latin1 so their original bytes survive untouched;
// text we add is converted to the same representation first.
const raw = (s) => Buffer.from(s, 'utf8').toString('latin1');

function archive(html, hasWidgetCopy) {
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (tag) => (TRACKER.test(tag) ? '' : tag));
  html = html.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, (tag) => (TRACKER.test(tag) ? '' : tag));
  if (/id=["']google-maps["']/i.test(html)) {
    html = html.replace(/<script\b[^>]*src=["'][^"']*(?:maps\.google\.com\/maps\/api|maplace)[^"']*["'][^>]*><\/script>\s*/gi, '');
    html = html.replace(/(<div\b[^>]*id=["']google-maps["'][^>]*>)\s*(<\/div>)/i, `$1${MAP_EMBED}$2`);
    html = html.replace(/<\/head>/i, `${MAPLACE_STUB}\n</head>`);
  }
  if (hasWidgetCopy) html = html.replace(RYD_WIDGET, 'rateyourdive/widget.html');
  if (/id=["']contact-form["']/i.test(html)) html = html.replace(/<\/body>/i, `${raw(FORM_SCRIPT)}\n</body>`);
  html = html.replace(/(<(?:script|link|img|iframe)\b[^>]*?\s(?:src|href)=["'])http:\/\//gi, '$1https://');
  if (!/<meta[^>]+name=["']robots["']/i.test(html)) {
    html = html.replace(/<head\b[^>]*>/i, (head) => `${head}\n<meta name="robots" content="noindex, nofollow">`);
  }
  return html;
}

// The static versions were built for the site root and now live in /<tag>/, so root-relative
// paths such as url(/assets/fonts/iconfont.woff) or href="/favicon.ico" get the folder prefix.
function rebase(text, prefix) {
  return text
    .replace(/(url\(\s*["']?)\/(?!\/)/gi, `$1${prefix}/`)
    .replace(/(\s(?:src|href)=["'])\/(?![\/a]?["'\/])/gi, `$1${prefix}/`);
}

let pages = 0;
(function walk(d, prefix) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      walk(p, prefix || (d === dir && /^\d{4}\.\d{2}$/.test(e.name) ? `/${e.name}` : ''));
      continue;
    }
    if (!/\.(html|css)$/.test(e.name)) continue;
    let text = fs.readFileSync(p, 'latin1');
    if (prefix) text = rebase(text, prefix);
    if (e.name.endsWith('.html')) {
      text = archive(text, fs.existsSync(path.join(d, 'rateyourdive', 'widget.html')));
      pages++;
    }
    fs.writeFileSync(p, text, 'latin1');
  }
})(dir, '');

fs.writeFileSync(path.join(dir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`archived ${pages} HTML pages in ${dir}`);
