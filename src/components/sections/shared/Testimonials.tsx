import { useRef, useState } from 'react';
import type { KeyboardEvent, UIEvent } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal, RevealGroup } from '@/components/motion/Reveal';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { clipRevealVariants, settleVariants } from '@/lib/motion/variants';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { generalConversation } from '@/lib/contact/conversation';
import { testimonials } from '@/data/testimonials';
import type { Testimonial } from '@/types/content';
import { cn } from '@/lib/utils/cn';

/**
 * Client stories — the homepage's testimonials, directly before the
 * consultation band.
 *
 * ── Content ─────────────────────────────────────────────────────────────
 *
 * Only testimonials with `consentVerified` render (data/testimonials.ts), and
 * each shows exactly what was supplied: the quote, the name, the occupation
 * and the city. The five stars repeat the presentation the client supplied;
 * there is no score beside them and no platform named. With no consented
 * testimonial the section renders nothing, and the footer's "Client stories"
 * link goes with it (data/footer.ts).
 *
 * There are no client photographs or logos, so each person is an initials
 * mark — plainly lettering, never mistakable for a portrait — on a lit plate
 * in the accent of the service their story is about: blue for the SIP story,
 * teal for the term plan, violet for the home loan. The same three accents
 * the services wear, so the colour means the same thing here as there, and
 * the stars stay in brand blue on every card so the set reads as one.
 *
 * ── Layout ──────────────────────────────────────────────────────────────
 *
 *   ≥1024px   three cards in a row.
 *   768–1023  two, with the third centred beneath at the same width.
 *   <768px    a carousel: a native scroll-snap row, so a swipe is the
 *             browser's own gesture and vertical scrolling is untouched.
 *             Previous and next buttons and a dot per story make every card
 *             reachable without swiping, the row takes the arrow keys when
 *             focused, and the next card always peeks in from the edge.
 *
 * ── Motion ──────────────────────────────────────────────────────────────
 *
 * The heading opens with the section-header reveal and the cards settle in
 * one after another — opacity only, never a fade-up. On hover a card's accent
 * rule extends, its quote mark warms to the accent and its shadow deepens.
 * No lift, bounce or rotation (§18.3). Under reduced motion everything is
 * visible from the first frame and nothing transitions.
 */
export function Testimonials() {
  const approved = testimonials.filter((testimonial) => testimonial.consentVerified);
  if (approved.length === 0) return null;

  return (
    <Section spacing="lg" background="sunken" className="overflow-hidden" aria-labelledby="testimonials-heading">
      {/* A soft brand light across the top of the section, so the ground is
          a lit room rather than a flat band. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-full max-w-[64rem] -translate-x-1/2 -translate-y-1/2 rounded-pill bg-brand/[0.08] blur-3xl"
      />

      <Container size="content" className="relative">
        <Reveal variants={clipRevealVariants} className="max-w-[40rem]">
          <Eyebrow>Client stories</Eyebrow>
          <h2 id="testimonials-heading" className="mt-4 text-display-lg text-ink-display">
            Trusted by Families Across Karnataka
          </h2>
        </Reveal>

        <StoryDeck stories={approved} />

        <div className="mt-10 lg:mt-12">
          <ConversationCta context={generalConversation} variant="secondary" size="md" showChannelIcon>
            Talk to us about your plan
          </ConversationCta>
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   THE DECK — a grid from 768px, a carousel below it
   ═══════════════════════════════════════════════════════════════════════ */

function StoryDeck({ stories }: { stories: Testimonial[] }) {
  const isGrid = useMediaQuery('(min-width: 768px)');
  const prefersReducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [rail, setRail] = useState<HTMLDivElement | null>(null);
  /* Where a button's own scroll is heading. The positions it passes on the
     way are not a choice, so they do not move the dots. */
  const pending = useRef<{ left: number; until: number } | null>(null);
  const total = stories.length;

  const cards = () => (rail ? Array.from(rail.querySelectorAll<HTMLElement>('[data-story]')) : []);

  /* Which story is at the start of the row. At the far end the last one is,
     even if the row cannot scroll it all the way to the start. */
  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const row = event.currentTarget;
    const target = pending.current;
    if (target) {
      if (Math.abs(row.scrollLeft - target.left) > 4 && performance.now() < target.until) return;
      pending.current = null;
    }

    const items = cards();
    if (items.length < 2) return;
    if (row.scrollLeft >= row.scrollWidth - row.clientWidth - 4) {
      setActive(items.length - 1);
      return;
    }
    const step = items[1].offsetLeft - items[0].offsetLeft;
    setActive(Math.min(items.length - 1, Math.max(0, Math.round(row.scrollLeft / step))));
  };

  /* A swipe or a trackpad takes the scroll back from a button. */
  const release = () => {
    pending.current = null;
  };

  const goTo = (index: number) => {
    const items = cards();
    const next = Math.min(total - 1, Math.max(0, index));
    if (!rail || !items[next]) return;
    const left = Math.min(items[next].offsetLeft - items[0].offsetLeft, rail.scrollWidth - rail.clientWidth);
    pending.current = { left, until: performance.now() + 1200 };
    setActive(next);
    rail.scrollTo({ left, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: total - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    goTo(moves[event.key]);
  };

  const controlClass = cn(
    'raised inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-divider bg-surface text-ink',
    'transition-[border-color,color,opacity] duration-fast ease-out hover:border-brand/40 hover:text-brand-ink',
    'disabled:pointer-events-none disabled:opacity-40'
  );

  return (
    <div className="mt-10 lg:mt-14">
      <div
        ref={setRail}
        {...(isGrid
          ? {}
          : {
              role: 'region',
              'aria-roledescription': 'carousel',
              'aria-label': 'Client stories',
              tabIndex: 0,
              onKeyDown,
              onScroll,
              onPointerDown: release,
              onTouchStart: release,
              onWheel: release,
            })}
        className={cn(
          /* The row: `rail-x` is the site's designed horizontal scroller.
             The vertical padding gives the cards' shadows room inside it. */
          'rail-x -mx-gutter scroll-px-gutter px-gutter pb-6 pt-1',
          'md:mx-0 md:block md:overflow-visible md:px-0 md:pb-0 md:pt-0'
        )}
      >
        <RevealGroup
          as="ul"
          stagger={0.1}
          className="flex w-max gap-4 md:grid md:w-auto md:grid-cols-2 md:gap-5 lg:grid-cols-3"
        >
          {stories.map((story, index) => (
            <motion.li
              key={story.id}
              data-story=""
              variants={settleVariants}
              className={cn(
                'flex w-[min(20rem,calc(100vw-3.5rem))] shrink-0 snap-start md:w-auto',
                /* At two columns the third story sits centred beneath, at the same width. */
                'md:last:col-span-2 md:last:w-[calc(50%-0.625rem)] md:last:justify-self-center',
                'lg:last:col-span-1 lg:last:w-auto'
              )}
              aria-label={isGrid ? undefined : `Story ${index + 1} of ${total}`}
            >
              <StoryCard story={story} />
            </motion.li>
          ))}
        </RevealGroup>
      </div>

      {!isGrid && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Previous story"
            className={controlClass}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <div role="group" aria-label="Choose a story" className="flex items-center">
            {stories.map((story, index) => {
              const isActive = index === active;
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Story ${index + 1} of ${total}: ${story.name}`}
                  aria-current={isActive ? 'true' : undefined}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-pill"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'block h-2 rounded-pill transition-[width,background-color] duration-base ease-out motion-reduce:transition-none',
                      isActive ? 'w-6 bg-brand' : 'w-2 bg-ink-muted/40'
                    )}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === total - 1}
            aria-label="Next story"
            className={controlClass}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>

          <p aria-live="polite" className="sr-only">
            {`Story ${active + 1} of ${total}: ${stories[active]?.name ?? ''}`}
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   THE CARD
   ═══════════════════════════════════════════════════════════════════════ */

/** "Priya Mehta" → "PM". The supplied name's first and last initials. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}

function StoryCard({ story }: { story: Testimonial }) {
  const detail = [story.role, story.city].filter(Boolean).join(', ');

  return (
    <figure
      data-tone={story.toneId}
      className={cn(
        'raised group relative flex w-full flex-col overflow-hidden rounded-surface border border-divider bg-surface p-4 sm:p-7',
        'transition-[border-color,box-shadow] duration-base ease-out motion-reduce:transition-none',
        'hover:border-tone/40 hover:[box-shadow:inset_0_1px_0_0_rgb(var(--edge-light)/var(--edge-light-alpha)),var(--shadow-float)]'
      )}
    >
      {/* The accent rule: a short mark at rest, the full edge on hover. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-1 w-full origin-left scale-x-[0.3] bg-tone-fill transition-transform duration-slow ease-out group-hover:scale-x-100 motion-reduce:transition-none"
      />
      {/* The story's own light, in its accent. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-pill bg-tone opacity-[0.08] blur-3xl transition-opacity duration-slow ease-out group-hover:opacity-[0.16]"
      />

      <div className="relative flex items-center justify-between gap-4">
        <span role="img" aria-label="Five stars" className="flex items-center gap-0.5 text-brand-ink">
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} size={16} strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
          ))}
        </span>
        <Quote
          size={32}
          strokeWidth={1.25}
          fill="currentColor"
          aria-hidden="true"
          className="shrink-0 text-tone/20 transition-[color,transform] duration-base ease-out group-hover:text-tone/50 motion-safe:group-hover:-translate-y-0.5"
        />
      </div>

      <blockquote className="relative mt-5 flex-1">
        <p className="text-body-lg leading-relaxed text-ink">&ldquo;{story.quote}&rdquo;</p>
      </blockquote>

      <figcaption className="relative mt-6 flex items-center gap-3.5 border-t border-divider pt-5">
        {/* Initials, not a photograph — no client image has been supplied. */}
        <span
          aria-hidden="true"
          className="lit lit-tone relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-pill bg-tone-fill font-display text-body font-bold tracking-[0.04em] text-on-tone"
        >
          <span className="texture-dots pointer-events-none absolute inset-0 opacity-50" />
          <span className="relative">{initials(story.name)}</span>
        </span>
        <span className="min-w-0">
          <cite className="block font-display text-title-sm font-semibold not-italic text-ink-display">{story.name}</cite>
          {detail && <span className="mt-0.5 block text-body-sm text-ink-muted">{detail}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
