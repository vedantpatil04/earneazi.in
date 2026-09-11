import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorMessage?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, errorMessage, rows = 4, ...props }, ref) => {
    const errorId = errorMessage && id ? `${id}-error` : undefined;

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={cn(
            'w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-ink',
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
  }
);

Textarea.displayName = 'Textarea';
