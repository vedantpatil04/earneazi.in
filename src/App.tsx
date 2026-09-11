import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import AppLayout from '@/app/AppLayout';
import HomePage from '@/app/pages/HomePage';
import ServicesPage from '@/app/pages/ServicesPage';
import FinancialGoalsPage from '@/app/pages/FinancialGoalsPage';
import AboutPage from '@/app/pages/AboutPage';
import FaqPage from '@/app/pages/FaqPage';
import NotFoundPage from '@/app/pages/NotFoundPage';

/**
 * Two routes carry dependencies nothing else on the site uses, so both are
 * split out and fetched only when visited. Loading them eagerly would mean
 * every visitor to the homepage downloads a charting library to look at a
 * page with no chart, and a form validator to look at a page with no form.
 *
 *   sip-calculator  Recharts, roughly as large as the rest of the app
 *   contact         Zod + React Hook Form
 */
const SipCalculatorPage = lazy(() => import('@/app/pages/SipCalculatorPage'));
const ContactPage = lazy(() => import('@/app/pages/ContactPage'));

/** Holds the vertical space a page occupies so the header and footer don't jump while the chunk arrives. */
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="text-body text-ink-muted">Loading…</span>
    </div>
  );
}

// Route structure mirrors the confirmed sitemap exactly.
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="financial-goals" element={<FinancialGoalsPage />} />
            <Route
              path="sip-calculator"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <SipCalculatorPage />
                </Suspense>
              }
            />
            <Route path="about" element={<AboutPage />} />
            <Route
              path="contact"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <ContactPage />
                </Suspense>
              }
            />
            <Route path="faq" element={<FaqPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
