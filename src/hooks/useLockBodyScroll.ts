import { useEffect } from 'react';

/**
 * Freezes background scrolling while an overlay is open, and restores the
 * exact scroll position on close.
 *
 * iOS Safari ignores `overflow: hidden` on <body>, so the position-fixed
 * technique is the only one that actually holds there. Padding compensates
 * for the scrollbar width on pointer platforms so the page doesn't shift
 * sideways as the bar disappears.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') return;

    const { body } = document;
    const scrollY = window.scrollY;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.paddingRight = previous.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
