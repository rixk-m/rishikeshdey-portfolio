import { createContext, useContext, useEffect, useRef, useState, type RefObject } from 'react';

/**
 * The cinematography world is a fixed overlay with its own scroll
 * container. Components read scroll progress relative to that element.
 */
export const ScrollerContext = createContext<HTMLElement | null>(null);

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Calls `cb(progress)` on every frame the scroller moves.
 * progress = 0 when the element's top hits the viewport top,
 * progress = 1 when its bottom hits the viewport bottom (pinned range).
 */
export function usePinProgress(
  ref: RefObject<HTMLElement | null>,
  cb: (p: number) => void,
) {
  const scroller = useContext(ScrollerContext);
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    if (!scroller) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = scroller.clientHeight;
      const travel = r.height - vh;
      cbRef.current(travel > 0 ? clamp(-r.top / travel) : r.top <= 0 ? 1 : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    run();
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scroller, ref]);
}

/** One-shot "has entered the viewport" flag, relative to the world scroller. */
export function useEntered(ref: RefObject<HTMLElement | null>, threshold = 0.2) {
  const scroller = useContext(ScrollerContext);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || entered) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEntered(true);
          io.disconnect();
        }
      },
      { root: scroller, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, scroller, threshold, entered]);
  return entered;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

export function useFinePointer() {
  const [fine, setFine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const on = () => setFine(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return fine;
}
