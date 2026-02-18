# Dino Discovery Camp — Roster

A small full-stack app for managing enrolled campers. The **primary goal** is to show a roster of users (campers) and let you edit their “username” (email handle); all data is stored in PostgreSQL and persists across refreshes.

## How it works

- **Frontend** (Vite + React + TypeScript) runs on port **8080**. It fetches the roster from the backend and displays one card per user. You can edit the username (email local part) on each card; saving sends a PATCH to the backend and updates the list.
- **Backend** (Node + Express) runs on port **4000**. It reads/writes the `users` table in PostgreSQL and exposes:
  - `GET /api/users` — list all users (ordered by id)
  - `PATCH /api/users/:id` — update a user (first_name, last_name, email).
- **Database** (PostgreSQL, database name: `dinocamp`) holds a `users` table (id, first_name, last_name, email, created_at). You create the DB and run the SQL scripts yourself; there is no Docker or migration tooling.

In development, the frontend proxies `/api` to `http://localhost:4000`, so the React app can call `fetch("/api/users")` without CORS.

## Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** (running locally or reachable)
- **npm** (comes with Node)

## Setup (one-time)

1. **Create the database**
   - Create a PostgreSQL database named `dinocamp` (e.g. `createdb dinocamp`, or via your DB client).

2. **Apply schema and seed**
   - From the **repo root**:
     ```bash
     psql -d dinocamp -f db/schema.sql
     psql -d dinocamp -f db/seed.sql
     ```

3. **Environment**
   - Copy `.env.example` to `.env` in the **repo root**, then edit `.env` and set your Postgres credentials:
     ```
     DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/dinocamp
     PORT=4000
     ```

4. **Install dependencies**
   - Backend:
     ```bash
     cd backend
     npm install
     ```
   - Frontend:
     ```bash
     cd frontend
     npm install
     ```

## Running the app

Use **two terminals**.

**Terminal 1 — backend**

```bash
cd backend
npm run dev
```

You should see something like: `Server listening on http://localhost:4000`.

**Terminal 2 — frontend**

```bash
cd frontend
npm run dev
```

Then open **http://localhost:8080** in your browser. You should see the Dino Discovery Camp roster; edits to usernames will persist after refresh (saved in Postgres).

## Project layout

```
├── backend/          # Express API (port 4000)
│   └── src/
│       ├── server.ts
│       ├── db.ts
│       └── routes/users.ts
├── frontend/         # Vite React app (port 8080)
│   └── src/
│       ├── pages/Index.tsx
│       ├── components/CamperCard.tsx
│       ├── lib/api.ts
│       └── types.ts
├── db/
│   ├── schema.sql
│   └── seed.sql
├── .env              # Your local config (not committed)
└── README.md
```

## Quick reference

| Task              | Command / location                          |
|-------------------|---------------------------------------------|
| Start backend     | `cd backend` then `npm run dev`             |
| Start frontend    | `cd frontend` then `npm run dev`            |
| App in browser    | http://localhost:8080                       |
| API base          | http://localhost:4000 (e.g. /health, /api/users) |
