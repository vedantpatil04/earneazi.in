import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

export interface ChartColors {
  invested: string;
  growth: string;
  axis: string;
  grid: string;
}

function readToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw ? `rgb(${raw})` : fallback;
}

/**
 * Resolves the chart's colours from the same CSS variables everything else
 * on the page uses, and re-reads them whenever the theme changes.
 *
 * Recharts writes colours into SVG `fill`/`stroke` attributes, where a
 * `var(--token)` reference is not reliably supported (Safari in
 * particular). Reading the computed value once per theme change keeps the
 * chart on the design system without depending on that support.
 */
export function useChartColors(): ChartColors {
  const { mode } = useTheme();

  const read = (): ChartColors => ({
    invested: readToken('--color-chart-1', 'rgb(31 111 82)'),
    growth: readToken('--color-chart-2', 'rgb(140 101 38)'),
    axis: readToken('--color-text-muted', 'rgb(102 113 103)'),
    grid: readToken('--color-divider', 'rgb(224 224 212)'),
  });

  const [colors, setColors] = useState<ChartColors>(read);

  useEffect(() => {
    setColors(read());
    // `mode` is the trigger: ThemeProvider has already written data-theme to
    // <html> by the time this runs, so the computed values are the new ones.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return colors;
}
