import { useId } from 'react';
import { Label } from '@/components/ui/Label';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/lib/utils/cn';
import type { SipFieldLimits } from '@/lib/finance';

interface SipInputControlProps {
  label: string;
  /** Raw text, so a half-typed value survives re-render instead of being rewritten under the cursor. */
  value: string;
  /** The last valid number, used to position the slider even while the text field holds something unusable. */
  numericValue: number;
  limits: SipFieldLimits;
  onChange: (nextValue: string) => void;
  /** ₹ before the field, % or "years" after it. */
  prefix?: string;
  suffix?: string;
  /** Announced by the slider instead of the bare number — "₹5,000 per month" reads better than "5000". */
  valueText: string;
  /** Endpoint captions under the track. */
  minLabel: string;
  maxLabel: string;
  errorMessage?: string;
  /** Sentence explaining what the field means, tied to the input via aria-describedby. */
  hint?: string;
  /**
   * Rewrites the field's text once it loses focus — "5000" becomes "5,000".
   * Applied on blur rather than on every keystroke, because reformatting
   * mid-typing moves the caret out from under the person's cursor.
   */
  formatOnBlur?: (numericValue: number) => string;
}

/**
 * One labelled figure with two ways to set it: type an exact amount, or
 * drag. Both write to the same state, so they can never disagree.
 *
 * The text field is the primary control and the slider is the convenience
 * one, not the other way round — nobody should have to drag a slider to
 * reach ₹7,500. Both share the same `min`/`max` as the calculation engine,
 * so neither can produce a value the engine would reject.
 */
export function SipInputControl({
  label,
  value,
  numericValue,
  limits,
  onChange,
  prefix,
  suffix,
  valueText,
  minLabel,
  maxLabel,
  errorMessage,
  hint,
  formatOnBlur,
}: SipInputControlProps) {
  const inputId = useId();
  const sliderId = useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy = [hint ? hintId : null, errorMessage ? errorId : null].filter(Boolean).join(' ') || undefined;
  const fillPercent = ((numericValue - limits.min) / (limits.max - limits.min)) * 100;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label htmlFor={inputId} className="text-body font-medium text-ink">
          {label}
        </Label>

        <div
          className={cn(
            'inline-flex items-center rounded-md border bg-surface transition-colors motion-safe:duration-200',
            'focus-within:border-accent',
            errorMessage ? 'border-error' : 'border-border'
          )}
        >
          {prefix && (
            <span aria-hidden="true" className="pl-3 text-body text-ink-secondary">
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            /* `inputMode="decimal"` rather than type="number": it still
               raises the numeric keypad on iOS and Android, but without
               type=number's scroll-wheel value changes and silent rejection
               of intermediate text. Validation is ours either way. */
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={() => {
              if (formatOnBlur && !errorMessage) onChange(formatOnBlur(numericValue));
            }}
            aria-describedby={describedBy}
            aria-invalid={Boolean(errorMessage)}
            className={cn(
              'h-12 w-28 bg-transparent px-2 text-right font-numeric text-body-lg font-medium text-ink',
              'focus:outline-none sm:w-32'
            )}
          />
          {suffix && (
            <span aria-hidden="true" className="pr-3 text-body text-ink-secondary">
              {suffix}
            </span>
          )}
        </div>
      </div>

      {hint && (
        <p id={hintId} className="text-small text-ink-muted">
          {hint}
        </p>
      )}

      <div className="pt-1">
        <Slider
          id={sliderId}
          aria-label={`${label} slider`}
          min={limits.min}
          max={limits.max}
          step={limits.step}
          value={numericValue}
          valueText={valueText}
          fillPercent={fillPercent}
          onChange={(event) => onChange(event.target.value)}
        />
        <div className="mt-2 flex justify-between font-mono text-marker text-ink-muted">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>

      {errorMessage && (
        <p id={errorId} role="alert" className="text-small text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
