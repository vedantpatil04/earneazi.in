export interface ImageAsset {
  id: string;
  /**
   * Remote or bundled URL. `null` is a valid, supported state: the
   * EditorialImage primitive renders a designed paper-and-brass plate in
   * its place, so an unfilled slot never reads as a broken image.
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

/**
 * Every photograph on the site is referenced through this file, so swapping
 * in client-approved assets is a change here and nowhere else. To replace
 * one: drop the file into /public, point `src` at it, update `alt`, `width`,
 * `height`, clear `credit`, and set `clientApproved: true`.
 *
 * Current photography is temporary concept imagery from Unsplash (free to
 * use under the Unsplash License; credit retained here for provenance).
 * The homepage deliberately carries ONE photograph rather than several —
 * a single considered image reads as a visual direction, where three or
 * four unrelated stock photos read as a stock library.
 */
export const heroImage: ImageAsset = {
  id: 'hero-advisory-conversation',
  src: 'https://images.unsplash.com/photo-1758611972678-bc3b29b4718f?q=80&w=1400&auto=format&fit=crop',
  width: 1400,
  height: 1750,
  alt: 'Two people sitting together at a desk, going through paperwork and a laptop.',
  credit: 'Vitaly Gariev / Unsplash',
  clientApproved: false,
};
