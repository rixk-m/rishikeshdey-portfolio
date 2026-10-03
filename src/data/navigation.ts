/* ============================================================
   NAVIGATION DATA
   
   Centralized navigation links used by both desktop and mobile nav.
   ============================================================ */

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home',           href: '#home' },
  { label: 'About',          href: '#about' },
  { label: 'Work',           href: '#work' },
  { label: 'Cinematography', href: '#cinematography' },
  { label: 'Contact',        href: '#contact' },
];

export const SITE_NAME = 'Rishikesh';
