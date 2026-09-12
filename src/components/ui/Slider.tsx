import { forwardRef } from 'react';
import type { CSSProperties, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Human-readable current value for screen readers, e.g. "₹5,000 per month". Falls back to the raw numeric value. */
  valueText?: string;
  /** 0–100. Paints the travelled portion of the track in the brand colour. Omit for a plain track. */
  fillPercent?: number;
}

/**
 * Built on the native `<input type="range">` rather than a custom div-based
 * control, so keyboard support (arrow keys, Home/End, Page Up/Down), the
 * accessible role and the value announcements all come from the browser
 * rather than being reimplemented — and reimplemented wrongly.
 *
 * ── Phase 4: the touch target ───────────────────────────────────────────
 *
 * This control used to be an 8px-tall input with a 24px thumb painted on
 * top, which meant the draggable area was 24px at its most generous and 8px
 * at the ends — well under the 44px minimum, and the known gap recorded
 * against it in globals.css. The calculator is the page where that matters
 * most, because dragging is the primary way people use it.
 *
 * The fix separates the hit area from the paint. The input itself is now
 * 44px tall and fully transparent; the visible 8px track is drawn by
 * `::-webkit-slider-runnable-track` / `::-moz-range-track`, optically
 * centred inside it. Every pixel of those 44 is draggable, and nothing about
 * the control looks larger than before.
 *
 * ── Why the fill is a custom property ───────────────────────────────────
 *
 * The travelled portion has to be painted on the *track pseudo-element*, and
 * a pseudo-element cannot be reached from a component's class list or given
 * an inline style. So the percentage is published as `--slider-fill` on the
 * input, and the rule in globals.css builds the hard-stop gradient from it.
 * Colours come from theme tokens, so the control follows light and dark with
 * no JavaScript.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, valueText, fillPercent, style, ...props }, ref) => {
    const clampedFill = typeof fillPercent === 'number' ? Math.min(100, Math.max(0, fillPercent)) : 0;

    const trackStyle = {
      ...style,
      '--slider-fill': `${clampedFill}%`,
    } as CSSProperties;

    return (
      <input
        ref={ref}
        type="range"
        aria-valuetext={valueText}
        style={trackStyle}
        className={cn(
          /* 44px of draggable height. The visible track is drawn inside it. */
          'slider-control h-11 w-full cursor-pointer appearance-none bg-transparent',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          className
        )}
        {...props}
      />
    );
  }
);

Slider.displayName = 'Slider';
