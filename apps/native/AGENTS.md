# Native App

## Structure

- `app/`: Expo Router screens and route layouts.
- `components/`: reusable UI building blocks.
- `lib/api/`: API layer split by feature.
  - `client.ts`: shared HTTP request helper and `ApiError`.
  - `auth.ts`: auth-related requests.
  - `onboarding.ts`: onboarding-related requests.
  - `index.ts`: public re-exports for the API module.
- `lib/onboarding/`: onboarding-specific client logic and draft helpers.
- `lib/*.ts`: other helpers.

## API Contract Rule

- Keep request/response contracts shared through `@repo/validation`.
- Response types for API requests should be imported from `@repo/validation`, not redefined locally in `apps/native`.
- Add native-local API types only when the shape is not part of the shared backend contract.
