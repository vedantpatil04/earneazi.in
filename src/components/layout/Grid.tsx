import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type GridGap = 'sm' | 'md' | 'lg';

interface GridProps {
  as?: ElementType;
  /** Column count at each breakpoint. Only 1-4 are supported (see colsClassMap) — that covers every layout this foundation needs. */
  cols?: { base?: 1 | 2 | 3 | 4; md?: 1 | 2 | 3 | 4; lg?: 1 | 2 | 3 | 4 };
  gap?: GridGap;
  className?: string;
  children: ReactNode;
}

// Written as full literal class strings (not template-built) so Tailwind's
// content scanner can find them — see tailwind.config.ts's `content` globs.
const baseColsMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};
const mdColsMap: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};
const lgColsMap: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

const gapStyles: Record<GridGap, string> = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

export function Grid({ as: Tag = 'div', cols = { base: 1 }, gap = 'md', className, children }: GridProps) {
  return (
    <Tag
      className={cn(
        'grid',
        cols.base && baseColsMap[cols.base],
        cols.md && mdColsMap[cols.md],
        cols.lg && lgColsMap[cols.lg],
        gapStyles[gap],
        className
      )}
    >
      {children}
    </Tag>
  );
}
