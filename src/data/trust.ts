import { Users, Target, MessageCircle, FileCheck } from 'lucide-react';
import type { TrustPoint } from '@/types/content';

/**
 * Trust content, restricted to how the firm works with people. The
 * quantified versions of this section — client counts, AUM, years in
 * business, awards, registrations — are all unverified, so none of them
 * appear here and the TrustPoint type has nowhere to put one. Swap in
 * verified credentials once the client signs them off; this array is where
 * they would go.
 */
export const trustPoints: TrustPoint[] = [
  {
    id: 'one-relationship',
    title: 'One relationship, not three',
    description:
      'Mutual funds, insurance and loans coordinated by the same advisor, so nothing you own quietly works against something else you own.',
    icon: Users,
  },
  {
    id: 'built-around-goals',
    title: 'Built around your goals',
    description:
      'We start from what you’re trying to do — buy a home, protect your family, retire on your terms — and work backward to the products that get you there.',
    icon: Target,
  },
  {
    id: 'a-person-to-talk-to',
    title: 'A person you can actually talk to',
    description:
      'Questions get answered by someone who already knows your plan, rather than whoever picks up a queue.',
    icon: MessageCircle,
  },
  {
    id: 'explained-before-you-sign',
    title: 'Explained before you sign',
    description:
      'Every recommendation comes with a plain-language reason, so you know what you’re agreeing to and why it’s there.',
    icon: FileCheck,
  },
];
