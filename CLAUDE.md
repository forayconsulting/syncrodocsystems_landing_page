# SyncroDoc Systems Homepage

Marketing site for syncrodocsystems.com. SyncroDoc is a plan document and contract analysis platform for the benefits industry. Deployed to Cloudflare Pages.

## Tech Stack
- Static HTML/CSS/JS (no build step, no CMS)
- Fonts: Source Serif 4, IBM Plex Sans, IBM Plex Mono (Google Fonts CDN)
- Hosting: Cloudflare Pages (`syncrodoc-systems-homepage`)
- Domain: syncrodocsystems.com (DNS via Cloudflare, registered on GoDaddy under Ricardo Govindasamy's account)

## Architecture Overview
Flat static site with no build step. `index.html` is the whole homepage in one self-contained file. Three sub-pages (`blog.html`, `deck.html`, every file in `articles/`) share `article.css` and `logo.png`. `deck/` holds images generated from the PDF; `screenshots/` holds only founder headshots. `_redirects` is the only routing logic. Every directory has its own `CLAUDE.md` with file-level detail; read it before editing there.

## Directory Map
| Directory | Purpose | Key Entry Points |
|-----------|---------|-----------------|
| `articles/` | Blog articles, one HTML file each | `_TEMPLATE.html` (copy to start a new article), `what-a-plan-document-tool-must-do.html` |
| `deck/` | Slide images for `deck.html`, rendered from the PDF, never hand-edited | `slide-01.webp` through `slide-11.webp` |
| `screenshots/` | Founder headshots only | `joey_headshot.jpeg`, `ricardo_headshot.jpeg`, `clayton_headshot.jpeg` |
| `.github/workflows/` | GitHub Actions deploy to Cloudflare Pages | `deploy.yml` |

## Files
| File | Purpose |
|------|---------|
| `index.html` | Single-page homepage. Self-contained: inline CSS and JS, icons embedded as data URIs, JSON-LD `SoftwareApplication` and `FAQPage` blocks in the head. Sections in order: `#top` hero, `#stakes`, `#how`, `#roi` (calculator), `#why` (chatbot comparison), `#security`, `#team` (headshots from `screenshots/`), `#insights` (three newest articles), `#start` (CTA tiles, including the deck download). Login modal redirects to `{slug}.syncrodocsystems.com`. |
| `blog.html` | Insights index. Full list of articles as `<a class="pcard">` blocks. |
| `article.css` | Shared styles for `blog.html`, every article, and `deck.html`. |
| `articles/_TEMPLATE.html` | Starting point for a new article. Six marked lines in the head (title, description, canonical, og:title, og:description, date), then headline, byline, body. |
| `deck.html` | Static slide viewer for the platform overview. Shows `deck/slide-*.webp` and links to the PDF. |
| `SyncroDoc-Platform-Overview.pdf` | 11-page public deck. Linked from `index.html` and `deck.html` with a `?v=` cache-busting string. |
| `logo.png` | Navy wordmark used by the sub-pages (blog, articles, deck). The homepage embeds its own. |
| `og-image.jpg` | 1200x630 social preview image (cropped from deck slide 1). Referenced by og:image and twitter:image in `index.html`. |
| `llms.txt` | Plain-text brief for answer engines: workflows, differentiators, chatbot comparison, security, human review, team. Product capabilities only. |
| `robots.txt` | Allows all crawlers, with explicit allows for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended. Points to the sitemap. |
| `sitemap.xml` | Lists `/`, `blog.html`, each article, and `deck.html`. |
| `_redirects` | Cloudflare Pages redirects. `about.html` and `/about` 301 to `/#team`. Legacy `mock-*.html` URLs 302 to `/`. `articles/_TEMPLATE.html` 302 to `/blog` (the template is also `noindex`). |

## Content workflows

**Adding an article**
1. Copy `articles/_TEMPLATE.html` to `articles/your-article-name.html` (lowercase, hyphens; the filename is the URL).
2. Edit the six marked head lines, then the headline, byline, and body (`<p>`, `<h2>`, `<ul>`, `<blockquote>`).
3. Paste one `<a class="pcard">` block into `blog.html` and into the `#insights` section of `index.html`. Both have `<!-- ===== ARTICLE LIST ===== -->` markers. Newest first. Keep the homepage to the three newest; the rest live on `blog.html` only.
4. Add the URL to `sitemap.xml`.

Article lists are hand-edited HTML on purpose so crawlers and answer engines index them. Do not move them to JSON or client-side rendering.

**Regenerating the deck**
1. Replace `SyncroDoc-Platform-Overview.pdf`.
2. Render slides:
   ```
   pdftoppm -r 150 -png SyncroDoc-Platform-Overview.pdf slide
   for f in slide-*.png; do magick "$f" -resize 1600x -quality 82 deck/${f%.png}.webp; done
   ```
   Delete the intermediate PNGs. If the page count changes, update the slide list in `deck.html`.
3. Bump the `?v=` string on the PDF links in both `index.html` and `deck.html`. Cloudflare and browsers cache PDFs aggressively; without a new string, visitors keep getting the old file.

**Founder photo framing**
Each `.shot` in `#team` accepts inline CSS vars: `--zoom` (1 is untouched, higher crops all edges) and `--shift` (negative percentage pulls the photo up). Nudge `--shift` in 2% steps to line up heads. The grayscale treatment is one line in `.person .shot img`.

## Development
- **Build**: none. Edit files in place.
- **Preview**: `python3 -m http.server 8000` from the repo root, then open `http://localhost:8000/`. Cloudflare-only behavior (`_redirects`, clean URLs without `.html`) does not apply locally.
- **Deploy**: push to `main` (see CI/CD below), or manually with `npx wrangler pages deploy . --project-name syncrodoc-systems-homepage --branch main --commit-dirty=true`.
- **Verify a deploy**: `curl -sI -H 'Cache-Control: no-cache' https://syncrodocsystems.com/` and check the `<title>`; Cloudflare caches aggressively, so append `?nocache=<timestamp>` when opening in a browser.

## CI/CD & Deployment

**GitHub repo**: `forayconsulting/syncrodocsystems_landing_page`

**Automated (preferred):**
- Push to `main` triggers `.github/workflows/deploy.yml`, which deploys to production via Wrangler.
- PRs against `main` create preview deployments with unique URLs (e.g., `<hash>.syncrodoc-systems-homepage.pages.dev`). The preview URL is commented on the PR automatically.
- Merging a PR triggers a production deploy.

**Manual (escape hatch):**
```
npx wrangler pages deploy . --project-name syncrodoc-systems-homepage
```

**Cloudflare Pages project**: `syncrodoc-systems-homepage`
- Production URL: `https://syncrodoc-systems-homepage.pages.dev`
- Custom domains: `syncrodocsystems.com`, `www.syncrodocsystems.com`
- Account: `clayton@foray-consulting.com` (ID: `9417d8e9fe191fdc397a487f65906962`)

**GitHub Secrets** (required by the workflow):
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Workers/Pages edit permissions
- `CLOUDFLARE_ACCOUNT_ID`: `9417d8e9fe191fdc397a487f65906962`

**DNS**: Managed by Cloudflare. Nameservers (`sima.ns.cloudflare.com`, `yahir.ns.cloudflare.com`) configured in GoDaddy under Ricardo Govindasamy's account (Clayton has delegate access). Root domain uses a CNAME flattened to `syncrodoc-systems-homepage.pages.dev`.

## AI Discoverability
- Cloudflare AI Crawl Control set to "Do not block (allow crawlers)" and "Block AI Bots" security rule disabled.
- `llms.txt` at site root provides structured product context for AI agents.
- `index.html` carries JSON-LD `SoftwareApplication` and `FAQPage` blocks plus canonical, robots, author, Open Graph, and Twitter-card meta tags.
- `robots.txt` allows all user agents and names the major AI crawlers explicitly.
- Articles are the pages most likely to earn a search or answer-engine hit. Keep them static HTML.
- Do NOT include technical architecture, tech stack, or infrastructure details in any public-facing file (`llms.txt`, meta tags, JSON-LD, deck, articles). Product capabilities only.

## Conventions
- No em dashes in any frontend copy
- No AI-isms (avoid "revolutionary", "seamlessly", "unlock", "supercharge", etc.)
- All plan/vendor/case names in examples and mockups are fictional to avoid client concern
- Design: white background, navy (#1E2761), amber (#E9A13B), ink (#0F1730). Source Serif 4 headlines, IBM Plex Sans body, IBM Plex Mono labels and citation chips. Small uppercase label above every section heading; content lives in tiles and cards.
- Homepage is one self-contained file. Keep new styles and scripts inline in `index.html`; sub-pages share `article.css`.

## Warnings
- The source `.pptx` for the deck is NOT in the repo and must stay out of the public site. Only the PDF and the rendered `deck/*.webp` slides are published.
- The public deck omits architecture and pricing slides on purpose. Do not add them back.
- Security claims on the page (availability figure, response tiers, deletion and notification windows) come from the draft MSA. Confirm with Clayton and counsel before changing or adding any.
- Login button and Request Access CTA open a workspace slug form that redirects to `{slug}.syncrodocsystems.com`. The slug is stripped to letters, numbers, and hyphens. Each client gets a subdomain (e.g., `wpf.syncrodocsystems.com`) backed by a separate Cloudflare Pages deployment with its own Cloudflare Access policy, database, and R2 bucket. The marketing site never validates slugs or reveals which workspaces exist.
- `about.html`, `styles.css`, `script.js`, the `mock-*.html` files, and the product screenshot PNGs were removed in the redesign. `_redirects` keeps the old URLs from 404ing.
- Contact address is `info@syncrodocsystems.com` (request-access button, login modal hint, footer).
- The product codebase lives separately at `/Desktop/spd_comparison`.
