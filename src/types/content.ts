import type { LucideIcon } from 'lucide-react';

export interface ServicePillar {
  id: string;
  title: string;
  /** Short form for tight contexts (nav rows, chips) where the full title would wrap. */
  shortTitle: string;
  summary: string;
  href: string;
  icon: LucideIcon;
  /** Short, non-quantified "what this covers" points — no figures, rates, returns or guarantees. */
  highlights: string[];
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

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
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
