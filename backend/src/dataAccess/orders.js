import { Postgres } from '../database/postgres.js';

const orderSelect = `
    SELECT
        orders.id::text AS "_id",
        orders.pickup_status AS "pickupStatus",
        orders.pickup_time AS "pickupTime",
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    '_id', order_items.id::text,
                    'quantity', order_items.quantity,
                    'itemDetails', jsonb_build_array(jsonb_build_object(
                        '_id', plates.id::text,
                        'name', plates.name,
                        'price', plates.price::float8
                    ))
                ) ORDER BY order_items.id
            ) FILTER (WHERE order_items.id IS NOT NULL),
            '[]'::jsonb
        ) AS "orderItems"
    FROM orders
    LEFT JOIN order_items ON order_items.order_id = orders.id
    LEFT JOIN plates ON plates.id = order_items.plate_id
`;

export default class OrdersDataAccess {
    async getOrders() {
        const { rows } = await Postgres.query(`
            ${orderSelect}
            GROUP BY orders.id
            ORDER BY orders.created_at DESC
        `);
        return rows;
    }

    async getOrdersByUserId(userId) {
        if (!isValidId(userId)) {
            throw new Error('Identificador de usuário inválido.');
        }

        const { rows } = await Postgres.query(`
            ${orderSelect}
            WHERE orders.user_id = $1
            GROUP BY orders.id
            ORDER BY orders.created_at DESC
        `, [userId]);
        return rows;
    }

    async addOrder(orderData) {
        if (!orderData || !isValidId(orderData.userId)) {
            throw new Error('Identificador de usuário inválido.');
        }
        if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
            throw new Error('O pedido precisa conter ao menos um prato.');
        }
        for (const item of orderData.items) {
            if (!isValidId(item.plateId)
                || !Number.isSafeInteger(item.quantity)
                || item.quantity < 1) {
                throw new Error('O pedido contém um prato ou uma quantidade inválida.');
            }
        }

        const client = await Postgres.pool.connect();
        try {
            await client.query('BEGIN');
            const { rows } = await client.query(`
                INSERT INTO orders (user_id, pickup_time)
                VALUES ($1, $2)
                RETURNING id
            `, [orderData.userId, orderData.pickupTime ?? '']);
            const orderId = rows[0].id;

            for (const item of orderData.items) {
                await client.query(`
                    INSERT INTO order_items (order_id, plate_id, quantity)
                    VALUES ($1, $2, $3)
                `, [orderId, item.plateId, item.quantity]);
            }

            await client.query('COMMIT');
            return { _id: String(orderId) };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteOrder(orderId) {
        if (!isValidId(orderId)) {
            throw new Error('Identificador de pedido inválido.');
        }
        const { rows } = await Postgres.query(
            'DELETE FROM orders WHERE id = $1 RETURNING id::text AS "_id"',
            [orderId]
        );
        return rows[0] ?? null;
    }

    async updateOrder(orderId, orderData) {
        if (!isValidId(orderId)) {
            throw new Error('Identificador de pedido inválido.');
        }
        if (!orderData || typeof orderData !== 'object' || Array.isArray(orderData)) {
            throw new Error('Informe os dados válidos do pedido.');
        }

        const updates = [];
        const values = [];
        if (typeof orderData.pickupStatus === 'string') {
            values.push(orderData.pickupStatus);
            updates.push(`pickup_status = $${values.length}`);
        }
        if (typeof orderData.pickupTime === 'string') {
            values.push(orderData.pickupTime);
            updates.push(`pickup_time = $${values.length}`);
        }
        if (!updates.length) {
            throw new Error('Informe o status ou horário de retirada.');
        }

        values.push(orderId);
        const { rows } = await Postgres.query(`
            UPDATE orders
            SET ${updates.join(', ')}
            WHERE id = $${values.length}
            RETURNING id::text AS "_id", pickup_status AS "pickupStatus",
                      pickup_time AS "pickupTime"
        `, values);
        return rows[0] ?? null;
    }
}

function isValidId(id) {
    return (typeof id === 'string' || typeof id === 'number')
        && /^\d+$/.test(String(id))
        && Number.isSafeInteger(Number(id))
        && Number(id) > 0;
}
