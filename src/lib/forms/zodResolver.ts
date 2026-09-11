import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form';
import type { ZodTypeAny, z } from 'zod';

/**
 * Bridges a Zod schema to React Hook Form.
 *
 * This exists instead of `@hookform/resolvers` because that package would
 * be a whole dependency for the twenty lines below, and the project already
 * has both halves of the bridge. Behaviour matches the official resolver
 * for the cases we use: first issue per field wins, and the parsed (not
 * raw) values are handed back on success, so Zod's coercion and trimming
 * actually take effect.
 */
export function zodResolver<TSchema extends ZodTypeAny>(schema: TSchema): Resolver<z.infer<TSchema>> {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data as FieldValues, errors: {} };
    }

    const errors: Record<string, { type: string; message: string }> = {};

    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      // First issue per field only — showing a stack of messages under one
      // input is noise, and the first is the one worth fixing.
      if (path && !errors[path]) {
        errors[path] = { type: issue.code, message: issue.message };
      }
    });

    return { values: {}, errors: errors as FieldErrors<z.infer<TSchema>> };
  };
}
