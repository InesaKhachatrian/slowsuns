# CLAUDE.md: Slowsuns website

Plain static site for GitHub Pages (HTML, CSS, JS; no framework, no build step). Read `rules.md` (10 rules), then `DESIGN.md` (§6 pages, §6.6 error and empty states, §7 components, §11 rule details) before changing anything.

- Colours, sizes, spacing and radii come only from `tokens.css`; components use semantic and component tokens, never primitives.
- New markup reuses the classes in `components/`; ask Inesa before adding a component, token, library or new colour.
- Every page: 390 px with no sideways scroll in English and Armenian; tap targets ≥ 44 px.
- Destination pages: Declaration under the title, "Partner link" + `rel="sponsored noopener"`, Checked dates, "Spotted a change? Tell me" (→ https://ig.me/m/inesskhachatryan).
- Design source: the Slowsuns design system and the canvas "Home page design (Version 4)" in Claude Design.
- Commit after every working step.
