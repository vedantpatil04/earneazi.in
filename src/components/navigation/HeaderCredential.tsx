import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import { headerCredentials } from '@/data/credentials';
import { cn } from '@/lib/utils/cn';

/**
 * "✓ AMFI Registered · DSA Licensed" — Enhancement A, verified status only.
 *
 * Secondary to the navigation by construction: legal-size type, a tinted
 * chip rather than a lit one, and placed by the caller where it fits without
 * crowding the links (the desktop header shows it from 1360px; the mobile
 * sheet shows it above the destinations).
 *
 * It becomes a link to the credential ledger only when every registration it
 * names has its identifier on file — the ledger renders under that gate, so a
 * link before then would point at nothing. Until the ARN and the named
 * institutions are supplied it is plain text (data/credentials.ts).
 *
 * The caller supplies the display class (`inline-flex`, or `hidden
 * lg:inline-flex`), so the chip can be switched off at a breakpoint without
 * a conflicting display utility inside it.
 */
export function HeaderCredential({ className }: { className?: string }) {
  const items = headerCredentials();
  if (items.length === 0) return null;

  const evidenced = items.every((item) => item.identifier !== null);
  const classes = cn(
    'edge-top h-8 items-center gap-1.5 rounded-pill border border-brand/20 bg-brand-subtle px-2.5',
    'whitespace-nowrap text-legal font-semibold text-brand-ink',
    className
  );
  const body = (
    <>
      <BadgeCheck size={14} strokeWidth={2} aria-hidden="true" className="shrink-0" />
      <span>{items.map((item) => item.shortLabel).join(' · ')}</span>
    </>
  );

  if (!evidenced) return <span className={classes}>{body}</span>;

  return (
    <Link
      to="/about#credentials-heading"
      className={cn(classes, 'transition-colors duration-instant ease-out hover:border-brand/45')}
    >
      {body}
      <span className="sr-only"> — see our registrations</span>
    </Link>
  );
}
