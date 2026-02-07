---
description: How to simulate matches and test data synchronization
---

### 1. Change System Time
To make a match "FINISHED" so you can enter points, modify `INITIAL_SYSTEM_TIME` in `src/App.jsx`:
```javascript
const INITIAL_SYSTEM_TIME = new Date("2026-02-07T23:00:00"); // Example
```
*Current `App.jsx` has it set to Feb 21st, meaning all previous matches are finished.*

### 2. Enter Admin Mode
1. Open the app in your browser.
2. Click **Admin Access** (top-right).
3. Enter PIN: `0007`.

### 3. Record Match Scores
1. Switch to the **Matches** tab.
2. Find a match marked as **FINISHED**.
3. Click **Enter Points**.
4. Enter individual player points (e.g., "50" for a half-century).
5. Click **Confirm & Add Points**.

### 4. Verify Sync
1. Switch to the **Leaderboard** tab.
2. Observe that:
    - Team points have increased (Captain gets 2x, Vice Captain 1.5x).
    - The sync indicator shows a new timestamp.
3. Open the app in a **different tab/browser**.
    - The points should appear there automatically within 3 seconds!

### 5. Verify MVP
Check the **MVP** tab to see the updated global player rankings.
