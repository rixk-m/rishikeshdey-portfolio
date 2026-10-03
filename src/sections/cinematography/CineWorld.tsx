import { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  cineCopy,
  cineCount,
  cineCountLabel,
  cineOpening,
  cinePhotos,
  cinePlates,
  cineReelSrc,
  type CinePhoto,
} from '../../data/cinematography';
import ImageTrail from './ImageTrail';
import { ScrollerContext, easeInOut, range, useEntered, usePinProgress } from './scroll';

interface WorldProps {
  reduced: boolean;
  onExit: () => void;
}

/* ================================================================
   PHOTO — shared <img> with responsive derivatives
   ================================================================ */
function Photo({ photo, eager, sizes = '100vw' }: { photo: CinePhoto; eager?: boolean; sizes?: string }) {
  return (
    <img
      src={photo.src}
      srcSet={`${photo.srcSmall} 640w, ${photo.src} 1600w`}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={`Cinematography photograph ${photo.label} of ${cineCountLabel}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  );
}

/* ================================================================
   01 · OPENING — title splits apart while a framed photograph
   opens to full-bleed (pinned)
   ================================================================ */
function Opening({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const l1 = useRef<HTMLSpanElement>(null);
  const l2 = useRef<HTMLSpanElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  usePinProgress(ref, (p) => {
    setScrolled(p > 0.25);
    if (reduced || !frame.current || !img.current || !l1.current || !l2.current || !hint.current) return;
    const t = easeInOut(range(p, 0.05, 0.75));
    const v = 31 * (1 - t); // vertical inset %
    const h = 36 * (1 - t); // horizontal inset %
    frame.current.style.clipPath = `inset(${v}% ${h}% ${v}% ${h}%)`;
    img.current.style.transform = `scale(${1.3 - 0.3 * t})`;
    l1.current.style.transform = `translate3d(${-t * 40}vw,0,0)`;
    l2.current.style.transform = `translate3d(${t * 40}vw,0,0)`;
    const fade = String(1 - range(p, 0.45, 0.75));
    l1.current.style.opacity = fade;
    l2.current.style.opacity = fade;
    hint.current.style.opacity = String(1 - range(p, 0, 0.12));
  });

  if (!cineOpening) return null;
  return (
    <section ref={ref} className="cw-open" aria-label="Opening">
      <div className="cw-open__stage">
        <ImageTrail disabled={scrolled} />
        <div ref={frame} className="cw-open__frame" style={{ backgroundColor: cineOpening.color }}>
          <div ref={img} className="cw-open__img">
            <Photo photo={cineOpening} eager />
          </div>
        </div>
        <h1 className="cw-open__title">
          <span ref={l1} className="cw-open__line cw-open__line--a">{cineCopy.title[0]}</span>
          <span ref={l2} className="cw-open__line cw-open__line--b">{cineCopy.title[1]}</span>
        </h1>
        <div ref={hint} className="cw-open__meta">
          <span className="cw-mono">({cineCountLabel}) frames</span>
          <span className="cw-mono cw-open__scroll">Scroll</span>
          <span className="cw-mono">{cineReelSrc ? '01 reel' : ''}</span>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   02 · STATEMENT — words rise line by line
   ================================================================ */
function Statement() {
  const ref = useRef<HTMLElement>(null);
  const entered = useEntered(ref, 0.3);
  const words = cineCopy.statement.split(' ');
  return (
    <section ref={ref} className={`cw-statement${entered ? ' is-in' : ''}`}>
      <span className="cw-mono cw-statement__label">({cineCopy.statementLabel})</span>
      <p className="cw-statement__text">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="cw-word">
              <span style={{ transitionDelay: `${i * 22}ms` }}>{w}</span>
            </span>
            {' '}
          </Fragment>
        ))}
      </p>
    </section>
  );
}

/* ================================================================
   03 · COLLAGE — Matter-of-Mind Signature Editorial Grid
   Multi-column asymmetric photo collage with mint-accented indexes
   (02 •), tactile rounded cards, hover zoom, and lightbox inspection.
   ================================================================ */
function Collage({ photos, onOpen }: { photos: CinePhoto[]; onOpen: (p: CinePhoto) => void }) {
  // Asymmetric 2-column editorial arrangement:
  // Left column: 02 (Danny concert 4:3), 04 (landscape 3:2), 06 (landscape 3:2)
  // Right column: 03 (tall portrait 2:3), 05 (landscape 4:3), 07 (landscape 3:2)
  const leftCol = photos.filter((_, i) => i % 2 === 0);
  const rightCol = photos.filter((_, i) => i % 2 === 1);

  return (
    <section className="cw-collage" aria-label="Photography Archive">
      <div className="cw-collage__grid">
        <div className="cw-collage__col">
          {leftCol.map((photo) => (
            <CollageCard key={photo.id} photo={photo} onOpen={onOpen} />
          ))}
        </div>
        <div className="cw-collage__col">
          {rightCol.map((photo) => (
            <CollageCard key={photo.id} photo={photo} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollageCard({ photo, onOpen }: { photo: CinePhoto; onOpen: (p: CinePhoto) => void }) {
  return (
    <button
      type="button"
      className="cw-card"
      style={{ ['--r' as string]: photo.ratio, backgroundColor: photo.color }}
      onClick={() => onOpen(photo)}
      aria-label={`View photograph ${photo.label} fullscreen`}
    >
      <div className="cw-card__overlay">
        <span className="cw-card__num">{photo.label}</span>
        <span className="cw-card__dot" aria-hidden="true" />
      </div>
      <div className="cw-card__img">
        <Photo photo={photo} sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
    </button>
  );
}

/* ================================================================
   04 · REEL — the delivered showreel opens to full screen.
   Played exactly as delivered: no trimming, no time logic.
   ================================================================ */
function Reel({ src, reduced }: { src: string; reduced: boolean }) {
  const scroller = useContext(ScrollerContext);
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState('00:00');
  const userPaused = useRef(false);

  usePinProgress(ref, (p) => {
    if (reduced || !frame.current || !title.current) return;
    const t = easeInOut(range(p, 0, 0.45));
    const v = 24 * (1 - t);
    const h = 30 * (1 - t);
    frame.current.style.clipPath = `inset(${v}% ${h}% ${v}% ${h}%)`;
    title.current.style.opacity = String(1 - range(p, 0.1, 0.35));
  });

  /* Autoplay muted when reached, pause when left. */
  useEffect(() => {
    const v = video.current;
    const section = ref.current;
    if (!v || !section) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!userPaused.current) v.play().catch(() => setPlaying(false));
        } else {
          v.pause();
        }
      },
      { root: scroller, threshold: 0.35 },
    );
    io.observe(frame.current ?? section);
    return () => io.disconnect();
  }, [scroller]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const fmt = (s: number) =>
      `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    const onTime = () => {
      setTime(fmt(v.currentTime));
      if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVol = () => setMuted(v.muted);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onPause);
    v.addEventListener('volumechange', onVol);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onPause);
      v.removeEventListener('volumechange', onVol);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = video.current;
    if (v) v.muted = !v.muted;
  }, []);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = video.current;
    if (!v || !v.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = range(e.clientX, r.left, r.right) * v.duration;
  }, []);

  return (
    <section ref={ref} className="cw-reel" aria-label="Showreel">
      <div className="cw-reel__stage">
        <h2 ref={title} className="cw-reel__title">{cineCopy.reelLabel}</h2>
        <div ref={frame} className="cw-reel__frame">
          <video
            ref={video}
            className="cw-reel__video"
            src={src}
            muted
            playsInline
            preload="metadata"
            onClick={togglePlay}
            aria-label="Cinematography showreel"
          />
          <div className="cw-reel__ui">
            <div className="cw-reel__row">
              <button type="button" className="cw-mono cw-reel__btn" onClick={togglePlay}>
                <span className={`cw-dot${playing ? ' cw-dot--live' : ''}`} aria-hidden="true" />
                {playing ? 'Pause' : 'Play'}
              </button>
              <span className="cw-mono cw-reel__time">{time}</span>
              <button type="button" className="cw-mono cw-reel__btn" onClick={toggleMute} aria-pressed={!muted}>
                {muted ? 'Sound off' : 'Sound on'}
              </button>
            </div>
            <div
              className="cw-reel__track"
              onClick={seek}
              role="presentation"
            >
              <span ref={bar} className="cw-reel__bar" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   05 · OUTRO — giant return link & representation
   ================================================================ */
function Outro({ onExit }: { onExit: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const entered = useEntered(ref, 0.25);
  return (
    <section ref={ref} className={`cw-outro${entered ? ' is-in' : ''}`}>
      <p className="cw-outro__kicker">
        <span>{cineCopy.outro[0]}</span>
        <span>{cineCopy.outro[1]}</span>
      </p>

      <div className="cw-outro__team">
        <div className="cw-outro__team-label cw-mono">
          <span className="cw-dot" aria-hidden="true" />
          <span>Representation &amp; Inquiries</span>
        </div>
        <p className="cw-outro__team-copy">
          For more work, commercial commissions &amp; cinematography reels, contact my team:
        </p>
        <a
          href="https://www.theiamedia.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="cw-outro__team-link"
          aria-label="Visit The Theia Media website (opens in a new tab)"
        >
          <img
            src="/assets/theia-logo-white.png"
            alt="Theia Photography logo"
            className="cw-outro__team-logo"
            loading="lazy"
            draggable={false}
          />
          <span className="cw-outro__team-name">The Theia Media</span>
          <span className="cw-outro__team-arrow" aria-hidden="true">↗</span>
        </a>
      </div>

      <button type="button" className="cw-outro__back" onClick={onExit} id="cine-world-return">
        <span className="cw-outro__back-text">{cineCopy.back}</span>
        <span className="cw-outro__arrow" aria-hidden="true">↩</span>
      </button>
      <div className="cw-outro__foot">
        <span className="cw-mono">Cinematography archive</span>
        <span className="cw-mono">
          {cineCountLabel} frames{cineReelSrc ? ' · 01 reel' : ''}
        </span>
      </div>
    </section>
  );
}

/* ================================================================
   VIEWER — fullscreen single frame
   ================================================================ */
function Viewer({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const photo = cinePhotos[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose, onStep]);

  return (
    <div className="cw-viewer" role="dialog" aria-modal="true" aria-label="Photograph viewer">
      <button type="button" className="cw-viewer__bg" onClick={onClose} aria-label="Close viewer" />
      <img key={photo.id} className="cw-viewer__img" src={photo.src} alt={`Cinematography photograph ${photo.label}`} />
      <div className="cw-viewer__bar">
        <button type="button" className="cw-mono" onClick={() => onStep(-1)}>Prev</button>
        <span className="cw-mono">{photo.label} / {cineCountLabel}</span>
        <button type="button" className="cw-mono" onClick={() => onStep(1)}>Next</button>
      </div>
      <button type="button" className="cw-mono cw-viewer__close" onClick={onClose}>Close</button>
    </div>
  );
}

/* ================================================================
   WORLD — fixed overlay with its own scroll container
   ================================================================ */
export default function CineWorld({ reduced, onExit }: WorldProps) {
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const [viewer, setViewer] = useState<number | null>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!scroller) return;
    scroller.focus({ preventScroll: true });
    const onScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      if (progress.current && max > 0) progress.current.style.transform = `scaleX(${scroller.scrollTop / max})`;
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [scroller]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit]);

  const openPhoto = useCallback((p: CinePhoto) => setViewer(cinePhotos.indexOf(p)), []);
  const step = useCallback((d: number) => setViewer((i) => (i === null ? i : (i + d + cineCount) % cineCount)), []);
  const closeViewer = useCallback(() => setViewer(null), []);

  return createPortal(
    <div className={`cw${reduced ? ' cw--reduced' : ''}`} role="dialog" aria-modal="true" aria-label="Cinematography">
      <header className="cw-bar">
        <span className="cw-mono cw-bar__brand">
          <span className="cw-dot cw-dot--blink" aria-hidden="true" /> Cinematography
        </span>
        <button type="button" className="cw-mono cw-bar__back" onClick={onExit} id="cine-world-close">
          {cineCopy.back} <span aria-hidden="true">✕</span>
        </button>
        <span className="cw-bar__progress" aria-hidden="true">
          <span ref={progress} />
        </span>
      </header>

      <div ref={setScroller} className="cw-scroller" tabIndex={-1}>
        <ScrollerContext.Provider value={scroller}>
          {scroller && (
            <>
              <Opening reduced={reduced} />
              <Statement />
              <Collage photos={cinePlates} onOpen={openPhoto} />
              {cineReelSrc && <Reel src={cineReelSrc} reduced={reduced} />}
              <Outro onExit={onExit} />
            </>
          )}
        </ScrollerContext.Provider>
      </div>

      {viewer !== null && <Viewer index={viewer} onClose={closeViewer} onStep={step} />}
    </div>,
    document.body,
  );
}
