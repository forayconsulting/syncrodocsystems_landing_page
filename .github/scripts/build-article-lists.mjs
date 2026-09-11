// Regenerate the article cards in blog.html and index.html (#insights, three newest) and sitemap.xml
// from the <head> of every articles/*.html. Usage: node .github/scripts/build-article-lists.mjs [--root DIR] [--check]
// --check writes nothing and exits 1 if any file would change. A missing marker exits 2 and writes nothing.
import fs from 'node:fs';
import path from 'node:path';
import { rootArg, SITE, escapeHtml, isIsoDate, longDate, listRendered, readArticleMeta, writeIfChanged } from './lib.mjs';

const root = rootArg(process.argv);
const check = process.argv.includes('--check');

const articles = [];
let bad = false;
for (const f of listRendered(root)) {
  const m = readArticleMeta(f);
  const rel = 'articles/' + m.file;
  if (!m.title || !m.card || !m.date) { console.error(`${rel}: missing og:title, og:description, or article:published_time meta`); bad = true; continue; }
  if (!isIsoDate(m.date)) { console.error(`${rel}: article:published_time must be YYYY-MM-DD`); bad = true; continue; }
  if (m.title.includes('Article title')) continue; // placeholder page, never listed
  articles.push(m);
}
if (bad) process.exit(1);
articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.file.localeCompare(b.file)));

const card = a => [
  `      <a class="pcard" href="articles/${a.file}">`,
  `        <p class="pdate">${longDate(a.date)}</p>`,
  `        <h3>${escapeHtml(a.title)}</h3>`,
  `        <p>${escapeHtml(a.card)}</p>`,
  `        <span class="more">Read &rarr;</span>`,
  `      </a>`,
].join('\n');

const END = '<!-- ===== END ARTICLE LIST ===== -->';
function replaceList(file, openTag, cards) {
  const p = path.join(root, file);
  const html = fs.readFileSync(p, 'utf8');
  const open = html.indexOf(openTag);
  const endMark = html.indexOf(END, open);
  if (open === -1 || endMark === -1) { console.error(`${file}: could not find "${openTag}" and "${END}" markers; nothing written`); process.exit(2); }
  const openEnd = html.indexOf('\n', open) + 1;
  const close = html.lastIndexOf('</div>', endMark);
  const closeStart = html.lastIndexOf('\n', close) + 1;
  if (close === -1 || close < openEnd) { console.error(`${file}: list container is not closed before the END marker; nothing written`); process.exit(2); }
  const next = html.slice(0, openEnd) + '\n' + cards.join('\n\n') + '\n\n' + html.slice(closeStart);
  return { p, changed: next !== html, next };
}

const out = [
  replaceList('blog.html', '<div class="posts">', articles.map(card)),
  replaceList('index.html', '<div class="tiles posts">', articles.slice(0, 3).map(card)),
];

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  `  <url><loc>${SITE}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>`,
  `  <url><loc>${SITE}/blog.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
  `  <url><loc>${SITE}/deck.html</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
  ...articles.map(a => `  <url><loc>${SITE}/articles/${a.file}</loc><lastmod>${a.updated || a.date}</lastmod><priority>0.6</priority></url>`),
  '</urlset>',
  '',
].join('\n');
const sp = path.join(root, 'sitemap.xml');
out.push({ p: sp, changed: fs.readFileSync(sp, 'utf8') !== sitemap, next: sitemap });

const changed = out.filter(o => o.changed).map(o => path.relative(root, o.p));
if (check) {
  if (changed.length) { console.error('would change: ' + changed.join(', ')); process.exit(1); }
  console.log('lists up to date'); process.exit(0);
}
for (const o of out) if (o.changed) writeIfChanged(o.p, o.next);
console.log(changed.length ? 'updated: ' + changed.join(', ') : 'lists up to date');
