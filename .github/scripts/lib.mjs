// Shared helpers for the article scripts. Node 20+, no dependencies.
import fs from 'node:fs';
import path from 'node:path';
import { Marked } from './vendor/marked.mjs';

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const SITE = 'https://syncrodocsystems.com';
export const GENERATED_MARK = '<!-- generated from articles/src/';

export function rootArg(argv) {
  const i = argv.indexOf('--root');
  if (i === -1) return process.cwd();
  const v = argv[i + 1];
  if (!v || v.startsWith('--')) { console.error('--root needs a directory, e.g. --root head'); process.exit(2); }
  return path.resolve(v);
}

// JSON safe to embed inside a <script> block: no "</script>" or "<!--" can be formed.
export function jsonForScript(v) {
  return JSON.stringify(v).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

// Markdown body scan shared by the linter (friendly messages) and the renderer (hard backstop).
// Returns problems as { line, message } with lines relative to the body (1-based).
export const LINK_OK = /^(https?:\/\/|\.\.\/|#|mailto:)/i;
export function scanBody(body) {
  const problems = [];
  const marked = new Marked({ gfm: true, breaks: false });
  const lineAt = offset => body.slice(0, offset).split('\n').length;
  const walk = (tokens, offset) => {
    for (const t of tokens || []) {
      if (t.type === 'html') problems.push({ line: lineAt(offset), message: 'HTML tags are not allowed; use Markdown instead (blank line between paragraphs, ## for a heading, - for a bullet, > for a quote, **bold**, [link text](https://...))' });
      if (t.type === 'link' || t.type === 'image') {
        const url = decodeEntities(t.href || '').trim();
        if (!LINK_OK.test(url)) problems.push({ line: lineAt(offset), message: `links must start with https:// or ../ (got "${url.slice(0, 40)}")` });
        if (t.type === 'link' && !(t.text || '').trim()) problems.push({ line: lineAt(offset), message: 'this link has no text; write the words to click between the square brackets' });
      }
      walk(t.tokens, offset); walk(t.items, offset);
      if (t.header) t.header.forEach(c => walk(c.tokens, offset));
      if (t.rows) t.rows.forEach(r => r.forEach(c => walk(c.tokens, offset)));
    }
  };
  let offset = 0;
  for (const t of marked.lexer(body)) { walk([t], offset); offset += t.raw.length; }
  return problems;
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', copy: '©' };
export function decodeEntities(s) {
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
}

export function isIsoDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

// "2026-08-26" -> "26 August 2026" (matches the existing cards and bylines)
export function longDate(iso) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(iso + 'T00:00:00Z'));
}

// Front matter: a block of `key: value` lines between two `---` lines at the top of the file.
export const REQUIRED_KEYS = ['title', 'description', 'author', 'date'];
export const OPTIONAL_KEYS = ['card', 'updated'];

export function parseFrontMatter(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  const errors = [];
  if (lines[0]?.trim() !== '---') {
    return { data: {}, body: text, bodyStartLine: 1, errors: [{ line: 1, message: 'the file must start with a line containing only --- followed by the title, description, author, and date lines, then another ---' }] };
  }
  const data = {};
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') { end = i; break; }
    const m = lines[i].match(/^([A-Za-z_]+)\s*:\s*(.*)$/);
    if (!m) {
      if (lines[i].trim() !== '') errors.push({ line: i + 1, message: `this line is inside the header block but is not "key: value" (${lines[i].trim().slice(0, 40)})` });
      continue;
    }
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (![...REQUIRED_KEYS, ...OPTIONAL_KEYS].includes(key)) errors.push({ line: i + 1, message: `unknown header line "${key}"; the header only takes title, description, author, date (and optionally card, updated)` });
    else if (key in data) errors.push({ line: i + 1, message: `"${key}" appears twice in the header` });
    else data[key] = { value: val, line: i + 1 };
  }
  if (end === -1) {
    errors.push({ line: 1, message: 'the header block is never closed; add a line containing only --- after the date line' });
    return { data: flat(data), body: '', bodyStartLine: lines.length + 1, errors };
  }
  for (const k of REQUIRED_KEYS) {
    if (!data[k]) errors.push({ line: 1, message: `the header is missing the "${k}:" line` });
    else if (!data[k].value) errors.push({ line: data[k].line, message: `"${k}:" is empty` });
  }
  return { data: flat(data), lines: data, body: lines.slice(end + 1).join('\n'), bodyStartLine: end + 2, errors };
}
function flat(d) { const o = {}; for (const k in d) o[k] = d[k].value; return o; }

export function listSources(root) {
  const dir = path.join(root, 'articles', 'src');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'README.md').sort()
    .map(f => path.join(dir, f));
}

export function listRendered(root) {
  const dir = path.join(root, 'articles');
  return fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort().map(f => path.join(dir, f));
}

function meta(html, attr, name) {
  const re = new RegExp(`<meta\\s+${attr}="${name}"\\s+content="([^"]*)"`, 'i');
  const m = html.match(re);
  return m ? decodeEntities(m[1]) : null;
}

// Read what the list generator needs from a rendered article's <head>.
export function readArticleMeta(file) {
  const html = fs.readFileSync(file, 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));
  return {
    file: path.basename(file),
    title: meta(head, 'property', 'og:title'),
    card: meta(head, 'property', 'og:description'),
    date: meta(head, 'property', 'article:published_time'),
    updated: meta(head, 'property', 'article:modified_time'),
    generated: html.includes(GENERATED_MARK),
  };
}

export function writeIfChanged(file, content) {
  const cur = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (cur === content) return false;
  fs.writeFileSync(file, content);
  return true;
}
