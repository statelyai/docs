# Harel statecharts companion assets

Native adaptations for `/docs/harel-statecharts`, based on David Harel,
*Statecharts: A visual formalism for complex systems*, Science of Computer
Programming 8 (1987), pages 231-274. DOI `10.1016/0167-6423(87)90035-9`.
The original PDF remains externally hosted. No paper scans are published here.

<!-- section and figure coverage from coverage.json; source and capture correspondence from examples/*.json and captures.json -->

`coverage.json` records all 17 numbered sections/subsections and all 49 figures.
Its 28 examples follow the article's reading order. Consecutive refinements and
alternative views can share a native model. Figure 7 is a physical device
illustration. Figure 18 is intentionally contradictory. Overlap, nondeterminism,
cyclic broadcasts, and unresolved event semantics have explicit adaptation
boundaries in the article, coverage file, and individual model metadata.

Each definition in `examples/` is the exact source used by its read-only `/viz`
URL and screenshot. `captures.json` records source SHA-256, viewport, crop,
scale, renderer, and capture time. Screenshots are unmodified browser captures
from the production Stately editor, clipped around the rendered graph. The
editor's compact child-state view renders many child transitions inline.

`lib/harel-statechart-examples.ts` registers these definitions and capture
sizes. `StatechartExample` keeps the screenshot visible and mounts the anonymous,
read-only editor only when its disclosure is opened. It enables simulation,
parent-state expansion/collapse, and pan/zoom. Structure and simulation panels
start closed so the diagram has room. The source is
UTF-8 JSON encoded as base64url in the fragment, with `format=xstate-json`,
`panels=structure,simulation` and query `activePanels=`. Full editor chrome
exposes the controls while `/viz` keeps editing disabled. The source tag is
`docs-harel-statecharts`. Static screenshots retain the plain light capture view
(`chrome=plain`, `theme=light`, `interactive=1`, `panels=none`).

## Refresh screenshots

<!-- capture command and optional arguments from scripts/capture-harel-examples.mjs -->

Install Playwright with Chrome available, then run:

```sh
node scripts/capture-harel-examples.mjs
```

Set `PLAYWRIGHT_MODULE` to a module path if Playwright is installed outside the
repository. Optional positional example IDs refresh only those captures.
Inspect refreshed images before publishing. The URL source and screenshot must
continue to use the same JSON definition.

## Execution boundaries

<!-- provider implementations and asserted behavior from scripts/check-harel-watch-models.mjs and scripts/check-harel-advanced-models.mjs -->

The embeds support diagram inspection. Named actions and guards are labels;
the behavior checks supply actual XState implementations where required.
Physical clock predicates, inactivity, alarm times, and button-hold durations
are explicit input-adapter events in the watch. Numeric settings, timekeeping,
and device activities are outside the control chart. The month increment in
the paper's combined scenario is supplied in the watch check.

The paper's `clear-history(main*)` is a host reset boundary here. Battery
removal/death must stop and replace the actor before reinsertion. Sending both
battery events to the same actor does not establish history erasure.

History navigation adds explicit `ENTER`, `LEAVE`, and `GO_*` events absent
from the structural original figures. The update and field-selection models
use targetless actions instead of the paper's history self-reentry. They retain
the selected field without implying its entry/exit effects.

The timeout example implements a 2000ms upper bound from Figure 35 and an
illustrative 500ms lower bound from its surrounding text. The telephone example
uses two finite instances, not a complete thousand-phone exchange. Overlap uses
explicit duplication or an inactive-component workaround. Conflict resolution
uses named choices. Broadcast-cycle emission actions stay symbolic, avoiding
an automatic infinite cascade. Figure 48 yields B/D/F with the supplied XState
providers; the original leaves that semantic question open. Figure 49 uses a
declared input-packet policy and leaves D unreachable.

## Checks

<!-- verification commands from scripts/check-harel-*.mjs -->

```sh
node scripts/check-harel-watch-models.mjs
node scripts/check-harel-advanced-models.mjs
node scripts/check-harel-statecharts.mjs
node scripts/check-harel-statecharts.mjs http://localhost:4389
```

The watch checks compare 781 parallel/product traces and exercise guarded
hierarchy, three history modes, update scope, orthogonal interfaces, stopwatch,
beep suppression, the combined month scenario, alarm synchronization, and host
restart. Advanced checks exercise real timer boundaries with `SimulatedClock`,
entry/exit effects, actual raised events, digit selection/cycling, overlap
workarounds, conflict choices, and the declared semantic policies.

The coverage check rejects missing headings, figure numbers, models, captures,
or source/capture hash drift. Against a running production build it also checks
section and fragment anchors, image/source responses, deferred embeds, canonical,
indexability, discovery, sitemap, and Markdown output. Numerical coverage alone
does not establish paper fidelity; the prose and model metadata must be reviewed
against the original figures.
