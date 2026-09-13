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
  /**
   * The container the header sits in. It must match the sections beneath it,
   * so the title and the content start on the same edge (§13 rule 2): pages
   * whose sections use the 1200px content column pass `content`.
   */
  size?: 'shell' | 'content';
  className?: string;
}

/**
 * The opening block on every inner page: the `h1` and its supporting line.
 *
 * Shared rather than rewritten per page — it is the most visible piece of
 * vertical rhythm on the site, and six routes each choosing their own top
 * padding and heading size is how a set of pages starts looking like
 * separate projects.
 *
 * The decorative rule that sat above the heading is gone: §17 removes the
 * eyebrow as a global device and §34 lists it among the templated tells
 * being retired.
 */
export function PageHeader({ title, lead, actions, children, className, size = 'shell' }: PageHeaderProps) {
  return (
    <Section
      spacing={children ? 'lg' : 'md'}
      /* With no children the following Section supplies its own top
         padding, so the header's bottom padding would stack on top of it.
         Tailwind emits `pb-*` after `py-*`, so this reliably wins. */
      className={cn('pt-12 md:pt-16', !children && 'pb-2 md:pb-4', className)}
    >
      <Container size={size}>
        <Reveal variants={riseVariants} immediate>
          <h1 className="max-w-[20ch] text-display-lg text-ink-display">{title}</h1>
          {lead && <p className="mt-5 max-w-measure text-body-lg text-ink-secondary">{lead}</p>}
          {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">{actions}</div>}
        </Reveal>

        {children && <div className="mt-14 md:mt-16">{children}</div>}
      </Container>
    </Section>
  );
}
