document.getElementById('addTodo').addEventListener('click', function() {
    const newTodo = document.getElementById('newTodo').value;
    if (newTodo) {
        const li = document.createElement('li');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        li.appendChild(checkbox);
        
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = ' ' + newTodo;
        li.appendChild(span);
        
        document.getElementById('todoList').appendChild(li);
        document.getElementById('newTodo').value = '';

        saveTodoList();
    }
});

function saveTodoList() {
    const todos = [];
    const items = document.querySelectorAll('#todoList li');
    items.forEach(item => {
        const isChecked = item.querySelector('.todo-checkbox').checked;
        const text = item.querySelector('.todo-text').textContent.trim();
        todos.push({ text, isChecked });
    });
    localStorage.setItem('todoList', JSON.stringify(todos));
}

document.addEventListener('DOMContentLoaded', function() {
    loadTodoList();
});

function loadTodoList() {
    const savedTodos = JSON.parse(localStorage.getItem('todoList') || '[]');
    const todoList = document.getElementById('todoList');
    savedTodos.forEach(todo => {
        const li = document.createElement('li');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.isChecked;
        li.appendChild(checkbox);
        
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = ' ' + todo.text;
        span.style.textDecoration = todo.isChecked ? 'line-through' : 'none';
        li.appendChild(span);
        
        todoList.appendChild(li);
    });
}

document.getElementById('todoList').addEventListener('click', function(e) {
    if (e.target && e.target.className === 'todo-checkbox') {
        const textElement = e.target.nextSibling;
        textElement.style.textDecoration = e.target.checked ? 'line-through' : 'none';
        saveTodoList();
    }
});

// Add this event listener at the end of your JavaScript file
document.getElementById('clearCompleted').addEventListener('click', function() {
    const items = document.querySelectorAll('#todoList li');
    items.forEach(item => {
        const isChecked = item.querySelector('.todo-checkbox').checked;
        if (isChecked) {
            item.remove();
        }
    });
    saveTodoList();
});
