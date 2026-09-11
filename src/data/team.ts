import type { TeamMember } from '@/types/content';

/**
 * Names/roles below are as published on the current live site (Phase 0
 * Blueprint, Section D.5 — the open verification item there is the
 * photography, not the names). Photos and bios are intentionally NOT
 * populated: real photography is required (never a generated/stock
 * "team" photo standing in for a real person), and bio copy is
 * unverified. Do not flip either verified flag until the client confirms.
 */
export const teamMembers: TeamMember[] = [
  {
    id: 'founder-ceo',
    name: 'Abhishek Sharma',
    role: 'Founder & CEO',
    photoUrl: null,
    photoVerified: false,
    bio: 'Bio pending verification — Section D.5.',
    bioVerified: false,
  },
  {
    id: 'co-founder-coo',
    name: 'Anil Souza',
    role: 'Co-Founder & COO',
    photoUrl: null,
    photoVerified: false,
    bio: 'Bio pending verification — Section D.5.',
    bioVerified: false,
  },
];
