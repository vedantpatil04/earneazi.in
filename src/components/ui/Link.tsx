import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Link — Phase 0 §17.
 *
 * Two shapes, because a link inside a sentence and a link standing on its
 * own are different objects:
 *
 *   inline      underlined at a 1px offset, thickening on hover. Underlined
 *               at rest, always — a link identified only by colour fails
 *               WCAG 1.4.1 for anyone who cannot separate the hue.
 *   standalone  no rest underline; the underline draws in on hover, and a
 *               trailing icon translates 2px. For "More on insurance"
 *               style links that sit alone under a block.
 *
 * External links get `rel="noopener noreferrer"`, `target="_blank"` and an
 * appended visually-hidden "(opens in a new tab)", so the destination
 * behaviour is announced rather than discovered.
 */

type LinkVariant = 'inline' | 'standalone';

interface SharedLinkProps {
  variant?: LinkVariant;
  children: ReactNode;
  className?: string;
  /** Shown after the label on `standalone`. Defaults to an arrow for external links. */
  trailingIcon?: ReactNode;
  /** Tone for links sitting on the ink band. */
  tone?: 'default' | 'band';
}

type InternalLinkProps = SharedLinkProps & Omit<RouterLinkProps, 'className' | 'children'> & { href?: undefined };
type ExternalLinkProps = SharedLinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: undefined };

export type LinkProps = InternalLinkProps | ExternalLinkProps;

const baseStyles =
  'inline-flex items-center gap-1.5 rounded-action font-medium ' +
  'transition-[color,text-decoration-color,text-decoration-thickness] motion-safe:duration-instant ease-out';

const variantStyles: Record<LinkVariant, string> = {
  inline: 'underline underline-offset-[3px] decoration-1 hover:decoration-2',
  /* A standalone link is a target in its own right rather than a word inside
     a sentence, so WCAG 2.2's 24px minimum applies to it; inline links keep
     the exemption and stay on the text baseline. 28px rather than exactly 24
     so sub-pixel line-box rounding cannot leave it a fraction short. */
  standalone: 'group min-h-7 no-underline hover:underline underline-offset-[6px] decoration-1',
};

const toneStyles = {
  default: 'text-brand-ink hover:text-brand-hover decoration-brand/40 hover:decoration-brand',
  band: 'text-band-brand hover:text-on-band decoration-on-band/40 hover:decoration-on-band',
} as const;

const trailingIconStyles =
  'inline-flex shrink-0 transition-transform motion-safe:duration-instant ease-out ' +
  'motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:translate-x-0.5';

/** True for anything that leaves the app: another origin, or a `tel:`/`mailto:` scheme. */
function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || /^(mailto|tel|sms):/.test(href);
}

export function Link({
  variant = 'inline',
  tone = 'default',
  className,
  children,
  trailingIcon,
  ...props
}: LinkProps) {
  const classes = cn(baseStyles, variantStyles[variant], toneStyles[tone], className);

  if ('href' in props && props.href) {
    const { href, target, rel, ...anchorProps } = props as ExternalLinkProps;
    const external = isExternalHref(href);
    /* `tel:` and `mailto:` hand off to another app rather than opening a
       tab, so they keep the current context — only http(s) gets _blank. */
    const opensNewTab = external && /^(https?:)?\/\//.test(href);
    const icon = trailingIcon ?? (variant === 'standalone' && opensNewTab ? <ArrowUpRight size={16} aria-hidden="true" /> : null);

    return (
      <a
        href={href}
        target={target ?? (opensNewTab ? '_blank' : undefined)}
        rel={rel ?? (opensNewTab ? 'noopener noreferrer' : undefined)}
        className={classes}
        {...anchorProps}
      >
        {children}
        {icon && <span className={trailingIconStyles}>{icon}</span>}
        {opensNewTab && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }

  const { to, ...routerProps } = props as InternalLinkProps;
  return (
    <RouterLink to={to} className={classes} {...routerProps}>
      {children}
      {trailingIcon && <span className={trailingIconStyles}>{trailingIcon}</span>}
    </RouterLink>
  );
}
