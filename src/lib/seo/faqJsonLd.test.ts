import { describe, expect, it } from 'vitest';
import faqPageSource from '@/app/pages/FaqPage.tsx?raw';
import { faqCategoryOrder, faqHeadingId, faqItems, groupFaqItems, visibleFaqItems } from '@/data/faq';
import type { FaqItem } from '@/types/content';
import { buildFaqJsonLd, serializeJsonLd } from './faqJsonLd';

/**
 * The FAQ's contract: structured data describes exactly what the page shows,
 * every question has a stable public address, and no answer carries a figure.
 */

describe('what the FAQ page renders', () => {
  it('renders every question exactly once — none orphaned by an unlisted category', () => {
    const rendered = visibleFaqItems();
    expect(rendered).toHaveLength(faqItems.length);
    expect(new Set(rendered.map((item) => item.id)).size).toBe(faqItems.length);
    faqItems.forEach((item) => expect(faqCategoryOrder).toContain(item.category));
  });

  it('groups in the declared category order, in the order the page reads', () => {
    const groups = groupFaqItems();
    expect(groups.map((group) => group.category)).toEqual(
      faqCategoryOrder.filter((category) => faqItems.some((item) => item.category === category))
    );
    expect(groups.flatMap((group) => group.items)).toEqual(visibleFaqItems());
  });

  it('gives every question a stable, URL-safe id for deep links', () => {
    faqItems.forEach((item) => expect(item.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/));
  });

  it('keeps category heading ids stable across the rebuild', () => {
    expect(faqHeadingId('Getting started')).toBe('faq-getting-started');
    expect(faqHeadingId('Investing')).toBe('faq-investing');
  });

  it('keeps answers free of rates, returns and rupee figures', () => {
    faqItems.forEach((item) => {
      expect(item.answer).not.toMatch(/[%₹]/);
      expect(item.answer.toLowerCase()).not.toMatch(/guarantee|completely free|working day/);
    });
  });
});

describe('FAQPage JSON-LD', () => {
  it('is built from the same list the page renders — the page source says so', () => {
    expect(faqPageSource).toContain('buildFaqJsonLd(visibleFaqItems())');
    expect(faqPageSource).toContain('groupFaqItems()');
  });

  it('lists one Question per rendered item, in order, with the text unchanged', () => {
    const rendered = visibleFaqItems();
    const data = buildFaqJsonLd(rendered);

    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity).toHaveLength(rendered.length);

    data.mainEntity.forEach((entity, index) => {
      expect(entity['@type']).toBe('Question');
      expect(entity.name).toBe(rendered[index].question);
      expect(entity.acceptedAnswer['@type']).toBe('Answer');
      expect(entity.acceptedAnswer.text).toBe(rendered[index].answer);
    });
  });

  it('serialises safely for a script element and round-trips to the same object', () => {
    const hostile: FaqItem = {
      id: 'hostile',
      category: 'Investing',
      question: 'Does </script><b>this</b> & that break out?',
      answer: 'It must not.',
    };
    const data = buildFaqJsonLd([hostile]);
    const serialized = serializeJsonLd(data);

    expect(serialized).not.toContain('<');
    expect(serialized).not.toContain('>');
    expect(JSON.parse(serialized)).toEqual(data);
  });
});
