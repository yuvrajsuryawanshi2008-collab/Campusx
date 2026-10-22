# CampusX — Learn • Share • Grow 🎓

> **College Community Academic Resource-Sharing Platform**  
> Built for students, by students. A unified platform for lecture notes, subject roadmaps, university question papers (PYQs), engineering project showcases, peer team formation, and second-hand study material.

---

## 📌 Project Overview

- **Platform Name**: CampusX
- **Tagline**: Learn • Share • Grow
- **Primary Color Branding**: `#4f46e5` (Indigo)
- **Architecture**: Decoupled Modern Client-Server
  - **Frontend**: Responsive Semantic HTML5, Modular CSS3, Modern Vanilla JavaScript (`script.js`).
  - **Backend**: Node.js (`v24.22.0`), Express (`v5.3.0`), CORS, Dotenv, and PostgreSQL client (`pg`).
  - **Database Support**: PostgreSQL / Supabase PostgreSQL with explicit development fallback and RLS security policies.

---

## 🗂️ Project Directory Structure

```text
Campusxwebsite/
├── index.html                   # Main landing page & ecosystem portal
├── notes.html                   # Study notes hub & upload modal
├── roadmap.html                 # 12 Subject roadmaps & curriculum guides
├── pyq.html                     # Previous Year Question papers & syllabus
├── projects.html                # Student engineering project showcase
├── teams.html                   # Peer team & hackathon recruitment
├── material.html                # Second-hand study marketplace
├── career.html                  # 5 Tech career pathways & interview guides
├── pyqs.html                    # Redirection alias to pyq.html
├── raodmap.html                 # Redirection alias to roadmap.html
├── style.css                    # Design system & responsive styles
├── script.js                    # Client logic & centralized API client
├── package.json                 # Root npm scripts (start, dev, test)
├── start-campusx.bat            # One-click Windows desktop launcher
├── .gitignore                   # Excludes node_modules, .env, and OS artifacts
├── Sem3 Study Material/         # Genuine university syllabus, notes & practicals
└── backend/                     # Node.js + Express API server
    ├── server.js                # Express REST API routes & middleware
    ├── db.js                    # DB layer (PostgreSQL / Supabase + fallback diagnostics)
    ├── auth.js                  # PBKDF2 salt hashing & JWT token verification
    ├── schema.sql               # PostgreSQL / Supabase migration schema
    ├── rls.sql                  # Supabase Row Level Security (RLS) policy definitions
    ├── test-api.js              # Comprehensive automated verification suite (19 tests)
    ├── package.json             # Backend dependencies & npm scripts
    ├── .env                     # Local environment variables
    └── .env.example             # Environment template
```

---

## ⚡ Quickstart Guide (Windows PowerShell)

Because PowerShell blocks `.ps1` scripts by default on some Windows systems, **always use `npm.cmd` and `npx.cmd`** in PowerShell.

### 1. One-Click Launcher (Easiest)
Simply double-click **`start-campusx.bat`** in Windows Explorer. It starts the backend on port 3000 and opens the website in your default browser.

### 2. Manual PowerShell Startup
Open PowerShell in the project root:

```powershell
# Install backend dependencies (if needed)
cd backend
npm.cmd install
cd ..

# Start the Express Backend API
npm.cmd start

# (Or for development with automatic live reload)
npm.cmd run dev
```

The server will output:
```text
🚀 CampusX backend running at http://localhost:3000
```

### 3. Run the Automated Verification Suite
In the root directory or in `backend/`:

```powershell
npm.cmd test
```

All 19 API assertions will execute and report storage mode diagnostics.

### 4. Open the Frontend
- **VS Code Live Server (Recommended)**: Right-click `index.html` or `notes.html` and select **"Open with Live Server"** (runs on `http://127.0.0.1:5500`).
- **Or Node HTTP Server**:
  ```powershell
  npx.cmd serve . -p 5500
  ```
- **Or Direct File Inspection**: Double-click `index.html` in any web browser.

---

## 🔌 API Endpoints Reference

The backend operates on `http://localhost:3000`:

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root verification route | `200 OK` ("CampusX Backend is Running!") |
| `GET` | `/api/status` | API status, environment & database telemetry | `200 OK` |
| `GET` | `/api/health` | Uptime, RAM usage, and connection health | `200 OK` / `503` |
| `GET` | `/api/notes` | Returns study notes (preserves 3 sample notes) | `200 OK` |
| `POST` | `/api/notes` | Upload note `{ title, subject, unit, sem, ... }` | `201 Created` |
| `GET` | `/api/projects` | Returns project showcase directory | `200 OK` |
| `POST` | `/api/projects` | Post an engineering project | `201 Created` |
| `GET` | `/api/teams` | Returns peer team recruitments | `200 OK` |
| `POST` | `/api/teams` | Post a new team opening | `201 Created` |
| `GET` | `/api/materials` | Returns study marketplace listings | `200 OK` |
| `POST` | `/api/materials` | Post a study material / textbook listing | `201 Created` |
| `POST` | `/api/auth/register` | Register student profile (PBKDF2 salted hash) | `201 Created` |
| `POST` | `/api/auth/login` | Authenticate with email & password | `200 OK` |
| `GET` | `/api/auth/me` | Protected route (Requires `Authorization: Bearer <token>`) | `200 OK` / `401` |

---

## 🗄️ Supabase PostgreSQL Integration Guide

CampusX includes a PostgreSQL database layer with zero hard dependencies:

- **When `DATABASE_URL` is empty**: Operates in explicit ephemeral development mode with clear console warnings.
- **When `DATABASE_URL` is configured**: Connects to the PostgreSQL pool (`pg.Pool`), executing persistent parameterized SQL queries.

### Connecting Your Supabase Project:

1. Open your project on [supabase.com](https://supabase.com).
2. Go to **Project Settings** → **Database** → **Connection String**.
3. **Select Connection Pooler (Session mode, port 5432)**:
   > 💡 **Tip for Windows**: The Supabase Session Pooler URL uses IPv4 (`aws-0-[region].pooler.supabase.com`), which avoids IPv6 connectivity timeouts common on standard Windows networks.
4. Copy the connection string into `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
   ```
5. In Supabase **SQL Editor**, execute `backend/schema.sql` (if not done yet) to create the tables.
6. In Supabase **SQL Editor**, execute `backend/rls.sql` to enable Row Level Security (RLS) on all tables.
7. Restart the backend (`npm.cmd start`). The terminal will log:
   ```text
   🔌 [CampusX DB] DATABASE_URL detected. Connecting to PostgreSQL...
   ✅ [CampusX DB] Connected successfully to PostgreSQL database.
   🔒 [CampusX DB] Persistent SQL storage is active.
   ```

---

## 🛡️ Database Security & Row Level Security (RLS)

If Supabase displays your tables as "Unrestricted", execute [`backend/rls.sql`](file:///C:/Users/Yuvraj/OneDrive/Desktop/Campusxwebsite/backend/rls.sql) in your Supabase SQL Editor:
- **`users` table**: RLS enabled. PostgREST public access is completely denied. Only the backend database connection can read/write users.
- **`notes`, `projects`, `teams`, `materials` tables**: RLS enabled. Public users can read approved academic resources. Inserts are restricted to authenticated users and the backend service role.

---

## 🔐 Authentication Architecture

- **Client Session**: Lightweight student profile stored in localStorage for fast UI rendering.
- **Server API**: Cryptographic PBKDF2 salt hashing (`crypto.pbkdf2Sync`) with 10,000 iterations and unique random salts. Plaintext passwords are never stored.
- **JWT Protection**: Signed tokens with 7-day expiration protect authenticated routes (`/api/auth/me`).

---

## 🚀 Production Deployment Checklist

1. **Static Frontend**:
   - Deploy root static files (`index.html`, `style.css`, `script.js`, `Sem3 Study Material/`) to **Vercel** or **Netlify**.
   - Set `window.CAMPUSX_API_URL = 'https://your-backend.onrender.com'` before deploying.

2. **Backend API**:
   - Deploy `backend/` to **Render.com** (Web Service), **Railway**, or **Fly.io**.
   - Add environment variables in provider dashboard:
     - `PORT=10000`
     - `NODE_ENV=production`
     - `CORS_ORIGIN=https://your-frontend.vercel.app`
     - `DATABASE_URL=your_supabase_pooler_connection_string`
     - `JWT_SECRET=your_production_random_secret`

---

## 🛠️ Windows Troubleshooting FAQ

- **PowerShell blocks `npm`**: Run `npm.cmd` instead of `npm`.
- **Port 3000 already in use**:
  ```powershell
  Get-NetTCPConnection -LocalPort 3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  ```
- **Supabase connection timeout**: Use the **Session Pooler** connection string (`pooler.supabase.com` on port 5432) instead of direct connection (`db.xxxx.supabase.co`).

---

© 2026 CampusX — Learn • Share • Grow. Built for the college engineering community.
