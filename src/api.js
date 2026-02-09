const API_URL = 'https://t20-fantasy-game.onrender.com/api';
//const API_URL = 'http://localhost:5000/api';

export const api = {
    // 1. Sync All Data
    sync: async () => {
        const res = await fetch(`${API_URL}/sync`);
        return res.json();
    },

    // 2. Update Teams
    updateTeams: async (teams) => {
        await fetch(`${API_URL}/teams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teams })
        });
    },

    // 3. Update Registry
    updateRegistry: async (playerRegistry) => {
        await fetch(`${API_URL}/registry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerRegistry })
        });
    },

    // 4. Update Metadata
    updateMetadata: async (metadata) => {
        await fetch(`${API_URL}/metadata`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ metadata })
        });
    },

    // 5. Seed / Reset
    seed: async (teams, metadata) => {
        await fetch(`${API_URL}/seed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teams, metadata })
        });
    }
};
