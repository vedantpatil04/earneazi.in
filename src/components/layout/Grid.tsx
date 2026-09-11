import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Grid — Phase 0 §14.
 *
 * Two modes, and the second is the one that fixes the audit's alignment
 * findings:
 *
 *   equal      `cols={{ base, md, lg }}` — a plain equal-width grid. The
 *              existing API, unchanged.
 *   canonical  `columns="canonical"` — the site's 4 / 8 / 12 column grid.
 *              Children use `GridItem` to declare a span and, where needed,
 *              a start column.
 *
 * The canonical grid exists because §13 rule 2 requires a section header and
 * the grid beneath it to share a starting and ending column. Declaring both
 * against the same 12-column frame is what makes that checkable rather than
 * a matter of eyeballing padding — the "header at 48%, grid at 100%" pattern
 * the audit found is impossible to write by accident once both are spans.
 *
 * Gap is 24px throughout (§14), matching the column gap the grid is drawn on.
 */

type GridGap = 'sm' | 'md' | 'lg';
type ColumnCount = 1 | 2 | 3 | 4 | 6 | 12;

interface GridProps {
  as?: ElementType;
  /** Equal-width mode. Ignored when `columns="canonical"`. */
  cols?: { base?: ColumnCount; md?: ColumnCount; lg?: ColumnCount };
  /** `canonical` switches to the site's 4/8/12 frame; children use GridItem. */
  columns?: 'equal' | 'canonical';
  gap?: GridGap;
  className?: string;
  children: ReactNode;
}

// Written as full literal class strings (not template-built) so Tailwind's
// content scanner can find them — see the `content` globs in tailwind.config.ts.
const baseColsMap: Record<ColumnCount, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};
const mdColsMap: Record<ColumnCount, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  6: 'md:grid-cols-6',
  12: 'md:grid-cols-12',
};
const lgColsMap: Record<ColumnCount, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  6: 'lg:grid-cols-6',
  12: 'lg:grid-cols-12',
};

const gapStyles: Record<GridGap, string> = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

/** 4 columns below 768, 8 from 768, 12 from 1024 — §14. */
const CANONICAL = 'grid-cols-4 md:grid-cols-8 lg:grid-cols-12';

export function Grid({ as: Tag = 'div', cols = { base: 1 }, columns = 'equal', gap = 'md', className, children }: GridProps) {
  return (
    <Tag
      className={cn(
        'grid',
        columns === 'canonical'
          ? CANONICAL
          : [cols.base && baseColsMap[cols.base], cols.md && mdColsMap[cols.md], cols.lg && lgColsMap[cols.lg]]
              .filter(Boolean)
              .join(' '),
        gapStyles[gap],
        className
      )}
    >
      {children}
    </Tag>
  );
}

type Span = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface GridItemProps {
  as?: ElementType;
  /** Columns spanned at each breakpoint. Defaults to the full width of the frame. */
  span?: { base?: Span; md?: Span; lg?: Span };
  /** Starting column, 1-indexed. Only needed where a block does not follow the previous one. */
  start?: { md?: Span; lg?: Span };
  className?: string;
  children: ReactNode;
}

const spanBase: Record<Span, string> = {
  1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4', 5: 'col-span-5', 6: 'col-span-6',
  7: 'col-span-7', 8: 'col-span-8', 9: 'col-span-9', 10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12',
};
const spanMd: Record<Span, string> = {
  1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4', 5: 'md:col-span-5', 6: 'md:col-span-6',
  7: 'md:col-span-7', 8: 'md:col-span-8', 9: 'md:col-span-9', 10: 'md:col-span-10', 11: 'md:col-span-11', 12: 'md:col-span-12',
};
const spanLg: Record<Span, string> = {
  1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4', 5: 'lg:col-span-5', 6: 'lg:col-span-6',
  7: 'lg:col-span-7', 8: 'lg:col-span-8', 9: 'lg:col-span-9', 10: 'lg:col-span-10', 11: 'lg:col-span-11', 12: 'lg:col-span-12',
};
const startMd: Record<Span, string> = {
  1: 'md:col-start-1', 2: 'md:col-start-2', 3: 'md:col-start-3', 4: 'md:col-start-4', 5: 'md:col-start-5', 6: 'md:col-start-6',
  7: 'md:col-start-7', 8: 'md:col-start-8', 9: 'md:col-start-9', 10: 'md:col-start-10', 11: 'md:col-start-11', 12: 'md:col-start-12',
};
const startLg: Record<Span, string> = {
  1: 'lg:col-start-1', 2: 'lg:col-start-2', 3: 'lg:col-start-3', 4: 'lg:col-start-4', 5: 'lg:col-start-5', 6: 'lg:col-start-6',
  7: 'lg:col-start-7', 8: 'lg:col-start-8', 9: 'lg:col-start-9', 10: 'lg:col-start-10', 11: 'lg:col-start-11', 12: 'lg:col-start-12',
};

/**
 * A block inside a canonical grid. Spans default to the full frame at each
 * breakpoint, so a block that says nothing occupies the whole row rather
 * than collapsing into an accidental narrow column.
 */
export function GridItem({ as: Tag = 'div', span, start, className, children }: GridItemProps) {
  return (
    <Tag
      className={cn(
        spanBase[span?.base ?? 4],
        spanMd[span?.md ?? 8],
        spanLg[span?.lg ?? 12],
        start?.md && startMd[start.md],
        start?.lg && startLg[start.lg],
        className
      )}
    >
      {children}
    </Tag>
  );
}
