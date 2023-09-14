document.getElementById('addTodo').addEventListener('click', function() {
    const newTodo = document.getElementById('newTodo').value;
    if (newTodo) {
        const li = document.createElement('li');
        
        const deleteButton = document.createElement('span');
        deleteButton.className = 'deleteTodo';
        deleteButton.textContent = 'X';
        li.appendChild(deleteButton);
        
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = ' ' + newTodo; // Added a space for separation
        li.appendChild(span);
        
        document.getElementById('todoList').appendChild(li);
        document.getElementById('newTodo').value = '';

        // Save the updated list to localStorage
        saveTodoList();
    }
});


function saveTodoList() {
    const todos = [];
    const items = document.querySelectorAll('#todoList li');
    items.forEach(item => {
        todos.push(item.textContent);
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
        
        const deleteButton = document.createElement('span');
        deleteButton.className = 'deleteTodo';
        deleteButton.textContent = 'X';
        li.appendChild(deleteButton);
        
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = ' ' + todo; // Added a space for separation
        li.appendChild(span);
        
        todoList.appendChild(li);
    });
}


document.getElementById('todoList').addEventListener('click', function(e) {
    if (e.target && e.target.className === 'deleteTodo') {
        // Remove the item from the list
        e.target.parentElement.remove();
        
        // Update localStorage
        saveTodoList();
    }
});
