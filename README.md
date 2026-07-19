# Todos App

A full-stack todo app with JWT auth. Create an account, sign in, and manage your personal task list.

- **Backend:** Express, MongoDB (Mongoose), bcrypt, JWT  
- **Frontend:** React (Vite), React Router, Axios  

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

## Backend

```bash
cd backend
npm install
```

Create a `.env` file (you can copy `.env.example`):

```bash
cp .env.example .env
```

Fill in:

```env
PORT=3000
DATABASE_URL=your_mongodb_connection_string
JWT_KEY=your_secret_key
```

Start the API:

```bash
npm run dev
```

The server runs at `http://localhost:3000`.

---

## Frontend

In a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.  
API requests under `/api` are proxied to the backend automatically.

---

## Usage

1. Start the backend, then the frontend.
2. Open `http://localhost:5173`.
3. Create an account (or sign in).
4. Add, complete, and delete todos from the dashboard.
