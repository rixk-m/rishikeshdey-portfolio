import { useInView } from '../lib/useInView';
import './About.css';

const DISCIPLINES = [
  'Frontend Development',
  'Creative Coding',
  'Interaction Design',
  'Visual Storytelling',
  'Cinematography',
];

export default function About() {
  const { ref, inView } = useInView<HTMLElement>(0.1);

  return (
    <section
      id="about"
      ref={ref}
      className={`about ${inView ? 'about--visible' : ''}`}
      aria-label="About"
    >
      <div className="about__inner">
        {/* ── Opening Statement ── */}
        <div className="about__top">
          <div className="about__eyebrow">
            <span className="about__eyebrow-line" />
            About
          </div>
          <h2 className="about__statement">
            I build digital experiences where technology meets{' '}
            <span className="about__statement-accent">
              visual storytelling
            </span>
            .
          </h2>
        </div>

        {/* ── Editorial Grid ── */}
        <div className="about__grid">
          {/* Text column */}
          <div className="about__copy">
            <p className="about__paragraph">
              I work across the intersection of frontend engineering,
              creative development and cinematography — crafting
              interfaces that feel alive, intentional and cinematic.
            </p>
            <p className="about__paragraph">
              Every project is an opportunity to merge code with visual
              narrative. Whether it's a scroll-driven experience, an
              interactive editorial layout, or a short film — the goal
              is always the same: make people feel something.
            </p>

            <div className="about__disciplines">
              {DISCIPLINES.map((d) => (
                <span key={d} className="about__discipline">{d}</span>
              ))}
            </div>
          </div>

          {/* Image column */}
          <div className="about__images">
            <div className="about__image-wrapper about__image-wrapper--primary">
              <img
                src="/assets/personal/rishikesh-about.jpg.jpg"
                alt="Rishikesh in a creative studio environment"
                className="about__image"
                loading="lazy"
                decoding="async"
              />
              <span className="about__image-caption">Behind the lens</span>
            </div>
            <div className="about__image-wrapper about__image-wrapper--secondary">
              <img
                src="/assets/personal/rishikesh-secondary.jpg.jpg"
                alt="Rishikesh — portrait at night"
                className="about__image"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
