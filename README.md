# Todo App - Setup Guide

A simple todo app with Express backend and MongoDB.

## Folder Structure

```
todo-app/
├── server/
│   ├── server.js
│   └── package.json
└── client/
    ├── index.html
    └── script.js
```

---

## Step 1: Create Folders

```bash
mkdir todo-app
cd todo-app
mkdir server client
```

---

## Step 2: Server Setup

### Create `server/package.json`

```json
{
  "name": "todo-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "mongoose": "^8.0.0"
  }
}
```

### Create `server/server.js`

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('YOUR_MONGODB_CONNECTION_STRING')
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
```

---

## Step 3: Client Setup

### Create `client/index.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>Todo App</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black text-white min-h-screen flex justify-center pt-12">
    <div class="w-96">
        <h1 class="text-3xl font-bold text-center mb-6">Todo App</h1>
        
        <div class="flex gap-2 mb-6">
            <input type="text" id="todoInput" placeholder="Enter todo..." 
                class="flex-1 p-2 border-2 border-white bg-black text-white">
            <button onclick="addTodo()" class="px-4 py-2 bg-white text-black hover:bg-gray-300">Add</button>
        </div>

        <ul id="todoList" class="space-y-2"></ul>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

### Create `client/script.js`

```javascript
const API = 'http://localhost:5000/todos';

loadTodos();

async function loadTodos() {
    const res = await fetch(API);
    const todos = await res.json();
    
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-2 p-2 border border-white';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;
        checkbox.className = 'w-4 h-4';
        checkbox.onchange = () => toggleTodo(todo._id, checkbox.checked);
        
        const span = document.createElement('span');
        span.className = 'flex-1' + (todo.done ? ' line-through text-gray-500' : '');
        span.textContent = todo.title;
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'px-2 py-1 bg-white text-black text-sm hover:bg-gray-300';
        editBtn.onclick = () => editTodo(todo._id, todo.title);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'px-2 py-1 bg-black text-white border border-white text-sm hover:bg-gray-800';
        deleteBtn.onclick = () => deleteTodo(todo._id);
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

async function addTodo() {
    const input = document.getElementById('todoInput');
    if (!input.value) return;
    
    await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.value })
    });
    
    input.value = '';
    loadTodos();
}

async function toggleTodo(id, done) {
    await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done })
    });
    loadTodos();
}

async function editTodo(id, oldTitle) {
    const newTitle = prompt('Edit todo:', oldTitle);
    if (!newTitle) return;
    
    await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
    });
    loadTodos();
}

async function deleteTodo(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadTodos();
}
```

---

## Step 4: Install Dependencies

```bash
cd server
npm install
```

---

## Step 5: Run the App

### Start Server

```bash
cd server
node server.js
```

You should see:
```
Server running on port 5000
MongoDB connected
```

### Open Client

Open `client/index.html` in your browser.

---

## CRUD Operations

| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| Create | POST | /todos | Add new todo |
| Read | GET | /todos | Get all todos |
| Update | PUT | /todos/:id | Update todo |
| Delete | DELETE | /todos/:id | Delete todo |
