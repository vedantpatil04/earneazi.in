import { MessagesSquare, ClipboardList, Wallet, RefreshCw } from 'lucide-react';
import type { JourneyStep } from '@/types/content';

/**
 * "How it works" — a genuine sequence, which is why this is the one
 * section on the homepage that carries numbers. It describes the general
 * shape of working with an advisor rather than a company-specific claim,
 * so it needs no figures and states no outcome.
 */
export const journeySteps: JourneyStep[] = [
  {
    id: 'share-goals',
    title: 'Tell us what you’re working toward',
    description:
      'Growing wealth, buying a home, protecting your family, or something that doesn’t fit neatly into any of those.',
    icon: MessagesSquare,
  },
  {
    id: 'get-a-plan',
    title: 'Get a plan, not a pitch',
    description:
      'We map those goals to a mix of funds, cover and credit — and explain why each piece is in there.',
    icon: ClipboardList,
  },
  {
    id: 'move-at-your-pace',
    title: 'Move at your own pace',
    description: 'Start with the parts that make sense now. The rest can wait until it’s actually relevant to you.',
    icon: Wallet,
  },
  {
    id: 'revisit-as-life-changes',
    title: 'Revisit as life changes',
    description:
      'A new job, a new home, a new dependent — goals shift, so the plan gets reviewed rather than left on autopilot.',
    icon: RefreshCw,
  },
];
