import { goalEntries, servicePillars } from '@/data/services';
import { goalDeepLink } from '@/data/hero';
import { primaryNav } from '@/data/nav';
import { testimonials as shippedTestimonials } from '@/data/testimonials';
import { teamMembers } from '@/data/team';
import { credentials as shippedCredentials } from '@/data/credentials';
import type {
  Credential,
  LegalDocument,
  LegalNotice,
  SocialProfile,
  TeamMember,
  Testimonial,
} from '@/types/content';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * THE FOOTER'S CONTENT — structure, gating and resolution
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Everything the footer decides lives here as data and pure functions, so it
 * can be tested without rendering anything and without flipping a real
 * business fact to "see the layout". components/navigation/Footer.tsx only
 * draws what these return.
 *
 * The old Earneazi footer is the content reference (Phase 6 brief, §27). What
 * carries over is its information architecture and breadth — the products it
 * listed, the company links, the contact and social row, the legal links.
 * What does not carry over is anything it asserted without evidence: "since
 * 2023", the phone numbers, the email, the address, the social handles and
 * the legal pages all stay out until the client confirms them. Unconfirmed
 * items are omitted from what a visitor sees rather than announced as pending.
 *
 * The rule every link here obeys: it resolves to a route that exists, and an
 * anchor that exists on that route. There is no `#` placeholder anywhere.
 * data/footer.test.ts enforces that against the real sitemap and the real
 * section ids.
 */

export interface FooterLink {
  label: string;
  /** A path that exists in the sitemap, optionally with an anchor that exists on that page. */
  to: string;
  /** One muted line beneath the link — the product breadth the old footer carried. */
  detail?: string;
}

export interface FooterGroup {
  id: string;
  title: string;
  links: FooterLink[];
}

/* ── Anchors other routes own ───────────────────────────────────────────── */

/** The homepage "How it works" section's heading id (components/sections/home/HowItWorks.tsx). */
export const HOW_IT_WORKS_ANCHOR = 'how-it-works-heading';

/** The testimonials section's heading id — which exists only when consented testimonials do. */
export const TESTIMONIALS_ANCHOR = 'testimonials-heading';

/** The sitemap's own label for a path, so the footer cannot drift from the navigation. */
function navLabel(path: string, fallback: string): string {
  return primaryNav.find((item) => item.path === path)?.label ?? fallback;
}

/**
 * The products the old footer listed under each service — Mutual Funds, SIP
 * planning, ELSS, health and life insurance, home and personal loans —
 * restored as a muted line beneath each service link rather than as seven
 * more links pointing at the same three sections.
 *
 * Each name must match a category the service's own data already lists
 * (data/services.ts). Anything that does not is dropped, so the footer can
 * never advertise a product the services section does not.
 */
const SERVICE_DETAIL_CATEGORIES: Record<string, string[]> = {
  'mutual-funds-pms': ['SIP and STP', 'Tax-saving funds (ELSS)'],
  insurance: ['Health insurance', 'Term life cover'],
  loans: ['Home loan', 'Personal loan'],
};

/**
 * The four navigation groups (§27): what we do, plan around, tools, company.
 *
 * "Client stories" from the old footer appears only when there is a
 * testimonial with written consent behind it — until then the section it
 * would point at does not render, so the link would lead nowhere.
 */
export function buildFooterGroups({ testimonials = shippedTestimonials }: { testimonials?: Testimonial[] } = {}): FooterGroup[] {
  const hasClientStories = testimonials.some((testimonial) => testimonial.consentVerified);

  return [
    {
      id: 'what-we-do',
      title: 'What we do',
      links: servicePillars.map((service) => {
        const detail = (SERVICE_DETAIL_CATEGORIES[service.id] ?? []).filter((name) =>
          service.categories.items.includes(name)
        );
        return {
          label: service.title,
          to: service.href,
          detail: detail.length > 0 ? detail.join(' · ') : undefined,
        };
      }),
    },
    {
      id: 'plan-around',
      title: 'Plan around',
      links: goalEntries.map((goal) => ({ label: goal.title, to: goalDeepLink(goal.id) })),
    },
    {
      id: 'tools',
      title: 'Tools',
      links: [
        { label: navLabel('/sip-calculator', 'SIP Calculator'), to: '/sip-calculator' },
        { label: navLabel('/faq', 'FAQ'), to: '/faq' },
      ],
    },
    {
      id: 'company',
      title: 'Company',
      links: [
        { label: navLabel('/about', 'About'), to: '/about' },
        { label: 'How it works', to: `/#${HOW_IT_WORKS_ANCHOR}` },
        ...(hasClientStories ? [{ label: 'Client stories', to: `/#${TESTIMONIALS_ANCHOR}` }] : []),
        { label: navLabel('/contact', 'Contact'), to: '/contact' },
      ],
    },
  ];
}

/* ── The brand statement ────────────────────────────────────────────────── */

/**
 * The old footer's statement, kept to what the site can stand behind:
 * "trusted" is a status it cannot evidence, and "since 2023" is [VERIFY] in
 * §3.4. "Your financial partner" is the same framing the hero already uses.
 */
export const BRAND_STATEMENT =
  'Your financial partner for mutual funds, insurance, loans and PMS — planned around the goals you’re working toward.';

/**
 * The statement, with the founding year appended only once the "operating
 * since" credential is verified with a year behind it (data/credentials.ts).
 * The year is therefore evidenced in exactly one place, and the footer reads
 * it rather than restating it.
 */
export function brandStatement({ credentials = shippedCredentials }: { credentials?: Credential[] } = {}): string {
  const since = credentials.find(
    (credential) => credential.id === 'operating-since' && credential.verified && credential.identifier
  );
  return since ? `${BRAND_STATEMENT} Making wealth creation simple since ${since.identifier}.` : BRAND_STATEMENT;
}

/**
 * The baseline's attribution line (§27), built from the founder records.
 * Names and roles are confirmed (data/team.ts); nothing else about either
 * person is stated here.
 */
export function founderAttribution({ team = teamMembers }: { team?: TeamMember[] } = {}): string | null {
  if (team.length === 0) return null;
  const people = team.map((member) => `${member.name} (${member.role})`);
  const list = people.length === 1 ? people[0] : `${people.slice(0, -1).join(', ')} and ${people[people.length - 1]}`;
  return `Led by ${list}.`;
}

/* ── The social row ─────────────────────────────────────────────────────── */

export type SocialKind = 'instagram' | 'whatsapp' | 'email' | 'phone';

/**
 * How an entry behaves when activated:
 *
 *   external  leaves the site in a new tab (an Instagram profile, wa.me)
 *   app       hands off to an app on the same device (`mailto:`, `tel:`)
 *   route     navigates within the site (the contact page)
 *   none      not interactive — there is no honest destination yet
 */
export type SocialEntry =
  | { kind: SocialKind; label: string; ariaLabel: string; mode: 'external' | 'app' | 'route'; href: string }
  | { kind: SocialKind; label: string; ariaLabel: string; mode: 'none' };

/** A real profile URL on instagram.com — never a guess built from the business name. */
const INSTAGRAM_PROFILE_URL = /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._]{1,30}\/?$/;
const EMAIL_ADDRESS = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The four entries the footer's social row always shows — Instagram,
 * WhatsApp, Email, Phone, in that order, each at full brand colour.
 *
 * Two requirements meet here: every icon must be present and do something
 * correct, and no destination may be invented. They reconcile like this:
 *
 *   WhatsApp  whatever the Phase 5 conversion system resolves — WhatsApp
 *             with a pre-filled draft once a number is verified, the contact
 *             page until then. The footer passes the resolved target in; it
 *             never builds a `wa.me` URL of its own.
 *   Email     `mailto:` once an address is verified; the contact page until
 *   Phone     then, `tel:` likewise. Each accessible name states which, so a
 *             screen reader never announces "call" for a link that navigates.
 *   Instagram a real instagram.com profile once one is verified. Until then
 *             there is no destination that would be honest — the contact page
 *             is not Instagram — so the mark renders non-interactive, with an
 *             accessible name that says the link is not available.
 */
export function resolveSocialEntries({
  instagram,
  whatsApp,
  email,
  phone,
  contactRoute,
}: {
  instagram: SocialProfile | undefined;
  /** The Phase 5 resolver's answer for a general conversation. */
  whatsApp: { href: string; external: boolean; ariaLabel: string };
  email: string | null;
  phone: string | null;
  /** Where Email and Phone go while their values are unconfirmed. */
  contactRoute: string;
}): SocialEntry[] {
  const entries: SocialEntry[] = [];

  if (instagram?.verified && instagram.url && INSTAGRAM_PROFILE_URL.test(instagram.url)) {
    const handle = instagram.handle?.replace(/^@/, '');
    entries.push({
      kind: 'instagram',
      label: 'Instagram',
      mode: 'external',
      href: instagram.url,
      ariaLabel: handle
        ? `Earneazi on Instagram (@${handle}) — opens in a new tab`
        : 'Earneazi on Instagram — opens in a new tab',
    });
  } else {
    entries.push({
      kind: 'instagram',
      label: 'Instagram',
      mode: 'none',
      ariaLabel: 'Earneazi on Instagram — link not yet available',
    });
  }

  entries.push({
    kind: 'whatsapp',
    label: 'WhatsApp',
    mode: whatsApp.external ? 'external' : 'route',
    href: whatsApp.href,
    ariaLabel: whatsApp.ariaLabel,
  });

  const address = email?.trim();
  entries.push(
    address && EMAIL_ADDRESS.test(address)
      ? { kind: 'email', label: 'Email', mode: 'app', href: `mailto:${address}`, ariaLabel: `Email Earneazi at ${address}` }
      : { kind: 'email', label: 'Email', mode: 'route', href: contactRoute, ariaLabel: 'Email Earneazi — opens the contact page' }
  );

  const dialable = phone?.replace(/[^\d+]/g, '') ?? '';
  entries.push(
    phone && dialable.replace(/\D/g, '').length >= 7
      ? { kind: 'phone', label: 'Phone', mode: 'app', href: `tel:${dialable}`, ariaLabel: `Call Earneazi on ${phone}` }
      : { kind: 'phone', label: 'Phone', mode: 'route', href: contactRoute, ariaLabel: 'Call Earneazi — opens the contact page' }
  );

  return entries;
}

/* ── The legal block ────────────────────────────────────────────────────── */

/**
 * The notices §27 lists for the legal block, with the basis for each one.
 *
 * Only two ship. The mutual fund market-risk line is the standard industry
 * disclosure the previous footer already carried; the calculator line
 * describes what this site's own tool does. Neither is a claim about
 * Earneazi.
 *
 * The other three — insurance solicitation, loan discretion, distributor
 * status — are regulatory wording, and the project has no approved text for
 * any of them. Writing them here would be fabricating legal copy, so they
 * are recorded with `text: null` and render nothing until the client
 * supplies approved wording.
 */
export const legalNotices: LegalNotice[] = [
  {
    id: 'mutual-fund-risk',
    subject: 'Mutual fund market-risk disclosure',
    text: 'Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing.',
    basis: 'industry-standard',
  },
  {
    id: 'calculator-estimates',
    subject: 'What the SIP calculator figures are',
    text: 'Figures shown by the SIP calculator are estimates based on values you enter, not guarantees.',
    basis: 'describes-this-site',
  },
  { id: 'insurance-solicitation', subject: 'Insurance solicitation notice', text: null, basis: null },
  { id: 'loan-discretion', subject: 'Loan approval at the lender’s discretion', text: null, basis: null },
  { id: 'distributor-status', subject: 'Distributor status and registration', text: null, basis: null },
];

export function visibleLegalNotices(notices: LegalNotice[] = legalNotices): Array<LegalNotice & { text: string }> {
  return notices.filter(
    (notice): notice is LegalNotice & { text: string } =>
      notice.basis !== null && notice.text !== null && notice.text.trim().length > 0
  );
}

/**
 * The legal pages the old footer linked to.
 *
 * §27 is explicit that these "must exist as real routes, not `#`
 * placeholders", and none exists: there is no approved privacy policy, terms
 * or grievance policy text. So each is recorded with `route: null` and no
 * link renders. When a page and its approved copy exist, add the route to
 * App.tsx, set `route` and `approved: true` here, and the link appears.
 */
export const legalDocuments: LegalDocument[] = [
  { id: 'privacy', label: 'Privacy Policy', route: null, approved: false },
  { id: 'terms', label: 'Terms of Service', route: null, approved: false },
  { id: 'grievance', label: 'Grievance Policy', route: null, approved: false },
];

export function resolveLegalLinks(documents: LegalDocument[] = legalDocuments): FooterLink[] {
  return documents
    .filter(
      (document): document is LegalDocument & { route: string } =>
        document.approved && typeof document.route === 'string' && document.route.startsWith('/') && !document.route.includes('#')
    )
    .map((document) => ({ label: document.label, to: document.route }));
}
