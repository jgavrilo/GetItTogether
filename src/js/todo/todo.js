// SECTION - DOMContentLoaded
document.addEventListener('DOMContentLoaded', async function() {
    
    //  Load in existing list content from local storage
    //  Update the clear button based on checked off tasks
    await loadTodoList();
    updateClearButtonVisibility();

    //  Check if the user is logged in to Google and wait for the response
    const isLoggedIn = await checkLoginStatusWithoutLogin();

    //  If they are logged in display any task lists that is stored in Google
    if (isLoggedIn) {
        await displayGoogleTaskLists();
    }

    //  When the window first opens, local must be selected
    switchTab('local');

    //  We want the tabs to stay in a contained space regardless of the amount of tabs
    //  We apply a scroll feature for when there are too many tabs to fit the width
    const tabsWrapper = document.querySelector('.tabs-wrapper');
    tabsWrapper.addEventListener('wheel', function(event) {
        // Prevent the default scrolling behavior
        event.preventDefault();

        // Scroll horizontally based on the vertical scroll amount
        tabsWrapper.scrollLeft += event.deltaY;
    });

});

// SECTION - Event listeners
// Add todo item by clicking the 'Add' button
document.getElementById('addTodo').addEventListener('click', async function() {
    const newTodo = document.getElementById('newTodo').value;
    if (newTodo) {
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab) {
            const tabId = activeTab.id;
            if (tabId === 'local') {
                // Add to local list
                document.getElementById('todoList').appendChild(createTodoItem(newTodo, false));
                saveTodoList();
            } else {
                // Add to Google Task list
                const token = await getAuthToken();
                await addTaskToGoogleTaskList(token, tabId, newTodo);
                switchTab(tabId);
            }
        }
        document.getElementById('newTodo').value = '';
        updateClearButtonVisibility();
    }
});

// Add todo item by clicking enter while typing a new todo
document.getElementById('newTodo').addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('addTodo').click();
    }
});

// Clicking the checkbox should toggle the line going through the text and completed marker
document.getElementById('todoList').addEventListener('click', function(e) {
    if (e.target && e.target.className === 'todo-checkbox') {
        const textElement = e.target.nextSibling;
        textElement.style.textDecoration = e.target.checked ? 'line-through' : 'none';
        updateClearButtonVisibility();
        saveTodoList();
    }
});

// Removing and deleting completed todo's
document.getElementById('clearCompleted').addEventListener('click', async function() {
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
        const tabId = activeTab.id;
        if (tabId === 'local') {
            // Clear completed tasks from local list
            const items = document.querySelectorAll('#todoList li');
            items.forEach(item => {
                if (item.querySelector('.todo-checkbox').checked) {
                    item.remove();
                }
            });
            saveTodoList();
        } else {
            // Clear completed tasks from Google Task list
            const token = await getAuthToken();
            await clearCompletedGoogleTasks(token, tabId);
        }
    }
    updateClearButtonVisibility();
});

// Delete a list from the google lists
document.getElementById('deleteList').addEventListener('click', async function() {
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
        const tabId = activeTab.id;
        
        // Fetch the tasks in the Google Task list to check if it's empty
        const token = await getAuthToken();
        const tasks = await fetchGoogleTasks(token, tabId);
        
        const isConfirmed = window.confirm("Are you sure you want to delete this list?");
        if (!isConfirmed) {
        return;
        }
        

        // Delete the Google Task list
        const deleteSuccess = await deleteGoogleTaskList(token, tabId);
        if (deleteSuccess) {
            // Remove the tab from the DOM or refresh the list of tabs
            activeTab.remove();
        }
        
    }
});

// SECTION - Local list functions
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
    
    // Add double-click event to the span
    span.addEventListener('click', function() {
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

async function loadTodoList() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const todoList = document.getElementById('todoList');
    
    todoList.innerHTML = '';

    if (isLoggedIn) {
        await displayGoogleTaskLists();
    } else {
        hideGoogleTabs();
        switchTab('local');
    }

    // Load todo list from local storage
    const savedTodos = JSON.parse(localStorage.getItem('todoList') || '[]');
    savedTodos.forEach(todo => {
        todoList.appendChild(createTodoItem(todo.text, todo.isChecked));
    });
}

// Function to update the visibility of the clear completed button
async function updateClearButtonVisibility() {
    const clearCompletedButton = document.getElementById('clearCompleted');
    const activeTab = document.querySelector('.tab-button.active');
    let hasCompletedTasks = false;

    if (activeTab) {
        const tabId = activeTab.id;
        if (tabId === 'local') {
            // Check for completed tasks in local list
            const items = document.querySelectorAll('#todoList li');
            hasCompletedTasks = Array.from(items).some(item => item.querySelector('.todo-checkbox').checked);
        } else {
            // Check for completed tasks in Google Task list
            const token = await getAuthToken();
            const tasks = await fetchGoogleTasks(token, tabId);
            hasCompletedTasks = tasks.some(task => task.status === 'completed');
        }
    }

    clearCompletedButton.style.display = hasCompletedTasks ? 'block' : 'none';
}

