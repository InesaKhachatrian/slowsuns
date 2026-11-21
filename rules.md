# rules.md: design rules for AI (Version 4B)

Updated Nov 20, 2026: the logo uses the display face (rules 3 and 4); the design system is also saved in Claude Design as "Slowsuns". Nov 18: cut from 25 rules to 10 (the homework limit). The full wording behind each rule moved to DESIGN.md §11, under the same number; nothing was removed. Read this before building or changing any screen. If a rule and a request clash, follow the rule and say so.

## Read in this order
1. `rules.md` (this file): the 10 rules.
2. `DESIGN.md`: §6 is page by page, §7 lists the components, §11 has the details behind each rule.
3. `showcase.html`: the docs site. Open the component's page before building.
4. `templates/`: start every new page from the closest template (home, places, destination, facts, page, 404).

## The 10 rules
1. **Tokens only.** Link `tokens.css`, then `components/index.css` (plus `components/site.js`, deferred); no CSS framework or animation library. No hex, font size, spacing or radius outside `tokens.css`; pages and components use semantic tokens, never primitives (DESIGN.md §3.0).
2. **White pages, navy sections, fixed colour jobs.** Only `data-theme="light"` and `data-theme="navy"`; no section is ever green, cream or tinted. Gold, orange, blue and green each keep their one job (DESIGN.md §3.1).
3. **Every font has its Armenian partner.** Headings and the logo name use `--font-display`, text `--font-body`, labels `--font-mono`. Never a font without Armenian.
4. **Capitals only through classes.** Uppercase only via `.label`, `.eyebrow` and `.btn--mono` (the logo is normal case); never type capitals into the HTML (write "Slowsuns"). At most one `<em>` highlight per heading. Both switch off in Armenian.
5. **One main button per area.** `.btn--primary` (white mono, no icon) only on photos and navy; `.btn--outline` for Explore; small solid or ghost buttons inside cards; `.btn--instagram` only in the Instagram band. No glass, no shadows on cards.
6. **390 px, both languages, AA.** No sideways page scroll, no tap target under 44 px, no fixed-width buttons or labels, in English and Armenian. Text on photos always sits on a dark layer.
7. **Money is labelled, prices are dated.** The Declaration sits under the destination title, before the first partner link; every partner link says "Partner link" and uses `rel="sponsored noopener"`; every price and transport fact has a Checked date. No ratings, stars or "Trusted by".
8. **Nothing fails silently.** Every map has a fallback: "See all places" under the month map, "Simplified map, not to scale" + legend on the island map, and a `.map-failed` state; filters show an empty state with "Clear filters"; places Inesa hasn't visited are plain text, never a link. Use the error and empty states in DESIGN.md §6.6.
9. **Motion stays calm.** Animate only `transform`, `opacity` and SVG masks; never text, prices or partner links; `prefers-reduced-motion` removes it.
10. **Ask Inesa first.** Before a new component, colour, size, spacing, radius, theme, library, glass or shadow. Open questions (DESIGN.md §10) are hers. No ideas from Atlas Obscura or Lonely Planet.

## Before you say "done"
- No hex outside `tokens.css`; no primitive `var(--ink-…)`, `var(--space-…)`, `var(--radius-<number>)` outside `tokens.css`; no `forest`, `lime`, `Cormorant` or `Figtree` anywhere.
- 390 px in EN and HY: no sideways scroll, no word broken mid-word, no tap target under 44 px.
- Declaration before the first partner link; every price has a Checked date; every map has its fallback; no ratings anywhere; unvisited places are never links.
