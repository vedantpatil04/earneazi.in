/**
 * Shared styling for every text-entry control — Phase 0 §17 and §28.
 *
 * Kept in one string rather than repeated across Input, Textarea and Select
 * so the three cannot drift apart, and so the two non-negotiables below are
 * stated once:
 *
 *   · minimum 48px tall, which is the field height §17 specifies and which
 *     comfortably clears the 44px touch target;
 *   · 16px font size on mobile. Below 16px, iOS Safari zooms the viewport
 *     when the field takes focus and does not zoom back out. `text-base`
 *     is 16px, and `md:text-body` steps up with the fluid scale after that.
 *
 * Depth (Enhancement A): a field is a recessed well — the inset shadow from
 * the depth tokens — so an editable place reads as one you write *into*,
 * against the raised buttons that act on it. Focus brings the edge to the
 * brand colour alongside the global ring.
 *
 * States: default, hover, focus-visible (inherits the global ring), invalid,
 * disabled and read-only, in both themes.
 */
export const controlBase = [
  'w-full rounded-action border bg-surface text-ink shadow-inset-well',
  'text-base md:text-body',
  'placeholder:text-ink-muted',
  'transition-[border-color,background-color] motion-safe:duration-instant ease-out',
  'hover:border-border-strong',
  'focus-visible:border-brand',
  'read-only:bg-surface-sunken read-only:hover:border-border',
  'disabled:cursor-not-allowed disabled:bg-disabled disabled:text-ink-disabled disabled:border-disabled-border disabled:shadow-none',
  /* Invalid: a thicker, recoloured border rather than colour alone — the
     Field component pairs this with a text message and `aria-invalid`. */
  'aria-[invalid=true]:border-error aria-[invalid=true]:border-2',
].join(' ');

/** Height and padding for single-line controls. */
export const controlSizing = 'h-12 px-3.5';

/** Padding for multi-line controls, which size from their `rows`. */
export const controlSizingMultiline = 'min-h-[7.5rem] px-3.5 py-3';
