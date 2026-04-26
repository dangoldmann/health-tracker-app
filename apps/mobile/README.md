# Mobile App

This Expo app now uses the real HealthGuard entry flow for Supabase email/password auth.

## What is included

- Supabase client setup with persisted mobile sessions and `healthguard://` deep-link handling.
- Auth-aware API requests that forward the Supabase bearer token to the NestJS backend.
- Bootstrap routing that sends signed-out users to landing, authenticated users to onboarding, and completed users to dashboard.
- Placeholder onboarding and dashboard screens backed by the real backend onboarding flag.

## Primary routes

- `/` landing with `Sign in` and `Sign up`
- `/sign-in` email/password sign-in
- `/sign-up` email/password sign-up
- `/verify-email` email confirmation interstitial
- `/auth/callback` deep-link session handoff
- `/onboarding` placeholder onboarding flow
- `/dashboard` placeholder dashboard

## Commands

```bash
npm --workspace apps/mobile run dev
npm --workspace apps/mobile run ios
npm --workspace apps/mobile run android
npm --workspace apps/mobile run lint
npm --workspace apps/mobile run check-types
```
