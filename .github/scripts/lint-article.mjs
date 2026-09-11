// Content checks for articles/src/<slug>.md, written for non-technical writers.
// Usage: node .github/scripts/lint-article.mjs [--root DIR] articles/src/a.md [articles/src/b.md ...]
// Prints one plain sentence per problem plus a GitHub annotation, exits 1 if any.
import fs from 'node:fs';
import path from 'node:path';
import { rootArg, SLUG_RE, isIsoDate, parseFrontMatter, scanBody } from './lib.mjs';

const BANNED = [
  'revolutionary', 'revolutionize', 'revolutionise', 'seamless', 'seamlessly', 'unlock', 'unlocks', 'supercharge',
  'leverage', 'leverages', 'leveraging', 'game-changer', 'game-changing', 'game changer', 'cutting-edge', 'cutting edge',
  'delve', 'delves', 'harness', 'harnessing', 'elevate', 'empower', 'empowers', 'empowering', 'unleash', 'unleashes',
  'next-level', 'tapestry', "in today's fast-paced", "it's worth noting", 'navigate the landscape', 'synergy', 'paradigm shift',
];
const DASHES = [
  [/—/g, 'this long dash (em dash) is not allowed; use a comma, a period, or a plain hyphen'],
  [/–/g, 'this dash (en dash) is not allowed; use a comma, a period, or a plain hyphen'],
  [/&mdash;|&ndash;|&#8212;|&#8211;|&#x2014;|&#x2013;/gi, 'this dash code is not allowed; use a comma, a period, or a plain hyphen'],
  [/\s--\s/g, 'a double hyphen is not allowed; use a comma, a period, or a single hyphen'],
];

const root = rootArg(process.argv);
const files = process.argv.slice(2).filter(a => a !== '--root' && a !== process.argv[process.argv.indexOf('--root') + 1]);
let total = 0;

for (const rel of files) {
  const problems = [];
  const add = (line, message) => problems.push({ line, message });
  const abs = path.isAbsolute(rel) ? rel : path.join(root, rel);
  const displayPath = path.isAbsolute(rel) ? path.relative(root, rel) : rel;
  const base = path.basename(rel);
  if (base === 'README.md') continue;
  if (!base.endsWith('.md') || !SLUG_RE.test(base.slice(0, -3))) add(1, `the file name must be lowercase letters, numbers, and hyphens and end in .md, for example why-amendments-get-missed.md (got "${base}")`);
  if (!fs.existsSync(abs)) { add(1, 'file not found'); report(displayPath, problems); continue; }

  const text = fs.readFileSync(abs, 'utf8');
  const lines = text.split(/\r?\n/);
  const fm = parseFrontMatter(text);
  for (const e of fm.errors) add(e.line, e.message);
  const L = k => fm.lines?.[k]?.line ?? 1;
  const d = fm.data;

  if (d.date && /^Y{4}-M{2}-D{2}$/i.test(d.date)) add(L('date'), "replace the date placeholder with today's date, for example 2026-09-11");
  else if (d.date && !isIsoDate(d.date)) add(L('date'), `the date must be written as YYYY-MM-DD, for example 2026-09-11 (got "${d.date}")`);
  else if (d.date) {
    const max = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    if (d.date > max) add(L('date'), `the date ${d.date} is in the future; use today's date or earlier`);
  }
  if (d.updated && !isIsoDate(d.updated)) add(L('updated'), `"updated" must be written as YYYY-MM-DD (got "${d.updated}")`);
  if (d.title && d.title.length > 120) add(L('title'), `the title is ${d.title.length} characters; keep it under 120`);
  if (d.title && /\bSyncroDoc\s*$/.test(d.title)) add(L('title'), 'do not end the title with "SyncroDoc"; it is added automatically');
  if (d.description && (d.description.length < 50 || d.description.length > 300)) add(L('description'), `the description is ${d.description.length} characters; write one or two sentences, 50 to 300 characters`);
  if (d.card && d.card.length > 300) add(L('card'), `the card text is ${d.card.length} characters; keep it under 300`);

  // Header text checks (dashes, banned words) on the header values too.
  for (const k of ['title', 'description', 'card', 'author']) if (d[k]) {
    checkText(d[k], L(k), add);
    if (/<\/?[a-zA-Z][^>]*>/.test(d[k])) add(L(k), 'HTML tags are not allowed in the header lines; write plain text');
    if (/^(["']).*\1$/.test(d[k]) && d[k].length > 1) add(L(k), 'do not wrap the value in quote marks; they would appear on the page');
  }

  // Body checks, line by line.
  const bodyLines = lines.slice(fm.bodyStartLine - 1);
  let paragraphs = 0, inFence = false;
  bodyLines.forEach((line, i) => {
    const n = fm.bodyStartLine + i;
    if (/^\s*```/.test(line)) { inFence = !inFence; add(n, 'code blocks (```) are not used in articles; write the content as normal paragraphs'); return; }
    if (inFence) return;
    if (/<\/?[a-zA-Z][^>]*>/.test(line)) add(n, 'HTML tags are not allowed; use Markdown instead (blank line between paragraphs, ## for a heading, - for a bullet, > for a quote, **bold**, [link text](https://...))');
    const h = line.match(/^(#{1,6})(\s|$)/);
    if (/^#{1,6}\s*(#+\s*)?$/.test(line)) add(n, 'this heading line is empty; write the heading text after ## or delete the line');
    else if (h && h[1].length === 1) add(n, 'a single # heading is the article title, which comes from the header; use ## for section headings');
    else if (h && h[1].length > 3) add(n, 'headings deeper than ### are not used; use ## or ###');
    if (/^\s{0,3}=+\s*$/.test(line) && i > 0 && bodyLines[i - 1].trim()) add(n, 'a line of = under text makes a top-level heading; use ## before the heading text instead');
    if (/^\s{0,3}-{3,}\s*$/.test(line) && i > 0 && bodyLines[i - 1].trim() && !/^\s*([-*+]\s|\d+\.\s|>|#)/.test(bodyLines[i - 1])) add(n, 'a line of - under text turns it into a heading; use ## before the heading text instead');
    if (/https?:\/\/(www\.)?syncrodocsystems\.com/i.test(line)) add(n, 'link to pages on this site with a relative address such as ../index.html#start or ../blog.html, not the full https://syncrodocsystems.com address');
    if (/^\s*[-*+]\s|^\s*\d+\.\s|^\s*>|^#{1,6}\s/.test(line) || !line.trim()) { /* structural or blank */ } else if (i === 0 || !bodyLines[i - 1].trim()) paragraphs++;
    checkText(line, n, add);
  });
  if (fm.errors.length === 0 && paragraphs === 0) add(fm.bodyStartLine, 'the article has no paragraphs; write the body below the header block');
  // Parsed pass: catches HTML tags split across lines, reference links, and odd link targets.
  for (const p of scanBody(fm.body)) add(fm.bodyStartLine - 1 + p.line, p.message);

  report(displayPath, problems);
}

function checkText(text, line, add) {
  for (const [re, msg] of DASHES) if (re.test(text)) { add(line, msg); re.lastIndex = 0; }
  const lower = text.toLowerCase().replace(/[\u2018\u2019\u02BC]/g, "'");
  for (const w of BANNED) {
    const re = new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^a-z])`, 'i');
    if (re.test(lower)) add(line, `"${w}" is on the list of words we do not use; say it plainly instead`);
  }
}

function report(file, problems) {
  if (!problems.length) { console.log(`${file}: ok`); return; }
  total += problems.length;
  const seen = new Set();
  for (const p of problems.sort((a, b) => a.line - b.line)) {
    const key = p.line + p.message; if (seen.has(key)) continue; seen.add(key);
    console.log(`${file}:${p.line}: ${p.message}`);
    console.log(`::error file=${file},line=${p.line},title=Article check::${p.message}`);
  }
}
if (total) { console.log(`\n${total} problem(s) found. Fix them and commit again; the checks rerun on their own.`); process.exit(1); }
