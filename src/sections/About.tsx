import { useState, useRef, useCallback } from 'react';
import { useInView } from '../lib/useInView';
import './About.css';

interface CategoryItem {
  id: string;
  label: string;
  disciplines: string[];
  description: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'CODE',
    label: 'CODE',
    disciplines: ['TypeScript', 'React', 'WebGL', 'CSS Architecture', 'Fluid Motion'],
    description: 'Engineering responsive, performant digital systems with pixel-level precision.',
  },
  {
    id: 'IDEAS',
    label: 'IDEAS',
    disciplines: ['Creative Direction', 'Systems Thinking', 'Spatial Design', 'Prototyping'],
    description: 'Transforming complex conceptual ideas into intuitive, memorable interfaces.',
  },
  {
    id: 'VISUALS',
    label: 'VISUALS',
    disciplines: ['Cinematic Lighting', 'Chiaroscuro', 'Color Grading', '35mm Film'],
    description: 'Crafting high-contrast editorial compositions that command visual attention.',
  },
  {
    id: 'STORIES',
    label: 'STORIES',
    disciplines: ['Scroll Narratives', 'Micro-Interactions', 'Pacing', 'Emotion-First UX'],
    description: 'Orchestrating rhythm, tension and release across digital narrative arcs.',
  },
];

interface FilmFrame {
  id: number;
  label: string;
  title: string;
  lens: string;
  shutter: string;
  aperture: string;
  iso: string;
  stock: string;
}

const FILM_FRAMES: FilmFrame[] = [
  {
    id: 1,
    label: '04',
    title: 'Horizons & Sky',
    lens: '35mm',
    shutter: '1/250s',
    aperture: 'ƒ/2.0',
    iso: 'ISO 200',
    stock: 'KODAK 500T',
  },
  {
    id: 2,
    label: '05',
    title: 'Architectural Rafters',
    lens: '50mm',
    shutter: '1/500s',
    aperture: 'ƒ/1.4',
    iso: 'ISO 400',
    stock: 'KODAK 500T',
  },
  {
    id: 3,
    label: '06',
    title: 'Botanical Silhouette',
    lens: '28mm',
    shutter: '1/125s',
    aperture: 'ƒ/2.8',
    iso: 'ISO 100',
    stock: 'KODAK 500T',
  },
];

type LightMood = 'golden' | 'midnight' | 'mono';

export default function About() {
  const { ref, inView } = useInView<HTMLElement>(0.1);

  // Interactive categories state
  const [activeCategory, setActiveCategory] = useState<string>('CODE');

  // Interactive card 3D tilt & dynamic spotlight
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 50, py: 50, active: false });
  const [hoveredFrame, setHoveredFrame] = useState<FilmFrame | null>(null);
  const [activeFrame, setActiveFrame] = useState<FilmFrame | null>(null);
  const [lightMood, setLightMood] = useState<LightMood>('golden');
  const [shutterFlash, setShutterFlash] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    const py = Math.min(Math.max((y / rect.height) * 100, 0), 100);

    // Subtle 3D tilt (-6 to +6 degrees)
    const normX = (px / 100 - 0.5) * 2;
    const normY = (py / 100 - 0.5) * 2;
    const ry = normX * 6;
    const rx = -normY * 6;

    setTilt({ rx, ry, px, py, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt((prev) => ({ ...prev, rx: 0, ry: 0, active: false }));
    setHoveredFrame(null);
  }, []);

  const handleFrameClick = (frame: FilmFrame) => {
    setActiveFrame(frame);
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 450);
  };

  const selectedCategoryData = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  return (
    <section
      id="about"
      ref={ref}
      className={`about ${inView ? 'about--visible' : ''}`}
      aria-label="About"
    >
      <div className="about__container">
        {/* ── Top Header Bar ── */}
        <header className="about__top-bar">
          <div className="about__header-item about__header-item--left">
            <span className="about__header-dash" aria-hidden="true" />
            <span className="about__header-label">About</span>
          </div>

          <div className="about__header-item about__header-item--right">
            <span className="about__header-dash" aria-hidden="true" />
            <span className="about__header-counter">01 / 06</span>
          </div>
        </header>

        {/* ── Main Editorial Composition Layout ── */}
        <div className="about__editorial">
          {/* Left Vertical Section Marker */}
          <aside className="about__side-marker" aria-hidden="true">
            <span className="about__side-line" />
            <span className="about__side-num">01</span>
          </aside>

          {/* Left Column: Heading + Paragraphs + Category Navigator */}
          <div className="about__content">
            <h2 className="about__headline">
              <span className="about__headline-block">I build digital experiences</span>
              <span className="about__headline-block">where technology meets</span>
              <span className="about__headline-serif">visual storytelling.</span>
            </h2>

            <div className="about__body">
              <p className="about__paragraph">
                I work across the intersection of frontend engineering,
                creative development and cinematography — crafting interfaces
                that feel alive, intentional and cinematic.
              </p>
              <p className="about__paragraph">
                Every project is an opportunity to merge code with visual
                narrative. Whether it's a scroll-driven experience, an
                interactive editorial layout, or a short film — the goal is
                always the same: make people feel something.
              </p>
            </div>

            {/* Interactive Stack / Philosophy Navigator */}
            <div className="about__categories-wrap">
              <div className="about__categories-header" aria-hidden="true">
                <span className="about__categories-dash" />
              </div>

              <div className="about__categories-row">
                <nav className="about__categories-nav" aria-label="Discipline focus">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`about__cat-btn ${activeCategory === cat.id ? 'about__cat-btn--active' : ''}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <span className="about__cat-indicator" />
                      <span className="about__cat-text">{cat.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Dynamic Discipline Drawer */}
                <div className="about__category-panel">
                  <div className="about__cat-tags">
                    {selectedCategoryData.disciplines.map((item) => (
                      <span key={item} className="about__cat-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="about__cat-desc">{selectedCategoryData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Chiaroscuro & 35mm Film Strip */}
          <div className="about__visual-col">
            {/* Top Coordinate Vertical Line */}
            <div className="about__visual-header" aria-hidden="true">
              <span className="about__col-line" />
              <div className="about__col-tags">
                <span>FRAMES</span>
                <span>IDEAS</span>
                <span>INTERFACES</span>
              </div>
            </div>

            {/* Interactive 3D Visual Card */}
            <div
              ref={cardRef}
              className={`about__visual-card about__visual-card--${lightMood} ${tilt.active ? 'about__visual-card--interacting' : ''}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: tilt.active
                  ? `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.02, 1.02, 1.02)`
                  : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
              }}
            >
              {/* Dynamic Sunlight / Specular Sheen Beam */}
              <div
                className="about__visual-sheen"
                style={{
                  background: tilt.active
                    ? `radial-gradient(circle 380px at ${tilt.px}% ${tilt.py}%, rgba(226, 177, 122, 0.22), transparent 70%)`
                    : 'radial-gradient(circle 420px at 60% 40%, rgba(226, 177, 122, 0.12), transparent 75%)',
                }}
              />

              {/* High-res Composition Artwork */}
              <div className="about__art-frame">
                <img
                  src="/assets/about/about-visual-2x.png"
                  alt="Architectural chiaroscuro composition with sunlight, botanical shadows, glass pedestal and 35mm film strip"
                  className="about__art-image"
                  loading="lazy"
                  decoding="async"
                />

                {/* Shutter Flash Animation on frame click */}
                {shutterFlash && <div className="about__shutter-flash" />}

                {/* Interactive Hotspots for the 3 film frames on the right */}
                <div className="about__film-hotspots" aria-label="35mm Film Strip Frames">
                  {FILM_FRAMES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`about__film-hotspot about__film-hotspot--${f.id} ${hoveredFrame?.id === f.id ? 'about__film-hotspot--hovered' : ''} ${activeFrame?.id === f.id ? 'about__film-hotspot--active' : ''}`}
                      onMouseEnter={() => setHoveredFrame(f)}
                      onClick={() => handleFrameClick(f)}
                      aria-label={`Frame ${f.label}: ${f.title}`}
                    >
                      <span className="about__hotspot-reticle" />
                    </button>
                  ))}
                </div>

                {/* Hover Film Telemetry Badge */}
                {hoveredFrame && (
                  <aside className="about__telemetry-badge" aria-live="polite">
                    <div className="about__telemetry-header">
                      <span className="about__telemetry-rec">●</span>
                      <span>{hoveredFrame.stock}</span>
                      <span className="about__telemetry-fr">FR {hoveredFrame.label}</span>
                    </div>
                    <div className="about__telemetry-title">{hoveredFrame.title}</div>
                    <div className="about__telemetry-specs">
                      <span>{hoveredFrame.lens}</span>
                      <span>{hoveredFrame.aperture}</span>
                      <span>{hoveredFrame.shutter}</span>
                      <span>{hoveredFrame.iso}</span>
                    </div>
                  </aside>
                )}

                {/* Glass Prism Perimeter Glow (Subtle accent) */}
                <div className="about__prism-edge" aria-hidden="true" />
              </div>

              {/* Bottom HUD: Coordinates & Mood Presets */}
              <footer className="about__visual-footer">
                <div className="about__hud-telemetry">
                  <span className="about__crosshair-mark">+</span>
                  <span className="about__hud-coords">
                    {tilt.active
                      ? `X: ${Math.round(tilt.px)}°  Y: ${Math.round(tilt.py)}°  TILT: ${Math.round(Math.abs(tilt.rx) + Math.abs(tilt.ry))}°`
                      : 'SYS: 35.4°N 139.6°E · 24FPS'}
                  </span>
                </div>

                {/* Lighting Mood Switcher */}
                <div className="about__mood-selector" role="group" aria-label="Lighting atmosphere">
                  <button
                    type="button"
                    className={`about__mood-btn ${lightMood === 'golden' ? 'about__mood-btn--active' : ''}`}
                    onClick={() => setLightMood('golden')}
                    title="Golden Hour sunlight"
                  >
                    Golden
                  </button>
                  <button
                    type="button"
                    className={`about__mood-btn ${lightMood === 'midnight' ? 'about__mood-btn--active' : ''}`}
                    onClick={() => setLightMood('midnight')}
                    title="Nocturnal blue tone"
                  >
                    Dusk
                  </button>
                  <button
                    type="button"
                    className={`about__mood-btn ${lightMood === 'mono' ? 'about__mood-btn--active' : ''}`}
                    onClick={() => setLightMood('mono')}
                    title="Classic 35mm monochrome"
                  >
                    Mono
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
