import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type SectionSpacing = 'sm' | 'md' | 'lg' | 'xl';
type SectionBackground = 'bg' | 'surface' | 'surface-2' | 'band';

interface SectionProps {
  as?: ElementType;
  id?: string;
  spacing?: SectionSpacing;
  background?: SectionBackground;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const spacingStyles: Record<SectionSpacing, string> = {
  sm: 'py-10 md:py-14',
  md: 'py-14 md:py-20',
  lg: 'py-16 md:py-28',
  xl: 'py-20 md:py-32',
};

const backgroundStyles: Record<SectionBackground, string> = {
  bg: 'bg-bg',
  surface: 'bg-surface',
  'surface-2': 'bg-surface-2',
  // The single full-bleed high-contrast band on the page (the closing
  // consultation CTA). Dark in both themes — see --color-band. Not for
  // routine section alternation.
  band: 'bg-band',
};

/** Establishes the vertical rhythm for a page — alternate `background` between sections rather than adding borders or shadows to separate them. */
export function Section({
  as: Tag = 'section',
  id,
  spacing = 'md',
  background = 'bg',
  className,
  children,
  ...aria
}: SectionProps) {
  return (
    <Tag id={id} className={cn(spacingStyles[spacing], backgroundStyles[background], className)} {...aria}>
      {children}
    </Tag>
  );
}
