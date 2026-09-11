# features/sip-calculator

Reserved boundary for the interactive SIP calculator UI — slider inputs,
live-updating maturity figure and chart (Phase 0 Blueprint, Section N).

**Not implemented in Phase 1.** When built, this feature calls
`calculateSip` from `lib/finance` (once that exists in Phase 3) — it must
never reimplement the math inline. Chart rendering uses Recharts, styled
with the `chart-1..5` color tokens from the design system
(tailwind.config.ts).
