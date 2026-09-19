import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { site } from '@/config/site';
import AppLayout from '@/app/AppLayout';
import HomePage from '@/app/pages/HomePage';

/**
 * Routing foundation — Phase 0 §31.
 *
 * `BrowserRouter` with a configurable basename. The GoDaddy plan type and
 * whether the site is served from the domain root or a subdirectory are
 * both unconfirmed, so the basename is read from the build environment
 * (`VITE_BASE_PATH` → Vite's `base` → `import.meta.env.BASE_URL`) rather
 * than hard-coded. Moving the site into a subdirectory is then a build
 * variable, not a code change.
 *
 * `HashRouter` is the documented fallback for a host that cannot rewrite
 * unknown paths to index.html. It is deliberately NOT selected: §31 is
 * explicit that the choice must be a decision rather than a convenience,
 * and switching changes every internal link and every deep-link format.
 *
 * The sitemap otherwise matches the existing build. `/insurance` is the one
 * addition — the dedicated Insurance experience linked from the homepage
 * overview, the ribbon, the footer and the services page.
 */

/*
  Route-level code splitting on every route except the home page, which is
  the entry point and would only pay an extra round trip to be split
  (§30). Two routes carry dependencies nothing else uses and would
  otherwise be in everyone's first download:

    sip-calculator  Recharts, roughly as large as the rest of the app
    contact         Zod + React Hook Form
*/
const ServicesPage = lazy(() => import('@/app/pages/ServicesPage'));
const InsurancePage = lazy(() => import('@/app/pages/InsurancePage'));
const FinancialGoalsPage = lazy(() => import('@/app/pages/FinancialGoalsPage'));
const SipCalculatorPage = lazy(() => import('@/app/pages/SipCalculatorPage'));
const AboutPage = lazy(() => import('@/app/pages/AboutPage'));
const ContactPage = lazy(() => import('@/app/pages/ContactPage'));
const FaqPage = lazy(() => import('@/app/pages/FaqPage'));
const NotFoundPage = lazy(() => import('@/app/pages/NotFoundPage'));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={site.basePath}>
        <Routes>
          {/* The Suspense boundary for these chunks lives inside AppLayout,
              around the Outlet — placing it here would unmount the header
              and footer on every navigation to a split route. */}
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="insurance" element={<InsurancePage />} />
            <Route path="financial-goals" element={<FinancialGoalsPage />} />
            <Route path="sip-calculator" element={<SipCalculatorPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
