import { forwardRef } from 'react';
import type { CSSProperties, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Human-readable current value for screen readers, e.g. "₹5,000 per month". Falls back to the raw numeric value. */
  valueText?: string;
  /** 0–100. Paints the travelled portion of the track in the accent colour. Omit for a plain track. */
  fillPercent?: number;
}

/**
 * Built on the native `<input type="range">` rather than a custom
 * div-based control, so keyboard support (arrow keys, Home/End, Page
 * Up/Down), the accessible role, and the value announcements all come from
 * the browser rather than being reimplemented — and reimplemented wrongly.
 *
 * The filled track is painted with a hard-stop gradient on the input's own
 * background rather than an overlaid element, which keeps it to a single
 * paint and avoids the extra element intercepting pointer events. Colours
 * come from the theme tokens, so it follows light/dark with no JS.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, valueText, fillPercent, style, ...props }, ref) => {
    const clampedFill = typeof fillPercent === 'number' ? Math.min(100, Math.max(0, fillPercent)) : undefined;

    const trackStyle: CSSProperties | undefined =
      clampedFill === undefined
        ? style
        : {
            ...style,
            backgroundImage: `linear-gradient(to right, rgb(var(--color-accent-primary)) 0 ${clampedFill}%, rgb(var(--color-surface-2)) ${clampedFill}% 100%)`,
          };

    return (
      <input
        ref={ref}
        type="range"
        aria-valuetext={valueText}
        style={trackStyle}
        className={cn(
          'h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-2',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus',
          className
        )}
        {...props}
      />
    );
  }
);

Slider.displayName = 'Slider';
