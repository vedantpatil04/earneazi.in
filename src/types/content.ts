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
  badge?: string;
  categoryLabel?: string;
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
  name: string;
  role: string;
  photoUrl: string | null;
  photoVerified: boolean;
  bio: string;
  bioVerified: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  quote: string;
  consentVerified: boolean;
}

export interface FundListing {
  id: string;
  name: string;
  category: string;
  oneYearReturnPct: number | null;
  threeYearReturnPct: number | null;
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
