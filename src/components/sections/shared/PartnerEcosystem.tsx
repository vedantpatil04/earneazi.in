import { verifiedLendingPartners } from '@/data/partners';

/**
 * The lending partner row — Enhancement B.
 *
 * Renders only verified partners (data/partners.ts), each with the
 * institution's own logo file where one has been supplied and a clean text
 * treatment where it has not. Logos sit on a light plate in both themes so a
 * brand's own colours are never recoloured to fit the dark theme, and they
 * are capped at a small height so they support the loans content rather than
 * decorate it.
 *
 * The list ships empty, so today this renders nothing.
 */
export function PartnerEcosystem() {
  if (verifiedLendingPartners.length === 0) return null;

  return (
    <section aria-labelledby="lending-partners-heading" className="mt-12 border-t border-divider pt-10 lg:mt-16 lg:pt-12">
      <h3 id="lending-partners-heading" className="text-display-xs text-ink-display">
        Lenders we work with
      </h3>
      <ul className="mt-5 flex flex-wrap items-center gap-3">
        {verifiedLendingPartners.map((partner) => (
          <li
            key={partner.id}
            className="raised inline-flex h-14 items-center rounded-surface border border-divider bg-[rgb(var(--neutral-000))] px-4"
          >
            {partner.logo ? (
              <img
                src={partner.logo.src}
                alt={partner.name}
                width={partner.logo.width}
                height={partner.logo.height}
                loading="lazy"
                decoding="async"
                className="h-7 w-auto max-w-[8rem] object-contain"
              />
            ) : (
              <span className="font-display text-body-sm font-semibold text-[rgb(var(--ink-900))]">{partner.name}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
