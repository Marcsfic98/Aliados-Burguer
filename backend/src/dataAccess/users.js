import { Postgres } from '../database/postgres.js';
import { hashPassword } from '../auth/passwords.js';

export default class UsersDataAccess {
    async getUsers() {
        const { rows } = await Postgres.query(
            'SELECT id, email, created_at FROM users ORDER BY id'
        );
        return rows;
    }

    async deleteUser(userId) {
        if (!isValidId(userId)) {
            throw new Error('Identificador de usuário inválido.');
        }
        const { rows } = await Postgres.query(
            'DELETE FROM users WHERE id = $1 RETURNING id, email',
            [userId]
        );
        return rows[0] ?? null;
    }

    async updateUser(userId, userData) {
        if (!isValidId(userId)) {
            throw new Error('Identificador de usuário inválido.');
        }
        if (!userData || typeof userData !== 'object' || Array.isArray(userData)) {
            throw new Error('Informe os dados válidos do usuário.');
        }

        const updates = [];
        const values = [];
        if (typeof userData.email === 'string' && userData.email.trim()) {
            values.push(userData.email.trim().toLowerCase());
            updates.push(`email = $${values.length}`);
        }
        if (typeof userData.password === 'string' && userData.password.length >= 8) {
            const { salt, passwordHash } = await hashPassword(userData.password);
            values.push(passwordHash, salt);
            updates.push(`password_hash = $${values.length - 1}`, `salt = $${values.length}`);
        } else if (userData.password !== undefined) {
            throw new Error('A senha deve conter pelo menos 8 caracteres.');
        }
        if (!updates.length) {
            throw new Error('Informe um e-mail válido ou uma nova senha.');
        }

        values.push(userId);
        const { rows } = await Postgres.query(`
            UPDATE users
            SET ${updates.join(', ')}, updated_at = NOW()
            WHERE id = $${values.length}
            RETURNING id, email, created_at
        `, values);
        return rows[0] ?? null;
    }
}

function isValidId(id) {
    return /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0;
}