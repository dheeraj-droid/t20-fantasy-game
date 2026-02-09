# T20 World Cup 2026 - Pro Fantasy League

A premium, high-integrity fantasy cricket platform built with a modern tech stack. Experience real-time data synchronization, live match tracking, and a dynamic leaderboard.

**Live Demo**: [https://t20-fantasy-game.vercel.app/](https://t20-fantasy-game.vercel.app/)

---

##  Quick Start (Recreation Guide)

Follow these steps to recreate the entire project on your local machine.

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Git**
- **Neon Console** (or any PostgreSQL provider)

### 2. Database Setup (NeonDB)
1.  Create a new project on [Neon.tech](https://neon.tech/).
2.  Create two branches: `main` (Production) and `dev` (Local Testing).
3.  The backend is designed to auto-initialize the tables on the first run.

### 3. Backend Setup
1.  Navigate to the `server/` directory:
    ```bash
    cd server
    npm install
    ```
2.  Create a `.env` file in the `server/` folder (use `.env.example` as a template):
    ```env
    DATABASE_URL=your_neon_db_connection_string
    PORT=5001
    ```
3.  Start the server:
    ```bash
    npm start
    ```

### 4. Frontend Setup
1.  Go back to the root directory:
    ```bash
    cd ..
    npm install
    ```
2.  Create a `.env` file in the root folder:
    ```env
    VITE_API_URL=http://localhost:5001/api
    ```
3.  Start the frontend:
    ```bash
    npm run dev
    ```

---

##  Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (Premium Dark Theme, Glassmorphism)
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics

### Backend
- **Server**: Node.js / Express
- **Database**: NeonDB (PostgreSQL)
- **Sync**: Real-time REST API with JSONB storage for flexible schemas.

---

##  Project Structure

```text
├── server/             # Express Backend
│   ├── index.js        # API Routes & Express Config
│   ├── db.js           # NeonDB Connection Logic
│   └── .env            # Private Backend Credentials
├── src/                # React Frontend
│   ├── App.jsx         # Main Logic & UI Components
│   ├── api.js          # Unified API Client
│   └── App.css         # Custom Animations & Gradients
├── .env                # Local Frontend Config
└── .gitignore          # Production-ready exclusions
```

---

##  Security & Best Practices
- **Environment Isolation**: Local development uses a dedicated NeonDB branch.
- **Auto-Config**: The frontend automatically switches between Local (localhost:5001) and Production (Render/Vercel) based on environment variables.
- **Privacy**: All `.env` files are blocked via `.gitignore` to prevent credential leaks.

---

##  License
MIT
