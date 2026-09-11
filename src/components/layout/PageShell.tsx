import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface PageShellProps {
  /** Sets document.title for this route — avoids adding a head-management dependency for something this small. */
  title: string;
  children: ReactNode;
}

const SITE_NAME = 'Earneazi';

/** Per-route wrapper: sets the document title, nothing else — vertical rhythm and width come from Section/Container inside each page. */
export function PageShell({ title, children }: PageShellProps) {
  useEffect(() => {
    document.title = `${title} — ${SITE_NAME}`;
  }, [title]);

  return <>{children}</>;
}
