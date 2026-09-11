import { Link as RouterLink } from 'react-router-dom';
import { primaryNav } from '@/data/nav';
import { servicePillars } from '@/data/services';
import { brand } from '@/config/brand';
import { Container } from '@/components/layout/Container';
import { LogoMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeControl } from '@/components/ui/ThemeToggle';
import { contactChannelHref, verifiedContactChannels } from '@/data/contact';

const footerLinkClass =
  'inline-block rounded-action py-1.5 text-body-sm text-ink-secondary ' +
  'transition-colors motion-safe:duration-instant ease-out hover:text-ink hover:underline underline-offset-4';

/**
 * The application shell's footer.
 *
 * SCOPE NOTE — the advanced footer is Phase 6, not this phase. What changes
 * here is only what the global shell owns: the logo now comes from the logo
 * system rather than being retyped, the colours and spacing come from the
 * token layer, and the theme control is reachable from the bottom of every
 * page as §12 requires. The brand band, the dimensional wordmark, the
 * conversion row, the column accordions and the legal routes all belong to
 * Phase 6 and are deliberately absent.
 *
 * Direct contact details appear only once the owner has confirmed them in
 * src/data/contact.ts. Until then the consultation link carries the job
 * rather than a placeholder number sitting on every page of the site.
 */
export function Footer() {
  const sitemapLinks = primaryNav.filter((item) => item.path !== '/');
  const directChannels = verifiedContactChannels.filter((channel) =>
    ['phone', 'whatsapp', 'email'].includes(channel.kind)
  );

  return (
    <footer className="border-t border-divider bg-surface">
      <Container size="shell" className="py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <LogoMark lockup="primary" className="text-ink" />
            <p className="mt-4 max-w-measure text-body-sm text-ink-secondary">{brand.tagline}</p>
          </div>

          <nav aria-labelledby="footer-services-heading" className="lg:col-span-3">
            <h2 id="footer-services-heading" className="font-body text-body-sm font-semibold text-ink">
              What we do
            </h2>
            <ul className="mt-3 flex flex-col">
              {servicePillars.map((service) => (
                <li key={service.id}>
                  <RouterLink to={service.href} className={footerLinkClass}>
                    {service.title}
                  </RouterLink>
                </li>
              ))}
              <li>
                <RouterLink to="/sip-calculator" className={footerLinkClass}>
                  SIP calculator
                </RouterLink>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-sitemap-heading" className="lg:col-span-2">
            <h2 id="footer-sitemap-heading" className="font-body text-body-sm font-semibold text-ink">
              Site
            </h2>
            <ul className="mt-3 flex flex-col">
              {sitemapLinks.map((item) => (
                <li key={item.path}>
                  <RouterLink to={item.path} className={footerLinkClass}>
                    {item.label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="font-body text-body-sm font-semibold text-ink">Start a conversation</h2>
            <p className="mt-3 max-w-measure text-body-sm text-ink-secondary">
              Tell us what you&rsquo;re working toward and we&rsquo;ll tell you what it takes.
            </p>

            <Button to="/contact" size="sm" className="mt-4">
              Book a consultation
            </Button>

            {directChannels.length > 0 && (
              <ul className="mt-5 flex flex-col gap-1">
                {directChannels.map((channel) => {
                  const href = contactChannelHref(channel);
                  return (
                    <li key={channel.id}>
                      {href ? (
                        <a
                          href={href}
                          {...(channel.kind === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className={footerLinkClass}
                        >
                          {channel.value}
                        </a>
                      ) : (
                        <span className="inline-block py-1.5 text-body-sm text-ink-secondary">{channel.value}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <hr className="mt-12 border-0 border-t border-divider" />

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-3">
            {/* Standard industry risk disclosure, not an Earneazi-specific
                claim. The firm's own registration and compliance wording is
                not yet verified and stays out until it is (Phase 0 §3.4). */}
            <p className="max-w-reading text-legal text-ink-muted">
              Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully
              before investing. Figures shown by the SIP calculator are estimates based on values you enter, not
              guarantees.
            </p>
            <p className="text-legal text-ink-muted">&copy; {new Date().getFullYear()} Earneazi</p>
          </div>

          {/* The three-state control, so a visitor who has scrolled to the
              bottom can hand the theme back to their device without
              returning to the header (§12). */}
          <ThemeControl className="shrink-0" />
        </div>
      </Container>
    </footer>
  );
}
