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

## Secrets Required
- `CLOUDFLARE_API_TOKEN`: API token with Workers/Pages edit scope
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID

## Warnings
- The workflow deploys the entire repo directory (`.`), including `mock-*.html` files. These are not linked from the landing page but are technically accessible at their file paths on the deployed URL.
- Uses `actions/checkout@v4` and `cloudflare/wrangler-action@v3` which run on Node.js 20. These will need updating before September 2026 when Node.js 20 is removed from GitHub Actions runners.
