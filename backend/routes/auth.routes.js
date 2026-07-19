import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getEnv } from '../util/env.util.js';
import { User } from '../lib/db.js';

export const authRoutes = express.Router();

authRoutes.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
        return res.status(400).json({
            message: 'Username, password and email are required',
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        const user = await User.create({ username, password: hashedPassword, email });
        if (!user) {
            return res.status(400).json({
                message: 'User creation failed',
            });
        }
        res.status(201).json({
            message: 'User created successfully',
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({
                message: 'An account with this email already exists. Sign in instead.',
            });
        }
        return res.status(500).json({
            message: 'Account creation failed. Try again.',
        });
    }
});

authRoutes.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required',
        });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid password',
            });
        }
        const token = jwt.sign({ id: user._id.toString() }, getEnv('JWT_KEY'));
        res.json({ token });
    } catch {
        return res.status(500).json({
            message: 'Sign in failed. Try again.',
        });
    }
});
