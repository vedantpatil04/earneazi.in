import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type ContainerSize = 'narrow' | 'default' | 'wide' | 'full';

interface ContainerProps {
  as?: ElementType;
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
}

// 'narrow' targets a comfortable reading measure (~68ch, the `max-w-prose`
// token) for body copy; 'default'/'wide' are for grids and multi-column
// layouts where a longer measure is fine; 'full' allows edge-to-edge desktop layouts.
const sizeStyles: Record<ContainerSize, string> = {
  narrow: 'max-w-prose',
  default: 'max-w-6xl xl:max-w-7xl',
  wide: 'max-w-7xl xl:max-w-[1536px] 2xl:max-w-[1720px]',
  full: 'max-w-none',
};

export function Container({ as: Tag = 'div', size = 'default', className, children }: ContainerProps) {
  return <Tag className={cn('mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20', sizeStyles[size], className)}>{children}</Tag>;
}

