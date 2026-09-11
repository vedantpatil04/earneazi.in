import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { controlBase, controlSizingMultiline } from './controlStyles';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** See the note on InputProps — prefer `Field` for new work. */
  errorMessage?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, errorMessage, rows = 4, 'aria-describedby': describedBy, ...props }, ref) => {
    const errorId = errorMessage && id ? `${id}-error` : undefined;
    const described = [describedBy, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={cn(controlBase, controlSizingMultiline, className)}
          aria-invalid={errorMessage ? true : props['aria-invalid']}
          aria-describedby={described}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
