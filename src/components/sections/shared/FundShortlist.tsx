import { Info } from 'lucide-react';
import { fundFacts, fundListings } from '@/data/funds';
import type { FundListing } from '@/types/content';

/**
 * The fund shortlist — Enhancement B.
 *
 * The previous site's "recommended funds" table, restored as information
 * architecture rather than as a table of numbers: scheme name, category, and
 * then only the facts that have been confirmed (data/funds.ts). With nothing
 * confirmed, a card is a name and a category — the risk level, minimum SIP
 * and performance rows are omitted, not shown as dashes or placeholders.
 *
 * It is labelled as a starting point for a conversation and not a
 * recommendation, beside the standard market-risk line, because a list of
 * scheme names on a distributor's site reads as advice unless it says
 * otherwise.
 */
export function FundShortlist() {
  if (fundListings.length === 0) return null;

  return (
    <section
      aria-labelledby="fund-shortlist-heading"
      data-tone="mutual-funds"
      className="mt-12 border-t border-divider pt-10 lg:mt-16 lg:pt-12"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h3 id="fund-shortlist-heading" className="text-display-xs text-ink-display">
            Fund shortlist
          </h3>
          <p className="mt-2 max-w-measure text-body-sm text-ink-secondary">
            A starting point for a conversation, not a recommendation. Whether any scheme suits you depends on your
            goals, your timeline and the risk you can live with.
          </p>
          <p className="edge-top mt-4 flex items-start gap-2.5 rounded-surface border border-divider bg-surface-sunken p-3 text-legal text-ink-secondary">
            <Info size={15} strokeWidth={1.75} aria-hidden="true" className="mt-px shrink-0" />
            <span>
              Risk level, minimum SIP and past performance appear only once confirmed against current scheme
              documents. Mutual fund investments are subject to market risks; read all scheme-related documents
              carefully.
            </span>
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8">
          {fundListings.map((fund) => (
            <FundCard key={fund.id} fund={fund} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FundCard({ fund }: { fund: FundListing }) {
  const facts = fundFacts(fund);

  return (
    <li className="raised flex flex-col gap-3 rounded-surface border border-divider bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 font-display text-title-sm text-ink-display">{fund.name}</p>
        <span className="edge-top shrink-0 rounded-pill border border-tone/20 bg-tone-tint px-2.5 py-0.5 text-legal font-semibold text-tone">
          {fund.category}
        </span>
      </div>

      {facts.length > 0 && (
        <dl className="flex flex-wrap gap-x-6 gap-y-2 border-t border-divider pt-3">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-legal text-ink-muted">{fact.label}</dt>
              <dd className="font-display text-body-sm font-semibold tabular text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </li>
  );
}
