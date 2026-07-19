import jwt from 'jsonwebtoken';
import { getEnv } from '../util/env.util.js';

export const auth = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, getEnv('JWT_KEY'));
        if (!decoded?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        next();
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
