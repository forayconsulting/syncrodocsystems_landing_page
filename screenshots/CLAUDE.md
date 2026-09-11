# screenshots

Founder headshots displayed in the `#team` section of `index.html`. The folder name is historical; the product UI screenshots that used to live here were removed in the redesign.

## Contents
| File | Purpose |
|------|---------|
| `joey_headshot.jpeg` | Joey Mokos |
| `ricardo_headshot.jpeg` | Ricardo Govindasamy (cropped to remove the tilted polaroid frame from the original) |
| `clayton_headshot.jpeg` | Clayton Chancey |

## Relationships
- **Parent**: `index.html` references each file by relative path (`screenshots/<name>.jpeg`) inside a `.shot` element in `#team`.
- Framing is controlled per photo with inline CSS vars on `.shot` (`--zoom`, `--shift`). Grayscale and contrast are applied in `.person .shot img`. See the root `CLAUDE.md` under "Founder photo framing".

## Warnings
- Keep this folder and these filenames. The homepage depends on the paths.
- Photos are served in color and converted to grayscale in CSS, so a replacement photo does not need to be pre-processed.
- If a headshot is replaced with a different crop, re-check `--zoom` and `--shift` so all three heads sit at the same height.
