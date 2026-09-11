import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * A short settle on the incoming page, keyed to the route.
 *
 * Deliberately an entrance only — no exit animation and no AnimatePresence.
 * Waiting for an outgoing page to fade before the new one mounts adds a
 * visible pause to every single navigation, which is exactly the "dramatic
 * transition between every route" worth avoiding. Remounting on `pathname`
 * gives the new page a 200ms fade and nothing else.
 *
 * The transform is 6px, small enough that nothing important appears to move
 * and text never starts mid-slide. With reduced motion it renders at rest.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
