import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type CardElevation = 'flat' | 'raised' | 'lifted';

interface CardProps {
  as?: ElementType;
  elevation?: CardElevation;
  className?: string;
  children: ReactNode;
}

const elevationStyles: Record<CardElevation, string> = {
  flat: 'border border-divider',
  raised: 'border border-divider shadow-md',
  lifted: 'border border-divider shadow-lg',
};

/**
 * Deliberately not the "identical rounded card with a soft grey shadow"
 * default. `flat` (the default) is a hairline border only, so elevation is
 * reserved for the small number of surfaces that genuinely need to lift off
 * the page rather than being applied uniformly. Shadows resolve to the
 * ink-tinted `--shadow-*` tokens, which have their own values per theme.
 */
export function Card({ as: Tag = 'div', elevation = 'flat', className, children }: CardProps) {
  return <Tag className={cn('rounded-lg bg-surface p-6', elevationStyles[elevation], className)}>{children}</Tag>;
}
