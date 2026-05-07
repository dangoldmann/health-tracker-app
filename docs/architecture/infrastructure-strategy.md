# HealthGuard: Infrastructure Strategy & Migration Blueprint (v2)

This document outlines the strategic decision to use **Supabase** for infrastructure while maintaining a **Provider-Agnostic Security Model**. By bypassing Database Row Level Security (RLS) in favor of Application-Level Authorization, we ensure maximum portability and ease of transition to providers like AWS RDS.

---

## 1. Decision Reasoning: Why Supabase?

The choice of Supabase is focused on **Infrastructure Speed** without sacrificing **Architectural Independence**.

### A. Accelerated Infrastructure Setup

Supabase provides an instant, managed PostgreSQL instance, a secure Auth solution, and S3-compatible storage. This removes the "DevOps overhead" of configuring VPCs, subnets, and manual backup policies during the MVP phase.

### B. Pure PostgreSQL Portability

By treating Supabase as a standard PostgreSQL host—and intentionally avoiding proprietary features like RLS or Database Functions—the data layer remains 100% compatible with any other Postgres provider (AWS RDS, Neon, or self-hosted).

---

## 2. Security Architecture: Application-Level Logic

To ensure the app can be moved easily, all security and "who-can-see-what" logic is handled in the **NestJS Backend**.

### A. The "Smart Guard" Pattern

Instead of DB-level policies, we implement **NestJS Guards and Interceptors**. Before any data is returned, the backend verifies the relationship between the authenticated User and the requested Profile.

- **Logic Example:** When a user requests `GET /profiles/:id/checkups`, the NestJS `ProfileGuard` queries the database to ensure the `auth_user_id` is either the owner of that profile or a member of the same `FamilyGroup` with appropriate permissions.
- **Portability Benefit:** If you migrate to AWS RDS, this code remains exactly the same. You only change the database connection string.

### B. Decoupled Authentication

We use Supabase Auth for identity but map it immediately to an internal `users` table.

- **The Mapping:** All foreign keys in the database point to your internal `User.id` (UUID), not the Supabase Auth ID. This creates a "buffer" that makes switching to another Auth provider (like Clerk or a custom JWT solution) a simple ID-mapping exercise rather than a database-wide refactor.

---

## 3. The "Escape Hatch": Migration Roadmap

Because we are avoiding RLS, the transition to other providers is significantly streamlined.

### Scenario A: Migrating the Database (Supabase → AWS RDS)

- **Difficulty:** Very Low.
- **Process:** 1. Export the database using `pg_dump`. 2. Import into AWS RDS. 3. Update the `DATABASE_URL` in NestJS. 4. **Result:** Since all security logic already lives in your NestJS Guards, the application remains fully secure without any code changes or "policy rewriting."

### Scenario B: Migrating Authentication (Supabase Auth → Clerk/Custom)

- **Difficulty:** Medium.
- **Process:** 1. Export the user list. 2. Import into the new provider. 3. Update the `IdentityService` in NestJS to validate the new provider's tokens. 4. Update the `external_auth_id` mapping in your internal `users` table.

### Scenario C: Migrating Storage (Supabase Storage → AWS S3)

- **Difficulty:** Low.
- **Process:** 1. Sync files between buckets using the S3 protocol. 2. Since Supabase Storage is S3-compatible, the transition only requires updating the AWS SDK credentials in your NestJS `StorageService`.

---

## 4. Implementation Guidelines for Portability

1.  **No Logic in SQL:** Do not use Triggers, Procedures, or RLS Policies.
2.  **Centralized Authorization:** Use a dedicated `AccessControlService` in NestJS to handle all family and profile permission checks.
3.  **Agnostic ORM:** Use **Prisma** or **Drizzle** to interact with the database, ensuring that the code remains independent of the hosting environment.

---

_Infrastructure Strategy v2.0 | Focused on Application-Level Portability_
