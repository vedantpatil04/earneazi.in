import { useCallback, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Link } from '@/components/ui/Link';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';
import { clipRevealVariants } from '@/lib/motion/variants';
import { duration, easing, travel } from '@/lib/motion/tokens';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { servicePillars } from '@/data/services';
import type { ServiceCategories, ServicePillar } from '@/types/content';
import { cn } from '@/lib/utils/cn';
import { serviceMarks } from './ServiceVisuals';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { serviceConversation } from '@/lib/contact/conversation';

/**
 * "Three things we do, coordinated by one person." — Phase 3.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * TWO EXPERIENCES, ONE STORY
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The section is deliberately built twice, because a pointer with a long
 * scroll and a thumb on a 360px screen are not the same instrument and the
 * phase brief is explicit that the small version must not be the large one
 * shrunk. Both tell the same three services in the same order with the same
 * content — `ServicePanel` is shared, so there is one copy of the words —
 * and they differ only in how you move between them.
 *
 *   ≥1024px   PINNED PREMISE (Phase 0 §19.2, the device measured off the
 *             motion reference). The left column holds position while the
 *             three panels travel past it. The pinned column is not a static
 *             caption: it names the service you are currently on, in display
 *             type, and re-states it as the panels advance — so the premise
 *             and the detail are visibly one system rather than a heading
 *             followed by three unrelated cards.
 *
 *   <1024px   TAB DECK. A real ARIA tablist above a single panel. Tapping is
 *             the whole interaction, the strip scrolls horizontally if the
 *             labels need it, targets are 44px, and the panel slides in from
 *             the side you moved toward so the change has a direction. No
 *             pinning, no scroll-linked anything, nothing waiting on a
 *             scroll position — a thumb should not have to scroll three
 *             viewports to see the third service.
 *
 * ── How "active" is decided, and why it is honest ───────────────────────
 *
 * On desktop the pinning is `position: sticky` and nothing else: no scroll
 * listener moves a pixel, so the composition tracks the finger exactly and
 * survives a dragged scrollbar, a flung trackpad and an anchor jump into the
 * middle of the section. `useScrollSpy` only *reports* which panel is being
 * read, so the rail's `aria-current`, the progress meter and the pinned
 * title stay true to what is on screen. Clicking a rail row scrolls to that
 * panel — scroll progression and direct selection are the same control,
 * which is what the brief asks for.
 *
 * ── Colour ──────────────────────────────────────────────────────────────
 *
 * Each service owns an accent, declared once as `data-tone` on the panel and
 * the rail row (see the SUBJECT TONE CHANNEL in globals.css). Every
 * accent-coloured thing under it — the leading edge, the icon tile, the
 * bullet discs, the category chips, the mark's strokes and fills — reads the
 * tone channel, so this file names no colour at all and both themes get
 * independently tuned instances for free.
 *
 * §10.3's three-visible-colours rule still holds, because only the *active*
 * service shows its accent at full strength; the other two sit neutral.
 * That is also what makes the active state legible without moving anything.
 *
 * ── Motion budget ───────────────────────────────────────────────────────
 *
 * One device: the pin. Everything else is a state change — a border, a fill,
 * a cross-fade of the pinned title, a progress meter tracking scroll. No
 * card lifts, nothing parallaxes, nothing travels further than the 24px
 * content-entrance budget, and every panel renders its final state in base
 * CSS, so the section is complete and readable with scripting or animation
 * doing nothing at all.
 */

export function ServicesShowcase() {
  /*
    Read synchronously on first render rather than in an effect, so the
    correct experience is the first thing painted instead of the mobile deck
    swapping to the pinned layout a frame later.
  */
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    /*
      A chapter, entered as a layer: the sunken ground and the rounded top
      edge riding over the goals section above make the boundary a change of
      surface rather than a gap (§19.1). The overlap is `slab`'s own margin,
      so it cannot leave a seam if the section above changes height.
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

        {isDesktop ? <PinnedServices /> : <ServiceDeck />}
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DESKTOP — pinned premise, travelling panels
   ═══════════════════════════════════════════════════════════════════════ */

function PinnedServices() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const panelsRef = useRef<HTMLOListElement>(null);
  const total = servicePillars.length;
  const { register, activeIndex, goTo } = useScrollSpy({ count: total });

  /*
    Scroll progress across the panels, as a motion value — it never causes a
    React render, so the meter can track the scroll position continuously
    while the rest of the section re-renders two or three times in total.

    The offset brackets the reading line rather than the viewport edges, so
    the meter reaches full exactly as the last panel arrives rather than a
    viewport later.
  */
  const { scrollYProgress } = useScroll({ target: panelsRef, offset: ['start 0.6', 'end 0.75'] });
  const meterScale = useTransform(scrollYProgress, [0, 1], [0.02, 1]);

  const active = servicePillars[activeIndex];
  const ActiveIcon = active.icon;

  return (
    <div className="mt-14 grid grid-cols-12 gap-x-12">
      <div className="col-span-4">
        {/*
          The premise, pinned. `sticky` is CSS and costs nothing per frame;
          §19.2 nonetheless switches it off under reduced motion, because a
          column that holds still while its neighbour moves is itself a
          motion effect to anyone who has asked for none.
        */}
        <div className={cn(!prefersReducedMotion && 'sticky top-[calc(var(--header-height)_+_2rem)]')}>
          {/* ── Progress ───────────────────────────────────────────────── */}
          <div className="flex items-baseline justify-between">
            <span className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Now reading
            </span>
            <span className="font-display text-legal font-semibold tabular text-ink-muted">
              {String(activeIndex + 1).padStart(2, '0')} <span aria-hidden="true">/</span>{' '}
              {String(total).padStart(2, '0')}
            </span>
          </div>

          {/*
            One continuous meter with a tick per service, rather than three
            separate bars: progress through the section is a single quantity
            and should be drawn as one. It is `aria-hidden` because the rail
            underneath already states position accessibly, and a second
            announcement of the same fact is noise.
          */}
          <div aria-hidden="true" className="relative mt-3 h-[3px] w-full overflow-hidden rounded-pill bg-divider">
            {prefersReducedMotion ? (
              <span
                className="absolute inset-y-0 left-0 rounded-pill bg-tone"
                style={{ width: ((activeIndex + 1) / total) * 100 + '%' }}
                data-tone={active.id}
              />
            ) : (
              <motion.span
                data-tone={active.id}
                className="absolute inset-y-0 left-0 w-full origin-left rounded-pill bg-tone"
                style={{ scaleX: meterScale }}
              />
            )}
          </div>

          {/* ── The service being read ─────────────────────────────────── */}
          <div className="mt-7 min-h-[8.5rem]" data-tone={active.id} aria-hidden="true">
            {/* Keyed remount, not AnimatePresence — see the note on the deck
                panel below for why  is not used anywhere in
                this section. */}
            <motion.div
              key={active.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: duration.base, ease: easing.out }}
            >
                <span className="lit lit-tone inline-flex h-11 w-11 items-center justify-center rounded-surface bg-tone-fill text-on-tone">
                  <ActiveIcon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p className="mt-4 text-display-xs text-ink-display">{active.title}</p>
                <p className="mt-1.5 text-body-sm font-medium text-tone">{active.tagline}</p>
            </motion.div>
          </div>

          {/* ── The rail ───────────────────────────────────────────────
              Buttons in a group, not a tablist, and deliberately so. All
              three panels are on the page and readable at once; these rows
              scroll you to one, they do not reveal it. Calling them tabs
              would promise a disclosure that is not happening, so they get
              no roving tabindex and no arrow-key capture either: every row
              is in the tab order, Enter activates it, and the arrow keys go
              on scrolling the page the way a reader expects them to.

              The goals section below IS a tablist, and has the full roving
              tabindex and arrow-key behaviour — because there, one panel
              genuinely replaces another. */}
          <div
            className="mt-6 border-t border-divider"
            role="group"
            aria-label="Choose a service"
          >
            {servicePillars.map((service, index) => {
              const isActive = index === activeIndex;
              const RailIcon = service.icon;

              return (
                <button
                  key={service.id}
                  id={'service-rail-' + service.id}
                  type="button"
                  data-tone={service.id}
                  onClick={() => goTo(index)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative flex min-h-[3.25rem] w-full items-center gap-3 border-b border-divider pl-4 pr-2 text-left',
                    'transition-colors duration-base ease-out',
                    isActive ? 'text-ink-display' : 'text-ink-secondary hover:bg-hovered hover:text-ink'
                  )}
                >
                  {/*
                    The marker moves between rows as one object rather than
                    switching off here and on there — a shared element, which
                    is the one place §18.3 allows that device outside the nav.
                  */}
                  {isActive &&
                    (prefersReducedMotion ? (
                      <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] rounded-pill bg-tone" />
                    ) : (
                      <motion.span
                        aria-hidden="true"
                        layoutId="service-rail-marker"
                        className="absolute inset-y-2 left-0 w-[3px] rounded-pill bg-tone"
                        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                      />
                    ))}

                  <span
                    className={cn(
                      'font-display text-legal font-semibold tabular',
                      isActive ? 'text-tone' : 'text-ink-muted'
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <RailIcon
                    size={17}
                    strokeWidth={isActive ? 1.75 : 1.5}
                    aria-hidden="true"
                    className={cn('shrink-0', isActive ? 'text-tone' : 'text-ink-muted')}
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
        </div>
      </div>

      {/*
        The travelling counterpart.

        `relative` because it is the scroll target the progress meter is
        measured against, and Framer cannot compute an offset inside a
        statically positioned container — it warns about exactly this. It is
        safe here: position alone creates no stacking context without a
        z-index, and the pinned column is a sibling rather than a child.

        What must stay off this list is `overflow` and `z-index`: either one
        would make it a scroll container or a stacking context and break the
        sticky relationship the section is built on.

        No entrance wrapper on the panels, deliberately. These three are the
        section's content, not its decoration: a scroll-triggered reveal
        would start them at opacity 0 and leave them there if the
        IntersectionObserver never fired, which is precisely the failure
        §18.2.4 exists to prevent and the one defect the motion reference is
        criticised for in §4.3. They render their final state in base CSS and
        are readable with scripting doing nothing at all. It would also be a
        second signature device in a section that already has one (the pin),
        which §18.2.2 does not allow.
      */}
      <ol ref={panelsRef} className="relative col-span-8 flex flex-col gap-8">
        {servicePillars.map((service, index) => (
          <li key={service.id} ref={register(index)} className="scroll-mt-[calc(var(--header-height)_+_2rem)]">
            <ServicePanel service={service} index={index} active={index === activeIndex} />
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MOBILE / TABLET — tab deck
   ═══════════════════════════════════════════════════════════════════════ */

function ServiceDeck() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  /* Which way the reader moved, so the incoming panel enters from that side.
     Direction is the only thing this animation encodes; without it a slide
     would be decoration. */
  const [direction, setDirection] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const total = servicePillars.length;

  const select = useCallback(
    (next: number, { focus = false }: { focus?: boolean } = {}) => {
      setDirection(next > activeIndex ? 1 : -1);
      setActiveIndex(next);
      const tab = document.getElementById('service-tab-' + servicePillars[next].id);
      if (focus) tab?.focus();
      /* Keep the chosen tab on screen when the strip is scrolled. `nearest`
         so a tab already visible is not yanked to the edge. */
      tab?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        inline: 'nearest',
        block: 'nearest',
      });
    },
    [activeIndex, prefersReducedMotion]
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        select((activeIndex + 1) % total, { focus: true });
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        select((activeIndex - 1 + total) % total, { focus: true });
        break;
      case 'Home':
        event.preventDefault();
        select(0, { focus: true });
        break;
      case 'End':
        event.preventDefault();
        select(total - 1, { focus: true });
        break;
      default:
        break;
    }
  };

  const active = servicePillars[activeIndex];
  const enter = prefersReducedMotion ? 0 : travel.md;

  return (
    <div className="mt-10">
      {/* The strip. `rail-x` is the site's one designed horizontal scroller
          (globals.css) — three labels fit on most phones and scroll on a
          360px one rather than wrapping into a second row. */}
      <div className="relative">
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Our services"
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="rail-x rail-fade -mx-gutter gap-2 px-gutter pb-1"
        >
          {servicePillars.map((service, index) => {
            const isActive = index === activeIndex;
            const TabIcon = service.icon;

            return (
              <button
                key={service.id}
                id={'service-tab-' + service.id}
                type="button"
                role="tab"
                data-tone={service.id}
                aria-selected={isActive}
                aria-controls={'service-tabpanel-' + service.id}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(index)}
                className={cn(
                  /* 44px minimum on the short axis, and the whole chip is the
                     target — there is no separate affordance inside it. */
                  'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-pill border px-4',
                  'font-display text-body-sm font-semibold',
                  'transition-[background-color,border-color,color] duration-fast ease-out',
                  isActive
                    ? 'lit lit-tone border-transparent bg-tone-fill text-on-tone'
                    : 'edge-top border-divider bg-surface text-ink-secondary hover:border-border hover:text-ink'
                )}
              >
                <TabIcon size={16} strokeWidth={isActive ? 1.75 : 1.5} aria-hidden="true" />
                <span className="whitespace-nowrap">{service.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={'service-tabpanel-' + active.id}
        role="tabpanel"
        aria-labelledby={'service-tab-' + active.id}
        tabIndex={0}
        className="mt-6 focus-visible:outline-none"
      >
        {/*
          Keyed remount rather than AnimatePresence.

          Two reasons, one of them a defect.  holds the incoming
          panel until the outgoing one has finished exiting, which under
          React's StrictMode double-invocation deadlocks outright — the
          exiting child never signals that it is safe to remove and the panel
          stops changing at all. It is also the wrong shape for a tab strip:
          a tap should be answered now, not after a 240ms exit that carries
          no information the entrance does not already carry.

          Changing the key remounts the panel, so React swaps the content
          immediately and Framer runs only the entrance — from the side the
          reader moved toward, which is the one thing the movement encodes.
        */}
        <motion.div
          key={active.id}
          initial={{ opacity: 0, x: direction * enter }}
          animate={{ opacity: 1, x: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: duration.base, ease: easing.out }}
        >
          <ServicePanel service={active} index={activeIndex} active />
        </motion.div>
      </div>

      <p className="mt-8">
        <Link to="/services" variant="standalone" trailingIcon={<ArrowRight size={15} aria-hidden="true" />}>
          All services in detail
        </Link>
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   THE PANEL — one component, both experiences
   ═══════════════════════════════════════════════════════════════════════ */

interface ServicePanelProps {
  service: ServicePillar;
  index: number;
  /** Raises the accent. Always true in the tab deck, where only one shows. */
  active: boolean;
}

function ServicePanel({ service, index, active }: ServicePanelProps) {
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
      className={cn(
        'relative overflow-hidden rounded-band border bg-surface',
        'transition-[border-color,box-shadow] duration-base ease-out',
        /* Enhancement A: the panel being read is raised; the others rest
           flat on the page, so the active one reads as nearer, not just
           brighter. */
        active ? 'raised border-tone/35' : 'border-divider'
      )}
    >
      {/* The leading edge. The panel's accent, stated once at its top — the
          only place the service's colour appears at full strength on an
          inactive panel, so the set still reads as three coloured subjects
          when none of them is active. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 top-0 h-1 bg-tone-fill transition-opacity duration-base ease-out',
          active ? 'opacity-100' : 'opacity-40'
        )}
      />
      {/* The field behind the header, so the panel has depth without a
          gradient surface fill (§10.3). */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-pill bg-tone blur-3xl',
          'transition-opacity duration-slow ease-out',
          active ? 'opacity-[0.14]' : 'opacity-[0.05]'
        )}
      />

      <div className="relative p-6 sm:p-7 lg:p-8">
        <header className="flex items-start gap-4">
          <span
            className={cn(
              'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-surface',
              'transition-[background-color,border-color,color] duration-base ease-out',
              active
                ? 'lit lit-tone border border-transparent bg-tone-fill text-on-tone'
                : 'edge-top border border-tone/25 bg-tone-tint text-tone'
            )}
          >
            <Icon size={22} strokeWidth={active ? 1.75 : 1.5} aria-hidden="true" />
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
                <Mark active={active} />
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

          Eight categories per service is what told a visitor "we actually do
          all of this", and the current build had compressed it to three
          bullet points. It comes back as two labelled groups of four rather
          than a wall of cards or a flat run of chips — same information,
          sorted the way a reader sorts it.

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
                    className={cn(
                      'inline-flex items-center rounded-pill border px-2.5 py-1 text-legal font-medium',
                      'transition-[background-color,border-color,color] duration-base ease-out',
                      active
                        ? 'edge-top border-tone/25 bg-tone-tint text-ink'
                        : 'border-divider bg-surface-sunken text-ink-secondary'
                    )}
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
