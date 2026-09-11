export interface NavItem {
  label: string;
  path: string;
  /** Longer label used in the mobile panel, where there's room for a line of context. */
  description?: string;
}
