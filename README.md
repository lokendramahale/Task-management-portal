# TaskPortal — Task Management App

A full-stack task management application built with **NestJS**, **React (Vite)**, and **MongoDB Atlas**. Includes user authentication, task CRUD, priority levels, due dates, and status filtering.

---

## Screenshots

### Login Page
<!-- Add screenshot here -->
![alt text](./public/image-2.png)
&nbsp;

&nbsp;

### Register Page
<!-- Add screenshot here -->
![alt text](./public/image-3.png)
&nbsp;

&nbsp;

### Dashboard — All Tasks
<!-- Add screenshot here -->
![alt text](./public/image.png)
&nbsp;

&nbsp;

### Dashboard — Filtered View
<!-- Add screenshot here -->
![alt text](./public/image-4.png)
&nbsp;

&nbsp;

### Add Task Modal
<!-- Add screenshot here -->
![alt text](./public/image-1.png)
&nbsp;

&nbsp;

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, React Router v6   |
| Backend   | NestJS 10, Passport JWT           |
| Database  | MongoDB via Mongoose              |
| Auth      | JWT Bearer tokens, bcryptjs       |

---

## How to Run

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the project

```bash
git clone https://github.com/lokendramahale/Task-management-portal.git
cd task-portal
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your values:

```env
MONGODB_URI=mongodb+srv://lokendramahale3_db_user:Kwd4G6a0Bh3iXNhO@cluster0.jufxyxg.mongodb.net/?appName=Cluster0
JWT_SECRET=9c7f4d8b2e0a6f5b3c1d9e7a4f8b2c6d1e3f5a7c9b0d2e4f6a8c1b3d5e7f9a2
JWT_EXPIRES_IN=7d
PORT=3000
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run start:dev
```

> Backend runs at `http://localhost:3000/api`

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs at `http://localhost:5173`
> Vite automatically proxies all `/api` calls to the backend — no extra config needed.

---

## AI Tools Used

This project was developed with integrated use of multiple AI tools:
- **Claude AI** — Code generation and architecture implementation
- **Chat GPT** — Enhanced prompts and better solution refinement
- **GitHub Copilot** — Bug fixing and code completion

---

## AI Prompts Used

**Prompt 1 — System architecture & planning**
> "You are a senior full-stack architect. Design a simple Task Management Portal using React (Vite) for frontend, NestJS for backend, and MongoDB. Include JWT authentication, task creation (title required, description optional, status, createdAt), task list view, toggle completed, and filtering (all/pending/completed). Provide folder structure, data model, API endpoints, authentication flow, and React state management approach suitable for a coding assignment."

**Prompt 2 — NestJS backend scaffold**
> "Generate a NestJS backend for a Task Management Portal using MongoDB (Mongoose). Include User schema (email, password hashed) and Task schema (title, description, status, createdAt, userId). Implement JWT authentication, Auth module (register/login), Task module (CRUD and toggle status), and protect task routes with JWT guards. Provide schemas, DTOs, controllers, services, and JWT strategy using beginner-friendly best practices."

**Prompt 3 — Authentication implementation**
> "Implement JWT authentication in NestJS with MongoDB. Register user with bcrypt password hashing, login returning JWT token, JWT guard for protected routes, extract userId from token, and associate tasks with the logged-in user. Provide clean readable code and explain each step."

**Prompt 4 — MongoDB task schema design**
> "Design a MongoDB Mongoose schema for a Task Management Portal. Task fields: title (required), description (optional), status (pending/completed default pending), createdAt auto, userId reference. Suggest useful indexes and validation rules."

**Prompt 5 — React frontend scaffold**
> "Create a React (Vite) frontend for a Task Management Portal with pages: Login, Register, and Dashboard. Features: add task form, task list display, toggle completed, filter all/pending/completed, show created date, JWT auth stored in localStorage. Use functional components, hooks, Axios for API calls, and minimal clean UI."

**Prompt 6 — React state management suggestion**
> "Suggest state management for a small Task Portal React app with auth state (user, token), task list state, and filter state. Use React Context and hooks. Explain state shape, actions, provider structure, and data flow in a simple interview-ready approach."

**Prompt 7 — API integration layer**
> "Write React Axios service functions to connect to a NestJS Task API. Endpoints: POST /auth/register, POST /auth/login, GET /tasks, POST /tasks, PATCH /tasks/:id/toggle, DELETE /tasks/:id. Include JWT header interceptor, error handling, and reusable API layer."

**Prompt 8 — Task component**
> "Create a reusable React TaskItem component with props: title, description, status, createdAt, onToggle. UI should include a checkbox/toggle, completed styling, and formatted date. Keep component clean and reusable."

**Prompt 9 — Filtering logic**
> "Implement task filtering in React with filters All, Pending, Completed. Include filter buttons, active state styling, and derived filteredTasks list using hooks. Keep logic simple."

**Prompt 10 — Validation & edge cases**
> "Suggest validation and edge cases for a Task Management Portal including backend DTO validation, frontend form validation, auth errors, empty task title, unauthorized access, and task ownership checks for NestJS + React."

**Prompt 11 — README generation**
> "Generate a professional README for a Task Management Portal built with React (Vite), NestJS, and MongoDB including features, setup steps, environment variables, API overview, folder structure, and AI usage declaration suitable for a coding assignment."

**Prompt 12 — AI usage declaration**
> "Write an AI usage declaration stating AI was used for scaffolding and boilerplate, while API design and state management were written manually, and confirming full understanding of the code in a professional tone."

---

## What AI Generated vs What Was Modified

### AI Generated
- All NestJS boilerplate — modules, controllers, services, schemas, DTOs
- React component structure, JSX markup and layout
- CSS design system — variables, animations, responsive styles
- Axios instance setup with request/response interceptors
- Form validation logic and error handling in components
- Modal open/close behaviour and overlay click handling
- Route protection pattern (ProtectedRoute / PublicRoute wrappers)

### Manually Written / Modified
- API endpoint design — naming, HTTP methods, and response shapes were decided manually before writing code
- State management architecture — the choice of Context + useState, optimistic update strategy, and localStorage sync approach
- Security decisions — `select: false` on the password field, ownership checks on every task mutation, bcrypt rounds set to 12
- Data model decisions — separate `completedAt` field, `priority` enum, `userId` indexed on the task schema
- Error handling strategy — where errors surface (form-level vs page-level), when to roll back optimistic updates, global 401 redirect logic

---

## API Design

I kept the API straightforward and REST-ful. Every endpoint does one clear thing, and all task routes are scoped to the authenticated user so there's no way to accidentally touch someone else's data.

**Base URL:** `/api`
All task endpoints require an `Authorization: Bearer <token>` header.

---

### Auth Endpoints

#### `POST /api/auth/register`

Creates a new account and immediately returns a token — the user doesn't need to log in separately after registering.

```json
Request:
{ "name": "Lokendra Mahale", "email": "lokendra@gmail.com", "password": "123456" }

Response 201:
{ "access_token": "eyJhbGci...", "user": { "_id": "...", "name": "Lokendra Mahale", "email": "lokendra@gmail.com" } }
```

#### `POST /api/auth/login`

Validates credentials and returns a token. Returns `200` (not `201`) since nothing is being created.

```json
Request:
{ "email": "lokendra@gmail.com", "password": "123456" }

Response 200:
{ "access_token": "eyJhbGci...", "user": { "_id": "...", "name": "Lokendra Mahale", "email": "lokendra@gmail.com" } }
```

---

### Task Endpoints

| Method | Endpoint | What it does |
|--------|----------|--------------|
| `GET` | `/api/tasks` | Get all your tasks. Add `?status=pending` or `?status=completed` to filter |
| `GET` | `/api/tasks/stats` | Quick count — `{ total, completed, pending }` |
| `GET` | `/api/tasks/:id` | Get a single task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/:id` | Update task fields (title, description, priority, dueDate) |
| `PATCH` | `/api/tasks/:id/toggle` | Flip status between pending ↔ completed |
| `DELETE` | `/api/tasks/:id` | Permanently delete a task |

I gave `toggle` its own endpoint instead of bundling it into the general PATCH. Toggling status is a distinct action from editing task details — and it also auto-manages the `completedAt` timestamp on the server side, which wouldn't make sense to handle manually from the client.

**Request body fields (create / update):**

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | Max 120 characters |
| `description` | No | Max 1000 characters |
| `priority` | No | `low`, `medium`, or `high` — defaults to `medium` |
| `dueDate` | No | ISO date string e.g. `2025-04-01` |

**Task object shape:**

```json
{
  "_id": "...",
  "title": "Fix login bug",
  "description": "Happens on mobile Safari",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-04-01T00:00:00.000Z",
  "completedAt": null,
  "createdAt": "2025-03-01T10:00:00.000Z",
  "updatedAt": "2025-03-01T10:00:00.000Z"
}
```

**Error responses:**

| Status | When it happens |
|--------|----------------|
| `400` | Request body fails validation |
| `401` | Token is missing, expired, or invalid |
| `403` | Token is valid but the task belongs to someone else |
| `404` | Task ID doesn't exist |
| `409` | Tried to register with an email that's already taken |

---

## State Management

I went with React Context and useState rather than pulling in Redux or Zustand. For an app this size, a full state management library would be overkill — the data flow is simple enough that Context handles it cleanly without the extra boilerplate.

---

### Auth State — `AuthContext`

This lives at the top of the component tree and handles everything to do with who's logged in.

It holds three things: the current user object, the JWT token, and an `isAuthenticated` boolean derived from whether a token exists. Any component that needs to know if the user is logged in, or needs to call login/logout, just pulls from this context.

The tricky part was making sure the session survives a page refresh. The approach I used was mirroring both the token and the user object to `localStorage` every time they change, and reading from `localStorage` on initial load. That way a refresh doesn't log you out. The Axios interceptor reads from `localStorage` directly when attaching the Authorization header, so both places always need to stay in sync — a private `persistAuth` helper handles updating both in one shot so they never drift apart.

There's also a response interceptor in Axios that catches any `401` coming back from the server and automatically redirects to login. This handles expired tokens without having to manually check in every component.

---

### Task State — Dashboard Component

All the task-related state lives locally in the Dashboard component. I didn't lift it higher because nothing outside the Dashboard needs to know about tasks.

Four pieces of state drive the whole page:
- `tasks` — the full array of tasks currently shown
- `stats` — the `{ total, pending, completed }` counts for the summary pills
- `filter` — which tab is active (`all`, `pending`, or `completed`)
- `modal` — tracks whether the modal is open, whether it's create or edit mode, and which task is being edited if any

The part worth highlighting is the optimistic update pattern for toggling and deleting. Instead of waiting for the server to respond before updating the UI, I update the local state immediately and confirm with the API in the background. If the server call fails, the previous state is restored (rollback). This makes the app feel instant even on a slow connection — the user clicks the checkbox and it flips right away rather than waiting on a network round trip.

**Data flow:**

```
AuthContext       (global — who is logged in)
    └── Dashboard (local — all task state)
            ├── TaskCard      (receives task + action callbacks as props)
            └── AddTaskModal  (receives task data + onSubmit as props)
```

No component receives more props than it actually needs, and nothing is nested more than one level deep from the Dashboard.