import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Tracks scroll progress of an element through the viewport.
 * Returns a value from 0 (element just entering bottom) to 1 (element leaving top).
 *
 * @param offset - Adjusts the trigger zone. Positive values start tracking earlier.
 */
export function useScrollProgress(offset = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafId = useRef(0);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;

    // 0 = element bottom is at viewport bottom
    // 1 = element top is at viewport top
    const start = windowH + offset;
    const end = -rect.height - offset;
    const raw = (start - rect.top) / (start - end);
    const clamped = Math.min(1, Math.max(0, raw));

    setProgress(clamped);
  }, [offset]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    update(); // initial
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [update]);

  return { ref, progress };
}
