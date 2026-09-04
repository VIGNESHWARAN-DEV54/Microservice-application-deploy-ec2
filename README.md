# ShopHub - MERN Microservices E-Commerce Application

A full-stack e-commerce platform built with MongoDB, Express.js, React, and Node.js using a microservices architecture. Every service is completely self-contained with its own database connection, auth middleware, and package dependencies.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Directory Structure](#project-directory-structure)
3. [Prerequisites & Where to Install Node/npm](#prerequisites--where-to-install-nodenpm)
4. [Where to Run npm install (All 7 Locations)](#where-to-run-npm-install-all-7-locations)
5. [One-Time Setup](#one-time-setup)
6. [How to Run: All Services Together](#how-to-run-all-services-together)
7. [How to Run: Every Service Individually](#how-to-run-every-service-individually)
   - [API Gateway (Port 5000)](#1-api-gateway-service)
   - [Auth Service (Port 5001)](#2-auth-service)
   - [Products Service (Port 5002)](#3-products-service)
   - [Users Service (Port 5003)](#4-users-service)
   - [Orders Service (Port 5004)](#5-orders-service)
   - [React Frontend Client (Port 3000)](#6-react-frontend-client)
8. [Database Seeder & Test Accounts](#database-seeder--test-accounts)
9. [API Route Reference](#api-route-reference)
10. [Environment Variables Reference](#environment-variables-reference)
11. [Troubleshooting & Common Issues](#troubleshooting--common-issues)

---

## Architecture Overview

```
[ Browser / User ]
       |
       v
[ React Frontend Client ] (Port 3000)
       |
       |  HTTP API Requests
       v
[ API Gateway / Reverse Proxy ] (Port 5000)
       |
       +-------------------+-------------------+-------------------+
       |                   |                   |                   |
       v                   v                   v                   v
[ Auth Service ]   [ Products Service ] [ Users Service ]   [ Orders Service ]
   Port 5001           Port 5002           Port 5003           Port 5004
       |                   |                   |                   |
       v                   v                   v                   v
 MongoDB Database:   MongoDB Database:   MongoDB Database:   MongoDB Database:
  ecommerce_auth    ecommerce_products    ecommerce_users    ecommerce_orders
```

---

## Project Directory Structure

```
Project_2/
+-- client/                        # React Frontend (Create React App)
|   +-- public/                    # Static assets & index.html
|   +-- src/
|   |   +-- components/            # Header, Footer, ProductCard, etc.
|   |   +-- pages/                 # Home, Products, Cart, Checkout, etc.
|   |   +-- redux/                 # Redux Toolkit store and slices
|   |   +-- services/api.js        # Axios instance configured for API Gateway
|   |   +-- setupProxy.js          # Development proxy pointing to Gateway (5000)
|   +-- .env                       # Frontend environment variables
|   +-- package.json               # (Location 7 for npm install)
|
+-- server/
|   +-- gateway/                   # API Gateway (reverse proxy)
|   |   +-- server.js              # Express app + http-proxy-middleware
|   |   +-- .env                   # Route definitions and port
|   |   +-- package.json           # (Location 2 for npm install)
|   |
|   +-- services/
|       +-- auth/                  # Authentication Microservice (Self-contained)
|       |   +-- config/db.js       # Local MongoDB connection
|       |   +-- middleware/        # Local JWT authentication middleware
|       |   +-- controllers/       # Auth business logic
|       |   +-- models/            # User schema for auth credentials
|       |   +-- routes/            # /api/auth routes
|       |   +-- server.js
|       |   +-- .env
|       |   +-- package.json       # (Location 3 for npm install)
|       |
|       +-- products/              # Products Catalog Microservice (Self-contained)
|       |   +-- config/db.js       # Local MongoDB connection
|       |   +-- middleware/        # Local JWT authentication middleware
|       |   +-- controllers/       # Product business logic & reviews
|       |   +-- models/            # Product schema
|       |   +-- routes/            # /api/products routes
|       |   +-- seed.js            # Initial data seeder (products + users)
|       |   +-- server.js
|       |   +-- .env
|       |   +-- package.json       # (Location 4 for npm install)
|       |
|       +-- users/                 # Users, Cart & Wishlist Microservice (Self-contained)
|       |   +-- config/db.js       # Local MongoDB connection
|       |   +-- middleware/        # Local JWT authentication middleware
|       |   +-- controllers/       # User profiles, cart operations, wishlist
|       |   +-- models/            # User profile, Cart, and Wishlist schemas
|       |   +-- routes/            # /api/users and /api/cart routes
|       |   +-- server.js
|       |   +-- .env
|       |   +-- package.json       # (Location 5 for npm install)
|       |
|       +-- orders/                # Orders & Checkout Microservice (Self-contained)
|           +-- config/db.js       # Local MongoDB connection
|           +-- middleware/        # Local JWT authentication middleware
|           +-- controllers/       # Order creation, payments, history
|           +-- models/            # Order schema
|           +-- routes/            # /api/orders routes
|           +-- server.js
|           +-- .env
|           +-- package.json       # (Location 6 for npm install)
|
+-- run-all.js                     # Node orchestrator to start all services
+-- package.json                   # (Location 1 for npm install - Root scripts)
+-- HOW_TO_RUN.md                  # Quick step-by-step per-service run guide
+-- README.md
```

---

## Prerequisites & Where to Install Node/npm

Before running this project, you need **Node.js**, **npm**, and **MongoDB** installed on your computer.

### 1. Where to download and install Node.js & npm
- **Official Website:** https://nodejs.org/
- **Recommended version:** Download the **LTS (Long Term Support)** version.
- **Note:** Installing Node.js automatically installs `npm` on your system.
- **Verify installation in terminal:**
  ```bash
  node -v   # Should show v16.0.0 or higher
  npm -v    # Should show v8.0.0 or higher
  ```

### 2. Where to download and install MongoDB
- **Official Website:** https://www.mongodb.com/try/download/community
- **Verify or start MongoDB on Windows:**
  ```powershell
  # Start MongoDB Windows service:
  net start MongoDB

  # Or run manually from command line:
  mongod
  ```

---

## Where to Run npm install (All 7 Locations)

Because this is a microservices architecture, each service is its own completely independent Node project with its own `package.json` file.

There are **7 locations** where dependencies can be installed:

| # | Service / Module | Directory Path | Command to Run |
|---|---|---|---|
| 1 | **Project Root** | `Project_2/` | `npm install` |
| 2 | **API Gateway** | `Project_2/server/gateway/` | `cd server/gateway && npm install` |
| 3 | **Auth Service** | `Project_2/server/services/auth/` | `cd server/services/auth && npm install` |
| 4 | **Products Service** | `Project_2/server/services/products/` | `cd server/services/products && npm install` |
| 5 | **Users Service** | `Project_2/server/services/users/` | `cd server/services/users && npm install` |
| 6 | **Orders Service** | `Project_2/server/services/orders/` | `cd server/services/orders && npm install` |
| 7 | **React Frontend** | `Project_2/client/` | `cd client && npm install` |

> **TIP:** You do **not** have to install them one by one manually! Run `npm run install-all` from the root folder once, and it will install all 7 automatically.

---

## One-Time Setup

Run these commands from the root directory `Project_2/` before running any service for the first time:

### Step 1: Install all dependencies across all services

```bash
npm run install-all
```

This single automated command runs `npm install` in every directory listed in the table above.

### Step 2: Ensure MongoDB is running

```bash
# Windows command prompt / PowerShell (run as Administrator if needed):
net start MongoDB
```

### Step 3: Seed sample data into the database

```bash
npm run seed
```

This populates:
- 8 sample products in `ecommerce_products`
- 1 standard user account and 1 administrator account in `ecommerce_auth`

---

## How to Run: All Services Together

You have two convenient options to run everything with a single command from the root `Project_2/` directory:

### Option A: Run ALL 6 services (Backend + Frontend)

```bash
npm run start:all
```

*What happens:*
- Runs `run-all.js`
- Spawns API Gateway, Auth, Products, Users, Orders, and the React Client
- All logs are streamed to your terminal with color-coded service prefixes
- Press `Ctrl + C` once to gracefully shut down all services

### Option B: Run Backend Only (5 services without Frontend)

```bash
npm run start:backend
```

Useful if you want to test API endpoints using Postman / cURL, or if you prefer running the React client in a separate terminal.

---

## How to Run: Every Service Individually

If you prefer to run each service in its own terminal window for focused debugging, follow the guides below.

---

### 1. API Gateway Service

- **Directory:** `server/gateway/`
- **Port:** `5000`
- **Role:** The single entry point for all frontend requests. It routes calls to the appropriate microservice based on URL prefix.

**Where to install npm:**
```bash
cd server/gateway
npm install
```

**Environment Variables (`server/gateway/.env`):**
```env
PORT=5000
AUTH_SERVICE_URL=http://localhost:5001
PRODUCTS_SERVICE_URL=http://localhost:5002
USERS_SERVICE_URL=http://localhost:5003
ORDERS_SERVICE_URL=http://localhost:5004
NODE_ENV=development
```

**How to Run:**
```bash
# Method 1: From project root
npm run gateway

# Method 2: From service directory
cd server/gateway
npm run dev      # Runs with nodemon (auto-reload on save)
# OR
npm start        # Runs with standard node
```

**Health Check:**
```
GET http://localhost:5000/health
Response: { "status": "API Gateway is running", "timestamp": "..." }
```

---

### 2. Auth Service

- **Directory:** `server/services/auth/`
- **Port:** `5001`
- **Database:** `mongodb://localhost:27017/ecommerce_auth`
- **Role:** Handles user registration, authentication, password hashing (bcrypt), and JWT issuance.

**Where to install npm:**
```bash
cd server/services/auth
npm install
```

**Environment Variables (`server/services/auth/.env`):**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**How to Run:**
```bash
# Method 1: From project root
npm run auth

# Method 2: From service directory
cd server/services/auth
npm run dev      # Runs with nodemon
# OR
npm start        # Runs with standard node
```

**Health Check:**
```
GET http://localhost:5001/health
Response: { "status": "Auth service is running" }
```

**Key Endpoints:**
- `POST http://localhost:5001/api/auth/register`
- `POST http://localhost:5001/api/auth/login`
- `GET  http://localhost:5001/api/auth/me` (requires Bearer token)

---

### 3. Products Service

- **Directory:** `server/services/products/`
- **Port:** `5002`
- **Database:** `mongodb://localhost:27017/ecommerce_products`
- **Role:** Manages product catalog, inventory status, search, category filters, and product reviews.

**Where to install npm:**
```bash
cd server/services/products
npm install
```

**Environment Variables (`server/services/products/.env`):**
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**How to Run:**
```bash
# Method 1: From project root
npm run products

# Method 2: From service directory
cd server/services/products
npm run dev      # Runs with nodemon
# OR
npm start        # Runs with standard node
```

**Seed Database (from products directory):**
```bash
cd server/services/products
node seed.js
```

**Health Check:**
```
GET http://localhost:5002/health
Response: { "status": "Products service is running" }
```

**Key Endpoints:**
- `GET    http://localhost:5002/api/products`
- `GET    http://localhost:5002/api/products/featured`
- `GET    http://localhost:5002/api/products/:id`
- `POST   http://localhost:5002/api/products` (Admin only)
- `POST   http://localhost:5002/api/products/:id/reviews` (Logged-in user)

---

### 4. Users Service

- **Directory:** `server/services/users/`
- **Port:** `5003`
- **Database:** `mongodb://localhost:27017/ecommerce_users`
- **Role:** Handles user profile management, shopping cart state, and user wishlist items.

**Where to install npm:**
```bash
cd server/services/users
npm install
```

**Environment Variables (`server/services/users/.env`):**
```env
PORT=5003
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**How to Run:**
```bash
# Method 1: From project root
npm run users

# Method 2: From service directory
cd server/services/users
npm run dev      # Runs with nodemon
# OR
npm start        # Runs with standard node
```

**Health Check:**
```
GET http://localhost:5003/health
Response: { "status": "Users service is running" }
```

**Key Endpoints:**
- `GET    http://localhost:5003/api/cart`
- `POST   http://localhost:5003/api/cart`
- `PUT    http://localhost:5003/api/cart/:itemId`
- `DELETE http://localhost:5003/api/cart/:itemId`
- `GET    http://localhost:5003/api/users/profile`
- `PUT    http://localhost:5003/api/users/profile`
- `GET    http://localhost:5003/api/users/wishlist`

---

### 5. Orders Service

- **Directory:** `server/services/orders/`
- **Port:** `5004`
- **Database:** `mongodb://localhost:27017/ecommerce_orders`
- **Role:** Processes checkout orders, tracks order payment status, delivery status, and order history.

**Where to install npm:**
```bash
cd server/services/orders
npm install
```

**Environment Variables (`server/services/orders/.env`):**
```env
PORT=5004
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**How to Run:**
```bash
# Method 1: From project root
npm run orders

# Method 2: From service directory
cd server/services/orders
npm run dev      # Runs with nodemon
# OR
npm start        # Runs with standard node
```

**Health Check:**
```
GET http://localhost:5004/health
Response: { "status": "Orders service is running" }
```

**Key Endpoints:**
- `POST   http://localhost:5004/api/orders` (Place order)
- `GET    http://localhost:5004/api/orders/myorders` (User orders)
- `GET    http://localhost:5004/api/orders/:id` (Order detail)
- `GET    http://localhost:5004/api/orders` (Admin list all)
- `PUT    http://localhost:5004/api/orders/:id/pay` (Simulate payment)

---

### 6. React Frontend Client

- **Directory:** `client/`
- **Port:** `3000`
- **Role:** Web UI built with React 18, Redux Toolkit, and React Router v6.

**Where to install npm:**
```bash
cd client
npm install
```

**Environment Variables (`client/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000/api
BROWSER=none
```

**How to Run:**
```bash
# Method 1: From project root
npm run client

# Method 2: From client directory
cd client
npm start
```

Once running, access the web store in your browser at:
`http://localhost:3000`

---

## Database Seeder & Test Accounts

Run the database seed script to populate products and accounts:

```bash
npm run seed
```

### Pre-configured Accounts

| Role          | Email               | Password  | Permissions                   |
|---------------|---------------------|-----------|-------------------------------|
| Regular User  | demo@shophub.com    | user123   | Browse, Cart, Order, Reviews  |
| Administrator | admin@shophub.com   | admin123  | Manage Products, View Orders  |

---

## API Route Reference

When making API calls from outside (e.g. Frontend or Postman), send all requests to the **API Gateway on port 5000**. The Gateway will route them automatically:

| Gateway Route Pattern       | Target Service   | Port | Description                       |
|-----------------------------|------------------|------|-----------------------------------|
| `/api/auth/*`               | Auth Service     | 5001 | Authentication & Registration     |
| `/api/products/*`           | Products Service | 5002 | Catalog, Search, Categories       |
| `/api/cart/*`               | Users Service    | 5003 | Cart persistence per user         |
| `/api/users/*`              | Users Service    | 5003 | User profile & wishlist           |
| `/api/orders/*`             | Orders Service   | 5004 | Order creation, payment, tracking |

### Authentication Header Format
Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token_here>
```

---

## Environment Variables Reference

All required `.env` files are already included in the repository.

| Service       | Location                     | Key Settings                                              |
|---------------|------------------------------|-----------------------------------------------------------|
| API Gateway   | `server/gateway/.env`        | `PORT=5000`, downstream URLs for ports 5001 to 5004       |
| Auth          | `server/services/auth/.env`  | `PORT=5001`, `MONGODB_URI=mongodb://localhost:27017`     |
| Products      | `server/services/products/.env` | `PORT=5002`, `MONGODB_URI=mongodb://localhost:27017`  |
| Users         | `server/services/users/.env` | `PORT=5003`, `MONGODB_URI=mongodb://localhost:27017`     |
| Orders        | `server/services/orders/.env`| `PORT=5004`, `MONGODB_URI=mongodb://localhost:27017`     |
| Client        | `client/.env`                | `REACT_APP_API_URL=http://localhost:5000/api`            |

---

## Troubleshooting & Common Issues

### 1. Port Already in Use (`EADDRINUSE`)
If a service fails to start because a port (3000, 5000-5004) is already bound:
```powershell
# In Windows PowerShell, find what process is using the port (e.g., 5000):
netstat -ano | findstr :5000

# Kill the process by PID:
taskkill /PID <PID_NUMBER> /F
```

### 2. MongoDB Connection Error (`ECONNREFUSED`)
If services output `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`:
- Ensure MongoDB service is started:
  ```powershell
  net start MongoDB
  ```
- Or run `mongod` in a terminal window.

---

## Quick Reference Summary

| Service        | Port | Where to Install npm | Root Run Command   | Directory Run Command              | Health Check URL                |
|----------------|------|----------------------|--------------------|------------------------------------|---------------------------------|
| API Gateway    | 5000 | `server/gateway/`    | `npm run gateway`  | `cd server/gateway && npm run dev` | `http://localhost:5000/health`  |
| Auth Service   | 5001 | `server/services/auth/` | `npm run auth`  | `cd server/services/auth && npm run dev` | `http://localhost:5001/health` |
| Products       | 5002 | `server/services/products/` | `npm run products` | `cd server/services/products && npm run dev` | `http://localhost:5002/health` |
| Users          | 5003 | `server/services/users/` | `npm run users`    | `cd server/services/users && npm run dev` | `http://localhost:5003/health` |
| Orders         | 5004 | `server/services/orders/` | `npm run orders`   | `cd server/services/orders && npm run dev` | `http://localhost:5004/health` |
| React Client   | 3000 | `client/`            | `npm run client`   | `cd client && npm start`           | `http://localhost:3000`         |