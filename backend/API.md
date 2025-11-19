# API documentation

Base URL: `http://localhost:5000/api`

All authenticated endpoints expect a header:

- `Authorization: Bearer <token>`

## Auth

### POST /auth/register

Create a new user.

Request body:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123"
}
```

Responses:

- `201 Created` with `{ token, user }` on success.
- `400` if fields are missing or password is too short.
- `409` if email is already registered.

### POST /auth/login

Log in an existing user.

Request body:

```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

Responses:

- `200 OK` with `{ token, user }` on success.
- `400` if fields are missing.
- `401` if credentials are invalid.

## Profile

### GET /profile/me

Get the current user profile.

Headers: `Authorization: Bearer <token>`

Response:

```json
{
  "user": {
    "id": "...",
    "name": "Alice",
    "email": "alice@example.com"
  }
}
```

### PUT /profile/me

Update the current user name.

Request body:

```json
{
  "name": "New name"
}
```

Responses:

- `200 OK` with updated `user`.
- `400` if name is missing.
- `404` if user is not found.

## Tasks

### GET /tasks

Get tasks for the current user.

Query params (optional):

- `status`: `pending` | `in_progress` | `done`
- `search`: free text, matched against title and description

Response:

```json
{
  "tasks": [
    {
      "_id": "...",
      "title": "Example",
      "description": "...",
      "status": "pending",
      "owner": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### POST /tasks

Create a new task.

Request body:

```json
{
  "title": "Implement dashboard",
  "description": "Wire frontend to backend",
  "status": "pending"  // optional, defaults to pending
}
```

Responses:

- `201 Created` with `{ task }`.
- `400` if title is missing.

### PUT /tasks/:id

Update a task that belongs to the current user.

Request body (any field is optional):

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "done"
}
```

Responses:

- `200 OK` with updated `{ task }`.
- `404` if task does not exist or does not belong to the user.

### DELETE /tasks/:id

Delete a task that belongs to the current user.

Responses:

- `200 OK` with `{ message: "Task deleted" }`.
- `404` if task does not exist or does not belong to the user.
