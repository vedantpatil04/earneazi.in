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
 *
 * ── Cost ────────────────────────────────────────────────────────────────
 *
 * One passive scroll listener, read at most once per animation frame: a
 * single rect and a handful of style writes. Heights come from a
 * ResizeObserver, never from scrolling.
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
  /** Where each item is fully in place, in pixels of story scroll. */
  starts: number[];
  /** How far each card pans to bring its end into view. */
  reading: number[];
  /** Each item's whole segment. */
  spans: number[];
  settle: number;
  fade: number;
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
    /* The pinned column's `top` is 2rem, so the side gap scales with the root
       font size — SIDE_GAP is that 2rem at the 16px base. */
    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const anchor =
      layout === 'side' ? header + (SIDE_GAP / 16) * rootFontSize : header + barHeight + STACKED_GAP;
    const stageHeight = Math.max(240, Math.round(viewport - anchor));
    /*
      Long enough to read a settled state and to watch a change happen. The
      stacked layout holds for less: it is read on a touch screen, where a
      flick travels further and a long still stretch reads as the page
      sticking, and a card taller than its stage already buys its reading
      time with the pan.
    */
    const stacked = layout === 'stacked';
    const settle = Math.round(
      stacked ? Math.min(130, Math.max(80, viewport * 0.12)) : Math.min(220, Math.max(140, viewport * 0.2))
    );
    const fade = Math.round(
      stacked ? Math.min(200, Math.max(130, viewport * 0.18)) : Math.min(300, Math.max(180, viewport * 0.26))
    );

    const panelHeights = Array.from({ length: count }, (_, index) => panels.current[index]?.offsetHeight ?? 0);
    if (panelHeights.some((height) => height === 0)) return;

    const reading = panelHeights.map((height) => Math.max(0, Math.ceil(height - (stageHeight - END_MARGIN))));
    const spans = reading.map((distance, index) => settle + distance + settle + (index < count - 1 ? fade : 0));
    const starts: number[] = [];
    let cursor = 0;
    for (let index = 0; index < count; index += 1) {
      starts.push(cursor);
      cursor += spans[index];
    }

    internals.current = { anchor, starts, reading, spans, settle, fade, total: cursor };

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
    let sum = 0;
    let weighted = 0;
    let best = 0;
    let bestOpacity = -1;

    for (let index = 0; index < count; index += 1) {
      const start = current.starts[index];
      const distance = current.reading[index];
      const entering = index === 0 ? 1 : clamp01((scrolled - (start - current.fade)) / current.fade);
      const leaving =
        index === count - 1
          ? 0
          : clamp01((scrolled - (start + current.settle + distance + current.settle)) / current.fade);
      const pan = distance > 0 ? clamp01((scrolled - (start + current.settle)) / distance) * distance : 0;

      /* Staggered so one item always dominates: the outgoing card is mostly
         gone before the incoming one is mostly there. */
      const opacity = calm
        ? entering >= 0.5 && leaving < 0.5
          ? 1
          : 0
        : smoothstep(0.35, 1, entering) * (1 - smoothstep(0, 0.65, leaving));

      opacities.push(opacity);
      pans.push(pan);
      sum += opacity;
      weighted += index * opacity;
      if (opacity > 0 && opacity >= bestOpacity) {
        best = index;
        bestOpacity = opacity;
      }

      const panel = panels.current[index];
      if (!panel) continue;
      panel.style.opacity = opacity.toFixed(3);
      panel.style.visibility = opacity < 0.01 ? 'hidden' : 'visible';

      const enter = 1 - (1 - entering) ** 3;
      const scale = calm ? 1 : 1 - 0.02 * (1 - enter) - 0.015 * leaving * leaving;
      panel.style.transform =
        pan > 0 || scale < 1 ? `translate3d(0, ${(-pan).toFixed(1)}px, 0) scale(${scale.toFixed(4)})` : '';
      /* The incoming card is revealed from the top of the stage down. */
      panel.style.clipPath = !calm && enter < 0.999 ? `inset(0% 0% ${((1 - enter) * 100).toFixed(2)}% 0%)` : '';
    }

    /* A soft top edge while the dominant card is panned, so text leaving the
       stage fades rather than being cut. Written only when it changes. */
    const panned = pans[best] > 0.5;
    if (stage.current && panned !== masked.current) {
      masked.current = panned;
      const edge = panned ? 'linear-gradient(to bottom, transparent 0, #000 1.5rem)' : '';
      stage.current.style.setProperty('mask-image', edge);
      stage.current.style.setProperty('-webkit-mask-image', edge);
    }

    const frame: StoryFrame = {
      opacities,
      marker: calm || sum === 0 ? best : weighted / sum,
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
    window.scrollTo({
      top: window.scrollY + (current.starts[index] + 1 - scrolled),
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
