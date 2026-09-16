import { useEffect, useRef, useState } from 'react';
import type { FocusEvent } from 'react';
import { Link } from 'react-router-dom';
import { ribbonItems } from '@/data/nav';
import type { RibbonItem } from '@/types/nav';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils/cn';

/** Copies of the list inside the moving track. See the RIBBON block in globals.css. */
const TRACK_COPIES = 4;

/**
 * The information ribbon — Enhancement A.
 *
 * A slow band directly under the navigation bar, on every route, naming
 * what the site can do: the three services, the goals, the calculator, a
 * person. It is an index rather than a ticker — nothing in it changes, counts
 * or updates, and every entry is a real destination — so it is set like the
 * rest of the interface: each entry a lit icon in its subject's accent, a
 * title, a few words of orientation, and the brand's sphere between them.
 *
 * It sits in the document flow rather than inside the sticky header, so it
 * scrolls away with the page instead of moving in the corner of the reader's
 * eye for the length of every visit.
 *
 * ── Movement, and every way to stop it ──────────────────────────────────
 *
 *   hover, focus, a finger held down   paused, in CSS
 *   off screen                         paused, so nothing paints for a band
 *                                      nobody can see
 *   keyboard focus inside it           the track stops and becomes a normal
 *                                      scrollable rail, so a focused link is
 *                                      scrolled into view instead of sliding
 *                                      out from under its focus ring
 *   prefers-reduced-motion             never moves: one static, swipeable
 *                                      rail
 *
 * ── Accessibility ───────────────────────────────────────────────────────
 *
 * The track needs its content four times to loop without a seam. Only the
 * first copy is in the accessibility tree and the tab order; the others are
 * `aria-hidden` with their links removed from the tab sequence, so a screen
 * reader hears six destinations once.
 */
export function InfoRibbon() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(false);
  const [keyboardInside, setKeyboardInside] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* Leaving keyboard mode hands the rail back to the animation from its
     start; a scroll offset left behind would shift the whole loop. */
  useEffect(() => {
    if (!keyboardInside && viewportRef.current) viewportRef.current.scrollLeft = 0;
  }, [keyboardInside]);

  const moving = !prefersReducedMotion && !keyboardInside;

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    let fromKeyboard = true;
    try {
      fromKeyboard = (event.target as HTMLElement).matches(':focus-visible');
    } catch {
      /* An engine without :focus-visible — treat focus as keyboard focus,
         which errs toward the rail that always keeps the target in view. */
    }
    if (fromKeyboard) setKeyboardInside(true);
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardInside(false);
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label="What Earneazi offers"
      data-ribbon=""
      data-paused={offscreen ? '' : undefined}
      onFocus={onFocus}
      onBlur={onBlur}
      className="relative border-b border-divider bg-surface"
    >
      <div
        ref={viewportRef}
        className={cn('py-1', moving ? 'ribbon-fade flex overflow-hidden' : 'rail-x')}
      >
        {prefersReducedMotion ? (
          <ul className="flex shrink-0 items-center ps-gutter pe-6">
            {ribbonItems.map((item) => (
              <RibbonEntry key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <div className={cn('flex w-max shrink-0 ps-gutter', moving && 'ribbon-track')}>
            {Array.from({ length: TRACK_COPIES }, (_, copy) => (
              <ul key={copy} aria-hidden={copy > 0 ? true : undefined} className="flex shrink-0 items-center">
                {ribbonItems.map((item) => (
                  <RibbonEntry key={`${item.id}-${copy}`} item={item} clone={copy > 0} />
                ))}
              </ul>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RibbonEntry({ item, clone = false }: { item: RibbonItem; clone?: boolean }) {
  const Glyph = item.icon;

  return (
    <li className="flex shrink-0 items-center">
      <Link
        to={item.href}
        tabIndex={clone ? -1 : undefined}
        data-tone={item.toneId}
        className={cn(
          /* 40px on a fine pointer keeps the band slim; 44px where it is
             touched. The whole entry is the target. */
          'group flex min-h-10 items-center gap-2.5 rounded-pill py-1 pe-3.5 ps-1 [@media(pointer:coarse)]:min-h-11',
          'transition-colors duration-instant ease-out hover:bg-hovered'
        )}
      >
        <span
          aria-hidden="true"
          className="lit lit-tone inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-tone-fill text-on-tone"
        >
          <Glyph size={15} strokeWidth={2} />
        </span>
        <span className="flex flex-col whitespace-nowrap text-left leading-tight">
          <span className="text-body-sm font-semibold text-ink transition-colors duration-instant ease-out group-hover:text-tone">
            {item.title}
          </span>
          <span className="hidden text-legal text-ink-muted sm:block">{item.description}</span>
        </span>
      </Link>

      <span aria-hidden="true" className="sphere mx-3 h-1.5 w-1.5 shrink-0 rounded-pill opacity-50 sm:mx-5" />
    </li>
  );
}
