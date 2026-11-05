# rahuldoescode.tech

Personal site with a comic-ink, multiverse look: halftone dots, misregistered CMYK printing, and animation that steps "on twos".

It's plain HTML, CSS and JS with no build step and no dependencies.

## Editing content

Almost everything lives in **`content.js`**:

- `projects`: each project is a "universe" card (title, Earth number, tag, sound effect, blurb, stack, links)
- `suit.parts`: the five armor pieces (helmet, core, gauntlets, belt, boots) and the skills and power levels in each
- `lab`: the cool-stuff cards
- `email` and `socials`

Search for `TODO` to find placeholder copy. Origin story text is in `index.html`.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy: GitHub Pages + rahuldoescode.tech

1. Repo → Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
2. The `CNAME` file already sets the custom domain to `rahuldoescode.tech`.
3. At your domain registrar's DNS settings, add:

| Type  | Host  | Value                    |
|-------|-------|--------------------------|
| A     | @     | 185.199.108.153          |
| A     | @     | 185.199.109.153          |
| A     | @     | 185.199.110.153          |
| A     | @     | 185.199.111.153          |
| CNAME | www   | rahul-does-code.github.io |

4. Once DNS has propagated (minutes to a few hours), tick **Enforce HTTPS** in Settings → Pages.

## Features

- Halftone dot field in the hero that reacts to the cursor, rendered at 12fps on purpose
- RGB-split glitch title and a "dimension shift" wipe when you jump between sections
- **The Suit**: a clickable armor diagram where each piece opens a loadout of skills with charge-up power bars
- **Dimensions**: four color variants (Classic, Noir, 2099, Punk) that re-skin the whole site; your choice is remembered
- Scroll-driven reveals and a progress bar, with fallbacks for browsers that lack scroll-driven animations
- Respects `prefers-reduced-motion`; works from 360px up
