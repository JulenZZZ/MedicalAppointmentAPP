# 🏥 AppointmentClient - Medical Appointment Management System

A modern, responsive web application for booking and managing medical appointments, built with **Angular 18+**, **TypeScript**, **Signals**, and **Tailwind CSS**. 

This frontend application seamlessly integrates with a **.NET 9 Web API** backend, providing a secure, real-time medical scheduling platform for patients, doctors, and administrators.

---

## 🚀 Key Features

### ✅ Currently Implemented
* **Authentication & Authorization:** Dual login and registration workflows using Angular Reactive Forms with real-time validation.
* **Signal-Based Session State:** Reactive user session management powered by Angular Signals (`currentUser`, `isAuthenticated`, `userRole`).
* **JWT Interceptor:** Automatic injection of `Authorization: Bearer <token>` headers into outgoing HTTP request pipelines.
* **Route Protection:** Functional `AuthGuard` and `RoleGuard` preventing unauthorized or cross-role access.
* **Modern UI:** Styled with Tailwind CSS v4, optimized for clean medical dashboards.

### ⏳ Upcoming Roadmap & Core Functionalities
We are actively building the following features to fully integrate with our .NET 9 API:
* **Interactive Appointment Booking:** Browse available doctor schedules/time slots and book medical appointments in real time.
* **Payment Confirmation System:** Integrated payment step to confirm and secure booked appointment slots.
* **Appointment Management:** Complete CRUD operations allowing patients and staff to view, reschedule (edit), or cancel existing appointments.
* **Medical Staff Dashboard:** Dedicated workspace for doctors and admins to generate time slots, manage schedules, and review patient appointments.

---

## 💻 Backend Integration (.NET 9 Web API)

The client communicates directly with our custom **.NET 9 RESTful API**, executing typed HTTP requests for:
* Authentication endpoints (`/api/Auth/login`, `/api/Auth/register`).
* Doctor directory and availability schedules (`/api/Doctors`, `/api/TimeSlots`).
* Appointment lifecycle and transaction processing (`/api/Appointments`).

---

## 🏛️ Project Architecture

The application follows an enterprise-ready, modular architecture divided into `Core`, `Shared`, and `Features`:

```text
src/app/
├── core/                  # Global state, guards, interceptors, models, and API services
│   ├── guards/            # AuthGuard & RoleGuard (RBAC protection)
│   ├── interceptors/      # JWT Interceptor (Automatic bearer token injection)
│   ├── models/            # TypeScript Interfaces (User, Doctor, Appointment, TimeSlot)
│   └── services/          # AuthService, DoctorService, AppointmentService
│
├── features/              # Feature modules grouped by domain
│   ├── auth/              # AuthFormComponent (Login & Register)
│   ├── patient/           # Patient Dashboard & Booking views (In Progress)
│   └── admin/             # Doctor Schedule & Slot Management (In Progress)
│
└── shared/                # Reusable UI elements
    └── components/        # Reactive Navbar, Modals, and Loading Spinners
```

🛠️ Tech Stack
Framework: Angular 18+ (Standalone Components & Signals)

Styling: Tailwind CSS v4

State Management: Angular Signals (signal, computed, effect)

Forms: Angular Reactive Forms

HTTP Client: Functional HttpInterceptor with HttpClient

Routing: Angular Router with functional Route Guards

🏁 Getting Started Locally
Prerequisites
Node.js: v20.x or v22.x (LTS recommended)

Angular CLI: v18.x or higher (npm install -g @angular/cli)

Installation & Run
Navigate to the client folder:

Bash
cd AppointmentClient
Install dependencies:

Bash
npm install
Start the Angular development server:

Bash
ng serve
Open in browser:
Navigate to http://localhost:4200/.

📄 License
This project is open-source and available under the MIT License.


---

<ElicitationsGroup message="El README está listo con la hoja de ruta clara. ¿Con cuál componente seguimos en Angular?">
  <Elicitation label="Configurar app.routes.ts con las rutas protegidas" query="Actualicemos app.routes.ts para asociar las rutas de pacientes y administradores con authGuard y roleGuard."/>
  <Elicitation label="Construir el Navbar reactivo en shared/components" query="Creemos el componente Navbar reactivo en shared/components/navbar que se adapte según la sesión del usuario."/>
</ElicitationsGroup>
