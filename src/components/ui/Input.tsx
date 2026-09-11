import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** When set, renders an associated error message and marks the input invalid for assistive tech. */
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, id, errorMessage, ...props }, ref) => {
  const errorId = errorMessage && id ? `${id}-error` : undefined;

  return (
    <div className="w-full">
      <input
        ref={ref}
        id={id}
        className={cn(
          'h-11 w-full rounded-md border border-border bg-surface px-3 text-body text-ink',
          'placeholder:text-ink-muted',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          errorMessage && 'border-error',
          className
        )}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorId}
        {...props}
      />
      {errorMessage && (
        <p id={errorId} className="mt-1.5 text-small text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
