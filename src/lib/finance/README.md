# lib/finance

Pure calculation and formatting for Earneazi's financial tools. No React,
no DOM, no chart code, no network — everything here is deterministic and
unit-tested.

## The SIP engine

`calculateSip.ts` is the single implementation of the SIP maths. The
summary figures, the chart and the year-by-year table all read from it;
there is deliberately no second implementation anywhere in the app.

```
calculateSip(input)                 → totalInvested, futureValue, estimatedGains
calculateSipYearlyBreakdown(input)  → one row per year, same formula at shorter horizons
validateSipInput(raw)               → discriminated union; UI validates before calling
SIP_INPUT_LIMITS                    → the accepted ranges; the UI derives its bounds from these
```

## Conventions, and why they are written down

Two independent choices sit behind every SIP figure. Published calculators
differ on both, so comparing our output against another tool is only
meaningful once you know which conventions that tool uses.

**1. Contribution timing — annuity due.** Each instalment is treated as
invested at the *beginning* of its month, so every contribution earns one
extra month of growth:

```
FV = P × [ ((1 + i)^n − 1) / i ] × (1 + i)
```

A calculator using end-of-month contributions will return a smaller number.
That is a different convention, not an error on either side.

**2. Monthly rate — nominal annual rate ÷ 12.**

```
i = annualReturnPct / 12 / 100
```

This is the convention fixed by the project specification, implemented in
`monthlyRateFromAnnualPct` — the one place the decision lives.

> **Open question for the client.** Several large fund houses (HDFC Mutual
> Fund among them) and Groww's own explainer page describe this simple
> division as incorrect, and instead derive the monthly rate geometrically
> as `(1 + annualRate)^(1/12) − 1`. For 12% p.a. that is roughly 0.9489% a
> month rather than 1.0000%, and the gap compounds: ₹5,000/month over 10
> years comes to about **₹11,61,695** under our convention and about
> **₹11,20,534** under the geometric one.
>
> The specification pins the simple division, so that is what ships and
> nothing has been changed silently. If the client prefers the geometric
> convention, `monthlyRateFromAnnualPct` is a one-line change and the tests
> in `calculateSip.test.ts` are the only other place the figures appear.

**3. Precision.** No intermediate rounding. Every returned value is at full
floating-point precision; rounding happens once, at display time, in
`format.ts`.

## Verification

`calculateSip.test.ts` pins the engine against published worked examples
from calculators that share both conventions above:

| Input | Expected maturity | Source |
|---|---:|---|
| ₹1,000/month, 12%, 1 year | ₹12,809 | Bondbazaar |
| ₹500/month, 12%, 10 years | ₹1,16,170 | Elearnmarkets |
| ₹5,000/month, 12%, 10 years | ₹11,61,695 | Project specification |

Run them with `npm test`.

## Formatting

`format.ts` handles Indian digit grouping (2,2,3 — ₹11,61,695, not
₹1,161,695) via the `en-IN` locale, plus lakh/crore short forms for chart
axes and narrow screens. Non-finite values render as an em dash, so a
broken calculation can never surface as `NaN` or `Infinity`.
