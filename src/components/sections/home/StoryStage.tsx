import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useStoryFrame } from '@/hooks/useScrollStory';
import type { ScrollStory } from '@/hooks/useScrollStory';
import { cn } from '@/lib/utils/cn';

/**
 * The two pieces the Services and Financial Goals story share
 * (hooks/useScrollStory.ts explains the scroll geometry).
 *
 *   StoryTrack      the cards: one pinned stage at a fixed anchor with every
 *                   card stacked inside it, so each state starts in the same
 *                   place and the next is revealed there as the scroll moves
 *                   on. Desktop's right column; below the headings on smaller
 *                   screens.
 *
 *   StoryHeadings   the stacked layout's numbered headings: one row of chips
 *                   pinned under the site header, the one being read tinted
 *                   in its accent and carrying its own progress, with the
 *                   sequence rule beneath. Desktop keeps each section's own
 *                   left column.
 */

export interface StoryItem {
  /** Also the subject tone (`data-tone`) the item wears. */
  id: string;
  title: string;
  icon: LucideIcon;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/* ═══════════════════════════════════════════════════════════════════════
   THE TRACK
   ═══════════════════════════════════════════════════════════════════════ */

interface StoryTrackProps {
  story: ScrollStory;
  count: number;
  renderPanel: (index: number) => ReactNode;
  className?: string;
}

export function StoryTrack({ story, count, renderPanel, className }: StoryTrackProps) {
  const { geometry, dominant } = story;

  return (
    /*
      The wrappers overlap and are transparent, so only the dominant panel
      takes pointer input — a fading panel, or the empty part of a wrapper,
      never sits over the button the reader is about to press. No `overflow`
      or `z-index` here or above: the panels pin.
    */
    <div
      ref={story.registerTrack}
      className={cn('pointer-events-none relative', className)}
      style={geometry ? { height: geometry.trackHeight } : undefined}
    >
      {/* The stage: one pinned window every card starts in, from the anchor to
          the foot of the screen. It clips top and bottom only, so the cards'
          shadows still show at the sides. */}
      <div
        ref={story.registerStage}
        className={cn('[clip-path:inset(0_-3rem)]', geometry && 'sticky')}
        style={geometry ? { top: geometry.anchor, height: geometry.stageHeight } : undefined}
      >
        <div className="grid">
          {Array.from({ length: count }, (_, index) => (
            <div
              key={index}
              ref={story.registerPanel(index)}
              aria-hidden={index === dominant ? undefined : true}
              className={cn(
                'col-start-1 row-start-1 origin-top self-start',
                index === dominant ? 'pointer-events-auto' : 'pointer-events-none',
                /* The first paint, before the scroll is read: only the first
                   panel shows. Inline styles written from the scroll take over. */
                index > 0 && 'invisible opacity-0'
              )}
            >
              {renderPanel(index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   THE STACKED HEADINGS
   ═══════════════════════════════════════════════════════════════════════ */

/*
  One row, not a list. Six stacked rows came to 245px — a third of a phone's
  screen pinned over the card they index, which left the card a letterbox to
  be read through, and each row was a 36px target. A row of 44px chips is
  ~80px and the stage gets the rest. It is the site's designed scroller
  (`rail-x` in globals.css) where the titles do not fit, and it keeps the chip
  being read in view.
*/

interface StoryHeadingsProps {
  story: ScrollStory;
  items: StoryItem[];
  /** Names the list for assistive technology. */
  label: string;
  /** The singular noun announced with a change — "Service", "Goal". */
  noun: string;
  /** The section's ground, so the pinned headings mask what scrolls beneath them. */
  ground: 'bg' | 'sunken';
  /** Called instead of the story's own `select` when a heading is chosen. */
  onChoose?: (index: number) => void;
}

export function StoryHeadings({ story, items, label, noun, ground, onChoose }: StoryHeadingsProps) {
  const rail = useRef<HTMLOListElement>(null);
  const rule = useRef<HTMLSpanElement>(null);
  const step = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { dominant } = story;
  const active = items[dominant];
  const choose = onChoose ?? story.select;

  useStoryFrame(story, (frame) => {
    if (rule.current) rule.current.style.transform = `scaleX(${frame.overall.toFixed(4)})`;
    if (step.current) step.current.style.transform = `scaleX(${frame.step.toFixed(4)})`;
  });

  /*
    Bring the chip being read into view when the story moves on. The rail's
    own scroll is set directly: `scrollIntoView` would also scroll the page,
    and the page's scroll is what is driving the story.
  */
  useEffect(() => {
    const row = rail.current;
    const chip = row?.children[dominant];
    if (!row || !(chip instanceof HTMLElement) || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({
      left: Math.max(0, chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [dominant, prefersReducedMotion]);

  return (
    <div
      ref={story.registerBar}
      className={cn('sticky z-10 -mx-gutter pb-3 pt-2', ground === 'sunken' ? 'bg-surface-sunken' : 'bg-bg')}
      style={{ top: 'var(--header-height)' }}
    >
      <nav aria-label={label}>
        {/* `py-1` is the room a focus ring needs inside a scroller, which
            clips at its padding edge. */}
        <ol ref={rail} className="rail-x rail-fade relative gap-2 scroll-px-gutter px-gutter py-1">
          {items.map((item, index) => {
            const isActive = index === dominant;
            return (
              <li key={item.id} data-tone={item.id} className="shrink-0">
                <button
                  type="button"
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => choose(index)}
                  className={cn(
                    'relative flex h-11 items-center gap-2 overflow-hidden rounded-pill border px-4',
                    'transition-[background-color,border-color,color] duration-base ease-out',
                    isActive
                      ? 'border-tone/40 bg-tone-tint text-ink-display'
                      : 'border-divider bg-surface text-ink-muted hover:border-border hover:text-ink'
                  )}
                >
                  <span
                    className={cn(
                      'font-display text-legal font-semibold tabular transition-colors duration-base ease-out',
                      isActive ? 'text-tone' : 'text-ink-muted'
                    )}
                  >
                    {pad(index + 1)}
                  </span>
                  <span className="whitespace-nowrap font-display text-body-sm font-semibold">{item.title}</span>
                  {/* The dominant item's own progress, along the foot of its chip. */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-4 bottom-1.5 h-0.5 overflow-hidden rounded-pill bg-tone/15"
                    >
                      <span
                        ref={step}
                        className="absolute inset-0 origin-left rounded-pill bg-tone"
                        style={{ transform: 'scaleX(0)' }}
                      />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        <div aria-hidden="true" className="relative mx-gutter mt-2 h-px overflow-hidden bg-divider">
          <span
            ref={rule}
            data-tone={active.id}
            className="absolute inset-0 origin-left bg-tone transition-colors duration-slow ease-out"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </nav>

      <p aria-live="polite" className="sr-only">
        {`${noun} ${dominant + 1} of ${items.length}: ${active.title}`}
      </p>
    </div>
  );
}
