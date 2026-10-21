# products

The SyncroDoc suite: one suite page and one landing page per product. Hand-written static HTML, no generator. Served at `/products/` and `/products/<slug>/` (Cloudflare Pages serves each `index.html` as its folder URL).

## Contents
| Path | Purpose |
|------|---------|
| `index.html` | Suite page. Product cards grouped by "Plan documents" and "Governance and oversight", a "different document problem" tile, the annual-license note, and the shared-core tiles. JSON-LD `ItemList`. |
| `plan-operations-audit/index.html` | Carrier benefit summary checked against the plan build used for claims setup. |
| `plan-merger-document-tool/index.html` | Plans in a merger compared provision by provision. |
| `meeting-minutes-intelligence/index.html` | Board decisions found and cited across years of minutes. |
| `fee-audit-tool/index.html` | Professional fees audited line by line over time. |
| `products.css` | Layout for these pages plus the demo window styles (`.dm*`, `.au-*`, `.mg-*`, `.mm-*`, `.fa-*`). Loads after `/article.css` and uses its tokens. |
| `demo.js` | `sdDemo(root, steps, holdMs)`: runs `[delayMs, fn]` steps in a loop while the demo is on screen. Helpers `sdDemo.on`, `.count`, `.type`, `.money`. Under reduced motion every step runs once and the final state stays. |

## Product page template
Every product page has the same sections in order: hero (breadcrumb eyebrow, h1, sub, CTAs, audience line, demo), Who it's for, The problem, What it does, What you get, How it works (links `/#how`), trust strip (links `/#security`), related products (the other live products), closing CTA, footer with the product list. Copy changes go straight into the page.

Each demo is a simplified rebuild of the real app's results view with fictional data. Elements with class `h` or `pop` start hidden and the page's inline script adds `on`. The demo root has `role="img"` and an `aria-label` describing what it shows. Keep the caption "Illustrative example".

## Adding or changing a product
1. Copy an existing product folder, rename it to the new slug, and edit the copy, meta tags, canonical URL, JSON-LD, mailto subject, and demo.
2. Add the product to: the suite page, the `#products` grid in `../index.html`, the footer `.foot-prods` list and related-products cards on every product page, and the Products section of `../llms.txt`.
3. The sitemap picks up any `products/<slug>/index.html` on the next run of `../.github/scripts/build-article-lists.mjs`.

## Conventions
- Root-absolute links (`/article.css`, `/products/...`) because pages sit two levels deep.
- No client, carrier, fund, firm or staff names in copy or demos. No pricing. No "use case" or "workflow" wording. No em dashes.
- Add a product page only after the product is confirmed with the founders.

## Warnings
- This file is served publicly at `/products/CLAUDE.md`. Keep internal plans out of it.
- Headers and footers are duplicated across the 5 pages here plus `../blog.html`, `../deck.html`, `../index.html` and `../.github/templates/article.html`. A nav change touches all of them.
- Product claims must match what the app does. Check the product app before describing a new capability.
