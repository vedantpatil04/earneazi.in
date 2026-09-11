# features/sip-calculator

The interactive SIP calculator UI. Composed onto the page by
`app/pages/SipCalculatorPage.tsx`, which owns the surrounding copy,
assumptions and disclaimer.

```
SipCalculator          state owner — raw text + last-valid input; no maths
  SipInputControl      one figure, two synchronised controls (numeric field + slider)
  SipResults           projected value, split into invested and estimated growth
  SipGrowthChart       stacked area over the projection years (Recharts)
  SipYearlyBreakdown   the same data as an accessible table
useChartColors         resolves chart colours from the theme's CSS variables
```

**No arithmetic lives in this folder.** Every figure comes from
`calculateSip` / `calculateSipYearlyBreakdown` in `lib/finance` — see that
README for the conventions and the cross-checked reference figures.

Two pieces of state rather than one: `raw` holds exactly what is in the
text fields so a half-typed value isn't rewritten under the cursor, and
`committed` holds the last values the engine accepted, so the results stay
on the last good numbers while an invalid field is being corrected.

The chart is `aria-hidden`; the year-by-year table and a visually hidden
summary sentence are its accessible equivalents, so the data is never
locked inside the graphic. Series are distinguished by shape as well as
colour.

This route is lazily loaded in `App.tsx` — Recharts is roughly as large as
the rest of the application, and no other page uses it.
