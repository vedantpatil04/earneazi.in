import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Link } from '@/components/ui/Link';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { useStackedCards } from '@/hooks/useStackedCards';
import { servicePillars } from '@/data/services';
import type { ServicePillar } from '@/types/content';
import { cn } from '@/lib/utils/cn';
import { serviceMarks } from './ServiceVisuals';

/**
 * "Three things we do, coordinated by one person."
 *
 * The page's signature interaction, rebuilt on the model measured from the
 * reference recording rather than approximated. See useStackedCards for the
 * frame-by-frame analysis; the short version:
 *
 *   Cards sit in normal document flow. Each is `position: sticky`, pinned
 *   one strip-height lower than the one before it. As the page scrolls, a
 *   card reaches its line and stops; the next card keeps coming and rides
 *   up *over* it, opaque, covering everything but the label strip at its
 *   top. The stack builds at the top of the viewport, and the section that
 *   follows finally slides up over the whole thing.
 *
 * There is no scale, no crossfade, no scroll-linked transform and no
 * animation of any kind. The reference has none of those — its card is
 * exactly 330px wide in every frame of the capture, and its opacity never
 * moves. What reads as expensive is that the cards track the finger 1:1,
 * with nothing interpolating between the input and the result.
 *
 * That also makes this the cheapest section on the page: the whole
 * interaction is `position: sticky` plus a rising `z-index`, so it costs
 * nothing per frame and stays correct when the scrollbar is dragged, when a
 * trackpad is flung, or when an anchor jumps into the middle of it.
 *
 * Why the strips are the navigation: each covered card keeps its own label
 * visible, so the stack states where you are, what you have passed and what
 * is left — physically, in the same object you are reading. A separate
 * progress control would be a second, weaker copy of information the
 * composition already carries, so there is not one. The strips are buttons,
 * which is what makes the stack keyboard-operable as well as legible.
 */

/** Height of a covered card's remaining label strip. Must match the strip row. */
const STRIP = '3.25rem';
/** Where the first card pins: clear of the sticky header, with air above it. */
const STACK_TOP = 'calc(var(--header-height) + 1.25rem)';

export function ServicesShowcase() {
  const total = servicePillars.length;
  const { register, activeIndex, offsetFor, goTo, onKeyDown } = useStackedCards({
    count: total,
    top: STACK_TOP,
    strip: STRIP,
  });

  return (
    /*
      This section is both halves of the interaction: it rides up over the
      goals stack above it (`-mt`, `z-10`, an opaque ground and a rounded
      leading edge), and it then hands off to WhyEarneazi the same way. The
      negative margin must match the runway height inside the goals list.
    */
    <Section
      id="services"
      spacing="lg"
      background="sunken"
      className="relative z-10 -mt-[78vh] rounded-t-band pb-0 shadow-2xl"
      aria-labelledby="services-heading"
    >
      <Container size="content">
        <div className="max-w-[34rem]">
          <Eyebrow>Three core services</Eyebrow>
          <h2 id="services-heading" className="mt-4 text-display-lg text-ink-display">
            Three things we do, coordinated by one person.
          </h2>
          <p className="mt-4 max-w-measure text-body-lg text-ink-secondary">
            Most people arrive needing one of these and leave having sorted out how all three fit together.
          </p>
          <p className="mt-5">
            <Link to="/services" variant="standalone" trailingIcon={<ArrowRight size={15} aria-hidden="true" />}>
              All services in detail
            </Link>
          </p>
        </div>

        {/*
          The stack. No `overflow` and no `z-index` on this list — either one
          would trap the sticky cards in their own stacking context and stop
          the following section from covering them, which is the last beat of
          the interaction.
        */}
        <ol className="mt-10 lg:mt-14" onKeyDown={onKeyDown}>
          {servicePillars.map((service, index) => (
            <li
              key={service.id}
              ref={register(index)}
              className="sticky"
              style={{ top: offsetFor(index), zIndex: index + 1 }}
            >
              <ServiceCard
                service={service}
                index={index}
                total={total}
                isActive={activeIndex === index}
                onSelect={() => goTo(index)}
              />
            </li>
          ))}
          {/*
            Runway, and it has to live inside the list.

            Two things depend on its height. A sticky element can only travel
            within its containing block, so with this outside the `<ol>` the
            whole stack unpinned the instant the last card's box ended — the
            cards slid away under their own steam instead of holding. And the
            section that follows is pulled up over this same distance (see
            WhyEarneazi), so this is also the runway across which the covering
            panel crosses the stack.

            Keep the two in step: this height and that negative margin are one
            number expressed twice.
          */}
          <li aria-hidden="true" className="h-[78vh]" />
        </ol>
      </Container>
    </Section>
  );
}

interface ServiceCardProps {
  service: ServicePillar;
  index: number;
  total: number;
  isActive: boolean;
  onSelect: () => void;
}

function ServiceCard({ service, index, total, isActive, onSelect }: ServiceCardProps) {
  const Icon = service.icon;
  const Mark = serviceMarks[service.id];

  return (
    <article
      aria-labelledby={`service-${service.id}-title`}
      className={cn(
        /*
          Opaque, and that is the whole mechanism: the card above is hidden
          because this one is painted over it, not because it was faded out.
          A translucent surface here would break the effect completely.
        */
        'overflow-hidden rounded-band border border-divider bg-surface shadow-lg',
        /* Only the border reacts to state. Nothing moves, nothing scales. */
        'transition-[border-color] duration-base ease-out',
        isActive && 'border-brand'
      )}
    >
      {/*
        The strip. Exactly STRIP tall, because this is what stays visible
        once the next card covers the rest. It is a button so the stack can
        be driven from the keyboard, and so a covered card can be returned to
        by clicking its label — the affordance its presence already implies.
      */}
      <button
        type="button"
        data-stack-label
        onClick={onSelect}
        aria-current={isActive ? 'true' : undefined}
        className={cn(
          'flex h-[3.25rem] w-full items-center gap-3 px-5 text-left sm:px-6 lg:px-7',
          'transition-colors duration-base ease-out',
          isActive ? 'bg-brand text-on-brand' : 'bg-surface-sunken text-ink hover:bg-hovered'
        )}
      >
        <span className={cn('font-display text-body-sm font-semibold tabular', !isActive && 'text-ink-muted')}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <Icon size={17} strokeWidth={isActive ? 1.75 : 1.5} aria-hidden="true" className="shrink-0" />
        <span className="truncate font-display text-title-sm font-semibold">{service.title}</span>
        <span
          className={cn(
            'ms-auto shrink-0 font-display text-legal tabular',
            isActive ? 'text-on-brand/75' : 'text-ink-muted'
          )}
        >
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </button>

      <div className="p-5 sm:p-6 lg:p-7">
        <p className="max-w-prose text-body-sm font-medium text-brand-ink">{service.tagline}</p>

        <div className="mt-4 grid gap-6 md:grid-cols-12">
          <div className="min-w-0 md:col-span-7">
            <p className="text-body text-ink-secondary">{service.summary}</p>

            <ul className="mt-5 flex flex-col gap-2.5">
              {service.highlights.slice(0, 3).map((highlight) => (
                <li key={highlight} className="flex items-start gap-2.5 text-body-sm text-ink-secondary">
                  <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-pill bg-brand" />
                  <span className="leading-snug">{highlight}</span>
                </li>
              ))}
            </ul>

            <h4 className="mt-6 font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {service.categories.label}
            </h4>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {service.categories.items.slice(0, 6).map((category) => (
                <li
                  key={category}
                  className="inline-flex items-center rounded-pill border border-divider bg-surface-sunken px-2.5 py-0.5 text-legal font-medium text-ink-secondary"
                >
                  {category}
                </li>
              ))}
              {service.categories.items.length > 6 && (
                <li className="inline-flex items-center px-1 text-legal text-ink-muted">
                  +{service.categories.items.length - 6} more
                </li>
              )}
            </ul>
          </div>

          {/* The mark. Below `md` the card is one column and a diagram would
              be the first thing squeezing the words. */}
          {Mark && (
            <div className="hidden h-[10rem] md:col-span-5 md:block lg:h-[11rem]">
              <Mark active={isActive} />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-divider pt-5">
          <Link to={service.href} variant="standalone" trailingIcon={<ArrowUpRight size={15} aria-hidden="true" />}>
            More on {service.shortTitle.toLowerCase()}
          </Link>
          <Button to={service.nextStep.to} size="sm" trailingIcon={<ArrowRight size={14} aria-hidden="true" />}>
            {service.nextStep.label}
          </Button>
        </div>
      </div>

      {/* Names the card for assistive technology without repeating the title
          visually — the strip already shows it. */}
      <h3 id={`service-${service.id}-title`} className="sr-only">
        {service.title}
      </h3>
    </article>
  );
}
