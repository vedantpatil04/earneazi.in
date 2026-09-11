import { Compass, Handshake, Layers, MessagesSquare } from 'lucide-react';
import type { AboutPrinciple } from '@/types/content';

/**
 * How the firm works, stated as principles.
 *
 * These describe an approach, which is something a business can state about
 * itself. They are deliberately not achievements: no years in business, no
 * client count, no assets under management, no awards, no registrations.
 * Those are all unverified, and the About page is where a site is most
 * tempted to invent them.
 */
export const aboutPrinciples: AboutPrinciple[] = [
  {
    id: 'goals-first',
    title: 'The goal comes before the product',
    description:
      'We start from what you are trying to do and work backward to what it takes. Recommending a product first and finding a reason for it afterwards is how people end up owning things they cannot explain.',
    icon: Compass,
  },
  {
    id: 'one-view',
    title: 'One view of the whole picture',
    description:
      'Investments, cover and borrowing get decided together. Handled separately they quietly work against each other — a loan that starves a SIP, cover sized against the wrong number.',
    icon: Layers,
  },
  {
    id: 'plain-language',
    title: 'Explained before it is agreed',
    description:
      'Every recommendation comes with a plain-language reason. If a product cannot be explained without jargon, that is usually a sign it needs a second look rather than a longer sentence.',
    icon: MessagesSquare,
  },
  {
    id: 'long-relationship',
    title: 'Built to be revisited',
    description:
      'A plan set once and left alone stops matching your life fairly quickly. A new job, a new home, a new dependent — the point of the relationship is that the plan changes when those do.',
    icon: Handshake,
  },
];

/**
 * The one-paragraph description of the business. Kept here rather than in
 * JSX so the About page, the footer and any future metadata all say the
 * same thing.
 */
export const aboutSummary =
  'Earneazi helps people plan across mutual funds and PMS, insurance and loans — the three decisions that between them cover most of what a household does with its money. The point of doing all three under one roof is that they stop being separate decisions.';
