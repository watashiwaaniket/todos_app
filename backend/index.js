import 'dotenv/config';
import express from 'express';
import { connectDB, User } from './lib/db.js';
import bcrypt from 'bcrypt';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
        return res.status(400).json({
            message: 'Username, password and email are required',
        });
    }

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
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});