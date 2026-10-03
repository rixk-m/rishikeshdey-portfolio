import { Navigation, Section, SectionHeading } from './components';
import Hero from './sections/Hero';
import About from './sections/About';
import Cinematography from './sections/Cinematography';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navigation />

      {/* ── HERO — Phase 3 ── */}
      <Hero />

      {/* ── ABOUT — Phase 4 ── */}
      <About />

      <Section id="work">
        <SectionHeading
          eyebrow="Selected Work"
          title="Projects"
          description="This section will be built in Phase 6."
        />
        <div className="app__placeholder-block" />
      </Section>

      {/* ── CINEMATOGRAPHY — Phase 5 ── */}
      <Cinematography />

      {/* ── CONTACT — Phase 8 ── */}
      <Contact />

      {/* ── FOOTER — Phase 8 ── */}
      <Footer />
    </div>
  );
}

export default App;
