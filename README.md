# Creche Management System

A comprehensive web application for managing creche operations, including student records, attendance, results, and communication between staff and parents.

![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

## 🚀 Features

- **Authentication & Authorization**: Secure sign-up and sign-in powered by [Clerk](https://clerk.com/).
- **Role-Based Access Control (RBAC)**:
  - **Admin Dashboard**: Manage students, staff, classes, and view comprehensive reports.
  - **Staff Dashboard**: Mark attendance, enter results, and manage daily reports.
  - **Parent Dashboard**: View child's attendance, results, and communicate with the school.
- **Student Management**: Detailed profiles including guardian contact info and medical history.
- **Academic Results**: System for recording and publishing term results.
- **Attendance Tracking**: Digital attendance marking for students and staff.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Language**: TypeScript

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Clerk account for authentication

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
    Create a `.env.local` file in the root directory and add your Clerk keys:
    ```bash
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    CLERK_WEBHOOK_SECRET=whsec_...
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication Setup (Clerk)

This project uses Clerk Organizations to manage roles.
1.  Create an Organization in your Clerk Dashboard.
2.  Define Roles: `org:admin`, `org:staff`, `org:parent`.
3.  Assign users to these roles to grant access to specific dashboards.

### API Endpoints

- **`POST /api/clerk/update-metadata`**
  - Used to link a Parent account to a specific Student ID.
  - **Body**: `{ "parentUserId": "user_...", "studentId": "std_..." }`
  - Updates the parent's organization membership metadata.

- **`POST /api/webhooks/clerk`**
  - Listens for Clerk events (e.g., `user.created`).
  - Requires `svix` for signature verification.
  - Useful for syncing Clerk users to your local database.

## 📦 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
