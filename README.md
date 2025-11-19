# PrimeTrade assignment app

Small full‑stack web app with authentication and a task dashboard.

- Frontend: React + Vite
- Backend: Node.js + Express + MySQL
- Auth: JWT, password hashing with bcrypt

## Running the backend

From the `backend` folder:

1. Install dependencies
   - `npm install`
2. Create a `.env` file with the following variables:
   - `PORT=5000`
   - `DB_HOST=127.0.0.1`
   - `DB_USER=root`
   - `DB_PASSWORD=your_password`
   - `DB_NAME=primetrade_app`
   - `JWT_SECRET=some_long_random_string`
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

## Postman collection

- File: `postman/primeTrade.postman_collection.json`
- Import this collection into Postman.
- Set a `baseUrl` variable in your Postman environment to `http://localhost:5000`.

## Production and scaling notes

If this app were prepared for production:

- **Backend**
  - Behind a reverse proxy such as Nginx.
  - Environment‑specific config for database and JWT secret.
  - Rate limiting and stricter validation on all endpoints.
  - Use connection pooling and proper indexes on the MySQL database.
- **Frontend**
  - Built as static assets with Vite and served from a CDN.
  - Backend URL injected via environment variables at build time.
  - Separate environment files for `development`, `staging`, and `production`.
- **Integration**
  - All API calls go through a small `apiClient` layer (already in place), so base URL, headers, and error handling can be adjusted without touching the rest of the UI.
  - Token handling kept in one place (`authStorage`), making it easier to switch to http‑only cookies if needed.

## Frontend–backend integration for production scaling

The app is designed so that the browser never talks directly to the database. All data access goes through the backend API, which exposes a small, stable surface area.

- The **frontend** only knows about the HTTP API (e.g. `/api/auth/login`, `/api/tasks`). It talks to the backend through a central `apiClient` helper that:
  - Prepends the configured base URL (e.g. `https://api.example.com`).
  - Attaches the JWT token to the `Authorization` header when the user is logged in.
  - Normalises error handling so UI components only deal with success/error states, not low‑level network details.
- The **backend** is a stateless Node.js + Express service that:
  - Validates and authenticates each request using the JWT.
  - Uses a MySQL connection pool for efficient queries under load.
  - Can be scaled horizontally (multiple instances) behind a load balancer, because no user session state is stored in memory.
- In **production**, this allows us to:
  - Deploy multiple backend instances and point the frontend’s base URL at the load balancer.
  - Change the backend host (or move to a new environment) just by updating environment variables, without rebuilding the app logic.
  - Keep security‑sensitive data (database, JWT secret) on the server side only.

See `backend/API.md` for more detailed endpoint information.
