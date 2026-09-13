import { useRef } from 'react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Link } from '@/components/ui/Link';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';
import { clipRevealVariants } from '@/lib/motion/variants';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollStory, useStoryFrame } from '@/hooks/useScrollStory';
import type { ScrollStory } from '@/hooks/useScrollStory';
import { servicePillars } from '@/data/services';
import type { ServiceCategories, ServicePillar } from '@/types/content';
import { cn } from '@/lib/utils/cn';
import { serviceMarks } from './ServiceVisuals';
import { StoryHeadings, StoryTrack } from './StoryStage';
import type { StoryItem } from './StoryStage';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { serviceConversation } from '@/lib/contact/conversation';

/**
 * "Three things we do, coordinated by one person." — Phase 3.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * ONE STORY, READ BY SCROLLING
 * ═════════════════════════════════════════════════════════════════════════
 *
 * One service card occupies one place, and scrolling moves the story from
 * 01 to 02 to 03: the reader reads a card, it holds with its end on screen,
 * and further scrolling draws the next card up into the same place while the
 * current one recedes — continuously, a little scroll for a little change
 * (hooks/useScrollStory.ts). After 03 the section releases into the page.
 *
 *   ≥1024px   The approved two columns. The left column — progress, the
 *             service being read, the numbered rail — is pinned beside the
 *             card (Phase 0 §19.2); the meter, the title and the rail's
 *             marker all follow the scroll continuously.
 *
 *   <1024px   The numbered headings stacked vertically above the card,
 *             pinned while the story plays (StoryStage.tsx), with the card
 *             beneath them.
 *
 * The rail rows and the headings are buttons: choosing one scrolls to that
 * service, so the scroll position stays the only state there is.
 *
 * ── Colour ──────────────────────────────────────────────────────────────
 *
 * Each service owns an accent, declared once as `data-tone` on the card and
 * its rail row (see the SUBJECT TONE CHANNEL in globals.css). Every
 * accent-coloured thing under it reads the tone channel, so this file names
 * no colour and both themes get independently tuned instances for free.
 */

const storyItems: StoryItem[] = servicePillars.map((service) => ({
  id: service.id,
  title: service.title,
  icon: service.icon,
}));

/** One rail row, in rem — the marker's glide is a multiple of it. */
const RAIL_ROW_REM = 3.25;

export function ServicesShowcase() {
  /*
    Read synchronously on first render rather than in an effect, so the
    correct composition is the first thing painted.
  */
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = usePrefersReducedMotion();
  const total = servicePillars.length;
  const story = useScrollStory({
    count: total,
    layout: isDesktop ? 'side' : 'stacked',
    reducedMotion: prefersReducedMotion,
  });

  const panel = (index: number) => <ServicePanel service={servicePillars[index]} index={index} />;

  return (
    /*
      A chapter, entered as a layer: the sunken ground and the rounded top
      edge riding over the goals section above make the boundary a change of
      surface rather than a gap (§19.1). No `overflow` on this section — the
      story inside it pins.
    */
    <Section
      id="services"
      spacing="lg"
      background="sunken"
      slab
      className="relative z-10 shadow-md"
      aria-labelledby="services-heading"
    >
      <Container size="content">
        <Reveal variants={clipRevealVariants} className="max-w-[36rem]">
          <Eyebrow>Three core services</Eyebrow>
          <h2 id="services-heading" className="mt-4 text-display-lg text-ink-display">
            Three things we do, coordinated by one person.
          </h2>
          <p className="mt-4 max-w-measure text-body-lg text-ink-secondary">
            Most people arrive needing one of these and leave having sorted out how all three fit together.
          </p>
        </Reveal>

        {isDesktop ? (
          <div className="mt-14 grid grid-cols-12 gap-x-12">
            <div className="col-span-4">
              <PinnedColumn story={story} />
            </div>
            <StoryTrack className="col-span-8" story={story} count={total} renderPanel={panel} />
          </div>
        ) : (
          <div className="mt-10">
            <StoryHeadings story={story} items={storyItems} label="Our services" noun="Service" ground="sunken" />
            <StoryTrack story={story} count={total} renderPanel={panel} />
            <p className="mt-8">
              <Link to="/services" variant="standalone" trailingIcon={<ArrowRight size={15} aria-hidden="true" />}>
                All services in detail
              </Link>
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DESKTOP — the pinned premise
   ═══════════════════════════════════════════════════════════════════════ */

function PinnedColumn({ story }: { story: ScrollStory }) {
  const total = servicePillars.length;
  const active = servicePillars[story.dominant];
  const meter = useRef<HTMLSpanElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const titles = useRef<(HTMLDivElement | null)[]>([]);

  useStoryFrame(story, (frame) => {
    if (meter.current) meter.current.style.transform = `scaleX(${Math.max(0.02, frame.overall).toFixed(4)})`;
    if (marker.current) {
      marker.current.style.transform = `translate3d(0, ${(frame.marker * RAIL_ROW_REM).toFixed(3)}rem, 0)`;
    }
    frame.opacities.forEach((opacity, index) => {
      const title = titles.current[index];
      if (!title) return;
      title.style.opacity = opacity.toFixed(3);
      title.style.visibility = opacity < 0.01 ? 'hidden' : 'visible';
    });
  });

  return (
    /* The premise, pinned beside the card for as long as the story plays. */
    <div className="sticky top-[calc(var(--header-height)_+_2rem)]">
      {/* ── Progress ───────────────────────────────────────────────── */}
      <div className="flex items-baseline justify-between">
        <span className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
          Now reading
        </span>
        <span className="font-display text-legal font-semibold tabular text-ink-muted">
          {String(story.dominant + 1).padStart(2, '0')} <span aria-hidden="true">/</span>{' '}
          {String(total).padStart(2, '0')}
        </span>
      </div>

      {/*
        One continuous meter across the whole story, following the scroll.
        It is `aria-hidden` because the rail underneath already states
        position accessibly, and a second announcement of the same fact is
        noise.
      */}
      <div aria-hidden="true" className="relative mt-3 h-[3px] w-full overflow-hidden rounded-pill bg-divider">
        <span
          ref={meter}
          data-tone={active.id}
          className="absolute inset-0 origin-left rounded-pill bg-tone transition-colors duration-slow ease-out"
        />
      </div>

      {/* ── The service being read ─────────────────────────────────────
          All three, stacked in one place, each as visible as its card. */}
      <div className="mt-7 grid min-h-[8.5rem]" aria-hidden="true">
        {servicePillars.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              ref={(node) => {
                titles.current[index] = node;
              }}
              data-tone={service.id}
              className={cn('col-start-1 row-start-1', index > 0 && 'invisible opacity-0')}
            >
              <span className="lit lit-tone inline-flex h-11 w-11 items-center justify-center rounded-surface bg-tone-fill text-on-tone">
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="mt-4 text-display-xs text-ink-display">{service.title}</p>
              <p className="mt-1.5 text-body-sm font-medium text-tone">{service.tagline}</p>
            </div>
          );
        })}
      </div>

      {/* ── The rail ───────────────────────────────────────────────────
          Buttons in a group: each scrolls to its service. The marker is one
          object that glides between rows with the scroll. */}
      <div className="relative mt-6 border-t border-divider" role="group" aria-label="Choose a service">
        <span
          ref={marker}
          aria-hidden="true"
          data-tone={active.id}
          className="pointer-events-none absolute left-0 top-2 h-9 w-[3px] rounded-pill bg-tone transition-colors duration-slow ease-out"
        />
        {servicePillars.map((service, index) => {
          const isActive = index === story.dominant;
          const RailIcon = service.icon;

          return (
            <button
              key={service.id}
              id={'service-rail-' + service.id}
              type="button"
              data-tone={service.id}
              onClick={() => story.select(index)}
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'relative flex h-[3.25rem] w-full items-center gap-3 border-b border-divider pl-4 pr-2 text-left',
                'transition-colors duration-base ease-out',
                isActive ? 'text-ink-display' : 'text-ink-secondary hover:bg-hovered hover:text-ink'
              )}
            >
              <span
                className={cn(
                  'font-display text-legal font-semibold tabular transition-colors duration-base ease-out',
                  isActive ? 'text-tone' : 'text-ink-muted'
                )}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <RailIcon
                size={17}
                strokeWidth={isActive ? 1.75 : 1.5}
                aria-hidden="true"
                className={cn('shrink-0 transition-colors duration-base ease-out', isActive ? 'text-tone' : 'text-ink-muted')}
              />
              <span className="truncate font-display text-title-sm font-semibold">{service.title}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-6">
        <Link to="/services" variant="standalone" trailingIcon={<ArrowRight size={15} aria-hidden="true" />}>
          All services in detail
        </Link>
      </p>

      <p aria-live="polite" className="sr-only">
        {`Service ${story.dominant + 1} of ${total}: ${active.title}`}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   THE CARD — the approved service card
   ═══════════════════════════════════════════════════════════════════════ */

function ServicePanel({ service, index }: { service: ServicePillar; index: number }) {
  const Icon = service.icon;
  const Mark = serviceMarks[service.id];
  /* Two labelled groups where the service defines them, the flat list
     otherwise — the type keeps `categoryGroups` optional so a service can be
     added with the plain list alone. */
  const groups: ServiceCategories[] = service.categoryGroups ?? [service.categories];

  return (
    <article
      data-tone={service.id}
      aria-labelledby={'service-' + service.id + '-title'}
      className="raised relative overflow-hidden rounded-band border border-tone/35 bg-surface"
    >
      {/* The leading edge: the service's accent, stated once at its top. */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-tone-fill" />
      {/* The field behind the header, so the card has depth without a
          gradient surface fill (§10.3). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-pill bg-tone opacity-[0.14] blur-3xl"
      />

      <div className="relative p-6 sm:p-7 lg:p-8">
        <header className="flex items-start gap-4">
          <span className="lit lit-tone inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-surface border border-transparent bg-tone-fill text-on-tone">
            <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
          </span>

          <div className="min-w-0">
            <span className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Service {String(index + 1).padStart(2, '0')}
            </span>
            <h3 id={'service-' + service.id + '-title'} className="mt-1 text-display-xs text-ink-display">
              {service.title}
            </h3>
          </div>
        </header>

        <p className="mt-5 max-w-prose text-body-lg font-medium text-tone">{service.tagline}</p>

        <div className="mt-6 grid gap-7 md:grid-cols-12 md:gap-8">
          <div className="min-w-0 md:col-span-7">
            <p className="text-body text-ink-secondary">{service.summary}</p>

            <ul className="mt-5 flex flex-col gap-3">
              {service.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-body-sm text-ink">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-tone-tint text-tone"
                  >
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  <span className="leading-snug">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 md:col-span-5">
            {/* The mark. Below `md` it sits under the copy rather than beside
                it, and it is never the thing squeezing the words. */}
            {Mark && (
              <div className="h-40 lg:h-44">
                <Mark active />
              </div>
            )}

            <div className="inset-well rounded-surface border border-divider bg-surface-sunken p-4">
              <h4 className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Who it&rsquo;s for
              </h4>
              <p className="mt-2 text-body-sm text-ink-secondary">{service.whoItsFor}</p>
            </div>
          </div>
        </div>

        {/*
          The breadth signal, restored from the previous site (§21).

          Category names only. No rate, no limit, no lender, no insurer:
          those are volatile, unverified, or both (§3.4), and nothing in this
          section may acquire one.
        */}
        <div className="mt-7 grid gap-6 border-t border-divider pt-6 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.label}>
              <h4 className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
                {group.label}
              </h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="edge-top inline-flex items-center rounded-pill border border-tone/25 bg-tone-tint px-2.5 py-1 text-legal font-medium text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-divider pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link to={service.href} variant="standalone" trailingIcon={<ArrowUpRight size={15} aria-hidden="true" />}>
            More on {service.shortTitle.toLowerCase()}
          </Link>

          {/*
            Two kinds of next step, and only one of them is a conversation.
            A service whose own next step is a tool (the SIP calculator)
            keeps that link; the rest go through the shared conversation
            control carrying which service they came from, so the pre-filled
            message names it (§25's contextual entry points).
          */}
          {service.nextStep.to === '/contact' ? (
            <ConversationCta context={serviceConversation(service.id)} size="md">
              {service.nextStep.label}
            </ConversationCta>
          ) : (
            <Button to={service.nextStep.to} size="md" trailingIcon={<ArrowRight size={15} aria-hidden="true" />}>
              {service.nextStep.label}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
