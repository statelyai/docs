# Design: stately.ai (landing, docs, blog)

The Viz editor's [`DESIGN.md`](https://github.com/statelyai/viz/blob/main/DESIGN.md)
is the canonical design system. Its token values live in
`packages/editor/src/index.css` in `statelyai/viz`. This file covers only how
this site applies it. Do not restate Viz values here; copy them into CSS with
a comment naming the Viz token.

## Shared with Viz

- Inter for UI and prose; system monospace for code, identifiers, state and
  event names.
- Cool-neutral gray ramp (`gray-25` to `gray-900`, mirrored in
  `tailwind.config.js`) and Stately Blue (`#0f6ee5`, hover `#005cde`).
- Saturated color carries meaning (links, primary action, selection, status,
  authored graph color), never decoration.
- Sentence case. Uppercase only for event tags.
- Light/dark parity. Dark mode is the `.dark` class (next-themes).
- Flat until floating: docked surfaces have no shadow.
- Motion durations 0/100/150/200/300ms on named properties; reduced motion
  removes movement.

## Docs and blog (`app/global.css`)

Fumadocs tokens map to Viz semantic roles:

| Fumadocs | Viz role | Light | Dark |
|---|---|---|---|
| `fd-background` | light `floating`, dark `canvas` | `#fdfdfe` | `#15151d` |
| `fd-foreground` | `fg` | `#15151d` | `#f5f7f7` |
| `fd-muted-foreground` | `fg-muted` | `#4d4f5f` | `#9da1b1` |
| `fd-card` | light `canvas`, dark `floating` | `#eff1f3` | `#1f1f29` |
| `fd-popover` | `floating` | `#fdfdfe` | `#1f1f29` |
| `fd-muted` / `accent` / `secondary` | `raised` | `#dfe3e7` | `#2e2f3c` |
| `fd-border` | `border` | `#dfe3e7` | `oklch(1 0 0 / 10%)` |
| `fd-primary`, `fd-ring` | `primary-text`, `focus` | `#005cde` | `#63a3fc` |

Light pages use `floating` as the page so long-form text sits on the lightest
surface; the sidebar and cards take `canvas`.

## Landing and marketing pages (`app/(home)/_landing`)

Tokens are the `--sp-*` variables in `landing.css`, scoped to `.sp`, copied
from Viz with the same surface mapping as the docs (`--sp-bg` matches
`fd-background`). The header comment records the last sync date; re-sync when
Viz's `index.css` changes.

- The statechart motif (state boxes, 2px edges, event pills, arrowheads,
  initial/final markers, parallel regions) is the only ornament, and it
  connects real page elements.
- Machines are SVG (`Statechart.tsx`) sized from measured Inter 600 widths
  (`text.ts`), not live editor iframes. At most one click-to-load live demo.
- Every edge label routes through `EdgeLayer.tsx`/`router.ts` and is draggable.
  Edge colors use the editor's transition ramps (`--sp-ramp-<c>-edge`/`-label`).
- Simulation highlight matches the editor: 4px active outline, 2px ring on
  enabled labels, half-opacity halo on the taken edge, inactive at 0.5.
- No mono eyebrows, colored status dots, gradients, glass, or bokeh.

## Copy

Avoid "not X, it's Y", fragment triads, colon slogans, rhetorical questions,
meta or honesty lines, and invented numbers. Docs prose follows the
`writing-docs` house style.
