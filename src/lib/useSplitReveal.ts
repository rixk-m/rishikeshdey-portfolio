import { useEffect, useRef, useState } from 'react';

/**
 * Staggered reveal for a list of child elements.
 * Observes the parent, then triggers reveal with per-child delay.
 * One-shot — once triggered, stays visible.
 *
 * @param stagger  – delay between each child in ms
 * @param threshold – visibility ratio required (0–1)
 */
export function useSplitReveal(
  stagger = 60,
  threshold = 0.15,
) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, revealed, stagger };
}
