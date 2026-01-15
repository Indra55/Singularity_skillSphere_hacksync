const pool = require('./config/dbConfig');

async function createTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS career_dashboards (
                user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                dashboard_data JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now()
            );
        `);
        console.log("Table 'career_dashboards' created successfully.");
    } catch (err) {
        console.error("Error creating table:", err);
    } finally {
        pool.end();
    }
}

createTable();
