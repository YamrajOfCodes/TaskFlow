# TaskFlow

A full-featured task management app built with React, TanStack Query, and Tailwind CSS. Users can register, create projects, and manage tasks with filtering, status tracking, and priority management baked in.

I built this over a focused sprint to have something end-to-end: auth, CRUD, real state management patterns, and a UI that doesn't feel half-finished. this reflects how I actually structure and think through a project.

---

## Tech Stack

| Framework | React 18 + Vite + TypeScript |
| Server state | TanStack Query (React Query v5) |
| Styling | Tailwind CSS + shadcn/ui |
| Forms & validation | React Hook Form + Zod |
| Mock backend | json-server |
| Containerisation | Docker |

## Features

- Register and login with persisted auth state (survives refresh)
- Protected routes — unauthenticated users get redirected cleanly
- Full CRUD on projects and tasks
- Task status (`todo`, `in-progress`, `done`) and priority (`low`, `medium`, `high`)
- Filter tasks by status
- Responsive layout with loading stats and error boundaries

---

## Why These Choices

**TanStack Query over plain `useEffect` + `useState`**

This was the most deliberate decision. After doing the manual `isLoading / isError / data` dance on a previous project, I wanted something that handled caching, background refetching, and mutation side effects without me writing the same boilerplate over and over. React Query's `invalidateQueries` pattern after a mutation is clean — you update the server, the cache invalidates, and the UI reflects reality. No juggling local state to stay in sync.

The tradeoff is it adds a layer of abstraction that can confuse people who haven't used it. For a project this small, plain `useEffect` would have worked fine. But I chose it deliberately because I use it in production and wanted the README to reflect that.

**json-server over a real backend**

This is a frontend project. Spending time writing a Node.js or Go backend would have pulled focus from where the actual work is — UI patterns, state management, component architecture. json-server gives me real HTTP endpoints with filtering (`/tasks?project_id=1`), persistence, and zero setup cost. It's not production-ready, obviously, but it was the right call for the scope.

**Zod + React Hook Form**

React Hook Form keeps forms uncontrolled and performant by default — no re-render on every keystroke. Zod handles the schema and gives you TypeScript types for free via `z.infer<>`. Wiring them together with `zodResolver` means validation logic lives in one place and the form knows about it automatically. I've tried doing this with Yup before and the Zod DX is noticeably better.

**shadcn/ui over a full component library**

I didn't want to fight a component library's opinions on styling. shadcn gives you the component code directly,  you own it, you can modify it, and it's already written against Tailwind. The tradeoff is you're responsible for keeping things consistent yourself, which takes more upfront discipline. For a solo project that's fine. For a team, you'd want more guardrails.

---

## Project Structure

```
src/
├── components/
│   ├── Modals/          # TaskModal, ProjectModal
│   └── Reusable/        # TaskCard, Header, etc.
├── hooks/
│   ├── authHooks/       # useLogin, useLogout, useRegister
│   ├── TasksHooks/      # useTasks, useCreateTask, etc.
│   └── ProjectsHooks/   # useProjects, useCreateProject, etc.
├── pages/               # Route-level views
├── lib/                 # axios instance, utils
└── App.tsx              # Routes + QueryClientProvider
```

Hooks own all API logic. Pages and components just call hooks. It keeps the views thin and makes it easy to test or swap the data layer later.

---

## Running Locally

Docker needs to be running.

```bash
git clone https://github.com/your-username/taskflow
cd taskflow
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:4000 |

**Test credentials**
```
Email:    kk@gmail.com.com
Password: 123457
```

---

## API Reference (Mock)

Built on json-server. All standard REST conventions apply.

```
GET     /projects
POST    /projects
PATCH   /projects/:id
DELETE  /projects/:id

GET     /tasks
GET     /tasks?project_id=:id
GET     /tasks?status=todo
POST    /tasks
PATCH   /tasks/:id
DELETE  /tasks/:id
```

---

## What I'd Do Differently With More Time

**Real backend** 
json-server is fine for mocking but it has no auth, no business logic, and no real query capabilities. I'd replace it with a Node.js + Postgres setup or a lightweight Go service. jwt-based auth with refresh tokens instead of whatever's sitting in localStorage right now.

**Drag-and-drop kanban** 
The current list view works but a board view with `@dnd-kit` would make task management feel more natural. The data model already supports it (status is just a string), it's purely a UI change.

**Pagination** 
Right now everything fetches in one shot. Fine at this scale, breaks at any real scale. TanStack Query's `useInfiniteQuery` makes cursor-based pagination pretty clean.

**Better optimistic updates**
Mutations currently wait for the server before updating the UI. With React Query's `onMutate` you can update the cache immediately and roll back on error. I skipped it to keep things readable but it would make the app feel faster.

**E2E tests** 
I have no automated tests here. For a production project I'd add Playwright for critical paths (login, create project, create task) at minimum.

---

## Notes

The goal was a complete, working product — not a demo with half the features stubbed out. Auth works, CRUD works, the UI handles edge cases. The code is structured the way I'd structure it on a real team: hooks for data, components for UI, pages for routing. Nothing clever, nothing that would confuse someone reading it for the first time.
