# 🎓 Campus-X — University Service Booking and Management System

A full-stack, production-grade web application built for college campus resource allocation, space reservations, simulated fee payments, and administrative oversight.

---

## 🚀 Tech Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router 7, Tailwind CSS v4, Lucide React, Recharts, React Hot Toast |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | **MongoDB Atlas** using **Mongoose ODM** |
| **Authentication** | JSON Web Tokens (JWT) stored in **secure, httpOnly cookies**, with `bcrypt` password hashing |
| **Security** | Helmet HTTP headers, CORS with credentials, express-rate-limit brute-force protection |
| **Validation** | Client-side validation + Server-side `express-validator` |
| **Testing** | Jest + Supertest automated test suite |

---

## 🏛️ Application Roles & Core Features

### 1. Student / User Features
* **Authentication**: Register with college credentials, log in, view profile, change password, and secure log out.
* **Browse & Search Services**: Real-time search across campus facilities, filter by category (*Library*, *Computer Lab*, *Sports*, *Auditorium*, *Shuttle*, *Equipment*), maximum price, and day of week.
* **Interactive Slot Booking**: View operating hours, duration, capacity, and book available date & time slots with conflict checks.
* **Booking Lifecycle & Status Tracker**: Track reservation state (*Pending*, *Confirmed*, *Completed*, *Cancelled*, *Rejected*).
* **Booking Cancellation**: Cancel pending/confirmed slots with required cancellation reason.
* **DEMO Payment Workflow**: Clearly labeled demo checkout simulating campus student ID cards and university departmental allowances without collecting real card numbers or CVVs.
* **Ratings & Feedback**: Submit 1-to-5 star evaluations and written reviews for completed sessions; dynamically recalculates facility average ratings.

### 2. Administrator Features
* **Executive Dashboard**: Real-time database-derived KPI metrics (Total Students, Total Bookings, Pending Requests, Total Demo Revenue).
* **Interactive Analytics Charts**: Demand breakdown by service category, booking status distribution, and revenue trends over time using Recharts.
* **Service Management**: Create new campus facilities, edit existing details, and toggle active/deactivated status.
* **Booking Oversight & Approvals**: Approve or decline pending student requests (with custom rejection remarks); mark confirmed sessions as completed.
* **Student Directory & History**: Inspect registered student accounts, total bookings count, total demo spend, and session history.
* **Financial Ledger & Feedback Audit**: Paginated tables of campus transaction records and student reviews.

---

## 📋 Required 6 Sample Campus Services
1. **Library Acoustic Study Room** — Category: `Library` | Price: `$0 (Free)` | Capacity: `6` | Duration: `60m`
2. **Advanced Computer Lab Workstation** — Category: `Computer Lab` | Price: `$5` | Capacity: `30` | Duration: `120m`
3. **Indoor Badminton Arena (Court 1)** — Category: `Sports` | Price: `$10` | Capacity: `4` | Duration: `60m`
4. **Srinivasa Ramanujan Grand Auditorium** — Category: `Auditorium` | Price: `$50` | Capacity: `200` | Duration: `180m`
5. **Campus Eco-Express Electric Shuttle** — Category: `Shuttle` | Price: `$2` | Capacity: `30` | Duration: `30m`
6. **Equipment Rental: 4K Laser Projector Suite** — Category: `Equipment` | Price: `$15` | Capacity: `5` | Duration: `240m`

---

## 📦 Project Setup & Installation

### Prerequisites
* **Node.js** (v18, v20, v22, or v24)
* **npm** (v9+)
* A free **MongoDB Atlas** account (or local MongoDB community instance)

### 1. MongoDB Atlas Configuration Guide
1. Log into [MongoDB Cloud Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Security → Database Access**, create a database user (e.g., `campus_admin`) and secure password.
4. Under **Security → Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere** (`0.0.0.0/0`) for development.
5. Under **Deployment → Database**, click **Connect** → **Drivers** (Node.js).
6. Copy the connection string. It will look like:
   ```
   mongodb+srv://campus_admin:<password>@cluster0.abcde.mongodb.net/smartcampus?retryWrites=true&w=majority
   ```
7. Open the `.env` file in the project root and paste your connection string into `MONGODB_URI`.

---

## ⚙️ Environment Variables (`.env`)

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/smartcampus?retryWrites=true&w=majority

# JWT Secret & Expiration
JWT_SECRET=smart_campus_super_secure_jwt_token_secret_key_2026
JWT_EXPIRES_IN=7d

# Server Port & Environment
PORT=5000
NODE_ENV=development

# Client Origin (CORS whitelist)
CLIENT_URL=http://localhost:5173

# Admin Seed Account Credentials
ADMIN_EMAIL=admin@smartcampus.edu
ADMIN_PASSWORD=Admin@123456
```

---

## 🛠️ Step-by-Step Commands (PowerShell)

### Step 1: Install Dependencies
```powershell
# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Seed the Database
Populate the 6 sample campus services, student accounts, and admin account from `.env`:
```powershell
npm run seed
```

### Step 3: Run Automated Test Suite
Executes 11 automated Jest / Supertest test cases verifying health check, registration security, role authorization, and booking validations:
```powershell
npm test
```

### Step 4: Start the Application

#### Option A: Production Integrated Mode (Single Port 5000)
Builds the client and starts the Express server serving both REST API and React UI:
```powershell
npm run build
npm start
```
Open your browser at **[http://localhost:5000](http://localhost:5000)**.

#### Option B: Development Mode (Vite Hot Reload)
In two separate PowerShell terminal tabs:
```powershell
# Tab 1: Start Express backend on :5000
node server/server.js

# Tab 2: Start Vite client on :5173
npm run client
```
Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 🔑 Preset Demo Accounts

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@smartcampus.edu` | `Admin@123456` | Dashboard, approvals, service CRUD, audit ledger |
| **Student (Demo 1)** | `student@campus.edu` | `Student@123` | Space reservations, demo payments, feedback |
| **Student (Demo 2)** | `priya@campus.edu` | `Student@123` | Space reservations, demo payments, feedback |


---

## 📡 REST API Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Public registration (strictly sets `role: 'student'`)
* `POST /api/auth/login` — Verifies bcrypt password, sets httpOnly cookie `token`
* `POST /api/auth/logout` — Clears authentication cookie
* `GET /api/auth/me` — Fetches active user session

### Services (`/api/services`)
* `GET /api/services` — Filterable catalog (category, search, max price, day) with pagination
* `GET /api/services/:id` — Service details and verified feedback
* `POST /api/services` — [Admin] Create new campus service
* `PUT /api/services/:id` — [Admin] Update service specifications
* `PATCH /api/services/:id/toggle` — [Admin] Toggle active/deactivated status

### Bookings (`/api/bookings`)
* `POST /api/bookings` — Create slot reservation (enforces capacity & past date checks)
* `GET /api/bookings/my` — Current user's booking history and status tracking
* `GET /api/bookings/:id` — Single booking details
* `PATCH /api/bookings/:id/cancel` — Cancel booking with reason note

### Demo Payments (`/api/payments`)
* `GET /api/payments/my` — Student transaction history
* `POST /api/payments/:bookingId/pay` — Settle demo booking fee via campus card / wallet

### Feedback (`/api/feedback`)
* `POST /api/feedback` — Submit 1-5 star review for completed session
* `GET /api/feedback/service/:serviceId` — Public reviews for a service
* `GET /api/feedback` — [Admin] Paginated feedback records

### Administration (`/api/admin`)
* `GET /api/admin/dashboard` — KPI cards, Recharts category and status distribution
* `GET /api/admin/users` — Paginated student accounts directory
* `GET /api/admin/users/:id` — Detailed student history dossier
* `GET /api/admin/bookings` — Filterable master bookings table
* `PATCH /api/admin/bookings/:id/status` — Approve/reject/complete bookings
* `GET /api/admin/payments` — Master payment audit ledger
