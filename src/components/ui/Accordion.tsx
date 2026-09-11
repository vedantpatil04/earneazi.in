import { useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { transitions, withMotionSafety } from '@/lib/motion/variants';
import { cn } from '@/lib/utils/cn';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Unique per accordion on the page — ids are derived from it, and duplicates would break aria-controls. */
  idPrefix: string;
  /** Allow several panels open at once. Default is one at a time, which keeps a long list scannable. */
  allowMultiple?: boolean;
  /** Which panel starts open. Omit for all closed. */
  defaultOpenId?: string;
  /** Heading level for each trigger's wrapper, so the accordion slots into the page's outline correctly. */
  headingLevel?: 'h2' | 'h3';
  className?: string;
}

/**
 * Accessible disclosure list.
 *
 * The trigger is a real `<button>` inside a heading, which is what gives it
 * Enter/Space activation, the right role, and a place in the screen reader's
 * heading outline — none of which a styled `<div>` with a click handler
 * would have. `aria-expanded` and `aria-controls` tie each trigger to its
 * panel, so the state is announced rather than only drawn.
 *
 * Arrow keys move between triggers (skipping the panel contents), with Home
 * and End jumping to the ends — the behaviour expected of a group of
 * headings, and the difference between skimming ten questions and tabbing
 * through every link inside all of them.
 */
export function Accordion({
  items,
  idPrefix,
  allowMultiple = false,
  defaultOpenId,
  headingLevel: Heading = 'h3',
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const prefersReducedMotion = usePrefersReducedMotion();

  const toggle = (id: string) => {
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((openId) => openId !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  };

  const focusTrigger = (index: number) => {
    const next = items[(index + items.length) % items.length];
    triggerRefs.current[next.id]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusTrigger(index + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusTrigger(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusTrigger(0);
        break;
      case 'End':
        event.preventDefault();
        focusTrigger(items.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn('border-t border-divider', className)}>
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id);
        const panelId = `${idPrefix}-panel-${item.id}`;
        const triggerId = `${idPrefix}-trigger-${item.id}`;

        return (
          <div key={item.id} className="border-b border-divider">
            <Heading>
              <button
                ref={(node) => {
                  triggerRefs.current[item.id] = node;
                }}
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={cn(
                  'group flex w-full items-center justify-between gap-5 py-5 text-left transition-colors motion-safe:duration-200',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                  'md:py-6'
                )}
              >
                <span
                  className={cn(
                    'text-body-lg font-medium transition-colors motion-safe:duration-200 md:text-h3 md:font-display md:font-normal',
                    isOpen ? 'text-ink' : 'text-ink-secondary group-hover:text-ink'
                  )}
                >
                  {item.title}
                </span>

                <span
                  aria-hidden="true"
                  className={cn(
                    'inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-colors motion-safe:duration-200',
                    isOpen
                      ? 'border-brass/45 text-brass'
                      : 'border-divider text-ink-muted group-hover:border-border group-hover:text-ink'
                  )}
                >
                  {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                </span>
              </button>
            </Heading>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key={panelId}
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={withMotionSafety(prefersReducedMotion, transitions.base)}
                  className="overflow-hidden"
                >
                  <div className="max-w-prose pb-6 pr-12 text-body text-ink-secondary md:pb-8">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
