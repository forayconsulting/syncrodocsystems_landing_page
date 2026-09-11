# articles

Insights blog posts, one static HTML file per article. The filename is the public URL (`/articles/<name>.html`, served by Cloudflare Pages as `/articles/<name>` too).

## Contents
| File | Purpose |
|------|---------|
| `_TEMPLATE.html` | Starting point for a new article. Six marked lines in the head (title, description, canonical, og:title, og:description, `article:published_time`), then eyebrow, h1, byline, body, `.post-cta` block. Set to `noindex, nofollow` and 302-redirected to `/blog` by `_redirects`, so it is never a live page. |
| `what-a-plan-document-tool-must-do.html` | The one published article (26 August 2026, bylined "SyncroDoc Systems"). Four requirements for any plan document tool: full-context reading, structural mapping, provenance, repeatability. Carries an `Article` JSON-LD block that the template does not. |

## Relationships
- **Parent**: sub-page of the marketing site. Shares `../article.css` (header, footer, `.post` typography, `.pcard` cards) and `../logo.png` with `../blog.html` and `../deck.html`.
- **Listed in**: `../blog.html` (full list) and the `#insights` section of `../index.html` (three newest). Both lists are hand-edited `<a class="pcard">` blocks between `<!-- ===== ARTICLE LIST ===== -->` markers. A new article is invisible until it is pasted into both.
- **Indexed by**: `../sitemap.xml` (add a `<url>` with `lastmod`) and `../llms.txt` (points at the blog index, not individual articles).

## Conventions
- New article: copy `_TEMPLATE.html`, name it lowercase-with-hyphens, edit the six marked head lines, delete the marker comment, write the body with `<p>`, `<h2>`, `<ul>`, `<blockquote>`. Copy the `Article` JSON-LD block from the published article and update headline, date, author, and URL.
- All asset and link paths are relative with a `../` prefix (`../index.html#start`, `../blog.html`). Do not use absolute site URLs except in `canonical` and JSON-LD.
- Byline pattern: `By Author Name &nbsp;·&nbsp; <time datetime="YYYY-MM-DD">D Month YYYY</time>`. The published piece uses a company byline; a named founder byline is preferred for future pieces.
- Page `<title>` follows `Article title — SyncroDoc`. That separator is the only em dash allowed; prose copy uses none.
- US spelling. No client, plan, or vendor names.
- Keep every article static HTML. These pages are the site's best chance at search and answer-engine hits, so nothing here may depend on JavaScript to render.

## Warnings
- `_TEMPLATE.html` must keep its `noindex` meta and its `_redirects` entry. It is deployed with everything else because Cloudflare Pages uploads the whole directory.
- Changing the published article's filename breaks the canonical, sitemap, both card lists, and any inbound links. Add a redirect in `../_redirects` if a rename is unavoidable.
