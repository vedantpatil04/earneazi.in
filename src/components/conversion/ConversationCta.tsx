import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import type { ButtonProps } from '@/components/ui/Button';
import { resolveConversation } from '@/lib/contact/conversation';
import type { ConversationContext } from '@/lib/contact/conversation';
import { WhatsAppGlyph } from './WhatsAppGlyph';

type ButtonVariant = NonNullable<Extract<ButtonProps, { children: ReactNode }>['variant']>;
type ButtonSize = NonNullable<Extract<ButtonProps, { children: ReactNode }>['size']>;

interface ConversationCtaProps {
  /** What the person was looking at. Decides the pre-filled message and the fallback route. */
  context: ConversationContext;
  /** The visible label. Also used to build the accessible name, which adds the destination. */
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
  /** Show the WhatsApp mark when the action actually opens WhatsApp. */
  showChannelIcon?: boolean;
}

/**
 * Every "talk to us" action on the site.
 *
 * It takes a context rather than an href, asks `resolveConversation` where
 * that context should go, and renders the right kind of control for the
 * answer: an external link to WhatsApp with a pre-filled draft when a
 * verified number exists, an internal route to the consultation form
 * carrying the same context when one does not.
 *
 * That indirection is the point of the component. Before it, the hero, the
 * header and the calculator each decided for themselves — which meant three
 * different labels, three different accessible names, and three places to
 * change when the number is confirmed. Call sites now say what the action
 * means; this decides what it does.
 *
 * The trailing icon follows the destination rather than the styling: an
 * up-right arrow when the link leaves the site, a right arrow when it
 * navigates within it. That distinction is the one thing a person cannot
 * infer from the label, and it changes on its own when the number lands.
 *
 * Every instance carries `data-conversion-suppress` (Enhancement B), so the
 * floating WhatsApp button steps aside while one of these passes beneath it
 * — a floating control must never cover the action it duplicates.
 */
export function ConversationCta({
  context,
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  className,
  showChannelIcon = false,
}: ConversationCtaProps) {
  const target = resolveConversation(context, children);
  const isWhatsApp = target.channel === 'whatsapp';

  const leadingIcon = showChannelIcon && isWhatsApp ? <WhatsAppGlyph size={17} /> : undefined;
  const trailingIcon = isWhatsApp ? (
    <ArrowUpRight size={16} aria-hidden="true" />
  ) : (
    <ArrowRight size={16} aria-hidden="true" />
  );

  if (target.external) {
    return (
      <Button
        data-conversion-suppress=""
        href={target.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={target.ariaLabel}
        variant={variant}
        size={size}
        block={block}
        className={className}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      data-conversion-suppress=""
      to={target.href}
      aria-label={target.ariaLabel}
      variant={variant}
      size={size}
      block={block}
      className={className}
      trailingIcon={trailingIcon}
    >
      {children}
    </Button>
  );
}
