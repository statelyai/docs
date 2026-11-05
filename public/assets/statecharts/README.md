# Coffee and donut statecharts

Original examples for `/docs/statecharts`. Each JSON definition in `examples/`
is used by the guide's read-only view and the corresponding screenshot.

Screenshots captured from **https://editor.stately.ai/viz** on October 31, 2026.
Source format: `xstate-json`; URL fragment contains the base64url-encoded JSON.
View options: `chrome=plain`, `theme=light`, `panels=none`. The read-only editor
links use `chrome=none`, `canvasSlots=viewportControls,simulationControls`,
`topBar=0`, `expanded=1`, and `panels=none`. Canvas simulation and parent
expansion/collapse are available without a command bar or side panels. No customer models
or account saves were used. Screenshots are unmodified browser captures, cropped to the diagram.

| Screenshot                | Browser crop (x, y, width, height) |
| ------------------------- | ---------------------------------- |
| coffee-order.jpg          | 600, 245, 300, 465                 |
| coffee-nested.jpg         | 430, 210, 620, 540                 |
| coffee-donut-parallel.jpg | 405, 290, 660, 390                 |

The nested and parallel screenshots show the editor's compact child-state
presentation. Child transitions appear inline; parent transitions remain arrows.

To refresh light screenshots, use `statechartExampleURL(example, 'light')` in
`lib/statechart-examples.ts` to open the exact source, capture its rendered
diagram, and update the registered dimensions if the crop changes. Inspect the screenshot before
publishing. Run `check-statechart-models.mjs` and the rendered guide check.

## Dark fallbacks

<!-- dark screenshot capture workflow from scripts/capture-statechart-dark-examples.mjs -->

`dark/` contains native dark-mode PNG captures for all 31 coffee and Harel
examples. These use the same JSON definitions, `theme=dark`, and a transparent
background. `dark-captures.json` records the source hashes, crop dimensions,
viewport, capture date, and renderer. The docs select light/dark images through
the page's theme class, including before hydration and without JavaScript.

Refresh all dark captures, or pass example IDs to refresh selected ones:

```sh
node scripts/capture-statechart-dark-examples.mjs
node scripts/capture-statechart-dark-examples.mjs coffee-order harel-flat
```

Set `PLAYWRIGHT_MODULE` to an installed Playwright module when needed. Run
`node scripts/check-harel-statecharts.mjs` to verify all 31 dark captures against
their sources. Interactive embeds use the docs' selected theme, rather than the
fixed theme used to capture an image.

A future Viz “Copy Docs example” action could export a screenshot, source JSON,
read-only URL, and MDX snippet together. The public read-only route already
exists; this would simplify authoring and prevent source/image drift.
