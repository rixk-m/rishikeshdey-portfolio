import { useState, useEffect, useCallback } from 'react';
import { NAV_LINKS, SITE_NAME } from '../data/navigation';
import { useScrollState } from '../lib/useScrollState';
import './Navigation.css';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isScrolled, activeSection } = useScrollState(80);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close menu on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    },
    [menuOpen],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Close menu on link click (mobile)
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  // Determine active link from section ID
  const isActive = (href: string) => {
    const id = href.replace('#', '');
    return activeSection === id;
  };

  return (
    <>
      <nav className={`nav ${isScrolled ? 'nav--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="nav__bar">
          {/* Logo */}
          <a href="#home" className="nav__logo" onClick={handleLinkClick}>
            {SITE_NAME}
          </a>

          {/* Desktop links */}
          <ul className="nav__links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`nav__link ${isActive(link.href) ? 'nav__link--active' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile trigger */}
          <button
            className={`nav__trigger ${menuOpen ? 'nav__trigger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="nav__trigger-line" />
            <span className="nav__trigger-line" />
            <span className="nav__trigger-line" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        id="mobile-menu"
        className={`nav__overlay ${menuOpen ? 'nav__overlay--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className="nav__overlay-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav__overlay-link ${isActive(link.href) ? 'nav__overlay-link--active' : ''}`}
                onClick={handleLinkClick}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
