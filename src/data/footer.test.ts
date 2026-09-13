import { describe, expect, it } from 'vitest';
import howItWorksSource from '@/components/sections/home/HowItWorks.tsx?raw';
import servicesPageSource from '@/app/pages/ServicesPage.tsx?raw';
import goalsPageSource from '@/app/pages/FinancialGoalsPage.tsx?raw';
import testimonialsSource from '@/components/sections/shared/Testimonials.tsx?raw';
import footerSource from '@/components/navigation/Footer.tsx?raw';
import { goalEntries, servicePillars } from '@/data/services';
import { primaryNav } from '@/data/nav';
import { teamMembers } from '@/data/team';
import { socialProfiles } from '@/data/contact';
import { contactRouteFor, generalConversation, resolveConversation } from '@/lib/contact/conversation';
import type { Credential, LegalDocument, SocialProfile, Testimonial } from '@/types/content';
import {
  BRAND_STATEMENT,
  HOW_IT_WORKS_ANCHOR,
  TESTIMONIALS_ANCHOR,
  brandStatement,
  buildFooterGroups,
  founderAttribution,
  legalNotices,
  resolveLegalLinks,
  resolveSocialEntries,
  visibleLegalNotices,
} from './footer';

/**
 * The footer's contract: every link resolves to a real route and a real
 * anchor, nothing unverified is presented as a fact, and nothing is guessed.
 *
 * Fixture values below (example.com, a 00000 number) exist only here, to
 * exercise the "verified" paths. None of them ship.
 */

const ROUTES = new Set(primaryNav.map((item) => item.path));

const ANCHORS_BY_ROUTE: Record<string, Set<string>> = {
  '/services': new Set(servicePillars.map((service) => service.id)),
  '/financial-goals': new Set(goalEntries.map((goal) => goal.id)),
  '/': new Set([HOW_IT_WORKS_ANCHOR, TESTIMONIALS_ANCHOR]),
};

function expectResolves(to: string) {
  expect(to.trim()).not.toBe('');
  expect(to.startsWith('#')).toBe(false);

  const url = new URL(to, 'https://earneazi.test');
  expect(ROUTES.has(url.pathname), `route ${url.pathname} is in the sitemap`).toBe(true);

  if (url.hash) {
    const anchors = ANCHORS_BY_ROUTE[url.pathname];
    expect(anchors, `${url.pathname} has known anchors`).toBeDefined();
    expect(anchors?.has(decodeURIComponent(url.hash.slice(1))), `anchor ${url.hash} exists`).toBe(true);
  }
}

const consented: Testimonial = { id: 'fixture', name: 'Fixture', city: 'Fixture', quote: 'Fixture', consentVerified: true };

describe('footer navigation — every link resolves', () => {
  it('points every group link at a real route and a real anchor', () => {
    buildFooterGroups().forEach((group) => group.links.forEach((link) => expectResolves(link.to)));
  });

  it('keeps the four groups and the old footer’s breadth', () => {
    const groups = buildFooterGroups();
    expect(groups.map((group) => group.id)).toEqual(['what-we-do', 'plan-around', 'tools', 'company']);
    expect(groups[0].links).toHaveLength(servicePillars.length);
    expect(groups[1].links).toHaveLength(goalEntries.length);
    expect(groups[2].links.map((link) => link.to)).toEqual(['/sip-calculator', '/faq']);
    expect(groups[3].links.map((link) => link.label)).toContain('How it works');
  });

  it('only lists a product under a service when that service’s own data lists it', () => {
    buildFooterGroups()[0].links.forEach((link) => {
      const service = servicePillars.find((pillar) => pillar.href === link.to);
      expect(service).toBeDefined();
      (link.detail?.split(' · ') ?? []).forEach((name) => expect(service?.categories.items).toContain(name));
    });
  });

  it('shows "Client stories" only when a testimonial has written consent', () => {
    const hasStories = (testimonials: Testimonial[]) =>
      buildFooterGroups({ testimonials })[3].links.some((link) => link.to === `/#${TESTIMONIALS_ANCHOR}`);

    expect(hasStories([])).toBe(false);
    expect(hasStories([{ ...consented, consentVerified: false }])).toBe(false);
    expect(hasStories([consented])).toBe(true);
  });

  it('points at anchors that actually exist in the pages that own them', () => {
    expect(howItWorksSource).toContain(`id="${HOW_IT_WORKS_ANCHOR}"`);
    expect(servicesPageSource).toContain('id={service.id}');
    expect(goalsPageSource).toContain('id={goal.id}');
    expect(testimonialsSource).toContain(`id="${TESTIMONIALS_ANCHOR}"`);
  });

  it('contains no "#" placeholder link in the footer markup', () => {
    expect(footerSource).not.toMatch(/(href|to)=["']#/);
  });
});

describe('footer presentation guards', () => {
  it('uses the controlled footer lockup, not the display-scale wordmark', () => {
    expect(footerSource).toContain('lockup="footer"');
    expect(footerSource).not.toContain('lockup="oversized"');
    expect(footerSource).not.toContain('dimensional');
  });

  it('renders recognisable Instagram and WhatsApp marks', () => {
    expect(footerSource).toContain('<Instagram');
    expect(footerSource).toContain('<WhatsAppGlyph');
  });

  it('shows no development-state placeholder copy', () => {
    expect(footerSource).not.toMatch(/will appear here|Dimmed channels|aren.t live yet|once they.re confirmed/i);
  });
});

describe('brand statement and attribution', () => {
  it('states no founding year while "operating since" is unverified', () => {
    expect(brandStatement()).toBe(BRAND_STATEMENT);
    expect(brandStatement()).not.toMatch(/since|\d{4}/i);
    expect(brandStatement()).not.toMatch(/trusted/i);
  });

  it('appends the year only from a verified credential with an identifier', () => {
    const since = (verified: boolean): Credential[] => [
      { id: 'operating-since', label: 'Operating since', identifierLabel: 'Year', identifier: '2023', detail: '', verified },
    ];
    expect(brandStatement({ credentials: since(false) })).not.toContain('2023');
    expect(brandStatement({ credentials: since(true) })).toContain('since 2023');
  });

  it('names each founder with their confirmed role and nothing else', () => {
    const line = founderAttribution();
    teamMembers.forEach((member) => expect(line).toContain(`${member.name} (${member.role})`));
  });
});

describe('social row', () => {
  const shippedWhatsApp = resolveConversation(generalConversation, 'Message Earneazi');
  const contactRoute = contactRouteFor(generalConversation);
  const base = { instagram: undefined, whatsApp: shippedWhatsApp, email: null, phone: null, contactRoute };

  it('always shows Instagram, WhatsApp, Email and Phone, in that order', () => {
    expect(resolveSocialEntries(base).map((entry) => entry.kind)).toEqual(['instagram', 'whatsapp', 'email', 'phone']);
  });

  it('ships no Instagram URL that is not verified', () => {
    socialProfiles.forEach((profile) => {
      if (profile.url !== null) expect(profile.verified).toBe(true);
    });
  });

  it('gives every shipped icon a correct destination or none — never a guessed one', () => {
    const entries = resolveSocialEntries({
      ...base,
      instagram: socialProfiles.find((profile) => profile.network === 'instagram'),
    });

    const [instagram, whatsapp, email, phone] = entries;
    expect(instagram.mode).toBe('none');

    [whatsapp, email, phone].forEach((entry) => {
      expect(entry.mode).toBe('route');
      if (entry.mode === 'route') expectResolves(entry.href);
      expect(entry.ariaLabel).toMatch(/opens the contact page/);
    });
  });

  it('never uses an Instagram URL that is unverified or not an instagram.com profile', () => {
    const profile = (url: string, verified: boolean): SocialProfile => ({
      id: 'instagram',
      network: 'instagram',
      label: 'Instagram',
      handle: 'example',
      url,
      verified,
    });

    expect(resolveSocialEntries({ ...base, instagram: profile('https://instagram.com/example', false) })[0].mode).toBe('none');
    expect(resolveSocialEntries({ ...base, instagram: profile('https://example.com/earneazi', true) })[0].mode).toBe('none');
    expect(resolveSocialEntries({ ...base, instagram: profile('http://instagram.com/example', true) })[0].mode).toBe('none');

    const live = resolveSocialEntries({ ...base, instagram: profile('https://www.instagram.com/example/', true) })[0];
    expect(live.mode).toBe('external');
    if (live.mode !== 'none') expect(live.href).toBe('https://www.instagram.com/example/');
    expect(live.ariaLabel).toContain('@example');
  });

  it('switches to WhatsApp, mailto and tel once those values are confirmed', () => {
    const [, whatsapp, email, phone] = resolveSocialEntries({
      ...base,
      whatsApp: { href: 'https://wa.me/910000000000?text=Hi', external: true, ariaLabel: 'Message Earneazi on WhatsApp — opens WhatsApp' },
      email: 'hello@example.com',
      phone: '+91 00000 00000',
    });

    expect(whatsapp).toMatchObject({ mode: 'external', href: 'https://wa.me/910000000000?text=Hi' });
    expect(email).toMatchObject({ mode: 'app', href: 'mailto:hello@example.com' });
    expect(phone).toMatchObject({ mode: 'app', href: 'tel:+910000000000' });
    expect(resolveSocialEntries({ ...base, email: 'not-an-address' })[2].mode).toBe('route');
  });
});

describe('legal block', () => {
  it('links no legal page until its route and approved copy exist', () => {
    expect(resolveLegalLinks()).toEqual([]);
  });

  it('links an approved document only when it has a real route', () => {
    const doc = (route: string | null, approved: boolean): LegalDocument => ({ id: 'privacy', label: 'Privacy Policy', route, approved });
    expect(resolveLegalLinks([doc('/privacy', false)])).toEqual([]);
    expect(resolveLegalLinks([doc(null, true)])).toEqual([]);
    expect(resolveLegalLinks([doc('#', true)])).toEqual([]);
    expect(resolveLegalLinks([doc('/privacy', true)])).toEqual([{ label: 'Privacy Policy', to: '/privacy' }]);
  });

  it('renders only notices with existing wording — no fabricated regulatory copy', () => {
    expect(visibleLegalNotices().map((notice) => notice.id)).toEqual(['mutual-fund-risk', 'calculator-estimates']);
    ['insurance-solicitation', 'loan-discretion', 'distributor-status'].forEach((id) => {
      expect(legalNotices.find((notice) => notice.id === id)?.text).toBeNull();
    });
  });
});
