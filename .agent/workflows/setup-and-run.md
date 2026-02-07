---
description: How to setup and run the Pro Fantasy application (Frontend + Backend)
---

### 1. Backend Setup (One-time)
If you haven't yet, navigate to the `server/` directory and install dependencies:
```powershell
cd server
npm install
```

### 2. Run the Backend
The backend must be running for data to sync. In a terminal:
```powershell
cd server
npm start
```
*Note: I have already started this for you in the background for this session.*

### 3. Run the Frontend
In a **new** terminal, navigate to the root directory and start the Vite dev server:
```powershell
npm run dev
```

### 4. Initialize Data (Crucial)
Once the app is open in your browser:
1. Click **Admin Access** at the top right.
2. Enter PIN: `0007`.
3. Click **Seed DB**.
    - This will populate your NeonDB with the initial team rosters.
    - You only need to do this **once** ever (or if you want to reset everything).

### 5. Deployment Note (Production)
For production, you would host:
- **Frontend**: Vercel/Netlify.
- **Backend**: Render/Railway/Heroku.
- **Database**: Neon (Global).
