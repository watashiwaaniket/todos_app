import express from 'express';
import { auth } from '../middleware/auth.js';
import { Todo } from '../lib/db.js';

export const todosRoutes = express.Router();

todosRoutes.get('/todos', auth, async (req, res) => {
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
});

todosRoutes.post('/todos', auth, async (req, res) => {
    const { title } = req.body;
    const todo = await Todo.create({ title, userId: req.userId });
    res.status(201).json(todo);
});

todosRoutes.patch('/todos/:id', auth, async (req, res) => {
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'completed must be a boolean' });
    }

    const todo = await Todo.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { completed },
        { returnDocument: 'after' }
    );

    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
});

todosRoutes.delete('/todos/:id', auth, async (req, res) => {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(204).send();
});