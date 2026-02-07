import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sql, { initDb } from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize Database Table
initDb();

// --- API ENDPOINTS ---

// 1. Sync All Data
app.get('/api/sync', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM global_state WHERE id = 'global_state'`;
        if (rows.length === 0) {
            return res.json({ teams: [], playerRegistry: {}, metadata: {} });
        }
        const state = rows[0];
        res.json({
            id: state.id,
            teams: state.teams,
            playerRegistry: state.player_registry,
            metadata: state.metadata
        });
    } catch (error) {
        console.error("SYNC ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Update Teams
app.post('/api/teams', async (req, res) => {
    try {
        const { teams } = req.body;
        await sql`
            INSERT INTO global_state (id, teams) 
            VALUES ('global_state', ${JSON.stringify(teams)})
            ON CONFLICT (id) DO UPDATE SET teams = EXCLUDED.teams, updated_at = CURRENT_TIMESTAMP;
        `;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Update Player Registry
app.post('/api/registry', async (req, res) => {
    try {
        const { playerRegistry } = req.body;
        await sql`
            INSERT INTO global_state (id, player_registry) 
            VALUES ('global_state', ${JSON.stringify(playerRegistry)})
            ON CONFLICT (id) DO UPDATE SET player_registry = EXCLUDED.player_registry, updated_at = CURRENT_TIMESTAMP;
        `;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Update Metadata
app.post('/api/metadata', async (req, res) => {
    try {
        const { metadata } = req.body;
        await sql`
            INSERT INTO global_state (id, metadata) 
            VALUES ('global_state', ${JSON.stringify(metadata)})
            ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, updated_at = CURRENT_TIMESTAMP;
        `;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Seed Database
app.post('/api/seed', async (req, res) => {
    try {
        const { teams, metadata } = req.body;
        await sql`
            INSERT INTO global_state (id, teams, player_registry, metadata) 
            VALUES ('global_state', ${JSON.stringify(teams)}, '{}', ${JSON.stringify(metadata)})
            ON CONFLICT (id) DO UPDATE SET 
                teams = EXCLUDED.teams, 
                player_registry = EXCLUDED.player_registry, 
                metadata = EXCLUDED.metadata,
                updated_at = CURRENT_TIMESTAMP;
        `;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 NeonDB integration active`);
});
