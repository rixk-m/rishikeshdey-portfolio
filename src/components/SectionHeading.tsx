import type { ReactNode } from 'react';
import { useInView } from '../lib/useInView';
import './SectionHeading.css';

interface SectionHeadingProps {
  /** Small uppercase label above the title */
  eyebrow?: string;
  /** Main title */
  title: string;
  /** Optional supporting description */
  description?: ReactNode;
  /** Center-align everything */
  center?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
  className = '',
}: SectionHeadingProps) {
  const { ref, inView } = useInView<HTMLElement>(0.2);

  const classes = [
    'section-heading',
    center ? 'section-heading--center' : '',
    inView ? 'section-heading--visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header ref={ref} className={classes}>
      {eyebrow && (
        <span className="section-heading__eyebrow">{eyebrow}</span>
      )}
      <h2 className="section-heading__title">{title}</h2>
      {description && (
        <p className="section-heading__description">{description}</p>
      )}
    </header>
  );
}
