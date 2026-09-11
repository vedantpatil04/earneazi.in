import { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Field — Phase 0 §17 and §29.
 *
 * The wiring every form control on this site needs, done once. A caller
 * supplies the control through a render prop and receives the ids and ARIA
 * attributes already resolved, so no screen can forget to link an error
 * message or mark a control invalid.
 *
 *   <Field label="Monthly amount" helper="Minimum ₹500" error={error}>
 *     {(field) => <Input {...field} inputMode="numeric" />}
 *   </Field>
 *
 * What it guarantees:
 *   · a real `<label>` with `htmlFor` — never a placeholder doing the job
 *     of a label, which disappears the moment someone types;
 *   · helper and error text linked through `aria-describedby`, both at once
 *     when both are present;
 *   · `aria-invalid` set from the error, and an error message that is a
 *     live region so it is announced when it appears after a blur;
 *   · `aria-required` mirrored from `required`, because the visual asterisk
 *     is decoration and announces nothing on its own.
 *
 * Input sizing lives on the controls (Input/Textarea/Select): 48px minimum
 * height and a 16px minimum font size, which is what stops iOS Safari
 * zooming the viewport on focus.
 */

export interface FieldRenderProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': boolean | undefined;
  'aria-required': boolean | undefined;
  required: boolean | undefined;
}

interface FieldProps {
  label: ReactNode;
  children: (field: FieldRenderProps) => ReactNode;
  /** Guidance shown before there is anything wrong. Stays visible alongside an error. */
  helper?: ReactNode;
  /** Present means invalid. An empty string is treated as no error. */
  error?: string | null;
  required?: boolean;
  /** Hide the label visually but keep it for assistive tech. Use sparingly. */
  labelHidden?: boolean;
  /** Rendered at the end of the label row — a unit, a count, a reset link. */
  labelAction?: ReactNode;
  className?: string;
  /** Override the generated id, e.g. to match an existing form schema key. */
  id?: string;
}

export function Field({
  label,
  children,
  helper,
  error,
  required,
  labelHidden = false,
  labelAction,
  className,
  id: idOverride,
}: FieldProps) {
  const generatedId = useId();
  const id = idOverride ?? `field-${generatedId}`;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  // Both are listed when both exist — helper first, because it is context
  // for the error that follows.
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('flex items-baseline justify-between gap-3', labelHidden && 'sr-only')}>
        <label htmlFor={id} className="text-body-sm font-semibold text-ink">
          {label}
          {required && (
            <span className="ml-1 text-error" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {labelAction && <span className="text-body-sm text-ink-muted">{labelAction}</span>}
      </div>

      <div className={cn(!labelHidden && 'mt-2')}>
        {children({
          id,
          'aria-describedby': describedBy,
          'aria-invalid': error ? true : undefined,
          'aria-required': required || undefined,
          required: required || undefined,
        })}
      </div>

      {helper && (
        <p id={helperId} className="mt-2 text-body-sm text-ink-muted">
          {helper}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="mt-2 flex items-start gap-1.5 text-body-sm font-medium text-error">
          {/* Not colour alone: the marker carries the same message as the hue. */}
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
