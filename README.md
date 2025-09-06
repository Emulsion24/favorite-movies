# 🎬 Favorite Movies

A full-stack application for managing your favorite movies and TV shows.

Built with **Node.js (Express)**, **React**, and **MySQL**, with Docker support and CI/CD via GitHub Actions.

-----

## 🚀 Live Demo

👉 [Favorite Movies — Live Demo]

(*https://favorite-movies-kia6.onrender.com/*)

-----

## 🛠️ Tech Stack

  * **Frontend**: React (Vite/CRA), TailwindCSS
  * **Backend**: Node.js, Express
  * **Database**: MySQL 8 with Sequelize ORM
  * **Authentication**: JWT-based
  * **Containerization**: Docker & Docker Compose
  * **CI/CD**: GitHub Actions (lint + test on PRs)

-----

## ⚡ Setup Instructions

### 🔹 Local Setup

1.  **Clone repository**

    ```bash
    git clone https://github.com/your-username/favorite-movies.git
    cd favorite-movies
    ```

2.  **Backend setup**

    ```bash
    cd backend
    cp .env.example .env     # configure DB + secrets
    npm install
    npm run dev
    ```

    Runs on: `http://localhost:5000`

3.  **Frontend setup**

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

    Runs on: `http://localhost:3000`

### 🔹 Docker Setup

Build and start services:

```bash
docker-compose up --build
```

  * **Frontend** → `http://localhost:3000`
  * **Backend API** → `http://localhost:5000`
  * **MySQL DB** → exposed on port 3306

Stop containers:

```bash
docker-compose down -v
```

-----

## 🗄️ Database Schema & Migration Instructions

### Schema

  * **Users**

    | Column | Type |
    | :--- | :--- |
    | `id` | `PK` |
    | `name` | |
    | `email` | `unique` |
    | `password` | |
    | `role` | |
    | `created_at` | |
    | `updated_at` | |

  * **Movies**

    | Column | Type |
    | :--- | :--- |
    | `id` | `PK` |
    | `title` | |
    | `director` | |
    | `year` | |
    | `budget` | |
    | `location` | |
    | `type` | |
    | `created_by` | 
    | `created_at` | |
    | `delete` | |
     | `delete_at` | |

### Running migrations

```bash
cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all     # optional for demo data
```

-----

## 📚 API Documentation

👉 [API Documentation Link](https://www.google.com/search?q=https://your-api-docs-link.com)

**Example endpoints:**

  * `POST /api/v1/auth/register` → Register user
  * `POST /api/v1/auth/login` → Login user
  * `GET /api/movies` → Fetch Approvedmovies
  * `POST /api/movies/create` → Add new movie
  * `GET /api/movies/all` → Fetch All Movies
  * `DELETE /api/movies/:id` → Soft Delete Movie
  * `PATCH /api/movies/:id/status` → Approve/Reject Movies
  * `PUT /api/movies/:id` → Edit Movies
  * `GET /api/movies/user` → Get Login User Movies

-----

## 🧪 Testing & CI/CD

### Local Testing

**Backend**

```bash
cd backend
npm test
```

**Frontend**

```bash
cd frontend
npm test
```

### CI/CD (GitHub Actions)

  * **Workflow file**: `.github/workflows/ci.yml`
  * **Runs automatically on**: Pull Requests & Push to `main`
  * **Includes**: Lint checks, Frontend & backend tests

-----

## 🔑 Demo Credentials

Use these to log in:

* **User**:
  * **Email**: `ankush@email.com`
  * **Password**: `123456`

*
**Admin**:
  * **Email**: `kaiti@mail.com`
  * **Password**: `123456`

-----

## 👨‍💻 Author

  * Shavandeb Kaiti
