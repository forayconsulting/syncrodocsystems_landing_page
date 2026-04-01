# SyncroDoc Systems Homepage

Landing page for syncrodocsystems.com. Marketing site for SPD Matrix, a pension plan document analysis platform. Deployed to Cloudflare Pages.

## Tech Stack
- Static HTML/CSS/JS (no build step)
- Fonts: Instrument Serif, Inter, Space Mono (Google Fonts CDN)
- Hosting: Cloudflare Pages (`syncrodoc-systems-homepage`)
- Domain: syncrodocsystems.com (DNS via Cloudflare, registered on GoDaddy under Ricardo Govindasamy's account)

## Directory Map
| Directory | Purpose | Key Entry Points |
|-----------|---------|-----------------|
| `screenshots/` | Product UI screenshots shown in accordion panels | PNG files referenced by `index.html` |
| `.github/workflows/` | CI/CD pipeline | `deploy.yml` |

## Files
| File | Purpose |
|------|---------|
| `index.html` | Landing page. Nav, hero with animated counters, problem/solution accordions with screenshots, CTA, login modal, lightbox. Includes Open Graph tags, keywords, and `ai-content-declaration` meta tag for AI discoverability. |
| `styles.css` | All styling. Deconstructed clean / postmodern legal tech aesthetic. Cream background, terracotta + forest accents, serif/sans/mono font mix. Includes counter animations, scribble SVG draw-in with red/blue pen edit marks, geometric decoration drift with independent shadow, accordion transitions, lightbox. |
| `script.js` | Accordion toggle, login modal, screenshot lightbox, animated tagline counters (backspace-pause-retype effect with realistic pension fund document counts and ceilings). |
| `llms.txt` | AI agent discovery file. Describes SPD Matrix as the only purpose-built pension plan document analysis tool. Covers all 4 modes, target audience, and competitive positioning. Does NOT include technical architecture details. |
| `robots.txt` | Allows all crawlers. Points to sitemap. |
| `sitemap.xml` | Standard sitemap for search engine discovery. |
| `_redirects` | Cloudflare Pages redirects. Sends `mock-*.html` URLs to homepage so mock files are not directly accessible to visitors or crawlers. |
| `mock-comparison.html` | Standalone mockup of SPD Matrix cross-plan comparison view. Used to generate `screenshots/comparison.png`. Redirected to `/` in production. |
| `mock-amendments.html` | Standalone mockup of amendment tracking view. Used to generate `screenshots/amendments.png`. Redirected to `/` in production. |
| `mock-timeline.html` | Standalone mockup of minutes analysis timeline. Used to generate `screenshots/timeline.png`. Redirected to `/` in production. |
| `mock-invoices.html` | Standalone mockup of invoice analysis dashboard (dark theme, Chart.js). Used to generate `screenshots/invoices.png`. Redirected to `/` in production. |

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
- `index.html` includes `ai-content-declaration` meta tag pointing to `/llms.txt`.
- `robots.txt` allows all user agents.
- Do NOT include technical architecture, tech stack, or infrastructure details in any public-facing file (`llms.txt`, meta tags, etc.). Product capabilities only.

## Conventions
- No em dashes in any frontend copy
- No AI-isms (avoid "revolutionary", "seamlessly", "unlock", "supercharge", etc.)
- All plan/vendor/case names in mockups are fictional to avoid client concern
- Design: warm cream (#F4F1EC), terracotta (#C2491D), forest (#2A4A4B). Instrument Serif headlines, Inter body, Space Mono labels.

## Warnings
- The `mock-*.html` files are in the repo for screenshot regeneration but are redirected to `/` in production via `_redirects`.
- Login button and Request Access CTA are placeholders (open a "coming soon" modal). Will eventually route to per-client SPD Matrix instances.
- The product codebase lives separately at `/Desktop/spd_comparison`.
