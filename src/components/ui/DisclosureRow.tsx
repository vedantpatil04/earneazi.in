import { useId } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { IconTile } from './IconTile';
import { cn } from '@/lib/utils/cn';

/**
 * DisclosureRow — Phase 0 §17 and §21.
 *
 * One row of an accordion: a trigger and a panel that opens beneath it. Used
 * by Services now and by the FAQ later, so the two share one interaction
 * model rather than each inventing its own.
 *
 * ── Why the panel is never unmounted ─────────────────────────────────────
 * §21 requires the panel's content to be in the DOM at all times, so a
 * crawler reads all three services rather than only the open one. That rules
 * out conditional rendering, which in turn rules out animating a measured
 * height — you cannot measure what has not rendered.
 *
 * So the panel is always rendered and the open state is a CSS grid whose
 * single row animates between `0fr` and `1fr`. That transitions smoothly
 * without JavaScript measuring anything, survives content of any height, and
 * needs no ResizeObserver.
 *
 * Closed, the panel also takes `inert`: present for a crawler, absent from
 * the accessibility tree and unreachable by Tab, which is what the ARIA
 * accordion pattern asks for. `inert` is spread rather than written as a JSX
 * prop because React 18 does not recognise it as a DOM property and would
 * drop it. (React 19 accepts it directly.)
 *
 * ── Motion ───────────────────────────────────────────────────────────────
 * The panel opens on `ease-move` over `dur-base` — a position change between
 * two known states, which is what that easing is for. The inner content does
 * not stagger: staggering inside an accordion delays the reading of content
 * the reader has just asked for. The icon tile changes fill on open, and
 * nothing lifts on hover (§18.3).
 */

interface DisclosureRowProps {
  id: string;
  open: boolean;
  onToggle: () => void;
  title: string;
  /** One clause, visible whether the row is open or shut, so all rows stay comparable. */
  summary?: string;
  icon?: LucideIcon;
  children: ReactNode;
  /** Heading level for the trigger's wrapper, so the page keeps a sane outline. */
  headingLevel?: 'h2' | 'h3' | 'h4';
  className?: string;
}

export function DisclosureRow({
  id,
  open,
  onToggle,
  title,
  summary,
  icon,
  children,
  headingLevel: Heading = 'h3',
  className,
}: DisclosureRowProps) {
  const generated = useId();
  const triggerId = `disclosure-trigger-${id}-${generated}`;
  const panelId = `disclosure-panel-${id}-${generated}`;

  return (
    <div
      className={cn(
        'relative border-b border-divider',
        // The open row lifts onto its own surface. Depth by surface change
        // rather than by shadow, so it reads the same on paper and on ink.
        'transition-colors motion-safe:duration-base ease-out',
        open && 'bg-surface',
        className
      )}
    >
      {/* A brand rule down the open row's leading edge. It marks which row is
          open without relying on colour alone — the surface changes too. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-y-0 left-0 w-0.5 origin-top bg-brand',
          'transition-transform motion-safe:duration-base ease-move',
          open ? 'scale-y-100' : 'scale-y-0'
        )}
      />

      <Heading>
        <button
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            // §21: rows are at least 64px tall, and the whole row is the
            // target — the plus/minus is a sign, not a second button.
            'group flex w-full items-center gap-4 rounded-action px-4 py-6 text-left md:gap-6 md:px-6 md:py-8',
            'min-h-16 transition-colors motion-safe:duration-instant ease-out',
            'hover:bg-hovered/60'
          )}
        >
          {icon && <IconTile icon={icon} size="lg" fill={open ? 'solid' : 'neutral'} />}

          <span className="min-w-0 flex-1">
            <span
              className={cn(
                'block font-display text-title-lg transition-colors motion-safe:duration-instant ease-out',
                open ? 'text-ink-display' : 'text-ink group-hover:text-ink-display'
              )}
            >
              {title}
            </span>
            {summary && <span className="mt-1.5 block text-body-sm text-ink-muted">{summary}</span>}
          </span>

          <span
            aria-hidden="true"
            className={cn(
              'relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border',
              'transition-colors motion-safe:duration-fast ease-out',
              open ? 'border-brand/50 text-brand-ink' : 'border-divider text-ink-muted group-hover:border-border'
            )}
          >
            {/* Two rules that rotate into a plus and back, rather than two
                icons swapped — a swap flickers at the halfway point. */}
            <span className="absolute h-px w-3.5 rounded-pill bg-current" />
            <span
              className={cn(
                'absolute h-px w-3.5 rounded-pill bg-current',
                'transition-transform motion-safe:duration-fast ease-move',
                open ? 'rotate-0' : 'rotate-90'
              )}
            />
          </span>
        </button>
      </Heading>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        {...(open ? {} : { inert: '' })}
        className={cn(
          'grid transition-[grid-template-rows] motion-safe:duration-base ease-move',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'px-4 pb-8 md:px-6 md:pb-10',
              // Opacity trails the height slightly so the content does not
              // appear before there is room for it.
              'transition-opacity motion-safe:duration-base ease-out',
              open ? 'opacity-100' : 'opacity-0'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
