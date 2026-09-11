import type { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  /** If the icon conveys meaning on its own (no adjacent text), pass a label — it becomes the accessible name. Otherwise the icon is hidden from assistive tech. */
  label?: string;
}

/**
 * Thin wrapper enforcing one deliberate choice per icon: either it's
 * decorative (paired with visible text, hidden from AT) or it's
 * meaningful on its own (gets a real accessible name) — never silently
 * neither, which is how icon-only buttons end up unlabeled (Section K).
 */
export function Icon({ icon: LucideIconComponent, size = 20, className, label }: IconProps) {
  if (label) {
    return <LucideIconComponent size={size} className={className} role="img" aria-label={label} />;
  }
  return <LucideIconComponent size={size} className={className} aria-hidden="true" />;
}
