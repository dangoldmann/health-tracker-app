# AGENTS

This repository is a Turborepo monorepo for the HealthGuard health tracker. The product goal is to support health tracking, onboarding, reminders, protocols, and related care flows across clients backed by a shared API and shared workspace packages.

## Structure

- `apps/api`: NestJS API, Prisma schema/migrations, and backend domain logic
- `apps/mobile`: React Native + Expo mobile app
- `apps/web`: web app
- `apps/docs`: documentation site
- `packages/ui`: shared UI components
- `packages/validation`: shared validation schemas
- `packages/eslint-config` and `packages/typescript-config`: shared workspace tooling
- `docs`: internal product, design, and architecture source of truth

## Docs

Start with `README.md` and `docs/README.md`, then use these core references:

- `docs/design/design-system.md`
- `docs/architecture/tech-stack.md`
- `docs/architecture/infrastructure-strategy.md`
- `docs/architecture/database-schema.md`
- `docs/product/dynamic-onboarding-structure.md`
- `docs/product/product-requirements.md`
