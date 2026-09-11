import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';

/**
 * Button — Phase 0 §17.
 *
 * Defined by its states rather than its look. Every variant ships default,
 * hover, focus-visible, active/pressed, disabled and both themes; `selected`
 * is expressed by the caller through `aria-pressed`, which this styles.
 *
 * Three deliberate departures from the previous build, all from the audit:
 *
 *   · No arrow glyph in the label. §17 calls a baked-in arrow a template
 *     tell. Directional affordance is available through `trailingIcon`,
 *     which translates on hover instead of sitting in the label forever.
 *   · No hover lift. §18.3 replaces lift with a border/surface state
 *     change, because a page of buttons rising a pixel under the cursor is
 *     motion that encodes nothing.
 *   · One radius token (`radius-action`), shared with inputs and chips, so
 *     actions read as one family and surfaces read as another.
 */

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'icon'
  /** LEGACY aliases from the pre-Phase-1 build, mapped onto the set above. */
  | 'outline'
  | 'brass'
  | 'on-band';

type ButtonSize = 'sm' | 'md' | 'lg';

interface SharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  /**
   * Optional trailing icon. It translates 2px on hover and focus rather
   * than being part of the label — see the note above.
   */
  trailingIcon?: ReactNode;
  /** Optional leading icon. Does not translate. */
  leadingIcon?: ReactNode;
  /** Full width on small screens, intrinsic from `sm` up. */
  block?: boolean;
}

/*
  Three mutually exclusive modes: a real <button> (onClick), an internal
  route (`to`, React Router <Link> so navigation stays client-side), or a
  non-SPA/external link (`href`, a plain <a>). Using `href` for an internal
  route causes a full page reload.
*/
type ButtonAsButton = SharedProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; to?: undefined };
type ButtonAsRouterLink = SharedProps & Omit<LinkProps, 'className' | 'children'> & { href?: undefined };
type ButtonAsAnchor = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: undefined };

export type ButtonProps = ButtonAsButton | ButtonAsRouterLink | ButtonAsAnchor;

/* Sizes from §17: 36 / 44 / 52. `md` and `lg` clear the 44px touch target
   on their own; `sm` is desktop-density only and is never the sole target
   on a touch surface. */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-body-sm gap-1.5',
  md: 'h-11 px-5 text-body gap-2',
  lg: 'h-13 px-7 text-body-lg gap-2.5',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 w-9 p-0',
  md: 'h-11 w-11 p-0',
  lg: 'h-13 w-13 p-0',
};

const variantStyles: Record<ButtonVariant, string> = {
  /* Solid brand fill. White label clears 4.5:1 on the fill in both themes
     (the fill stays brand-600 on dark — see tokens.css §12 note). */
  primary: 'bg-brand text-on-brand hover:bg-brand-hover active:bg-brand-pressed border border-transparent',

  /* Outline in ink. Hover and press change the surface, not the position. */
  secondary:
    'border border-border bg-transparent text-ink hover:bg-hovered hover:border-border-strong active:bg-pressed',

  /* Text-weight action. Gets an underline on hover so it is not identified
     by colour alone. */
  ghost: 'border border-transparent bg-transparent text-ink hover:bg-hovered active:bg-pressed',

  /* Square, icon-only. The caller must supply an accessible name. */
  icon: 'border border-divider bg-transparent text-ink-secondary hover:border-border hover:bg-hovered hover:text-ink active:bg-pressed',

  /* LEGACY → secondary. */
  outline:
    'border border-border bg-transparent text-ink hover:bg-hovered hover:border-border-strong active:bg-pressed',

  /* LEGACY → primary. The gold accent is retired (§6.3, §10.1). */
  brass: 'bg-brand text-on-brand hover:bg-brand-hover active:bg-brand-pressed border border-transparent',

  /* For use inside the ink band, where the brand fill sits too close to the
     ground to read as a button. */
  'on-band':
    'bg-on-band text-band hover:bg-on-band/90 active:bg-on-band/80 border border-transparent focus-visible:shadow-[0_0_0_1px_rgb(var(--color-band))]',
};

const baseStyles = [
  'inline-flex items-center justify-center rounded-action font-body font-semibold',
  'select-none whitespace-nowrap',
  /* Colour and border only. No transform: §18.3 bans hover lift. */
  'transition-[background-color,border-color,color] motion-safe:duration-instant ease-out',
  /* `aria-pressed` is how a toggle button expresses `selected`. */
  'aria-pressed:bg-selected aria-pressed:border-selected-border aria-pressed:text-brand-ink',
  'disabled:bg-disabled disabled:text-ink-disabled disabled:border-disabled-border',
  'disabled:cursor-not-allowed disabled:pointer-events-none',
  'aria-disabled:bg-disabled aria-disabled:text-ink-disabled aria-disabled:pointer-events-none',
].join(' ');

/* The trailing icon's 2px travel, applied from the button's hover/focus so
   it responds to the whole control rather than to the icon itself. */
const trailingIconStyles =
  'inline-flex shrink-0 transition-transform motion-safe:duration-instant ease-out motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:translate-x-0.5';

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  trailingIcon,
  leadingIcon,
  block = false,
  ...props
}: ButtonProps) {
  const classes = cn(
    'group',
    baseStyles,
    variant === 'icon' ? iconSizeStyles[size] : sizeStyles[size],
    variantStyles[variant],
    variant === 'ghost' && 'hover:underline underline-offset-4',
    block && 'w-full sm:w-auto',
    className
  );

  const content = (
    <>
      {leadingIcon && <span className="inline-flex shrink-0">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className={trailingIconStyles}>{trailingIcon}</span>}
    </>
  );

  if ('to' in props && props.to !== undefined) {
    const { to, ...linkProps } = props as ButtonAsRouterLink;
    return (
      <Link to={to} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    const { href, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { type = 'button', ...buttonProps } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
