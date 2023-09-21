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
            }
        }
        document.getElementById('newTodo').value = '';
        updateClearButtonVisibility();
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


document.addEventListener('DOMContentLoaded', function() {
    // Your existing code
    loadTodoList();
    updateClearButtonVisibility();

    // New: Display Google Tasks and switch to the local tab
    displayGoogleTaskLists().then(() => {
        switchTab('local');
    });

    // Add event listener for the local tab
    const localTab = document.getElementById('local');
    if (localTab) {
        localTab.addEventListener('click', function() {
            switchTab('local');
        });
    }
});

  

async function getAuthToken() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(token);
        }
      });
    });
  }
  
// Function to fetch Google Task Lists
async function fetchGoogleTaskLists(token) {
    try {
      const response = await fetch(`https://tasks.googleapis.com/tasks/v1/users/@me/lists`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const googleTaskLists = await response.json();
      return googleTaskLists.items || [];
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      return [];
    }
  }

  // Function to fetch Google Tasks for a specific Task List
  async function fetchGoogleTasks(token, taskListId) {
    try {
        const response = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const googleTasks = await response.json();
        return googleTasks.items || [];
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        return [];
    }
}

async function updateGoogleTaskStatus(token, taskListId, taskId, isCompleted) {
    const status = isCompleted ? 'completed' : 'needsAction';
    console.log(`Updating task with ID: ${taskId}, List ID: ${taskListId}, Status: ${status}`);
    try {
        const response = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) {
            const responseData = await response.json();
            console.error('Response Data:', responseData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}


// Function to display Google Task Lists as tabs
async function displayGoogleTaskLists() {
    const token = await getAuthToken();
    const googleTaskLists = await fetchGoogleTaskLists(token);
    const tabs = document.querySelector('.tabs');
  
    googleTaskLists.forEach(taskList => {
        const button = document.createElement('button');
        button.className = 'tab-button';
        button.id = taskList.id;
        button.textContent = taskList.title;
        button.addEventListener('click', function() {
            switchTab(taskList.id);
        });
        tabs.appendChild(button);

        // Create a ul element for this Google Task List
        const ul = document.createElement('ul');
        ul.id = `${taskList.id}-content`;
        ul.className = 'tab-content';
        document.getElementById('inputSection').appendChild(ul);
        
    });
  
    // Initially show the local tab as active
    switchTab('local');
}

  
async function saveGoogleTaskChanges(input, span, li, taskListId, taskId) {
    if (input.value.trim() === '') {
        li.remove();
    } else {
        span.textContent = input.value;
        li.replaceChild(span, input);

        // Update the task title in Google Tasks
        const token = await getAuthToken();
        await updateGoogleTaskTitle(token, taskListId, taskId, input.value);
    }
}

async function updateGoogleTaskTitle(token, taskListId, taskId, newTitle) {
    try {
        const response = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

async function addTaskToGoogleTaskList(token, taskListId, taskTitle) {
    try {
        const response = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: taskTitle })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Refresh the task list to show the new task
        switchTab(taskListId);
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

async function clearCompletedGoogleTasks(token, taskListId) {
    try {
        const tasks = await fetchGoogleTasks(token, taskListId);
        const completedTasks = tasks.filter(task => task.status === 'completed');
        for (const task of completedTasks) {
            await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${task.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
        // Refresh the task list to remove the completed tasks
        switchTab(taskListId);
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

// Function to switch tabs
async function switchTab(tabId) {
    // Remove active class from all tab buttons
    const allTabButtons = document.querySelectorAll('.tab-button');
    allTabButtons.forEach(el => el.classList.remove('active'));

    // Hide all tab content
    const allTabContents = document.querySelectorAll('.tab-content');
    allTabContents.forEach(el => el.style.display = 'none');

    // Activate the clicked tab and show its content
    const tabButton = document.getElementById(tabId);
    const tabContent = document.getElementById(`${tabId}-content`);

    if (tabButton) {
        tabButton.classList.add('active');
    }

    if (tabContent) {
        tabContent.style.display = 'block';
    } else if (tabId === 'local') {
        // Special case for the local tab
        const localContent = document.getElementById('local-content');
        if (localContent) {
            localContent.style.display = 'block';
        }
    }

    if (tabId !== 'local') {
        // Fetch and display tasks for this Google Task List
        const token = await getAuthToken();
        const tasks = await fetchGoogleTasks(token, tabId);
        
        // Clear previous tasks
        const taskListElement = document.getElementById(`${tabId}-content`);
        if (taskListElement) {
            taskListElement.innerHTML = '';
            taskListElement.style.width = '100%';
        }

        // Append new tasks
        tasks.forEach(task => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'google-task-checkbox';
            checkbox.checked = task.status === 'completed';
            checkbox.dataset.taskId = task.id;  // Store the task ID
            li.appendChild(checkbox);

            const span = document.createElement('span');
            span.className = 'google-task-text';
            span.textContent = task.title;
            span.style.textDecoration = task.status === 'completed' ? 'line-through' : 'none';
            li.appendChild(span);

            // Add double-click event to the span
            span.addEventListener('click', function() {
                // Create an input element
                const input = document.createElement('input');
                input.type = 'text';
                input.value = span.textContent;
                input.className = 'google-task-edit';
                input.style.display = 'inline-block';
                
                // Replace the span with the input element within the li
                li.replaceChild(input, span);

                // Focus the input element
                input.focus();

                // Listen for 'Enter' key or loss of focus to save changes
                input.addEventListener('keydown', async function(event) {
                    if (event.keyCode === 13) {
                        await saveGoogleTaskChanges(input, span, li, tabId, task.id);
                    }
                });

                input.addEventListener('blur', async function() {
                    await saveGoogleTaskChanges(input, span, li, tabId, task.id);
                });
            });

            taskListElement.appendChild(li);
        });


        // Add event listener for checkboxes
        taskListElement.addEventListener('click', async function(e) {
            if (e.target && e.target.className === 'google-task-checkbox') {
                const textElement = e.target.nextSibling;
                textElement.style.textDecoration = e.target.checked ? 'line-through' : 'none';
                const taskId = e.target.dataset.taskId;  // Retrieve the task ID
                const token = await getAuthToken();
                updateGoogleTaskStatus(token, tabId, taskId, e.target.checked);
            }
        });

    }
    
}



  
