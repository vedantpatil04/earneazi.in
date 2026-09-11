import { useEffect } from 'react';

/**
 * Marks an element `inert` while a modal surface is open.
 *
 * A focus trap keeps Tab inside a dialog, but it does nothing for a screen
 * reader's virtual cursor or for a touch-exploration gesture — both walk
 * the document tree directly. `inert` removes the subtree from the
 * accessibility tree and from hit testing at the same time, which is what
 * Phase 0 §16 asks for when it says the rest of the document must be inert
 * while the sheet is open.
 *
 * Set imperatively rather than as a JSX prop because React 18 does not
 * recognise `inert` as a DOM property and would drop it.
 *
 * @param selector  Element to freeze, e.g. '#root'.
 * @param active    Whether the modal surface is currently open.
 */
export function useInert(selector: string, active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;

    const element = document.querySelector(selector);
    if (!element) return;

    const hadInert = element.hasAttribute('inert');
    element.setAttribute('inert', '');

    return () => {
      if (!hadInert) element.removeAttribute('inert');
    };
  }, [selector, active]);
}
