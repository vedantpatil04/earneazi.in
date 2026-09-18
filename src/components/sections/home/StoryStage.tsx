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
    <div
      ref={story.registerTrack}
      className={cn('pointer-events-none relative', className)}
      style={geometry ? { height: geometry.trackHeight } : undefined}
    >
      {/* The stage: one pinned window every card starts in, from the anchor to
          the foot of the screen. Stably anchored with no clipping. */}
      <div
        ref={story.registerStage}
        className={cn('w-full', geometry && 'sticky')}
        style={geometry ? { top: geometry.anchor, height: geometry.stageHeight } : undefined}
      >
        <div className="grid w-full">
          {Array.from({ length: count }, (_, index) => (
            <div
              key={index}
              ref={story.registerPanel(index)}
              aria-hidden={index === dominant ? undefined : true}
              className={cn(
                'col-start-1 row-start-1 origin-top self-start w-full',
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
   THE STACKED HEADINGS (Mobile vertical story)
   ═══════════════════════════════════════════════════════════════════════ */

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
  const rule = useRef<HTMLSpanElement>(null);
  const headingsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { dominant } = story;
  const active = items[dominant] ?? items[0];
  const choose = onChoose ?? story.select;

  useStoryFrame(story, (frame) => {
    if (rule.current) rule.current.style.transform = `scaleX(${frame.overall.toFixed(4)})`;
    frame.opacities.forEach((opacity, index) => {
      const el = headingsRef.current[index];
      if (!el) return;
      el.style.opacity = opacity.toFixed(3);
      el.style.visibility = opacity < 0.005 ? 'hidden' : 'visible';
    });
  });

  return (
    <div
      ref={story.registerBar}
      className={cn('sticky z-20 pb-3 pt-2', ground === 'sunken' ? 'bg-surface-sunken' : 'bg-bg')}
      style={{ top: 'var(--header-height)' }}
    >
      <nav aria-label={label} className="w-full">
        {/* Step dots / chapter pills row: completely non-scrolling, fits full width without horizontal swipe */}
        <div className="flex items-center justify-between gap-1.5 pb-2">
          <div className="flex items-center gap-1.5" role="tablist" aria-label={`${label} steps`}>
            {items.map((item, index) => {
              const isActive = index === dominant;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-tone={item.id}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`${noun} ${index + 1}: ${item.title}`}
                  onClick={() => choose(index)}
                  className={cn(
                    'h-2 rounded-pill transition-[width,background-color] duration-base ease-out',
                    isActive ? 'w-8 bg-tone' : 'w-2.5 bg-divider hover:bg-border'
                  )}
                />
              );
            })}
          </div>
          <span className="font-display text-legal font-semibold tabular text-ink-muted">
            {pad(dominant + 1)} <span aria-hidden="true">/</span> {pad(items.length)}
          </span>
        </div>

        {/* Active heading: stacked crossfade, one active state at a time */}
        <div className="relative grid min-h-[3rem] items-center">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                ref={(node) => {
                  headingsRef.current[index] = node;
                }}
                data-tone={item.id}
                className={cn(
                  'col-start-1 row-start-1 flex items-center gap-2.5 transition-colors duration-slow ease-out',
                  index > 0 && 'invisible opacity-0'
                )}
              >
                <span className="lit lit-tone inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-surface bg-tone-fill text-on-tone">
                  <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block font-display text-legal font-semibold uppercase tracking-[0.12em] text-tone">
                    {noun} {pad(index + 1)}
                  </span>
                  <h3 className="truncate font-display text-title-sm font-semibold text-ink-display">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continuous progress meter underneath */}
        <div aria-hidden="true" className="relative mt-2 h-0.5 overflow-hidden rounded-pill bg-divider">
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

/* ═══════════════════════════════════════════════════════════════════════
   VERTICAL ITEM NAVIGATION (Mobile)
   SECTION TITLE
   ↓
   VERTICAL ITEM NAVIGATION (01, 02, 03...)
   ↓
   ACTIVE STORY SCENE
   ═══════════════════════════════════════════════════════════════════════ */

export function StoryNavVertical({
  story,
  items,
  label,
  noun,
  onChoose,
}: {
  story: ScrollStory;
  items: StoryItem[];
  label: string;
  noun: string;
  onChoose?: (index: number) => void;
}) {
  const { dominant } = story;
  const choose = onChoose ?? story.select;

  return (
    <nav aria-label={label} className="mb-6 w-full">
      <ol className="flex flex-col gap-2">
        {items.map((item, index) => {
          const isActive = index === dominant;
          const Icon = item.icon;
          return (
            <li key={item.id} data-tone={item.id}>
              <button
                type="button"
                aria-current={isActive ? 'step' : undefined}
                onClick={() => choose(index)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-base ease-out',
                  isActive
                    ? 'border-tone/40 bg-tone-tint text-ink-display shadow-sm'
                    : 'border-divider/70 bg-surface/60 text-ink-secondary hover:border-border hover:text-ink'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      'font-display text-legal font-semibold tabular transition-colors duration-base',
                      isActive ? 'text-tone' : 'text-ink-muted'
                    )}
                  >
                    {pad(index + 1)}
                  </span>
                  <span className="truncate font-display text-body-sm font-semibold">
                    {item.title}
                  </span>
                </div>
                <span
                  className={cn(
                    'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-base',
                    isActive ? 'lit lit-tone bg-tone-fill text-on-tone' : 'text-ink-muted'
                  )}
                >
                  <Icon size={14} strokeWidth={isActive ? 2 : 1.5} aria-hidden="true" />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p aria-live="polite" className="sr-only">
        {`${noun} ${dominant + 1} of ${items.length}: ${items[dominant]?.title}`}
      </p>
    </nav>
  );
}

