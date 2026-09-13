import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ScrollManager } from '@/components/navigation/ScrollManager';
import { RouteAnnouncer } from '@/components/navigation/RouteAnnouncer';
import { PageTransition } from '@/components/motion/PageTransition';
import { FloatingContact } from '@/components/conversion/FloatingContact';
import { InfoRibbon } from '@/components/navigation/InfoRibbon';

/**
 * The application shell. Every route renders inside it, so the landmark
 * structure, the skip link and the page background are defined once.
 *
 * Landmarks: exactly one `header`, one `nav aria-label="Primary"` (inside
 * the header), one `main` and one `footer` per document — Phase 0 §29.
 *
 * `min-h-svh` rather than `min-h-screen`: on iOS Safari and Android Chrome
 * `100vh` is the height the viewport has when the browser chrome is
 * *collapsed*, so a full-height layout overflows by the height of the
 * address bar until you scroll. `svh` is the smallest stable height and
 * does not move (§28).
 */
export default function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-bg">
      <ScrollManager />
      <RouteAnnouncer />

      {/*
        First focusable element in the document, hidden until focused.
        `top-*` puts it clear of the sticky header rather than underneath it.
      */}
      <a
        href="#main-content"
        className="sr-only-focusable fixed left-4 top-4 z-skip rounded-action bg-brand px-4 py-3 font-semibold text-on-brand shadow-lg"
      >
        Skip to main content
      </a>

      <Header />

      {/* The information ribbon (Enhancement A) — directly under the
          navigation on every route, in the document flow so it scrolls away
          with the page rather than riding along inside the sticky bar. */}
      <InfoRibbon />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={<RouteFallback />}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </Suspense>
      </main>

      <Footer />

      {/*
        The persistent conversation affordance (§25). Mounted here rather
        than per page so it survives navigation, and last in the document so
        it comes after the footer in the tab order — a control that floats
        over everything should not interrupt the reading order to get there.
        It removes itself on /contact and hides behind the mobile sheet; see
        the component for the full suppression rules.
      */}
      <FloatingContact />
    </div>
  );
}

/**
 * Holds the vertical space a page occupies while its chunk arrives, so the
 * footer does not jump up the viewport and back down — a reserved height
 * rather than a spinner, because that movement counts against the CLS
 * budget in §30.
 */
function RouteFallback() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center" role="status" aria-live="polite">
      <span className="text-body text-ink-muted">Loading…</span>
    </div>
  );
}
