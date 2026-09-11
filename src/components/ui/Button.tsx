import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'brass' | 'outline' | 'ghost' | 'on-band';
type ButtonSize = 'sm' | 'md' | 'lg';

interface SharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

// Three mutually exclusive modes: a real <button> (onClick), an internal
// route (`to`, uses React Router's <Link> for real SPA navigation), or an
// external/non-SPA link (`href`, a plain <a>). Picking the wrong one for an
// internal route causes a full page reload — use `to` for anything in the
// app's own sitemap.
type ButtonAsButton = SharedProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; to?: undefined };
type ButtonAsRouterLink = SharedProps & Omit<LinkProps, 'className' | 'children'> & { href?: undefined };
type ButtonAsAnchor = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: undefined };

export type ButtonProps = ButtonAsButton | ButtonAsRouterLink | ButtonAsAnchor;

// Minimum 44px tall from `md` up, so every button is a comfortable touch
// target without needing a separate mobile size.
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-small',
  md: 'h-11 px-5 text-body',
  lg: 'h-[3.25rem] px-7 text-body-lg',
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover shadow-sm hover:shadow-md',
  brass: 'bg-brass text-on-brass hover:bg-brass-hover shadow-sm hover:shadow-md',
  outline: 'border border-border text-ink bg-transparent hover:bg-surface-2 hover:border-accent',
  ghost: 'text-ink bg-transparent hover:bg-surface-2',
  // For use inside the deep forest band, where the accent fill would sit too
  // close to the background to read as a button.
  'on-band': 'bg-on-band text-band hover:bg-on-band/90 shadow-md',
};

// `active:translate-y-px` is the whole of the press feedback: enough to
// confirm the tap on a phone, not enough to read as a bouncing button.
const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-md font-body font-medium ' +
  'transition-[background-color,border-color,box-shadow,transform,color] motion-safe:duration-200 ease-signature ' +
  'active:translate-y-px disabled:opacity-50 disabled:pointer-events-none ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const classes = cn(baseStyles, sizeStyles[size], variantStyles[variant], className);

  if ('to' in props && props.to !== undefined) {
    const { to, ...linkProps } = props as ButtonAsRouterLink;
    return (
      <Link to={to} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    const { href, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
