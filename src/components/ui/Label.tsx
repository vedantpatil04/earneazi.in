import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

/**
 * The visual asterisk is decorative only — pair this with a native
 * `required` attribute on the actual input, which is what assistive tech
 * announces.
 */
export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label className={cn('block text-label font-medium text-ink-secondary', className)} {...props}>
      {children}
      {required && (
        <span className="ml-1 text-error" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
