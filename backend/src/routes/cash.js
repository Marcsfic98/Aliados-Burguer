import express from 'express';
import { Postgres } from '../database/postgres.js';

const cashRouter = express.Router();
const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const maximumAmount = 9999999999.99;

function isValidDate(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date)
        && !Number.isNaN(Date.parse(`${date}T00:00:00.000Z`))
        && new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10) === date;
}

function parseAmount(value) {
    if ((typeof value !== 'number' && typeof value !== 'string')
        || (typeof value === 'string' && value.trim() === '')) {
        return null;
    }

    const amount = Number(value);
    if (!Number.isFinite(amount) || amount < 0 || amount > maximumAmount) {
        return null;
    }

    const cents = Math.round((amount + Number.EPSILON) * 100);
    return Number.isSafeInteger(cents) ? cents / 100 : null;
}

function validateEntry(body = {}, date) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return 'Informe dados válidos para o lançamento.';
    }

    if (!isValidDate(date)) {
        return 'Informe uma data válida.';
    }

    const received = parseAmount(body.received);
    const withdrawal = parseAmount(body.withdrawal);
    const delivery = parseAmount(body.delivery);

    if (received === null || withdrawal === null || delivery === null) {
        return 'Informe valores válidos e não negativos para recebimento, sangria e motoboy.';
    }

    const withdrawalReason = typeof body.withdrawalReason === 'string'
        ? body.withdrawalReason.trim()
        : '';
    if (withdrawal > 0 && !withdrawalReason) {
        return 'Informe o motivo da sangria.';
    }

    return {
        date,
        weekday: weekdays[new Date(`${date}T00:00:00.000Z`).getUTCDay()],
        received,
        withdrawal,
        delivery,
        withdrawalReason,
        balance: Math.round((received - withdrawal - delivery + Number.EPSILON) * 100) / 100
    };
}

cashRouter.get('/', async (req, res) => {
    const { rows } = await Postgres.query(`
        SELECT date::text AS date, weekday, received, withdrawal, delivery,
               withdrawal_reason AS "withdrawalReason", balance
        FROM daily_cash
        ORDER BY date ASC
    `);
    res.send(rows);
});

cashRouter.put('/:date', async (req, res) => {
    const entry = validateEntry(req.body, req.params.date);
    if (typeof entry === 'string') {
        return res.status(400).send({ message: entry });
    }

    const { rows } = await Postgres.query(`
        INSERT INTO daily_cash
            (date, weekday, received, withdrawal, delivery, withdrawal_reason)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (date) DO UPDATE SET
            weekday = EXCLUDED.weekday,
            received = EXCLUDED.received,
            withdrawal = EXCLUDED.withdrawal,
            delivery = EXCLUDED.delivery,
            withdrawal_reason = EXCLUDED.withdrawal_reason,
            updated_at = NOW()
        RETURNING date::text AS date, weekday, received, withdrawal, delivery,
                  withdrawal_reason AS "withdrawalReason", balance
    `, [
        entry.date,
        entry.weekday,
        entry.received,
        entry.withdrawal,
        entry.delivery,
        entry.withdrawalReason
    ]);

    res.send(rows[0]);
});

export default cashRouter;
