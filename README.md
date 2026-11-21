# Slowsuns

A bilingual (English and Armenian), map-led, photo-first guide to places Inesa has been. Plain HTML, CSS and JavaScript: no build step, no framework. Built Nov 20, 2026 from the Slowsuns design system.

## Pages

| File | Page |
|---|---|
| `index.html` | Home: hero, Recommended places, "Where to go in [month]" map, Instagram band |
| `places.html` | Every guide, with region and best-month filters |
| `rhodes.html`, `split.html`, `sri-lanka.html`, `prague.html`, `egypt.html` | Destination guides |
| `cyprus.html` | "Guide coming soon" (a visited place without a guide yet) |
| `facts.html` | Did you know? (fact of the day) |
| `404.html` | Page not found (GitHub Pages serves it for any missing address) |

## Folders

- `tokens.css`: every colour, size, space, radius and motion value (primitive → semantic → component tokens).
- `components/`: one stylesheet per component, loaded through `components/index.css`, plus `site.js` for everything that moves (card stack, Explore reveal, month map, filters, contents list, the fact wheel, the error states).
- `assets/`: fonts, flags, country shapes, the month map, wheel illustrations and placeholder photos.
- `DESIGN.md`, `rules.md`: the design and the 10 rules. Read them before changing anything.

## Run it on your Mac

```
cd ~/Sites/slowsuns
python3 -m http.server 8000
```

Then open http://localhost:8000. (Opening `index.html` directly also works, but the fonts and the month map need the local server.)

## Publish on GitHub Pages

The repository is github.com/InesaKhachatrian/slowsuns. Commit and push to `main`; in the repository's Settings › Pages, choose "Deploy from a branch", branch `main`, folder `/ (root)`. The site appears at https://inesakhachatrian.github.io/slowsuns/.

## Still placeholder

- Photos: the real photos from the design canvas are in `assets/photos/` (hero, the six places, the Rhodes gallery, the hotel, the Instagram band and the profile picture), but they are stand-ins until you add your own (same names, ≤1600 px wide, <300 KB). The `[Your photo: …]` slots in the new guides and the six drawn fact pictures (Venice, Norway, waterfalls, Peru, feta, La Tomatina) still need photos.
- Budgets on Split, Sri Lanka, Prague and Egypt are sample figures (marked "≈"); flights and "from €[budget]" are blanks to fill.
- Hotels are named by area, not by a real hotel; partner links (`href="#"` on "Check prices") wait for partner approval.
- Armenian: only the menu and a few labels switch; every page shows the "not in Armenian yet" note under ՀՅ.
- Privacy & disclosure page: left out for now; it must be live before partner links or analytics.
