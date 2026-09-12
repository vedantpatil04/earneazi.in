# EARNEAZI V1 — PHASE 0
## Audit, Reference Analysis & Design System Lock

**Status:** Planning only. No code, no repository changes, no dependency changes.
**Scope:** Definitive design / UX / interaction specification governing Phases 1–7.
**Date of audit:** 11 September 2026

---

### Evidence base for this audit

| Source | What was actually inspected |
|---|---|
| Reference A — Previous Earneazi | `http://www.earneazi.com` (full DOM content), screen recording of the live old site (frames sampled across the full scroll) |
| Reference B — Current Earneazi | 7 desktop screenshots at 1920×1080 (hero, services, goals, differentiators, process, founders/SIP, footer), `https://earneaziin.vercel.app` (SPA shell only — client-rendered, so markup was not retrievable) |
| Reference C — Reputes | `https://www.reputes.in` (full DOM content), screen recording (frames sampled across the full scroll) |

**Gaps in the evidence base, which affect confidence levels below:**
- No mobile or tablet screenshots of the current build were supplied. All responsive findings are inferred from desktop composition and must be re-verified in Phase 1.
- No dark-theme screenshots of the current build were supplied. The navbar contains a theme toggle and the document declares `theme-color: #0F1713` (a near-black green) which does not match any colour visible in the light-theme screenshots. Dark theme is therefore treated as **unaudited and unverified**.
- The repository was not provided in this session, so the technical architecture audit is limited to what is observable from the rendered output and the confirmed stack.

---

### Confidence tagging used throughout

Every recommendation in this document carries exactly one tag:

- **[CONFIRMED]** — required by the brief, the locked roadmap, or the confirmed stack. Not open for re-litigation in Phase 1.
- **[INFERRED]** — derived from direct observation of Reference A, B or C. Reliable, but the underlying observation should be re-checked if the artefact changes.
- **[PROPOSED]** — a design recommendation made by this audit. Needs a yes/no from Ved before Phase 1, but does not need the client.
- **[VERIFY]** — cannot be decided internally. Requires the client (business fact, legal claim, phone number, credential) or an external check (hosting plan, font licence).

Section 36 lists every decision that must be closed before Phase 1 opens.

---

## 1. Executive Diagnosis

The current Earneazi build is a better *product* than the old site and a weaker *brand* than the old site. It fixed the right problems and lost the right assets while doing it.

**What the current build got right, and must be protected.** [INFERRED]
The information architecture is genuinely good. "Start from what you're trying to do" is the correct organising idea for a financial advisory firm, and it is a real differentiator against every other Belagavi distributor site. The copy is disciplined, human, and free of the pressure language the old site leaned on. The services accordion, the goal selector, and the hero trajectory chart are three original, defensible ideas. None of that should be thrown away.

**What the current build got wrong, and is the reason this phase exists.** [INFERRED]
Four failures, in order of severity:

1. **The brand was replaced rather than refined.** Earneazi's recognisable asset is a bold blue geometric wordmark on a navy-and-blue system. The current build is a cream page, a high-contrast Didone-style serif, a navy ink, and a tan/gold accent that appears nowhere in Earneazi's history. A returning client would not recognise this as the same company. The brief requires preserving the identity, so this is a direct requirement failure, not a taste difference.

2. **The visual system is the current default look of AI-generated design.** Warm cream ground near `#F4F1EA`, high-contrast serif display, small tan accent, `01/02/03` monospace markers, a short hairline "eyebrow" rule above every single heading, an arrow glyph appended to every CTA, identical rounded cards with identical radii and identical soft shadows. Each of these is individually defensible; all of them together, on every section, is the specific pattern the brief bans in the phrase "no generic AI-generated visual patterns." This is the single most important thing Phase 1 changes.

3. **Trust content was deleted rather than corrected.** The old site's claims were largely unverifiable and some were non-compliant, so removing them was correct. But the current build removed the *verifiable* material along with them: there is no phone number, no address, no working hours, no WhatsApp, no AMFI/ARN identity, and no founder detail beyond a name and a job title. A financial-services site that cannot be contacted and states no credentials converts worse than one with imperfect claims. The fix is a verified-content register, not silence.

4. **Layout discipline is inconsistent at desktop width.** Multiple sections run an editorial block across roughly the left half of a ~1560px container and leave the right half empty with no anchoring element, while adjacent sections run full-width grids. The page reads as two different grids fighting. The "How it works" connector rule terminates in empty space on the right. The founders row places two cards on a 12-column grid with large internal dead space and duplicate "AS" monograms for two different people.

**What Reputes contributes, and the trap in it.** [INFERRED]
Reputes is a motion reference and nothing else. Its useful ideas are structural: full-bleed section colour inversion as the transition device, a pinned editorial column with content scrolling past it, stat rows that wipe in as bands, a rounded slab that overlaps the preceding section, and a horizontal marquee. Its execution has a defect Earneazi must not inherit: in the sampled recording, the "Milestones That Define Us" section renders as an empty black screen mid-scroll because its content is gated behind reveal animations. On a financial site, content that is invisible until an animation fires is a conversion failure and an accessibility failure at the same time. Reputes is also a Wix build with placeholder copy still live in production; its motion is bought, not engineered, and its performance profile should not be copied.

**The Phase 0 verdict.** Earneazi V1 should keep the current build's *thinking*, restore the old build's *identity and substance*, and borrow only Reputes' *structural motion vocabulary*. The result should look like a Belagavi financial advisory firm that hired a serious design studio, and should not look like a marketing agency, a fintech startup, or a template.

---

## 2. Current Earneazi Audit

### 2.1 Structure and information architecture

Observed page order (desktop): Hero → Services (accordion) → Financial Goals (tabbed selector) → Differentiators ("What working with us actually looks like") → Process ("How it works") → Founders ("The people behind Earneazi") → SIP explainer ("Investing a little, every month") → Footer. Routes exist for at least `/contact` (visible in the status bar on hover) and nav items for Services, Financial Goals, SIP Calculator, About, FAQ. [INFERRED]

**Strengths.** The narrative order is correct: promise → what we do → what you want → why us → how it runs → who we are → the mechanic. Each section answers the question raised by the one above it. [INFERRED]

**Weaknesses.**
- FAQ and Contact appear in navigation but not in the homepage scroll. On a single-location advisory business, both belong in the home narrative, not only as routes. [PROPOSED]
- There is no trust/credential band anywhere in the homepage flow. [INFERRED]
- There is no contact affordance in the entire scroll other than "Book a consultation," which resolves to a route rather than an immediate channel. [INFERRED]

### 2.2 Visual system

- **Ground:** warm cream/parchment, approximately `#F2EFE9`, with a second slightly cooler surface used for banded sections. [INFERRED]
- **Ink:** deep navy, approximately `#10263B`, used for all display type. [INFERRED]
- **Primary action:** a muted steel blue, approximately `#1D4E7C`, used on the navbar CTA, hero CTA and footer CTA. [INFERRED]
- **Accent:** tan/gold, approximately `#B08A3E`, used for the logo dot, icon-tile fills, chart markers, bullet dots and the SIP trend line. [INFERRED]

Findings:
- The cream + Didone + tan triad is the exact palette cluster that currently reads as machine-generated. It also has no relationship to Earneazi's existing brand. [INFERRED]
- The tan accent appears at small sizes on cream (bullet dots, chart markers, "Usually involves" chips). Tan on cream at those sizes is very likely below the WCAG AA 4.5:1 threshold for text and 3:1 for meaningful graphics. Must be measured, not assumed. [PROPOSED → measure in Phase 1]
- The steel blue CTA is the only saturated colour on the page and it is doing three unrelated jobs: primary action, link colour, and chart line colour. Colour roles are not separated. [INFERRED]

### 2.3 Typography

- Display: a high-contrast transitional/Didone serif with strong thick-thin modulation, set very large (hero ≈ 84–92px), tight leading, sentence case with a terminal full stop as a stylistic device ("One advisor for every money decision that matters."). [INFERRED]
- Body: a humanist/geometric sans at ≈18–20px with generous leading. [INFERRED]
- Numerals: a monospace face used for `01`–`04` step markers. [INFERRED]

Findings:
- The terminal-full-stop device on every display heading is applied uniformly, which turns a voice choice into a tic. [INFERRED]
- The serif display contradicts the Earneazi wordmark, which is a bold geometric sans. The brand's own logotype and the page's headline voice are from different design systems. [INFERRED]
- Monospace `01`–`04` markers appear on the process section (legitimate: it is a genuine sequence) but the same eyebrow/hairline device also appears above non-sequential sections, where it encodes nothing. [INFERRED]
- No evidence of tabular lining figures being enforced for financial values. This matters the moment the SIP calculator animates numbers. [INFERRED]

### 2.4 Spacing, alignment and grid

- Container appears to be ~1560px wide with left content edge at ~172px on a 1920 viewport. [INFERRED]
- Section rhythm is roughly consistent (large vertical gaps), but horizontal discipline is not: "What working with us actually looks like" sets its headline block to ~48% width and then runs a 2-column feature grid at ~100% width beneath it; "How it works" runs a 4-column grid at full width under a headline occupying ~35%; "The people behind Earneazi" runs an intro at ~40% with an "About Earneazi" link floated hard right and vertically misaligned against the intro's second line. [INFERRED]
- The founders row's two cards leave roughly 55% of their own internal area empty. [INFERRED]
- The process connector rule runs from the first icon to the right container edge, terminating in nothing. [INFERRED]

### 2.5 Components and states

- Accordion (services): icon tile + title + one-line summary + circular ±. Expanded state shows a 2-column body with prose left and a bullet list right, plus a "More on …" link. This is the strongest component in the build. [INFERRED]
- Goal selector: vertical list of six goals, selected item gets a tinted surface and a filled navy icon tile; detail panel on the right with description, "What we'd work through" list, a "Usually involves" chip, and a CTA. Also strong. [INFERRED]
- Cards: a single border radius (~12px) and a single hairline border applied to every card type regardless of hierarchy. [INFERRED]
- No visible hover/focus/active specification can be confirmed from static screenshots. Focus visibility is **unaudited**. [INFERRED]

### 2.6 Content and correctness defects

| Defect | Evidence | Severity |
|---|---|---|
| Both founders render the monogram "AS" | Founders section, Abhishek Sharma and Anil Souza both show `AS` | High — visible error on the trust section |
| Founder cards carry no bio, tenure, or credential | Founders section | High — trust regression vs old site |
| Hero chart labels collide with the plotted line and markers | "Fund education" and "Buy a home" labels overlap the curve | Medium |
| SIP explainer chart is visually meaningless | Twelve identical-height bars with a straight diagonal line that has no relationship to them | Medium |
| Footer has no contact information, address, hours, or legal routes | Footer | High — conversion and compliance |
| No WhatsApp anywhere | Whole build | High — removes the old site's best-performing channel |
| Nav "SIP Calculator", "About", "FAQ", "Contact" exist as destinations but homepage does not surface FAQ or contact | Nav vs scroll | Medium |
| Disclaimer exists only as small footer text | Footer | Medium — it must sit next to the calculator output |

### 2.7 Technical and production-readiness gaps (observable)

- The deployed target is a Vercel preview; the V1 requirement is a static build on GoDaddy. SPA rewrite behaviour on the real host is **untested**. [CONFIRMED requirement / [VERIFY] current state]
- Client-side rendering means the fetched document contains only meta tags and a mount point. For a local business whose discovery is largely search-driven, there is no static content for crawlers and no per-route metadata beyond the shell. [INFERRED]
- `theme-color` is `#0F1713`, which matches nothing in the observed light theme. Either the token set has drifted or a previous direction was left in place. [INFERRED]
- No evidence of route-level code splitting, and the SIP route will pull Recharts. [INFERRED — repository not available]

---

## 3. Previous Earneazi Analysis

### 3.1 What the old site is doing

It is a single-page, conversion-first local business site. Everything on it exists to produce a phone call or a WhatsApp message. The structure is: sticky utility bar (email, two phone numbers, AMFI badge) → nav with a products mega-menu → hero with credential line, dual CTA, four stats, and a simulated "live portfolio" card → trust badge strip → keyword marquee → services (3 cards) → founders (2 detailed profiles) → recommended funds table → testimonials → insurance grid (8 items) → loans grid (8 items) + bank logo row → SIP calculator with a facts panel → 4-step process → testimonials → FAQ → CTA band → contact block with form → 4-column footer with a full legal disclaimer. [INFERRED]

### 3.2 Why parts of it work

- **Contactability is everywhere.** Two tap-to-call numbers, email, a WhatsApp deep link with pre-filled text (`wa.me/918792151022?text=Hi Earn Eazi! I need financial guidance.`), a persistent WhatsApp FAB, office address, and working hours. This is the correct instinct for a Belagavi advisory firm and the current build has none of it. [INFERRED]
- **Density is a feature, not a bug, for the product sections.** Eight insurance types and eight loan types with one-line definitions tell a visitor "we actually do all of this." The current build compresses this to three accordion rows, which reads cleaner but under-sells the operational breadth. [INFERRED]
- **Founders are treated as the product.** Named people, roles, tenure, specialism tags, and a paragraph each. For advisory services the person *is* the offer. [INFERRED]
- **The FAQ answers commercial objections**, not feature questions: how do I start, what does it cost, do I have to come to your office. [INFERRED]
- **The footer carries the legal weight properly**: market-risk disclaimer, solicitation notice, distributor status, lender-discretion note. [INFERRED]

### 3.3 Why it feels weak

- Emoji used as the entire icon system (📈 🛡️ 🏦 🏥 🚗 ✈️ 🏭). Renders differently per OS, carries no brand, and reads as unserious on a financial site. [INFERRED]
- Gradient blue on gradient blue, glow shadows, and a blue-tinted everything. Visual hierarchy comes from colour saturation rather than structure. [INFERRED]
- Display type is set in a heavy geometric face with a mid-headline colour switch ("4 Steps to Get **Started**", "One Firm. Every **Financial Need.**"), applied to nearly every heading. [INFERRED]
- Stat blocks repeat three times on one page with the same four numbers. [INFERRED]
- The "Live Portfolio" card showing `₹18,42,500` and `+21.3% this year` is a fabricated data display presented as real. [INFERRED]

### 3.4 Claims register — what must not be carried over without verification

The old site's content is the single largest compliance risk in this project. Every item below is currently **unverified** and must not appear in V1 until the client supplies documentary proof.

| Claim on old site | Status | Note |
|---|---|---|
| 500+ Happy Clients | [VERIFY] | Requires client attestation |
| ₹50Cr+ AUM Managed | [VERIFY] | Requires client attestation |
| 20+ Bank Partners | [VERIFY] | Requires list of active DSA tie-ups |
| 16 Yrs Combined Experience / 10 yrs / 6 yrs | [VERIFY] | Requires client confirmation |
| 12%+ Avg Returns | **Do not reuse** | A return claim by a distributor. Remove regardless of verification. |
| Live portfolio value `₹18,42,500`, `+21.3%` | **Do not reuse** | Simulated data presented as real |
| Recommended funds table with 3-yr CAGR figures | **Do not reuse** | Stale performance data plus implicit recommendation; a static frontend cannot keep this accurate |
| "SEBI Compliant" badge | **Do not reuse** | Not a meaningful status for a mutual fund distributor; misleading |
| Loan rates ("From 8.5% p.a.", "Up to ₹5 Cr") | [VERIFY] | Bank-set and volatile; a static site will go stale. Recommend removing numbers, keeping loan types |
| "Our Advisory Fee ₹0 — Completely Free" | [VERIFY] | Needs exact, compliant wording about commission-based remuneration |
| "Onboarding Time 1 Working Day" | [VERIFY] | Operational promise |
| Named testimonials with rupee amounts and returns | **Do not reuse** | Requires written consent per person and removal of all return/amount figures |
| Founded 2023 / "since 2023" | [VERIFY] | Low risk, still needs confirmation |
| AMFI Registered Distributor | [VERIFY] | **Ask for the ARN number.** If supplied, display it — an ARN is stronger and safer than any stat on the old site |
| DSA Licensed | [VERIFY] | Confirm and confirm with which institutions |

### 3.5 Verified-looking operational facts to carry forward (still require client confirmation)

Phone `+91 87921 51022`, phone/WhatsApp `+91 91087 26913`, email `earneazi01@gmail.com`, office `Office No. 101, Amrut Empire, Ganeshpur, Belagavi (Belgaum), Karnataka – 591108`, hours `Monday–Saturday, 9 AM – 7 PM`, founders `Abhishek Sharma (Founder & CEO)` and `Anil Souza (Co-Founder & COO)`. All [VERIFY] — these are business facts, and only the client can confirm which are current. The WhatsApp number in particular must be confirmed as the one that is actively monitored. [CONFIRMED requirement: "Use only a verified client number."]

---

## 4. Reputes Motion / Interaction Analysis

### 4.1 What Reputes is actually doing

Six structural devices carry the entire site. [INFERRED]

1. **Full-bleed band inversion.** Sections alternate between near-black and near-white at full viewport width. The transition between sections *is* the colour change; there is no decorative divider. This is why the page feels sectioned and deliberate despite fairly ordinary internals.
2. **Pinned editorial column with a scrolling counterpart.** In the services section, the left title block ("OUR SERVICES / D2C, Amazon, Offline. / We Grow It All!!") holds position while numbered cards (01–05) travel past it on the right, alternating white and orange fills.
3. **Stat rows as wiping bands.** The stats are not a card grid. They are full-width rows (`14x — Average ROAS`, `350+ — Websites Delivered`) with alternating fills that sweep in as a stack. The number sits hard-left, the label hard-right, at the same size. It reads like a ledger.
4. **Oversized centred type reveals.** Section transitions are marked by very large centred headlines appearing alone on a dark field before the content below scrolls up into place.
5. **Horizontal marquee and a horizontal-scroll panel.** A continuous keyword ribbon, and an image sequence that moves laterally as the page scrolls vertically.
6. **Rounded slab overlap at the footer.** The footer panel has a large top radius and rides over the preceding section, which makes the page end feel like a layer rather than a stop.

Plus a persistent bottom-right contact FAB, which is the same conversion instinct as the old Earneazi WhatsApp button.

### 4.2 Why it works

- The motion is **structural, not decorative**. Almost none of it is a card fading up. It is either a colour state change, a pinning relationship, or a directional wipe, and each communicates "this is a new chapter."
- **One device per section.** Reputes does not stack effects. A section either pins, or inverts, or wipes.
- **Scale contrast does the work.** Numbers and headlines are set enormous against small supporting text, so the reveal has something worth revealing.

### 4.3 What is weak and must not be reused

- **Content is gated behind animation.** In the sampled recording, the "Milestones That Define Us" section renders as a blank black screen during scroll, with only the heading visible. If the reveal fails, does not trigger, or the user has reduced motion enabled, the content simply does not exist. This is the single most important anti-pattern in this reference. [INFERRED]
- **Production placeholder copy is live** ("This is the space to introduce visitors to the business or brand…", "Two-factor / Data encryption / Text alerts"). Motion polish masking unfinished content.
- **`∞ Customer Satisfaction`** as a statistic. Earneazi must never present an unmeasurable value as a metric.
- **Wix-generated performance profile**, heavy hero imagery, and effect-driven scripting. The confirmed Earneazi stack must achieve the same language at a fraction of the cost.
- **All-caps headings and mid-headline colour switching** throughout; typographic hierarchy comes from shouting.
- Orange-on-black brand identity. Irrelevant to Earneazi and explicitly excluded by the brief.

### 4.4 What transfers to Earneazi

| Reputes device | Transfers as | Why it suits a financial advisor |
|---|---|---|
| Band inversion | Paper ↔ Ink section bands | Creates chapters without decoration; supports the dark theme work already required |
| Pinned column + travelling content | Services and Financial Goals sections | The section already has a fixed premise and variable detail — pinning encodes that relationship |
| Stat rows as ledger bands | The verified-credential band | A ledger reads as accounting, not advertising |
| Scroll-linked horizontal motion | The hero trajectory and SIP chart drawing along scroll | Motion that traces a value over time is literally the subject matter |
| Rounded slab overlap | Footer entrance | Makes the footer a destination, which the brief requires |
| Persistent contact FAB | WhatsApp FAB | Restores the old site's strongest conversion path |

**Not transferring:** all-caps display, colour-switched headlines, orange/black, marquee of keywords (the old Earneazi already did this and it read as filler), oversized centred type reveals as a section device (too agency, wrong register for advisory), video testimonial rows.

---

## 5. Three-Reference Synthesis

The three references fail and succeed on different axes. Mapping them makes the target obvious.

| Axis | Previous Earneazi | Current Earneazi | Reputes | Earneazi V1 target |
|---|---|---|---|---|
| Identity strength | Strong, recognisable | Absent / replaced | Strong, irrelevant | Restore old identity, execute at current build's level of craft |
| Information architecture | Product-led, flat, repetitive | Goal-led, clear, correct | Service-led, agency-standard | Keep current build's goal-led IA |
| Content substance | High, largely unverifiable | Low, safe | Medium, partly placeholder | High **and** verified |
| Trust presentation | Loud, non-compliant | Silent | Loud, unmeasurable | Quiet, specific, evidenced |
| Typography | Loud geometric, colour-switched | Elegant but off-brand and templated | All-caps, shouty | On-brand sans with a genuinely considered display voice |
| Colour | Blue system, oversaturated | Cream/serif/tan — generic AI palette | Orange/black | Earneazi blue + ink, disciplined roles |
| Motion | Minimal, generic | Minimal, unaudited | Advanced, structural, fragile | Structural motion, engineered, never load-bearing |
| Conversion paths | Excellent | Poor | Good | Excellent, redesigned |
| Compliance | Poor | Good by omission | N/A | Good by construction |
| Performance discipline | Poor | Unknown | Poor | Budgeted and enforced |

**The synthesis rule for Phases 1–7:** structure and voice come from the current build; identity, contactability and substance come from the old build; motion grammar comes from Reputes; nothing visual comes from Reputes.

---

## 6. Brand Direction

### 6.1 Positioning the design must express

"One advisor who coordinates mutual funds, insurance and loans around the goals you're actually working toward, in Belagavi, with two named people accountable for it." The current build's copy already says this. The visual system needs to catch up. [INFERRED from current build copy]

### 6.2 Brand attributes, ranked

1. **Accountable** — named people, a real address, a real number, stated credentials.
2. **Coordinated** — the differentiator is that three product lines are planned together.
3. **Plain-spoken** — no jargon, no product-of-the-month.
4. **Local and reachable** — Belagavi, WhatsApp, Monday to Saturday.
5. **Precise** — a firm that handles money should look like it can do arithmetic.

"Premium" in this brief should be read as *precision and restraint*, not luxury. A wealth-management look (gold, serif, marble) is the wrong register for a firm whose entry point is a ₹500 SIP and a personal loan. [PROPOSED]

### 6.3 What "still feels like Earneazi" means concretely

- The wordmark and its blue are the constants. [CONFIRMED]
- Blue is the brand; navy/ink is the depth; everything else is neutral. [PROPOSED]
- The trailing dot in the current wordmark lockup is a genuine asset and should be retained and made functional (see §7). [PROPOSED]
- No gold. No cream. No marble, no glass, no gradient blobs. [PROPOSED]

---

## 7. Logo Treatment Direction

**Current state:** the wordmark is set in the page's serif display face with a coloured trailing dot — meaning the logo is currently a *font rendering*, not a logo. Old site used a bold geometric blue wordmark. [INFERRED]

**Direction:**

- **[VERIFY]** Obtain the approved Earneazi logo as vector (SVG/AI), plus any brand sheet. Everything in this section is contingent on that file. If no vector exists, a wordmark lockup must be drawn and signed off in Phase 1, not improvised per-component.
- **[PROPOSED]** Ship the logo as an inline SVG React component with `currentColor` for the wordmark and a separate token for the dot, so both themes are served by one asset with no second file and no flash on theme switch.
- **[PROPOSED]** Define exactly three lockups and forbid ad-hoc scaling: `Primary` (wordmark + dot, nav and footer), `Compact` (mark only or shortened lockup, for the mobile nav bar and the FAB if used), `Oversized` (footer band, optically tracked, minimum 96px cap height).
- **[PROPOSED]** Clear space = the cap height of the wordmark on all four sides. Minimum rendered width 112px for the primary lockup.
- **[PROPOSED]** The dot is the interaction handle, not the wordmark. On hover/focus it is the only part that moves (a short scale or colour shift, ≤160ms); the wordmark itself never animates on hover. On theme change the dot cross-fades between its light and dark accents. In the footer band the dot can be the anchor for a single scroll-linked reveal.
- **[PROPOSED]** The nav logo is a link to `/`. On the home route it is `aria-current="page"` and non-navigating but still focusable. `alt`/`aria-label` = "Earneazi — home".
- **[PROPOSED]** Never place the wordmark on a photographic background, never apply the 3D treatment from §9 to the logo at nav size, never outline it, never re-colour the dot to a non-token value.

---

## 8. Typography System Direction

### 8.1 The decision that drives everything

The Earneazi wordmark is a **bold sans**. The current build's display face is a **high-contrast serif**. They cannot both be right. This audit recommends resolving in favour of the wordmark: the display voice becomes a strong, slightly condensed grotesque, and the serif is retired. [PROPOSED — this is the single largest visual change in Phase 1 and needs explicit sign-off]

Reasons: it restores brand coherence with the logotype; it removes the cream+Didone template signature in one move; a grotesque at large sizes holds up far better in dark theme, at mobile widths, and beside numerals; and financial UI lives or dies on numerals, which is where Didone faces are weakest.

### 8.2 Selection criteria (non-negotiable regardless of which family wins)

- **[CONFIRMED]** Must include the Indian Rupee sign `₹` (U+20B9) in every weight shipped. This disqualifies several otherwise good display faces and must be checked before licensing.
- **[CONFIRMED]** Body/UI face must provide **tabular lining figures** for all monetary and calculator output.
- **[PROPOSED]** Variable fonts, self-hosted as `woff2`, subset to Latin + `₹` + the punctuation actually used. No Google Fonts CDN — it adds a third-party connection, hurts LCP on Indian mobile networks, and is an unnecessary external dependency for a GoDaddy static build.
- **[PROPOSED]** Maximum two families, maximum four shipped weight/axis instances total.
- **[VERIFY]** Licence must permit self-hosting and commercial use for a financial services business.

### 8.3 Recommended pairing

- **Display:** a confident grotesque with real character at large sizes and tight tracking. Primary recommendation **Archivo** (variable, includes width axis, excellent numerals, open licence, has `₹`). Alternative if a sharper, more distinctive voice is wanted: **Clash Display** (Fontshare). [PROPOSED]
- **Body / UI:** **Switzer** or **Inter Tight**, both variable with tabular figures. [PROPOSED]
- **Retire:** the monospace numeral face. `01/02/03` markers survive only in the genuinely sequential "How it works" section, and there they can be set in the display face. [PROPOSED]

### 8.4 Type scale (locked structure, faces still open)

Fluid scale, `clamp()`-based, ratio ≈1.25 mobile / ≈1.333 desktop.

| Token | Mobile → Desktop | Weight / tracking | Use |
|---|---|---|---|
| `display-xl` | 40 → 76px | 600, −2.5% | Hero only |
| `display-lg` | 32 → 52px | 600, −2% | Section openers |
| `display-md` | 26 → 36px | 600, −1.5% | Sub-sections, accordion titles |
| `title-lg` | 20 → 24px | 550, −1% | Card and panel titles |
| `title-sm` | 17 → 18px | 550, 0 | List item titles, labels |
| `body-lg` | 17 → 19px | 400, 0 | Section intros |
| `body` | 16 → 17px | 400, 0 | Default |
| `body-sm` | 14 → 15px | 400, 0 | Supporting, captions |
| `legal` | 12 → 13px | 400, +1% | Disclaimers — never below 12px |
| `data-lg` | 28 → 44px | 600, tabular | Calculator output |
| `data-md` | 20 → 24px | 550, tabular | Stat values |

Rules: [PROPOSED]
- Line height: 1.05–1.12 for `display-*`, 1.25 for titles, 1.55 for body, 1.5 for legal.
- Body measure capped at 68 characters; section intros at 56.
- Sentence case everywhere. **No all-caps headings, no all-caps eyebrow labels.**
- The terminal full stop on headlines is permitted on the hero and on at most two other headings per page, not on every heading.
- No mid-headline colour or weight switching.
- Never set a number and its unit in different families.

---

## 9. Dimensional / 3D Typography Direction

The brief asks to explore dimensional treatment "where it improves branding" and warns against gimmick. The honest answer for a financial advisory site is: **use it exactly once, and use it on the brand, not on the content.** [PROPOSED]

**Recommended application — one of these, not both:**

- **Option A (recommended): the footer wordmark band.** The oversized Earneazi wordmark at the top of the footer receives a layered extrusion: 3–5 offset copies of the wordmark stepped along a consistent light vector, each tinted one step down the neutral ramp, with the face in full brand colour. Pure CSS/SVG, no WebGL, no font duplication cost. On scroll into view the extrusion depth resolves from 0 to full over ~500ms; with reduced motion it renders at full depth immediately.
- **Option B: the hero headline first line only.** Same technique at lower depth. Higher risk: it competes with the hero chart and puts a decorative treatment on the page's most important legibility surface.

**Constraints, all [PROPOSED]:**
- Never on running text, numbers, legal copy, form labels, or anything a screen reader must read as data.
- The extruded text is a single accessible text node; layers are `aria-hidden` duplicates or an SVG with `<title>`.
- Light theme: extrusion in darker neutrals below the face, shadow vector down-right, no glow.
- Dark theme: extrusion **must not** simply invert. Use a lighter edge on the top-left face and a cool shadow below; on dark grounds a downward dark extrusion disappears. Dark theme gets a thin 1px optical edge-light instead of a deep stack.
- Depth scales with viewport: full stack at ≥1024px, half at 768–1023px, flat at <768px.
- Contrast of the *face* colour against the ground must pass AA independent of the extrusion.
- If the effect cannot be made to look deliberate in both themes within Phase 1, it is cut. A flat, well-tracked oversized wordmark is better than a compromised 3D one.

---

## 10. Color System Direction

### 10.1 Principles

- Colour has **roles**, not moods. One primary, one ink, one neutral ramp, and a small functional set. [PROPOSED]
- The brand blue returns as the primary. [CONFIRMED by brief: preserve recognisable core brand colour language]
- The cream ground and gold accent are retired. [PROPOSED]
- No colour is used decoratively where structure can do the job. [PROPOSED]

### 10.2 Proposed base palette (hex values to be confirmed against the official logo file)

| Token | Value | Role |
|---|---|---|
| `brand/600` | `#1668DC` | Primary brand blue — CTAs, active states, links, primary data series |
| `brand/700` | `#1153B0` | Pressed / hover-dark |
| `brand/500` | `#3D87F0` | Dark-theme primary (lighter, for contrast on ink) |
| `ink/900` | `#0A1B2E` | Deepest ink — dark theme ground, light theme display type |
| `ink/700` | `#16304B` | Dark theme elevated surface |
| `neutral/000` | `#FFFFFF` | Light theme card surface |
| `neutral/050` | `#F6F7F9` | Light theme page ground (cool, not cream) |
| `neutral/200` | `#E3E6EB` | Light borders, hairlines |
| `neutral/500` | `#6B7785` | Secondary text |
| `signal/positive` | `#177245` | Growth series in charts, positive deltas — charts only |
| `signal/caution` | `#9A5B00` | Warnings, validation — never decorative |

[PROPOSED — the exact brand blue must be sampled from the approved logo file, §7, before any of these are locked.]

### 10.3 Rules

- Maximum three colours visible in any single viewport, excluding the neutral ramp. [PROPOSED]
- `signal/*` colours never appear outside data visualisation and form validation. [PROPOSED]
- Chart series must be distinguishable without colour (pattern, label, or direct annotation), because colour alone fails AA and fails colour-blind users. [CONFIRMED accessibility requirement]
- Every foreground/background pair used in the system must be recorded with its measured contrast ratio in the Phase 1 token file. Pairs that fail are not shipped with a note; they are changed. [PROPOSED]
- No gradient may be used as a surface fill. A single gradient is permitted in the hero chart's area fill, because it encodes magnitude. [PROPOSED]

---

## 11. Light Theme Direction

Light theme is the default and should feel like clean paper stock, not warm parchment. [PROPOSED]

- **Ground:** `neutral/050`. **Cards/panels:** `neutral/000`. Elevation is expressed by the surface being *lighter* than the ground, plus a hairline, plus a very soft shadow. [PROPOSED]
- **Shadows:** three tokens only — `sm` (0 1px 2px rgba(10,27,46,.06)), `md` (0 4px 12px rgba(10,27,46,.08)), `lg` (0 16px 40px rgba(10,27,46,.10)). `lg` is reserved for overlays and the mobile nav sheet. [PROPOSED]
- **Borders:** 1px `neutral/200` default; `brand/600` at 1.5px for selected states. Never rely on border colour alone to indicate selection — pair it with surface change or a marker. [PROPOSED]
- **Type:** display and headings in `ink/900`; body in `ink/900` at 90% opacity or a dedicated `ink/800`; secondary in `neutral/500` (verify ≥4.5:1 on `neutral/050`). [PROPOSED]
- **Inverted bands:** designated sections render on `ink/900` with light type, used as chapter markers (§19). The hero is a candidate; the footer is confirmed. [PROPOSED]

---

## 12. Dark Theme Direction

Dark theme is a first-class design, not an inversion. [CONFIRMED]

- **Ground:** `ink/900`. **Elevated surface:** `ink/700`. Elevation rises *toward light*, and a second elevation step exists (`ink/700` + 1px `rgba(255,255,255,.08)` top edge) for overlays. [PROPOSED]
- **Shadows barely function on dark grounds.** Replace shadow elevation with: surface lightening + a 1px light top border + increased spacing. Retain only a large ambient shadow for overlays. [PROPOSED]
- **Primary colour shifts:** `brand/500` replaces `brand/600` for text and icons on dark; `brand/600` remains as the fill for solid buttons with white text (verify contrast). Never reuse the light-theme link colour on ink. [PROPOSED]
- **Type:** body text on dark must not be pure white. Use `#E8ECF2` for body, `#FFFFFF` reserved for display only, `#9AA6B5` for secondary. Reduce display weight by ~50 units on dark to compensate for optical bolding. [PROPOSED]
- **Charts:** grid lines drop to `rgba(255,255,255,.08)`; the area fill opacity increases; the positive signal colour must be lightened (`#3FBF7F`-class) to stay legible on ink. [PROPOSED]
- **The 3D wordmark treatment uses a different construction on dark** (§9). [PROPOSED]
- **Switching behaviour:** [PROPOSED]
  - Default follows `prefers-color-scheme`.
  - User choice persists in `localStorage` and wins over system.
  - A no-flash inline script sets the class on `<html>` before paint.
  - Transition: colour/background transitions of 180ms on surfaces only; **never** transition transforms or the whole document. Disable transitions entirely for one frame during switch to avoid a rainbow sweep across the page.
  - The toggle is a real `<button>` with `aria-pressed` or a three-state control (System / Light / Dark). Recommend three-state in the mobile sheet and footer, two-state icon in the nav. Announce state change via the accessible name, not a live region.
  - Update `<meta name="theme-color">` per theme. The current `#0F1713` value must be corrected.

---

## 13. Spacing & Alignment System

**Base unit 4px. All spacing tokens are multiples.** [PROPOSED]

`space-1:4, space-2:8, space-3:12, space-4:16, space-5:20, space-6:24, space-8:32, space-10:40, space-12:48, space-16:64, space-20:80, space-24:96, space-32:128, space-40:160`

**Section rhythm** (padding-block): [PROPOSED]

| Breakpoint | Standard section | Chapter section (inverted band) |
|---|---|---|
| <768px | 64 / 72 | 80 |
| 768–1023 | 88 | 104 |
| ≥1024 | 120 | 160 |

**Alignment rules that fix the observed defects:** [PROPOSED]
1. Every section declares a column span for each of its blocks. No block may occupy less than half the container without a deliberately anchored counterpart in the remaining columns.
2. A section header and the grid beneath it must share the same starting column and the same ending column. The "What working with us actually looks like" pattern (header at 48%, grid at 100%) is disallowed.
3. Connector rules, dividers and underlines terminate at content, never at the container edge.
4. Optical alignment overrides mathematical alignment for the display face: large type gets a negative left inset equal to its side bearing so it aligns with body text above/below it.
5. Vertical alignment of a floated secondary link (e.g. "About Earneazi") is to the **first baseline** of its paired heading, not to the block's centre.
6. Icon tiles use a fixed 44×44 (mobile) / 48×48 (desktop) box with the glyph optically centred; no per-icon nudging.

---

## 14. Grid & Container System

- **Containers:** `container-shell` max 1440px (nav, footer band, inverted bands); `container-content` max 1200px; `container-prose` max 720px (legal, FAQ answers, long-form). Current build's ~1560px is too wide for a 68-character measure and is part of why sections feel unbalanced. [PROPOSED]
- **Gutters:** 20px <480; 24px 480–767; 32px 768–1023; 48px ≥1024. [PROPOSED]
- **Columns:** 4 (<768) / 8 (768–1023) / 12 (≥1024), gap 24px. [PROPOSED]
- **Canonical section layouts** — every section must use one of these four, and the choice is recorded in the Phase 1 spec: [PROPOSED]
  - `L1 Editorial` — header cols 1–6, body cols 1–8, optional aside 9–12.
  - `L2 Split` — narrative cols 1–5, interactive/visual cols 7–12 (hero, goals, SIP).
  - `L3 Ledger` — full 12-col rows with strong left/right polarity (credentials band, stats).
  - `L4 Stack` — full-width list of disclosure rows (services, FAQ).
- **Bleed:** only inverted bands and the footer may bleed full-width; content inside still respects `container-shell`. [PROPOSED]
- **Mobile:** all four layouts collapse to a single column in a defined order documented per section; nothing horizontally scrolls except explicitly designed scrollers (goal chips, credential ledger). [PROPOSED]

---

## 15. Navbar / Navigation System

The navbar's job on this site is to keep two things one tap away at all times: **who to talk to**, and **where the goals are**. [PROPOSED]

**Structure (≥1024px):** three-zone grid aligned to `container-shell` — logo (left, same left edge as page content), primary nav (centre), actions (right: theme toggle + primary CTA). Height 76px at rest, 60px engaged. [PROPOSED]

**Navigation items:** Services, Financial Goals, SIP Calculator, About, FAQ, Contact. Contact currently exists as a route but not as a nav item; it should be present as a nav item or folded into the CTA cluster. [PROPOSED]

**Scroll states:** [PROPOSED]
- `rest` — over the hero: transparent ground, no border, logo and links in the hero's foreground colour.
- `engaged` — after 24px of scroll: solid theme surface, 1px bottom hairline, `shadow-sm`, reduced height. Transition 200ms on background/height only.
- **No hide-on-scroll-down.** On a conversion-led site the CTA must never be more than zero taps away. If vertical space becomes a problem on small screens, reduce height instead of hiding.
- The current build's navbar uses a soft gradient fade into the hero, which produces a smeared edge over the dark hero band. Replace with a discrete state change. [INFERRED defect → PROPOSED fix]

**Active route indicator:** a 2px underline sitting on the nav item, animated between items with a shared layout transition (Framer Motion `layoutId`). With reduced motion it jumps instantly. Route state is `aria-current="page"`. Section-scroll pages (home anchors) use scroll-spy with a 40% viewport threshold, debounced, and the indicator never contradicts the URL hash. [PROPOSED]

**CTA:** one primary action in the nav ("Book a consultation"). It must not be the only contact route — a secondary icon-only WhatsApp affordance sits beside it at ≥1280px. [PROPOSED]

**Keyboard and a11y:** [CONFIRMED requirements]
- `<header>` + `<nav aria-label="Primary">`; a "Skip to content" link as the first focusable element, visible on focus.
- Full tab order: logo → nav items → theme toggle → WhatsApp → CTA.
- Visible focus ring on every item (2px `brand`, 2px offset, never `outline:none`).
- The sticky header must not obscure anchor targets: every section gets `scroll-margin-top` equal to the engaged header height.
- Touch targets ≥44×44 including the theme toggle.

**Touch:** no hover-only affordances anywhere in the nav; the products dropdown pattern from the old site is **not** carried over (a hover mega-menu is hostile on touch). If sub-navigation is needed, it opens on click/tap with `aria-expanded`. [PROPOSED]

---

## 16. Mobile Navigation System

[PROPOSED unless noted]

- **Trigger:** a labelled icon button (`aria-label="Open menu"`, `aria-expanded`, `aria-controls`), 48×48, right side. Hamburger→close morphs via two-line transform, 200ms.
- **Surface:** full-screen sheet rather than a side drawer, entering with a vertical translate + clip reveal (not a plain opacity fade), 280ms, `ease-out`. Sheet uses the elevated surface token, respects `env(safe-area-inset-*)`, and the document is scroll-locked while open (with scroll position restored on close).
- **Content order:** primary destinations (large, 56px rows, display face) → SIP Calculator as a distinct highlighted row → contact block (Call, WhatsApp, Email — real links, not routes) → theme control (three-state) → address and hours in small type.
- **Motion:** items stagger in at 30ms intervals, max 8 items, translate ≤12px. Under reduced motion the sheet appears with no stagger and ≤120ms opacity only.
- **Keyboard / AT:** focus moves to the sheet on open, is trapped while open, returns to the trigger on close; `Esc` closes; the rest of the document is `inert` or `aria-hidden`.
- **Gestures:** swipe-down-to-close is optional and must never be the only close method. No edge-swipe navigation (conflicts with iOS back gesture).
- **Bottom-of-viewport safety:** the sheet's contact block sits above the safe-area inset and above where the WhatsApp FAB would be, and the FAB is hidden while the sheet is open.

---

## 17. Component System

Components are defined by their **states**, not their looks. Every component below must ship with: default, hover, focus-visible, active/pressed, selected, disabled, loading (where relevant), error (where relevant), and both themes. A component is not done until all of these exist. [CONFIRMED by brief: "consistent component states"]

**Primitives** [PROPOSED]
- `Button` — variants: `primary` (solid brand), `secondary` (outline, ink), `ghost` (text + underline on hover), `icon`. Sizes: `sm 36`, `md 44`, `lg 52`. Radius: single token `radius-action: 8px`. **Remove the arrow glyph from default button labels** — it is a template tell; if directional affordance is wanted, it appears on hover as a translating icon, not baked into the label of every button.
- `Link` — inline links are underlined with a 1px offset underline that thickens on hover; standalone links get an icon that translates 2px.
- `IconTile` — 44/48 box, `radius-surface: 10px`, three fills (neutral, brand-tinted, solid-brand for selected). Icons from one set only, 1.5px stroke, 24px grid. **No emoji anywhere.** (Old site anti-pattern.)
- `Field` — label above, input 48px min height, 16px minimum font size (prevents iOS zoom), helper text, error text with `aria-describedby` + `aria-invalid`, `inputmode` set correctly for numeric fields.
- `Slider` — native `input[type=range]` styled, paired with a numeric field, `aria-valuetext` reporting the formatted rupee value, 44px thumb hit area.
- `Chip` — used only for factual tags ("Mutual funds"), never for marketing claims.
- `Disclaimer` — a defined component with a `scope` prop (`calculator`, `insurance`, `loan`, `global`) so legal text is never hand-typed into a section.

**Composites** [PROPOSED]
- `SectionHeader` — heading + optional intro + optional aside link. The hairline "eyebrow" rule above headings is **removed** as a global device; an index number appears only in genuinely sequential sections.
- `DisclosureRow` (services, FAQ) — button row with `aria-expanded`/`aria-controls`, height animation on the panel, content always in the DOM.
- `GoalSelector` — ARIA tabs on desktop, horizontal scroll chips on mobile (§22).
- `CredentialLedger` — full-width rows for verified credentials only (§24).
- `FounderCard` — photo or distinct monogram, name, role, tenure, specialisms, short bio. **Monogram derivation must produce unique initials** (the current build renders "AS" for both founders).
- `StatBand` — reserved, ships only if verified numbers are supplied.
- `ChartFrame` — shared shell for all charts: title, accessible description, the chart, a disclaimer slot, and a visually-hidden data table.
- `FloatingContact` — the WhatsApp FAB (§25).
- `FooterBand`, `FooterColumn`, `LegalBlock` (§27).

**Radius scale** (three values, not one): `radius-action 8`, `radius-surface 12`, `radius-band 24` (inverted band / footer slab corners only). Using one radius on everything is part of the templated look. [PROPOSED]

---

## 18. Motion System

### 18.1 Tokens [PROPOSED]

| Token | Value | Use |
|---|---|---|
| `dur-instant` | 120ms | State feedback (hover, focus) |
| `dur-fast` | 180ms | Small transitions, theme surfaces |
| `dur-base` | 240ms | Panels, accordions, tabs |
| `dur-slow` | 400ms | Sheets, section elements |
| `dur-story` | 700ms | The one signature moment per section |
| `ease-out` | `cubic-bezier(.22,1,.36,1)` | Entrances |
| `ease-in` | `cubic-bezier(.4,0,1,1)` | Exits |
| `ease-move` | `cubic-bezier(.65,0,.35,1)` | Position changes between two known states |
| `spring-ui` | stiffness 260, damping 30 | Layout/shared-element transitions |

Travel distances: ≤12px for UI feedback, ≤24px for content entrances, ≤40px for a section-level device. Nothing on this site should travel further than 40px. [PROPOSED]

### 18.2 Rules [CONFIRMED by brief, expanded]

1. **No universal fade-up.** A generic `opacity + translateY` entrance may be used on at most one section of the page, and never as the default for all content.
2. **One signature moment per section, maximum.** If a section pins, it does not also wipe.
3. **Motion must encode something**: hierarchy (what to read first), state (what changed), navigation (where you went), progression (how far through), or quantity (how a number grew).
4. **Content is never animation-dependent.** Base CSS renders the final visible state. Animation is applied by JS from the visible state or via an `IntersectionObserver` that has already-visible fallback. If scripts fail, everything is readable. This is a direct correction of the Reputes defect.
5. **Touch parity.** Every hover-revealed affordance has a non-hover equivalent. Scroll-linked effects are throttled to `requestAnimationFrame` and tested on a mid-tier Android.
6. **Only `transform` and `opacity`** are animated on scroll. No animated `height`/`top`/`box-shadow` in scroll-linked contexts (accordion height animation is permitted because it is discrete and user-triggered).
7. **`prefers-reduced-motion: reduce`** — all scroll-linked transforms, parallax, marquees, stagger, and the number tween are disabled; the final state renders immediately; discrete transitions are capped at 120ms opacity. This is implemented as a global hook plus a CSS media query, and is part of QA sign-off, not an afterthought.
8. **Framer Motion is loaded as `LazyMotion` with the `domAnimation` feature set** to keep the bundle down (§30).

### 18.3 Motion vocabulary, assigned [PROPOSED]

| Device | Where it is allowed | Where it is banned |
|---|---|---|
| Band inversion on scroll | Section boundaries (§19) | Inside a section |
| Pin + travel | Services, Financial Goals | Hero, footer |
| Line-clip text reveal | Hero headline only | Any other heading |
| Path draw (scroll-linked) | Hero chart, SIP chart | Decorative shapes |
| Number tween | SIP output, verified stats | Any unverified figure |
| Shared-element move | Nav active indicator, goal panel | Cards |
| Stagger | Mobile menu items, credential ledger rows | Every grid |
| Hover lift | Nothing. Lift is replaced by border/surface state change | Everywhere |

---

## 19. Scroll & Section Transition System

Three transition devices, used in rotation so no two adjacent sections transition the same way. [PROPOSED]

1. **Chapter inversion.** The page alternates between paper and ink bands at defined boundaries. Proposed assignment: Hero (ink) → Services (paper) → Financial Goals (paper, tinted) → Credentials ledger (ink) → Process (paper) → Founders (paper) → SIP (ink) → FAQ (paper) → Footer (ink, slab). The inverted band's top corners carry `radius-band` and overlap the preceding section by 24–32px, so the page reads as stacked layers.
2. **Pinned premise.** In Services and Financial Goals, the left editorial column pins (`position: sticky`, not JS scroll-jacking) while the right column's content advances. Pinning is disabled below 1024px and under reduced motion.
3. **Scroll-linked data.** The hero trajectory and the SIP chart draw in proportion to scroll progress across a bounded range, then lock. Never re-animates on scroll-up past the section (animate once, then hold).

**Hard constraints:** [CONFIRMED]
- No scroll-jacking, no scroll hijacking libraries, no custom smooth-scroll that overrides native momentum. iOS Safari punishes all three.
- No full-page horizontal scroll sections. (Reputes uses one; it is a liability on touch.)
- `scroll-behavior: smooth` for in-page anchors only, disabled under reduced motion.
- Section reveal thresholds at 20% visibility so content on short viewports is not stuck waiting.

---

## 20. Hero Interaction Direction

**Keep the idea, fix the execution.** The goal-milestone trajectory is the most original element in the current build and should become the site's signature. [PROPOSED]

**Composition:** `L2 Split` — headline, sub-headline and dual CTA on cols 1–5; the trajectory on cols 7–12. On ink ground (chapter inversion), which also restores the old site's navy hero character. [PROPOSED]

**The trajectory, corrected:** [PROPOSED]
- It is **illustrative**, and must be labelled as such in visible text, not only in the footer. It is not a return projection. Axis labels stay qualitative ("Today" → "Later") with no rupee values and no percentages on the axis.
- Milestone markers (Buy a home, Fund education, Plan retirement) become **interactive**: hover/focus/tap raises the marker, shows a one-line description, and activating it scrolls to Financial Goals with that goal pre-selected. This makes the hero the entry point to the site's core IA rather than decoration.
- Markers are real focusable buttons in the tab order with accessible names; the chart container has `role="img"` plus a text alternative summarising the idea.
- **Fix the label collisions** observed in the current build: labels are placed with a fixed offset above-left of the marker with a 1px leader line, and the curve's plotted area reserves label space. No label may overlap the path.
- Render as bespoke inline SVG rather than Recharts, so the hero's LCP does not depend on a charting library (§30).

**Motion:** [PROPOSED]
- On load: headline reveals by line via clip-mask (three lines, 60ms stagger, `dur-slow`), CTA and sub-headline follow at 120ms, path draws over `dur-story` with markers popping in at their positions.
- On scroll: the path's gradient area fill deepens slightly and the whole chart translates ≤24px at 0.15 rate. That is the entire parallax budget for the page.
- Reduced motion: everything renders final on first paint; no draw, no stagger.

**Mobile hero:** designed independently, not squeezed. Headline → sub-headline → primary CTA → WhatsApp secondary → a compact version of the trajectory (reduced to a simplified path with milestone chips below it, horizontally scrollable). The chart must never force the CTA below the fold on a 667px-tall viewport. [PROPOSED]

**Copy:** current hero copy is good and should be retained pending client approval. [INFERRED]

---

## 21. Services Interaction Direction

**Keep the accordion.** It is the right pattern for three services with unequal depth. [PROPOSED]

- Layout `L4 Stack` with a pinned premise column on ≥1024px (§19.2).
- **Single-open** behaviour with the first row open at ≥1024px and all rows closed below it. Each row syncs to a URL hash (`#mutual-funds`, `#insurance`, `#loans`) so a row can be linked to directly, including from the footer and the goal panels.
- The ± affordance stays, animating between states in `dur-fast`; the entire row is the click target; `aria-expanded` on the row button, panel `aria-labelledby` the row.
- Panel content is in the DOM at all times (`hidden` attribute toggling, not conditional render), so search engines and screen readers get everything.
- **Reintroduce density from the old site inside the panel**: the eight insurance types and eight loan types become a labelled sub-list within their panels rather than a separate section. This recovers the old site's "we really do all of this" signal without a wall of cards. All product names are factual and safe to list. Rates, limits and bank names are **not** included ([VERIFY] and volatile).
- Motion: panel height animates with `ease-move`; inner content does **not** stagger (stagger inside an accordion delays reading). The icon tile shifts fill on open. No hover lift.
- Touch: rows are ≥64px tall; the ± is decorative and not a separate tap target.

---

## 22. Financial Goals Interaction Direction

This is the site's differentiating section and deserves the most interaction care. [PROPOSED]

- **Desktop:** ARIA `tablist` (vertical) on cols 1–4, panel on cols 6–12. Roving tabindex, Up/Down/Home/End keys, `aria-selected`, panel `role="tabpanel"` with `aria-labelledby`.
- **Mobile:** the vertical list becomes a horizontally scrollable chip row with scroll-snap and a visible edge fade, panel beneath. Not a stacked list of six full-width rows (that buries the panel below the fold). Selected chip scrolls itself into view.
- **Panel transition:** the outgoing panel's content cross-fades over `dur-base` while the panel's height animates to the incoming content's height. The selected indicator moves between items as a shared element (`layoutId`). No slide-in from the side — direction has no meaning here.
- **URL sync:** `/financial-goals?goal=grow-wealth` or hash equivalent, so the hero's milestone markers, the footer, and WhatsApp messages can deep-link to a specific goal. This also gives each goal a shareable address without a backend.
- **Panel content model** (per goal): title, one-sentence framing, "What we'd work through" (3–4 questions), "Usually involves" (product chips linking into Services), one CTA that opens WhatsApp with a goal-specific pre-filled message. No numbers, no timelines, no expected outcomes.
- **Cross-link:** "Not sure which of these fits?" retained, pointing to a goals overview route.
- Reduced motion: instant panel swap, indicator jumps.

---

## 23. SIP Interaction Direction

The calculator is the highest-integrity component on the site. Its correctness matters more than its appearance. [CONFIRMED]

### 23.1 Calculation architecture [CONFIRMED / PROPOSED]

- **Deterministic, pure, and isolated.** A single pure function module with no React, no dates, no randomness, no network, and no AI. Unit tested. [CONFIRMED]
- **Convention must be locked.** The old Earneazi calculator produced ₹11,61,695 for ₹5,000/month at 12% p.a. over 10 years, which corresponds to an **annuity-due** (start-of-period) SIP formula: `FV = P × [((1+i)^n − 1) / i] × (1+i)` with `i = annualRate/12/100` and `n = months`. The ordinary-annuity variant yields ₹11,50,193. Recommend retaining annuity-due for continuity with the old site and with most Indian AMC calculators. [INFERRED from old site output → [PROPOSED] to lock]
- **Rounding:** compute in full precision, round only at display, to the nearest whole rupee. Invested = `P × n` exactly. Gains = `FV − invested`, derived, never independently computed. [PROPOSED]
- **Formatting:** `Intl.NumberFormat('en-IN')` for lakh/crore grouping, `₹` prefix, tabular figures. A compact secondary reading ("≈ ₹11.6 L") may accompany the exact value but never replace it. [PROPOSED]
- **No AI, no live rates, no fund data, no "expected return" presets that imply a recommendation.** The rate input is labelled "Assumed annual return" and is user-set. Its default value is itself a claim — recommend a neutral default of 12% **only if the client confirms**, otherwise start at a clearly illustrative round number with the assumption stated inline. [CONFIRMED + [VERIFY]]

### 23.2 Validation [PROPOSED]

Zod schema shared by the slider and the numeric field, with these bounds to be locked: monthly amount ₹500–₹10,00,000 (step ₹500); assumed return 1–30% (step 0.5); tenure 1–40 years (step 1). Invalid input never produces a result — it produces an inline message. Empty is a distinct state from zero. Clamping happens on blur, not on keystroke (clamping mid-typing is hostile).

### 23.3 UX [PROPOSED]

- Three paired controls (slider + numeric field), stacked on mobile, two-column on desktop with the output panel adjacent at ≥1024px and directly beneath on mobile.
- The output panel is **sticky within the section** on desktop so values stay visible while sliders are used.
- Results: maturity value (`data-lg`), invested and estimated gains (`data-md`), plus the assumption line ("Assumes 12% p.a., compounded monthly, invested at the start of each month").
- Recompute is synchronous and instant. No loading state, no debounce beyond a frame.
- A "Talk through this plan" CTA passes the three inputs into the WhatsApp pre-filled message (amount, rate, tenure — no result, no promise).

### 23.4 Visualisation [PROPOSED]

- A stacked area chart over the tenure: invested (neutral) and estimated gains (brand or positive signal), with a year axis and en-IN formatted value axis.
- Replace the current SIP explainer graphic (twelve identical bars plus an unrelated diagonal line) entirely — it currently encodes nothing and is the weakest visual on the page. [INFERRED defect]
- Recharts, lazy-loaded on the SIP route/section only.
- Transitions animate the series shape over `dur-base`; the **numbers tween only their display, never their source**. Under reduced motion, the chart redraws without transition.
- Accessibility: `ChartFrame` provides a text summary and a visually-hidden data table of year/invested/value. Series are distinguishable without colour.

### 23.5 Disclaimer placement [CONFIRMED]

The disclaimer sits **immediately below the result panel**, not only in the footer: estimates only, not a guarantee or projection; does not account for expense ratio, exit load, taxes or inflation; mutual fund investments are subject to market risks; read all scheme-related documents carefully. Legal type minimum 12px and it must pass AA contrast — small grey legal text is the most commonly failed contrast pair on financial sites.

---

## 24. Founder / Trust Experience

**The founders are the product.** The current build reduces them to two name cards with a duplicated monogram; the old build over-claimed around them. The correct version is specific and evidenced. [PROPOSED]

- **Fix the monogram bug** (both currently "AS"). Prefer real photographs; if unavailable, derive monograms that are unique per person and design them as an intentional treatment, not an avatar fallback. [INFERRED defect → fix]
- **Content per founder** (all [VERIFY]): name, role, tenure/experience, area of responsibility, 2–3 sentence bio in the site's plain-spoken voice, and any registration identifier the client can evidence.
- **Credential ledger** replaces the old site's badge strip: full-width rows in the `L3 Ledger` layout on an ink band, each row a single verified fact with its identifier — e.g. AMFI-registered mutual fund distributor with ARN, DSA arrangements, place of business, years in operation. Each row is either verified and shown, or absent. There is no "coming soon" state for a credential. [PROPOSED + [VERIFY]]
- **Forbidden on this section:** client counts, AUM, average returns, "SEBI Compliant", satisfaction figures, and any testimonial without written consent and without return/amount figures stripped. [CONFIRMED by brief]
- **Motion:** the ledger rows wipe in with a 40ms stagger as a single orchestrated moment (the Reputes stat-band device, restyled). Founder cards do not animate on hover; they get a border/surface state on focus-within.
- **If the client can supply consented testimonials**, they belong in a separate, later section with names, city, and no figures, and are out of scope until supplied. [VERIFY]

---

## 25. Contact / WhatsApp Experience

The old site's WhatsApp behaviour is its single best-performing idea and the current build has dropped it entirely. Restore the function, redesign the surface. [CONFIRMED by brief]

**WhatsApp mechanics:** [PROPOSED]
- `https://wa.me/<verified-number>?text=<contextual message>`, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label` describing the destination ("Message Earneazi on WhatsApp — opens WhatsApp").
- **Contextual pre-fill per entry point**: from the Insurance panel, from a specific goal, from the SIP calculator (with the three inputs), from the footer. One helper builds every message so wording stays consistent, and every message is plain and self-identifying.
- **[VERIFY] the number.** The old site uses `+91 87921 51022` for the FAB and lists `+91 91087 26913` as "Phone / WhatsApp". Exactly one number must be designated as the monitored WhatsApp line before Phase 1.

**The floating affordance:** [PROPOSED]
- One FAB, bottom-right, 56×56 (≥44 target), offset by `env(safe-area-inset-bottom)` plus 16px.
- It is **suppressed** when the contact section or footer is in view, when the mobile menu is open, and when a slider is being dragged in the SIP section (it overlaps the right edge of the output panel on narrow screens).
- On desktop it expands to a labelled pill on hover/focus; on mobile it stays an icon with an accessible name.
- Styling follows Earneazi's system, not WhatsApp's brand green as a page accent. Use the official glyph inside a brand-neutral surface, or the green confined to the icon. Do not introduce green into the palette.
- Never covers legal text or a primary CTA at any breakpoint. This is a QA check, not an assumption.

**Other channels:** [PROPOSED + [VERIFY] for all values]
- Tap-to-call links (`tel:`) for both numbers, `mailto:` for email, address with a maps link, and stated working hours. All of these exist on the old site and none exist on the current one.

**The contact form problem.** [CONFIRMED constraint / [VERIFY] decision]
V1 is frontend-only and no backend may be added. A form that submits nowhere is worse than no form. Three permissible options, and one must be chosen before Phase 5:
  1. **No form.** Contact section offers WhatsApp / call / email only. Lowest risk, entirely consistent with the constraint.
  2. **Compose-and-send.** The form builds a structured WhatsApp message or `mailto:` body from the fields; the user sends it from their own client. No data leaves the browser, nothing is stored.
  3. **Third-party form endpoint** (e.g. a hosted form service). This is not a backend in the repository, but it is an external dependency, a data-processing relationship, and a privacy-policy obligation. Requires client approval.
Recommendation: option 2, with option 1 as the fallback.

---

## 26. FAQ Experience

[PROPOSED]

- Reuse `DisclosureRow` so FAQ and Services share one interaction model.
- Content lives in one typed data file; the FAQ route and any homepage FAQ preview read from it.
- Each question has a stable id and a linkable hash; the page opens the matching item and scrolls to it on load.
- `FAQPage` JSON-LD emitted statically at build time. This is a genuine SEO win for a local business and costs nothing on static hosting.
- Answers are `container-prose` width, capped at 68 characters per line.
- Search/filter only if the list exceeds ~12 questions; otherwise it is chrome.
- No nested accordions. No auto-close animation longer than `dur-base`.
- **Content rewrite required.** The old FAQ answers contain "completely free", "within 1 working day", "20+ banks", and a fee explanation that needs compliant phrasing. Every answer must be re-approved. [VERIFY]
- The FAQ is the right home for the awkward but necessary questions: how Earneazi is paid, what it does and does not do, what happens to your documents, and whether advice is regulated. Answering these plainly is worth more than any badge.

---

## 27. Footer Experience

The footer is the second-most-visited part of a local business site and gets treated as a chapter, not a sitemap. [CONFIRMED by brief]

**Structure, top to bottom:** [PROPOSED]
1. **Brand band** — oversized wordmark on the ink ground with the dimensional treatment from §9, `radius-band` top corners overlapping the preceding section, plus a one-line statement of what Earneazi does.
2. **Conversion row** — "Book a consultation" primary + WhatsApp secondary + a short line of encouragement. This is the last chance to convert and should not be buried under the link columns.
3. **Navigation columns** (4 at ≥1024, 2 at 768–1023, accordion at <768): *What we do* (three services + the product sub-lists' anchors), *Plan around* (the six financial goals, deep-linked), *Tools* (SIP calculator, FAQ), *Company* (About, Contact).
4. **Contact block** — both phone numbers as `tel:` links, email, full office address, working hours, and a maps link. [VERIFY all values]
5. **Credential line** — AMFI/ARN and DSA status, verified only. [VERIFY]
6. **Legal block** — market-risk disclaimer, insurance solicitation notice, loan-discretion note, distributor status. Adapted from the old site's footer, which is the one piece of its content that was written correctly. Links to Privacy Policy, Terms, Grievance Policy — **which must exist as real routes**, not `#` placeholders as on the old site.
7. **Baseline** — copyright with a dynamically computed year (the old site still reads © 2024), and the founder attribution line.

**Behaviour:** [PROPOSED]
- Mobile columns collapse into accordions; the contact block never collapses.
- Link hover/focus: underline draws from left over `dur-instant`; no colour-only change.
- Motion budget: exactly one moment — the wordmark's dimensional resolve on entry. Columns do not stagger.
- Light theme: the footer is still an ink band, so the footer looks the same in both themes apart from its edge treatment. This is intentional — it gives the site a consistent close.
- Every link in the footer must have a real destination. No `#`.

---

## 28. Responsive Strategy

**Designed mobile-first for the three interactive sections** (hero, goals, SIP); desktop-first is acceptable only for purely editorial sections. [CONFIRMED by brief]

**Breakpoints:** 360 (floor), 480, 768, 1024, 1280, 1440 (container cap). Test at 360×640, 390×844, 430×932, 768×1024, 834×1194, 1024×768, 1280×800, 1440×900, 1920×1080. [PROPOSED]

**Per-platform requirements:** [CONFIRMED targets, [PROPOSED] techniques]

| Platform | Requirement |
|---|---|
| iPhone Safari | `100dvh`/`svh` instead of `100vh`; `viewport-fit=cover` (already present) + `env(safe-area-inset-*)` on the FAB, mobile sheet, and footer; inputs ≥16px to prevent zoom-on-focus; no `position: fixed` elements that fight the dynamic toolbar; test the address-bar collapse against any sticky element |
| iPad Safari | Test both orientations and Split View at ~507px and ~694px widths — these fall between breakpoints and are where "tablet" layouts usually break; no hover-dependent affordances even though a trackpad may be attached |
| Android Chrome | Dynamic viewport units for the collapsing URL bar; test on a mid-tier device for scroll-linked motion jank; check `backdrop-filter` cost on the nav |
| Windows Chrome / Edge | 125% and 150% OS display scaling; forced-colors / high-contrast mode must not erase borders or focus rings |
| macOS Safari / Chrome | Font smoothing differences on the display face; `backdrop-filter` and sticky behaviour |

**Rules:** [PROPOSED]
- No horizontal overflow at any width. A QA check, run at every breakpoint.
- Touch targets ≥44×44 with ≥8px separation.
- Pinning, parallax and scroll-linked draws are disabled below 1024px unless individually proven on device.
- Charts get purpose-built small-screen variants, never a scaled-down desktop chart.
- Type scale is fluid (`clamp`) so there are no jumps between breakpoints.
- Test with system font size increased (iOS Dynamic Type / Android font scale) at 200%.

---

## 29. Accessibility Strategy

Target: **WCAG 2.2 AA**. [CONFIRMED]

**Structure** — one `<h1>` per route; heading levels never skip; landmarks (`header`, `nav`, `main`, `footer`) present once each; a visible-on-focus skip link; `lang="en-IN"`; page `<title>` unique per route and updated on client-side navigation, with route changes announced to screen readers via a polite live region. [PROPOSED]

**Keyboard** — every interactive element reachable and operable; logical tab order matching visual order; no keyboard traps except the intentional modal trap; `Esc` closes every overlay; focus returns to the trigger on close; focus is moved to the heading of the new route after client-side navigation; `scroll-margin-top` on anchor targets so the sticky header never hides the focused element. [CONFIRMED]

**Focus visibility** — a single `focus-visible` token: 2px solid brand ring with 2px offset, plus a 1px contrasting inner ring so it survives on both themes and on brand-coloured buttons. `outline: none` without a replacement is a build-breaking error. [PROPOSED]

**Contrast** — every token pair measured and recorded; body text ≥4.5:1, large text ≥3:1, UI borders and chart strokes ≥3:1, focus indicator ≥3:1 against adjacent colours. Particular attention to: secondary grey on the page ground, legal text, chart gridlines, disabled states, and the brand blue on ink in dark theme. [CONFIRMED]

**Forms and controls** — programmatic labels (never placeholder-as-label); errors linked with `aria-describedby` and flagged with `aria-invalid`; error summary focusable; sliders expose `aria-valuetext` in formatted rupees; `inputmode="numeric"` for amounts. [CONFIRMED]

**Widgets** — accordions use `button` + `aria-expanded` + `aria-controls`; the goal selector implements the full tabs pattern with arrow-key support; the mobile sheet is a proper dialog with `aria-modal` and inert background; the theme control announces its state. [CONFIRMED]

**Media and graphics** — meaningful images get descriptive `alt`, decorative ones get `alt=""`; every chart has a text alternative and a hidden data table; icons that convey meaning have accessible names, decorative icons are `aria-hidden`. [CONFIRMED]

**Motion** — `prefers-reduced-motion` respected globally (§18.2.7); nothing flashes more than three times per second; no autoplaying motion longer than 5s without a pause control (this rules out the old site's infinite keyword marquee unless it is paused on hover/focus and disabled under reduced motion). [CONFIRMED]

**Robustness** — 200% browser zoom and 320px-equivalent reflow without loss of content or function; forced-colors mode audit; content readable with CSS animations disabled. [CONFIRMED]

---

## 30. Performance Considerations

**Budgets (enforced, not aspirational):** [PROPOSED]

| Metric | Budget | Measured on |
|---|---|---|
| LCP | < 2.0s | Mid-tier Android, throttled 4G |
| CLS | < 0.05 | All routes |
| INP | < 200ms | SIP slider interaction in particular |
| Initial JS (gzip) | ≤ 180 KB | Home route |
| Total fonts | ≤ 110 KB | Two variable faces, subset |
| Largest image | ≤ 200 KB | AVIF/WebP with dimensions set |

**Specific decisions:** [PROPOSED]
- **Recharts is lazy-loaded** and never on the critical path. The hero chart is bespoke inline SVG for exactly this reason; Recharts is reserved for the SIP visualisation behind a `React.lazy` boundary with a reserved-height skeleton (so it cannot cause CLS).
- **Framer Motion via `LazyMotion` + `domAnimation`**, with `m.*` components rather than `motion.*`, to avoid shipping the full feature set.
- **Fonts:** self-hosted variable `woff2`, subset, `font-display: swap`, `preload` the display face only, matched fallback metrics (`size-adjust`) to prevent layout shift on swap.
- **Route-level code splitting** on every route; the SIP route carries its own chunk.
- **Icons** as an inline sprite or per-icon components, tree-shaken. No icon font.
- **No scroll libraries.** Native `position: sticky`, `IntersectionObserver`, and `requestAnimationFrame`-throttled scroll progress only.
- **Images:** explicit `width`/`height` or aspect-ratio boxes everywhere; founder photos served at 2× maximum display size; `loading="lazy"` below the fold, `fetchpriority="high"` on any LCP image.
- **Third parties:** none by default. Any analytics, chat widget or form endpoint must be justified and measured. The old site's emoji-heavy, gradient-heavy build and the Reputes Wix build are both examples of what not to inherit.
- **Static output:** hashed asset filenames, brotli/gzip pre-compression where GoDaddy supports it, `preconnect` only to origins actually used (ideally none).

---

## 31. GoDaddy Deployment Constraints

This is the highest-risk technical item in the project and it must be resolved before Phase 1, not at Phase 7. [CONFIRMED requirement / [VERIFY] facts]

**Must be verified with the client first:**
1. **Which GoDaddy product is the site hosted on?** cPanel/Linux shared hosting (Apache, supports `.htaccess`) can host a Vite SPA correctly. GoDaddy *Website Builder* cannot host a React build at all. If the current plan is Website Builder, the plan must change or the deployment target must change. **This single answer determines whether the routing strategy below is viable.**
2. Is the site served from the domain root or a subdirectory? This sets Vite's `base` and every asset path.
3. Is the canonical host the apex domain or `www`? Both must resolve, one must redirect, and HTTPS must be forced.
4. Is deployment manual (File Manager / FTP) or automated? This determines the release checklist in Phase 7.

**Routing:** [PROPOSED]
- `BrowserRouter` with an Apache `.htaccess` rewrite: serve the file if it exists, otherwise rewrite to `index.html`. This is the required approach for direct URL access and refresh, which the brief names explicitly.
- **`HashRouter` is the fallback only** if rewrites cannot be configured on the chosen plan. It works everywhere but produces `#`-prefixed URLs, which is worse for sharing and SEO. Because it changes every internal link and every deep-link format (goals, services, FAQ), **the choice must be locked before Phase 1**, not retrofitted.
- A real `404` route inside the app, plus an Apache `ErrorDocument` for non-SPA paths.

**Caching and headers (via `.htaccess`):** [PROPOSED]
- Hashed assets: `Cache-Control: public, max-age=31536000, immutable`.
- `index.html`: `no-cache` (must revalidate, or a deploy will not reach returning visitors).
- Correct MIME types for `.woff2`, `.webmanifest`, `.avif` — shared hosts frequently get these wrong, and a wrong font MIME type silently breaks the type system.
- Enable compression for HTML/CSS/JS/SVG.
- Basic security headers where the host permits.

**Static SEO assets** (build-time, no server): `robots.txt`, `sitemap.xml`, per-route meta via a head manager, Open Graph image, `LocalBusiness` + `FAQPage` JSON-LD with the verified address, hours and phone. For a Belagavi business, `LocalBusiness` structured data is likely worth more than any other SEO work on the site. [PROPOSED + [VERIFY] for the data]

**Known limitation to accept:** the site is client-rendered, so crawlers see the shell first. With a static host and no Node runtime, pre-rendering the marketing routes at build time (a static pre-render step in Vite, not SSR) is the only way to fix this. [PROPOSED — decide before Phase 7; it is compatible with the no-backend constraint but changes the build pipeline, so flag it now]

---

## 32. Content / Information Density Strategy

**The principle:** three tiers per section. A one-line promise anyone can scan, a scannable middle layer of concrete substance, and an expandable third layer for the people who want detail. The current build stops at tier two; the old build dumped tiers two and three on the page at once. [PROPOSED]

**Density targets per section:** [PROPOSED]

| Section | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Hero | Headline + 25–35 word sub | 3 milestone markers | — |
| Services | Section intro ≤30 words | 3 rows, ≤12-word summaries | Panel: 45–70 words + 3 bullets + product sub-list |
| Goals | Intro ≤30 words | 6 goal labels | Panel: framing + 3–4 questions + product chips |
| Credentials | — | 3–5 ledger rows, one fact each | — |
| Process | Intro ≤20 words | 4 steps × ≤30 words | — |
| Founders | Intro ≤30 words | 2 people, role + tenure | 2–3 sentence bio each |
| SIP | Intro ≤40 words | Calculator + result | Assumptions + disclaimer |
| FAQ | — | 8–12 questions | Answers ≤80 words |
| Footer | Wordmark + one line | 4 columns + contact | Legal block |

**What to reintroduce from the old site** [PROPOSED]: the insurance and loan type breadth (as sub-lists inside service panels), the process section (already present), the FAQ's commercial questions, the full contact block, the working hours, and the legal disclaimer language.

**What must not be reintroduced** [CONFIRMED]: invented or unverified client counts, AUM, returns, rates, testimonials, years of experience, regulatory claims, registrations, guarantees, and live financial data. Section 3.4 is the authoritative register.

**Content governance:** every factual claim in the site lives in a typed content module with a `verified: true` field and a source note. Nothing renders without it. This makes the compliance rule structural rather than a matter of remembering. [PROPOSED]

**Voice:** the current build's voice is correct and should be the standard — plain verbs, sentence case, no jargon, no exclamation marks, no pressure. Buttons say what happens. The old site's "Start Your Wealth Journey Today", emoji, and "🚀" are out of register. [PROPOSED]

---

## 33. Production-Level QA Requirements

A phase is not complete until all of the following pass. [PROPOSED]

**Visual**
- Every section rendered at all nine test viewports, both themes, with no horizontal overflow and no orphaned column.
- Grid overlay check: every block starts and ends on a declared column.
- Spacing audit: no ad-hoc pixel values outside the token scale.
- Both themes screenshotted side by side per section; dark theme judged on its own merits, not as "the inverted one."

**Interaction**
- Every component demonstrates all nine states (§17).
- Keyboard-only traversal of every route, including the mobile sheet, accordions, tabs and sliders.
- Screen reader pass: VoiceOver (iOS + macOS) and NVDA (Windows) on the hero, goals, services, SIP and footer.
- Reduced-motion pass: every animation disabled or reduced, no content missing, no layout difference.
- Touch pass on a real iPhone and a real mid-tier Android, not an emulator.

**Correctness**
- SIP unit tests including the known-value case: ₹5,000/month, 12% p.a., 10 years → ₹11,61,695 (annuity-due), invested ₹6,00,000. Plus boundary cases at every min/max, and a non-integer rate.
- All currency rendered in en-IN grouping with tabular figures.
- Every link resolves; no `#` placeholders; external links carry `rel="noopener noreferrer"`.
- Deep links tested: direct URL entry and hard refresh on every route **on the real GoDaddy host**, not only locally.
- WhatsApp links open with the correct pre-filled message from every entry point, on iOS, Android and desktop (web.whatsapp.com fallback).

**Non-functional**
- Lighthouse on the deployed host: performance, accessibility, best practices, SEO — with the accessibility score treated as a floor, not a target, and manual testing treated as the real audit.
- Budgets from §30 measured and recorded.
- Zero TypeScript errors, zero console errors or warnings in production build.
- Content audit against §3.4: no unverified claim has crept in.

---

## 34. Risks and Anti-Patterns to Avoid

**From the current build** [INFERRED]
- The cream + high-contrast serif + tan accent palette. It is the dominant signature of machine-generated design in 2026 and it is not Earneazi's brand.
- A hairline "eyebrow" rule above every heading; `01/02/03` markers on non-sequences; monospace used decoratively; an arrow glyph welded to every CTA label; one border-radius and one shadow on every surface regardless of hierarchy.
- Editorial blocks at half width with an empty counterpart column.
- Charts that decorate instead of encoding (the twelve identical bars).
- Silence as a compliance strategy: no phone, no address, no credentials.

**From the old build** [INFERRED]
- Emoji as an icon system.
- Repeating the same four statistics three times on one page.
- Simulated data presented as real (the "live portfolio" card).
- Fund tables with performance figures on a static site that cannot be kept current.
- Gradient-on-gradient with glow shadows doing the work that hierarchy should do.
- Hover-triggered mega-menu.

**From Reputes** [INFERRED]
- Content gated behind scroll animations — the failure mode observed directly in the recording.
- Placeholder copy surviving to production.
- Unmeasurable metrics presented as statistics.
- All-caps headings and mid-headline colour switching.
- Heavy effect scripting and a horizontal-scroll section.
- Its colours, type, layouts and compositions in any form.

**Process risks**
- **Deciding the GoDaddy routing strategy late.** It changes every internal link. Lock it in Phase 0. [CONFIRMED]
- **Starting Phase 1 without the logo vector and the brand blue value.** Everything downstream inherits the wrong colour. [VERIFY]
- **Building the light theme first and "doing dark later."** Dark must be specified alongside, or it becomes an inversion, which the brief forbids. [CONFIRMED]
- **Adding a form before deciding how it submits.** [CONFIRMED constraint]
- **Letting motion be added per-component by whoever builds the component.** Motion must be assigned centrally (§18.3) or the page becomes fade-up soup.
- **Treating accessibility as a Phase 7 activity.** Focus rings, semantics and contrast are Phase 1 token decisions.

---

## 35. Phase-by-Phase Design Dependencies

| Phase | Cannot start until | Produces (that later phases depend on) |
|---|---|---|
| **1 — Global Shell & Brand System** | Logo vector + brand blue confirmed; typeface pairing chosen and licensed; routing strategy (Browser vs Hash) locked; theme token structure approved; GoDaddy plan type confirmed | Token file (colour, type, space, radius, shadow, motion), both themes, container/grid primitives, `Button`/`Link`/`IconTile`/`Field`, navbar + mobile nav, focus system, theme persistence |
| **2 — Hero + Signature Motion** | Phase 1 tokens; hero copy approved; decision on hero chart being bespoke SVG; motion tokens and reduced-motion hook in place | Hero, the signature motion pattern, the scroll-progress utility, the `ChartFrame` shell |
| **3 — Services + Financial Goals** | Phase 1 components; Phase 2 scroll utilities; service and goal content approved (including the reintroduced product sub-lists); deep-link URL scheme locked | `DisclosureRow`, `GoalSelector`, pinned-premise layout, URL-sync pattern reused by SIP and FAQ |
| **4 — SIP Calculator** | Formula convention, bounds and default rate locked; disclaimer wording approved; `ChartFrame` from Phase 2; `Field`/`Slider` from Phase 1 | Deterministic calculation module + tests, en-IN currency formatting utility, lazy chart boundary |
| **5 — Trust & Conversion** | Verified credential list, founder bios and photos, verified WhatsApp number, contact-form decision | `CredentialLedger`, `FounderCard`, `FloatingContact`, WhatsApp message builder |
| **6 — FAQ + Advanced Footer** | FAQ content re-approved; legal copy approved; Privacy/Terms/Grievance routes decided; dimensional wordmark treatment signed off | FAQ (reusing `DisclosureRow`), footer system, JSON-LD, legal routes |
| **7 — Production Hardening** | All of the above; access to the real GoDaddy host | `.htaccess`, caching, budgets met, full QA matrix, pre-render decision executed |

**Cross-phase invariants** (true from Phase 1 onward): no unverified claim renders; both themes ship together; every component ships with all states; reduced-motion is handled at the time the animation is written; zero TypeScript errors.

---

## 36. Phase 1 Readiness Checklist

### 36.1 Decisions that MUST be locked before Phase 1 begins

**Client / external — [VERIFY]**
1. ☐ Approved Earneazi logo as vector, plus any existing brand guidance.
2. ☐ Exact brand blue (sampled from the approved logo, not from a screenshot).
3. ☐ The single WhatsApp number that is actively monitored.
4. ☐ Both phone numbers, email, office address and working hours confirmed as current.
5. ☐ AMFI registration and ARN number, and DSA status — displayed only if evidenced.
6. ☐ Which of the old site's statistics (client count, AUM, years of experience, bank partners) the client can evidence. Everything unevidenced stays off the site.
7. ☐ Founder bios, roles, tenure, and photographs.
8. ☐ GoDaddy plan type (cPanel/Linux vs Website Builder), domain root vs subdirectory, canonical host, deployment method.
9. ☐ Confirmation that fund tables, return figures, rate figures and existing testimonials are **not** carried over.
10. ☐ Whether Privacy Policy, Terms and Grievance Policy copy exists or must be produced.

**Design — [PROPOSED, needs Ved's sign-off]**
11. ☐ Retire the serif display in favour of a grotesque aligned with the wordmark (§8.1). This is the pivotal decision; everything visual follows from it.
12. ☐ Retire the cream ground and gold accent; adopt the cool-neutral + brand-blue + ink system (§10).
13. ☐ Final typeface pairing and licences, with `₹` and tabular figures confirmed present.
14. ☐ Dimensional typography: Option A (footer wordmark), Option B (hero), or none (§9).
15. ☐ Container widths (1440 / 1200 / 720) and the four canonical section layouts (§14).
16. ☐ Chapter-inversion assignment — which sections are ink bands (§19.1).
17. ☐ Motion device assignment per section (§18.3), agreed centrally.
18. ☐ Theme control: two-state icon in nav, three-state in sheet/footer — confirm.
19. ☐ Navbar behaviour: sticky-always, no hide-on-scroll; whether Contact joins the nav items.
20. ☐ Removal of the global eyebrow rule and the CTA arrow glyph.

**Technical — [CONFIRMED / PROPOSED]**
21. ☐ `BrowserRouter` + `.htaccess` rewrites vs `HashRouter` fallback (§31). Blocks all link and deep-link work.
22. ☐ Deep-link URL scheme for services, goals and FAQ.
23. ☐ SIP formula convention (annuity-due recommended), input bounds, default assumed rate, rounding rule.
24. ☐ Contact form approach: none / compose-and-send / third-party endpoint (§25).
25. ☐ Self-hosted fonts, no external CDN — confirm.
26. ☐ Performance budgets accepted as build-blocking (§30).
27. ☐ Whether build-time pre-rendering of marketing routes is in scope for Phase 7.
28. ☐ Content governance model: typed content modules with a `verified` flag (§32).

### 36.2 Phase 1 entry criteria

Phase 1 may begin when items 1, 2, 8, 11, 12, 13, 15, 21 and 25 are closed. The remainder can be closed during Phase 1 without blocking it, but items 3–7 and 9 block Phase 5, and items 10 and 23–24 block Phases 4–6.

### 36.3 Phase 1 deliverable definition

Phase 1 is complete when: the token file exists and is the only source of colour, type, spacing, radius, shadow and motion values; both themes are implemented independently and switch without flash; the grid and container primitives exist; `Button`, `Link`, `IconTile`, `Field` and `SectionHeader` ship with all nine states in both themes; the navbar and mobile navigation are complete including keyboard, focus and reduced-motion behaviour; the routing strategy is implemented and verified by a hard refresh on a deep route on the real host; and the build has zero TypeScript errors.

---

### Appendix — Open questions that are not blocking but should be answered

- Does Earneazi want the goal-led IA to extend to dedicated goal routes (`/financial-goals/buy-a-home`), or stay as a single interactive section? This affects SEO meaningfully for a local business. [PROPOSED to decide by Phase 3]
- Is there appetite for a Kannada or Marathi language toggle given the Belagavi market? It is a structural decision (routing, fonts, measure) that is cheap now and expensive later. [VERIFY]
- Should the site carry a blog/insights route? Not in the roadmap, but it is the standard way a distributor builds local search presence, and its absence should be a decision rather than an oversight. [VERIFY]
