# HealthGuard: Dynamic Onboarding & API Integration Flow

This document details the multi-branch onboarding process for HealthGuard. The flow is designed to be low-friction while gathering high-quality data to seed the recommendation engine.

---

## 1. Onboarding Architecture Overview

The flow uses a **Queue-Based Logic**:
1. **Selection:** User selects who they are tracking (Self, Kids, Parents).
2. **Generation:** The app creates a "Setup Queue" (e.g., [Self, Child 1, Parent 1]).
3. **Execution:** The app iterates through the queue until all profiles are configured.

---

## 2. Step-by-Step Screen Flow

### Screen 1: Authentication & Welcome
* **Action:** Social Login (Google/Apple) or Email via Clerk/Supabase.
* **API Endpoint:** `POST /auth/register`
* **Payload:** `{ email, provider, timezone }`

### Screen 2: The Intent Selector (Multi-Select)
* **Question:** "Who are we looking after today?"
* **Options:** * [ ] Myself
    * [ ] My Children
    * [ ] My Parents / Seniors
* **Logic:** This selection populates the `onboarding_queue` state in Zustand.

---

## 3. Dynamic Profile Branching

### Branch A: "Myself" (Personal Profile)
* **Questions:**
    1.  **Birth Date:** (Date Picker) -> Used to calculate age-based protocols.
    2.  **Biological Sex:** (Male / Female) -> For sex-specific screenings (Pap, Prostate).
    3.  **Risk Factors:** (Chips/Tags) -> Smoke? High Blood Pressure? Family history of heart disease?
    4.  **Insurance:** (Select) -> "Which 'Obra Social' or Prepaga do you have?" (e.g., OSDE, Galeno).
* **API Endpoint:** `POST /profiles`
* **Payload:** ```json
    {
      "name": "Me",
      "is_self": true,
      "birth_date": "1990-05-15",
      "biological_sex": "MALE",
      "metadata": { "smoker": false, "hypertension": true },
      "insurance_provider_id": "osde-210"
    }
    ```

### Branch B: "My Children" (Pediatric Profile)
* **Questions:**
    1.  **Name:** (Text)
    2.  **Birth Date:** (Date Picker) -> Triggers pediatric vaccine and developmental checkup protocols.
    3.  **Specific Concerns:** (Tags) -> Allergies? Asthma?
* **Logic:** If the user has multiple children, a "Add Another Child" button appears before moving to the next branch.
* **API Endpoint:** `POST /profiles` (Repeated for each child).

### Branch C: "My Parents / Seniors" (Senior Profile)
* **Questions:**
    1.  **Name:** (Text)
    2.  **Age/Birth Date:** (Date Picker)
    3.  **Mobility/Chronic:** (Tags) -> Diabetes? Mobility issues? Cognitive health tracking?
* **API Endpoint:** `POST /profiles`

---

## 4. The "North Star" Configuration (Review)

Once the profiles are created, the app fetches recommendations and presents them for review.

* **Action:** The app calls the backend to get suggested checkups for the newly created profiles.
* **API Endpoint:** `GET /protocols/generate-suggestions?profileIds=[uuid1, uuid2]`
* **UI Component:** A list of cards per profile.
    * *Card Example:* "Cardiology for Dad" -> "Recommended: Every 6 months."
* **User Interaction:**
    * User can **Accept All**.
    * User can tap **"Adjust"** to change frequency (e.g., changing 6 months to 12 months).
* **API Endpoint:** `POST /user-checkups/bulk`
* **Payload:**
    ```json
    {
      "checkups": [
        { "profile_id": "uuid-dad", "type": "cardiology", "frequency_days": 180 },
        { "profile_id": "uuid-me", "type": "dentistry", "frequency_days": 365 }
      ]
    }
    ```

---

## 5. Finalizing: Notification Opt-in
* **Question:** "Can we remind you when it's time?"
* **Action:** Trigger Native iOS/Android Permission Dialog.
* **API Endpoint:** `PATCH /users/device-token`
* **Payload:** `{ "push_token": "expo-push-token-xyz", "platform": "ios" }`

---

## 6. Technical Implementation Notes (Ssr. Focus)

1.  **State Management:** Use **Zustand** to hold the `onboarding_queue`. This prevents data loss if the user accidentally closes the app mid-onboarding.
2.  **Validation:** Use a shared **Zod** schema for the Profile creation. The same schema should validate the React Native form and the NestJS DTO.
3.  **Progress UX:** Since this can be a long flow (if tracking multiple people), include a **Progress Bar** at the top.
4.  **Error Handling:** If the `POST /profiles` fails for one person, allow the user to "Retry" without restarting the whole onboarding.

---
*Onboarding Design v1.0 | Focused on UX Agency and Data Integrity*
