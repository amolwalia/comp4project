# Wishlist Orb MVP

Full-stack wishlist web app with React, Express, PostgreSQL, cookie-based JWT authentication, and a premium orb-style visualization for each user's private wishlist.

## Stack

- Frontend: React + Vite + plain JavaScript + CSS
- Backend: Node.js + Express
- Database: PostgreSQL
- Auth: JWT stored in an HTTP-only cookie

## Project Structure

```text
.
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   └── services
├── server
│   ├── controllers
│   ├── db
│   │   └── sql
│   ├── middleware
│   ├── repositories
│   ├── routes
│   ├── services
│   └── utils
└── package.json
```

## Features

- Sign up, log in, session restore, and log out
- Password hashing with `bcrypt`
- Protected wishlist CRUD scoped to the authenticated user only
- Parameterized PostgreSQL queries through `pg`
- Wishlist orb visualization with slow floating motion and drag interaction
- Stats for total item count and total wishlist value
- Future-ready schema for visibility, sharing, and friendships

## Local Setup

### 1. Create the PostgreSQL database

Using pgAdmin4 or `psql`, create a database named `wishlist_orb`.

### 2. Run the schema

Run the SQL file below against your database:

`server/db/sql/schema.sql`

That creates:

- `users`
- `wishlist_settings`
- `wishlist_items`
- `friendships`
- `wishlist_shares`

Only `users`, `wishlist_settings`, and `wishlist_items` are used by the MVP. The other tables are included to support later social features without a rewrite.

### 3. Configure environment variables

Server:

1. Copy `server/.env.example` to `server/.env`
2. Update `DATABASE_URL` and `JWT_SECRET`

Client:

1. Copy `client/.env.example` to `client/.env`
2. Keep `VITE_API_URL=http://localhost:4000/api` unless you change the server port

### 4. Install dependencies

At the project root:

```bash
npm install
```

Then install server and client dependencies:

```bash
cd server && npm install
cd ../client && npm install
```

### 5. Start the app

From the project root:

```bash
npm run dev
```

That starts:

- React app on `http://localhost:5173`
- Express API on `http://localhost:4000`

## API Overview

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Wishlist

- `GET /api/wishlist`
- `POST /api/wishlist`
- `PUT /api/wishlist/:id`
- `DELETE /api/wishlist/:id`

All wishlist routes require authentication and always filter by the current `user_id`.

## MVP Notes

- Wishlist privacy is private by default.
- The current UI only renders the logged-in user's own orb.
- The schema already includes hooks for:
  - visibility settings
  - direct shares
  - share links
  - friend/follow relationships

## Future Extension Path

The codebase is organized so you can add social features without changing the core ownership model:

- Add route-level authorization rules on top of `wishlist_settings`
- Add read-only friend orb endpoints
- Add share-token endpoints using `wishlist_shares`
- Add friendship request and acceptance flows using `friendships`

## Development Notes

- The frontend uses `fetch` with `credentials: include` so the auth cookie is sent automatically.
- The backend enables CORS for the configured client URL and sets an HTTP-only cookie for the JWT.
- The orb visualization is implemented with plain React state, CSS 3D transforms, and Fibonacci sphere distribution for item layout.
