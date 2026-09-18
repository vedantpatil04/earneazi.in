import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RefCallback } from 'react';

/**
 * Scroll-driven storytelling for Services and Financial Goals — every
 * transition is a continuous function of how far the reader has scrolled.
 *
 * ── The stage ───────────────────────────────────────────────────────────
 *
 * One pinned stage sits at a fixed anchor on screen, from the anchor to the
 * foot of the screen, and every card lives inside it, stacked at its top. The
 * page's scroll never positions a card: it is turned into progress through
 * the story, and the story positions the cards. So every state begins in the
 * same place — card 01, 02, 03 all start with their top at the anchor.
 *
 * ── Each item's segment ─────────────────────────────────────────────────
 *
 * Every item gets its own stretch of scroll, in this order:
 *
 *     settle   the card is in place and still.
 *     read     only for a card taller than the stage: the card pans up
 *              inside the stage at the speed of the scroll until its end is
 *              in view. A card that fits skips this.
 *     settle   the complete state, still, for as long again.
 *     fade     (every item but the last) the next card is revealed from the
 *              top of the same stage while this one recedes and fades — the
 *              next item's entry and this item's exit are one stretch.
 *
 * The next card cannot appear early: until the fade begins its opacity is 0.
 * After the last item's final settle the track ends, so the stage releases
 * straight into the page — no gap, no jump.
 *
 * ── Continuous, not a switch ────────────────────────────────────────────
 *
 * Opacity, the pan, a slight scale, the reveal, the navigation marker and
 * every progress bar are computed from the scroll position on each frame — a
 * little scroll moves them a little, and stopping leaves a settled state. The
 * only discrete thing is which item is *dominant* (the most visible), which
 * drives `aria-current`, the live announcement and which card accepts
 * pointer input; it is a React state set only when it actually changes.
 *
 * Scroll-linked values are written straight to the elements in the same
 * animation frame the scroll is read, rather than through a second render
 * loop, so the motion never trails the scroll by a frame. Nothing here moves
 * the page or intercepts input: scrolling stays entirely native.
 *
 * ── Reduced motion ──────────────────────────────────────────────────────
 *
 * No fade, scale or reveal: each card is simply shown for its segment and
 * the next replaces it at the midpoint of the transition. The pan of a tall
 * card remains, because it is how the card is read. The marker steps rather
 * than glides.
 */

export type StoryLayout = 'side' | 'stacked';

/** The anchor's distance below the site header in the side-by-side layout — the pinned column's own `top`. */
const SIDE_GAP = 32;
/** The gap between the pinned headings and the stage in the stacked layout. */
const STACKED_GAP = 12;
/** Breathing room kept under a tall card's end once it has been read. */
const END_MARGIN = 24;

function readHeaderHeight(): number {
  const root = document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue('--header-height').trim();
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return 72;
  const rootFontSize = Number.parseFloat(getComputedStyle(root).fontSize) || 16;
  return raw.endsWith('rem') ? value * rootFontSize : value;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function smoothstep(from: number, to: number, value: number): number {
  const t = clamp01((value - from) / (to - from));
  return t * t * (3 - 2 * t);
}

/** Rendered layout values. Change only when something changes size. */
export interface StoryGeometry {
  /** Where the stage — and so every card — starts on screen: the stage's sticky `top`. */
  anchor: number;
  /** From the anchor to the foot of the screen. */
  stageHeight: number;
  /** The stage's height plus the whole story's scroll, so the pin releases after the last item. */
  trackHeight: number;
}

/** Scroll-linked values, recomputed every frame. */
export interface StoryFrame {
  opacities: number[];
  /** A continuous item index — 1.5 is halfway from the second item to the third. */
  marker: number;
  /** 0–1 through the whole sequence. */
  overall: number;
  /** 0–1 through the dominant item's own segment. */
  step: number;
  dominant: number;
}

interface Internals {
  anchor: number;
  /** Start scroll offset for each chapter. */
  starts: number[];
  /** Settle distance upon entering chapter. */
  settleEnter: number[];
  /** Vertical reading pan distance if card is taller than stage. */
  reading: number[];
  /** Dedicated reading hold distance while card is completely still. */
  readingHold: number[];
  /** Settle distance before transition begins. */
  settleExit: number[];
  /** Transition distance to next chapter (0 for last chapter). */
  fade: number[];
  /** Total span for each chapter. */
  spans: number[];
  total: number;
}

interface ScrollStoryOptions {
  count: number;
  layout: StoryLayout;
  reducedMotion: boolean;
}

export interface ScrollStory {
  registerTrack: RefCallback<HTMLElement>;
  /** The pinned stage the cards live in. */
  registerStage: RefCallback<HTMLElement>;
  /** The pinned headings in the stacked layout. */
  registerBar: RefCallback<HTMLElement>;
  registerPanel: (index: number) => RefCallback<HTMLElement>;
  geometry: StoryGeometry | null;
  /** The most visible item. */
  dominant: number;
  /** Scroll to where an item is fully in place. The scroll position is the only state. */
  select: (index: number) => void;
  /** Receive every frame's scroll-linked values. Returns an unsubscribe. */
  subscribe: (listener: (frame: StoryFrame) => void) => () => void;
}

export function useScrollStory({ count, layout, reducedMotion }: ScrollStoryOptions): ScrollStory {
  const track = useRef<HTMLElement | null>(null);
  const stage = useRef<HTMLElement | null>(null);
  const bar = useRef<HTMLElement | null>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const internals = useRef<Internals | null>(null);
  const [geometry, setGeometry] = useState<StoryGeometry | null>(null);
  const [dominant, setDominant] = useState(0);
  const dominantRef = useRef(0);
  const masked = useRef(false);
  const listeners = useRef(new Set<(frame: StoryFrame) => void>());
  const lastFrame = useRef<StoryFrame>({
    opacities: Array.from({ length: count }, (_, index) => (index === 0 ? 1 : 0)),
    marker: 0,
    overall: 0,
    step: 0,
    dominant: 0,
  });
  const reduced = useRef(reducedMotion);
  reduced.current = reducedMotion;

  const registerTrack = useCallback<RefCallback<HTMLElement>>((node) => {
    track.current = node;
  }, []);
  const registerStage = useCallback<RefCallback<HTMLElement>>((node) => {
    stage.current = node;
  }, []);
  const registerBar = useCallback<RefCallback<HTMLElement>>((node) => {
    bar.current = node;
  }, []);
  const registerPanel = useCallback(
    (index: number): RefCallback<HTMLElement> =>
      (node) => {
        panels.current[index] = node;
      },
    []
  );

  const measure = useCallback(() => {
    const viewport = window.innerHeight;
    const header = readHeaderHeight();
    const barHeight = layout === 'stacked' ? bar.current?.offsetHeight ?? 0 : 0;
    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const anchor =
      layout === 'side' ? header + (SIDE_GAP / 16) * rootFontSize : header + barHeight + STACKED_GAP;
    const stageHeight = Math.max(240, Math.round(viewport - anchor));

    const stacked = layout === 'stacked';
    /* Generous, comfortable reading and transition budgets */
    const settleEnterDist = Math.round(stacked ? 120 : 160);
    const readingHoldDist = Math.round(stacked ? 260 : 360);
    const settleExitDist = Math.round(stacked ? 100 : 120);
    const fadeDist = Math.round(stacked ? 280 : 340);

    const panelHeights = Array.from({ length: count }, (_, index) => panels.current[index]?.offsetHeight ?? 0);
    if (panelHeights.some((height) => height === 0)) return;

    const maxPanelHeight = Math.max(...panelHeights);
    // Align all panels to uniform height so card frames match identically
    panels.current.forEach((panel) => {
      if (panel) {
        panel.style.minHeight = `${maxPanelHeight}px`;
      }
    });

    const reading = panelHeights.map((height) => Math.max(0, Math.ceil(height - (stageHeight - END_MARGIN))));
    const settleEnter = Array.from({ length: count }, () => settleEnterDist);
    const readingHold = Array.from({ length: count }, () => readingHoldDist);
    const settleExit = Array.from({ length: count }, () => settleExitDist);
    const fade = Array.from({ length: count }, (_, index) => (index < count - 1 ? fadeDist : 0));

    const spans = Array.from(
      { length: count },
      (_, index) => settleEnter[index] + reading[index] + readingHold[index] + settleExit[index] + fade[index]
    );

    const starts: number[] = [];
    let cursor = 0;
    for (let index = 0; index < count; index += 1) {
      starts.push(cursor);
      cursor += spans[index];
    }

    internals.current = {
      anchor,
      starts,
      settleEnter,
      reading,
      readingHold,
      settleExit,
      fade,
      spans,
      total: cursor,
    };

    const next: StoryGeometry = { anchor, stageHeight, trackHeight: cursor + stageHeight };
    setGeometry((current) => (current && JSON.stringify(current) === JSON.stringify(next) ? current : next));
  }, [count, layout]);

  const read = useCallback(() => {
    const current = internals.current;
    const trackElement = track.current;
    if (!current || !trackElement) return;

    const scrolled = current.anchor - trackElement.getBoundingClientRect().top;
    const calm = reduced.current;

    const opacities: number[] = [];
    const pans: number[] = [];
    let best = 0;
    let bestOpacity = -1;
    let continuousMarker = 0;

    for (let index = 0; index < count; index += 1) {
      const start = current.starts[index];
      const enterDist = current.settleEnter[index];
      const panDist = current.reading[index];
      const holdDist = current.readingHold[index];
      const exitHoldDist = current.settleExit[index];
      const fadeDist = current.fade[index];

      // Settle phase start and end
      const readStart = start + enterDist;
      const readEnd = readStart + panDist;
      const transitionStart = readEnd + holdDist + exitHoldDist;

      // Pan calculation during reading phase
      const pan = panDist > 0 ? clamp01((scrolled - readStart) / panDist) * panDist : 0;
      pans.push(pan);

      let opacity = 0;
      let y = 0;
      let visualScale = 1;

      if (scrolled < start) {
        // Before this chapter
        if (index === 0) {
          // Chapter 0 is visible before story scroll reaches anchor
          opacity = 1;
          y = 0;
          visualScale = 1;
        } else {
          opacity = 0;
          y = 16;
          visualScale = 0.95;
        }
      } else if (fadeDist > 0 && scrolled >= transitionStart) {
        // In transition to next chapter
        const progress = clamp01((scrolled - transitionStart) / fadeDist);
        if (calm) {
          opacity = progress < 0.5 ? 1 : 0;
          y = 0;
          visualScale = 1;
        } else {
          // Outgoing exit curve: completes in first half of transition
          const exitT = clamp01(progress / 0.5);
          opacity = 1 - smoothstep(0, 1, exitT);
          y = -16 * smoothstep(0, 1, exitT);
          visualScale = 1 - 0.05 * smoothstep(0, 1, exitT);
        }
      } else {
        // Within chapter's active reading hold
        opacity = 1;
        y = 0;
        visualScale = 1;
      }

      // Incoming card during previous item's transition
      if (index > 0) {
        const prevTransitionStart =
          current.starts[index - 1] +
          current.settleEnter[index - 1] +
          current.reading[index - 1] +
          current.readingHold[index - 1] +
          current.settleExit[index - 1];
        const prevFade = current.fade[index - 1];

        if (scrolled >= prevTransitionStart && scrolled < current.starts[index]) {
          const progress = clamp01((scrolled - prevTransitionStart) / prevFade);
          if (calm) {
            opacity = progress >= 0.5 ? 1 : 0;
            y = 0;
            visualScale = 1;
          } else {
            // Incoming enters in second half of transition (from progress 0.35 onwards)
            if (progress < 0.35) {
              opacity = 0;
              y = 16;
              visualScale = 0.95;
            } else {
              const enterT = clamp01((progress - 0.35) / 0.65);
              opacity = smoothstep(0, 1, enterT);
              y = 16 * (1 - smoothstep(0, 1, enterT));
              visualScale = 0.95 + 0.05 * smoothstep(0, 1, enterT);
            }
          }
        }
      }

      opacities.push(opacity);
      if (opacity > bestOpacity) {
        best = index;
        bestOpacity = opacity;
      }

      // Apply transforms directly to panel and internal elements
      const panel = panels.current[index];
      if (panel) {
        panel.style.opacity = opacity.toFixed(3);
        panel.style.visibility = opacity < 0.005 ? 'hidden' : 'visible';
        // The panel's outer position stays rock-solid at the anchor, panning only if taller than viewport
        panel.style.transform = pan > 0 ? `translate3d(0, ${(-pan).toFixed(1)}px, 0)` : '';

        // Coordinated choreography for internal elements
        if (!calm) {
          const copyEl = panel.querySelector<HTMLElement>('[data-story-copy]');
          if (copyEl) {
            copyEl.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
          }
          const visualEl = panel.querySelector<HTMLElement>('[data-story-visual]');
          if (visualEl) {
            visualEl.style.transform = `scale(${visualScale.toFixed(4)})`;
          }
        }
      }
    }

    // Continuous marker computation
    let activeChapter = 0;
    for (let i = 0; i < count; i += 1) {
      if (scrolled >= current.starts[i]) {
        activeChapter = i;
      }
    }
    const chapterStart = current.starts[activeChapter];
    const transStart =
      chapterStart +
      current.settleEnter[activeChapter] +
      current.reading[activeChapter] +
      current.readingHold[activeChapter] +
      current.settleExit[activeChapter];
    const chFade = current.fade[activeChapter];

    if (chFade > 0 && scrolled >= transStart) {
      const p = clamp01((scrolled - transStart) / chFade);
      continuousMarker = activeChapter + smoothstep(0, 1, p);
    } else {
      continuousMarker = activeChapter;
    }

    // Mask for tall cards while scrolling pan is active
    const panned = pans[best] > 0.5;
    if (stage.current && panned !== masked.current) {
      masked.current = panned;
      const edge = panned ? 'linear-gradient(to bottom, transparent 0, #000 1.5rem)' : '';
      stage.current.style.setProperty('mask-image', edge);
      stage.current.style.setProperty('-webkit-mask-image', edge);
    }

    const frame: StoryFrame = {
      opacities,
      marker: calm ? best : continuousMarker,
      overall: clamp01(scrolled / current.total),
      step: clamp01((scrolled - current.starts[best]) / current.spans[best]),
      dominant: best,
    };
    lastFrame.current = frame;
    listeners.current.forEach((listener) => listener(frame));

    if (best !== dominantRef.current) {
      dominantRef.current = best;
      setDominant(best);
    }
  }, [count]);

  const select = useCallback((index: number) => {
    const current = internals.current;
    const trackElement = track.current;
    if (!current || !trackElement) return;
    const scrolled = current.anchor - trackElement.getBoundingClientRect().top;
    const targetScroll =
      current.starts[index] +
      current.settleEnter[index] +
      Math.round(current.readingHold[index] / 2);
    window.scrollTo({
      top: window.scrollY + (targetScroll - scrolled),
      behavior: reduced.current ? 'instant' : 'smooth',
    });
  }, []);

  const subscribe = useCallback((listener: (frame: StoryFrame) => void) => {
    listeners.current.add(listener);
    listener(lastFrame.current);
    return () => {
      listeners.current.delete(listener);
    };
  }, []);

  /* Measure before the first paint, whenever anything changes size, and
     when the layout switches between side-by-side and stacked. */
  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useLayoutEffect(() => {
    read();
  }, [geometry, read]);

  useEffect(() => {
    const observer = new ResizeObserver(() => measure());
    if (bar.current) observer.observe(bar.current);
    panels.current.forEach((panel) => panel && observer.observe(panel));
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        read();
      });
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [measure, read]);

  return { registerTrack, registerStage, registerBar, registerPanel, geometry, dominant, select, subscribe };
}

/** Run `render` with every frame of a story's scroll-linked values. */
export function useStoryFrame(story: ScrollStory, render: (frame: StoryFrame) => void) {
  const latest = useRef(render);
  latest.current = render;
  const { subscribe } = story;
  useEffect(() => subscribe((frame) => latest.current(frame)), [subscribe]);
}
