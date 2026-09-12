import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * The stacked-card interaction, as measured from the reference recording.
 *
 * ── What the reference actually does ────────────────────────────────────
 *
 * Frame by frame on the reference capture (reference1/, 30fps), the card
 * being read behaves like this:
 *
 *   · its width is constant — 330px in every single frame. There is no
 *     scale.
 *   · its opacity never changes. There is no crossfade.
 *   · its top edge stops at a fixed offset and stays there while the page
 *     keeps scrolling — `position: sticky`.
 *   · its *visible* height then shrinks from the bottom up (189 → 160 →
 *     148 → 100 → 79 → 65px) while its top stays put, because the next
 *     panel is riding up over it and occluding it.
 *   · what remains of a covered card is a thin strip at its top, which is
 *     where its label sits — in the reference, `[BREAKTHROUGH]` above
 *     `[NEXT LEAP]`.
 *
 * So the whole effect is: opaque cards, each stuck at a slightly lower
 * offset than the one before, physically covering each other as the
 * document scrolls. There is no animation at all. That is precisely why it
 * feels expensive — it tracks the finger exactly, with no easing curve
 * between the input and the result, and it costs nothing per frame.
 *
 * ── What this hook is, and is not ───────────────────────────────────────
 *
 * The stacking is done entirely in CSS: `position: sticky`, a per-card
 * `top`, and a rising `z-index`. None of that needs JavaScript, and putting
 * it in JavaScript is what made the earlier implementation feel synthetic.
 *
 * This hook does not drive the motion. It reports which card is currently
 * the one being read, so the section's labels, `aria-current` states and
 * keyboard navigation stay honest.
 *
 * It does that by reading the cards' positions on scroll, throttled to one
 * read per animation frame and setting state only when the index actually
 * changes — so a full traverse of the section causes two or three React
 * renders, not one per frame.
 *
 * IntersectionObserver is the obvious instinct here and it does not work,
 * for a reason worth recording. Observing the card fails because a tall
 * element keeps intersecting the pin line long after it has pinned, so the
 * callback never fires again. Observing a sentinel placed inside the card
 * fails for the opposite reason: the sentinel is a child of the sticky
 * element, so it is carried along with it and stops crossing anything at
 * all. Making it work needs a sentinel in normal flow as a *sibling* of
 * every card, which means either sentinel entries inside the list — junk in
 * the accessibility tree — or abandoning the list semantics that make the
 * stack read correctly. Three rect reads per frame is the cheaper trade.
 */

interface StackedCardsOptions {
  count: number;
  /**
   * Distance from the top of the viewport at which the first card pins, as
   * a CSS length. Cards after it pin one `strip` lower each.
   */
  top: string;
  /** Height of the label strip a covered card keeps showing. */
  strip: string;
}

export interface StackedCards {
  /** Attach to each card's sticky wrapper, in order. */
  register: (index: number) => (node: HTMLElement | null) => void;
  /** The card currently at the front of the stack. */
  activeIndex: number;
  /** `top` for card `index` — the staggered pin offset. */
  offsetFor: (index: number) => string;
  /** Scroll so that `index` becomes the card being read. */
  goTo: (index: number) => void;
  /** Roving arrow / Home / End handling for the strip labels. */
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

export function useStackedCards({ count, top, strip }: StackedCardsOptions): StackedCards {
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const register = useCallback(
    (index: number) => (node: HTMLElement | null) => {
      cards.current[index] = node;
    },
    []
  );

  const offsetFor = useCallback(
    (index: number) => (index === 0 ? top : `calc(${top} + ${index} * ${strip})`),
    [strip, top]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let frame = 0;

    const read = () => {
      frame = 0;
      /*
        A card is pinned when its top has reached its own sticky line, and
        the frontmost pinned card is the one being read. Reading the line
        from the element rather than recomputing it means the JavaScript and
        the CSS cannot disagree about where "pinned" is — the offsets are in
        `rem` off a custom property that changes at breakpoints.
      */
      let next = 0;
      for (let index = 0; index < cards.current.length; index += 1) {
        const card = cards.current[index];
        if (!card) continue;
        const line = parseFloat(getComputedStyle(card).top || '0');
        /*
          The tolerance is not cosmetic. A pinned card's measured top does
          not always equal its computed `top`: the offsets resolve from
          `rem` plus a custom property, and under a fractional device pixel
          ratio the painted pin line can sit several pixels below the
          computed one — 6px, consistently, in the browser this was measured
          in. Eight pixels absorbs that without ever reaching the next
          card's line, which is a whole strip away.
        */
        if (card.getBoundingClientRect().top <= line + 8) next = index;
      }
      setActiveIndex((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [count, strip, top]);

  const goTo = useCallback((index: number) => {
    const node = cards.current[index];
    if (!node) return;
    const line = parseFloat(getComputedStyle(node).top || '0');
    window.scrollTo({
      top: node.getBoundingClientRect().top + window.scrollY - line,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const move = (next: number) => {
        event.preventDefault();
        goTo(next);
        cards.current[next]?.querySelector<HTMLElement>('[data-stack-label]')?.focus();
      };
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          if (activeIndex < count - 1) move(activeIndex + 1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          if (activeIndex > 0) move(activeIndex - 1);
          break;
        case 'Home':
          move(0);
          break;
        case 'End':
          move(count - 1);
          break;
        default:
          break;
      }
    },
    [activeIndex, count, goTo]
  );

  return { register, activeIndex, offsetFor, goTo, onKeyDown };
}
