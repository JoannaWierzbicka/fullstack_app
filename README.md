# MyResCal

MyResCal is a full-stack reservation manager for property owners. It combines a Supabase-backed API with a responsive React front-end so you can create, edit and visualise bookings in a room-aware calendar.

---

### Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Project Structure](#project-structure)  
4. [Prerequisites](#prerequisites)  
5. [Environment Variables](#environment-variables)  
6. [Installation](#installation)  
7. [Running the project](#running-the-project)  
8. [Supabase setup](#supabase-setup)  
9. [Usage guide](#usage-guide)  
10. [Available scripts](#available-scripts)

---

### Features

- 🔐 Email/password authentication via Supabase Auth.
- 🏨 Multi-property support with arbitrary rooms per property.
- 📅 Reservation lifecycle: create, edit, delete with automatic validation.
- 🖥️ Desktop timeline view (rooms as rows) and 📱 mobile/tablet monthly view with room selector.
- 🚫 Smart guards: prevent back-dated bookings, ensure user owns property/room.
- 🔁 Automatic logout when session tokens expire.
- 🧱 REST API protected with row-level security (Supabase policies).

---

### Tech Stack

**Front-end**
- React 19 + Vite
- React Router
- Material UI
- date-fns

**Back-end**
- Node.js + Express
- Supabase (PostgreSQL, Auth, Storage of reservations)
- CORS, dotenv

**Tooling**
- ESLint  
- npm scripts

---

### Project Structure

```
.
├── client/              # React application (Vite)
│   ├── src/
│   │   ├── api/         # REST API clients
│   │   ├── components/  # UI components (calendar, forms, dashboard)
│   │   ├── context/     # Authentication context + storage helpers
│   │   ├── router/      # React Router configuration
│   │   └── theme/       # MUI theme overrides
│   └── package.json
├── server/              # Express API
│   ├── routes/          # reservations, rooms, properties
│   ├── validators/      # payload validation helpers
│   ├── middleware/      # error handling
│   ├── utils/           # async handler, HttpError helper
│   ├── auth/            # Supabase client + auth routes
│   ├── supabase/        # SQL scripts + setup README
│   └── package.json
└── README.md
```

---

### Prerequisites

- Node.js 20+ and npm  
- Supabase project (URL + service-role key)  
- Access to create SQL policies in Supabase

---

### Environment Variables

Create `server/.env`:

```
SUPABASE_URL=<your_supabase_url>
SUPABASE_KEY=<your_supabase_service_role_key>
CLIENT_ORIGIN=http://localhost:5173
PORT=3000               # optional
```

Optional `client/.env` (only needed if the API is hosted elsewhere):

```
VITE_API_BASE_URL=/api  # default proxy path
```

---

### Installation

```bash
# clone repository
git clone <repo-url>
cd <repo-folder>

# install server deps
cd server
npm install

# install client deps
cd ../client
npm install
```

---

### Running the project

#### 1. Start the Express API

```bash
cd server
npm run dev        # nodemon
# or npm start     # vanilla node
```

The API listens on `http://localhost:3000` by default.

#### 2. Start the React app

```bash
cd client
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api` to the Express server.

---

### Supabase setup

Supabase provides both authentication and persistence. Run the SQL migrations described in [`server/supabase/README.md`](server/supabase/README.md). The scripts:

1. Add `owner_id` to the `reservations` table, enable row-level security and create access policy.
2. Create `properties` and `rooms` tables with indexes and policies.
3. Optionally drop/relax the legacy `room` column on `reservations`.

Execute each SQL block once per environment, then create at least one property + room so you can add reservations.

---

### Usage guide

1. **Register / Sign in** – auth is required to access `/dashboard`.  
2. **Settings** – define properties and rooms. Without rooms you cannot add bookings.  
3. **Dashboard**  
   - Desktop: see all rooms in a timeline; click a date block to edit or add.  
   - Mobile/tablet: monthly grid with a room selector. Tap a future day to create a booking (minimum 1 night).  
   - List of reservation cards sits below the calendar for quick navigation.
4. **Auto logout** – when Supabase signals expired tokens the app clears session storage and redirects to login.

---

### Available scripts

**Server**
```
npm run dev      # start with nodemon
npm start        # start with node
```

**Client**
```
npm run dev      # Vite dev server
npm run build    # production build
npm run preview  # preview build locally
npm run lint     # run ESLint
```

---

Built with ♥ to keep your bookings organised — welcome to **MyResCal**!
