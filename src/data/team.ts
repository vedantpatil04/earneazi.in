import type { TeamMember } from '@/types/content';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * THE FOUNDERS — CLIENT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Names and roles are as published on the current live site; the open
 * verification item there is the photography and the biography, not the
 * names (Phase 0 §24 / Blueprint D.5).
 *
 * Everything else below ships empty on purpose. Photography, tenure,
 * responsibility and bio are all [VERIFY], and the UI renders each one only
 * when it is present — so a field that has not been confirmed is absent
 * rather than guessed. A stock portrait standing in for a named real person
 * is a false representation of an actual employee, which is a harder line
 * than "temporary imagery is fine"; an invented "12 years in the industry"
 * is the same failure in text.
 *
 * ── TO GO LIVE ──────────────────────────────────────────────────────────
 *
 *   photoUrl + photoVerified   real photograph, cropped square, ≥320px
 *   bio + bioVerified          2–3 sentences in the site's plain voice
 *   tenure + tenureVerified    e.g. "In financial services since 2011"
 *   responsibility             what this person is actually accountable for
 *   focus                      2–4 short specialism tags
 *   credentialId               an identifier the client can evidence (ARN…)
 *
 * The founder section picks every one of these up automatically. No
 * component changes are needed.
 *
 * ── The monogram ────────────────────────────────────────────────────────
 *
 * Authored per person rather than derived from the name, which is the fix
 * for the defect §24 names explicitly: "Abhishek Sharma" and "Anil Souza"
 * both reduce to "AS" under initials-of-full-name, so the previous build
 * showed two identical marks for two different people. Taking the first two
 * letters of the given name separates them ("AB", "AN") and reads as a
 * designed mark rather than as a failed avatar — but it is written down
 * here, not computed, so a third founder whose name also collides is caught
 * by a person rather than by a user.
 */
export const teamMembers: TeamMember[] = [
  {
    id: 'founder-ceo',
    name: 'Abhishek Sharma',
    role: 'Founder & CEO',
    monogram: 'AB',
    /* Reuses the Phase 3 subject-accent channel, so the two founders are
       told apart by colour as well as by mark, inside the existing palette. */
    toneId: 'mutual-funds-pms',
    photoUrl: null,
    photoVerified: false,
    bio: '',
    bioVerified: false,
    tenure: null,
    tenureVerified: false,
    responsibility: null,
    focus: [],
    credentialId: null,
  },
  {
    id: 'co-founder-coo',
    name: 'Anil Souza',
    role: 'Co-Founder & COO',
    monogram: 'AN',
    toneId: 'insurance',
    photoUrl: null,
    photoVerified: false,
    bio: '',
    bioVerified: false,
    tenure: null,
    tenureVerified: false,
    responsibility: null,
    focus: [],
    credentialId: null,
  },
];

/** A photograph is shown only when there is one AND the client has confirmed it. */
export function hasVerifiedPhoto(member: TeamMember): boolean {
  return member.photoVerified && Boolean(member.photoUrl);
}

/** True once a founder has any confirmed detail beyond their name and role. */
export function hasVerifiedDetail(member: TeamMember): boolean {
  return (
    (member.bioVerified && member.bio.trim().length > 0) ||
    (member.tenureVerified && Boolean(member.tenure)) ||
    Boolean(member.responsibility) ||
    member.focus.length > 0
  );
}
