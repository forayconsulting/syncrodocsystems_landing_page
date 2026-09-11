# deck

Rendered slide images for `../deck.html`, the in-browser viewer for the public platform overview. Generated from `../SyncroDoc-Platform-Overview.pdf`, never hand-edited.

## Contents
Eleven files, `slide-01.webp` through `slide-11.webp`, each 1600x900 WebP at quality 82 (45 to 100 KB). Rendered with `pdftoppm` at 150 dpi, then resized with ImageMagick.

| Slide | Headline |
|-------|----------|
| 01 | Title: Document Intelligence for Benefits Administration |
| 02 | Plan document reconciliation is still a manual, high-variance process |
| 03 | One platform, three engines |
| 04 | Six workflows, one environment |
| 05 | The output is your document, not a report about it |
| 06 | What is under the hood |
| 07 | What happens between upload and output (five stages) |
| 08 | Four problems a general-purpose AI tool does not solve |
| 09 | Reclaimed analyst capacity covers the license more than twice over |
| 10 | Built to clear an enterprise IT security review |
| 11 | Configuration, not custom code |

## Relationships
- **Consumed by**: `../deck.html`, which hardcodes the eleven `<img src="deck/slide-NN.webp">` tags with `width="1600" height="900"`, a `01 / 11` counter, and alt text summarizing each slide. Slide 1 is `loading="eager"`, the rest lazy.
- **Source of truth**: `../SyncroDoc-Platform-Overview.pdf`. The editable `.pptx` is not in the repo.
- `../og-image.jpg` (social preview) is a 1200x630 crop of slide 1, made from the same render.

## Conventions
- Regenerate rather than edit. Command sequence is in the root `CLAUDE.md` under "Regenerating the deck". Delete the intermediate PNGs afterward.
- If the page count changes, update the slide `<div>` list, the `NN / 11` counters, and the alt text in `../deck.html`, and bump the `?v=` string on the PDF links in `../deck.html` and `../index.html`.
- Filenames are zero-padded two digits and must stay in slide order.

## Warnings
- Slides 6 and 10 name the hosting provider in the artwork, which conflicts with the site rule against infrastructure details in public files. Fixing that requires editing the PPTX and regenerating both the PDF and these images.
- Em dashes are baked into the slide artwork. The no-em-dash convention applies to HTML copy and alt text, not to these images.
- These images are public. Do not render the architecture or pricing slides that were deliberately removed from the deck.
