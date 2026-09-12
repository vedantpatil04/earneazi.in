import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Which of a set of stacked panels is the one currently being read, and how
 * to scroll to any of them.
 *
 * This is the reporting half of the pinned-premise device in Phase 0 §19.2:
 * the left column holds still while the right column's panels travel past
 * it, and the rail in that pinned column has to say — accurately, on every
 * frame the reader might look at it — which panel they are on.
 *
 * ── It does not drive any motion ────────────────────────────────────────
 *
 * The pinning is `position: sticky` and nothing else. No scroll listener
 * moves anything, so the composition tracks the finger exactly, survives a
 * dragged scrollbar, a flung trackpad and an anchor jump into the middle of
 * the section, and costs nothing per frame. This hook only reports, so the
 * rail's active state, its `aria-current`/`aria-selected` and its keyboard
 * behaviour stay honest.
 *
 * ── Why measurement and not IntersectionObserver ────────────────────────
 *
 * A panel taller than the observer's band keeps intersecting long after it
 * has passed the reading line, so the callback stops firing exactly when the
 * answer needs to change; and with a thin band, two adjacent panels can
 * intersect at once with no principled tie-break. Reading three or four
 * rects once per animation frame is both cheaper to reason about and
 * deterministic: the active panel is the last one whose top has crossed the
 * line, which is the same rule a reader applies with their eyes.
 *
 * State is set only when the index actually changes, so traversing the whole
 * section costs two or three React renders rather than one per frame.
 */

interface ScrollSpyOptions {
  count: number;
  /**
   * Where the reading line sits, as a fraction of the viewport height.
   * 0.4 puts it a little above centre, which is where a reader's attention
   * actually is — a line at 0.5 makes the rail change one beat late.
   */
  line?: number;
  /** Reports every change, for a section that mirrors the index elsewhere. */
  onChange?: (index: number) => void;
}

export interface ScrollSpy {
  /** Attach to each panel, in order. */
  register: (index: number) => (node: HTMLElement | null) => void;
  /** The panel currently being read. */
  activeIndex: number;
  /** Scroll `index` to the top of the reading area, clear of the header. */
  goTo: (index: number) => void;
}

/**
 * Clearance for the sticky header, read from the same `--header-offset`
 * token the CSS `scroll-margin-top` uses, so a programmatic scroll and a
 * native anchor jump land in the same place.
 */
function headerOffset(): number {
  if (typeof window === 'undefined') return 88;
  const root = document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue('--header-offset').trim();
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return 88;
  const rootFontSize = Number.parseFloat(getComputedStyle(root).fontSize) || 16;
  return raw.endsWith('rem') ? value * rootFontSize : value;
}

export function useScrollSpy({ count, line = 0.4, onChange }: ScrollSpyOptions): ScrollSpy {
  const panels = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // Kept in a ref so a caller can pass an inline arrow without the effect
  // re-subscribing on every render.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const register = useCallback(
    (index: number) => (node: HTMLElement | null) => {
      panels.current[index] = node;
    },
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let frame = 0;

    const read = () => {
      frame = 0;
      const readingLine = window.innerHeight * line;

      let next = 0;
      for (let index = 0; index < count; index += 1) {
        const panel = panels.current[index];
        if (!panel) continue;
        if (panel.getBoundingClientRect().top <= readingLine) next = index;
      }

      /*
        The last panel is short, or the section ends near the foot of the
        document: its top may never reach the reading line, which would
        leave the rail permanently one short. Once the document itself can
        scroll no further, the last panel is by definition the one being
        read.
      */
      const atDocumentEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atDocumentEnd) {
        const last = panels.current[count - 1];
        if (last && last.getBoundingClientRect().top < window.innerHeight) next = count - 1;
      }

      setActiveIndex((current) => {
        if (current === next) return current;
        onChangeRef.current?.(next);
        return next;
      });
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
  }, [count, line]);

  const goTo = useCallback((index: number) => {
    const panel = panels.current[index];
    if (!panel) return;
    window.scrollTo({
      top: panel.getBoundingClientRect().top + window.scrollY - headerOffset(),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, []);

  return { register, activeIndex, goTo };
}
