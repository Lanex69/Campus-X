# 🚀 Production Deployment Guide

This guide covers deploying the **Smart Campus Service Booking and Management System** to production hosting.

---

## 🏗️ Architecture Overview

The application is architected as an **all-in-one full-stack service**:
- The **Node.js Express** backend serves the JSON REST API on `/api/*`.
- Express automatically serves the pre-built **React Vite SPA** (`client/dist`) for all web requests (`/*`).
- **Single-port, single-service**: Zero CORS complications, simplified domain routing, and minimal hosting costs.

---

## 🔑 Required Production Environment Variables

Configure these variables in your hosting provider's dashboard (e.g., Render, Railway, Heroku):

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Application environment | `production` |
| `PORT` | Web port bound by host | `5000` (or host provided default) |
| `MONGODB_URI` | Cloud database connection string | `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/smartcampus?retryWrites=true&w=majority` |
| `JWT_SECRET` | 64+ char random secret key | A secure random string (Render can auto-generate) |
| `JWT_EXPIRES_IN` | Token duration | `7d` |
| `CLIENT_URL` | Public HTTPS URL of the service | `https://smart-campus.onrender.com` |
| `ADMIN_EMAIL` | Initial admin account email | `admin@smartcampus.edu` |
| `ADMIN_PASSWORD` | Initial admin account password | `Admin@123456` |

---

## ☁️ Deployment Option 1: Render.com (Recommended - Zero Cost)

Render provides free hosting for web services and natively supports the repository structure.

1. **Push your code to GitHub / GitLab**.
2. Go to **[dashboard.render.com](https://dashboard.render.com)** and click **New → Blueprint** (or **New → Web Service**).
3. Connect your repository.
4. If using **Blueprint**, Render automatically reads `render.yaml`.
5. If creating manually as **Web Service**:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
6. In **Environment Variables**, set your `MONGODB_URI` pointing to your MongoDB Atlas cluster.
7. Click **Deploy**. The server will automatically build the React app, connect to MongoDB Atlas, and auto-seed initial services if empty.

---

## 🚂 Deployment Option 2: Railway.app

1. Go to **[railway.app](https://railway.app)** and click **New Project → Deploy from GitHub repo**.
2. Select your repository.
3. Railway detects the `Dockerfile` automatically (or Node.js buildpack).
4. Under **Variables**, add:
   - `NODE_ENV=production`
   - `MONGODB_URI=<your-atlas-uri>`
   - `JWT_SECRET=<secure-random-key>`
   - `PORT=5000`
5. Under **Settings → Networking**, click **Generate Domain**.

---

## 🐳 Deployment Option 3: Docker Container

To run or deploy using Docker locally or on a VPS (AWS EC2, DigitalOcean Droplet, Linode):

1. **Build the container image**:
   ```bash
   docker build -t smart-campus-system:latest .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     -p 5000:5000 \
     --name smart-campus \
     -e NODE_ENV=production \
     -e MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/smartcampus?retryWrites=true&w=majority" \
     -e JWT_SECRET="your_long_random_production_secret" \
     smart-campus-system:latest
   ```

3. **Verify running status**:
   ```bash
   docker ps
   curl http://localhost:5000/api/health
   ```

---

## 🛡️ Production Hardening Checklist

- [x] **Reverse Proxy Trust**: `app.set('trust proxy', 1)` enabled for secure HTTPS cookies behind load balancers.
- [x] **Security Headers**: Helmet with Cross-Origin Resource Policy configured for external CDN/Unsplash photography.
- [x] **Static Caching**: 1-day client asset caching with `no-cache` on `index.html` for instant deployment updates.
- [x] **Graceful Shutdown**: `SIGTERM` / `SIGINT` signals captured to cleanly close database connections without dropping in-flight requests.
- [x] **Database Fail-Safe**: `ensureDB` middleware prevents driver crashes if database connectivity drops.
- [x] **Secrets Isolation**: `.env` and `server/.env` excluded from version control via `.gitignore` and `.dockerignore`.
