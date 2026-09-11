import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { controlBase, controlSizing } from './controlStyles';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Convenience path: renders the error text and wires `aria-invalid` /
   * `aria-describedby` for a control used on its own.
   *
   * Prefer `Field`, which owns the label, helper text and error together
   * and cannot forget to link them. This prop stays for controls composed
   * by hand against an existing form schema.
   */
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, id, errorMessage, 'aria-describedby': describedBy, ...props }, ref) => {
    const errorId = errorMessage && id ? `${id}-error` : undefined;
    const described = [describedBy, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        <input
          ref={ref}
          id={id}
          className={cn(controlBase, controlSizing, className)}
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

Input.displayName = 'Input';
