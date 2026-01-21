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
