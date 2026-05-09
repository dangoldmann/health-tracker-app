# API

This package contains the NestJS API for the project.
It provides the backend application, database access, and authentication-related API behavior used by the rest of the system.

## Stack

- NestJS
- Prisma ORM 7
- PostgreSQL
- Supabase Auth

## Basic commands

Run these from the repo root unless noted otherwise.

```bash
npm run build --workspace=api
npm run lint --workspace=api
npm run test:unit --workspace=api
npm run test:integration --workspace=api
npm run test:e2e --workspace=api
```

## Environment

The API uses two database URLs for Prisma-related work:

- `DATABASE_URL`: runtime connection used by the Nest app
- `DIRECT_URL`: direct connection used by Prisma CLI commands such as migrations

Prisma CLI reads its database connection from [prisma.config.ts](./prisma.config.ts), not from `schema.prisma`.

## Prisma quick guide

### Files that matter

- Schema: [prisma/schema.prisma](./prisma/schema.prisma)
- Prisma config: [prisma.config.ts](./prisma.config.ts)
- Migrations: [prisma/migrations](./prisma/migrations)

### Recommended workflow for schema changes

1. Edit `prisma/schema.prisma`
2. Create a migration
3. Review the generated SQL
4. Regenerate the Prisma client
5. Run API tests

In this repo, that usually means:

```bash
npm run prisma:migrate:dev --workspace=api -- --name your_change_name
npm run prisma:generate --workspace=api
npm run test:unit --workspace=api
npm run test:integration --workspace=api
npm run test:e2e --workspace=api
```

## Prisma commands and when to use them

### `npm run prisma:generate --workspace=api`

Use this after changing `prisma/schema.prisma`.

What it does:

- Regenerates the Prisma Client used by the API

Use it when:

- You changed models, fields, relations, enums, or mappings in the schema
- TypeScript imports from the generated Prisma client are out of date

### `npm run prisma:migrate:dev --workspace=api -- --name your_change_name`

Use this during development when you want to turn schema changes into a migration file and apply them to your dev database.

What it does:

- Compares your current schema to migration history
- Creates a new migration in `prisma/migrations`
- Applies pending migrations to the database

Use it when:

- You changed the Prisma schema and want a real migration file
- You are developing locally

Do not use it for:

- Production deployment

### `npm run prisma:migrate:deploy --workspace=api`

Use this to apply existing migration files to a database without creating new ones.

What it does:

- Applies pending migrations only

Use it when:

- Deploying to staging or production
- Applying already-committed migrations in a controlled environment

Do not use it for:

- Creating new migrations

### `npx prisma migrate status --config apps/api/prisma.config.ts`

Use this when you want to see whether your migration files and database state are in sync.

What it does:

- Checks local migration files
- Checks the `_prisma_migrations` table in the database
- Reports drift, unapplied migrations, or missing migration history

Use it when:

- A migration command fails
- You are unsure whether the database is up to date

### `npx prisma migrate diff --from-... --to-... --script`

Use this as a debugging and inspection tool.

What it does:

- Compares two schema sources and prints SQL or a diff summary

Use it when:

- `migrate dev` is failing and you want to inspect the SQL manually
- You want to compare the current schema with the database
- You want to understand what Prisma thinks changed before applying anything

Example:

```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema apps/api/prisma/schema.prisma \
  --script
```

### `npx prisma migrate reset --config apps/api/prisma.config.ts`

Use this only in development when you intentionally want to wipe and rebuild the database from migrations.

What it does:

- Resets the database
- Reapplies all migrations from scratch

Use it when:

- Your local dev database is disposable
- Migration history is broken and you want a clean reset

Do not use it for:

- Staging
- Production
- Any database with data you care about

## Practical advice

- Prefer `migrate dev` over `db push` for this project.
- Prefer `migrate deploy` outside development.
- Run `prisma:generate` after schema changes.
- If migrations fail, start with `migrate status`.
- If `migrate status` or `migrate dev` fail against Supabase, verify that `DIRECT_URL` points to the correct direct connection expected by Prisma CLI.

## Official references

- [Prisma Migrate overview](https://docs.prisma.io/docs/cli/migrate)
- [Prisma migrate dev](https://docs.prisma.io/docs/cli/migrate/dev)
- [Prisma migrate deploy](https://docs.prisma.io/docs/cli/migrate/deploy)
- [Prisma migrate status](https://docs.prisma.io/docs/cli/migrate/status)
- [Prisma migrate diff](https://docs.prisma.io/docs/cli/migrate/diff)
- [Prisma generate](https://docs.prisma.io/docs/cli/generate)
