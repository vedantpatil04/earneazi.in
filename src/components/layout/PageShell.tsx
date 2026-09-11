import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { site } from '@/config/site';

interface PageShellProps {
  /** Sets document.title for this route. Must be unique per route (Phase 0 §29). */
  title: string;
  /**
   * Per-route meta description. Optional — omitted routes keep the
   * document-level description from index.html.
   */
  description?: string;
  children: ReactNode;
}

/**
 * Per-route document metadata.
 *
 * Kept as a small effect rather than a head-management dependency: the site
 * needs a title and a description per route and nothing more, and §30 holds
 * a JS budget that a head manager would spend for no gain.
 *
 * The title is what `RouteAnnouncer` reads out on client-side navigation,
 * so a route that forgets to set one is announced as the previous page.
 */
export function PageShell({ title, description, children }: PageShellProps) {
  useEffect(() => {
    document.title = `${title} — ${site.name}`;
  }, [title]);

  useEffect(() => {
    if (!description) return;

    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) return;

    const previous = meta.content;
    meta.content = description;
    return () => {
      meta.content = previous;
    };
  }, [description]);

  return <>{children}</>;
}
