import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import { authRoutes } from './routes/auth.routes.js';
import { todosRoutes } from './routes/todos.routes.js';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/todos', todosRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});