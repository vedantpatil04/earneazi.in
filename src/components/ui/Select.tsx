import { forwardRef } from 'react';
import type { SelectHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  errorMessage?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, id, errorMessage, children, ...props }, ref) => {
    const errorId = errorMessage && id ? `${id}-error` : undefined;

    return (
      <div className="w-full">
        <select
          ref={ref}
          id={id}
          className={cn(
            'h-11 w-full rounded-md border border-border bg-surface px-3 text-body text-ink',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
            errorMessage && 'border-error',
            className
          )}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorId}
          {...props}
        >
          {children}
        </select>
        {errorMessage && (
          <p id={errorId} className="mt-1.5 text-small text-error">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
