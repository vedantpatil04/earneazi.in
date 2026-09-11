import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

/**
 * Standalone label, for controls composed by hand. `Field` renders its own
 * label and should be preferred for new work.
 *
 * The asterisk is decorative only — pair this with a native `required` (or
 * `aria-required`) on the control, which is what assistive tech announces.
 */
export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label className={cn('block text-body-sm font-semibold text-ink', className)} {...props}>
      {children}
      {required && (
        <span className="ml-1 text-error" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
