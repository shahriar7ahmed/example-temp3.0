const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://tools:vgCa66KBDL2Km7HO@tools.en48vqn.mongodb.net/todoapp')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Todo Schema
const todoSchema = new mongoose.Schema({
    title: String,
    done: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// GET all todos
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

// POST new todo
app.post('/todos', async (req, res) => {
    const todo = new Todo({ title: req.body.title });
    await todo.save();
    res.json(todo);
});

// PUT update todo
app.put('/todos/:id', async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
});

// DELETE todo
app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
