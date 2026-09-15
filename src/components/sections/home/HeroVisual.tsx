import type { CSSProperties } from 'react';
import type { MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';
import { heroImage, toSrcSet } from '@/data/media';
import { duration, easing } from '@/lib/motion/tokens';

export interface HeroVisualProps {
  /** Scroll-linked depth. Omitted on touch and under reduced motion, where the image is static. */
  depth?: { imageY: MotionValue<number>; imageScale: MotionValue<number> };
  /**
   * The narrow-screen entrance: the photograph settles once as the headline
   * rises. Hero passes it below 1024px only, and never under reduced motion.
   */
  reveal?: boolean;
}

/**
 * The hero's backdrop: one photograph and the scrims that make type legible
 * over it.
 *
 * It does nothing else. It previously also owned the desktop trajectory,
 * while the mobile version of the same trajectory lived in Hero.tsx — two
 * implementations of one idea, with the milestone titles and icons
 * hardcoded separately in each. Both now come from HeroJourney.
 *
 * ── Two crops of one photograph ─────────────────────────────────────────
 *
 * From 768px the frame is the 2:1 crop. Below that a `<source media>` swaps
 * in the square crop from data/media.ts, so a phone downloads one file and
 * gets a picture composed for its shape instead of a sliver of the wide
 * one. Each crop has its own focal point: the `md:` step on the <img> is the
 * same 768px boundary as `narrow.media`, and the two change together.
 *
 * ── The band, below 1024px ──────────────────────────────────────────────
 *
 * Where the narrative stacks, the photograph is a band across the top of the
 * hero (`--hero-band`, set by Hero) rather than a wash behind the whole
 * section — stretched behind the journey panel too, `object-cover` could
 * only ever show a tall, blurred slice of it. Hero starts the narrative
 * part-way down the band, so the picture is seen first and the eyebrow and
 * headline rise onto its fade.
 *
 * ── The scrims ──────────────────────────────────────────────────────────
 *
 * Two, doing different jobs, and both built from `--color-bg` so they
 * resolve per theme instead of being written twice:
 *
 *   reading   ≥1024px, a horizontal wash, opaque under the narrative column
 *             and gone by the time it reaches the trajectory. Below 1024px,
 *             a vertical wash down the band: clear over the subject, then
 *             closing to the ground under the eyebrow and headline. This is
 *             what the type's contrast actually rests on — not the
 *             photograph happening to be light or dark there.
 *   seam      a short vertical wash at the bottom edge, so the photograph
 *             hands off to what follows without a hard cut.
 *
 * The image is `aria-hidden` and carries an empty alt: it is decorative
 * here. Its subject is described in data/media.ts, and nothing in the
 * page's meaning depends on seeing it.
 */
export function HeroVisual({ depth, reveal = false }: HeroVisualProps) {
  const { narrow } = heroImage;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden max-lg:bottom-auto max-lg:h-[var(--hero-band)]"
    >
      <motion.div
        style={depth ? { y: depth.imageY, scale: depth.imageScale } : undefined}
        /* A settle rather than a fade from nothing: the image is the LCP
           element, and one painted at zero opacity is not counted as painted. */
        {...(reveal
          ? {
              initial: { opacity: 0.4, scale: 1.04 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: duration.story, ease: easing.out },
            }
          : {})}
        className="absolute inset-0"
      >
        <picture>
          {narrow && (
            <>
              <source media={narrow.media} type="image/webp" srcSet={toSrcSet(narrow.webp)} sizes={narrow.sizes} />
              <source media={narrow.media} type="image/jpeg" srcSet={toSrcSet(narrow.jpeg)} sizes={narrow.sizes} />
            </>
          )}
          <source type="image/webp" srcSet={toSrcSet(heroImage.webp)} sizes={heroImage.sizes} />
          <source type="image/jpeg" srcSet={toSrcSet(heroImage.jpeg)} sizes={heroImage.sizes} />
          <img
            src={heroImage.src ?? undefined}
            alt=""
            width={heroImage.width}
            height={heroImage.height}
            /* The LCP element: eager, high priority, and never lazy. */
            loading="eager"
            /*
              Spread as a raw attribute on purpose. React 18's DOM renderer
              does not know `fetchPriority` and drops it with a warning,
              while its type definitions only accept the camelCase spelling
              — so the typed prop and the working attribute are two
              different strings on this version. This emits the one the
              browser reads. Replace with a plain `fetchPriority` prop on
              React 19.
            */
            {...({ fetchpriority: 'high' } as Record<string, string>)}
            decoding="async"
            className="h-full w-full object-cover [object-position:var(--focal-narrow)] md:[object-position:var(--focal)]"
            style={
              {
                '--focal': heroImage.focalPoint,
                '--focal-narrow': narrow?.focalPoint ?? heroImage.focalPoint,
              } as CSSProperties
            }
          />
        </picture>
      </motion.div>

      {/*
        Reading scrim. From 1024px, the approved horizontal wash: it keeps
        the headline and supporting copy crisp on the left and clears across
        the frame toward the trajectory, holding stronger through the middle
        because at 1024px the supporting copy reaches almost half the width.
        Below 1024px, the vertical wash down the band described above.
      */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(var(--color-bg)/0.16)_0%,transparent_20%,transparent_34%,rgb(var(--color-bg)/0.7)_56%,rgb(var(--color-bg)/0.94)_74%,rgb(var(--color-bg))_100%)] lg:bg-[linear-gradient(to_right,rgb(var(--color-bg)/0.9)_0%,rgb(var(--color-bg)/0.8)_28%,rgb(var(--color-bg)/0.52)_46%,rgb(var(--color-bg)/0.14)_62%,transparent_76%)]"
      />

      {/* Gentle bottom transition to the next section */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,rgb(var(--color-bg))_0%,rgb(var(--color-bg)/0.35)_50%,transparent_100%)]" />
    </div>
  );
}
