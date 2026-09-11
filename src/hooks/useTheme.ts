// Re-exported here so consumers can `import { useTheme } from '@/hooks/useTheme'`
// per the folder responsibilities in Phase 0 Blueprint, Section O — the
// context/provider implementation itself lives in lib/theme, next to the
// no-FOUC bootstrap logic it's paired with.
export { useTheme } from '@/lib/theme/ThemeProvider';
