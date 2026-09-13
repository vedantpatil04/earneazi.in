import type { LucideIcon } from 'lucide-react';

export interface ServicePillar {
  id: string;
  title: string;
  /** Short form for tight contexts (nav rows, chips) where the full title would wrap. */
  shortTitle: string;
  summary: string;
  /** One clause, for tight contexts like the homepage hero. A compression of `summary`, never a new claim. */
  tagline: string;
  href: string;
  icon: LucideIcon;
  /** Short, non-quantified "what this covers" points — no figures, rates, returns or guarantees. */
  highlights: string[];
  /** Who tends to need this, in plain language. Describes a situation, never a recommendation. */
  whoItsFor: string;
  /** Why the decision matters. Explains a trade-off; states no outcome, rate or return. */
  whyItMatters: string;
  /** The concrete next action for this service. Every service page section ends with one. */
  nextStep: { label: string; to: string };
  /**
   * The product categories this service covers.
   *
   * This is the "we really do all of this" signal the previous site carried
   * in its eight-item insurance and loan grids, restored as a labelled
   * sub-list inside the service rather than as a wall of cards (§21).
   *
   * Category names only. No rate, no limit, no lender name, no insurer name
   * and no product-specific term appears here or may be added — those are
   * volatile, unverified, or both (§3.4).
   */
  categories: ServiceCategories;
  /**
   * The same categories as `categories`, split into the two groups a
   * reader actually sorts them into (Phase 3).
   *
   * A flat run of eight chips reads as a word cloud; two labelled groups of
   * four read as a service's shape — "people" and "assets" for insurance,
   * "secured" and "unsecured" for loans. Same items, same rules: category
   * names only, no rate, limit, lender or insurer, ever.
   *
   * Optional so a service can be added with the flat list alone; the
   * services section falls back to `categories` when it is absent.
   */
  categoryGroups?: ServiceCategories[];
  /**
   * The products within the service (Enhancement B), each explained in three
   * sentences. `categories` and `categoryGroups` are derived from these
   * names in data/services.ts, so the lists cannot disagree.
   */
  products: ServiceProduct[];
  badge?: string;
  categoryLabel?: string;
}

export interface ServiceCategories {
  /** What the list is, e.g. "Cover we arrange". */
  label: string;
  /**
   * Plain category names, in the order they should read.
   *
   * [VERIFY] These are the standard categories a mutual fund distributor and
   * DSA in this market places, restored to recover the breadth the previous
   * site showed. The owner must confirm which of them Earneazi actually
   * arranges before launch — listing one it does not place is a claim, and
   * removing an item is an edit to this array and nothing else.
   */
  items: string[];
}

/**
 * One product within a service (Enhancement B) — "Health insurance",
 * "Gold loan". Three plain sentences and nothing more: no rate, premium,
 * amount, tenure, return, provider name or promised outcome, and no field
 * one could be dropped into.
 */
export interface ServiceProduct {
  id: string;
  name: string;
  icon: LucideIcon;
  /** What it is. */
  summary: string;
  /** Who it tends to suit — a situation, never a recommendation. */
  whoFor: string;
  /** What Earneazi does in a conversation about it. */
  howWeHelp: string;
}

export interface GoalEntry {
  id: string;
  title: string;
  description: string;
  /**
   * The questions an advisor would actually work through for this goal.
   * Deliberately phrased as considerations, not outcomes — nothing here
   * may imply a return, a rate, or a result.
   */
  considerations: string[];
  /**
   * Two or three words naming the kind of decision this is (Phase 3).
   * Context, not a claim — it tells a reader which conversation they are
   * about to have before they read the questions underneath.
   */
  focus: string;
  /**
   * How far out this goal usually sits, qualitatively (Phase 3).
   *
   * Deliberately never a number of years: a horizon stated as a figure
   * reads as a recommendation about holding period, and this file states no
   * recommendations. "Years, not months" is framing; "7–10 years" would not
   * be.
   */
  horizon: string;
  /**
   * The first thing an advisor would actually establish for this goal
   * (Phase 3). One sentence, describing a step in a conversation — never an
   * outcome, a product or a result.
   */
  startsWith: string;
  relatedServiceIds: string[];
  icon: LucideIcon;
  iconName?: string;
  targetHref?: string;
  timeline?: string;
}

/**
 * "How it works" — a genuine sequence, so numbered presentation in the UI
 * is appropriate here in a way it isn't for the (parallel, unordered)
 * service pillars.
 */
export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * "Why Earneazi" — process/relationship positioning only. Trust content
 * must use verified information, and none of the quantified claims
 * (client counts, AUM, years, awards) are verified, so this content shape
 * deliberately has no field a statistic could live in.
 */
export interface TrustPoint {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export type FaqCategory = 'Getting started' | 'Investing' | 'Insurance' | 'Loans';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
}

/**
 * One way of getting in touch. `value` stays null and `verified` stays false
 * until the client supplies the real detail — the UI renders nothing at all
 * for an unverified channel rather than showing a placeholder that could be
 * mistaken for a working number or address.
 */
export interface ContactChannel {
  id: string;
  kind: 'phone' | 'whatsapp' | 'email' | 'office' | 'hours';
  label: string;
  /** What to show. Null until supplied. */
  value: string | null;
  /** One line of context under the value, e.g. when this channel is answered. */
  note?: string;
  /**
   * Office only: a maps URL for the address (Phase 5, §25).
   *
   * Separate from `value` because the address is text a person reads and
   * this is a destination a person taps, and because an address can be
   * confirmed before anyone has agreed which map service to point at.
   * Absent means the address renders as text rather than as a link.
   */
  mapsUrl?: string | null;
  verified: boolean;
}

/** How the firm works, as a stated principle rather than a measured claim. */
export interface AboutPrinciple {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * `photoVerified` / `bioVerified` / `consentVerified` track whether a record
 * has been confirmed by the client. Nothing with a false flag is presented
 * as fact anywhere in the UI.
 */
export interface TeamMember {
  id: string;
  /**
   * Founders lead the business and are named in the footer's attribution;
   * the team appears beside them in the same card system (Enhancement B).
   */
  group: 'founder' | 'team';
  name: string;
  role: string;
  /**
   * The mark shown when there is no verified photograph — authored per
   * person, never derived. Initials-of-full-name gave both current
   * founders "AS", which is the duplicated-monogram defect §24 names.
   */
  monogram: string;
  /** A Phase 3 subject-accent id, so two founders are told apart by colour too. */
  toneId: string;
  photoUrl: string | null;
  photoVerified: boolean;
  bio: string;
  bioVerified: boolean;
  /** e.g. "In financial services since 2011". [VERIFY] — null until confirmed. */
  tenure: string | null;
  tenureVerified: boolean;
  /** What this person is accountable for. [VERIFY] — never inferred from the job title. */
  responsibility: string | null;
  /** Two to four short specialism tags. Empty until supplied. */
  focus: string[];
  /** A registration identifier the client can evidence. Null until supplied. */
  credentialId: string | null;
}

/**
 * One row of the credential ledger (§24).
 *
 * A credential is a registration, an arrangement, or a fact about the
 * business that a document can prove. It is never a number about outcomes:
 * client counts, AUM, average returns and satisfaction figures are forbidden
 * on this section, and there is deliberately no field one could live in.
 *
 * `identifier` is what makes the row evidence rather than a badge. A row
 * without one is not shown, however true it is.
 */
export interface Credential {
  id: string;
  /** The claim, e.g. "AMFI-registered mutual fund distributor". */
  label: string;
  /**
   * The same claim in two or three words, for the header's credential line
   * (Enhancement A), e.g. "AMFI Registered". A display form of `label`,
   * never a separate claim — and it renders under exactly the same gate.
   */
  shortLabel?: string;
  /** What the identifier is called, e.g. "ARN". */
  identifierLabel: string;
  /** The evidence. Null until the client supplies it — the row stays hidden. */
  identifier: string | null;
  /** One plain sentence of context. */
  detail: string;
  verified: boolean;
}

/**
 * A testimonial, gated on written consent (§24).
 *
 * There is no field for an amount, a return or a duration, and that is the
 * point: the old site's testimonials carried rupee figures and performance
 * claims, and §3.4 rules them out permanently. A quote that needs a number
 * to work is not a quote this site can carry.
 */
export interface Testimonial {
  id: string;
  name: string;
  city: string;
  quote: string;
  /** Written consent, per person, on file. Nothing renders without it. */
  consentVerified: boolean;
}

/** The six SEBI riskometer levels, as printed on a scheme document. */
export type FundRiskLevel = 'Low' | 'Low to moderate' | 'Moderate' | 'Moderately high' | 'High' | 'Very high';

/**
 * One scheme in the fund shortlist (Enhancement B). Everything past the name
 * and category is null until confirmed, and the UI omits a null field rather
 * than showing a placeholder. There is deliberately no NAV and no live data.
 */
export interface FundListing {
  id: string;
  name: string;
  category: string;
  /** From the current scheme document — never inferred from the category. */
  riskLevel: FundRiskLevel | null;
  /** Minimum SIP instalment in rupees, from the scheme document. */
  minSipAmount: number | null;
  oneYearReturnPct: number | null;
  /** Annualised. */
  threeYearReturnPct: number | null;
  /** Performance is shown only when this is true AND `performanceAsOf` is set. */
  performanceVerified: boolean;
  /** The as-of date printed beside any performance figure, e.g. '31 Aug 2026'. */
  performanceAsOf: string | null;
}

/**
 * A lending or insurance partner (Enhancement B). Shown only when the
 * arrangement is verified, with the institution's own approved logo file or,
 * without one, its name as text — never a redrawn or recoloured mark.
 */
export interface LendingPartner {
  id: string;
  name: string;
  logo: { src: string; width: number; height: number } | null;
  verified: boolean;
}

export interface TrustPrinciple {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  highlight: string;
}

export interface BankingPartner {
  name: string;
  tagline: string;
}

/**
 * A social profile (Phase 6).
 *
 * Distinct from `ContactChannel`: a profile is somewhere the business can
 * be followed, not a line someone answers. Like every business fact on the
 * site it is gated on `verified`, and `url` is never derived from the
 * business name — a guessed handle can belong to someone else entirely.
 */
export interface SocialProfile {
  id: string;
  network: 'instagram';
  label: string;
  /** The handle without the @, for the accessible name. Null until supplied. */
  handle: string | null;
  /** The profile URL. Null until supplied — never guessed. */
  url: string | null;
  verified: boolean;
}

/**
 * One notice in the footer's legal block (Phase 6, §27).
 *
 * `basis` records why the wording may appear at all. A notice with no
 * approved or standard wording has `text: null` and renders nothing —
 * regulatory copy is not written speculatively.
 */
export interface LegalNotice {
  id: string;
  /** What the notice covers, for whoever supplies the wording. Never rendered. */
  subject: string;
  text: string | null;
  basis: 'industry-standard' | 'describes-this-site' | 'client-approved' | null;
}

/**
 * A legal page the footer links to (Phase 6, §27). §27 requires these to be
 * real routes rather than `#` placeholders, so a document links only once
 * its route exists and its copy is approved.
 */
export interface LegalDocument {
  id: string;
  label: string;
  /** A route that exists in App.tsx. Null until the page and its approved copy exist. */
  route: string | null;
  approved: boolean;
}
