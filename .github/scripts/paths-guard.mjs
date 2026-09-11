// Fail if a content pull request touches anything other than adding or editing articles/src/<slug>.md.
// Usage: node .github/scripts/paths-guard.mjs changed.tsv   (lines of "status<TAB>path" from the PR files API)
import fs from 'node:fs';
const ALLOWED = /^articles\/src\/[a-z0-9]+(-[a-z0-9]+)*\.md$/;
const rows = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(l => l.split('\t'));
let bad = 0;
for (const [status, file] of rows) {
  if ((status === 'added' || status === 'modified') && ALLOWED.test(file)) continue;
  bad++;
  const inSrc = /^articles\/src\/[^/]+$/.test(file);
  const base = file.split('/').pop();
  let msg;
  if (inSrc && base === 'README.md') msg = 'README.md is the writer guide; ask Clayton to change it.';
  else if (inSrc && (status === 'removed' || status === 'renamed') && /\.md$/i.test(base)) msg = `${status === 'removed' ? 'Deleting' : 'Renaming'} an article is done by Clayton. Open the existing file and edit it instead, or ask him.`;
  else if (inSrc && !/\.md$/i.test(base)) msg = `Only text articles can be added here; images and other attachments are not supported yet (${file}).`;
  else if (inSrc) msg = `The file name must be lowercase letters, numbers, and hyphens and end in .md, for example why-amendments-get-missed.md (got "${base}"). Open Files changed, use the ... menu, Edit file, and change the name in the box at the top.`;
  else msg = `Not allowed in a content pull request: ${file} (${status}). Writers may only add or edit articles/src/<name>.md; the article pages, blog list, homepage tiles, and sitemap are generated automatically.`;
  console.log(`::error::${msg}`);
}
if (bad) process.exit(1);
console.log(`paths ok: ${rows.length} file(s), all under articles/src/`);
