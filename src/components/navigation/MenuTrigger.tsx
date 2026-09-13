import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface MenuTriggerProps {
  open: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * The mobile menu button — Phase 0 §16.
 *
 * 48×48, always labelled, and it morphs between the two icons rather than
 * swapping them: the two bars rotate into a cross over 200ms. A swap would
 * be cheaper, but the morph is what tells you the button you just pressed
 * is the same button that will close the sheet.
 *
 * Built from two spans rather than two lucide icons so the morph is one
 * continuous transform on two elements — crossfading two SVGs produces a
 * visible double image at the halfway point.
 *
 * A raised round surface (Enhancement A), matching the switch and the
 * navigation pill it sits beside.
 *
 * The label changes with the state, so the accessible name is always the
 * action rather than the object.
 */
export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(({ open, onClick, className }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    aria-label={open ? 'Close menu' : 'Open menu'}
    aria-haspopup="dialog"
    aria-expanded={open}
    aria-controls="mobile-nav-panel"
    className={cn(
      'raised relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-pill border border-divider bg-surface',
      'text-ink transition-[background-color,border-color] motion-safe:duration-instant ease-out',
      'hover:border-border active:bg-pressed',
      className
    )}
  >
    <span aria-hidden="true" className="relative block h-4 w-5">
      <span
        className={cn(
          'absolute left-0 block h-0.5 w-5 rounded-pill bg-current',
          'transition-transform motion-safe:duration-fast ease-move',
          open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0.5'
        )}
      />
      <span
        className={cn(
          'absolute left-0 block h-0.5 rounded-pill bg-current',
          'transition-[transform,width] motion-safe:duration-fast ease-move',
          open ? 'top-1/2 w-5 -translate-y-1/2 -rotate-45' : 'bottom-0.5 w-3.5'
        )}
      />
    </span>
  </button>
));

MenuTrigger.displayName = 'MenuTrigger';
