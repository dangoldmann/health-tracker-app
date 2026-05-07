# HealthGuard: Design System & Visual Guidelines

This document outlines the visual language and component architecture for HealthGuard. The goal is a **"Soft Medical"** aesthetic: trustworthy, clean, and calm.

---

## 1. Visual Identity & "Voice"

- **Tone:** Trustworthy, Calm, Proactive, and Accessible.
- **Concept:** "The Calm Professional." Moving away from sterile hospital whites toward a "Health Assistant" feel.

---

## 2. Color Palette (The 60-30-10 Rule)

We use a layered approach to white to create depth and hierarchy.

| Role                     | Color Name  | Hex Code  | Tailwind Class (NativeWind) |
| :----------------------- | :---------- | :-------- | :-------------------------- |
| **Background (60%)**     | Slate White | `#F8FAFC` | `bg-slate-50`               |
| **Surface (30%)**        | Pure White  | `#FFFFFF` | `bg-white`                  |
| **Primary Action (10%)** | Health Teal | `#0D9488` | `bg-teal-600`               |
| **Secondary Action**     | Trust Blue  | `#3B82F6` | `bg-blue-500`               |
| **Success / Clean**      | Emerald     | `#10B981` | `bg-emerald-500`            |
| **Overdue / Alert**      | Rose        | `#F43F5E` | `bg-rose-500`               |
| **Text (Primary)**       | Slate Dark  | `#0F172A` | `text-slate-900`            |
| **Text (Secondary)**     | Slate Muted | `#64748B` | `text-slate-500`            |

---

## 3. Typography

Consistency in type is the fastest way to look "Semi-Senior."

- **Primary Font:** **Inter** (via Google Fonts or Expo Google Fonts).
- **Fallback:** System Default (San Francisco on iOS, Roboto on Android).

### Type Hierarchy

- **Heading 1:** 24pt, SemiBold, `#0F172A`. (Used for Screen Titles).
- **Heading 2:** 18pt, SemiBold, `#1E293B`. (Used for Card Titles).
- **Body:** 16pt, Regular, `#334155`. (Standard text).
- **Caption:** 12pt, Medium, `#64748B`. (Labels, dates, or secondary info).

---

## 4. Component Architecture

### 4.1 The "Health Card" (The Core UI Element)

Everything about a checkup or a family member should live in a card.

- **Background:** `#FFFFFF` (Pure White).
- **Border:** `1px solid #E2E8F0` (Slate 200).
- **Radius:** `rounded-2xl` (16px).
- **Shadow:** `shadow-sm` (Subtle elevation).

### 4.2 Form Inputs

- **Style:** Outlined, not filled.
- **Focus State:** Border changes to `Teal-600` with a subtle glow.
- **Error State:** Border changes to `Rose-500` with descriptive red text below.

### 4.3 Action Buttons

- **Primary:** Filled Teal with White text. Used for "Add Checkup" or "Complete Onboarding."
- **Secondary:** Ghost (No background) with Blue text. Used for "Skip" or "Remind me later."

---

## 5. Iconography & Imagery

- **Library:** **Lucide React Native** or **Phosphor Icons**.
- **Stroke Width:** 2px (Maintains a clean, modern look).
- **Illustration Strategy:** Use **unDraw** (undraw.co) for empty states.
  - _Example:_ If no checkups are scheduled, show a "Healthy Person" illustration using the Primary Teal accent color.

---

## 6. UX Patterns: Onboarding Flow

To keep "HealthGuard" premium, we avoid long, intimidating forms.

### The "One-Step-At-A-Time" Pattern

1.  **Full-Screen Cards:** Each question (Age, Sex, Risk Factors) gets its own screen.
2.  **Smooth Progress:** A thin progress bar at the top (`bg-teal-600`) keeps the user motivated.
3.  **Haptic Feedback:** Use `expo-haptics` to give a small "thump" when a user selects a risk factor or completes a profile.

### The "Status Ring" (The Dashboard North Star)

- Instead of just text, use a circular progress ring around the profile picture.
  - **Green Ring:** All checkups completed.
  - **Yellow Ring:** Checkup due soon (within 30 days).
  - **Red Ring:** Overdue checkup.

---

## 7. Implementation Cheat Sheet (Tailwind Configuration)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        primary: "#0D9488", // Health Teal
        secondary: "#3B82F6", // Trust Blue
        alert: "#F43F5E",
        surface: "#FFFFFF",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
};
```
