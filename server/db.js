import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

/**
 * Helper to ensure the database table exists.
 * In production, you'd usually use migrations (Prisma/Drizzle/Kysely).
 * For this MVP, we'll use a single table with JSONB to mimic the "snapshot" feel.
 */
export const initDb = async () => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS global_state (
                id TEXT PRIMARY KEY,
                teams JSONB,
                player_registry JSONB,
                metadata JSONB,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("✅ NeonDB Table Checked/Created");
    } catch (err) {
        console.error("❌ NeonDB Initialization Error:", err);
    }
};

export default sql;
