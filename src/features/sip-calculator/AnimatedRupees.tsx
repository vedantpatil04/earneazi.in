import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import { formatRupees } from '@/lib/finance';
import { duration, easing } from '@/lib/motion/tokens';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils/cn';

interface AnimatedRupeesProps {
  value: number;
  className?: string;
}

/**
 * A rupee figure that counts to its new value instead of snapping to it.
 *
 * ── The rule this obeys ─────────────────────────────────────────────────
 *
 * §23.4: "the numbers tween only their display, never their source". The
 * tween below writes to `textContent` through a ref and touches no state at
 * all — `value` is the engine's answer, arrives already computed, and is
 * never read back out of the animation. Nothing downstream of this component
 * can observe an intermediate frame, so no chart, table or message can ever
 * be built from a half-tweened number.
 *
 * Not re-rendering is also why it can run during a slider drag: a count-up
 * driven by React state would re-render the whole results panel sixty times
 * a second while the thumb moves.
 *
 * ── Why there are two spans ─────────────────────────────────────────────
 *
 * The visible one is animated and hidden from assistive technology, because
 * a tweening number in the accessibility tree is a number that reads
 * differently depending on when you happen to look at it.
 *
 * The screen-reader one carries the settled value as ordinary React-rendered
 * text. That matters twice over: it is what gets announced when this sits
 * inside a live region, and it is what a screen reader finds when reading
 * the page statically rather than following an announcement.
 *
 * Both start on the correct final value at first paint, so the figure is
 * right before any animation runs and stays right if none ever does.
 */
export function AnimatedRupees({ value, className }: AnimatedRupeesProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  /** The value currently painted, so a new tween starts from where the last one stopped. */
  const paintedRef = useRef(value);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    if (prefersReducedMotion || paintedRef.current === value) {
      paintedRef.current = value;
      node.textContent = formatRupees(value);
      return;
    }

    const controls = animate(paintedRef.current, value, {
      duration: duration.base,
      ease: easing.out,
      onUpdate: (frame) => {
        paintedRef.current = frame;
        node.textContent = formatRupees(frame);
      },
    });

    /*
      Stopping on cleanup is what makes a drag feel attached to the thumb:
      each new value cancels the tween in flight rather than queueing behind
      it, so the figure chases the slider instead of lagging a beat.
    */
    return () => controls.stop();
  }, [value, prefersReducedMotion]);

  return (
    <span className={cn('tabular', className)}>
      <span ref={nodeRef} aria-hidden="true">
        {formatRupees(value)}
      </span>
      <span className="sr-only">{formatRupees(value)}</span>
    </span>
  );
}
