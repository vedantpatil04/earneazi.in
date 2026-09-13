import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { IconTile } from '@/components/ui/IconTile';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { serviceConversation } from '@/lib/contact/conversation';
import { duration, easing } from '@/lib/motion/tokens';
import type { ServicePillar } from '@/types/content';
import { cn } from '@/lib/utils/cn';

/**
 * A service's products — Enhancement B.
 *
 * The breadth the previous site carried (four investment products, eight
 * kinds of cover, eight kinds of borrowing), restored as an explorer rather
 * than a wall of cards: pick a product and one panel says what it is, who it
 * tends to suit and how Earneazi helps, with a conversation that already
 * knows which product it is about.
 *
 * ── Interaction ─────────────────────────────────────────────────────────
 *
 * The same ARIA tab pattern as the Financial Goals section, so there is one
 * behaviour to learn: a vertical list beside the panel from 1024px, a
 * swipeable chip rail above it below that. Roving tabindex, arrow keys in
 * both axes, Home and End. The panel swaps by keyed remount with a short
 * settle, and instantly under reduced motion.
 *
 * ── Colour and depth ────────────────────────────────────────────────────
 *
 * Everything reads the service's tone channel, so insurance products are
 * teal and loans violet in both themes, and the selected product is the lit
 * chip on a phone and a raised row on a laptop — Enhancement A's language.
 *
 * ── What the panel never says ───────────────────────────────────────────
 *
 * No rate, premium, amount, term, return or provider name. The line beside
 * the action says so, because a reader looking at "Home loan" will look for
 * a rate and should be told why there isn't one.
 */
export function ServiceProducts({ service }: { service: ServicePillar }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [activeIndex, setActiveIndex] = useState(0);
  const products = service.products;
  const total = products.length;

  if (total === 0) return null;

  const tabId = (productId: string) => `product-tab-${service.id}-${productId}`;
  const panelId = `product-panel-${service.id}`;
  const headingId = `products-heading-${service.id}`;

  const select = (next: number, focus = false) => {
    setActiveIndex(next);
    if (!focus) return;
    const tab = document.getElementById(tabId(products[next].id));
    tab?.focus();
    tab?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        select((activeIndex + 1) % total, true);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        select((activeIndex - 1 + total) % total, true);
        break;
      case 'Home':
        event.preventDefault();
        select(0, true);
        break;
      case 'End':
        event.preventDefault();
        select(total - 1, true);
        break;
      default:
        break;
    }
  };

  const active = products[activeIndex];
  const facts: Array<[string, string]> = [
    ['What it is', active.summary],
    ['Who it suits', active.whoFor],
    ['How we help', active.howWeHelp],
  ];

  return (
    <div data-tone={service.id} className="mt-12 border-t border-divider pt-10 lg:mt-16 lg:pt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 id={headingId} className="text-display-xs text-ink-display">
          {service.categories.label}
        </h3>
        <p className="text-body-sm text-ink-muted">Choose one to see what it is, who it suits and how we help.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8">
        <div className="relative min-w-0 lg:col-span-4">
          <div
            role="tablist"
            aria-labelledby={headingId}
            aria-orientation={isDesktop ? 'vertical' : 'horizontal'}
            onKeyDown={onKeyDown}
            className={cn(
              /* Dissolves at its right edge on a phone (`.rail-fade`). */
              'rail-x max-lg:rail-fade -mx-gutter gap-2 px-gutter pb-1',
              'lg:mx-0 lg:grid lg:grid-cols-1 lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0'
            )}
          >
            {products.map((product, index) => {
              const isActive = index === activeIndex;
              const Glyph = product.icon;

              return (
                <button
                  key={product.id}
                  id={tabId(product.id)}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={panelId}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(index)}
                  className={cn(
                    /* 44px on a phone; the whole chip or row is the target. */
                    'group inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-pill border px-3.5 text-left',
                    'font-display text-body-sm font-semibold',
                    'transition-[background-color,border-color,color,box-shadow] duration-fast ease-out',
                    'lg:min-h-[3.25rem] lg:rounded-surface lg:px-2.5',
                    isActive
                      ? 'lit lit-tone border-transparent bg-tone-fill text-on-tone lg:border-tone/35 lg:bg-tone-tint lg:bg-none lg:text-ink-display lg:shadow-raised'
                      : 'edge-top border-divider bg-surface text-ink-secondary hover:border-border hover:text-ink lg:border-transparent lg:bg-transparent lg:shadow-none lg:hover:bg-hovered'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'inline-flex shrink-0 items-center justify-center',
                      'lg:h-8 lg:w-8 lg:rounded-action lg:transition-colors lg:duration-fast',
                      isActive ? 'lg:bg-tone-fill lg:text-on-tone' : 'lg:bg-surface-sunken lg:text-ink-muted lg:group-hover:text-tone'
                    )}
                  >
                    <Glyph size={16} strokeWidth={isActive ? 2 : 1.75} />
                  </span>
                  <span className="whitespace-nowrap lg:whitespace-normal">{product.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(active.id)}
          tabIndex={0}
          className="min-w-0 focus-visible:outline-none lg:col-span-8"
        >
          <motion.article
            key={active.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: duration.base, ease: easing.out }}
            className="raised relative overflow-hidden rounded-band border border-tone/25 bg-surface"
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-tone-fill" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-pill bg-tone opacity-[0.1] blur-3xl"
            />

            <div className="relative p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <IconTile icon={active.icon} fill="tone-solid" size="md" active />
                <h4 className="text-display-xs text-ink-display">{active.name}</h4>
              </div>

              <dl className="mt-6 grid gap-5 md:grid-cols-3 md:gap-6">
                {facts.map(([label, text]) => (
                  <div key={label} className="min-w-0">
                    <dt className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-tone">{label}</dt>
                    <dd className="mt-2 text-body-sm text-ink-secondary">{text}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-col gap-4 border-t border-divider pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-[38ch] text-body-sm text-ink-muted">
                  No rates, premiums or terms are quoted here — those depend on your situation and the provider.
                </p>
                <ConversationCta
                  context={serviceConversation(service.id, active.id)}
                  size="md"
                  showChannelIcon
                  className="w-full shrink-0 sm:w-auto"
                >
                  {`Ask about ${active.name}`}
                </ConversationCta>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  );
}
