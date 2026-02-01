FastAPI User Management – React Frontend

A clean, scalable React frontend built to integrate with a FastAPI backend, featuring authentication, protected routes, and full task management with a focus on maintainability and user experience.

### Features

### Authentication

Login & Registration

JWT token handling

Protected routes

### Task Management (CRUD)

Create, List, Update, Delete tasks

Status tracking (Todo / In Progress / Done)

### Async UX Handling

Loading states for API calls

Inline error messages (no disruptive alerts)

### Clean Architecture

Centralized API layer

Reusable components

Clear separation of concerns

### Accessibility

Semantic HTML

ARIA attributes for form controls

### Testing & Quality

Unit tests with React Testing Library

ESLint configured and passing

### Project Structure
src/
 ├─ components/
 │   ├─ Task.jsx
 │   ├─ ProtectedRoute.jsx
 │
 ├─ pages/
 │   ├─ LoginRegister.jsx
 │   └─ Dashboard.jsx
 │
 ├─ services/
 │   └─ api.js
 │
 ├─ styles/
 │   ├─ dashboard.css
 │   ├─ auth.css
 │   └─ task.css
 │
 ├─ App.jsx
 └─ main.jsx
 |_index.html

### Application Flow

User logs in or registers

JWT token is stored securely

Protected dashboard becomes accessible

User manages tasks via API-backed operations

Logout clears authentication and redirects to login

### Tech Stack

React (Vite)

React Router

Axios

FastAPI (Backend)

Jest & React Testing Library

ESLint

### Running the Project
npm install
npm run dev


### Run linting:

npx eslint src


### Run tests:

npm test

📝 Notes

API base URL is configured via environment variables

Authentication headers are injected automatically via Axios interceptors

UI prioritizes clarity and predictable user feedback

✅ Status

✔ Functional
✔ Tested
✔ Linted
✔ Review-ready