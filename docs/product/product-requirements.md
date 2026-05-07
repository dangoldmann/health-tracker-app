# HealthGuard: Preventive Assistant

## Product Requirements Document (PRD)

**Status:** Discovery & Vision  
**Target Version:** MVP (v1.0)  
**Lead:** Product Management

---

## 1. Executive Summary

HealthGuard is a proactive mobile health assistant designed to solve the **"prevention gap."** By moving away from passive calendars and toward an intelligent recommendation engine, the app ensures individuals and families never miss critical annual screenings (Cardiology, Dentistry, Dermatology, etc.).

---

## 2. Core Functional Requirements (MVP)

### 2.1 Smart Onboarding & Risk Profiling `[MVP]`

A multi-step guided setup to build the user's "Health Identity."

- **Data Points:** Age, Biological Sex, and Location.
- **Risk Assessment:** High-level screening for smoking, hypertension, and family history.
- **Baseline Entry:** Inputting the dates of last known checkups to establish current status.

### 2.2 Proactive Recommendation Engine `[MVP]`

The "North Star" logic that determines the frequency of care.

- **Automated Guidelines:** Pre-loaded medical protocols (e.g., Argentine Cardiology Society standards) that suggest frequencies based on age/risk.
- **User Agency (Override):** Users can accept recommendations or set custom intervals (e.g., shifting a cleaning from 6 to 9 months) based on personal doctor advice.
- **Recalculation Logic:** Dynamic adjustment of "Next Due Date" whenever a frequency is changed or a checkup is logged.

### 2.3 Family Manager ("The Household Dashboard") `[MVP]`

A centralized view for managing dependents and elderly family members.

- **Multi-Profile Support:** Switch between "Me", "Dad", or "Kids" within the same account.
- **Shared Visibility:** Real-time status indicators (Green/Yellow/Red) for every family member's prevention status.

### 2.4 Smart Notification System `[MVP]`

Native push alerts designed to bypass "notification fatigue."

- **Anticipatory Alerts:** Reminders sent 7 days, 48 hours, and 24 hours before a predicted checkup due date.
- **Intelligent Snooze:** Options to "Remind me next month" or "Remind me later."

---

## 3. Advanced & Localized Features (Phase 2)

### 3.1 Local "Cartilla" Integration `[Phase 2]`

Direct integration with Argentine healthcare providers (OSDE, Galeno, Swiss Medical, etc.).

- **Provider Search:** Link overdue checkups to nearby specialists covered by the user's specific insurance.
- **Actionable Booking:** One-tap access to WhatsApp or phone numbers for local clinics.

### 3.2 Document Digitization (OCR) `[Phase 2]`

Removing manual entry friction via computer vision.

- **"Orden Médica" Scanner:** Snap a photo of a medical order to automatically extract the specialty, physician name, and study type.
- **Prescription Storage:** A secure vault for medical results and digital "recetas" categorized by specialty.

---

## 4. Success Metrics (KPIs)

- **Retention:** Percentage of users who log a second checkup after the initial onboarding.
- **Compliance:** Reduction in the average "Overdue" time for critical checkups.
- **Engagement:** Number of secondary profiles created (Family Manager adoption).

---
