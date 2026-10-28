import crypto from 'node:crypto';
import { promisify } from 'node:util';

const pbkdf2 = promisify(crypto.pbkdf2);
const iterations = 310000;
const keyLength = 32;

export async function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const passwordHash = await pbkdf2(password, salt, iterations, keyLength, 'sha256');
    return { salt, passwordHash };
}

export async function verifyPassword(password, salt, expectedHash) {
    const passwordHash = await pbkdf2(password, salt, iterations, expectedHash.length, 'sha256');
    return crypto.timingSafeEqual(expectedHash, passwordHash);
}
