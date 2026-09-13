import { useId } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { IconTile } from './IconTile';
import { cn } from '@/lib/utils/cn';

/**
 * DisclosureRow — Phase 0 §17, §21 and §26.
 *
 * One row of an accordion: a trigger and a panel that opens beneath it. The
 * FAQ and the footer's mobile navigation both use it, so the site has one
 * disclosure interaction model rather than one per section (§26).
 *
 * ── Why the panel is never unmounted ─────────────────────────────────────
 * §21 requires the panel's content to be in the DOM at all times, so a
 * crawler reads every answer rather than only the open one. On the FAQ that
 * is also what keeps the page honest to its structured data: the FAQPage
 * JSON-LD lists every answer, so every answer has to actually be on the page.
 * That rules out conditional rendering, which in turn rules out animating a
 * measured height — you cannot measure what has not rendered.
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
 * the reader has just asked for. The icon's two rules rotate into a plus and
 * back, and nothing lifts on hover (§18.3). Under reduced motion the global
 * safety net collapses every one of these transitions to an instant swap.
 *
 * ── Phase 6 additions ────────────────────────────────────────────────────
 * `anchorId`  a stable id on the row itself, so a question can be deep
 *             linked (`/faq#can-i-stop`). The trigger and panel ids stay
 *             generated; the anchor is the one id a URL may depend on.
 * `tone`      `footer` swaps the hairlines and hover surface for the
 *             footer's own tinted ground, where the default divider colour
 *             would be all but invisible.
 * `density`   `compact` for the footer's mobile groups: 44px triggers,
 *             body-size titles, tighter panel padding.
 * The trigger also carries `data-disclosure-trigger`, which is how a list
 * of rows implements arrow-key movement between triggers without every row
 * having to know about its neighbours.
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
  /** Stable id on the row — the target of a deep link. */
  anchorId?: string;
  /** `footer` for rows sitting on the footer's tinted ground. */
  tone?: 'default' | 'footer';
  /** `compact` for dense lists such as the footer's mobile navigation. */
  density?: 'default' | 'compact';
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
  anchorId,
  tone = 'default',
  density = 'default',
}: DisclosureRowProps) {
  const generated = useId();
  const triggerId = `disclosure-trigger-${id}-${generated}`;
  const panelId = `disclosure-panel-${id}-${generated}`;
  const onFooter = tone === 'footer';
  const compact = density === 'compact';

  return (
    <div
      id={anchorId}
      className={cn(
        'relative border-b',
        'transition-colors motion-safe:duration-base ease-out',
        onFooter ? 'border-footer-line' : 'border-divider',
        // The open row lifts onto its own surface, raised over the rows
        // beneath it (Enhancement A). On the footer's tinted ground the lift
        // is a surface change alone — a shadow there would crowd the links.
        open && (onFooter ? 'bg-surface/70' : 'raised z-[1] bg-surface'),
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
          data-disclosure-trigger=""
          className={cn(
            // §21: the whole row is the target — the plus/minus is a sign,
            // not a second button. Default rows are at least 64px tall;
            // compact rows still clear the 44px touch minimum.
            'group flex w-full items-center rounded-action text-left',
            'transition-colors motion-safe:duration-instant ease-out',
            compact ? 'min-h-11 gap-3 px-3 py-1.5' : 'min-h-16 gap-4 px-4 py-6 md:gap-6 md:px-6 md:py-8',
            onFooter ? 'hover:bg-surface/60' : 'hover:bg-hovered/60'
          )}
        >
          {icon && <IconTile icon={icon} size="lg" fill={open ? 'solid' : 'neutral'} />}

          <span className="min-w-0 flex-1">
            <span
              className={cn(
                'block font-display transition-colors motion-safe:duration-instant ease-out',
                compact ? 'text-body font-semibold' : 'text-title-lg',
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
              'relative inline-flex shrink-0 items-center justify-center rounded-pill border',
              compact ? 'h-8 w-8' : 'h-9 w-9',
              'transition-[background-color,border-color,color,box-shadow] motion-safe:duration-fast ease-out',
              /* Open, the sign lights; closed, it rests on the row. The
                 surface changes as well as the colour. */
              open
                ? 'lit border-transparent bg-brand text-on-brand'
                : 'edge-top border-divider bg-surface text-ink-muted group-hover:border-border group-hover:text-ink'
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
              compact ? 'px-3 pb-4' : 'px-4 pb-8 md:px-6 md:pb-10',
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
