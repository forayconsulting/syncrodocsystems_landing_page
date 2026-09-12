# Blog post authoring guide

Internal reference for Clayton. Two parts: a plain-language explanation of how the writers (Joey and Ricardo) publish articles, and a prompt they can paste into Claude Code on the web to have Claude do the formatting and git work for them.

Not served on the live site: `_redirects` sends `/.github/*` to the homepage. Keep it that way.

Source of truth for the rules quoted below: `.github/scripts/lint-article.mjs`, `.github/scripts/paths-guard.mjs`, `.github/workflows/content-lint.yml`, `.github/workflows/preview.yml`, and `articles/src/README.md`. If any of those change (especially the banned word list or the length limits), update the prompt in part 2 to match.

---

## Part 1: How publishing works, for the writers

### The short version

You never install anything. You go to one folder on GitHub in your browser, create one text file, and click a few buttons. The website builds itself from that file. Clayton reads it and clicks Merge. A few minutes later the article is live, and the blog page, the homepage tiles, and the site map are all updated without anyone touching them.

### What GitHub actually is, in plain terms

GitHub is a shared filing cabinet for the website's files, with two rules that make it safe for several people to use at once.

**Rule one: every change is a proposal, not an edit.** When you change a file, you are not editing the live copy. GitHub makes you a private copy of the whole cabinet, you change your file there, and you then ask for your copy to be folded back into the real one. That request is called a **pull request**. Think of it as "here is my draft, please take it." Nothing on the website changes until someone accepts it.

**Rule two: every accepted change is recorded forever.** Each time a change is accepted, GitHub saves a snapshot with a note about what changed and who did it. That snapshot is called a **commit**. You can always look back at what the file said last week, and nothing can be lost by accident.

Two words you will see on screen:

- **main** is the real cabinet. What is in main is what is on the website.
- **branch** is your private copy. GitHub names it for you. You do not need to remember the name.

That is the whole model. Private copy, ask to fold it in, someone accepts it, it is recorded.

### One-time setup

1. Clayton sends a GitHub invitation by email. Accept it within seven days. If you wait longer it expires and he has to send it again.
2. Sign in and go to the folder `articles/src` in the repository `forayconsulting/syncrodocsystems_landing_page`. Bookmark that page. It is the only page you need.
3. Turn on two-factor authentication under Settings, then Password and authentication.

If any screen ever mentions "fork" or says "You're creating a file in a fork," stop and tell Clayton. It means the invitation did not take, and the checks will reject the article on purpose.

### Writing an article

1. In the `articles/src` folder, click **Add file**, then **Create new file**.
2. In the name box, type the web address you want, all lowercase, words joined by hyphens, ending in `.md`. Example: `why-amendments-get-missed.md`. That becomes `syncrodocsystems.com/articles/why-amendments-get-missed`. The name is the address, so choose it before you start.
3. Paste this block into the large text area and fill it in:

```
---
title: Your headline
description: One or two sentences on what the article covers. This is the text on the blog and homepage cards.
author: Your Name
date: 2026-09-12
---
Your first paragraph. It is shown larger, as the lead.

Your next paragraph. Leave a blank line between paragraphs.

## A section heading

More paragraphs. You can use **bold**, *italic*, and [link text](https://example.com).

- A bullet point
- Another bullet point

> A pull quote, or a line worth setting apart.
```

   The four lines between the `---` markers are the header. Keep all four. The date is year-month-day with hyphens. No quote marks around any value.

4. Click **Commit changes...** at the top right. A box appears. Keep the suggested message. Choose **Create a new branch for this commit and start a pull request**. Do not choose "Commit directly to the main branch" if it is offered. The site is set up to refuse that. Click **Propose changes**.
5. On the next page click **Create pull request**. Your draft is now submitted.

In filing-cabinet terms: step 4 made your private copy and saved a snapshot in it. Step 5 asked for it to be folded into the real one.

### What happens next, and why

Within a few minutes two automatic checks run on your draft. They show up on the pull request page as **Content lint / lint** and **Preview / Preview**.

**lint** is the proofreader. It reads only your file and looks for specific problems:

- header lines missing, a date in the wrong form, a date in the future, or a placeholder left in
- the description shorter than 50 or longer than 300 characters
- long dashes of any kind
- hype words from a fixed list, such as "seamless", "leverage", "unlock", "revolutionary", "empower", "delve", "game-changer"
- HTML tags, code blocks, or a single `#` heading
- a link to the full `https://syncrodocsystems.com` address instead of a relative one

It also confirms your pull request touches nothing but your own article file. Nothing else in the site can be changed by a writer, even by accident.

**Preview** builds the actual pages and puts them on a temporary web address. When it finishes, a comment appears on your pull request starting "Preview deployed" with direct links to your article, the blog page, and the homepage. That is exactly how it will look when published.

How to read the two:

- lint red: something in your file needs fixing. Preview will also be red until lint is green. That is expected.
- lint green, Preview red: the hosting side had a problem, not your article. Tell Clayton.
- both green: open the preview links and check your work.

**Fixing a red lint.** Click **Details** next to it. The problems are listed at the top under Annotations, each with a line number and a plain sentence saying what to change. Then go to the **Files changed** tab, click the **...** menu on your file, choose **Edit file**, make the change, and click **Commit changes**. That adds another snapshot to your private copy. The checks run again on their own.

### Review and publishing

Clayton reads every article before it goes live. GitHub is set up so nothing reaches the website without his approval, and a fresh edit after his approval cancels it so he has to look again. That is not a formality. It is the mechanism.

- If he leaves a **suggestion**, it appears as a proposed replacement with a **Commit suggestion** button. Click it and the change is made for you.
- If he leaves a **comment**, edit the file the same way as fixing a lint problem.
- After you have responded, click the circular arrows next to his name under **Reviewers**. That tells him to look again.
- "Changes requested" is a label, not an error. It means he is waiting on you.

Leave the **Merge** button to Clayton. When he clicks it, your private copy is folded into main, and that triggers the publish. Within a few minutes the article is live. The blog list, the three newest tiles on the homepage, and the site map are regenerated at the same time. Nobody edits those by hand.

If you looked at the blog page earlier that day and the new article is missing, your browser is showing you a saved copy. Hard refresh with Cmd+Shift+R on a Mac or Ctrl+Shift+R on Windows, or open it in a private window.

### Editing a published article

Open your `.md` file in `articles/src`, click the pencil icon, make the change, and commit it to a new branch exactly as in step 4. Same checks, same review, same merge. Deleting or renaming an article is not something the checks allow a writer to do. Ask Clayton.

### House rules the checker enforces

- No real client, plan, fund, or vendor names. Use fictional ones.
- US spelling.
- No long dashes. Use a comma, a period, or a plain hyphen.
- No hype words.
- No HTML. Markdown only, as in the starter block.
- Links to other pages on the site use a relative address: `../blog.html` or `../index.html#start`.

### Things you do not need to know but might wonder about

- The pages on the site are not the file you wrote. A script turns the Markdown into a styled HTML page using a template that Clayton controls. That is why you never need to think about design.
- The scripts and checks always run from the real cabinet, never from a writer's copy. A writer cannot change the rules by editing them in their draft.
- The two writers can only add or edit files in `articles/src`. Anything else in a pull request fails the check with a message saying so.
- Every article ever published, and every draft of it, is kept in the history. Nothing is lost.

---

## Part 2: A prompt for Claude Code

The prompt below is written for Claude Code on the web (claude.ai/code) with the repository connected. That is the only setup where Claude can do the git work itself. Pasted into plain claude.ai chat, the fallback section at the end still produces a finished file and click-by-click instructions.

### Instructions for the writer

1. Open claude.ai/code, choose the repository `forayconsulting/syncrodocsystems_landing_page`, and start a new session.
2. Paste the whole prompt below, then paste your draft underneath the line that says `DRAFT STARTS HERE`.
3. Send it and answer any questions Claude asks. When Claude reports a pull request link, open it and wait for the two checks and the preview comment.

### The prompt

```
You are helping me publish an article on the SyncroDoc Systems blog. I am a writer, not a developer. I am giving you my draft below. Your job is to turn it into the one file the site accepts, check it against the site's rules, and open a pull request for Clayton to review. Do not do anything beyond that.

## Where things live

Repository: forayconsulting/syncrodocsystems_landing_page
Default branch: main
Articles are Markdown files in articles/src/. One file per article. The file name is the web address: articles/src/why-amendments-get-missed.md becomes syncrodocsystems.com/articles/why-amendments-get-missed.
Read articles/src/README.md and articles/src/what-a-plan-document-tool-must-do.md first. The README is the writer guide and the other file is a finished article that passed every check. Match its shape.

## Hard limits

- Create or edit exactly one file: articles/src/<slug>.md. Touch nothing else. A pull request from me that changes any other file is rejected automatically by the paths guard.
- Never commit to main. Never merge. Never push to any branch other than the one you create for this article.
- Do not run the render or list-build scripts and commit their output. The article pages, blog list, homepage tiles, and sitemap are generated on the server after merge. If you run them locally to preview, discard the generated changes before committing so only my one .md file is in the commit.
- Do not fork the repository. If your git setup would create a fork, stop and tell me.
- Keep my voice and my argument. Fix formatting, structure, and rule violations. Do not rewrite sentences for style, add content, or remove points without asking me first. If a sentence must change to pass a rule, change as little as possible and tell me what you changed and why.
- No real client, plan, fund, vendor, or person names in examples. If my draft has any, flag them and propose a fictional replacement before proceeding.
- US spelling.

## The file format

The file starts with a header block between two lines containing only ---. Exactly these four lines, in this order, no quote marks around values:

---
title: The headline
description: One or two sentences on what the article covers. 50 to 300 characters. Shown on the blog and homepage cards and by search engines.
author: My name exactly as I give it below
date: YYYY-MM-DD
---

Two optional lines may be added after date: card (shorter card text if the description is too long for a tile, under 300 characters) and updated (YYYY-MM-DD, only when revising a published article). No other header lines are allowed.

Then the body, in Markdown:
- The first paragraph becomes the lead and is displayed larger. Make sure the first paragraph works as an opener.
- Blank line between paragraphs.
- ## for section headings, ### for sub-headings. Never a single # heading (the title comes from the header). Never #### or deeper. Never underline-style headings made with === or ---.
- - for bullets. > for pull quotes (a single paragraph after > renders as a pull quote; a multi-paragraph quote renders as a plain indented block).
- **bold**, *italic*, [link text](https://...). Links must be https. Every link needs visible text.
- Links to other pages on this site use a relative address: ../blog.html or ../index.html#start. Never the full https://syncrodocsystems.com address.
- No HTML tags anywhere, header or body. No code blocks (```). No images.

## Rules the automatic checker enforces (lint)

The check fails the pull request if any of these appear anywhere in the header or body:
- Em dashes (—), en dashes (–), the entity codes for them, or a spaced double hyphen ( -- ). Use a comma, a period, or a plain hyphen.
- Any of these words or phrases, in any capitalization: revolutionary, revolutionize, seamless, seamlessly, unlock, unlocks, supercharge, leverage, leverages, leveraging, game-changer, game-changing, game changer, cutting-edge, cutting edge, delve, delves, harness, harnessing, elevate, empower, empowers, empowering, unleash, unleashes, next-level, tapestry, "in today's fast-paced", "it's worth noting", "navigate the landscape", synergy, paradigm shift.
- Title over 120 characters, or a title ending in "SyncroDoc" (it is appended automatically).
- Description under 50 or over 300 characters.
- A date that is not YYYY-MM-DD, or a date in the future.
- A file name that is not lowercase letters, numbers, and single hyphens ending in .md.
- HTML tags, code blocks, single # headings, headings deeper than ###, empty headings, reference-style links, non-https links, empty link text, or a full syncrodocsystems.com link.
- A body with no paragraphs.

Beyond the checker, the house style avoids hype and marketing filler generally. If my draft leans on that kind of language, point it out, but change only what the checker would reject unless I say otherwise.

## Steps

1. Read the README and the existing article.
2. Read my draft. Propose a slug (the file name), a title if mine is missing or over the limit, and a description. Ask me any question you need answered before writing the file: the author name to use, the date if not today, whether any example names are real, and anything unclear in the draft. Ask everything in one message.
3. Write articles/src/<slug>.md.
4. Run the site's own checker and fix anything it reports until it prints "ok":
   node .github/scripts/lint-article.mjs articles/src/<slug>.md
   If you want to see the rendered page, run node .github/scripts/render-articles.mjs and open articles/<slug>.html, then run git checkout -- articles blog.html index.html sitemap.xml and git clean -f articles so nothing generated is left behind. Confirm with git status that the only change is my one .md file.
5. Show me the full finished file and a short list of every change you made to my wording, each with the reason. Wait for my go-ahead before doing any git operations.
6. After I approve: fetch origin main, create a branch from it named article/<slug>, add only articles/src/<slug>.md, commit with the message "Add article: <title>", and push the branch with git push -u origin article/<slug>.
7. Open a pull request from that branch into main. Title: the article title. Body: two or three plain sentences saying what the article covers and the intended publish date. Do not request reviewers, add labels, or enable auto-merge.
8. Give me the pull request link and tell me exactly this: two checks will appear, Content lint / lint and Preview / Preview. lint must be green. When both are green, a comment starting "Preview deployed" links to the article as it will look when live. Clayton reviews and merges. I do not merge.

## If I come back with review feedback or a red check

Make the change to the same file on the same branch, run the checker again, commit with a message that says what changed, and push. Do not open a second pull request. Do not rebase, amend, or force-push. If Clayton left a suggestion on the pull request, tell me to click "Commit suggestion" on GitHub rather than reproducing it yourself, unless I ask you to.

## If you do not have access to the repository or cannot push

Say so plainly, then do everything through step 5 anyway and give me the finished file. Also give me these click-by-click instructions for doing it myself on GitHub: open the articles/src folder, Add file, Create new file, type the file name, paste the contents, Commit changes..., choose "Create a new branch for this commit and start a pull request", Propose changes, Create pull request.

## My details

Author name to use: [NAME]
Publish date (leave blank for today): [ ]
Anything else you should know: [ ]

DRAFT STARTS HERE
```

### Notes for Clayton

- **Author attribution works as intended.** In Claude Code on the web, git and pull request operations use the signed-in writer's GitHub identity, so the PR author is Joey or Ricardo, not you. That is what makes the paths guard apply and the preview run. If they connect an account that is not the invited collaborator, the PR will be a fork or an unauthorized push, which is why the prompt tells Claude to stop on a fork.
- **The prompt pauses before git operations.** Step 5 forces a human checkpoint after the file is written and linted, so the writer sees every wording change and approves the file before anything leaves the machine. To run fully hands-off, delete the sentence "Wait for my go-ahead before doing any git operations."
- **The banned word list and limits are copied from `lint-article.mjs` as of September 2026.** If the list or the limits change, update the prompt, or Claude will pass stale rules to the writer.
