interface InstagramGlyphProps {
  size?: number;
  className?: string;
}

/**
 * The Instagram glyph, drawn rather than approximated.
 *
 * lucide's `Instagram` is a stroked outline at lucide's own proportions,
 * which reads as "a camera icon" rather than as Instagram once it is
 * reversed out of the brand gradient. This is the glyph at the proportions
 * Instagram publishes it — a rounded square with a ~29% corner, a ring at
 * roughly half its width, and the viewfinder dot up and to the right — as
 * filled geometry, so it stays crisp at 20px.
 *
 * Like WhatsAppGlyph it is `currentColor` and decorative: every caller sets
 * the colour and puts the accessible name on the control, not the glyph.
 */
export function InstagramGlyph({ size = 20, className }: InstagramGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 1.9h8.4a3.9 3.9 0 0 1 3.9 3.9v8.4a3.9 3.9 0 0 1-3.9 3.9H7.8a3.9 3.9 0 0 1-3.9-3.9V7.8a3.9 3.9 0 0 1 3.9-3.9Z"
      />
      <path
        fillRule="evenodd"
        d="M12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 1.9a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z"
      />
      <circle cx="17.2" cy="6.8" r="1.2" />
    </svg>
  );
}
