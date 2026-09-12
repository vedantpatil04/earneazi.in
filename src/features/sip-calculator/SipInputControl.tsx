import { useId } from 'react';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/lib/utils/cn';
import type { SipFieldLimits } from '@/lib/finance';

interface SipInputControlProps {
  label: string;
  /** Raw text, so a half-typed value survives re-render instead of being rewritten under the cursor. */
  value: string;
  /** The last valid number. Positions the slider even while the text field holds something unusable. */
  numericValue: number;
  limits: SipFieldLimits;
  onChange: (nextValue: string) => void;
  /** Slider movement, which always lands on a number already inside the bounds. */
  onSlide: (nextValue: number) => void;
  /** Blur — the engine clamps and normalises the text (§23.2). */
  onCommit: () => void;
  /** ₹ before the field, % or "years" after it. */
  prefix?: string;
  suffix?: string;
  /** Announced by the slider instead of the bare number — "₹5,000 per month" reads better than "5000". */
  valueText: string;
  /** Endpoint captions under the track. */
  minLabel: string;
  maxLabel: string;
  errorMessage?: string;
  /** One sentence explaining what the field means, tied to the input via aria-describedby. */
  hint?: string;
  /** Compact spacing and a smaller field, for the homepage panel. */
  density?: 'comfortable' | 'compact';
}

/**
 * One figure, two ways to set it: type an exact amount, or drag.
 *
 * Both write to the same state, so they can never disagree, and both are
 * bounded by the same limits the engine validates against, so neither can
 * offer a value the calculation would reject.
 *
 * ── Which one is primary ────────────────────────────────────────────────
 *
 * The text field is. Nobody should have to drag a slider to reach ₹7,500,
 * and on a 40-year track a single pixel is worth about four months. The
 * slider is the fast, approximate instrument; the field is the exact one.
 *
 * ── Typing, and being allowed to finish ─────────────────────────────────
 *
 * `inputMode="decimal"` rather than `type="number"`: it still raises the
 * numeric keypad on iOS and Android, but without `type=number`'s scroll-wheel
 * value changes and its silent rejection of intermediate text. Validation is
 * ours either way.
 *
 * Nothing is clamped or reformatted while the field has focus (§23.2).
 * Typing "1" on the way to "15" would otherwise be rewritten to the minimum
 * under the cursor. The correction happens on blur, where it reads as the
 * field tidying up rather than as the field fighting back.
 */
export function SipInputControl({
  label,
  value,
  numericValue,
  limits,
  onChange,
  onSlide,
  onCommit,
  prefix,
  suffix,
  valueText,
  minLabel,
  maxLabel,
  errorMessage,
  hint,
  density = 'comfortable',
}: SipInputControlProps) {
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const compact = density === 'compact';

  const describedBy = [hint && !compact ? hintId : null, errorMessage ? errorId : null].filter(Boolean).join(' ');
  const fillPercent = ((numericValue - limits.min) / (limits.max - limits.min)) * 100;

  return (
    <div className={cn('flex flex-col', compact ? 'gap-1.5' : 'gap-2.5')}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label
          htmlFor={inputId}
          className={cn('font-display font-semibold text-ink', compact ? 'text-body-sm' : 'text-title-sm')}
        >
          {label}
        </label>

        {/*
          The field is styled as one object with its prefix and suffix, and
          the focus ring is drawn on that object rather than on the bare
          input — otherwise the ring appears around the digits and leaves the
          ₹ outside it.
        */}
        <div
          className={cn(
            'inline-flex items-center rounded-action border bg-surface',
            'transition-[border-color,box-shadow] duration-instant ease-out',
            'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus',
            errorMessage ? 'border-error' : 'border-border focus-within:border-brand'
          )}
        >
          {prefix && (
            <span aria-hidden="true" className={cn('ps-3 text-ink-secondary', compact ? 'text-body-sm' : 'text-body')}>
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onCommit}
            aria-describedby={describedBy || undefined}
            aria-invalid={errorMessage ? true : undefined}
            className={cn(
              'bg-transparent px-2 text-right font-display font-semibold tabular text-ink',
              'focus:outline-none',
              compact ? 'h-11 w-24 text-body' : 'h-12 w-28 text-body-lg sm:w-32'
            )}
          />
          {suffix && (
            <span aria-hidden="true" className={cn('pe-3 text-ink-secondary', compact ? 'text-body-sm' : 'text-body')}>
              {suffix}
            </span>
          )}
        </div>
      </div>

      {hint && !compact && (
        <p id={hintId} className="max-w-prose text-body-sm text-ink-muted">
          {hint}
        </p>
      )}

      <div className={compact ? '' : 'pt-1'}>
        <Slider
          aria-label={`${label} slider`}
          min={limits.min}
          max={limits.max}
          step={limits.step}
          value={numericValue}
          valueText={valueText}
          fillPercent={fillPercent}
          onChange={(event) => onSlide(Number(event.target.value))}
        />
        {/* The endpoints, so the track has a scale without needing a tooltip.
            Hidden from assistive technology: the slider already reports its
            own min and max, and repeating them is noise. */}
        <div aria-hidden="true" className="mt-1 flex justify-between font-display text-legal tabular text-ink-muted">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>

      {errorMessage && (
        <p id={errorId} role="alert" className="text-body-sm font-medium text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
