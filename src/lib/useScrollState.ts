import { useState, useEffect, useCallback } from 'react';

/**
 * Tracks scroll position and provides:
 * - isScrolled: true once user scrolls past a threshold
 * - activeSection: the currently visible section ID
 */
export function useScrollState(threshold = 50) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > threshold);

    // Determine which section is currently in view
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;

    let current = 'home';

    sections.forEach((section) => {
      const top = section.offsetTop;
      if (scrollPosition >= top) {
        current = section.id;
      }
    });

    setActiveSection(current);
  }, [threshold]);

  useEffect(() => {
    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { isScrolled, activeSection };
}
