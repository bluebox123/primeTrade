# PrimeTrade assignment app

Small full‑stack web app with authentication and a task dashboard.

- Frontend: React + Vite
- Backend: Node.js + Express + MongoDB
- Auth: JWT, password hashing with bcrypt

## Running the backend

From the `backend` folder:

1. Install dependencies
   - `npm install`
2. Copy `.env.example` to `.env` and adjust values
   - `MONGODB_URI` should point to a running MongoDB instance
   - Set a long random string for `JWT_SECRET`
3. Start the server
   - `npm run dev`

Backend will run on `http://localhost:5000`.

## Running the frontend

From the `frontend` folder:

1. Install dependencies
   - `npm install`
2. Start the dev server
   - `npm run dev`

Frontend will run on `http://localhost:5173`.

## Features

- Register and log in with email + password
- JWT for protected routes
- Profile view and update (name)
- CRUD operations on tasks
- Search and filter tasks by status
- Logout flow on the dashboard

## Production and scaling notes

If this app were prepared for production:

- **Backend**
  - Behind a reverse proxy such as Nginx.
  - Environment‑specific config for database and JWT secret.
  - Rate limiting and stricter validation on all endpoints.
  - Use connection pooling and proper indexes on MongoDB.
- **Frontend**
  - Built as static assets with Vite and served from a CDN.
  - Backend URL injected via environment variables at build time.
  - Separate environment files for `development`, `staging`, and `production`.
- **Integration**
  - All API calls go through a small `apiClient` layer (already in place), so base URL, headers, and error handling can be adjusted without touching the rest of the UI.
  - Token handling kept in one place (`authStorage`), making it easier to switch to http‑only cookies if needed.

See `backend/API.md` for more detailed endpoint information.
