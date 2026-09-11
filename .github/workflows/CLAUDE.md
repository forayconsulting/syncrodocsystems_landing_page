# workflows

GitHub Actions pipeline that deploys the static site to Cloudflare Pages.

## Contents
| File | Purpose |
|------|---------|
| `deploy.yml` | Deploys to Cloudflare Pages on push to `main` (production) and on pull requests (preview). Comments the preview URL on PRs. |

## Pipeline Behavior
- **Trigger**: `push` to `main`, `pull_request` against `main`.
- **Action**: `cloudflare/wrangler-action@v3` runs `wrangler pages deploy . --project-name=syncrodoc-systems-homepage --branch=<branch>`.
- **Branch routing**: `main` deploys to production (`syncrodocsystems.com`). PR branches deploy to `<hash>.syncrodoc-systems-homepage.pages.dev`.
- **PR comment**: `actions/github-script@v7` posts the preview URL from the deploy step's `deployment-url` output.
- **Deploy scope**: the whole repo directory, including `CLAUDE.md` files, `_redirects`, `deck/`, `articles/`, and the PDF. There is no build step and no exclusion list, so anything committed to the repo root is publicly fetchable. Keep source files like the deck `.pptx` out of the repo.

## Secrets Required
- `CLOUDFLARE_API_TOKEN`: API token with Workers/Pages edit scope.
- `CLOUDFLARE_ACCOUNT_ID`: `9417d8e9fe191fdc397a487f65906962`.

## Relationships
- **Manual equivalent**: `npx wrangler pages deploy . --project-name syncrodoc-systems-homepage --branch main --commit-dirty=true`, documented in the root `CLAUDE.md`. The September 2026 redesign was first published this way from an uncommitted working tree; the next push to `main` redeploys the same content through this workflow.
- **Redirects**: `_redirects` at the repo root is uploaded with every deploy and handles `about.html`, `/about`, the legacy `mock-*.html` URLs, and `articles/_TEMPLATE.html`.

## Warnings
- `actions/checkout@v4` and `cloudflare/wrangler-action@v3` were flagged earlier as Node.js 20 based, with GitHub's Node 20 retirement expected around September 2026. That date has arrived. Check the workflow log on the next push and bump the action versions if a runner deprecation warning or failure appears.
- A failed deploy on `main` leaves the previous production deployment live. Cloudflare Pages does not roll back on its own, so re-run the job or deploy manually after fixing the cause.
