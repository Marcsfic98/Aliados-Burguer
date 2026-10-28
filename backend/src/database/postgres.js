import pg from 'pg';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;

const schema = `
    CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL DEFAULT '',
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

    ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';

    CREATE TABLE IF NOT EXISTS plates (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
        available BOOLEAN NOT NULL DEFAULT TRUE,
        description TEXT NOT NULL DEFAULT '',
        ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
        img_url TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS orders (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        pickup_status TEXT NOT NULL DEFAULT 'Pending',
        pickup_time TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
        id BIGSERIAL PRIMARY KEY,
        order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        plate_id BIGINT NOT NULL REFERENCES plates(id) ON DELETE RESTRICT,
        quantity INTEGER NOT NULL CHECK (quantity > 0)
    );

    CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders (user_id);
    CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);
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
            await seedPlates(pool);
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

async function seedPlates(pool) {
    const { rows } = await pool.query('SELECT EXISTS (SELECT 1 FROM plates) AS has_plates');
    if (rows[0].has_plates) {
        return;
    }

    const dataPath = fileURLToPath(new URL('../data/platesData.json', import.meta.url));
    const plates = JSON.parse(await readFile(path.resolve(dataPath), 'utf8'));
    for (const plate of plates) {
        await pool.query(`
            INSERT INTO plates (name, price, available, description, ingredients, img_url, category)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            plate.name,
            plate.price,
            plate.available,
            plate.description,
            JSON.stringify(plate.ingredients ?? []),
            plate.imgUrl,
            plate.category
        ]);
    }
}
