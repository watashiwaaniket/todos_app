import mongoose from 'mongoose';
import 'dotenv/config';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

const TodoSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', TodoSchema);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export { User, Todo, connectDB };