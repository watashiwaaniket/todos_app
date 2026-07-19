import jwt from 'jsonwebtoken';
import { getEnv } from '../util/env.util.js';

export const auth = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, getEnv('JWT_KEY'));
    req.user = decoded;
    next();
};