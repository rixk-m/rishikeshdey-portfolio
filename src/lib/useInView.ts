import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref and a boolean indicating whether the element
 * has entered the viewport. Once triggered, stays true (one-shot).
 *
 * @param threshold – visibility ratio required (0–1)
 * @param rootMargin – IntersectionObserver rootMargin
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
  rootMargin = '0px 0px -60px 0px',
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}

