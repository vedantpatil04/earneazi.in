import { Calculator, CircleHelp, Home, Layers, MessageCircle, ShieldCheck, Target, Users } from 'lucide-react';
import type { NavItem, RibbonItem } from '@/types/nav';
import { servicePillars } from '@/data/services';

/**
 * The confirmed sitemap. This stays the canonical list — the footer renders
 * it in full, and it's what any future sitemap/routing work should read.
 */
export const primaryNav: NavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  {
    label: 'SIP Calculator',
    path: '/sip-calculator',
    description: 'See what regular investing looks like',
    icon: Calculator,
  },
  {
    label: 'Insurance',
    path: '/insurance',
    description: 'Health, life, motor, home, travel and business cover',
    icon: ShieldCheck,
  },
  { label: 'Services', path: '/services', description: 'Mutual funds, insurance, loans', icon: Layers },
  {
    label: 'Financial Goals',
    path: '/financial-goals',
    description: 'Start from what you’re working toward',
    icon: Target,
  },
  { label: 'About', path: '/about', description: 'Who we are', icon: Users },
  { label: 'FAQ', path: '/faq', description: 'Common questions', icon: CircleHelp },
  { label: 'Contact', path: '/contact', description: 'Start a conversation', icon: MessageCircle },
];

/**
 * What the desktop and mobile header navigation shows in canonical order:
 * 1. SIP Calculator
 * 2. Insurance
 * 3. Services
 * 4. Financial Goals
 * 5. About
 * 6. FAQ
 *
 * Home is already reachable from the wordmark and Contact is promoted to the
 * header's call to action, so repeating either as a plain link only adds width
 * without adding a destination.
 */
export const headerNav: NavItem[] = primaryNav.filter(
  (item) => item.path !== '/' && item.path !== '/contact'
);

/** The header's single call to action — kept here so it can't drift from the sitemap. */
export const headerCta = { label: 'Book a consultation', path: '/contact' } as const;

/**
 * The information ribbon under the navigation bar — Enhancement A.
 *
 * An index of what the site can do, in the order a visitor tends to need it:
 * the three services, the goals that organise them, the one tool, and a
 * person. The service entries are read from `servicePillars` rather than
 * restated, so renaming a service or changing its glyph cannot leave the
 * ribbon saying the old thing, and each wears its own subject accent. The
 * calculator wears the mutual-funds accent because that is what it
 * calculates; the goals index and the advisor stay in the brand blue,
 * because neither belongs to one subject.
 *
 * Descriptions are a few words of orientation, never a claim.
 */
const SERVICE_RIBBON_LINES: Record<string, string> = {
  'mutual-funds': 'Wealth & investing',
  insurance: 'Life, health, motor & more',
  loans: 'Home & personal',
};

export const ribbonItems: RibbonItem[] = [
  ...servicePillars.map((service) => ({
    id: service.id,
    title: service.title,
    description: SERVICE_RIBBON_LINES[service.id] ?? service.shortTitle,
    href: service.href,
    icon: service.icon,
    toneId: service.id,
  })),
  {
    id: 'financial-goals',
    title: 'Financial Goals',
    description: 'Milestone roadmaps',
    href: '/financial-goals',
    icon: Target,
  },
  {
    id: 'sip-calculator',
    title: 'SIP Calculator',
    description: 'Run the numbers',
    href: '/sip-calculator',
    icon: Calculator,
    toneId: 'mutual-funds',
  },
  {
    id: 'talk-to-advisor',
    title: 'Talk to an advisor',
    description: 'One-to-one guidance',
    href: '/contact',
    icon: MessageCircle,
  },
];
