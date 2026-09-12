import type { MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';
import { heroImage, toSrcSet } from '@/data/media';

export interface HeroVisualProps {
  /** Scroll-linked depth. Omitted on touch and under reduced motion, where the image is static. */
  depth?: { imageY: MotionValue<number>; imageScale: MotionValue<number> };
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
 * ── The scrims ──────────────────────────────────────────────────────────
 *
 * Two, doing different jobs, and both built from `--color-bg` so they
 * resolve per theme instead of being written twice:
 *
 *   reading   a horizontal wash, opaque under the narrative column and
 *             gone by the time it reaches the open sky. This is what the
 *             headline's contrast actually rests on — not the photograph
 *             happening to be dark there, which is not a guarantee any
 *             replacement image would keep.
 *   seam      a short vertical wash at the bottom edge, so the hero hands
 *             off to the service rail below it without a hard cut.
 *
 * The image is `aria-hidden` and carries an empty alt: it is decorative
 * here. Its subject is described in data/media.ts, and nothing in the
 * page's meaning depends on seeing it.
 */
export function HeroVisual({ depth }: HeroVisualProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div style={depth ? { y: depth.imageY, scale: depth.imageScale } : undefined} className="absolute inset-0">
        <picture>
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
            className="h-full w-full object-cover"
            style={{ objectPosition: heroImage.focalPoint }}
          />
        </picture>
      </motion.div>

      {/*
        Reading scrim: Subtle gradient wash that ensures crisp headline
        contrast on the left while keeping the family, sunset, and landscape
        vividly visible underneath across the center and right.
      */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(var(--color-bg)/0.80)_0%,rgb(var(--color-bg)/0.65)_36%,rgb(var(--color-bg)/0.35)_75%,transparent_100%)] lg:bg-[linear-gradient(to_right,rgb(var(--color-bg)/0.84)_0%,rgb(var(--color-bg)/0.70)_22%,rgb(var(--color-bg)/0.32)_42%,rgb(var(--color-bg)/0.06)_58%,transparent_74%)]"
      />

      {/* Gentle bottom transition to the next section */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,rgb(var(--color-bg))_0%,rgb(var(--color-bg)/0.35)_50%,transparent_100%)]" />
    </div>
  );
}
