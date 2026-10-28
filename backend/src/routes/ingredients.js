import express from 'express';
import { Postgres } from '../database/postgres.js';

const ingredientsRouter = express.Router();
const maximumPrice = 9999999999.99;
const maximumQuantity = 99999999999.999;

function isValidId(id) {
    return /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0;
}

function validateIngredient(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return 'Informe dados válidos para o insumo.';
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const rawPrice = body.unitPrice;
    const rawQuantity = body.stockQuantity;
    const unitPrice = Number(rawPrice);
    const stockQuantity = Number(rawQuantity);

    if (!name) {
        return 'Informe o nome do insumo.';
    }
    if (!isPresentNumber(rawPrice) || !Number.isFinite(unitPrice)
        || unitPrice < 0 || unitPrice > maximumPrice) {
        return 'Informe um preço unitário válido e não negativo.';
    }
    if (!isPresentNumber(rawQuantity) || !Number.isFinite(stockQuantity) || stockQuantity < 0
        || stockQuantity > maximumQuantity
        || Math.abs(stockQuantity * 1000 - Math.round(stockQuantity * 1000)) > 1e-8
        || !Number.isFinite(unitPrice * stockQuantity)) {
        return 'Informe uma quantidade em estoque válida e não negativa.';
    }

    const cents = Math.round((unitPrice + Number.EPSILON) * 100);
    if (!Number.isSafeInteger(cents)) {
        return 'Informe um preço unitário válido e não negativo.';
    }

    return {
        name,
        unitPrice: cents / 100,
        stockQuantity
    };
}

function isPresentNumber(value) {
    return (typeof value === 'number' && Number.isFinite(value))
        || (typeof value === 'string' && value.trim() !== '');
}

ingredientsRouter.get('/', async (req, res) => {
    const { rows } = await Postgres.query(`
        SELECT id AS "_id", name, unit_price AS "unitPrice",
               stock_quantity AS "stockQuantity"
        FROM ingredients
        ORDER BY name ASC, id ASC
    `);
    res.send(rows);
});

ingredientsRouter.post('/', async (req, res) => {
    const ingredient = validateIngredient(req.body);
    if (typeof ingredient === 'string') {
        return res.status(400).send({ message: ingredient });
    }

    const { rows } = await Postgres.query(`
        INSERT INTO ingredients (name, unit_price, stock_quantity)
        VALUES ($1, $2, $3)
        RETURNING id AS "_id", name, unit_price AS "unitPrice",
                  stock_quantity AS "stockQuantity"
    `, [ingredient.name, ingredient.unitPrice, ingredient.stockQuantity]);
    res.status(201).send(rows[0]);
});

ingredientsRouter.put('/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).send({ message: 'Identificador de insumo inválido.' });
    }
    const ingredient = validateIngredient(req.body);
    if (typeof ingredient === 'string') {
        return res.status(400).send({ message: ingredient });
    }

    const { rows } = await Postgres.query(`
        UPDATE ingredients
        SET name = $1, unit_price = $2, stock_quantity = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING id AS "_id", name, unit_price AS "unitPrice",
                  stock_quantity AS "stockQuantity"
    `, [ingredient.name, ingredient.unitPrice, ingredient.stockQuantity, req.params.id]);
    if (!rows[0]) {
        return res.status(404).send({ message: 'Insumo não encontrado.' });
    }

    res.send(rows[0]);
});

ingredientsRouter.delete('/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).send({ message: 'Identificador de insumo inválido.' });
    }

    const { rowCount } = await Postgres.query(
        'DELETE FROM ingredients WHERE id = $1',
        [req.params.id]
    );
    if (!rowCount) {
        return res.status(404).send({ message: 'Insumo não encontrado.' });
    }

    res.send({ success: true });
});

export default ingredientsRouter;
