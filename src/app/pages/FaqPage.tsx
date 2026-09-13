import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { DisclosureRow } from '@/components/ui/DisclosureRow';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { generalConversation } from '@/lib/contact/conversation';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { groupFaqItems, visibleFaqItems } from '@/data/faq';
import { buildFaqJsonLd, serializeJsonLd } from '@/lib/seo/faqJsonLd';
import { cn } from '@/lib/utils/cn';

/**
 * The FAQ — Phase 6.
 *
 * ── One disclosure system ───────────────────────────────────────────────
 *
 * This page used to run its own `Accordion`, which unmounted every closed
 * answer. That left two disclosure implementations on the site and, worse,
 * answers that were absent from the DOM until opened — invisible to a
 * crawler, and out of step with any structured data describing them. It now
 * uses `DisclosureRow`, the shared row §26 names, whose panels are always
 * rendered and simply `inert` while closed.
 *
 * ── Scanning, not searching ─────────────────────────────────────────────
 *
 * Eleven questions sit below §26's ~12-question threshold, so there is no
 * search box — at this size it would be chrome. What helps instead is seeing
 * the whole shape at once: a topic rail with counts, which pins beside the
 * list on a laptop and becomes a swipeable chip row on a phone, and which
 * follows the reader's position using the same scroll-spy hook the services
 * section uses.
 *
 * ── Addresses ───────────────────────────────────────────────────────────
 *
 * Every question has a stable public address, `/faq#<id>`. Arriving on one
 * opens that question, and `ScrollManager` scrolls to it clear of the header
 * and moves focus there — re-aiming as the opening panel changes the layout,
 * which it already does for late-arriving content. Each open answer offers
 * its own address as a link, so a touch user can share a question without
 * knowing the URL scheme exists.
 *
 * ── Keyboard ────────────────────────────────────────────────────────────
 *
 * Tab moves through triggers and into open answers as normal; Enter and
 * Space toggle, from the native button. Up and Down move between triggers
 * across every topic, Home and End jump to the ends — the behaviour expected
 * of a set of headings, handled once on the list rather than per row.
 *
 * ── Motion ──────────────────────────────────────────────────────────────
 *
 * The row's own: height and opacity over `dur-base`, and the plus rotating to
 * a minus. No scroll-fade on the questions — an FAQ someone came to read
 * should not make them wait for it to arrive. Answers are in the DOM from the
 * first render, so nothing here depends on an animation having run.
 */

const FAQ_GROUPS = groupFaqItems();
const QUESTION_IDS = new Set(visibleFaqItems().map((item) => item.id));
const FAQ_JSON_LD = serializeJsonLd(buildFaqJsonLd(visibleFaqItems()));

/** The question a URL hash names, or null for anything else — including a topic heading. */
function questionFromHash(hash: string): string | null {
  if (!hash) return null;
  const id = decodeURIComponent(hash.slice(1));
  return QUESTION_IDS.has(id) ? id : null;
}

export default function FaqPage() {
  const { hash } = useLocation();
  const listRef = useRef<HTMLDivElement>(null);
  const [openIds, setOpenIds] = useState<string[]>(() => {
    const requested = questionFromHash(hash);
    return requested ? [requested] : [];
  });
  const { register, activeIndex } = useScrollSpy({ count: FAQ_GROUPS.length });

  /* A link to a question from elsewhere on the site — or from an answer on
     this page — changes the hash without remounting, so the question it names
     opens as the URL changes. Other open answers stay open: closing one above
     the reader would move the page out from under them. */
  useEffect(() => {
    const requested = questionFromHash(hash);
    if (!requested) return;
    setOpenIds((current) => (current.includes(requested) ? current : [...current, requested]));
  }, [hash]);

  const toggle = useCallback((id: string) => {
    setOpenIds((current) => (current.includes(id) ? current.filter((open) => open !== id) : [...current, id]));
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!target.matches('button[data-disclosure-trigger]')) return;

    const triggers = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('button[data-disclosure-trigger]') ?? []
    );
    const index = triggers.indexOf(target as HTMLButtonElement);
    if (index === -1) return;

    let next: number;
    switch (event.key) {
      case 'ArrowDown':
        next = (index + 1) % triggers.length;
        break;
      case 'ArrowUp':
        next = (index - 1 + triggers.length) % triggers.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = triggers.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    triggers[next]?.focus();
  };

  return (
    <PageShell title="Frequently asked questions">
      <PageHeader
        size="content"
        title="Questions people ask us first."
        lead="Short, plain answers to the things that come up most often. If yours isn’t here, it’s worth a conversation."
      />

      <Section spacing="md" aria-label="Questions">
        <Container size="content">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            {/* ── Topic rail ─────────────────────────────────────────── */}
            <aside className="min-w-0 lg:col-span-4">
              <div className="lg:sticky lg:top-[calc(var(--header-height)_+_2rem)]">
                <nav aria-label="Question topics">
                  <p className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
                    Browse by topic
                  </p>

                  <div className="relative mt-3">
                    <ul
                      className={cn(
                        /* A swipeable chip row on a phone — the site's one
                           designed horizontal scroller — and a ruled list on a
                           laptop. */
                        'rail-x max-lg:rail-fade -mx-gutter gap-2 px-gutter pb-1',
                        'lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-divider lg:px-0 lg:pb-0'
                      )}
                    >
                      {FAQ_GROUPS.map((group, index) => {
                        const active = index === activeIndex;
                        return (
                          <li key={group.headingId} className="shrink-0">
                            <RouterLink
                              to={{ hash: group.headingId }}
                              aria-current={active ? 'true' : undefined}
                              className={cn(
                                'flex min-h-11 items-center justify-between gap-3 whitespace-nowrap rounded-pill border px-4',
                                'text-body-sm font-semibold transition-colors duration-fast ease-out',
                                'lg:rounded-none lg:border-0 lg:border-b lg:border-divider lg:px-0 lg:py-2',
                                active
                                  ? 'lit border-transparent bg-brand text-on-brand lg:bg-transparent lg:bg-none lg:text-brand-ink lg:shadow-none'
                                  : 'edge-top border-divider bg-surface text-ink-secondary hover:text-ink lg:bg-transparent lg:shadow-none'
                              )}
                            >
                              <span>{group.category}</span>
                              <span className="font-display text-legal tabular opacity-80">{group.items.length}</span>
                            </RouterLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </nav>

                <div className="raised mt-8 hidden rounded-band border border-divider bg-surface p-5 lg:block">
                  <p className="text-body-sm font-semibold text-ink">Question not here?</p>
                  <p className="mt-1.5 text-body-sm text-ink-secondary">
                    The useful ones rarely fit on a page like this.
                  </p>
                  <ConversationCta context={generalConversation} variant="secondary" size="md" className="mt-4">
                    Ask us directly
                  </ConversationCta>
                </div>
              </div>
            </aside>

            {/* ── The questions ──────────────────────────────────────── */}
            <div ref={listRef} onKeyDown={onKeyDown} className="flex min-w-0 flex-col gap-12 md:gap-16 lg:col-span-8">
              {FAQ_GROUPS.map((group, index) => (
                <section key={group.headingId} ref={register(index)} aria-labelledby={group.headingId}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 id={group.headingId} className="text-display-sm text-ink-display">
                      {group.category}
                    </h2>
                    <span className="text-body-sm tabular text-ink-muted">
                      {group.items.length} {group.items.length === 1 ? 'question' : 'questions'}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-divider">
                    {group.items.map((item) => (
                      <DisclosureRow
                        key={item.id}
                        id={item.id}
                        anchorId={item.id}
                        open={openIds.includes(item.id)}
                        onToggle={() => toggle(item.id)}
                        title={item.question}
                        headingLevel="h3"
                      >
                        <p className="max-w-prose text-body text-ink-secondary">{item.answer}</p>
                        <RouterLink
                          to={{ hash: item.id }}
                          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-action text-body-sm font-medium text-brand-ink"
                        >
                          <Link2 size={15} strokeWidth={1.75} aria-hidden="true" />
                          <span className="link-draw">Link to this question</span>
                        </RouterLink>
                      </DisclosureRow>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQPage structured data, built from exactly the questions rendered
          above — see lib/seo/faqJsonLd.ts. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }} />

      <CtaBand
        id="faq-cta"
        title="Still have a question?"
        body="The ones worth asking usually don't fit on a page like this. Ask us directly and you'll get a straight answer."
        primary={{ label: 'Ask us directly', to: '/contact' }}
        secondary={{ label: 'See what we do', to: '/services' }}
      />
    </PageShell>
  );
}
