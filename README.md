# Wishlist App ✨

A full-stack wishlist application built with React, Vite, Express, and PostgreSQL. Users can create an account, log in securely, manage wishlist items, and explore them through a mood board style dashboard with item previews, stats, and theme switching.

Live app: https://wishlist-orb-client.onrender.com/ 🚀

## Current Experience 🎨

- Account signup, login, session restore, and logout
- Private wishlist CRUD for each authenticated user
- Dashboard with total item count and total wishlist value
- Mood board style wishlist wall with hover-based item preview
- Detail card with image, price, and product link
- Light and dark theme toggle
- Responsive auth flow and dashboard layout

## Tech Stack 🛠️

- Frontend: React 18, Vite, CSS, Framer Motion
- Backend: Node.js, Express
- Database: PostgreSQL
- Authentication: JWT stored in an HTTP-only cookie
- Deployment: Render Blueprint via [`render.yaml`]

## Project Structure 📁

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
│   ├── scripts
│   ├── services
│   └── utils
├── render.yaml
└── package.json
```

## Running Locally 💻

### 1. Create the database 🗄️

Create a PostgreSQL database named `wishlist_orb`.

### 2. Install dependencies 📦

From the project root:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Configure environment files ⚙️

Server:

```bash
cp server/.env.example server/.env
```

Update [`server/.env.example`] values as needed, especially:

- `DATABASE_URL`
- `JWT_SECRET`
- `CLIENT_URL`

Client:

```bash
cp client/.env.example client/.env
```

Default client env:

```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Initialize the database schema 🧱

Run:

```bash
cd server
npm run db:init
```

This applies [`server/db/sql/schema.sql`].

### 5. Start the app ▶️

From the project root:

```bash
npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## API Overview 🔌

### Auth 🔐

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Wishlist 📝

- `GET /api/wishlist`
- `POST /api/wishlist`
- `PUT /api/wishlist/:id`
- `DELETE /api/wishlist/:id`

## Team Contributions 🤝

Based on the current git history:

- Amol Walia
  - Built the initial full-stack app structure
  - Implemented authentication, wishlist CRUD, PostgreSQL integration, and the base responsive UI
  - Added Render deployment support, schema bootstrap script, environment setup, and deployment documentation
  - Updated app titles and core naming in the interface

- Viktoriia Monakova
  - Reworked the mood board UI and animations
  - Updated [`FloatingWishlistBoard.jsx`], dashboard layout behavior, and styling
  - Improved inventory panel behavior and related frontend presentation

- Donald Wong
  - Reworked the front page
  - Added dark mode support
  - Implemented the theme toggle and related theme context updates
  - Contributed dashboard and global styling changes tied to the new theme system

## Deployment ☁️

This repo includes a Render Blueprint in [`render.yaml`] for:

- `wishlist-orb-client`
- `wishlist-orb-api`
- `wishlist-orb-db`

The deployed frontend is available here 🌐:

https://wishlist-orb-client.onrender.com/
