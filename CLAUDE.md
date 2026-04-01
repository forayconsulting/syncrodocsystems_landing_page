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

## Files
| File | Purpose |
|------|---------|
| `index.html` | Landing page. Nav, hero with animated counters, problem/solution accordions with screenshots, CTA, login modal, lightbox. |
| `styles.css` | All styling. Deconstructed clean / postmodern legal tech aesthetic. Cream background, terracotta + forest accents, serif/sans/mono font mix. Includes counter animations, scribble SVG draw-in, geometric decoration drift, accordion transitions, lightbox. |
| `script.js` | Accordion toggle, login modal, screenshot lightbox, animated tagline counters (backspace-retype effect with realistic pension fund document counts and ceilings). |
| `mock-comparison.html` | Standalone mockup of SPD Matrix cross-plan comparison view. Used to generate `screenshots/comparison.png`. Not deployed. |
| `mock-amendments.html` | Standalone mockup of amendment tracking view. Used to generate `screenshots/amendments.png`. Not deployed. |
| `mock-timeline.html` | Standalone mockup of minutes analysis timeline. Used to generate `screenshots/timeline.png`. Not deployed. |
| `mock-invoices.html` | Standalone mockup of invoice analysis dashboard (dark theme, Chart.js). Used to generate `screenshots/invoices.png`. Not deployed. |

## Deploy
```
npx wrangler pages deploy . --project-name syncrodoc-systems-homepage
```

## Conventions
- No em dashes in any frontend copy
- No AI-isms (avoid "revolutionary", "seamlessly", "unlock", "supercharge", etc.)
- All plan/vendor/case names in mockups are fictional to avoid client concern
- Design: warm cream (#F4F1EC), terracotta (#C2491D), forest (#2A4A4B). Instrument Serif headlines, Inter body, Space Mono labels.

## Warnings
- The `mock-*.html` files are for screenshot generation only. They are deployed to Cloudflare Pages alongside the landing page but are not linked from `index.html`.
- Login button and Request Access CTA are placeholders (open a "coming soon" modal). Will eventually route to per-client SPD Matrix instances.
- The product codebase lives separately at `/Desktop/spd_comparison`.
