import { useRef, useCallback, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Magnetic pull effect for interactive elements.
 * The element subtly follows the cursor within its bounding box.
 *
 * @param strength  – pull intensity (0–1). Default 0.3
 * @param ease      – CSS transition value for snap-back
 */
export function useMagneticEffect<T extends HTMLElement>(
  strength = 0.3,
  ease = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const rafId = useRef(0);

  const handleMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el || reduced) return;

      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;

        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    },
    [strength, reduced],
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafId.current);
    el.style.transform = 'translate(0, 0)';
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    el.style.transition = ease;
    el.style.willChange = 'transform';

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(rafId.current);
      el.style.transform = '';
      el.style.transition = '';
      el.style.willChange = '';
    };
  }, [handleMove, handleLeave, ease, reduced]);

  return ref;
}
