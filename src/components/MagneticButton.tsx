import type { ReactNode, HTMLAttributes } from 'react';
import { useMagneticEffect } from '../lib/useMagneticEffect';
import './MagneticButton.css';

interface MagneticButtonProps extends HTMLAttributes<HTMLDivElement> {
  /** Magnetic pull strength (0–1). Default 0.25 */
  strength?: number;
  /** Render as anchor link */
  href?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps any child element with a magnetic pull effect.
 * The wrapper is a <div> with the magnetic behavior;
 * the inner content (button or link) renders unchanged.
 *
 * On touch devices / reduced motion, the magnetic behavior
 * is automatically disabled.
 */
export default function MagneticButton({
  strength = 0.25,
  href,
  children,
  className = '',
  ...rest
}: MagneticButtonProps) {
  const magneticRef = useMagneticEffect<HTMLDivElement>(strength);

  const classes = ['magnetic-btn', className].filter(Boolean).join(' ');

  const inner = href ? (
    <a href={href} className="magnetic-btn__inner">
      {children}
    </a>
  ) : (
    <span className="magnetic-btn__inner">{children}</span>
  );

  return (
    <div ref={magneticRef} className={classes} {...rest}>
      {inner}
    </div>
  );
}
