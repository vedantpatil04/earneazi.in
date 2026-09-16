import planningDesk640Webp from '@/assets/hero/planning-desk-640.webp';
import planningDesk960Webp from '@/assets/hero/planning-desk-960.webp';
import planningDesk1280Webp from '@/assets/hero/planning-desk-1280.webp';
import planningDesk1600Webp from '@/assets/hero/planning-desk-1600.webp';
import planningDesk1920Webp from '@/assets/hero/planning-desk-1920.webp';
import planningDesk640Jpg from '@/assets/hero/planning-desk-640.jpg';
import planningDesk960Jpg from '@/assets/hero/planning-desk-960.jpg';
import planningDesk1280Jpg from '@/assets/hero/planning-desk-1280.jpg';
import planningDesk1600Jpg from '@/assets/hero/planning-desk-1600.jpg';
import planningDesk1920Jpg from '@/assets/hero/planning-desk-1920.jpg';
import planningDeskNarrow480Webp from '@/assets/hero/planning-desk-narrow-480.webp';
import planningDeskNarrow720Webp from '@/assets/hero/planning-desk-narrow-720.webp';
import planningDeskNarrow960Webp from '@/assets/hero/planning-desk-narrow-960.webp';
import planningDeskNarrow1200Webp from '@/assets/hero/planning-desk-narrow-1200.webp';
import planningDeskNarrow480Jpg from '@/assets/hero/planning-desk-narrow-480.jpg';
import planningDeskNarrow720Jpg from '@/assets/hero/planning-desk-narrow-720.jpg';
import planningDeskNarrow960Jpg from '@/assets/hero/planning-desk-narrow-960.jpg';
import planningDeskNarrow1200Jpg from '@/assets/hero/planning-desk-narrow-1200.jpg';

export interface ImageAsset {
  id: string;
  /**
   * Remote or bundled URL. `null` is a valid, supported state: the
   * EditorialImage primitive renders a designed plate in its place, so an
   * unfilled slot never reads as a broken image.
   */
  src: string | null;
  /** Intrinsic pixel dimensions, used to reserve space and avoid layout shift. */
  width: number;
  height: number;
  alt: string;
  credit: string | null;
  /**
   * False until the client supplies the final asset. Nothing in the UI
   * describes a provisional image as depicting Earneazi's own people,
   * offices or clients — the alt text stays generic for exactly that reason.
   */
  clientApproved: boolean;
}

/** One rendered width of a responsive asset. */
export interface ImageSource {
  src: string;
  width: number;
}

/** A second crop of a responsive asset, served under its own media condition. */
export interface ArtDirectedCrop {
  /** The condition that selects this crop over the default one. */
  media: string;
  webp: ImageSource[];
  jpeg: ImageSource[];
  sizes: string;
  focalPoint: string;
}

export interface ResponsiveImageAsset extends ImageAsset {
  /** Preferred format, smallest first. */
  webp: ImageSource[];
  /** Fallback format for anything that cannot decode WebP. */
  jpeg: ImageSource[];
  /** `sizes`, describing how wide the image renders at each breakpoint. */
  sizes: string;
  /** `object-position`, so the subject survives the canvas crop at any ratio. */
  focalPoint: string;
  /**
   * Art direction for narrow screens: a crop composed for their shape, not
   * just a smaller file. Served through `<source media>`, so a device
   * downloads one crop or the other, never both.
   */
  narrow?: ArtDirectedCrop;
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 * PHOTOGRAPHY
 * ─────────────────────────────────────────────────────────────────────────
 * Every photograph on the site is referenced through this file, so swapping
 * in client-approved assets is a change here and nowhere else.
 *
 * ── THE HERO PHOTOGRAPH IS PROVISIONAL ───────────────────────────────────
 * Temporary concept imagery, free to use under the Unsplash License, with
 * the credit retained below for provenance. `clientApproved` is false and
 * the alt text is deliberately generic: nothing in the UI presents this desk
 * as Earneazi's own office or paperwork, because it is not.
 *
 * Why this frame. A planning desk mid-work: printed allocation charts, an
 * open notebook, a calculator on a phone, the laptop pushed back. It is the
 * hero's argument without a cast — money decisions being worked through
 * rather than a lifestyle being promised — and it carries no people, no
 * currency and no legible figure, so it states nothing the page cannot
 * stand behind. Its cool whites and blues sit inside the site's palette in
 * both themes.
 *
 * It also earns its place technically. The depth of field is shallow: the
 * laptop and the room behind it are soft, so the top of either crop is quiet
 * ground for type and the trajectory, and the detail sits in one sharp band
 * through the middle.
 *
 * Two crops of the one original:
 *   wide     2:1 across the full width, the band chosen so the notebook and
 *            phone sit mid-frame under the soft laptop. From 768px.
 *   narrow   square, around the notebook and the phone calculator, for the
 *            photo band a phone shows above the headline. Below 768px.
 *
 * TO REPLACE IT
 *   1. crop the approved photograph to 2:1 with quiet ground across the top,
 *      and to a square around its subject for `narrow`;
 *   2. export the 2:1 crop at 640 / 960 / 1280 / 1600 / 1920px wide and the
 *      square at 480 / 720 / 960 / 1200px, as WebP and JPEG, into
 *      src/assets/hero/, where Vite picks them up and hashes them;
 *   3. point the arrays below at the new files, rewrite `alt`, clear
 *      `credit`, set `clientApproved: true`, and check both focal points
 *      still hold the subject — the wide one at 1024px, the narrow one on a
 *      360px phone.
 * No component changes.
 *
 * ── A NOTE FOR THE OWNER ─────────────────────────────────────────────────
 * The frame has no people in it by choice, so it makes no claim about who
 * Earneazi's clients or advisers are. A photograph of Earneazi's own desk in
 * Belagavi, with blank or consented planning papers on it, would be a real
 * upgrade rather than a like-for-like swap.
 *
 * Self-hosted rather than hot-linked from Unsplash's CDN: this is the page's
 * LCP element, and §30 keeps third-party origins off the critical path.
 */
export const heroImage: ResponsiveImageAsset = {
  id: 'hero-planning-desk',
  /** Fallback for a browser with no `srcset` support. */
  src: planningDesk1280Jpg,
  /** Intrinsic dimensions of the 2:1 crop the canvas reserves. */
  width: 3000,
  height: 1500,
  alt: 'A desk with printed financial charts, an open notebook and a calculator on a phone, with a laptop behind.',
  credit: 'Jakub Żerdzicki / Unsplash',
  clientApproved: false,
  webp: [
    { src: planningDesk640Webp, width: 640 },
    { src: planningDesk960Webp, width: 960 },
    { src: planningDesk1280Webp, width: 1280 },
    { src: planningDesk1600Webp, width: 1600 },
    { src: planningDesk1920Webp, width: 1920 },
  ],
  jpeg: [
    { src: planningDesk640Jpg, width: 640 },
    { src: planningDesk960Jpg, width: 960 },
    { src: planningDesk1280Jpg, width: 1280 },
    { src: planningDesk1600Jpg, width: 1600 },
    { src: planningDesk1920Jpg, width: 1920 },
  ],
  /* The canvas runs the full width of the hero, so the image is always as
     wide as the viewport. */
  sizes: '100vw',
  /*
    Left of centre, so that when a 1024px viewport crops the sides off the
    2:1 frame, the notebook and phone move right — out from under the
    narrative column and toward the open side of the hero.
  */
  focalPoint: '32% 48%',
  narrow: {
    /* Matches the `md:` step on the hero's <img>; change the two together. */
    media: '(max-width: 767px)',
    webp: [
      { src: planningDeskNarrow480Webp, width: 480 },
      { src: planningDeskNarrow720Webp, width: 720 },
      { src: planningDeskNarrow960Webp, width: 960 },
      { src: planningDeskNarrow1200Webp, width: 1200 },
    ],
    jpeg: [
      { src: planningDeskNarrow480Jpg, width: 480 },
      { src: planningDeskNarrow720Jpg, width: 720 },
      { src: planningDeskNarrow960Jpg, width: 960 },
      { src: planningDeskNarrow1200Jpg, width: 1200 },
    ],
    /* The band runs the full width of the phone. */
    sizes: '100vw',
    /* Centered across the calculator on the phone and the printed financial charts */
    focalPoint: '54% 28%',
  },
};

/** Builds a `srcset` string from a responsive asset's sources. */
export function toSrcSet(sources: ImageSource[]): string {
  return sources.map((source) => `${source.src} ${source.width}w`).join(', ');
}
