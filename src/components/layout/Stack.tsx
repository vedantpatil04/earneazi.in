import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type StackDirection = 'row' | 'column';
type StackAlign = 'start' | 'center' | 'end' | 'stretch';
type StackJustify = 'start' | 'center' | 'end' | 'between';
type StackGap = 'xs' | 'sm' | 'md' | 'lg';

interface StackProps {
  as?: ElementType;
  direction?: StackDirection;
  align?: StackAlign;
  justify?: StackJustify;
  gap?: StackGap;
  wrap?: boolean;
  className?: string;
  children: ReactNode;
}

const directionStyles: Record<StackDirection, string> = { row: 'flex-row', column: 'flex-col' };
const alignStyles: Record<StackAlign, string> = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' };
const justifyStyles: Record<StackJustify, string> = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' };
const gapStyles: Record<StackGap, string> = { xs: 'gap-2', sm: 'gap-4', md: 'gap-6', lg: 'gap-8' };

/** Flex row/column primitive so components stop repeating the same handful of flex utility classes ad hoc. */
export function Stack({
  as: Tag = 'div',
  direction = 'column',
  align = 'stretch',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className,
  children,
}: StackProps) {
  return (
    <Tag className={cn('flex', directionStyles[direction], alignStyles[align], justifyStyles[justify], gapStyles[gap], wrap && 'flex-wrap', className)}>
      {children}
    </Tag>
  );
}
