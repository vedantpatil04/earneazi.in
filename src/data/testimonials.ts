import type { Testimonial } from '@/types/content';

/**
 * Intentionally empty. The current site's testimonials require the client
 * to reconfirm that consent to reuse them still stands (Phase 0 Blueprint,
 * Section D.4). We don't have that confirmation, and won't invent new
 * testimonials or reconstruct the old ones from memory. Populate this array
 * only with content the client has explicitly re-confirmed consent for.
 */
export const testimonials: Testimonial[] = [];
