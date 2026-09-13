import { useEffect, useRef } from 'react';
import { useMediaQuery } from './useMediaQuery';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Pointer tilt — Enhancement A. Pair with `.tilt` (and optionally
 * `.tilt-glare`) from globals.css.
 *
 * A surface leans a few degrees toward a mouse or pen and a soft glare
 * follows the pointer across it. It is reserved for the drawn marks in the
 * services and goals panels — the objects on the page that are pictures of
 * an idea — and never for a card of text, where movement under the cursor
 * would be a hover lift by another name (§18.3).
 *
 * What keeps it lightweight and honest:
 *
 *   · It only exists where there is a hover-capable fine pointer and no
 *     reduced-motion preference. Everywhere else the hook stamps nothing,
 *     the CSS rule never matches, and the surface is flat and untransformed.
 *   · Pointer coordinates are read on `pointermove` but written once per
 *     animation frame, as four custom properties. No React state, so no
 *     re-render while the pointer moves.
 *   · The travel is bounded by `maxDegrees` (default 5°), and the surface
 *     settles back to level over `dur-slow` when the pointer leaves.
 */
export function usePointerTilt<T extends HTMLElement>(maxDegrees = 5) {
  const ref = useRef<T>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion || !finePointer) return;

    node.setAttribute('data-tilt', '');
    let frame = 0;
    let x = 0.5;
    let y = 0.5;

    const paint = () => {
      frame = 0;
      node.style.setProperty('--tilt-x', `${((0.5 - y) * maxDegrees * 2).toFixed(2)}deg`);
      node.style.setProperty('--tilt-y', `${((x - 0.5) * maxDegrees * 2).toFixed(2)}deg`);
      node.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`);
      node.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const box = node.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return;
      x = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
      y = Math.min(1, Math.max(0, (event.clientY - box.top) / box.height));
      node.setAttribute('data-tilting', '');
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onLeave = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      node.removeAttribute('data-tilting');
      node.style.setProperty('--tilt-x', '0deg');
      node.style.setProperty('--tilt-y', '0deg');
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);

    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      node.removeAttribute('data-tilt');
      node.removeAttribute('data-tilting');
      for (const property of ['--tilt-x', '--tilt-y', '--glare-x', '--glare-y']) {
        node.style.removeProperty(property);
      }
    };
  }, [maxDegrees, prefersReducedMotion, finePointer]);

  return ref;
}
