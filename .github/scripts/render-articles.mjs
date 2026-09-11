// Render articles/src/<slug>.md into articles/<slug>.html using .github/templates/article.html.
// Usage: node .github/scripts/render-articles.mjs [--root DIR] [--check]
// The template and this script are always read from the checkout this script lives in
// (trusted); only the Markdown under --root is treated as input data.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from './vendor/marked.mjs';
import { rootArg, SLUG_RE, escapeHtml, isIsoDate, longDate, parseFrontMatter, listSources, listRendered, readArticleMeta, writeIfChanged, jsonForScript, scanBody } from './lib.mjs';

const root = rootArg(process.argv);
const check = process.argv.includes('--check');
const TEMPLATE = fs.readFileSync(new URL('../templates/article.html', import.meta.url), 'utf8');
const ORG = 'SyncroDoc Systems';

const marked = new Marked({ gfm: true, breaks: false });

export function renderMarkdown(md) {
  let html = marked.parse(md).trim();
  // Single-paragraph pull quotes render as <blockquote>text</blockquote>, matching article.css.
  html = html.replace(/<blockquote>\n<p>((?:(?!<\/p>)[\s\S])*)<\/p>\n<\/blockquote>/g, '<blockquote>$1</blockquote>');
  // First paragraph is the lead.
  html = html.replace(/^<p>/, '<p class="lead">');
  // Indent to match the hand-written articles (four spaces inside .wrap).
  return html.split('\n').map(l => (l ? '    ' + l : l)).join('\n')
    // blank line between block elements, like the hand-written version
    .replace(/\n(?=    <(?:p|h2|h3|ul|ol|blockquote)\b)/g, '\n\n');
}

export function renderArticle(mdPath) {
  const slug = path.basename(mdPath, '.md');
  const errors = [];
  if (!SLUG_RE.test(slug)) errors.push(`file name must be lowercase letters, numbers, and hyphens (got "${slug}")`);
  const fm = parseFrontMatter(fs.readFileSync(mdPath, 'utf8'));
  for (const e of fm.errors) errors.push(`line ${e.line}: ${e.message}`);
  if (fm.data.date && !isIsoDate(fm.data.date)) errors.push(`date must be YYYY-MM-DD (got "${fm.data.date}")`);
  if (fm.data.updated && !isIsoDate(fm.data.updated)) errors.push(`updated must be YYYY-MM-DD (got "${fm.data.updated}")`);
  // Hard backstop, independent of the linter: no raw HTML, no odd link schemes.
  for (const p of scanBody(fm.body)) errors.push(`line ${fm.bodyStartLine - 1 + p.line}: ${p.message}`);
  if (errors.length) return { slug, errors };

  const d = fm.data;
  const card = d.card || d.description;
  const isOrg = d.author.trim() === ORG;
  const authorJson = isOrg
    ? '{"@type": "Organization", "name": "SyncroDoc Systems LLC"}'
    : `{"@type": "Person", "name": ${jsonForScript(d.author)}}`;
  const vars = {
    slug,
    title: escapeHtml(d.title),
    title_json: jsonForScript(d.title),
    description: escapeHtml(d.description),
    card: escapeHtml(card),
    date_iso: d.date,
    date_long: longDate(d.date),
    modified_meta: d.updated ? `\n<meta property="article:modified_time" content="${d.updated}">` : '',
    modified_json: d.updated ? `\n  "dateModified": "${d.updated}",` : '',
    author_json: authorJson,
    byline: isOrg ? escapeHtml(d.author) : 'By ' + escapeHtml(d.author),
    body: renderMarkdown(fm.body),
  };
  const html = TEMPLATE.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
  return { slug, html };
}

const isMain = process.argv[1] && fs.realpathSync(path.resolve(process.argv[1])) === fileURLToPath(import.meta.url);
if (isMain) {
  let failed = false, changed = [];
  const sources = listSources(root);
  const slugs = new Set();
  for (const src of sources) {
    const r = renderArticle(src);
    const rel = path.relative(root, src);
    slugs.add(r.slug); // even on error, so a broken source never orphans its existing page
    if (r.errors) { failed = true; for (const e of r.errors) console.error(`${rel}: ${e}`); continue; }
    const out = path.join(root, 'articles', r.slug + '.html');
    const cur = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : null;
    if (cur !== r.html) { changed.push(path.relative(root, out)); if (!check) writeIfChanged(out, r.html); }
  }
  // Remove rendered pages whose source is gone. Hand-written pages (no generated marker) are left alone.
  for (const f of listRendered(root)) {
    const slug = path.basename(f, '.html');
    if (!slugs.has(slug) && readArticleMeta(f).generated) {
      changed.push('delete ' + path.relative(root, f));
      if (!check) fs.unlinkSync(f);
    }
  }
  if (changed.length) console.log((check ? 'would change: ' : 'rendered: ') + changed.join(', '));
  else console.log('articles up to date');
  if (failed || (check && changed.length)) process.exit(1);
}
