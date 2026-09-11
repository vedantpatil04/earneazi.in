import { Outlet } from 'react-router-dom';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ScrollManager } from '@/components/navigation/ScrollManager';
import { PageTransition } from '@/components/motion/PageTransition';

/**
 * Root route layout: skip link, header, routed page content, footer.
 * This is what gives every page the same landmark structure
 * (header / main / footer) required by Section K.
 */
export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollManager />

      <a
        href="#main-content"
        className="sr-only-focusable fixed left-4 top-4 z-50 rounded-md bg-accent px-4 py-2 text-on-accent"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
