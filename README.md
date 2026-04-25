# Health Tracker App

This repository is a Turborepo for the HealthGuard product and supporting shared packages.

## Repository Structure

- `apps/web`: primary product application
- `apps/docs`: optional published documentation site
- `packages/ui`: shared UI components
- `packages/eslint-config`: shared lint rules
- `packages/typescript-config`: shared TypeScript configuration
- `docs`: internal project documentation source of truth

## Documentation

Project documentation lives under [`docs/`](./docs/README.md).

- [Architecture docs](./docs/architecture/)
- [Design docs](./docs/design/)
- [Product docs](./docs/product/)
- [Documentation index](./docs/README.md)

Current core documents:

- [Infrastructure Strategy](./docs/architecture/infrastructure-strategy.md)
- [Tech Stack](./docs/architecture/tech-stack.md)
- [Database Schema](./docs/architecture/database-schema.md)
- [Design System](./docs/design/design-system.md)
- [Product Requirements](./docs/product/product-requirements.md)
- [Dynamic Onboarding Structure](./docs/product/dynamic-onboarding-structure.md)

## Turborepo Workspace

Install dependencies:

```sh
npm install
```

Run the monorepo in development mode:

```sh
npm run dev
```

Build all apps and packages:

```sh
npm run build
```

You can target a specific app or package with Turborepo filters when needed:

```sh
npx turbo build --filter=web
npx turbo dev --filter=docs
```

## Turborepo Reference

This workspace started from the Turborepo starter, and that reference material is still useful as the monorepo grows.

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app that can become the published documentation site
- `web`: the main application
- `@repo/ui`: shared React component library
- `@repo/eslint-config`: shared ESLint configurations
- `@repo/typescript-config`: shared TypeScript configurations

Each package and app is TypeScript-based.

### Remote Caching

Turborepo supports [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) so build artifacts can be shared across machines and CI.

To enable it later with Vercel:

```sh
npx turbo login
npx turbo link
```

### Useful Links

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
