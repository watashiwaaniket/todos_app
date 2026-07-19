import 'dotenv/config';
import express from 'express';
import { connectDB } from './lib/db.js';
import { authRoutes } from './routes/auth.routes.js';
import { todosRoutes } from './routes/todos.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todosRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});