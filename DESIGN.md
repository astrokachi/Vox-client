---
name: Vox
description: A dark, calm writing desk for X posts, where the drafts are the brightest thing on screen.
colors:
  accent: "#1d9bf0"
  accent-strong: "#0c80ce"
  accent-on: "#e8f6ff"
  bg: "#0a0a0a"
  surface-1: "#0e0e0e"
  surface-2: "#161616"
  surface-hover: "#1c1c1c"
  border: "#262626"
  border-strong: "#333333"
  text-1: "#f2f3f4"
  text-2: "#8b9095"
  text-3: "#5f6368"
  danger: "#ef4444"
  brand-deep-teal: "#00528a"
  brand-indigo: "#1f0c97"
typography:
  display:
    fontFamily: "Funnel Display, sans-serif"
    fontSize: "clamp(2rem, 1.2rem + 3.4vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Funnel Display, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "Funnel Display, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Funnel Display, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
  body-ui:
    fontFamily: "Funnel Display, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  meta:
    fontFamily: "Funnel Display, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Funnel Display, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.3
rounded:
  inset: "4px"
  control: "8px"
  container: "12px"
  overlay: "16px"
  round: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent-strong}"
    textColor: "{colors.accent-on}"
    typography: "{typography.body-ui}"
    rounded: "{rounded.control}"
    height: "36px"
    padding: "0 14px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  button-primary-sm:
    backgroundColor: "{colors.accent-strong}"
    textColor: "{colors.accent-on}"
    typography: "{typography.meta}"
    rounded: "{rounded.control}"
    height: "32px"
    padding: "0 12px"
  button-secondary:
    textColor: "{colors.text-1}"
    typography: "{typography.body-ui}"
    rounded: "{rounded.control}"
    height: "36px"
    padding: "0 14px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-hover}"
  button-ghost:
    textColor: "{colors.text-2}"
    typography: "{typography.body-ui}"
    rounded: "{rounded.control}"
    height: "36px"
    padding: "0 14px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.text-1}"
  button-icon:
    textColor: "{colors.text-2}"
    rounded: "{rounded.control}"
    size: "36px"
  button-signin:
    backgroundColor: "{colors.accent-strong}"
    textColor: "{colors.accent-on}"
    typography: "{typography.body-ui}"
    rounded: "{rounded.control}"
    height: "40px"
    width: "100%"
  composer:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-1}"
    typography: "{typography.body}"
    rounded: "{rounded.container}"
    padding: "12px"
  draft-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-1}"
    typography: "{typography.body}"
    rounded: "{rounded.container}"
    padding: "12px 14px"
  prompt-chip:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-1}"
    typography: "{typography.body-ui}"
    rounded: "{rounded.control}"
    padding: "6px 12px"
  nav-link:
    textColor: "{colors.text-1}"
    typography: "{typography.body-ui}"
    rounded: "{rounded.control}"
    padding: "5px"
  nav-link-active:
    backgroundColor: "rgba(29, 155, 240, 0.2)"
    textColor: "{colors.accent}"
  dialog:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-1}"
    rounded: "{rounded.overlay}"
    padding: "16px"
---

# Design System: Vox

## Overview

**Creative North Star: "The Quiet Desk"**

Vox is a dark, calm writing desk. The room is near-black and the furniture recedes: sidebar, headers and controls sit a step or two above the floor in flat tonal greys, so the only bright things on screen are the words being written. The drafts, the prompt that made them and the post about to be published carry the lightest text; everything around them is set back in secondary grey. Blue appears only where the user acts: one filled button per region, the active nav item, focus rings and the Posted mark.

Density is calm and compact. Type is small and even (14–15px for working text), padding hugs its content, and groups separate by spacing rather than boxes. Panels are flat with a hairline border; shadows exist only on things that float above the desk (dialogs, the mobile drawer, toasts). Motion is short and ease-out, and it all switches off under reduced motion.

The brand's one loud gesture is the logo's blue-to-indigo gradient. It belongs to the mark, avatars and the sign-in field, and nowhere else.

**Key Characteristics:**
- Dark only: near-black ground (#0a0a0a) with tonal surface steps, no light theme.
- One sans throughout (Funnel Display), hierarchy by weight before size.
- One blue action per region; secondary and ghost buttons for everything else.
- Flat surfaces with 1px borders; shadows only on floating layers.
- Three corner sizes by role: 8px controls, 12px containers, 16px dialogs; full rounding only for true circles.
- Phosphor icons only, sized to the text beside them.

## Colors

A neutral near-black stack with a single sky-blue accent and one brand gradient held in reserve.

### Primary
- **X-Sky Blue** (accent): the interactive colour. Focus rings, links inside copy, the active nav item, the Posted mark, focused composer borders (at 60% alpha) and selected states.
- **Deep Press Blue** (accent-strong): the fill of the one primary button in a region. Darker than the accent so the label stays readable.
- **Ice Text** (accent-on): text and icons sitting on Deep Press Blue.

### Secondary
- **Brand Gradient** (brand-deep-teal to brand-indigo, 135deg): the logo's own ink. Used for the Vox mark, empty avatars and the full-height sign-in field. Text on it is a near-white ice tint, never grey.

### Neutral
- **Night Floor** (bg): the page ground behind everything.
- **Desk Panel** (surface-1): panels that sit on the floor: the composer, draft cards, dialogs, the prompt-limit notice.
- **Raised Control** (surface-2): chips and controls sitting on a panel, such as the prompt chip above each set of drafts and skeleton fills.
- **Hover Wash** (surface-hover): hover fill for ghost, secondary and icon buttons.
- **Hairline** (border): the 1px edge on every panel.
- **Strong Hairline** (border-strong): the outline of secondary buttons and hovered cards.
- **Lit Text** (text-1): content and headings: drafts, titles, prompts.
- **Desk Grey** (text-2): secondary copy, meta, labels, placeholders, hints. Meets 4.5:1 on the floor.
- **Dim Grey** (text-3): disabled text and breadcrumb separators only.
- **Signal Red** (danger): errors. Shown as a 10% tint panel with a 30% border and light red text, never as a solid red block.

### Named Rules
**The One Blue Action Rule.** A region gets at most one filled Deep Press Blue button. Every other action is secondary (outlined), ghost (text) or icon.

**The Gradient Is the Logo Rule.** The brand gradient appears only in the mark, empty avatars and the sign-in field. It is never used for text, buttons, borders or glows.

**The No Purple Glow Rule.** No violet accents and no coloured halos or outer glows anywhere. Depth and emphasis come from tone, weight and the single blue.

## Typography

**Display Font:** Funnel Display (with sans-serif)
**Body Font:** Funnel Display (with sans-serif)

**Character:** One quietly geometric sans for everything. It reads as a tool, not a brand statement; personality comes from tight sizes and confident weights, not from a second face.

### Hierarchy
- **Display** (600, clamp(2rem, 1.2rem + 3.4vw, 4.5rem), 1.02): the sign-in promise only. Once per product, never inside the app.
- **Headline** (600, 24px, 1.25): page titles such as Posts and Sign in to Vox.
- **Title** (600, 16px, 1.25): dialog titles, empty-state titles, section headings.
- **Body** (400, 15px, 1.45): drafts and post text, the composer (16px on phones to stop iOS zoom). Keep reading width near 65–75ch.
- **Body UI** (400, 14px, 1.4): buttons, nav links, breadcrumbs, prompt chips.
- **Meta** (400, 13px, 1.5): small print, notices, small buttons.
- **Label** (500, 12px): draft tone labels (Standard, Playful, Educative), the prompts-left hint, character counts. Sentence case, never uppercase-tracked.

### Named Rules
**The Weight First Rule.** Build hierarchy with weight and colour (Lit Text against Desk Grey) before size. App titles stop at 24px.

**The No Eyebrow Rule.** No small uppercase labels above headings. Tone labels sit inside their card, in sentence case.

## Layout

A fixed left sidebar (220px, collapsing to 50px icons) beside a single content column. Lists and settings cap at 880px; the post and refine workspace caps at 1040px with the composer docked at the bottom and content scrolling above it. Breakpoints are 640, 768, 1024 and 1280px.

Mobile first: below 768px the sidebar becomes a drawer, draft grids drop from three columns to one, and the composer stays pinned at the bottom in thumb reach. The sign-in page splits 50/50 at 1024px and stacks the brand field above the sign-in on phones.

Spacing steps are 4, 8, 16, 24 and 32px. Items inside a component sit 8–12px apart, groups 16–24px, and turns in a post's history 32px. A heading always has more space above it than below.

## Elevation & Depth

Depth is tonal, not shadowed. Night Floor, Desk Panel, Raised Control and Hover Wash step up in lightness, and every panel carries a 1px Hairline. Shadows are reserved for layers that float over the desk and always have offset and soft blur:

### Shadow Vocabulary
- **Dialog** (`box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5)`): the publish dialog over a 60% black scrim with a 2px blur.
- **Drawer** (`box-shadow: 4px 0 24px rgba(0, 0, 0, 0.5)`): the mobile navigation drawer.
- **Toast** (frosted 88% Night Floor with a 16px backdrop blur): transient notifications only.

### Named Rules
**The Flat Desk Rule.** Anything that sits in the page is flat with a hairline. Only dialogs, drawers and toasts may cast a shadow.

## Shapes

Corners are set by role, not by component, from five tokens in `$radius` (app/styles/_variables.scss):

- **Control** (8px): every button (text, icon, sign-in), chips, nav rows, menu items, error and notice panels.
- **Container** (12px): the composer, draft cards, the post preview, toasts, dropdown menus, the sign-in mark's tile.
- **Overlay** (16px): dialogs only.
- **Inset** (4px): things inside a control or a line of text: text-link focus areas, text skeleton lines, the editable post text.
- **Round** (full): only true circles: avatars, dots, the spinner, scrollbar thumbs, the image remove button.

Borders are always 1px.

### Named Rules
**The Corner Role Rule.** Pick the corner by what the element is (control, container, overlay), never by what looks nice in place. A new element takes an existing role; a new value means a new role in `$radius`, not a one-off.

**The Nesting Rule.** An inner corner is never rounder than its container: images inside the 12px post preview are 8px. A skeleton takes the corners of the thing it stands in for.

## Components

### Buttons
Calm and compact: small labels, tight padding, quick press feedback.
- **Shape:** Control corners for every button, text or icon-only. No pills.
- **Primary:** Deep Press Blue fill, Ice Text label, 36px tall (32px small), 14px side padding. Hover lifts to X-Sky Blue.
- **Secondary:** transparent with a Strong Hairline outline and Lit Text. Hover fills with Hover Wash.
- **Ghost:** text only in Desk Grey. Hover fills with Hover Wash and lifts the text to Lit Text.
- **States:** every button scales to 0.97 on press, shows a 2px X-Sky Blue focus ring offset 2px, and drops to 50% opacity when disabled.

### Chips
- **Prompt chip:** Raised Control fill, Lit Text, 8px corners, sits above the drafts it produced. Not interactive.

### Cards / Containers
- **Draft card:** Desk Panel, 12px corners, Hairline border, 12px by 14px padding. A tone label at the top, the draft text, then right-aligned Refine (ghost) and Post (secondary) buttons. A posted draft swaps Post for a View on X link and shows a blue Posted mark. The latest refine version takes a 60% X-Sky Blue border.
- **Skeletons:** match the loaded layout's footprint, with a slow 1.5s shimmer.

### Inputs / Fields
- **Composer:** one surface with no inner box. Desk Panel, 12px corners, Hairline border; the textarea is borderless and transparent. On focus the whole composer's border shifts to 60% X-Sky Blue. The footer holds a prompts-left hint and the primary action.
- **Error:** inline Signal Red tint panel directly above the action it relates to.

### Navigation
- **Sidebar links:** 14px Body UI with a 22px Phosphor icon, 8px corners. Hover takes a 10% blue wash with blue text; the active page takes a 20% blue wash and medium weight. "New post" and "Posts" sit in one group; Recents follow one section gap below.
- **Breadcrumb header:** Desk Grey links separated by Dim Grey slashes, the current page in semibold Lit Text. Only the post title truncates.

### Publish Dialog
The one place anything is published. A 600px Desk Panel dialog with a pure black post preview inside it (avatar, name, handle, editable text, images), an image button, an `n / 280` counter that turns Signal Red past the limit, and the region's single primary Post button. After posting it becomes a centred success state with View on X.

## Do's and Don'ts

### Do:
- **Do** keep content in Lit Text (#f2f3f4) and chrome in Desk Grey (#8b9095).
- **Do** use exactly one Deep Press Blue filled button per region.
- **Do** separate groups with spacing (8 / 16 / 24 / 32px) before reaching for a border or a box.
- **Do** use Phosphor icons at 14–22px, matched to the text beside them.
- **Do** keep transitions at 150–300ms with the ease-out curve `cubic-bezier(0.16, 1, 0.3, 1)`, and let the global reduced-motion rule switch them off.
- **Do** theme browser surfaces: blue text selection at 35% and a blue caret, as the global styles already do.

### Don't:
- **Don't** add a light theme. Vox is dark only.
- **Don't** use purple or violet, coloured glows, gradient text, or the brand gradient on buttons.
- **Don't** use emoji anywhere in the interface; icons come from Phosphor.
- **Don't** put small uppercase eyebrow labels above headings.
- **Don't** nest cards, or put a shadow on anything that sits in the page.
- **Don't** use pill-shaped buttons or hard-coded corner values; use a `$radius` role.
- **Don't** use a coloured stripe thicker than 1px on the edge of a card, alert or toast.
