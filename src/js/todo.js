// Utility function to create a todo item
function createTodoItem(text, isChecked) {
    const li = document.createElement('li');
    
    const container = document.createElement('div'); // Create a container
    container.className = 'todo-container';
    container.style.display = 'flex'; // Set display to flex
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = isChecked;
    container.appendChild(checkbox); // Append to container
    
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = text;
    span.style.textDecoration = isChecked ? 'line-through' : 'none';
    container.appendChild(span); // Append to container
    
    li.appendChild(container); // Append the container to the list item

    let clickTimer;

    // Add click event to the span
    span.addEventListener('click', function() {
        clearTimeout(clickTimer);
        clickTimer = setTimeout(function() {
            checkbox.checked = !checkbox.checked;
            span.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
            saveTodoList();
        }, 250);
    });
    
    // Add double-click event to the span
    span.addEventListener('dblclick', function() {
        clearTimeout(clickTimer); // Clear the single-click timer
    
        // Create an input element
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        input.className = 'todo-edit';
        input.style.display = 'inline-block';
    
        // Replace the span with the input element within the container
        const container = span.parentNode;
        container.replaceChild(input, span);
    
        // Focus the input element
        input.focus();
    
        // Listen for 'Enter' key or loss of focus to save changes
        input.addEventListener('keydown', function(event) {
            if (event.keyCode === 13) {
                saveChanges();
            }
        });
    
        input.addEventListener('blur', saveChanges);
    
        // Function to save changes and revert back to span
        function saveChanges() {
            if (input.value.trim() === '') {
                setTimeout(() => {
                    const closestLi = input.closest('li'); // Find the closest li parent
                    if (closestLi && closestLi.parentNode) {
                        closestLi.parentNode.removeChild(closestLi);
                    }
                    saveTodoList();
                }, 0);
            } else {
                span.textContent = input.value;
                input.parentNode.replaceChild(span, input);
                saveTodoList();
            }
        }


    });    
    
    return li;
}

// Function to save the todo list to local storage
function saveTodoList() {
    const todos = Array.from(document.querySelectorAll('#todoList li')).map(item => {
        return {
            text: item.querySelector('.todo-text').textContent.trim(),
            isChecked: item.querySelector('.todo-checkbox').checked
        };
    });
    localStorage.setItem('todoList', JSON.stringify(todos));

    // Update the visibility of the "Clear Completed" button
    updateClearButtonVisibility();
}

// Function to load the todo list from local storage
function loadTodoList() {
    const savedTodos = JSON.parse(localStorage.getItem('todoList') || '[]');
    const todoList = document.getElementById('todoList');
    savedTodos.forEach(todo => {
        todoList.appendChild(createTodoItem(todo.text, todo.isChecked));
    });
}

// Function to update the visibility of the clear completed button
function updateClearButtonVisibility() {
    const todoList = document.getElementById('todoList');
    const clearCompletedButton = document.getElementById('clearCompleted');
    clearCompletedButton.style.display = todoList.children.length === 0 ? 'none' : 'block';
}

// Event listeners
document.getElementById('addTodo').addEventListener('click', function() {
    const newTodo = document.getElementById('newTodo').value;
    if (newTodo) {
        document.getElementById('todoList').appendChild(createTodoItem(newTodo, false));
        document.getElementById('newTodo').value = '';
        updateClearButtonVisibility();
        saveTodoList();
    }
});

document.getElementById('newTodo').addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('addTodo').click();
    }
});

document.getElementById('todoList').addEventListener('click', function(e) {
    if (e.target && e.target.className === 'todo-checkbox') {
        const textElement = e.target.nextSibling;
        textElement.style.textDecoration = e.target.checked ? 'line-through' : 'none';
        updateClearButtonVisibility();
        saveTodoList();
    }
});

document.getElementById('clearCompleted').addEventListener('click', function() {
    const items = document.querySelectorAll('#todoList li');
    items.forEach(item => {
        if (item.querySelector('.todo-checkbox').checked) {
            item.remove();
        }
    });
    updateClearButtonVisibility();
    saveTodoList();
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadTodoList();
    updateClearButtonVisibility();
});
