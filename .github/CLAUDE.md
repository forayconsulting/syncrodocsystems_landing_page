# .github

CI, content pipeline scripts, and the article template. Read this before touching any workflow.

## Contents
| Path | Purpose |
|------|---------|
| `CODEOWNERS` | `* @forayconsulting`. With the ruleset's "require code owner review", every PR needs Clayton's approval. |
| `workflows/deploy.yml` | Push to `main`: render articles, build lists, deploy to Cloudflare Pages (environment `production`), commit generated files back to `main` as `github-actions[bot]`. `permissions: contents: write`. Bot pushes use `GITHUB_TOKEN`, which never triggers workflows, so there is no loop. |
| `workflows/preview.yml` | `pull_request_target`, same-repo PRs only: check out `main`, check out PR head into `head/` as data, strip `_worker.js`, `functions/`, `_routes.json`, `.github/`, render and build lists inside `head/`, deploy `head` to Cloudflare branch `pr-<N>` (environment `preview`), comment direct links. |
| `workflows/content-lint.yml` | `pull_request_target`, job id `lint` (the required check). Fork PRs fail immediately with a plain message, before any checkout. Same-repo PRs: paths guard for non-owners, `lint-article.mjs` on changed sources, render + list build + html-validate on the result. **Never add a `paths:` filter and never rename the job.** |
| `scripts/lib.mjs` | Front-matter parser, slug regex, escape/decode, `jsonForScript` (safe JSON inside `<script>`), `scanBody` (marked token walk shared by linter and renderer: raw HTML, link scheme allow-list, empty link text), date formatting, article meta reader, `--root` handling. |
| `scripts/render-articles.mjs` | `articles/src/*.md` to `articles/<slug>.html` via `templates/article.html`. Template and script are always read from the checkout the script lives in (trusted), only the Markdown under `--root` is input. `--check` reports without writing. Deletes generated pages whose source is gone. |
| `scripts/build-article-lists.mjs` | Regenerates the `.pcard` blocks in `blog.html` and `index.html` (three newest) and `sitemap.xml`. Locates regions by marker text (`<div class="posts">`, `<div class="tiles posts">`, `<!-- ===== END ARTICLE LIST ===== -->`), never by line number. `--check` exits 1 if anything would change; a missing marker exits 2 and writes nothing. Entity values are decoded before re-escaping. |
| `scripts/lint-article.mjs` | Writer-facing checks. Emits `::error file=articles/src/<slug>.md,line=N` annotations (repo-relative paths so they land inline on the PR). |
| `scripts/paths-guard.mjs` | Reads `changed.tsv` (`status<TAB>path` from the PR files API); allows only `added`/`modified` `articles/src/<slug>.md`. |
| `scripts/vendor/marked.mjs` | Vendored marked 18.0.12 (MIT), unmodified ESM build. To bump: `npm pack marked@<ver>`, copy `package/lib/marked.esm.js` here, re-run the local dry run and diff the rendered article. |
| `templates/article.html` | Article page with `{{title}}`, `{{description}}`, `{{card}}`, `{{slug}}`, `{{date_iso}}`, `{{date_long}}`, `{{byline}}`, `{{author_json}}`, `{{title_json}}`, `{{modified_meta}}`, `{{modified_json}}`, `{{body}}`. All markup changes to article pages happen here. |
| `docs/blog-post-authoring-guide.md` | Internal reference for Clayton: plain-language publishing walkthrough for the writers and a paste-in prompt for Claude Code that formats a draft and opens the PR. Not served (`_redirects` covers `/.github/*`). Update its rule list when `lint-article.mjs` changes. |
| `htmlvalidate.json` | html-validate config, `root: true` so a config planted in a PR checkout is never merged. |

## Security model (why `pull_request_target`)
- Workflow definitions, scripts, template, and config always come from `main`. A writer cannot edit `content-lint.yml` or a script on their branch to make `lint` pass; such an edit runs as a plain `pull_request` workflow with a read-only token, fails the paths guard, and needs Clayton's approval anyway.
- The PR head is checked out into `head/` with `persist-credentials: false` and treated as data. **Nothing may execute from `head/`**: no `node head/...`, no `npm install` there, no `working-directory: head`, wrangler cwd stays the base checkout. `npx html-validate` runs from the base checkout with the trusted config.
- Cloudflare secrets live only in the `production` and `preview` environments, each with a deployment-branch policy allowing only `main`. `pull_request_target` runs evaluate environment rules against the default branch, so they get the secrets; `pull_request` runs from a writer's branch do not.
- Preview deploys go to Cloudflare branch `pr-<N>`, never `main`. Server-side code (`_worker.js`, `functions/`, `_routes.json`, wrangler config) is stripped from `head/`, and `_redirects`/`_headers` are overwritten with the copies from `main`, so a PR cannot change routing or response headers on the preview host. The rendered pages are validated before upload, and the renderer itself refuses raw HTML and non-https/relative links, so injected markup cannot reach the preview or production.
- The paths guard is skipped when the PR author is the repository owner. A Write collaborator could push to an owner-authored branch and bypass the guard, but Clayton's approval is dismissed on every push, so nothing merges without him re-reviewing the exact diff.
- `render-articles.mjs` is the last line of defense: it fails on raw HTML, `javascript:`/`data:` links, bad front matter, and escapes `<`, `>`, `&` inside the JSON-LD block, independent of the linter.
- Fork PRs: `preview` skips them (job `if`), `lint` fails them with a message before checking anything out. The repo also has "require approval for all external contributors", which does not apply to `pull_request_target` runs but covers any future `pull_request` workflow.

## Ruleset `protect-main` (repository settings, not in the repo)
Branch ruleset on the default branch: block deletion and force push; require a PR with one approval, code-owner review, stale approvals dismissed on push, squash merge only; required status check `lint`. Bypass actors: repository admin (Clayton, always) and the GitHub Actions app (integration 15368, always, needed for the bot commit in `deploy.yml`). Inspect with `gh api repos/forayconsulting/syncrodocsystems_landing_page/rules/branches/main`.

## Warnings
- Renaming job `lint` or adding `paths:` to `content-lint.yml` blocks every merge with "Expected, waiting for status".
- `deploy.yml` needs `contents: write` and the Actions app in the ruleset bypass list, or the commit-back step fails (the deploy itself still succeeds).
- The generator only recognizes generated pages by their `<!-- generated from articles/src/` marker. A hand-written `articles/*.html` without a source is listed but never deleted.
