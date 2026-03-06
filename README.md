# Creche Management System

A comprehensive web application for managing creche operations, including student records, attendance, results, and communication between staff and parents.

![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Turso](https://img.shields.io/badge/Turso-Database-00C853?style=for-the-badge&logo=sqlite&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-Monitoring-362D59?style=for-the-badge&logo=sentry&logoColor=white)

## 🚀 Features

- **Authentication & Authorization**: Secure sign-up and sign-in powered by [Clerk](https://clerk.com/).
- **Role-Based Access Control (RBAC)**:
  - **Admin Dashboard**: Manage students, staff, classes, and view comprehensive reports.
  - **Staff Dashboard**: Mark attendance, enter results, and manage daily reports.
  - **Parent Dashboard**: View child's attendance, results, and communicate with the school.
- **Student Management**: Detailed profiles including guardian contact info and medical history.
- **Academic Results**: System for recording and publishing term results.
- **Attendance Tracking**: Digital attendance marking for students and staff.
- **Production Ready**: 
  - **Database**: Powered by Turso (SQLite) with Drizzle ORM.
  - **Monitoring**: Full-stack error tracking and performance monitoring with Sentry.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: [Turso](https://turso.tech/) (SQLite)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Monitoring**: [Sentry](https://sentry.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Language**: TypeScript

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Clerk account for authentication
- A Turso database
- A Sentry project

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/v0-creche-website-design.git
    cd v0-creche-website-design
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your keys:
    ```bash
    # Clerk Auth
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    CLERK_WEBHOOK_SECRET=whsec_...
    
    # Database (Turso)
    TURSO_DATABASE_URL=libsql://your-db.turso.io
    TURSO_AUTH_TOKEN=your-auth-token

    # Monitoring (Sentry)
    NEXT_PUBLIC_SENTRY_DSN=https://...
    SENTRY_AUTH_TOKEN=... (Required for source maps upload during build)
    ```

4.  **Push Database Schema:**
    ```bash
    npx drizzle-kit push
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

6.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication Setup (Clerk)

This project uses Clerk Organizations to manage roles.
1.  Create an Organization in your Clerk Dashboard.
2.  Define Roles: `org:admin`, `org:staff`, `org:parent`.
3.  Assign users to these roles to grant access to specific dashboards.

## 📦 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

**Important:** Ensure you add all the environment variables listed above to your Vercel project settings.
