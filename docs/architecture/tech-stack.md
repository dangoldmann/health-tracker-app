# Health Care App: Technical Stack Specification

This document outlines the Full-Stack TypeScript architecture for the health tracking mobile application. The stack is optimized for high type-safety, rapid iteration, and complex relational data handling, aligning with Ssr. engineering standards.

---

## 1. Core Architecture

- **Monorepo Management: Turborepo**
  - Orchestrates the workspace for high-performance builds.
  - Enables code sharing (types, constants, validation) between the Mobile App and the NestJS API.
- **Language: TypeScript**
  - Strict typing enforced across the entire stack to eliminate runtime errors in health data logic.

## 2. Frontend (Mobile)

- **Framework: React Native + Expo**
  - Utilizes the managed workflow for EAS (Expo Application Services) to handle native push notifications and OTA (Over-The-Air) updates.
- **Data Fetching: TanStack Query (React Query)**
  - Manages server-state, caching, and offline persistence.
  - Crucial for viewing medical records in clinics with poor connectivity.
- **Form Management: React Hook Form + Zod**
  - Handles complex multi-step onboarding and health profile validation with deep type safety.
- **Styling: NativeWind (Tailwind CSS)**
  - Utility-first styling for a consistent UI across iOS and Android.

## 3. Backend (API)

- **Framework: NestJS**
  - Modular, decorator-based framework. Ideal for building a scalable "Health Logic" engine with clear separation of services and controllers.
- **Authentication: Clerk / Supabase Auth**
  - Secure identity management supporting Social Login and cross-device synchronization.
- **Validation: Zod (Shared Package)**
  - Shared validation schemas used in both NestJS DTOs and React Native forms to ensure 100% data integrity.
- **Task Scheduling: NestJS Schedule**
  - Internal Cron engine to trigger daily checks for overdue appointments and send push notifications.

## 4. Data & Infrastructure

- **Database: PostgreSQL**
  - Relational database chosen for complex mapping (Users ↔ Profiles ↔ Reminders).
- **ORM: Prisma**
  - Provides an auto-generated, type-safe client that mirrors the database schema in the shared monorepo package.
- **Cloud (AWS):**
  - **S3:** For storing encrypted medical orders, lab results, and "Cartilla" PDFs.
  - **Textract (Optional):** For OCR extraction of medical specialty and dates from physical documents.

## 5. Key Libraries & Utilities

- **Date-fns:** Handles precise date arithmetic for calculating next checkup dates based on custom frequencies.
- **Zustand:** Lightweight global state for managing the "Active Profile" (switching between family members) in the mobile UI.
- **Zod:** The single source of truth for all data models and schema validation.

