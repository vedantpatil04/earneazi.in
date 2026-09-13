import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  /** Longer label used in the mobile panel, where there's room for a line of context. */
  description?: string;
  /** The route's glyph in the mobile panel. Decorative — the label names the row. */
  icon?: LucideIcon;
}

/**
 * One entry in the information ribbon under the navigation bar
 * (Enhancement A). A destination on the site, never a claim: a title, a few
 * words of context, where it goes, and which subject accent it wears.
 */
export interface RibbonItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** A subject-tone id (see the SUBJECT TONE CHANNEL in globals.css). Absent means the brand blue. */
  toneId?: string;
}
