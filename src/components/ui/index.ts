/* Phase 1 primitives. */
export { Button } from './Button';
export type { ButtonProps } from './Button';
export { Link } from './Link';
export type { LinkProps } from './Link';
export { IconTile } from './IconTile';
export { Field } from './Field';
export type { FieldRenderProps } from './Field';
export { SectionHeader } from './SectionHeader';
export { ThemeToggle, ThemeControl } from './ThemeToggle';
export { Icon } from './Icon';

/* Form controls. Prefer composing these through `Field`. */
export { Label } from './Label';
export { Input } from './Input';
export type { InputProps } from './Input';
export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';
export { Select } from './Select';
export type { SelectProps } from './Select';
export { Slider } from './Slider';
export type { SliderProps } from './Slider';

/* Surfaces and small parts. */
export { Card } from './Card';
export { Badge } from './Badge';
export { Divider } from './Divider';
/* The one disclosure system (§26). `Accordion` — which unmounted closed
   panels — was retired in Phase 6 when the FAQ moved onto this row. */
export { DisclosureRow } from './DisclosureRow';
export { EditorialImage } from './EditorialImage';

/* LEGACY — adapter over SectionHeader, kept for pre-Phase-1 sections. */
export { SectionHeading } from './SectionHeading';
