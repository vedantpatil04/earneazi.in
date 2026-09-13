import { describe, expect, it } from 'vitest';
import { contactWhatsApp } from '@/data/contact';
import {
  buildConversationMessage,
  consultationConversation,
  generalConversation,
  goalConversation,
  resolveConversation,
  serviceConversation,
  sipConversation,
  whatsAppAvailable,
  whatsAppHref,
} from './conversation';

/** The draft WhatsApp will open with, read back out of a resolved href. */
function draftOf(href: string): string {
  return new URL(href).searchParams.get('text') ?? '';
}

describe('the WhatsApp line', () => {
  it('is the verified Earneazi number, +91 87921 51022', () => {
    expect(contactWhatsApp).toBe('+91 87921 51022');
    expect(whatsAppAvailable).toBe(true);
    expect(whatsAppHref('Hi')).toBe('https://wa.me/918792151022?text=Hi');
  });

  it('opens every entry point in WhatsApp with its draft pre-filled', () => {
    const contexts = [
      generalConversation,
      serviceConversation('insurance'),
      goalConversation('buy-a-home'),
      sipConversation({ monthlyInvestment: 5000, annualReturnPct: 12, durationYears: 10 }),
    ];

    contexts.forEach((context) => {
      const target = resolveConversation(context, 'Talk to us');
      expect(target.channel).toBe('whatsapp');
      expect(target.external).toBe(true);
      expect(target.href.startsWith('https://wa.me/918792151022?text=')).toBe(true);
      expect(draftOf(target.href)).toBe(target.message);
      expect(target.ariaLabel).toMatch(/opens WhatsApp/);
    });
  });
});

describe('the message builder', () => {
  it('puts what the person entered into the consultation draft', () => {
    const draft = draftOf(
      resolveConversation(
        consultationConversation({
          name: 'Test Person',
          phone: '+91 00000 00000',
          serviceId: 'loans',
          goalId: 'buy-a-home',
          message: 'We are looking at a flat next year.',
        }),
        'Book a consultation'
      ).href
    );

    expect(draft).toContain('Name: Test Person');
    expect(draft).toContain('Phone: +91 00000 00000');
    expect(draft).toContain('Service: Loans');
    expect(draft).toContain('Financial goal: Buy a home');
    expect(draft).toContain('We are looking at a flat next year.');
  });

  it('says "Not sure yet" rather than guessing a service or goal', () => {
    const draft = buildConversationMessage(
      consultationConversation({ name: 'Test Person', phone: '000', message: 'Just exploring.' })
    );
    expect(draft).toContain('Service: Not sure yet');
    expect(draft).toContain('Financial goal: Not sure yet');
  });

  it('names the service, and the product when there is one', () => {
    expect(buildConversationMessage(serviceConversation('insurance'))).toContain('reading about Insurance');
    expect(buildConversationMessage(serviceConversation('insurance', 'health-insurance'))).toContain(
      'reading about Health insurance (Insurance)'
    );
    expect(buildConversationMessage(serviceConversation('insurance', 'no-such-product'))).toContain('reading about Insurance');
  });

  it('names the goal', () => {
    expect(buildConversationMessage(goalConversation('fund-education'))).toContain('"Fund education"');
  });

  it('carries the three SIP inputs and never a projected value', () => {
    const input = { monthlyInvestment: 5000, annualReturnPct: 12, durationYears: 10 };
    const draft = buildConversationMessage(sipConversation(input));
    expect(draft).toContain('₹5,000 a month over 10 years, assuming 12% a year');
    expect(draft).not.toContain('11,61,695');

    const consultation = buildConversationMessage(
      consultationConversation({ name: 'Test Person', phone: '000', message: 'About my SIP.', sip: input })
    );
    expect(consultation).toContain('From the SIP calculator: ₹5,000 a month over 10 years, assuming 12% a year');
  });

  it('falls back to the general message for an unknown service or goal, never an invented name', () => {
    const general = buildConversationMessage(generalConversation);
    expect(buildConversationMessage(serviceConversation('no-such-service'))).toBe(general);
    expect(buildConversationMessage(goalConversation('no-such-goal'))).toBe(general);
  });
});
