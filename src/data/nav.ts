import type { NavItem } from '@/types/nav';

/**
 * The confirmed sitemap. This stays the canonical list — the footer renders
 * it in full, and it's what any future sitemap/routing work should read.
 */
export const primaryNav: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services', description: 'Mutual funds & PMS, insurance, loans' },
  { label: 'Financial Goals', path: '/financial-goals', description: 'Start from what you’re working toward' },
  { label: 'SIP Calculator', path: '/sip-calculator', description: 'See what regular investing looks like' },
  { label: 'About', path: '/about', description: 'Who we are' },
  { label: 'Contact', path: '/contact', description: 'Start a conversation' },
  { label: 'FAQ', path: '/faq', description: 'Common questions' },
];

/**
 * What the desktop header shows. Home is already reachable from the
 * wordmark and Contact is promoted to the header's call to action, so
 * repeating either as a plain link only adds width without adding a
 * destination. Every route still appears in the footer and the mobile panel.
 */
export const headerNav: NavItem[] = primaryNav.filter(
  (item) => item.path !== '/' && item.path !== '/contact'
);

/** The header's single call to action — kept here so it can't drift from the sitemap. */
export const headerCta = { label: 'Book a consultation', path: '/contact' } as const;
