import { useInView } from '../lib/useInView';
import { MagneticButton, InstagramIcon, MailboxIcon, LinkedInIcon } from '../components';
import { CONTACT_DATA } from '../data/contact';
import './Contact.css';

export default function Contact() {
  const { ref, inView } = useInView<HTMLElement>(0.15);

  const mailtoHref = CONTACT_DATA.email
    ? `mailto:${CONTACT_DATA.email}?subject=Project%20Inquiry`
    : 'mailto:?subject=Project%20Inquiry';

  return (
    <section
      id="contact"
      ref={ref}
      className={`contact ${inView ? 'contact--visible' : ''}`}
      aria-label="Contact"
    >
      <div className="contact__inner">
        {/* ── Status pill & Eyebrow ── */}
        <div className="contact__meta">
          <div className="contact__eyebrow">
            <span className="contact__eyebrow-line" aria-hidden="true" />
            <span>Connect</span>
          </div>

          <div
            className="contact__badge"
            aria-label={`Status: ${CONTACT_DATA.statusText}`}
          >
            <span className="contact__badge-dot" aria-hidden="true" />
            <span className="contact__badge-text">{CONTACT_DATA.statusText}</span>
          </div>
        </div>

        {/* ── Editorial Headline & Copy ── */}
        <div className="contact__heading-block">
          <h2 className="contact__title">
            Let's create something{' '}
            <span className="contact__title-accent">extraordinary</span>.
          </h2>
          <p className="contact__copy">
            I'm always open to discussing new digital experiences, creative
            direction, cinematography collaborations, or frontend architecture.
            Based in {CONTACT_DATA.location}, working globally.
          </p>
        </div>

        {/* ── Primary Action & Social Icons ── */}
        <div className="contact__action-group">
          <div className="contact__actions-row">
            <MagneticButton strength={0.25} className="contact__magnetic-wrapper">
              <a href={mailtoHref} className="contact__cta">
                <span className="contact__cta-label">Initiate Conversation</span>
                <span className="contact__cta-circle" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
            </MagneticButton>

            {/* ── Instagram, Mailbox, and LinkedIn icons ── */}
            <div className="contact__social-icons" aria-label="Social and direct channels">
              <MagneticButton strength={0.3}>
                <a
                  href={CONTACT_DATA.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__social-icon-btn"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={26} />
                </a>
              </MagneticButton>

              <MagneticButton strength={0.3}>
                <a
                  href={mailtoHref}
                  className="contact__social-icon-btn"
                  aria-label="Send Email"
                >
                  <MailboxIcon size={26} />
                </a>
              </MagneticButton>

              <MagneticButton strength={0.3}>
                <a
                  href={CONTACT_DATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__social-icon-btn"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon size={26} />
                </a>
              </MagneticButton>
            </div>
          </div>

          {CONTACT_DATA.email && (
            <div className="contact__direct-email">
              <span className="contact__direct-label">Or write directly:</span>
              <a
                href={`mailto:${CONTACT_DATA.email}`}
                className="contact__direct-link link-hover"
              >
                {CONTACT_DATA.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
