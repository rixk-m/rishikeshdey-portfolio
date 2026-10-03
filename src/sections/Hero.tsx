import { useState, useEffect, useCallback } from 'react';
import { MagneticButton } from '../components';
import './Hero.css';

/* ================================================================
   RISHIKESH — Giant name composition hero

   Each letter of RISHIKESH is an independent interactive element.
   Portrait is layered over the typography, centered.
   Editorial metadata at bottom corners.
   ================================================================ */

const LETTERS = ['R', 'I', 'S', 'H', 'I', 'K', 'E', 'S', 'H'];

export default function Hero() {
  /* Entrance sequencing */
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);

  /* Individual letter hover state */
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setEntered(true), 100);
    /* ready = entrance complete, enable hover interaction */
    const t2 = setTimeout(() => setReady(true), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleLetterEnter = useCallback(
    (i: number) => {
      if (ready) setActiveIdx(i);
    },
    [ready],
  );

  const handleLetterLeave = useCallback(() => {
    setActiveIdx(null);
  }, []);

  const heroClass = [
    'hero',
    entered && 'hero--entered',
    ready && 'hero--ready',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section id="home" className={heroClass} aria-label="Hero introduction">
      {/* ── Giant RISHIKESH ── */}
      <h1 className="hero__name" aria-label="Rishikesh">
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            className={`hero__letter ${activeIdx === i ? 'hero__letter--active' : ''}`}
            onMouseEnter={() => handleLetterEnter(i)}
            onMouseLeave={handleLetterLeave}
            style={{ '--letter-idx': i } as React.CSSProperties}
          >
            {letter}
          </span>
        ))}
      </h1>

      {/* ── Portrait — layered over the typography ── */}
      <div className="hero__portrait">
        <img
          src="/assets/personal/rishikesh-cutout.png"
          alt="Rishikesh — Creative Developer and Cinematographer"
          className="hero__portrait-img"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* ── Editorial metadata — bottom left ── */}
      <div className="hero__meta-left">
        <div className="hero__roles">
          <span className="hero__roles-bar" aria-hidden="true" />
          <div className="hero__roles-list">
            <span>Creative Developer</span>
            <span>Editor</span>
            <span>Cinematographer</span>
          </div>
        </div>

        <p className="hero__copy">
          I build immersive digital experiences
          where code, design and visual
          storytelling meet.
        </p>

        <MagneticButton href="#work" strength={0.3} className="hero__explore-magnetic">
          <span className="hero__explore-text">Explore</span>
          <span className="hero__explore-circle" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </MagneticButton>
      </div>

      {/* ── Editorial metadata — bottom right ── */}
      <div className="hero__meta-right">
        <span className="hero__location">[ Based in India ]</span>
        <p className="hero__tagline">
          See beyond
          <br />
          your limits.
        </p>
      </div>

      {/* ── Scroll indicator — right edge ── */}
      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-text">Scroll</span>
      </div>
    </section>
  );
}
