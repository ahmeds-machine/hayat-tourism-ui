# Hayat Tourism Website Rebuild

## Project
Rebuilding hayattourism.com (travel/tourism agency, client contract) as a modern static site. Structural blueprint comes from armenia.travel — the official Armenia tourism portal — used strictly as a UI/UX reference. It's a government site built by an agency; we replicate layout, spacing, and interaction patterns, never their copy, photos, hero footage, logo, or "The Hidden Track" branding.

## Stack
Plain HTML/CSS/JS, no framework. Matches the current static site, trivial to deploy anywhere.
```
/index.html
/css/style.css
/js/main.js
/assets/images/
/assets/video/hero.mp4      <- placeholder, screen recording, swap before client sees it
/design-reference/          <- armenia.travel screenshots, local-only, never ships
```

## Phase
**Phase 1 (now):** structural pass. Match armenia.travel's section layout, spacing, type scale, and interaction patterns exactly, using Hayat placeholder copy + whatever images we have. Don't polish content yet.
**Phase 2 (later):** swap in real Hayat content, brand colors/logo, rearrange per client/our feedback.

## Design tokens
**Colors**
- `--color-ink: #10182B` — dark navy, section backgrounds + primary text
- `--color-accent: #F2960F` — orange, CTAs / active states / logo accent
- `--color-bg-light: #F2F1EE` — off-white section background
- `--color-white: #FFFFFF`

**Typography**
- Display/headline: bold rounded geometric sans. Armenia's is a custom rounded grotesk — closest free open alternative is **Baloo 2** or **Fredoka** (Google Fonts), extra-bold weight, generous tracking on the wordmark.
- Body/UI/nav: clean geometric sans — **DM Sans** or **Inter** (Google Fonts).

**Shape language**
Large-radius rounded corners on cards, hero, buttons (16–32px). Soft drop shadows on floating cards. Pill-shaped nav CTA and category tabs.

## Section inventory (homepage) — from screenshots in /design-reference/
1. **Nav** — logo left, center links w/ dropdown chevrons, pill CTA button, right icon cluster (map/search/bookmark/lang toggle), transparent-over-hero → solid on scroll
2. **Hero** — full-bleed video background, rounded bottom corners, bottom-aligned heading + scroll cue
3. **Dark statement section** — big centered bold headline on navy bg, asymmetric staggered photo collage below
4. **Immersive panorama band** — full-width photo flanked by smaller stacked photos left/right, nav sticky and visible over it
5. **Category tabs + grid** — pill tab group (one filled/active, rest outline+icon), 3-card image grid with caption below each
6. **Secondary hero / inquiry widget** — background image, floating white card right-aligned with form fields + CTA + sub-element
7. **Top picks carousel** — heading + subcopy left, arrow nav right, horizontal-scroll cards with image + bold overlaid caption (gradient scrim)
8. **Quick-link icon grid** — 5 cards (3+2 layout), colorful line icons, giant wordmark/hashtag statement below
9. **Footer** — newsletter signup + cert/partner mark, link columns, socials + hashtag + CTA pill, small live-info widget, copyright row, oversized logo wordmark bleeding off-screen

## Hayat adaptation notes (placeholder-level, apply now)
- Booking widget (section 6) → adapt to an inquiry/WhatsApp-style lead form — no Booking.com affiliate
- Nav mapping: About Armenia→About Us · Places to Go→Destinations · Things to Do→Packages · Plan Your Trip→Travel Info · Experiences, Blog→dropped · Events→drop or repurpose as Offers
- Footer weather widget → repurpose (e.g. live support status) or drop
- Hero video: `/assets/video/hero.mp4`, placeholder — flagged above, swap before real use
- All copy is placeholder, East-Africa/Horn-of-Africa travel flavored — final copy comes later

## Skills to use for this build
- `frontend-design` — distinctive, non-templated visual execution
- `ui-theme-designer` — turn the tokens above into a real theme file before building sections
- `design` (synced plugin) — general layout/UX pattern guidance
- `taste-skill` — keep aesthetic judgment sharp, avoid generic AI-site look
- `ui-ux-pro-max` — broader UI/UX pass once sections are structurally in place
- `design-review` — self-critique pass at the end against `/design-reference/` screenshots

## Constraints
- Responsive, mobile-first
- No armenia.travel assets (images, video, logo, "Hidden Track" branding) ship in the build — `/design-reference/` is gitignored
- Clean, practical code, no decorative bloat
