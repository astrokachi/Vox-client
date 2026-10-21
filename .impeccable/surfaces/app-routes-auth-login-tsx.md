---
version: 1
slug: "app-routes-auth-login-tsx"
primary_target: "app/routes/auth/login.tsx"
related_targets: ["app/styles/login.scss"]
---

# Sign-in

Scope: the sign-in route, first screen a new visitor sees. Mode: Persuade (light): the visitor should know this is Vox, an AI writing assistant for X posts, and press Continue with X. Constraints: OAuth redirect, token handling and error copy are unchanged; existing product copy is kept, only rearranged.

## Direction contract

THESIS: The screen splits into Vox's own blue field and a calm sign-in column. It refuses the centered logo, card and footer-line stack every sign-in ships.

OWN-WORLD: The logo's gradient (#00528a to #1f0c97) as a full-height field holding the Vox mark and the promise in large Funnel Display. Beside it the app's dark ground (#0a0a0a), text-1/text-2 tokens, the shared primary button. No cards, no glow, no glass.

STORY: The visitor reads what Vox does on the field, sees one action in the column, learns that signing in only lets Vox publish what they choose, and continues with X.

FIRST VIEWPORT: Desktop: left half is the field, mark top-left, promise and its one-line explanation anchored bottom-left at display size. Right half: a 360px column centred vertically with "Sign in to Vox", any error, Continue with X, one consent line. Phone: the field becomes a band covering about 65% of the screen height (user's choice), the column follows directly below, the button stays above the fold.

FORM: brand field split, my #6 of seven after one re-roll, seed key 9c33007d.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
