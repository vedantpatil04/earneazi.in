# features/sip-calculator

The SIP calculator UI. Two surfaces, one engine.

```
useSipCalculator       state owner — raw text + last-valid input; no maths
  SipCalculator        the standalone /sip-calculator experience
    SipInputControl    one figure, two synchronised controls (numeric field + slider)
    SipResults         projected value, split into invested and estimated gains, + CTA
    SipDisclaimer      §23.5 — immediately below the result panel
    SipChartPanel      React.lazy boundary around the chart
      SipGrowthChart   stacked area over the projection years (Recharts)
    SipYearlyBreakdown the same data as an accessible table
  SipMiniCalculator    the homepage panel — same hook, no chart, no table
AnimatedRupees         display-only count-up; never touches the source value
useChartColors         resolves chart colours from the theme's CSS variables
```

## No arithmetic lives in this folder

Every figure comes from `calculateSip` / `calculateSipYearlyBreakdown` in
`lib/finance` — see that README for the conventions and the cross-checked
reference figures. This folder decides *when* to recompute, never what the
answer is.

## One hook, two surfaces

Phase 4 requires the homepage panel and the standalone page to run the same
calculation. Sharing `lib/finance` would guarantee the arithmetic matches;
sharing `useSipCalculator` also guarantees the *behaviour* matches — the same
bounds, validation messages, blur-clamping and last-good-value fallback. There
is no second state machine to keep in step.

Two pieces of state rather than one: `raw` holds exactly what is in the text
fields so a half-typed value is not rewritten under the cursor, and `committed`
holds the last values the engine accepted, so the results hold on the last good
figures while a field is being corrected. Empty is a distinct state from zero.

Clamping happens on blur, never on keystroke (§23.2) — typing `1` on the way to
`15` must not be rewritten to the minimum mid-keystroke.

## Two compositions, deliberately

`SipCalculator` is built twice because a pointer and a thumb are not the same
instrument:

- **≥1024px** — controls left, result panel right and sticky within the section,
  so the figures stay visible while the sliders are worked.
- **<1024px** — a slim sticky bar carries the projected value under the header
  for the length of the calculator, with the full panel below the controls. A
  stacked layout alone would push the number off screen the moment you drag.

## Recharts is lazy, and must stay lazy

Recharts is roughly as large as the rest of the application and nothing else on
the site uses it. `SipChartPanel` is the `React.lazy` boundary; the homepage
panel imports nothing that crosses it. Verified at build time: `recharts`
appears only in the `SipGrowthChart` chunk, not in the entry bundle or the
route chunk.

## Accessibility

The chart is `aria-hidden`; the year-by-year table and a visually hidden summary
sentence are its equivalents, so the data is never locked inside the graphic.
Series are distinguished by hatch and stroke dash as well as colour.

The visible figures are not a live region — they tween, and an atomic live
region would re-read the whole panel on every frame of a drag. One short
sentence in a polite live region carries the settled values, and each animated
figure keeps an accurate screen-reader copy for anyone reading the page rather
than listening to it change.

Sliders are native `<input type="range">`, so keyboard support and value
announcements come from the browser. The 44px drag target is built in
`components/ui/Slider.tsx` plus the `.slider-control` rules in `globals.css`:
the input is 44px and transparent, the visible 8px track is the pseudo-element.
