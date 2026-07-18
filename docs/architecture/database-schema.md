# HealthGuard: Database Schema Design

This document outlines the relational database structure for the HealthGuard application. The schema is designed for **PostgreSQL** using **Prisma** or **Drizzle ORM** syntax in mind, focusing on high type-safety and complex family relationships.

---

## 1. Core Architectural Strategy

The schema follows a **"Profile-Centric"** approach. While a `User` handles authentication, all medical data, age-based logic, and checkups are attached to a `Profile`. This allows a single user account to manage multiple people (Self, Kids, Elderly Parents) seamlessly.

---

## 2. Entity Relationship Diagram (ERD) Overview

### 2.1 User & Identity

- **Users:** System-level accounts (Email/Auth).
- **Profiles:** The actual entities being tracked.
  - _Relationship:_ One User → Many Profiles (e.g., a mother managing herself and four children).

### 2.2 Family Coordination

- **FamilyGroups:** A container for shared management.
- **GroupMembers:** A junction table linking Users to Groups with roles (Admin, Viewer).
  - _Logic:_ Allows two parents (Users) to both manage and see the same children (Profiles).

### 2.3 Medical Logic & "North Star"

- **CheckupTypes:** Master list of specialties (e.g., Cardiology, Dentistry).
- **MedicalProtocols:** The "Intelligence" table. Contains the recommended frequencies based on age range, sex, and risk factors.
- **UserCheckups:** The specific reminder instances for a profile.

---

## 3. Detailed Table Definitions

### Table: `users`

| Column          | Type            | Description            |
| :-------------- | :-------------- | :--------------------- |
| `id`            | UUID (PK)       | Unique identifier.     |
| `email`         | String (Unique) | Auth identifier.       |
| `password_hash` | String          | Encrypted credentials. |
| `created_at`    | Timestamp       | Account creation date. |

### Table: `profiles`

| Column           | Type      | Description                                         |
| :--------------- | :-------- | :-------------------------------------------------- |
| `id`             | UUID (PK) | Unique identifier.                                  |
| `owner_id`       | UUID (FK) | The primary User who created the profile.           |
| `name`           | String    | Display name (e.g., "Dad", "Sofia").                |
| `birth_date`     | Date      | Used to calculate age for protocols.                |
| `biological_sex` | Enum      | MALE, FEMALE, OTHER (for medical guidelines).       |
| `risk_factors`   | JSONB     | Flags: `{ "smoker": true, "hypertension": false }`. |
| `is_self`        | Boolean   | Flags if this is the primary account holder.        |

### Table: `checkup_types`

| Column           | Type      | Description                                   |
| :--------------- | :-------- | :-------------------------------------------- |
| `id`             | UUID (PK) | Unique identifier.                            |
| `name`           | String    | e.g., "Cardiología", "Odontología".           |
| `slug`           | String    | URL/API friendly identifier.                  |
| `base_frequency` | Integer   | Global default frequency in days (e.g., 365). |

### Table: `medical_protocols` (The Logic Engine)

| Column            | Type      | Description                                      |
| :---------------- | :-------- | :----------------------------------------------- |
| `id`              | UUID (PK) | Unique identifier.                               |
| `checkup_type_id` | UUID (FK) | Link to the specialty.                           |
| `min_age`         | Integer   | Minimum age for this frequency.                  |
| `max_age`         | Integer   | Maximum age for this frequency.                  |
| `sex`             | Enum      | If the protocol is specific (e.g., Gynaecology). |
| `suggested_freq`  | Integer   | Recommended days (e.g., 180 for seniors).        |

### Table: `user_checkups` (The Reminder Instance)

| Column            | Type               | Description                             |
| :---------------- | :----------------- | :-------------------------------------- |
| `id`              | UUID (PK)          | Unique identifier.                      |
| `profile_id`      | UUID (FK)          | Which family member this is for.        |
| `checkup_type_id` | UUID (FK)          | Which specialty.                        |
| `last_performed`  | Date (Nullable)    | When they last went to the doctor.      |
| `custom_freq`     | Integer (Nullable) | User's manual override of the protocol. |
| `status`          | Enum               | UPCOMING, OVERDUE, COMPLETED.           |

### Table: `medical_documents`

| Column       | Type      | Description                                           |
| :----------- | :-------- | :---------------------------------------------------- |
| `id`         | UUID (PK) | Unique identifier.                                    |
| `checkup_id` | UUID (FK) | Link to the specific appointment instance.            |
| `file_url`   | String    | S3 storage path.                                      |
| `ocr_data`   | JSONB     | Extracted data from the document (Doctor name, date). |
| `type`       | Enum      | ORDEN_MEDICA, RESULTADO, RECETA.                      |

---

## 4. Key Relationships for the Family Manager

To enable the **"Dad's Cardiologist"** scenario where both a husband and wife can see the notification:

1.  **FamilyGroup** links to multiple **Users**.
2.  **Profiles** are assigned to a **FamilyGroup**.
3.  The **NestJS API** checks if the `Request.User` belongs to the same `FamilyGroup` as the `Profile` they are trying to access.

---
