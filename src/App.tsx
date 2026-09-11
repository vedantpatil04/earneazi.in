import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import AppLayout from '@/app/AppLayout';
import HomePage from '@/app/pages/HomePage';
import ServicesPage from '@/app/pages/ServicesPage';
import FinancialGoalsPage from '@/app/pages/FinancialGoalsPage';
import SipCalculatorPage from '@/app/pages/SipCalculatorPage';
import AboutPage from '@/app/pages/AboutPage';
import ContactPage from '@/app/pages/ContactPage';
import FaqPage from '@/app/pages/FaqPage';
import NotFoundPage from '@/app/pages/NotFoundPage';

// Route structure mirrors the confirmed sitemap (Phase 0 Blueprint,
// Section E) exactly. Page components are placeholders in Phase 1 —
// see src/app/pages — real content is Phase 2+.
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="services" element={<ServicesPage />} />
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
