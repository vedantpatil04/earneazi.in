import { forwardRef } from 'react';
import type { SelectHTMLAttributes, ReactNode } from 'react';
import { controlBase, controlSizing } from './controlStyles';
import { cn } from '@/lib/utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** See the note on InputProps — prefer `Field` for new work. */
  errorMessage?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, id, errorMessage, children, 'aria-describedby': describedBy, ...props }, ref) => {
    const errorId = errorMessage && id ? `${id}-error` : undefined;
    const described = [describedBy, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        <select
          ref={ref}
          id={id}
          /* `appearance-none` plus our own chevron would mean drawing and
             theming a control the platform already draws correctly; the
             native arrow follows `color-scheme`, which the token layer
             sets per theme. */
          className={cn(controlBase, controlSizing, 'pr-10', className)}
          aria-invalid={errorMessage ? true : props['aria-invalid']}
          aria-describedby={described}
          {...props}
        >
          {children}
        </select>
        {errorMessage && (
          <p id={errorId} role="alert" className="mt-2 flex items-start gap-1.5 text-body-sm font-medium text-error">
            <span aria-hidden="true">!</span>
            <span>{errorMessage}</span>
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
