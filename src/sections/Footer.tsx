import { useCallback } from 'react';
import { NAV_LINKS, SITE_NAME } from '../data/navigation';
import { CONTACT_DATA } from '../data/contact';
import { MagneticButton, InstagramIcon, MailboxIcon, LinkedInIcon } from '../components';
import { useReducedMotion } from '../lib/useReducedMotion';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const reduced = useReducedMotion();

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced]);

  const mailtoHref = CONTACT_DATA.email
    ? `mailto:${CONTACT_DATA.email}?subject=Project%20Inquiry`
    : 'mailto:?subject=Project%20Inquiry';

  return (
    <footer className="footer" role="contentinfo">
      {/* ── Transition: Monumental signature watermark ── */}
      <div className="footer__watermark-wrapper" aria-hidden="true">
        <span className="footer__watermark">{SITE_NAME}</span>
      </div>

      <div className="footer__inner">
        {/* ── Main row: Identity & Navigation ── */}
        <div className="footer__main">
          {/* Identity */}
          <div className="footer__identity">
            <a href="#home" className="footer__brand">
              {SITE_NAME}
            </a>
            <p className="footer__role">
              Creative Developer &amp; Cinematographer
            </p>
            <span className="footer__location">
              [ Based in {CONTACT_DATA.location} ]
            </span>

            {/* Social & direct icons */}
            <div className="footer__socials" aria-label="Social channels">
              <MagneticButton strength={0.2}>
                <a
                  href={CONTACT_DATA.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-btn"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={20} />
                </a>
              </MagneticButton>

              <MagneticButton strength={0.2}>
                <a
                  href={mailtoHref}
                  className="footer__social-btn"
                  aria-label="Direct Email"
                >
                  <MailboxIcon size={20} />
                </a>
              </MagneticButton>

              <MagneticButton strength={0.2}>
                <a
                  href={CONTACT_DATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-btn"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon size={20} />
                </a>
              </MagneticButton>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="footer__nav" aria-label="Footer navigation">
            <span className="footer__section-label">Navigation</span>
            <ul className="footer__nav-list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer__nav-link link-hover">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Back to top magnetic action */}
          <div className="footer__top-wrapper">
            <MagneticButton strength={0.25}>
              <button
                type="button"
                onClick={handleScrollToTop}
                className="footer__top-btn"
                aria-label="Scroll back to top"
              >
                <span>Back to top</span>
                <span className="footer__top-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </span>
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* ── Divider line ── */}
        <div className="footer__divider" aria-hidden="true" />

        {/* ── Bottom row: Copyright & Colophon ── */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>

          <p className="footer__colophon">
            Designed &amp; built with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
