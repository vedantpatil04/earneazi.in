import type { ReactNode } from 'react';
import { SectionHeader } from './SectionHeader';

interface SectionHeadingProps {
  /** Matches the `aria-labelledby` on the parent Section, tying the landmark to its heading. */
  id: string;
  title: string;
  lead?: string;
  /** Optional trailing element (a link or button) that sits opposite the heading on wide screens. */
  action?: ReactNode;
  className?: string;
  tone?: 'default' | 'band';
  align?: 'start' | 'center';
}

/**
 * LEGACY — the pre-Phase-1 section heading, now a thin adapter over
 * `SectionHeader`.
 *
 * Kept so sections written before Phase 1 keep compiling and pick up the
 * new system without being redesigned ahead of the phase that owns them.
 * Two things changed underneath them by doing so, both required by the
 * audit rather than optional:
 *
 *   · the decorative eyebrow rule above every heading is gone (§17, §34);
 *   · the supporting action aligns to the heading's first baseline instead
 *     of to the block's end (§13 rule 5).
 *
 * New sections should import `SectionHeader` directly.
 */
export function SectionHeading({ id, title, lead, action, className, tone, align }: SectionHeadingProps) {
  return (
    <SectionHeader
      id={id}
      title={title}
      intro={lead}
      action={action}
      tone={tone}
      align={align}
      className={className}
    />
  );
}
