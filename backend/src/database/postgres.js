import pg from 'pg';

const { Pool } = pg;

const schema = `
    CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash BYTEA NOT NULL,
        salt BYTEA NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS daily_cash (
        date DATE PRIMARY KEY,
        weekday TEXT NOT NULL,
        received NUMERIC(12, 2) NOT NULL CHECK (received >= 0),
        withdrawal NUMERIC(12, 2) NOT NULL CHECK (withdrawal >= 0),
        delivery NUMERIC(12, 2) NOT NULL CHECK (delivery >= 0),
        withdrawal_reason TEXT NOT NULL DEFAULT '',
        balance NUMERIC(14, 2) GENERATED ALWAYS AS (received - withdrawal - delivery) STORED,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CHECK (withdrawal = 0 OR LENGTH(BTRIM(withdrawal_reason)) > 0)
    );

    CREATE TABLE IF NOT EXISTS ingredients (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL CHECK (LENGTH(BTRIM(name)) > 0),
        unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
        stock_quantity NUMERIC(14, 3) NOT NULL CHECK (stock_quantity >= 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS ingredients_name_idx ON ingredients (name);
`;

export const Postgres = {
    pool: null,

    async connect({ connectionString }) {
        if (!connectionString) {
            throw new Error('Configure DATABASE_URL para conectar ao PostgreSQL.');
        }

        const pool = new Pool({
            connectionString,
            ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: true } : undefined
        });

        try {
            await pool.query('SELECT 1');
            await pool.query(schema);
        } catch (error) {
            await pool.end();
            throw error;
        }

        this.pool = pool;
        return pool;
    },

    query(text, values) {
        if (!this.pool) {
            throw new Error('A conexão com o PostgreSQL não foi inicializada.');
        }
        return this.pool.query(text, values);
    },

    async close() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
        }
    }
};
