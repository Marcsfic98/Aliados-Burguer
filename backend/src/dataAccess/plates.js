import { Postgres } from '../database/postgres.js';

const plateFields = `
    id::text AS "_id",
    name,
    price::float8 AS price,
    available,
    description,
    ingredients,
    img_url AS "imgUrl",
    category
`;

export default class PlatesDataAccess {
    async getPlates() {
        const { rows } = await Postgres.query(`SELECT ${plateFields} FROM plates ORDER BY id`);
        return rows;
    }

    async getAvailablePlates() {
        const { rows } = await Postgres.query(
            `SELECT ${plateFields} FROM plates WHERE available = TRUE ORDER BY id`
        );
        return rows;
    }

    async addPlate(plateData) {
        const { rows } = await Postgres.query(`
            INSERT INTO plates (name, price, available, description, ingredients, img_url, category)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING ${plateFields}
        `, [
            plateData.name,
            plateData.price,
            plateData.available ?? true,
            plateData.description ?? '',
            JSON.stringify(plateData.ingredients ?? []),
            plateData.imgUrl ?? '',
            plateData.category ?? ''
        ]);
        return rows[0];
    }

    async deletePlate(plateId) {
        const { rows } = await Postgres.query(
            `DELETE FROM plates WHERE id = $1 RETURNING ${plateFields}`,
            [plateId]
        );
        return rows[0] ?? null;
    }

    async updatePlate(plateId, plateData) {
        const fields = {
            name: 'name',
            price: 'price',
            available: 'available',
            description: 'description',
            ingredients: 'ingredients',
            imgUrl: 'img_url',
            category: 'category'
        };
        const assignments = [];
        const values = [];

        for (const [key, column] of Object.entries(fields)) {
            if (plateData[key] !== undefined) {
                const value = key === 'ingredients'
                    ? JSON.stringify(plateData[key])
                    : plateData[key];
                values.push(value);
                assignments.push(`${column} = $${values.length}`);
            }
        }
        if (!assignments.length) {
            return null;
        }

        values.push(plateId);
        const { rows } = await Postgres.query(`
            UPDATE plates
            SET ${assignments.join(', ')}
            WHERE id = $${values.length}
            RETURNING ${plateFields}
        `, values);
        return rows[0] ?? null;
    }
}
