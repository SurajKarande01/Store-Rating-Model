# 🏪 Store Rating Platform

A full-stack web application for rating stores, built with **Express.js** (backend) and **React + Vite** (frontend). Supports three roles: **Admin**, **Normal User**, and **Store Owner**.

---

## 📁 Project Structure

```
Store Rating Model/
├── backend/               # Express.js REST API
│   ├── config/            # Database connection
│   ├── controllers/       # Route handler logic
│   ├── middleware/        # Auth & validation middleware
│   ├── routes/            # API route definitions
│   ├── schema.sql         # MySQL database schema
│   ├── server.js          # App entry point
│   ├── .env.example       # Environment variable template
│   └── package.json
│
├── frontend/              # React + Vite SPA
│   ├── src/
│   │   ├── api/           # Axios instance
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth context (React Context API)
│   │   ├── pages/         # Page-level components
│   │   ├── App.jsx        # Routes & layout
│   │   └── main.jsx       # React entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) v8+

---

### 1. Database Setup

```sql
-- Create the database and tables using the provided schema
mysql -u root -p < backend/schema.sql
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy the environment template and fill in your values
copy .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=store_rating_db
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:3000
```

```bash
# Start the development server
npm run dev
```

The API will be available at `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Admin** | Manage users & stores, view all ratings and statistics |
| **Normal User** | Browse stores, submit & update ratings, change password |
| **Store Owner** | View their store's ratings and average score |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/api/users/change-password` | Change own password |

### Stores
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stores` | List all stores (with user's rating) |
| `POST` | `/api/ratings` | Submit or update a rating |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/users` | List all users |
| `POST` | `/api/admin/users` | Create a new user |
| `GET` | `/api/admin/stores` | List all stores |
| `POST` | `/api/admin/stores` | Create a new store |
| `GET` | `/api/admin/dashboard` | Dashboard statistics |

### Store Owner
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/store-owner/dashboard` | Store ratings & average |

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MySQL2** (with prepared statements)
- **bcryptjs** (password hashing)
- **jsonwebtoken** (JWT auth)
- **express-validator** (input validation)

### Frontend
- **React 18** + **Vite**
- **React Router v6**
- **Axios**
- **React Hot Toast**

---

## 📝 License

This project is for educational purposes.
