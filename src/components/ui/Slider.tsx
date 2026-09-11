import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Human-readable current value for screen readers, e.g. "₹5,000 per month". Falls back to the raw numeric value. */
  valueText?: string;
}

/**
 * Built on the native <input type="range"> rather than a custom div-based
 * control, so keyboard support (arrow keys, Home/End, Page Up/Down) and the
 * accessible role/value come from the browser for free (Section K: "no
 * divs as interactive controls when a semantic element exists"). The SIP
 * calculator's actual slider wiring is Phase 3 (Section N) — this is the
 * styled, accessible foundation it will use.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(({ className, valueText, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="range"
      aria-valuetext={valueText}
      className={cn(
        'h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-accent',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        className
      )}
      {...props}
    />
  );
});

Slider.displayName = 'Slider';
