import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { Variants } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Clock, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { brand } from '@/config/brand';
import { Container } from '@/components/layout/Container';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeControl } from '@/components/ui/ThemeToggle';
import { DisclosureRow } from '@/components/ui/DisclosureRow';
import { Reveal } from '@/components/motion/Reveal';
import { WhatsAppGlyph } from '@/components/conversion/WhatsAppGlyph';
import {
  buildConversationMessage,
  contactRouteFor,
  generalConversation,
  resolveConversation,
  whatsAppHref,
} from '@/lib/contact/conversation';
import {
  contactChannelHref,
  contactEmail,
  contactPhone,
  socialProfiles,
  verifiedContactChannels,
} from '@/data/contact';
import { verifiedCredentials } from '@/data/credentials';
import {
  brandStatement,
  buildFooterGroups,
  founderAttribution,
  resolveLegalLinks,
  resolveSocialEntries,
  visibleLegalNotices,
} from '@/data/footer';
import type { FooterGroup, FooterLink, SocialEntry } from '@/data/footer';
import type { ContactChannel } from '@/types/content';
import { cn } from '@/lib/utils/cn';

/**
 * The footer — Phase 6, corrected.
 *
 * A compact, information-dense close in the register of a real
 * financial-services site: the brand mark as an anchor rather than a
 * poster, the full navigation within reach, recognisable contact marks, one
 * proportional call to action, and the legal line kept readable but
 * subordinate.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * STRUCTURE
 * ═════════════════════════════════════════════════════════════════════════
 *
 *   1  brand        the footer lockup and one positioning sentence
 *   2  navigation   what we do · plan around · tools · company
 *   3  connect      verified contact details, then Instagram, WhatsApp,
 *                   Email and Phone as brand-coloured marks
 *   4  conversion   "Book a consultation", on the one brand-blue surface
 *   5  legal        the market-risk line and the calculator line
 *   6  baseline     the computed year, the founder line, the theme control
 *
 * The document order is exactly that order, at every breakpoint, so keyboard
 * and screen-reader order match the reading order.
 *
 *   ≥1280px   brand · navigation (three columns, Tools and Company stacked)
 *             · connect with the call to action, in one row
 *   768–1279  brand across the top, navigation in three columns, then
 *             connect and the call to action side by side
 *   <768px    stacked, with the four navigation groups as compact accordions
 *             so the phone footer is short without hiding anything
 *
 * Every content decision — which links, which contact items, where each
 * social mark points, which notices — is made in data/footer.ts and tested
 * there. This file only draws the result, and draws nothing for an item that
 * is not confirmed: no pending state, no explanatory placeholder.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * THEMES
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Same structure, same scale, same type in both. What changes is the ground
 * and the lines (`--color-footer`, `--color-footer-line`, tuned per theme in
 * tokens.css): a cool blue-grey in light that separates from the page
 * without going grey, and a lifted ink in dark rather than black. Text uses
 * the ordinary ink tokens, which already carry measured contrast on both
 * grounds. The social marks keep their brand colours, with a per-theme edge
 * (`--shadow-social`) so they hold their shape against the dark ground.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * MOTION AND CONVERSION
 * ═════════════════════════════════════════════════════════════════════════
 *
 * One small entrance — the logo settles 8px into place the first time the
 * footer is reached — and hover feedback on links and marks. Nothing else
 * animates, and no link, contact item or legal line waits on an animation.
 *
 * "Book a consultation" is the Phase 5 consultation route, and WhatsApp is
 * the Phase 5 resolver: this file never assembles a `wa.me` URL.
 */

/** The logo's entrance: 8px and opacity. A settle, not a reveal. */
const LOGO_ENTRANCE: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

/** Focus on the brand-blue call-to-action surface: a white ring, so it is not lost against the blue. */
const onBrandFocus = {
  '--color-focus-ring': 'var(--color-on-brand)',
  '--color-focus-ring-inner': 'var(--color-brand)',
} as CSSProperties;

const CHANNEL_ICONS: Record<Exclude<ContactChannel['kind'], 'whatsapp'>, LucideIcon> = {
  phone: Phone,
  email: Mail,
  office: MapPin,
  hours: Clock,
};

const groupLabelClass = 'font-display text-legal font-semibold uppercase tracking-[0.12em] text-brand-ink';

export function Footer() {
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const groups = buildFooterGroups();
  const [whatWeDo, planAround, tools, company] = groups;
  const statement = brandStatement();
  const attribution = founderAttribution();
  const notices = visibleLegalNotices();
  const legalLinks = resolveLegalLinks();
  const chat = resolveConversation(generalConversation, 'Message Earneazi');
  const social = resolveSocialEntries({
    instagram: socialProfiles.find((profile) => profile.network === 'instagram'),
    whatsApp: chat,
    email: contactEmail,
    phone: contactPhone,
    contactRoute: contactRouteFor(generalConversation),
  });
  const year = new Date().getFullYear();

  const toggleGroup = (id: string) =>
    setOpenGroups((current) => (current.includes(id) ? current.filter((open) => open !== id) : [...current, id]));

  return (
    <footer className="relative border-t border-footer-line bg-footer text-ink">
      <Container size="shell">
        <div className="grid grid-cols-1 gap-y-8 pb-8 pt-10 md:gap-y-12 md:pb-10 md:pt-14 xl:grid-cols-12 xl:gap-x-10 xl:pb-12 xl:pt-16">
          {/* ── 1 · Brand ─────────────────────────────────────────────── */}
          <div className="md:flex md:items-start md:gap-12 xl:col-span-3 xl:block">
            <Reveal variants={LOGO_ENTRANCE} speed="base" className="shrink-0">
              <Logo lockup="footer" />
            </Reveal>

            <div className="mt-3 md:mt-2.5 xl:mt-4">
              <p className="max-w-[36ch] text-body-sm text-ink-secondary">{statement}</p>

              {/* Verified registrations only. With none, nothing renders —
                  a pending credential still reads as a credential. */}
              {verifiedCredentials.length > 0 && (
                <dl className="mt-4 flex flex-col gap-2">
                  {verifiedCredentials.map((credential) => (
                    <div key={credential.id} className="flex flex-wrap items-baseline gap-x-2">
                      <dt className="text-legal text-ink-muted">{credential.label}</dt>
                      <dd className="font-display text-legal font-semibold tabular text-ink">
                        {credential.identifierLabel} {credential.identifier}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>

          {/* ── 2 · Navigation ────────────────────────────────────────── */}
          {/* From 768px: three columns, with Tools and Company sharing the
              third so the columns come out the same height. */}
          <nav aria-label="Footer" className="hidden md:grid md:grid-cols-3 md:gap-x-8 xl:col-span-6">
            <FooterGroupList group={whatWeDo} />
            <FooterGroupList group={planAround} />
            <div className="flex flex-col gap-8">
              <FooterGroupList group={tools} />
              <FooterGroupList group={company} />
            </div>
          </nav>

          {/* Below 768px: the same groups as compact accordions, so a phone
              gets four short rows instead of a column of twenty links. */}
          <nav aria-label="Footer" className="border-t border-footer-line md:hidden">
            {groups.map((group) => (
              <DisclosureRow
                key={group.id}
                id={`footer-${group.id}`}
                open={openGroups.includes(group.id)}
                onToggle={() => toggleGroup(group.id)}
                title={group.title}
                headingLevel="h2"
                tone="footer"
                density="compact"
              >
                <ul className="flex flex-col">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <FooterNavLink link={link} />
                    </li>
                  ))}
                </ul>
              </DisclosureRow>
            ))}
          </nav>

          <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-start md:gap-10 xl:col-span-3 xl:flex xl:flex-col xl:gap-7">
            {/* ── 3 · Connect ─────────────────────────────────────────── */}
            <section aria-labelledby="footer-connect-heading">
              <h2 id="footer-connect-heading" className={groupLabelClass}>
                Connect
              </h2>

              {verifiedContactChannels.length > 0 && (
                <ul className="mt-3 flex flex-col">
                  {verifiedContactChannels.map((channel) => (
                    <ChannelItem key={channel.id} channel={channel} />
                  ))}
                </ul>
              )}

              <ul className="mt-4 flex flex-wrap gap-2.5">
                {social.map((entry) => (
                  <li key={entry.kind}>
                    <SocialMark entry={entry} />
                  </li>
                ))}
              </ul>
            </section>

            {/* ── 4 · Conversion ──────────────────────────────────────── */}
            <section
              aria-labelledby="footer-cta-heading"
              style={onBrandFocus}
              className="rounded-surface bg-brand p-4 text-on-brand shadow-md sm:p-5"
            >
              <h2 id="footer-cta-heading" className="font-display text-title-sm text-on-brand">
                Start with a conversation
              </h2>
              <p className="mt-1 text-body-sm text-on-brand">Nothing is bought or signed in a first one.</p>

              <div className="mt-3 flex flex-col gap-2.5 sm:mt-4">
                <Button
                  to="/contact"
                  variant="on-band"
                  size="md"
                  className="w-full"
                  trailingIcon={<ArrowRight size={16} aria-hidden="true" />}
                >
                  Book a consultation
                </Button>

                {/* Only once it is a different destination from the button
                    above — until a WhatsApp number is verified, the shared
                    resolver sends a chat to the same consultation page. */}
                {chat.channel === 'whatsapp' && (
                  <a
                    href={chat.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={chat.ariaLabel}
                    className={cn(
                      'inline-flex h-11 w-full items-center justify-center gap-2 rounded-action border px-4',
                      'border-on-brand/40 font-body text-body-sm font-semibold text-on-brand',
                      'transition-colors duration-instant ease-out hover:bg-on-brand/10'
                    )}
                  >
                    <WhatsAppGlyph size={16} />
                    Chat on WhatsApp
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* ── 5 · Legal ───────────────────────────────────────────────── */}
        <section
          aria-labelledby="footer-legal-heading"
          className="flex flex-col gap-4 border-t border-footer-line py-5 md:py-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10"
        >
          <h2 id="footer-legal-heading" className="sr-only">
            Important information
          </h2>
          <div className="flex max-w-reading flex-col gap-1">
            {notices.map((notice) => (
              <p key={notice.id} className="text-legal text-ink-muted">
                {notice.text}
              </p>
            ))}
          </div>

          {legalLinks.length > 0 && (
            <ul className="flex shrink-0 flex-wrap gap-x-6">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <FooterNavLink link={link} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── 6 · Baseline ────────────────────────────────────────────── */}
        <div
          className="flex flex-col gap-4 border-t border-footer-line pt-5 md:flex-row md:items-center md:justify-between"
          style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
        >
          <p className="text-legal text-ink-muted">
            &copy; {year} {brand.name}.{attribution && <> {attribution}</>}
          </p>
          {/* The three-state control, so a visitor at the bottom of the page
              can hand the theme back to their device without returning to
              the header (§12). */}
          <ThemeControl label={null} className="shrink-0" />
        </div>
      </Container>
    </footer>
  );
}

/** One navigation group: its label and its links. */
function FooterGroupList({ group }: { group: FooterGroup }) {
  const headingId = `footer-group-${group.id}`;
  return (
    <div>
      <h2 id={headingId} className={groupLabelClass}>
        {group.title}
      </h2>
      <ul aria-labelledby={headingId} className="mt-3 flex flex-col">
        {group.links.map((link) => (
          <li key={link.to}>
            <FooterNavLink link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A footer link. The underline draws from the left on hover and focus (§27)
 * alongside the colour change, so the state never rests on colour alone.
 * 32px targets on a fine pointer keep the columns compact; 44px on a coarse
 * pointer, where they are touched.
 */
function FooterNavLink({ link }: { link: FooterLink }) {
  return (
    <>
      <RouterLink
        to={link.to}
        className={cn(
          'inline-flex min-h-8 items-center rounded-action py-0.5 text-body-sm text-ink-secondary',
          'transition-colors duration-instant ease-out hover:text-ink-display',
          '[@media(pointer:coarse)]:min-h-11'
        )}
      >
        <span className="link-draw">{link.label}</span>
      </RouterLink>
      {link.detail && <p className="mb-1.5 text-legal text-ink-muted">{link.detail}</p>}
    </>
  );
}

/**
 * One confirmed contact detail — `tel:`, `mailto:`, a maps link, or the
 * Phase 5 WhatsApp link, and plain text for working hours. Only channels the
 * client has verified reach this component at all.
 */
function ChannelItem({ channel }: { channel: ContactChannel }) {
  const href =
    channel.kind === 'whatsapp'
      ? whatsAppHref(buildConversationMessage(generalConversation))
      : contactChannelHref(channel);
  const external = channel.kind === 'whatsapp' || channel.kind === 'office';
  const Glyph = channel.kind === 'whatsapp' ? null : CHANNEL_ICONS[channel.kind];

  const body: ReactNode = (
    <>
      <span className="mt-0.5 inline-flex shrink-0 text-brand-ink">
        {Glyph ? <Glyph size={16} strokeWidth={1.75} aria-hidden="true" /> : <WhatsAppGlyph size={16} />}
      </span>
      <span className="min-w-0 whitespace-pre-line text-body-sm text-ink">
        <span className="sr-only">{channel.label}: </span>
        <span className={href ? 'link-draw' : undefined}>{channel.value}</span>
      </span>
    </>
  );

  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="flex min-h-10 items-start gap-2.5 rounded-action py-1.5 [@media(pointer:coarse)]:min-h-11"
        >
          {body}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      ) : (
        <div className="flex items-start gap-2.5 py-1.5">{body}</div>
      )}
    </li>
  );
}

/**
 * One brand-coloured mark in the social row: 44px, circular, white glyph on
 * the network's or the site's own colour. Hover brightens the mark and draws
 * a brand ring outside it; focus uses the site-wide ring. The per-theme
 * `shadow-social` edge keeps the shape legible on the dark ground.
 *
 * `mode` decides the element, from data/footer.ts: a new-tab link, an
 * app hand-off, an in-site route, or — for a mark with no honest destination
 * yet — a non-interactive image with an accessible name that says so.
 */
function SocialMark({ entry }: { entry: SocialEntry }) {
  const { tint, glyph } = SOCIAL_MARKS[entry.kind];
  const base = cn('inline-flex h-11 w-11 items-center justify-center rounded-pill text-on-brand shadow-social', tint);
  const interactive = cn(
    base,
    'transition-[filter,box-shadow] duration-instant ease-out',
    'hover:brightness-110 hover:ring-2 hover:ring-brand/40 hover:ring-offset-2 hover:ring-offset-footer'
  );

  switch (entry.mode) {
    case 'none':
      return (
        <span role="img" aria-label={entry.ariaLabel} className={base}>
          {glyph}
        </span>
      );
    case 'route':
      return (
        <RouterLink to={entry.href} aria-label={entry.ariaLabel} className={interactive}>
          {glyph}
        </RouterLink>
      );
    case 'external':
      return (
        <a href={entry.href} target="_blank" rel="noopener noreferrer" aria-label={entry.ariaLabel} className={interactive}>
          {glyph}
        </a>
      );
    default:
      return (
        <a href={entry.href} aria-label={entry.ariaLabel} className={interactive}>
          {glyph}
        </a>
      );
  }
}

/**
 * The colour and glyph for each mark. Instagram carries its own gradient and
 * WhatsApp its own green (both from tokens.css, tuned per theme so the white
 * glyph stays legible); Email and Phone take Earneazi's blue and the violet
 * from the Phase 3 accent arc, so the row reads as colourful but in-system.
 */
const SOCIAL_MARKS: Record<SocialEntry['kind'], { tint: string; glyph: ReactNode }> = {
  instagram: {
    tint: 'social-tile-instagram',
    glyph: <Instagram size={20} strokeWidth={2} aria-hidden="true" />,
  },
  whatsapp: {
    tint: 'bg-social-whatsapp',
    glyph: <WhatsAppGlyph size={21} />,
  },
  email: {
    tint: 'bg-social-email',
    glyph: <Mail size={19} strokeWidth={2} aria-hidden="true" />,
  },
  phone: {
    tint: 'bg-social-phone',
    glyph: <Phone size={18} strokeWidth={2} aria-hidden="true" />,
  },
};
