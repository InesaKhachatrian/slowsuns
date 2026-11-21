# DESIGN.md: Version 4B, reference-led (draft, not approved)

Last updated Nov 20, 2026 (Slowsuns design system in Claude Design, connected to the canvas; canvas text styles and colours synced to its tokens; Instagram heading saved as `type-band`; website rebuilt in `~/Sites/slowsuns/`). Before that, Nov 18 (§3.0: the three token layers; §11: build details moved from rules.md, which now has 10 rules). Before that, Nov 17 (brand name Slowsuns; hero button) and Nov 16. **Version B replaces Version A** (Nov 15, Inesa). B was built only from the Figma board "HOME PAGE", then refined with Inesa on the canvas. On Nov 16 the canvas gained three more pages (Places, Destination, Did you know?) and the home page was simplified (new menu, plain footer). This file now covers all four pages.

- **Live design:** canvas "Home page design (Version 4)" (claude.ai/artifact/Jrj1a64R368YfT3PL6m7D5), row **B**: Home (`Refs.dc.html`), Places (`Places.dc.html`), Destination · Rhodes (`Destination.dc.html`), Did you know? (`Facts.dc.html`), each with a 390 px phone artboard. The canvas is the source of truth for exact values.
- **Code:** `~/Sites/travel-design-system/` (rebuilt for B on Nov 16: tokens, components, 4 page templates, docs site). The website prototype `~/Sites/travel-website-v4/` is still on the old forest theme.
- **Brand name: Slowsuns** (chosen Nov 17). **Logo (Nov 18):** the road-to-the-sun mark (ink tile, a white road winding up to a gold sun, dashed centre line) + "Slowsuns" in Playfair Display 600, normal case, no letter-spacing: 22 px in the header, 19 px in the footer and on phones; mark 32 / 24 / 28 px. Over a photo the tile turns white and the road ink. In running text write "Slowsuns". Domain: slowsuns.com (free in the registry on Nov 17, not bought yet). Instagram: @inesskhachatryan.
- **Design system in Claude Design (Nov 20):** "Slowsuns" (claude.ai/artifact/RbgXvKByFiYD6p2HFxKLt8): tokens, fonts, logo, flags, shapes, 34 component previews and the brand book. The canvas loads its `tokens.css`, so its pages follow the tokens.
- **Website (Nov 20):** `~/Sites/slowsuns/`, plain HTML, CSS and JS for GitHub Pages (github.com/InesaKhachatrian/slowsuns): Home, Places, Did you know?, Rhodes, Split, Sri Lanka, Prague, Egypt, Cyprus (coming soon) and 404, built from the design system files.

**How to read the marks**
- **[A]** = assumed by Claude, not decided by Inesa.
- **[Q#]** = open question, listed in §10.
- **[!]** = clashes with a project constraint (§2); needs a decision.

## 0. The design system: 5 layers

| # | Layer | What is inside | Where |
|---|---|---|---|
| 1 | Tokens | Colours, type, spacing, radius, motion | `tokens.css` |
| 2 | Components | Built from tokens, one file each | `components/` |
| 3 | Page templates | Home, Places, Destination, Did you know?, Text page, 404 | `templates/` |
| 4 | Showcase | Docs site (left menu, one page per item) | `showcase.html` (built by `tools/build_docs.py`) |
| 5 | Rules for AI | What to use, what to ask first | `DESIGN.md` (this file), `rules.md` |

## 1. Where the look comes from

Figma board "HOME PAGE" (figma.com/design/X9iHN8NqcqaORZgfUybpsI, node 4-13), one row per block.

| Block | Reference | What we kept |
|---|---|---|
| Hero | Mountain reference; Norway kayak reference | Nav links in a row; the dark, moody photo; text on the left; classic serif headline |
| Recommended places | Stacked swipe cards with country tags | Depth and stacking (full-width scroll panels); country tag with flag. No star, rating, km or dots |
| Map | Dark map with gold dots; "Where to go in [month]" with month tabs and a side list; photo cards on the map | All three |
| Instagram band | Dog banner (photo + framed text + button below); "GET IN TOUCH" button | Photo banner with a white frame, dark panel with the button under it; white button with a square profile photo |

The inner pages (Places, Destination, Did you know?) have no Figma reference; they reuse the home page's tokens and parts.

**The idea in one line:** *Every trip, one road.* Big moody photos, white pages for planning, a navy map, and photos shaped like the countries they show.

## 2. Constraints this design must keep

1. **Armenian is equal.** Every font needs an Armenian partner. **[!] Playfair Display, Urbanist and Space Mono have none** → [Q17]. The code pairs them with Noto Serif Armenian / Noto Sans Armenian [A].
2. **Phone first and fast.** 390 px, no sideways scroll, tap targets ≥ 44 px, images lazy (except the hero and the destination cover), ≤ 1600 px, < 300 KB.
3. **Money and freshness always visible.** Disclosure before the first partner link, labelled partner links, a Checked date next to every price and transport fact, a visible fallback for every map. **[!] The Destination artboard is missing these** (no disclosure, "Check prices" has no "Partner link" label, no Checked date on the budget) → the template adds them (§6.3) [A].
4. **No green backgrounds.** Green appears only inside photos, and as a small icon/text colour for "good" (tips, copied) on white.
5. **WCAG AA**, text on photos always on a dark layer; respect `prefers-reduced-motion`.
6. No UI ideas from Atlas Obscura or Lonely Planet.

**[!] Changed from Version A:** B uses **uppercase + letter-spacing** for small labels, buttons and country tags (Space Mono). The logo is not uppercase (Nov 18). Armenian has no capitals → [Q18]. In code, `:lang(hy)` turns uppercase and letter-spacing off.

## 3. Tokens

### 3.0 Three layers

Every value lives in `tokens.css` and passes through three layers. Each layer may only point to the one above it.

| Layer | What it holds | Named by | Examples | Who may use it |
|---|---|---|---|---|
| **1 Primitive** | Raw values: every colour, size, space and radius the system has | What it **is** | `--ink-900`, `--space-6`, `--radius-16` | Only `tokens.css` |
| **2 Semantic** | Jobs. Each points to a primitive | What it **does** | Colour: `--surface-page`, `--text-body`, `--accent`. Space: `--gap-tiny` … `--gap-section`, `--gutter`. Radius: `--radius-chip`, `--radius-card`. Type: `--text-hero` … `--text-label`, `--font-display`, `--font-body`, `--font-mono` | Pages and components |
| **3 Component** | One component's own settings. Each points to a semantic token | The **component + part** | Set at the top of each file in `components/` (e.g. a button's fill, text colour and padding) | That component only |

**One value, three layers:** `--radius-16` (16 px) → `--radius-card` ("corners of cards, photos, tables, boxes") → the place card's corner in `components/`. To make every card rounder, change `--radius-card` once; to change one component, change only its component token.

**Why:** a page never says "16 px" or "#121A1C", only "card corner" or "body text". That keeps all pages the same, makes a theme change one edit, and is what rules.md 1 checks.

The tables below list the system by job, using short names (`--ink`, `--gold`, `--navy` …). In `tokens.css` the primitives are named by colour and step: `--ink` = `--ink-900`, `--body` = `--ink-700`, `--grey` = `--grey-600`, `--navy` = `--navy-900`, `--gold` = `--gold-400`, `--orange` = `--orange-500`, `--orange-text` = `--orange-700` (checked Nov 18 in the design system audit).

### 3.1 Colour

| Token | Hex | Job |
|---|---|---|
| `--white` | `#FFFFFF` | Page background everywhere (no cream pages) |
| `--cream` | `#F4F2EC` | Hover fill on white buttons only |
| `--tint` | ink at 5 % | Country labels, stop chips, quick-facts box, tips box, table head |
| `--line` | `#E3E6EA` | Hairlines on white (header, footer, filters, table) [A: home used warm `#DDD9CE`; unified to the cool grey of the other pages] |
| `--edge` | `#C9CFD6` | Control outlines: language switch, filter chips, select, ghost buttons |
| `--ink` | `#121A1C` | Text on light, solid buttons, day numbers, table total |
| `--body` | `#3E4849` | Running text on white |
| `--grey` | `#5A6566` | Secondary text, small mono labels |
| `--navy` | `#0E1622` | Map section, More guides band, game band |
| `--navy-2` | `#18222F` | Raised on navy (wheel, list rules, map edge) |
| `--navy-3` | `#22344A` | Hub hover, "Countries & cities" topic |
| `--map-sea` | `#0A1019` | Sea on the map |
| `--map-land` | `#222D3B` | Countries on the map |
| `--map-line` | `#3A4656` | Country borders, outlines on navy |
| `--muted-navy` | `#9FB0B5` / `#8496A0` | Notes; places not visited |
| `--gold` | `#E9B44C` | Map dots, highlight word on navy, temperatures, eyebrow on navy, wheel pointer |
| `--orange` | `#E2622D` | Focus ring, active contents line, stop dots, active map pin |
| `--orange-text` | `#B8461A` | Eyebrows on white (AA), "mistakes" icons |
| `--blue` | `#2F6690` | "Nature & sky" topic only |
| `--good` | `#2F6B4F` | Tip icons, "Copied" message (text/icon only, never a fill) |
| `--bad-tint` | red at 5 % | "Mistakes to avoid" box |
| `--island-sea` | `#DDE8EC` | Destination island map sea; land white, coast `#B7C2CC` |
| Card tints | Split `#E7EEF1` · Sri Lanka `#E8EEE5` · Rhodes `#F2EEE7` · Prague `#EFEBE8` | One pale tint per home place card |
| Photo layers | ink at 25–80 % | Hero scrim, Instagram band (30 %), place reveal, photo captions (60 %) |

Also in `tokens.css`, each with one job (documented Nov 18): `--grey-200` `#D3D9DF` photo loading ground · `--ink-800` `#2A3436` solid button hover · `--slate-200` `#B9C4C9` text on navy · `--slate-250` `#A7B4BC` card meta on navy. Confetti uses `--gold` (mint removed Nov 18).

### 3.2 Type

| Role | Font | Size (desktop / phone) | Notes |
|---|---|---|---|
| Hero headline | Playfair Display 600 | 88 / 48 (68 tablet) | One phrase in italic (`<em>`) |
| Hero headline, Armenian | Noto Serif Armenian 600 | 72 / 36 (56 tablet) | One step down so long words never break [A] |
| Destination title | Playfair Display 600 | 72 / 52 | Country label on the right |
| Page title (Places, Did you know?) | Playfair Display 600 | 64 / 40 | |
| Home section heading | Playfair Display 600 | 56 / 36 | Italic highlight word |
| Page section heading | Playfair Display 600 | 44 / 34 | Destination sections, More guides |
| Place name (home card) | Playfair Display 400 | 64 / 44 | |
| Place name (Places card) | Playfair Display 600 | 40 / 30 | |
| Card name (More guides), fact title, day title | Playfair Display 600 | 30 · 34 · 28 / 26 · 28 · 24 | |
| Body | Urbanist 400–600 | 17 (lead 18–20) | Line height 1.55–1.6 |
| Small action buttons, chips, nav links | Urbanist 600–700 | 15 | Not uppercase |
| Logo name "Slowsuns" | Playfair Display 600 | 22 / 19 | Normal case, next to the road-to-the-sun mark |
| Labels, mono buttons, eyebrows | Space Mono 400/700 | 11–13 | Uppercase, letter-spacing .12–.16em [!] |
| Instagram heading | Urbanist 700 | 30 / 28 | Inside the frame; type style `type-band` in the design system (Nov 20) |

### 3.3 Space, radius, motion

- **Layout:** content max 1280 px; side padding 40 px (24 tablet, 16 phone); home sections 120 px top/bottom (80 phone); page sections 96 px apart (72 phone).
- **Header:** 72 px (60 phone), sticky and white on inner pages; transparent over the home hero.
- **Breakpoints:** 1080 and 760 px [A: home used 1080/760, inner pages 1000/700; unified].
- **Radius:** 4 language switch and destination cover · 6 mono buttons · 8 labels, chips, small buttons, select, map photo cards · 12 gallery and phone photos · 14 map · 16 photos, cards, tables, boxes · 18 Instagram band · 20 home place cards, fact card · 24 game band · pill for filter chips, month pills, sound toggle.
- **Easing:** `cubic-bezier(.22,.61,.36,1)`; reveal uses ease-in-out cubic; wheel `cubic-bezier(.12,.7,.1,1)`.

## 4. Motion

- **Home place cards stack on scroll:** each card sticks 24 px from the top; the next slides over it. The covered card shrinks 7 %, its corners round a little more and it dims (up to 55 %).
- **Parallax:** the photo inside each home place card moves up to 9 % slower than the page.
- **Explore reveal (decided Nov 15; checked with the tuner Nov 18, values kept):** hovering or focusing **Explore** turns the country silhouette into the full photo (SVG mask, blurred and re-thresholded each frame). 900 ms in, 650 ms out; photo zooms 3 %; dark fade on the left; text turns white. Same photograph throughout. Tuner with sliders for speed, shape size, rotation, edge spread, zoom and dark fade: claude.ai/artifact/Wk4f6pQzqf5m4QwZEMb14S.
- **Map:** zoom 1–4× with +, − and reset; drag to pan when zoomed; 0.35 s glide.
- **Photo hover:** photos in Places and More guides cards zoom 4 % (0.6 s); the name underlines.
- **Contents list:** follows the section being read (scroll spy).
- **Fact wheel:** 4.6 s spin, lands in the middle of a slice; the fact card pops in (0.7 s); gold confetti (2.2 s); a three-note chime if sound is on.
- **Reduced motion:** no parallax, stacking scale, photo zoom, confetti or card pop; the reveal switches instantly; the wheel turns in 0.4 s.
- **Never:** motion on prices or partner links; scroll-jacking.

## 5. Site map and header

- **Menu (all pages):** logo (road-to-the-sun mark + "Slowsuns" in Playfair Display) left · **Places · Did you know?** centred · EN · ՀՅ right. Current page: bold, underlined. Phones: language switch moves into the menu; the two links stay visible on inner pages; the home hero shows a menu button.
- **Footer (all pages, plain):** logo · Places · Did you know? · © 2026 Slowsuns. Privacy & disclosure is left out for now (Nov 18); it comes back before partner links or analytics go live. In Armenian the logo keeps Latin letters and shows as "Slowsuns", because uppercase is off for `hy` [A]. **Changed Nov 16:** the landscape-photo footer, the "Plan / About" columns and the Instagram icon are gone.
- **[Q21]** About is no longer linked anywhere (menu or footer). Keep an About page? The map is section 3 of Home; the hero button now goes to Places (Nov 17).

## 6. Pages

### 6.1 Home

Order: **1 Hero → 2 Recommended places → 3 Map → 4 Instagram band → 5 Footer.** All sections white except the hero (photo) and the map (navy).

1. **Hero** (900 px; 780 on phones). Full-bleed moody photo, layered dark scrim, no cards. Text left: "Every trip, *one road*." (600), "Guides to places I've actually been: the route, the best months, a real budget and where to book.", white mono button **"EXPLORE THE PLACES"** (no icon; links to Places; Armenian "Բացահայտիր վայրերը" [A]). Changed Nov 17 from "Explore the map".
2. **Recommended places.** Eyebrow "PLACES I'VE BEEN", heading "Recommended *places*", line "Every guide with the best time to go and a real budget." **4 full-width cards** (Split, Sri Lanka, Rhodes, Prague): 660 px (phone ≤ 760), 40 px margins, stacking on scroll. Card = tint · left: flag + country tag, name (64), two-sentence description [A: drafts], days · from €budget · Checked date, outlined **Explore** button · right: photo cut in the **country's shape**. Phones: text first, shape below.
3. **Map "Where to go in *[month]*"** (navy). Eyebrow "TRAVEL BY SEASON". Month pills, opens on the current month. Country map with gold dots and **white photo cards with the place name** (temperatures moved to the list). Zoom/pan. Legend. Under the lists: **"See all places"** (→ Places), which is also the fallback if the map fails. No Google Maps link (removed Nov 18). Right: **"Places I've been"** (links, gold temperature) and **"Also in season"** (plain text, no link).
4. **Instagram band** (white, 80 px padding). Photo banner 560 px (540 phone), 30 % dark layer; white frame ≈ 372 px wide with "Follow me on Instagram" and one line; dark panel below with the white button (square profile photo, "FOLLOW @INESSKHACHATRYAN", ↗) and "New stories every week".
5. **Footer:** plain (§5).

### 6.2 Places (new, Nov 16)

- White sticky header. Eyebrow "PLACES I'VE BEEN", title "Places", lede "Every guide with the best time to go, how long to stay and a real budget."
- **Filters row:** region chips (All · Europe · Middle East & Africa · Asia; chosen = ink fill) and a **"Best time"** month select (Any month, January … December). Under it a live count: "4 places good in November". Phones: the filters stick under the header, with a hairline in `--line` below them and no shadow (Nov 18); chips scroll sideways inside their row.
- **Grid:** 2 columns (1 on phones), 64 × 40 px gaps. **Place card:** 3:2 photo (16 px corners, zooms on hover) → name (serif 40) with the **country label** (flag + mono uppercase on tint, 8 px corners) on the right → 2 × 2 facts: Best time · Trip length · Budget ("from €…") · Last checked, each with a small icon and mono label. The whole card is one link. No description, no button on the card.
- **Empty state:** dashed box "No guides match these filters yet." + "Clear filters".
- Places shown: Split, Prague, Rhodes, Cyprus, Egypt, Sri Lanka.
- Replaces "Places = full list + map fallback": the list is the map's fallback.

### 6.3 Destination (new, Nov 16; Rhodes is the example)

1. **Header** (sticky, "Places" current).
2. **Title block:** breadcrumb "Places / Greece" → title "Rhodes" (72) with the country label right-aligned → **cover photo** full width, 380 px tall, 4 px corners (as Inesa set it).
3. **Body:** 220 px sticky contents list on the left (orange line on the current section; on tablet/phone a sideways tab row under the header) + article (max 900 px).
4. **Overview:** quick-facts box (tint, 16 px corners, 3 × 2): Best time · Trip length · Currency · Language · Time zone · Getting around.
5. **Day by day:** eyebrow "THE ROUTE"; numbered ink circles on a grey line; day label, serif day title, notes, stop chips (orange dot).
6. **Map & photos:** "Where everything is". Simplified island map (pale blue sea, white land) with numbered pins matching the days; legend list on the right (hover links pin and row); "Simplified map, not to scale", N mark. Gallery mosaic: 1 big + 4 small (phones 2 columns).
7. **Budget:** "What it really cost", per person; table What · Details · Cost; ink total row "from €[budget]".
8. **Where to stay:** "Where I'd stay"; one compact hotel row: thumbnail, name, "[Area] · [Room type] · [Why this one]", **Check prices** (outlined, 8 px).
9. **Good to know:** two boxes: **Tips** (tint, green check/arrow icons) and **Mistakes to avoid** (red 5 % tint, orange-text ✕ and – icons).
10. **Follow on Instagram** (added Nov 18): one line "More from this trip on Instagram" and a small ghost button "Follow @inesskhachatryan ↗" (new tab), after Good to know. Not the big Instagram button, which stays in the home band (rules.md 5) [A: placement].
11. **More guides** (navy band): eyebrow "KEEP EXPLORING", 3 cards (photo, serif name + country label, "Best: … · from €…"). Phones: swipe row.
12. **Footer:** plain.

**Added in code to meet §2.3 [A]:** the Declaration line under the title ("Some links on this page are partner links…"), a "Partner link" label and `rel="sponsored"` on Check prices, a Checked date under the budget table and on the hotel price, and "Spotted a change? Tell me" after Budget and Where to stay. "Tell me" opens an Instagram DM with Inesa (`https://ig.me/m/inesskhachatryan`, new tab; decided Nov 18).

### 6.4 Did you know? (new, Nov 16)

A fact-of-the-day game to bring followers back.
- Title "Did you know?", lede "Spin the wheel once a day and get a random fact about the world: cities, nature, food and traditions." Four **topic chips** with tiny illustrations: Countries & cities · Nature & sky · Food & drinks · Culture & traditions.
- **Game band** (navy, 24 px corners; full-bleed on phones): left, the **wheel** (8 illustrated slices, 2 per topic; gold pointer; round **SPIN** hub; gold rim dots), status line ("One spin a day. Make it count." → "Spinning…" → "Next spin in 08:12:44"), Sound toggle (off until the person turns it on; decided Nov 18). Right, before the spin: dashed box with a gold "?" at `--text-hero` size, "Today's fact is hidden here"; after: the **fact card** (white, 20 px corners): photo with topic chip (topic colour), country label, serif title, fact text, **"Read my [place] guide →"** (solid ink, only when she has a guide) and **"Share this fact"** (outlined; uses the phone's share sheet, else copies).
- **One spin a day** (resets at local midnight); confetti and chime on landing.
- Facts are about the whole world, including places she hasn't been; only places with a guide get the guide button [A: drafts, check facts before launch] → [Q22].

### 6.5 Text page and 404

**Text page:** built from the same parts [A]: white header, page title (64/40), body at 680 px, plain footer.

**404** (on the canvas since Nov 18, `templates/404.html`): eyebrow "Error 404 · Page not found", title "This road *ends here.*", one line ("The page you were looking for has moved, or the link has a typo. Every guide is still one tap away."), **See all places** (small solid) and **Go to the home page** (small ghost), and a help line: "Came here from an Instagram link? Send me a message on Instagram and I'll fix it." (→ the DM link). On the right, a small illustration: the road from the logo ending at an orange barrier under the gold sun, drawn with tokens only. Phones: the illustration moves above the text; buttons stack.

### 6.6 Error and empty states (new, Nov 18)

Every state says what happened in plain words and offers one way forward (rules.md 8). All are on the canvas board "Error and empty states" and in `templates/states.html`; the parts live in `components/states.css`.

| # | State | Page | When | What shows |
|---|---|---|---|---|
| 01 | Month map didn't load | Home | The map fails or a slow phone times out | Message in place of the map (navy, dashed), month pills and lists still work, **See all places** |
| 02 | Route map didn't load | Destination | The simplified map fails | Short note on the map's sea colour; the numbered stop list stays |
| 03 | Photo didn't load | Any photo | Slow data or a missing file | The box keeps its size and corners on `--surface-photo`, with an icon and the photo's description |
| 04 | Not in Armenian yet | Any one-language page | ՀՅ chosen before the translation exists | The English page with a note in both languages at the top (Armenian line: Claude draft [A]) |
| 05 | You're offline | Every page | The connection drops (trains, ferries) | A dark bar under the header with "Try again"; goes away by itself |
| 06 | Guide coming soon | A visited place with no guide yet (now Cyprus) | Someone taps it on the map or in a list | Place name, one line, **Follow @inesskhachatryan** and **See all places** (`templates/coming-soon.html`) |
| 07 | No guides match the filters | Places | Region and month with nothing in common | Count says 0, dashed box, **Clear filters** |
| 08 | No guides yet | Home, Places | Before launch | "First places *coming soon*" and the Follow button |
| 09 | Today's fact didn't load | Did you know? | The fact or its photo can't load | Dashed box on navy, "Your spin isn't used up", **Try again** |
| 10 | Sharing didn't open | Did you know? | No share sheet (most desktops) | A toast: "**Link copied.** Sharing didn't open on this device…" |

No screen needed: a broken partner link goes to the partner's search page (SPEC); GitHub Pages serves the 404 page for any missing address.

## 7. Components

| Component | Rules |
|---|---|
| **Header** | Logo, two links, language switch. Transparent over the hero; white, sticky with a bottom line elsewhere |
| **Primary button** | White, 6 px corners, Space Mono uppercase, **no icon** (play square removed Nov 17). Only on photos and navy. One per area |
| **Outline button** | Transparent, 1.5 px ink outline (white on photos/navy), Space Mono uppercase. Explore, "All guides" |
| **Small button** | Urbanist 15/700, 8 px corners, 48 px tall. **Solid** (ink) for the one main action in a card; **ghost** (white, `--edge` outline) for the rest: Check prices, Share |
| **Instagram button** | White, square profile photo, mono uppercase handle, ↗ |
| **Country label** | Flag (24 × 16) + country in mono uppercase on `--tint` (white 10 % on navy), 8 px corners |
| **Home place card** | §6.1.2. Country-shaped photo; Explore reveal (§4) |
| **Place card** | §6.2. Photo, name + label, 2 × 2 facts |
| **Guide card** | Smaller place card on navy (More guides) |
| **Filter chips + month select** | Pills 44 px; chosen = ink fill. Select 44 px, 8 px corners, chevron |
| **Month pills** | Outlined pills on navy; chosen = white |
| **Country map** | Natural Earth countries, lon −12…92, lat 2…62; land `--map-land`, borders `--map-line`; zoom controls top right |
| **Map photo card** | White frame, 8 px corners, slight tilt, place name; hidden when zoomed out of view |
| **Place lists** | Serif h3, note, rows with temperature; visited = link, not visited = plain text |
| **Instagram band** | Photo, centred frame, dark button panel |
| **Breadcrumb, contents list** | §6.3 |
| **Quick facts** | Tint box, icon + mono label + value, 3 / 2 columns |
| **Day by day** | Numbered timeline, stop chips |
| **Island map + legend** | Numbered pins, hover links both |
| **Gallery** | Mosaic 1 + 4, captions on 60 % ink |
| **Budget table** | Mono head on tint, ink total row |
| **Hotel row** | Thumbnail, name, meta, price + Checked, partner label, Check prices |
| **Tips / mistakes** | Two boxes |
| **Fact wheel, fact card** | §6.4 |
| **Footer** | Plain one-line |
| **Declaration, Checked, Spotted a change?** | Kept from earlier versions, restyled with B tokens |
| **State message** (`.state`, `--dashed`, `--sunken`, `--center`) | §6.6. Icon, serif title, one line, actions. Used for the map and fact failures, "No guides yet" and "Coming soon"; the existing `.map-failed` takes the same parts |
| **Photo failed** (`.photo-failed`) | §6.6 state 03. Added by `site.js` when an image fails |
| **Language note** (`.lang-note`) | §6.6 state 04. Pages marked `data-en-only` show it after switching to ՀՅ |
| **Offline bar** (`.offline-bar`) | §6.6 state 05. Sticky under the header, `--action-solid` ground |
| **Toast** (`.toast`) | §6.6 state 10, and the existing "Copied" message |
| **404 illustration** (`.lost--art`, `.lost__art`, `.lost__help`) | §6.5 |

## 8. Images

Placeholders from Unsplash until Inesa's own photos are ready [Q9]:

| Spot | Placeholder | Note |
|---|---|---|
| Hero | Wooden boat on a mountain lake | Bright photo under a dark layer |
| Split | City and harbour from above | |
| Sri Lanka | Train on the Nine Arch Bridge | |
| Rhodes | Coastline | Also the Rhodes cover and a fact photo |
| Rhodes gallery | Lindos bay, Lindos acropolis, Old Town sea gate, stone lane | |
| Prague | Castle over the river | |
| Cyprus, Egypt | Kyrenia harbour; Egypt photo (added Nov 16) | |
| Hotel | Pool at Angela Downtown Hotel | |
| Instagram band | Woman by a river | Replace with Inesa |

## 9. What changed

**Nov 20:**
- **Design system saved in Claude Design:** "Slowsuns" with every token (172 colours in the light and navy themes, spacing, radius, shadows), 20 type styles, the 16 font files, the logo, flags and country shapes, 34 component previews and a brand book. A short "On a Design canvas" note says canvases load only `tokens.css`.
- **Canvas connected and synced:** every page loads the system's tokens; about 400 fixed colours, fonts and corners now use token names. Text styles moved onto the scale: home card description 19 → 18 (`type-lede`), map card names 13 → 15 (`type-ui`), small notes 13 → 14 (`type-small`), day numbers 15 → 13, hotel name 19 → 20, intro lines 19 → 18. White overlays at 60 / 55 % → `white-40`, 80 % → `white-88`. Version A frames deleted.
- **New type style `type-band`** (Urbanist 700, 30 / 28) for the Instagram heading, which §3.2 already described.
- **Canvas:** four more destination pages (Split, Sri Lanka, Prague, Egypt, sample content), the 404 page and an "Error and empty states" board; dead links fixed.
- **Website rebuilt** in `~/Sites/slowsuns/` from the design system (see top), with the audit fixes F1–F7 and F9–F11 (F3, F8 and F12 still open) and the error states in `components/states.css`.

**Nov 18:**
- Error and empty states added (§6.6): a new 404 page and a board with 10 states on the canvas; `components/states.css`, `templates/states.html`, `templates/coming-soon.html` and an updated `templates/404.html` for the design system. Four new destination pages on the canvas (Split, Sri Lanka, Prague, Egypt) with sample content.
- §3.0 added: the three token layers (primitive → semantic → component), with examples and one value traced through all three.
- Destination: a "Follow on Instagram" line and small ghost button after Good to know (SPEC asks for it).
- "Spotted a change? Tell me" opens an Instagram DM.
- Removed from the design: the "Open in Google Maps" link (the map's fallback is now "See all places") and the Privacy & disclosure page and footer link (back before partner links or analytics go live). Canvas: dead links fixed (Explore, map photo cards, "Places I've been", Instagram button), "See all places" added under the map, Follow button added on Destination.
- From the audit: sound off by default; gold confetti (no mint); the "?" uses `--text-hero`; the sticky Places filters get a hairline instead of a shadow; four more primitives documented in §3.1.
- Design system audit re-run on 4B (17 / 20, design_system_audit.md); §3.0 now gives the real primitive names.
- Explore reveal checked with a new tuner page (sliders for speed, size, rotation, edge, zoom, dark fade); the canvas values stay.
- rules.md cut from 25 rules to 10. The full wording moved to the new §11, grouped under the new rule numbers.

**Nov 17:**
- Brand name **Slowsuns** replaces the "[Name]" placeholder in the logo, footer, page titles and docs.
- Hero button: "Explore the map ▸" → **"Explore the places"**, links to Places, no icon. The primary button has no play square anywhere (`.btn__play` and `--btn-play-*` removed).

**Nov 16 (canvas, row B):**
- New pages: **Places**, **Destination (Rhodes)**, **Did you know?** (with phone artboards).
- Menu is now **Places · Did you know?** (Map, About removed). Footer is a plain line on every page.
- Home: headings 600; place names 64; map photo cards show the name only; Instagram frame 372 px.
- New tokens: `--body`, `--tint`, `--edge`, `--navy-3`, `--blue`, `--good`, `--bad-tint`, island map colours.

**Nov 15, Version B (replaces A):** Playfair Display + Urbanist + Space Mono; white mono button; full-bleed hero; 4 sticky country-shape cards with the Explore reveal; country map with month pills, photo cards, two lists, zoom; framed Instagram band. Tried and dropped: circle photos; city outlines; growing-shape, circle and folding-band reveals.

**Version A (Nov 13, replaced):** white + lime + gold, Cormorant + Figtree, night sections, rounded hero frame. Deleted from the canvas Nov 20.

## 10. Open questions for Inesa

- **[Q9]** Own photos for every spot.
- **[Q15]** Instagram line: "The road doesn't stop at the guide. See where I am this week, and where I'm going next." (on the canvas; confirm).
- **[Q17] [!]** Armenian partners for Playfair Display, Urbanist and Space Mono (code uses Noto Serif / Sans Armenian).
- **[Q18] [!]** Uppercase mono labels in Armenian (code turns uppercase off for `hy`).
- **[Q19]** Explore reveal on phones (no hover): first tap opens the photo, second opens the guide [A].
- **[Q20]** Map temperatures are rough November averages [A].
- **[Q21]** About page: keep it (and where to link it), or drop it?
- **[Q22]** Did you know?: who writes the facts, and how many? Sound is off by default (decided Nov 18).
- **[Q23] [!]** Destination: OK to add the disclosure line, "Partner link" label and Checked dates (§6.3), which the artboard leaves out?
- Place descriptions and facts are Claude drafts [A]. Which places are Recommended; in-season lists for all 12 months; launch places; partner programs.

## 11. Build details (moved from rules.md, Nov 18)

rules.md keeps 10 short rules (the homework limit). The full wording of the old 25 rules is here, grouped under the new rule numbers. Nothing was removed; "old 14" means rule 14 in the Nov 17 rules.md.

### 11.1 Tokens (rules.md 1)

- **Link exactly two stylesheets:** `tokens.css`, then `components/index.css`. Add `components/site.js` (deferred). No CSS framework, no scroll or animation library. A map library needs Inesa's OK (rules.md 10). *(old 1)*
- **Colours come only from tokens.** No hex, rgb or named colours outside the primitive layer of `tokens.css`. Pages and components use **semantic** tokens (`--surface-page`, `--text-body`, `--accent` …) or component tokens, **never a primitive** (`--ink-900`, `--space-6`, `--radius-16`) outside `tokens.css`. *(old 2)*
- **Text sizes only from the scale:** `--text-hero`, `--text-title`, `--text-page`, `--text-h2`, `--text-h2-page`, `--text-place`, `--text-card`, `--text-h3`, `--text-lead`, `--text-body`, `--text-ui`, `--text-small`, `--text-label`. They already step down on tablet and phone. No `clamp()` or `vw` font sizes. *(old 6)*
- **Spacing between blocks and sections only from the semantic scale** (`--gap-tiny` … `--gap-section`, `--gutter`); small inner offsets inside a component file may be written in px (≤ 28 px), as on the canvas. **Radius only from the semantic list:** `--radius-flag` 2, `--radius-switch` 4, `--radius-btn` 6, `--radius-chip` 8, `--radius-photo-sm` 12, `--radius-map` 14, `--radius-card` 16, `--radius-band` 18, `--radius-panel` 20, `--radius-stage` 24, `--radius-round` pill. *(old 9)*

### 11.2 Themes and colour jobs (rules.md 2)

- **Two themes, set per section:** `data-theme="light"` (default: white, every page) and `data-theme="navy"` (home map, More guides, the game band). Photos carry their own dark layer. **No section is ever green**, cream or tinted as a whole. *(old 3)*
- **Colour jobs are fixed:** gold = map dots, the highlight word on navy, temperatures, the wheel pointer. Orange = focus ring, current contents item, stop dots, active pin. Orange-text = eyebrows on white. Blue = the "Nature & sky" topic only. Good-green = tip icons and "Copied" text only (never a fill). The 5 % tint = labels, chips, fact boxes, table heads. *(old 4)*

### 11.3 Fonts (rules.md 3)

- **Fonts:** headings, titles and place names use `--font-display` (Playfair Display + Noto Serif Armenian). Running text, nav links, chips and small buttons use `--font-body` (Urbanist + Noto Sans Armenian). The logo name uses `--font-display` too. Eyebrows, country labels, mono buttons and fact labels use `--font-mono` (Space Mono + Noto Sans Armenian). Never a font without its Armenian partner. *(old 5)*

### 11.4 Capitals and highlights (rules.md 4)

- **Highlight at most one phrase per heading** with `<em>` (italic; gold on navy). Armenian gets no italic. *(old 7)*
- **Uppercase + letter-spacing only through `.label`, `.eyebrow` and `.btn--mono`.** Never type capitals into the HTML. In Armenian (`lang="hy"`) these turn off by themselves. *(old 8)*

### 11.5 Buttons and surfaces (rules.md 5)

- **Buttons:** one main action per area. `.btn.btn--primary` (white mono, no icon) only on photos and navy. `.btn.btn--outline` for Explore and "all guides". `.btn.btn--small.btn--solid` / `.btn--ghost` inside cards and rows. `.btn--instagram` only in the Instagram band. *(old 11)*
- **No glass (blur), no drop shadows on cards.** Shadows only on map photo cards and the fact card. Only map photo cards tilt. *(old 10)*

### 11.6 Phone, both languages, contrast (rules.md 6)

- **Every page fits a 390 px phone with no sideways scroll,** in both languages. Every tap target is at least 44 px. Buttons and labels never have a fixed width. Filter chips, month pills, the contents tabs and swipe rows may scroll sideways inside their own row; the page never does. *(old 12)*
- **Contrast WCAG AA.** Text on photos always sits on a dark layer. *(old 21)*

### 11.7 Money and freshness (rules.md 7)

- **Money and freshness:** the Declaration right under the destination title, before the first partner link. Every partner link shows "Partner link" and uses `rel="sponsored noopener"`. A Checked date next to every price and transport fact (place cards, budget table, hotel row). "Spotted a change? Tell me" after Budget and Where to stay. *(old 14)*
- **No ratings, stars, review counts or "Trusted by".** The hero has no cards on it. *(old 13)*

### 11.8 Fallbacks, places and Did you know? (rules.md 8)

- **Every map has a visible fallback:** "See all places" under the month map (the Google Maps link was removed Nov 18), "Simplified map, not to scale" plus the legend list on the island map, and a failed map shows `.map-failed`. *(old 15)*
- **Month map:** opens on the current month; no "All" tab. **Only places Inesa has visited** are photo cards with links. In-season places she hasn't visited are **plain text, never a link, pin, page or partner link.** Every month shows at least one place. *(old 16)*
- **Places page:** only places with a guide. Filters never hide everything silently: show the empty state with "Clear filters". The count line is `aria-live`. *(old 17)*
- **Did you know?:** facts may be about any place, but only a place with a guide gets the "Read my … guide" button. One spin a day. Sound must be easy to turn off. Every fact is checked before launch. *(old 18)*

### 11.9 Motion and images (rules.md 9)

- **Motion:** `transform`, `opacity` and SVG mask values only. Never on text, prices or partner links. `prefers-reduced-motion` removes parallax, stacking scale, photo zoom, confetti and the card pop; the wheel turns quickly; the reveal switches instantly. *(old 19)*
- **Images:** Inesa's own photos, lazy-loaded except the hero and the destination cover, ≤1600 px, <300 KB. Placeholders keep their label. *(old 20)*

### 11.10 Ask Inesa first (rules.md 10)

- **Don't invent components.** Use the closest one in the docs site. If something new is needed, build it from semantic tokens in its own file in `components/`, add it to `components/index.css` and the docs, and list it under "Proposed for DESIGN.md". *(old 22)*
- **Ask before:** a new colour, size, spacing or radius; changing a token value; a new theme; any library (including a map library); adding glass or shadows. *(old 23)*
- **Open questions are hers:** DESIGN.md §10 (Q9, Q15, Q17–Q23), which places are Recommended, the month lists, the facts, launch places, partners. Decided: brand name **Slowsuns** (logo: road-to-the-sun mark + "Slowsuns" in the display face, normal case, through `.logo`; type "Slowsuns" in the HTML, never capitals), hero headline "Every trip, one road.", hero button "Explore the places" (→ Places, no icon), home order Hero → Recommended → Map → Instagram band → Footer, menu Places · Did you know?. *(old 24)*
- **No UI or visual ideas from Atlas Obscura or Lonely Planet.** *(old 25)*
