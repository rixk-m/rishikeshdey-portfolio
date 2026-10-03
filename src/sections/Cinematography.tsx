import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cineCopy, cineCountLabel, cinePhotos, cineReelSrc } from '../data/cinematography';
import CineWorld from './cinematography/CineWorld';
import ImageTrail from './cinematography/ImageTrail';
import { useFinePointer, useReducedMotion } from './cinematography/scroll';
import './Cinematography.css';

type Phase = 'idle' | 'wipe-in' | 'open' | 'wipe-out';
const WIPE_MS = 750;
const HISTORY_KEY = 'cine-world';

/* ================================================================
   ENTRY — the portal on the main page. Same split title as the
   world's opening, so entering feels like stepping through it.
   ================================================================ */
export default function Cinematography() {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const [phase, setPhase] = useState<Phase>('idle');
  const phaseRef = useRef<Phase>('idle');
  const [worldMounted, setWorldMounted] = useState(false);
  const [frame, setFrame] = useState(0);
  const [hover, setHover] = useState(false);
  const timers = useRef<number[]>([]);
  const wipeMs = reduced ? 1 : WIPE_MS;

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  /* Slow frame cycle inside the portal (paused under reduced motion). */
  useEffect(() => {
    if (reduced || cinePhotos.length < 2) return;
    const id = window.setInterval(
      () => setFrame((f) => (f + 1) % cinePhotos.length),
      hover ? 650 : 2200,
    );
    return () => clearInterval(id);
  }, [reduced, hover]);

  /* Lock the page underneath while the world is open. */
  useEffect(() => {
    if (!worldMounted) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
    };
  }, [worldMounted]);

  const close = useCallback(() => {
    if (phaseRef.current !== 'open' && phaseRef.current !== 'wipe-in') return;
    phaseRef.current = 'wipe-out';
    setPhase('wipe-out');
    later(() => {
      setWorldMounted(false);
      phaseRef.current = 'idle';
      setPhase('idle');
      document.getElementById('cine-enter')?.focus({ preventScroll: true });
    }, wipeMs);
  }, [later, wipeMs]);

  const enter = useCallback(() => {
    if (phaseRef.current !== 'idle') return;
    phaseRef.current = 'wipe-in';
    setPhase('wipe-in');
    setWorldMounted(true);
    try {
      history.pushState({ [HISTORY_KEY]: true }, '');
    } catch {
      // In case of environments restricting pushState
    }
    later(() => {
      phaseRef.current = 'open';
      setPhase('open');
    }, wipeMs);
  }, [later, wipeMs]);

  /* Browser back button leaves the world. */
  useEffect(() => {
    const onPop = () => {
      if (phaseRef.current === 'open' || phaseRef.current === 'wipe-in') {
        close();
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [close]);

  const exit = useCallback(() => {
    if (history.state?.[HISTORY_KEY]) {
      try {
        history.back();
      } catch {
        // Safe fallback
      }
    }
    close();
  }, [close]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (phaseRef.current !== 'idle') return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enter();
      }
    },
    [enter],
  );

  const current = cinePhotos[frame];

  return (
    <>
      <section
        id="cinematography"
        className={`cine-entry${hover ? ' is-hover' : ''}`}
        role="button"
        tabIndex={worldMounted ? -1 : 0}
        aria-label="Enter Cinematography experience"
        onClick={enter}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <ImageTrail disabled={phase !== 'idle'} />

        <div className="cine-entry__top">
          <span className="cine-mono">(Cinematography)</span>
          <span className="cine-mono">
            {cineCountLabel} frames{cineReelSrc ? ' — 01 reel' : ''}
          </span>
        </div>

        <h2 className="cine-entry__title">
          <span className="cine-entry__line cine-entry__line--a">{cineCopy.title[0]}</span>
          <span className="cine-entry__line cine-entry__line--b">{cineCopy.title[1]}</span>
        </h2>

        {current && (
          <button
            type="button"
            id="cine-enter"
            className={`cine-entry__portal${hover ? ' is-hover' : ''}`}
            onClick={enter}
            onKeyDown={handleKeyDown}
            tabIndex={worldMounted ? -1 : 0}
            aria-label="Enter the cinematography experience"
          >
            <span className="cine-entry__portal-mask">
              {cinePhotos.map((p, i) => (
                <img
                  key={p.id}
                  src={p.srcSmall}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={i === frame ? 'is-active' : ''}
                  draggable={false}
                />
              ))}
            </span>
            <span className="cine-entry__cta cine-mono">
              <span className="cine-dot" aria-hidden="true" />
              {cineCopy.enter}
            </span>
            <span className="cine-entry__count cine-mono" aria-hidden="true">
              {current.label} / {cineCountLabel}
            </span>
          </button>
        )}

        <div className="cine-entry__bottom">
          <span className="cine-mono cine-entry__action">{fine ? 'Click to enter' : 'Tap to enter'}</span>
          <span className="cine-mono">Photography &amp; motion</span>
        </div>
      </section>

      {/* Colour wipe between worlds — portal to body so it is always above all stacking contexts */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`cine-wipe cine-wipe--${phase}${reduced ? ' cine-wipe--reduced' : ''}`}
            aria-hidden="true"
          >
            <span className="cine-wipe__label cine-mono">
              <span className="cine-dot" /> Loading
            </span>
          </div>,
          document.body,
        )}

      {worldMounted && <CineWorld reduced={reduced} onExit={exit} />}
    </>
  );
}
