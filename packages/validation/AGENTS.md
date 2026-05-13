# Validation Package Guide

Use the same folder pattern for each new validation domain under `src/`.

## Folder Structure

For a simple validation, create:

```text
src/<domain>/
  schemas.ts
  types.ts
  index.ts
```

Add extra files only when the domain has enough logic to justify them, for example:

```text
src/<domain>/
  constants.ts
  schemas.ts
  types.ts
  queue.ts
  recommendations.ts
  index.ts
```

## File Responsibilities

- `schemas.ts`: Zod schemas and validation-specific refinements.
- `types.ts`: exported TypeScript types, including `z.infer<typeof ...>` types derived from schemas.
- `constants.ts`: shared literals, limits, and catalogs used by schemas or helpers.
- helper files such as `queue.ts` or `recommendations.ts`: non-schema domain logic.
- `index.ts`: public barrel for that domain only.

## Import Direction

Keep dependencies one-way:

- `constants.ts` should not import from other domain files.
- `schemas.ts` may import from `constants.ts`.
- `types.ts` may import from `schemas.ts`.
- helper files may import from `constants.ts` and `types.ts`.
- internal files should not import from their own `index.ts`.

## Exports

- Re-export each domain from `src/index.ts`.
- Keep public exports stable when refactoring internals.
- Prefer adding a new domain folder over growing a single top-level file.
