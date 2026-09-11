# lib/finance

Reserved boundary for the SIP calculation logic (Phase 0 Blueprint, Section N).

**Not implemented in Phase 1.** `types.ts` defines the input/output contract
so `features/sip-calculator` can be built against it now. The actual
`calculateSip.ts` — pure, unit-tested, cross-checked against at least two
independent reference calculators, annuity-due convention — is Day 4 /
Phase 3 work per the blueprint's build sequence (Section Q).

Rules this folder must keep holding once implemented:
- No React or UI imports here — pure functions only.
- No AI-based computation anywhere in the calculation path (Section N is explicit about this).
- All internal math at full precision; rounding happens only at display time.
