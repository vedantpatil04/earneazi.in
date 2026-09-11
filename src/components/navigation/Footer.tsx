import { Link } from 'react-router-dom';
import { primaryNav } from '@/data/nav';
import { servicePillars } from '@/data/services';
import { Container } from '@/components/layout/Container';

const footerLinkClass =
  'inline-block py-1 text-small text-ink-secondary transition-colors motion-safe:duration-200 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

export function Footer() {
  const sitemapLinks = primaryNav.filter((item) => item.path !== '/');

  return (
    <footer className="border-t border-divider bg-surface">
      <Container size="wide" className="py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <span className="inline-flex items-baseline gap-0.5 font-display text-h3 text-ink">
              Earneazi
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brass" />
            </span>
            <p className="mt-3 max-w-measure text-small text-ink-secondary">
              Mutual funds &amp; PMS, insurance and loans, planned around the goals you&rsquo;re working toward.
            </p>
          </div>

          <nav aria-labelledby="footer-services-heading" className="lg:col-span-3">
            <h2 id="footer-services-heading" className="font-body text-label font-semibold text-ink">
              What we do
            </h2>
            <ul className="mt-3 flex flex-col">
              {servicePillars.map((service) => (
                <li key={service.id}>
                  <Link to={service.href} className={footerLinkClass}>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-sitemap-heading" className="lg:col-span-2">
            <h2 id="footer-sitemap-heading" className="font-body text-label font-semibold text-ink">
              Site
            </h2>
            <ul className="mt-3 flex flex-col">
              {sitemapLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className={footerLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="font-body text-label font-semibold text-ink">Get in touch</h2>
            <p className="mt-3 max-w-measure text-small text-ink-secondary">
              Have a question about your goals?{' '}
              <Link
                to="/contact"
                className="text-ink underline decoration-brass decoration-1 underline-offset-4 transition-colors motion-safe:duration-200 hover:text-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                Start a conversation
              </Link>
              .
            </p>
          </div>
        </div>

        <hr className="mt-12 border-0 border-t border-divider" />

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          {/* Standard industry risk disclosure, not an Earneazi-specific claim.
              The company's own registration and compliance wording is not yet
              verified and stays out until it is. */}
          <p className="max-w-prose text-small text-ink-muted">
            Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully
            before investing.
          </p>
          <p className="flex-shrink-0 text-small text-ink-muted">&copy; {new Date().getFullYear()} Earneazi</p>
        </div>
      </Container>
    </footer>
  );
}
