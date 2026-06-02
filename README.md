# SupplyHouse Token Explorer

A static, single-page reference for the SupplyHouse design token system: the rationale, the **chain** from primitive → component, the typography roles, and the responsive type scale.

## View it

- **Locally:** open `index.html` in a browser (all assets are relative; no build step).
- **GitHub Pages:** push this folder to a repo and enable Pages (Settings → Pages → deploy from branch). The page is the repo root's `index.html`, so put these files at the root of the Pages branch (or in `/docs`).

## Files

| File | What it holds |
|---|---|
| `index.html` | Page structure & content (rationale, sections). |
| `styles.css` | All styling. **Edit the `:root` block at the top to restyle** — palette, fonts, spacing live there. |
| `app.js` | Chain logic (trace/columns), typography & scale renderers, nav scrollspy. |
| `data.js` | Auto-generated token data: `DATA`, `T1SET`, `USAGE`, `TYPO`, `RSCALE`. |

## Editing

- **Look & feel:** change the CSS variables in `styles.css` `:root` (brand palette is brown-dominant with an orange accent; corners are `0px` per brand).
- **Font:** Inter via Google Fonts (loads on any public URL).
- **Token data:** `data.js` is generated from `../tier-1-foundations.v4.tokens.json` and `../tier-2-semantic.v4.tokens.json`. Regenerate it whenever the tokens change rather than hand-editing.
- **Responsive scale:** the `RSCALE` object in `data.js` mirrors `../typography-responsive-scale.md` — a proposed, overridable ramp.

## Notes

- Type face: the brand face (Interstate) is Adobe-Typekit and domain-locked, so this public build uses **Inter** to render identically for anyone opening the link.
- Colors shown are the design system's own token values; the page chrome uses the SupplyHouse brand palette.
