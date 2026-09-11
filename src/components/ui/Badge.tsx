import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-2 text-ink-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
};

export function Badge({ variant = 'neutral', className, children }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-label font-medium', variantStyles[variant], className)}>
      {children}
    </span>
  );
}
