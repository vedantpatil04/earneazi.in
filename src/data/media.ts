import outlook640Webp from '@/assets/hero/outlook-640.webp';
import outlook960Webp from '@/assets/hero/outlook-960.webp';
import outlook1280Webp from '@/assets/hero/outlook-1280.webp';
import outlook1600Webp from '@/assets/hero/outlook-1600.webp';
import outlook1920Webp from '@/assets/hero/outlook-1920.webp';
import outlook640Jpg from '@/assets/hero/outlook-640.jpg';
import outlook960Jpg from '@/assets/hero/outlook-960.jpg';
import outlook1280Jpg from '@/assets/hero/outlook-1280.jpg';
import outlook1600Jpg from '@/assets/hero/outlook-1600.jpg';
import outlook1920Jpg from '@/assets/hero/outlook-1920.jpg';

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

export interface ResponsiveImageAsset extends ImageAsset {
  /** Preferred format, smallest first. */
  webp: ImageSource[];
  /** Fallback format for anything that cannot decode WebP. */
  jpeg: ImageSource[];
  /** `sizes`, describing how wide the image renders at each breakpoint. */
  sizes: string;
  /** `object-position`, so the subject survives the canvas crop at any ratio. */
  focalPoint: string;
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
 * the alt text is deliberately generic: nothing in the UI describes these
 * people as Earneazi's clients, staff or founders, because they are not.
 *
 * Why this frame. Four people sitting together at a viewpoint, seen from
 * behind, looking out over a city at the end of the day. It is the hero's
 * argument in one picture — people looking at what is ahead of them — and it
 * is what lets the goal trajectory read as part of the scene rather than as
 * a chart laid on top of it: the line rises through the same sky they are
 * looking into.
 *
 * It also earns its place technically. The group sits low and right, so the
 * upper left is open sky for the headline and the upper right is open sky
 * for the trajectory; and because the subjects are backlit silhouettes, the
 * frame survives both a light wash and a deep ink wash without the subject
 * disappearing.
 *
 * Cropped to 2:1 from the top of the original, which drops some foreground
 * and lifts the group lower in frame, opening the sky the trajectory needs.
 *
 * TO REPLACE IT
 *   1. crop the approved photograph to 2:1, with the subject low and right
 *      and open sky across the top;
 *   2. export it at 640 / 960 / 1280 / 1600 / 1920px wide as WebP and JPEG
 *      into src/assets/hero/, where Vite picks them up and hashes them;
 *   3. point the arrays below at the new files, rewrite `alt`, clear
 *      `credit`, set `clientApproved: true`, and check `focalPoint` still
 *      holds the subject on a narrow screen.
 * No component changes.
 *
 * ── A NOTE FOR THE OWNER ─────────────────────────────────────────────────
 * Earneazi's clients are in Belagavi, and this is not an Indian location.
 * The frame was chosen for what it says rather than for its cast, and the
 * figures are silhouetted and seen from behind, so it makes no claim about
 * who Earneazi's clients are — but a photograph shot locally, or a consented
 * client photograph, would be a real upgrade rather than a like-for-like
 * swap.
 *
 * Self-hosted rather than hot-linked from Unsplash's CDN: this is the page's
 * LCP element, and §30 keeps third-party origins off the critical path.
 */
export const heroImage: ResponsiveImageAsset = {
  id: 'hero-outlook',
  /** Fallback for a browser with no `srcset` support. */
  src: outlook1280Jpg,
  /** Intrinsic dimensions of the 2:1 crop the canvas reserves. */
  width: 2400,
  height: 1200,
  alt: 'Four people sitting together at a hilltop viewpoint at sunset, looking out over a city.',
  credit: 'Nik Schmidt / Unsplash',
  clientApproved: false,
  webp: [
    { src: outlook640Webp, width: 640 },
    { src: outlook960Webp, width: 960 },
    { src: outlook1280Webp, width: 1280 },
    { src: outlook1600Webp, width: 1600 },
    { src: outlook1920Webp, width: 1920 },
  ],
  jpeg: [
    { src: outlook640Jpg, width: 640 },
    { src: outlook960Jpg, width: 960 },
    { src: outlook1280Jpg, width: 1280 },
    { src: outlook1600Jpg, width: 1600 },
    { src: outlook1920Jpg, width: 1920 },
  ],
  /* The canvas runs the full width of the hero, so the image is always as
     wide as the viewport. */
  sizes: '100vw',
  /*
    Held right of centre and low, so that when a tall phone viewport crops
    the sides off a 2:1 frame the group stays in shot rather than sliding out
    of the left edge.
  */
  focalPoint: '58% 62%',
};

/** Builds a `srcset` string from a responsive asset's sources. */
export function toSrcSet(sources: ImageSource[]): string {
  return sources.map((source) => `${source.src} ${source.width}w`).join(', ');
}
