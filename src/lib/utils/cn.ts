type ClassValue = string | number | null | undefined | false | Record<string, boolean | null | undefined>;

/**
 * Small className combiner — merges strings/conditionals into one string,
 * skipping falsy values. Kept local instead of adding the `clsx` dependency;
 * this is the entire feature surface we need for variant classNames.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
      continue;
    }

    for (const [key, value] of Object.entries(input)) {
      if (value) classes.push(key);
    }
  }

  return classes.join(' ');
}
