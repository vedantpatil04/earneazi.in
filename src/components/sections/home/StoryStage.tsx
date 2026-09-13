import { useRef } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
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
 *   StoryHeadings   the stacked layout's numbered headings: a vertical list
 *                   pinned under the site header, its marker gliding with the
 *                   scroll, the dominant row's own progress and the sequence
 *                   rule beneath. Desktop keeps each section's own left column.
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

/** One row, in rem, so the marker's glide matches the rows at any text size. */
const ROW_REM = 2.25;

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
  const marker = useRef<HTMLSpanElement>(null);
  const rule = useRef<HTMLSpanElement>(null);
  const step = useRef<HTMLSpanElement>(null);
  const active = items[story.dominant];
  const choose = onChoose ?? story.select;

  useStoryFrame(story, (frame) => {
    if (marker.current) marker.current.style.transform = `translate3d(0, ${(frame.marker * ROW_REM).toFixed(3)}rem, 0)`;
    if (rule.current) rule.current.style.transform = `scaleX(${frame.overall.toFixed(4)})`;
    if (step.current) step.current.style.transform = `scaleX(${frame.step.toFixed(4)})`;
  });

  return (
    <div
      ref={story.registerBar}
      className={cn('sticky z-10 -mx-gutter px-gutter pb-3 pt-2', ground === 'sunken' ? 'bg-surface-sunken' : 'bg-bg')}
      style={{ top: 'var(--header-height)' }}
    >
      <nav aria-label={label}>
        <ol className="relative">
          <span
            ref={marker}
            aria-hidden="true"
            data-tone={active.id}
            className="pointer-events-none absolute left-0 top-1.5 h-6 w-[3px] rounded-pill bg-tone transition-colors duration-slow ease-out"
          />
          {items.map((item, index) => {
            const isActive = index === story.dominant;
            return (
              <li key={item.id} data-tone={item.id}>
                <button
                  type="button"
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => choose(index)}
                  className={cn(
                    'flex h-9 w-full items-center gap-3 rounded-action pl-4 pr-1 text-left',
                    'transition-colors duration-base ease-out',
                    isActive ? 'text-ink-display' : 'text-ink-muted hover:text-ink'
                  )}
                >
                  <span
                    className={cn(
                      'w-6 shrink-0 font-display text-legal font-semibold tabular transition-colors duration-base ease-out',
                      isActive ? 'text-tone' : 'text-ink-muted'
                    )}
                  >
                    {pad(index + 1)}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-display text-body-sm font-semibold">{item.title}</span>
                  <span
                    aria-hidden="true"
                    className={cn('relative h-[3px] w-12 shrink-0 overflow-hidden rounded-pill bg-divider', !isActive && 'invisible')}
                  >
                    {isActive && (
                      <span
                        ref={step}
                        className="absolute inset-0 origin-left rounded-pill bg-tone"
                        style={{ transform: 'scaleX(0)' }}
                      />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div aria-hidden="true" className="relative mt-2 h-px w-full overflow-hidden bg-divider">
          <span
            ref={rule}
            data-tone={active.id}
            className="absolute inset-0 origin-left bg-tone transition-colors duration-slow ease-out"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </nav>

      <p aria-live="polite" className="sr-only">
        {`${noun} ${story.dominant + 1} of ${items.length}: ${active.title}`}
      </p>
    </div>
  );
}
