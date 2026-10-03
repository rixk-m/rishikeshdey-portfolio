/* ============================================================
   CONTACT DATA
   
   Centralized contact and personal metadata for the portfolio.
   Only real, verified project details are included.
   Configurable fields are ready for author population.
   ============================================================ */

export interface SocialLink {
  label: string;
  href: string;
}

export interface ContactData {
  name: string;
  roles: string[];
  location: string;
  availability: string;
  statusText: string;
  email: string;
  instagram: string;
  linkedin: string;
  socials: SocialLink[];
}

export const CONTACT_DATA: ContactData = {
  name: 'Rishikesh',
  roles: ['Creative Developer', 'Cinematographer', 'Editor'],
  location: 'India',
  availability: 'Available for freelance & collaboration',
  statusText: 'Open to new opportunities',
  // Configurable email — mailto: will prompt mail client. Populate with direct address as needed.
  email: '',
  // Social profile links
  instagram: 'https://www.instagram.com/ricxk.m/',
  linkedin: 'https://www.linkedin.com/in/rishikesh-dey',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/ricxk.m/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rishikesh-dey' },
  ],
};
