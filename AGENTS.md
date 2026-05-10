# Health Tracker Repo

This is a Turborepo monorepo for a health tracker app.

## Structure

- `apps/api`: NestJS backend
- `apps/native`: React Native + Expo mobile app
- `apps/web`: web app
- `packages/*`: shared packages
- `docs/`: project documentation

## Database Conventions

- Always add database columns using `snake_case`.

## Main Goal

The app helps users keep track of recurring health check-ins with their doctors, including annual or period-based check-ins, and manage tracking for their own profiles as well as their kids and/or parents.

## Documentation

- [`docs/architecture/infrastructure-strategy.md`](./docs/architecture/infrastructure-strategy.md)
- [`docs/architecture/tech-stack.md`](./docs/architecture/tech-stack.md)
- [`docs/architecture/database-schema.md`](./docs/architecture/database-schema.md)
- [`docs/design/design-system.md`](./docs/design/design-system.md)
- [`docs/product/product-requirements.md`](./docs/product/product-requirements.md)
- [`docs/product/dynamic-onboarding-structure.md`](./docs/product/dynamic-onboarding-structure.md)
