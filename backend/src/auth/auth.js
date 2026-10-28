import express from 'express';
import { Postgres } from '../database/postgres.js';
import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from './passwords.js';

const authRouter = express.Router();

function isValidCredentials(email, password) {
    return typeof email === 'string'
        && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        && email.length <= 254
        && typeof password === 'string'
        && password.length >= 8
        && password.length <= 1024;
}

function createToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error('Configure JWT_SECRET no arquivo backend/.env.');
    }

    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '12h' });
}

async function signup(req, res) {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const { password } = req.body ?? {};
    if (!isValidCredentials(email, password)) {
        return res.status(400).send({
            success: false,
            statusCode: 400,
            body: { text: 'Informe um e-mail válido e uma senha com pelo menos 8 caracteres.' }
        });
    }

    const { salt, passwordHash } = await hashPassword(password);
    try {
        const { rows } = await Postgres.query(`
            INSERT INTO users (name, email, password_hash, salt)
            VALUES ($1, $2, $3, $4)
            RETURNING id::text AS "_id", name, email
        `, [name, email, passwordHash, salt]);
        const user = rows[0];
        user.id = user._id;
        const token = createToken(user);

        return res.status(201).send({
            success: true,
            statusCode: 201,
            body: { text: 'Usuário cadastrado.', token, user }
        })
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).send({
                success: false,
                statusCode: 409,
                body: { text: 'Este e-mail já está cadastrado.' }
            });
        }
        throw error;
    }
}

async function login(req, res) {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const { password } = req.body ?? {};
    if (typeof password !== 'string' || !email) {
        return res.status(400).send({
            success: false,
            statusCode: 400,
            body: { text: 'E-mail ou senha incorretos.' }
        });
    }

    const { rows } = await Postgres.query(
        'SELECT id::text AS "_id", name, email, password_hash, salt FROM users WHERE email = $1',
        [email]
    );
    const storedUser = rows[0];
    if (!storedUser || !(await verifyPassword(password, storedUser.salt, storedUser.password_hash))) {
        return res.status(401).send({
            success: false,
            statusCode: 401,
            body: { text: 'E-mail ou senha incorretos.' }
        });
    }
    const user = {
        _id: storedUser._id,
        id: storedUser._id,
        name: storedUser.name,
        email: storedUser.email
    };
    const token = createToken(user);
    return res.status(200).send({
        success: true,
        statusCode: 200,
        body: { text: 'Login realizado.', user, token }
    });
}

authRouter.post(['/signup', '/singup'], signup);
authRouter.post('/login', login);

export default authRouter;