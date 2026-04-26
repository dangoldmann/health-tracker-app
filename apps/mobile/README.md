# Mobile App Foundation

This Expo app is the mobile workspace for HealthGuard.

## What is included

- Expo Router navigation shell for the main product areas.
- NativeWind and design tokens aligned with `docs/design/design-system.md`.
- TanStack Query with AsyncStorage persistence for offline-friendly server state.
- Zustand stores for onboarding queue and active household profile.
- Shared validation package integration via `@repo/validation`.

## Primary routes

- `/` foundation overview
- `/auth` authentication and welcome shell
- `/onboarding` dynamic onboarding blueprint
- `/dashboard` household dashboard shell
- `/design-system` visual language preview

## Commands

```bash
npm --workspace apps/mobile run dev
npm --workspace apps/mobile run ios
npm --workspace apps/mobile run android
npm --workspace apps/mobile run lint
npm --workspace apps/mobile run check-types
```
