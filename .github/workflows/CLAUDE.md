# workflows

GitHub Actions CI/CD pipeline for Cloudflare Pages deployment.

## Contents
| File | Purpose |
|------|---------|
| `deploy.yml` | Deploys to Cloudflare Pages on push to `main` (production) and on PRs (preview). Comments preview URL on PRs. |

## Pipeline Behavior
- **Trigger**: `push` to `main`, `pull_request` against `main`
- **Action**: `cloudflare/wrangler-action@v3` runs `wrangler pages deploy`
- **Branch routing**: `main` branch deploys to production. PR branches deploy to `<hash>.syncrodoc-systems-homepage.pages.dev` preview URLs.
- **PR comment**: On pull requests, a comment with the preview URL is posted via `actions/github-script@v7`.
- **Deploy scope**: Deploys the entire repo directory (`.`). The `_redirects` file ensures `mock-*.html` files redirect to `/` in production.

## Secrets Required
- `CLOUDFLARE_API_TOKEN`: API token with Workers/Pages edit scope
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID

## Warnings
- Uses `actions/checkout@v4` and `cloudflare/wrangler-action@v3` which run on Node.js 20. These will need updating before September 2026 when Node.js 20 is removed from GitHub Actions runners.
