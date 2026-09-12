import { Info } from 'lucide-react';
import { sipDisclaimer } from '@/data/sip-content';
import { cn } from '@/lib/utils/cn';

interface SipDisclaimerProps {
  /** One line instead of the full list, for the compact panel on the homepage. */
  variant?: 'full' | 'short';
  className?: string;
}

/**
 * The disclaimer, immediately below the result panel — §23.5, and one of the
 * few [CONFIRMED] placement requirements in the whole specification.
 *
 * It used to live in its own section two thirds of the way down the page,
 * where a reader who got their number and left never saw it. A figure and
 * the limits of that figure belong in the same glance.
 *
 * ── Contrast ────────────────────────────────────────────────────────────
 *
 * §23.5 names small grey legal text as the most commonly failed contrast
 * pair on financial sites, so this is set in `--color-text-secondary`
 * (7.07:1 on the page ground, 7.58:1 on a card) at the `legal` step, which
 * the type scale floors at 12px. It is not `text-ink-muted`, and it must not
 * become `text-ink-muted` — that pair passes too, but with far less room,
 * and the temptation with legal text is always to make it quieter.
 *
 * ── The wording ─────────────────────────────────────────────────────────
 *
 * The four points come from data/sip-content.ts and are deliberately
 * descriptive rather than regulatory. The market-risk sentence is the
 * standard industry line; the rest describe what this specific tool does and
 * does not account for. §23.5 requires verified compliance wording before
 * launch, and none has been supplied — so nothing here is presented as a
 * regulatory statement, and the file that holds the text says so.
 */
export function SipDisclaimer({ variant = 'full', className }: SipDisclaimerProps) {
  if (variant === 'short') {
    return (
      <p className={cn('text-legal text-ink-secondary', className)}>
        An estimate from the values you entered — not a quote or a guarantee. It ignores fund costs, exit loads, tax
        and inflation. Mutual fund investments are subject to market risks.
      </p>
    );
  }

  return (
    <aside
      aria-labelledby="sip-disclaimer-heading"
      className={cn('rounded-surface border border-divider bg-surface-sunken p-5', className)}
    >
      <h3 id="sip-disclaimer-heading" className="flex items-center gap-2 text-body-sm font-semibold text-ink">
        <Info size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-ink-secondary" />
        {sipDisclaimer.heading}
      </h3>
      <ul className="mt-3 flex flex-col gap-2">
        {sipDisclaimer.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-legal text-ink-secondary">
            <span aria-hidden="true" className="mt-[0.45em] h-1 w-1 shrink-0 rounded-pill bg-ink-muted" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
