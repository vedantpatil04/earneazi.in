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
 *
 * ── Depth — Enhancement A ────────────────────────────────────────────────
 *
 * Buttons speak the site's depth language (globals.css) rather than being
 * flat rectangles of colour:
 *
 *   primary     `.lit` — the brand fill lit from above, with a shadow in its
 *               own blue, and one band of light (`.sheen`) that crosses it
 *               when the pointer or focus arrives. Pressing puts the light
 *               out and sinks the fill. The overlay keeps the label's band
 *               at the fill's measured contrast (tokens.css, DEPTH), and the
 *               hover step is `brand-fill-hover`, which stays ≥4.5:1 under
 *               white in both themes.
 *   secondary   `.raised` — a surface resting on the page, with an edge.
 *   icon        the same raised surface, square.
 *   on-band     `.lit-light` — a pale lit fill for dark and brand grounds.
 *
 * Still no travel: depth changes with state; position never does.
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
  sm: 'h-9 px-4 text-body-sm gap-1.5',
  md: 'h-11 px-5 text-body gap-2',
  lg: 'h-13 px-7 text-body-lg gap-2.5',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 w-9 p-0',
  md: 'h-11 w-11 p-0',
  lg: 'h-13 w-13 p-0',
};

const primaryStyles =
  'lit sheen border border-brand-pressed/30 bg-brand text-on-brand hover:bg-brand-fill-hover active:bg-brand-pressed';

const secondaryStyles =
  'raised border border-border/70 bg-surface text-ink hover:border-border-strong hover:text-ink-display active:bg-pressed active:shadow-none';

const variantStyles: Record<ButtonVariant, string> = {
  /* Solid brand fill, lit. White label clears 4.5:1 on the fill and on its
     hover step in both themes (tokens.css). */
  primary: primaryStyles,

  /* A raised surface in ink. Hover and press change the edge and the
     surface, not the position. */
  secondary: secondaryStyles,

  /* Text-weight action. Gets an underline on hover so it is not identified
     by colour alone. */
  ghost: 'border border-transparent bg-transparent text-ink hover:bg-hovered active:bg-pressed',

  /* Square, icon-only. The caller must supply an accessible name. */
  icon: 'raised border border-divider bg-surface text-ink-secondary hover:border-border hover:text-ink active:bg-pressed active:shadow-none',

  /* LEGACY → secondary. */
  outline: secondaryStyles,

  /* LEGACY → primary. The gold accent is retired (§6.3, §10.1). */
  brass: primaryStyles,

  /* For the ink band and the brand-blue call-to-action surface, where the
     brand fill sits too close to the ground to read as a button. */
  'on-band':
    'lit-light border border-transparent bg-on-band text-band hover:bg-on-band/95 active:bg-on-band/85 focus-visible:shadow-[0_0_0_1px_rgb(var(--color-band))]',
};

const baseStyles = [
  'inline-flex items-center justify-center rounded-action font-body font-semibold',
  'select-none whitespace-nowrap',
  /* Colour, border and depth only. No transform: §18.3 bans hover lift. */
  'transition-[background-color,border-color,color,box-shadow] motion-safe:duration-instant ease-out',
  /* `aria-pressed` is how a toggle button expresses `selected`. */
  'aria-pressed:bg-selected aria-pressed:border-selected-border aria-pressed:text-brand-ink',
  'disabled:bg-disabled disabled:bg-none disabled:text-ink-disabled disabled:border-disabled-border disabled:shadow-none',
  'disabled:cursor-not-allowed disabled:pointer-events-none',
  'aria-disabled:bg-disabled aria-disabled:bg-none aria-disabled:text-ink-disabled aria-disabled:shadow-none aria-disabled:pointer-events-none',
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
