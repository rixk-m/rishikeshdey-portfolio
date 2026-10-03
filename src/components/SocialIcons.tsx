import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/* ============================================================
   SOCIAL ICONS
   
   Minimal line-stroke icons matching the design specification:
   Instagram, Mailbox, and LinkedIn.
   ============================================================ */

export function InstagramIcon({ size = 26, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.25" cy="6.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MailboxIcon({ size = 26, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Mailbox dome body */}
      <path d="M3.5 17h13.5v-6.5a4.5 4.5 0 0 0-4.5-4.5h-4.5a4.5 4.5 0 0 0-4.5 4.5v6.5z" />
      {/* Vertical post extending above and below */}
      <path d="M17 5v15" />
      {/* Little flag at top right */}
      <path d="M17 6.5h3.5" />
      {/* Mail slot line */}
      <line x1="6.5" y1="13.5" x2="9.5" y2="13.5" />
    </svg>
  );
}

export function LinkedInIcon({ size = 26, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="4.5" />
      {/* 'i' */}
      <circle cx="7.5" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
      <line x1="7.5" y1="11" x2="7.5" y2="16.5" />
      {/* 'n' */}
      <path d="M11.75 16.5v-5.5" />
      <path d="M11.75 13.5c0-1.5 1-2.5 2.5-2.5s2.25 1 2.25 2.5v3" />
    </svg>
  );
}
