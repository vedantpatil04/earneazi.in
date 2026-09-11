import { cn } from '@/lib/utils/cn';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Decorative structural element — uses the `divider` token (a lighter,
 * non-functional hairline), not `border` (reserved for interactive
 * boundaries that carry a 3:1 contrast requirement). See globals.css.
 */
export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  if (orientation === 'vertical') {
    return <div role="separator" aria-orientation="vertical" className={cn('w-px self-stretch bg-divider', className)} />;
  }
  return <hr className={cn('border-0 border-t border-divider', className)} />;
}
