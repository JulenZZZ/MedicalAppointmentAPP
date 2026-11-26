# 🏥 YourMed (`AppointmentClient`) — Medical Appointment Management System

A modern, responsive web application for booking and managing medical appointments, built with **Angular 18+**, **TypeScript**, **Signals**, and **Tailwind CSS v4**.

This frontend application integrates seamlessly with a custom **.NET 9 Web API** backend deployed on **Microsoft Azure**, providing a secure, real-time medical scheduling platform for patients and administrators.

🔗 **Live Demo:** [yourmed-phi.vercel.app](https://yourmed-phi.vercel.app)  
⚡ **One-Click Guest Access:** Click **"Demo Patient Access"** on the login screen to explore the platform immediately without registering.

---

## 🚀 Key Features (v1.0)

### ✅ Implemented Functionalities
- **Authentication & One-Click Demo Access:** Dual login and registration workflows using Angular Reactive Forms with real-time validation, plus a one-click **Demo Patient Access** button for frictionless portfolio exploration.
- **Signal-Based Session State:** Reactive user session and UI state management powered by Angular Signals (`currentUser`, `isAuthenticated`, `userRole`, `signal`, `computed`).
- **JWT Interceptor & Route Protection:** Automatic injection of `Authorization: Bearer <token>` headers via functional HTTP interceptors, paired with `AuthGuard` and `RoleGuard` for role-based access control (`Patient`, `Admin`).
- **Real-Time Doctor Search & Interactive Booking:** Filter specialists by medical field or date, displaying only valid upcoming slots (automatically excluding past dates and elapsed hours).
- **Simulated Payment Checkout:** End-to-end booking confirmation flow with simulated payment processing and transaction tracking.
- **Appointment Management & Cancellation:** Dedicated `My Appointments` dashboard allowing patients to review visit details and cancel upcoming appointments via confirmation modals with immediate UI state updates (`Cancelled` / `Refunded`).
- **Admin Schedule Management:** Protected workspace for administrators to manage active doctors and generate availability time slots.
- **Cloud Cold-Start Mitigation:** Dispatches a silent background health-check (`GET /`) from the landing page to pre-warm the Azure free-tier server, combined with a conditional 3-second delayed UI notice during authentication.

### 🔮 Upcoming Roadmap (v2.0)
- **Stripe Sandbox Integration:** Replace simulated payments with Stripe Checkout and webhook verification.
- **Dedicated Doctor Portal:** Separate practitioner workspace for managing personal schedules and consultation notes.
- **Calendar & Email Notifications:** Automated `.ics` calendar invites and booking confirmation emails.
- **Timezone Normalization:** Explicit IANA timezone handling between client browsers and UTC backend storage.

---

## 💻 Backend Integration (.NET 9 Web API)

The client communicates directly with the **.NET 9 RESTful API** hosted on Azure App Service, executing typed HTTP requests for:
- **Server Health & Pre-Warming:** `GET /` (silent background wake-up check).
- **Authentication:** `POST /api/Auth/login`, `POST /api/Auth/register`.
- **Doctors & Schedules:** `GET /api/Doctors`, `GET /api/Doctors/available-timeslots`, `GET /api/Doctors/{doctorId}/available-timeslots`.
- **Appointment Lifecycle:** `GET /api/Appointments/my-appointments`, `POST /api/Appointments`, `PUT /api/Appointments/{id}/cancel`.

---

## 🏛️ Project Architecture

The application follows a modular, standalone-component architecture divided into `Core`, `Shared`, and `Features`:

```text
src/app/
├── core/                  # Global state, guards, interceptors, models, and API services
│   ├── guards/            # AuthGuard & RoleGuard (RBAC protection)
│   ├── interceptors/      # Functional JWT Interceptor (Bearer token injection)
│   ├── models/            # TypeScript Interfaces (User, Doctor, Appointment, TimeSlot)
│   └── services/          # AuthService, DoctorService, AppointmentService
│
├── features/              # Feature modules grouped by domain
│   ├── home/              # Landing page with silent server pre-warming
│   ├── auth/              # AuthFormComponent (Login, Register & Demo Patient Access)
│   ├── patient/           # Specialist Search, Booking Checkout & My Appointments
│   └── admin/             # Doctor Directory & Time Slot Management
│
└── shared/                # Reusable UI elements
    └── components/        # Reactive Navbar, Confirmation Modals, and Loading Spinners
```
## 🛠️ Tech Stack

- **Framework:** Angular 18+ (Standalone Components & Signals)
- **Styling:** Tailwind CSS v4
- **State Management:** Angular Signals (`signal`, `computed`, `effect`)
- **Forms:** Angular Reactive Forms
- **HTTP Client:** Functional `HttpInterceptor` with `HttpClient`
- **Routing:** Angular Router with functional Route Guards
- **Testing & CI:** Jasmine / Karma unit tests automated via GitHub Actions
- **Deployment:** Vercel (Continuous Deployment)

---

## 🏁 Getting Started Locally

### Prerequisites
- **Node.js:** v20.x or v22.x (LTS recommended)
- **Angular CLI:** v18.x or higher (`npm install -g @angular/cli`)

### Installation & Run
1. **Navigate to the client folder:**
   ```bash
   cd AppointmentClient
Install dependencies:

Bash
npm install
Configure API environment (optional):
Verify src/environments/environment.ts points either to your local .NET API (https://localhost:7108/api) or the live Azure backend.

Start the Angular development server:

Bash
ng serve
Open in browser:
Navigate to http://localhost:4200/.

Running Unit Tests
Bash
ng test
