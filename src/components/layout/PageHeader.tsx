import type { ReactNode } from 'react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/motion/Reveal';
import { riseVariants } from '@/lib/motion/variants';
import { cn } from '@/lib/utils/cn';

interface PageHeaderProps {
  title: string;
  lead?: string;
  /** Buttons or links sitting under the lead. */
  actions?: ReactNode;
  /** Extra content below the header inside the same padding block — used where a page's first interactive element belongs with its heading. */
  children?: ReactNode;
  className?: string;
}

/**
 * The opening block on every inner page: brass rule, h1, supporting line.
 *
 * Shared rather than rewritten per page — it is the single most visible
 * piece of vertical rhythm on the site, and six pages each setting their own
 * top padding and heading size is how a set of routes starts looking like
 * separate projects.
 */
export function PageHeader({ title, lead, actions, children, className }: PageHeaderProps) {
  return (
    <Section
      spacing={children ? 'lg' : 'md'}
      /* With no children the following Section supplies its own top padding,
         so the header's bottom padding would stack on top of it — about
         160px of nothing between the lead and the first real content.
         Tailwind emits `pb-*` after `py-*`, so this reliably wins. */
      className={cn('pt-12 md:pt-16', !children && 'pb-2 md:pb-4', className)}
    >
      <Container size="wide">
        <Reveal variants={riseVariants} immediate>
          <span aria-hidden="true" className="block h-px w-16 rounded-full rule-fade" />
          <h1 className="mt-6 max-w-[20ch] text-h1 font-display-wonk">{title}</h1>
          {lead && <p className="mt-5 max-w-prose text-lead text-ink-secondary">{lead}</p>}
          {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">{actions}</div>}
        </Reveal>

        {children && <div className="mt-14 md:mt-16">{children}</div>}
      </Container>
    </Section>
  );
}
