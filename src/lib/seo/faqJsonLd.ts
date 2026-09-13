import type { FaqItem } from '@/types/content';

/**
 * FAQPage structured data — Phase 0 §26.
 *
 * Built from exactly the questions the FAQ page renders (see
 * `visibleFaqItems` in data/faq.ts), with the question and answer text
 * passed through unchanged. Structured data that describes content a visitor
 * cannot see is a policy violation for search engines and a small lie to
 * everyone else, so there is deliberately no way to feed this a different
 * list from the one on screen.
 *
 * ── Why client-rendered ─────────────────────────────────────────────────
 *
 * §26 proposes emitting this statically at build time. That needs a
 * prerender step, which is build and deployment architecture — Phase 7's
 * territory, and the Phase 6 brief rules out server-side work. So the page
 * renders the script tag itself. Search engines that render JavaScript read
 * it; moving it into the static HTML later is a build change, not a content
 * change, because the object is produced by this one pure function either
 * way.
 */

export interface FaqJsonLd {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: { '@type': 'Answer'; text: string };
  }>;
}

export function buildFaqJsonLd(items: FaqItem[]): FaqJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/**
 * JSON for a `<script type="application/ld+json">` body.
 *
 * `JSON.stringify` alone is not safe inside a script element: an answer
 * containing `</script>` would end the element early and turn the rest into
 * markup. Escaping `<`, `>` and `&` as unicode escapes keeps the payload
 * byte-for-byte equivalent JSON while making that impossible.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}
