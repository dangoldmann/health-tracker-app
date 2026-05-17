# Native

A [react-native](https://reactnative.dev/) app built using [expo](https://docs.expo.dev/)

## Auth flow notes

### Supabase email confirmation is disabled

The onboarding flow in `app/(public)/onboarding/auth.tsx` calls `supabase.auth.signUp()` and expects an active session back so it can immediately finalize the onboarding payload against the API. This only works while the Supabase project has **"Confirm email" turned off** in Authentication settings — otherwise `signUp()` returns `session: null`, the user can't complete onboarding inline, and the email gets locked on retry.

This is a deliberate choice for the current iteration to keep the signup → onboarding → home flow inline and single-screen. **Subject to change.** If we later enable email confirmation (for production hardening, anti-abuse, etc.), the onboarding flow needs to be reworked to:

- Persist the unfinalized draft after `signUp`
- Route the user to a "check your inbox" state
- Finalize on the confirmation callback (or on next sign-in) instead of inline
