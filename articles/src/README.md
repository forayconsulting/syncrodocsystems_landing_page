# Writing an article for the SyncroDoc blog

Everything happens on this website, in the browser. Nothing to install, no files to email.

## One-time setup

1. Accept the GitHub invitation email within a week of receiving it, before doing anything else.
2. Sign in and open this folder: `articles/src`. Bookmark it.
3. Turn on two-factor authentication in your GitHub settings (Settings, Password and authentication).

If any page ever says "fork" or "You're creating a file in a fork", stop and tell Clayton. It means the invitation was not accepted in time.

## Writing a new article

1. In this folder, click **Add file**, then **Create new file**.
2. In the name box, type the web address you want, lowercase with hyphens, ending in `.md`. Example: `why-amendments-get-missed.md`. That becomes `syncrodocsystems.com/articles/why-amendments-get-missed`.
3. Paste this starter block into the big text box and fill it in:

```
---
title: Your headline
description: One or two sentences on what the article covers. Search engines show this, and it is the text on the blog and homepage cards.
author: Your Name
date: YYYY-MM-DD
---
Your first paragraph. It is shown larger, as the lead.

Your next paragraph. Leave a blank line between paragraphs.

## A section heading

More paragraphs. You can use **bold**, *italic*, and [link text](https://example.com).

- A bullet point
- Another bullet point

> A pull quote, or a line worth setting apart.
```

   Keep the four header lines between the `---` lines. Replace `YYYY-MM-DD` with today's date in that form, for example `2026-09-11`. Do not put quote marks around the values. A pull quote works for a single paragraph; a longer quote shows as a plain indented block.

4. Click **Commit changes...** (top right). Keep the suggested message. Select **Create a new branch for this commit and start a pull request**. If a "Commit directly to the main branch" option is shown, do not pick it; the site is set up so that will not work. Click **Propose changes**.
5. On the next page, click **Create pull request**. Your draft is submitted.

## What happens next

Within a few minutes, two checks appear on your pull request, listed as **Content lint / lint** and **Preview / Preview**. Only **lint** decides whether your article can be published.

- If **lint** is red, fix what it says (below). Preview will be red too until lint is green; that is expected.
- If **lint** is green and **Preview** is red, the problem is on the hosting side, not in your article. Tell Clayton.
- When both are green, a comment starting "Preview deployed" appears with a direct link to your article, the blog page, and the homepage. This is exactly how it will look once published.

**If lint shows a red X:** click **Details**. The problems are listed under Annotations at the top, each with the line number and what to change. To fix: open the **Files changed** tab, click the **...** menu on your file, choose **Edit file**, make the change, and click **Commit changes**. The checks run again on their own.

**Review:** Clayton reads every article before it goes live. A "Changes requested" label means he is waiting on you, nothing is broken. If he leaves a suggestion, click **Commit suggestion**. If he leaves a comment, edit the file as above. Then click the circular arrows next to his name under **Reviewers** so he knows to look again.

**Publishing:** leave the Merge button to Clayton. Once he merges, the article is live within a few minutes, and the blog page, homepage, and sitemap update by themselves. If you looked at the blog page earlier that day, reload it with a hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows) or open it in a private window.

## Fixing a published article

Open your `.md` file in this folder, click the pencil icon, make the change, and commit it to a new branch as in step 4. Same checks, same review.

## House rules

- No real client, plan, fund, or vendor names. Use fictional ones.
- US spelling.
- No long dashes. The checker rejects them; use a comma, a period, or a plain hyphen.
- No hype words. The checker names any it finds (for example "seamless", "leverage", "unlock").
- No HTML tags. Markdown only, as in the starter block.
- To link to a page on this site, use a relative address: `../index.html#start` or `../blog.html`.

You never need to touch anything outside this folder. The article page, the blog list, the homepage tiles, and the sitemap are generated automatically.
