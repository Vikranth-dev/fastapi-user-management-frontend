FastAPI User Management – React Frontend

A clean, scalable React frontend built to integrate with a FastAPI backend, featuring authentication, protected routes, task management, and an admin-only analytics dashboard, with a focus on maintainability and user experience.

### Features
Authentication

Login & Registration
JWT token handling
Protected routes
Role-aware UI (admin vs user)

### Task Management (CRUD)

Create, List, Update, Delete tasks
Status tracking (Todo / In Progress / Done)

### Admin Analytics (UI)

Admin-only analytics dashboard
Charts for task statistics (Chart.js)
Table view for tasks created per day
Frontend limits analytics display to the last 7 days
Last updated timestamp

Non-admin users never see analytics UI components
Authorization is enforced by the backend

### Async UX Handling

Loading states for API calls
Inline error messages (no disruptive alerts)
Graceful handling of unauthorized responses

### Clean Architecture

Centralized API layer
Axios interceptors for authentication headers
Reusable components
Clear separation of concerns

### Accessibility

Semantic HTML
ARIA attributes for form controls

Testing & Quality

ESLint configured and passing
Clean, maintainable codebase

### Project Structure
src/
 ├─ components/
 │   ├─ Task.jsx
 │   ├─ ProtectedRoute.jsx
 |   |- TaskStausChart.jsx
 │
 ├─ pages/
 │   ├─ LoginRegister.jsx
 │   ├─ Dashboard.jsx
 │   └─ AnalyticsDashboard.jsx
 │
 ├─ services/
 │   └─ api.js
 │
 ├─ styles/
 │   ├─ dashboard.css
 │   ├─ analytics.css
 │   ├─ auth.css
 │   └─ task.css
 │
 ├─ App.jsx
 └─ main.jsx
 |_ index.html

Application Flow

User logs in or registers
JWT token is stored securely
Protected dashboard becomes accessible
User manages tasks via API-backed operations
Admin users access analytics dashboard
Logout clears authentication and redirects to login

Tech Stack

React (Vite)
React Router
Axios
Chart.js
FastAPI (Backend)

Running the Project
npm install
npm run dev

Run linting:
npx eslint src


📝 Notes

API base URL is configured via environment variables
Authentication headers are injected automatically via Axios interceptors
Frontend treats the backend as the source of truth for security
UI prioritizes clarity and predictable user feedback