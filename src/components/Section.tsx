import type { ReactNode, HTMLAttributes } from 'react';
import './Section.css';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Section ID for anchor navigation */
  id?: string;
  /** Content width constraint */
  width?: 'default' | 'narrow' | 'wide' | 'full';
  /** Remove vertical padding */
  flush?: boolean;
  /** Use <div> instead of <section> (e.g. for non-semantic wrappers) */
  as?: 'section' | 'div';
  children: ReactNode;
}

export default function Section({
  id,
  width = 'default',
  flush = false,
  as: Tag = 'section',
  children,
  className = '',
  ...rest
}: SectionProps) {
  const classes = [
    'section',
    width !== 'default' ? `section--${width}` : '',
    flush ? 'section--flush' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag id={id} className={classes} {...rest}>
      <div className="section__inner">
        {children}
      </div>
    </Tag>
  );
}
