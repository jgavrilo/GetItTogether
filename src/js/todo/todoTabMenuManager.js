const tabId = 'local';

// SECTION - DOMContentLoaded
document.addEventListener('DOMContentLoaded', async function() {

    //  When the window first opens, local must be selected
    switchTab(tabId);

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

// Function to display Google Task Lists as tabs
async function displayGoogleTaskLists() {
    const token = await getAuthToken();
    const googleTaskLists = await fetchGoogleTaskLists(token);
    const tabs = document.querySelector('.tabs');
  
    // Clear existing tabs
    tabs.innerHTML = '';
    
    // Create and append the "local" tab first
    const localTab = document.createElement('button');
    localTab.id = 'local';
    localTab.className = 'tab-button';
    localTab.textContent = 'Local';
    localTab.addEventListener('click', function() {
        switchTab('local');
    });
    tabs.appendChild(localTab);


    googleTaskLists.forEach(async (taskList) => {
        const button = document.createElement('button');
        button.className = 'tab-button';
        button.id = taskList.id;
        button.textContent = taskList.title;
        button.addEventListener('click', function() {
            switchTab(taskList.id);
        });
        tabs.appendChild(button);
        
        // Create a ul element for this Google Task List
        const div = document.createElement('div');
        div.id = `${taskList.id}-content`;
        div.className = 'tab-content';
        document.getElementById('inputSection').appendChild(div);
    
    });
  
    // Add "+" button at the end
    const addButton = document.createElement('button');
    addButton.id = 'addNewListTab';
    addButton.className = 'tab-button';
    addButton.textContent = '+';
    addButton.addEventListener('click', async function() {
        const listName = prompt("Enter the name of the new list:");
        if (listName) {
            const token = await getAuthToken();
            await createNewGoogleTaskList(token, listName);
        }
    });
    tabs.appendChild(addButton);

    // Event listener for the "Add New List" button
    document.getElementById('addNewListTab').addEventListener('click', async function() {
        const listName = prompt("Enter the name of the new list:");
        if (listName) {
            const token = await getAuthToken();
            await createNewGoogleTaskList(token, listName);
        }
    });
}

// SECTION - Tabs
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

    const deleteListButton = document.getElementById('deleteList');
    if (deleteListButton) {
      if (tabId === 'local') {
        deleteListButton.style.display = 'none';
      } else {
        deleteListButton.style.display = 'block';
      }
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
        }

        const ul = document.createElement('ul');
        ul.id = 'todoList';

        // Append new tasks
        tasks.forEach(task => {


            const li = document.createElement('li');

            const container = document.createElement('div');
            container.className = 'todo-container';
            container.style.display = 'flex';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.checked = task.status === 'completed';
            checkbox.dataset.taskId = task.id;
            container.appendChild(checkbox);

            const span = document.createElement('span');
            span.className = 'todo-text';
            span.textContent = task.title;
            span.style.textDecoration = task.status === 'completed' ? 'line-through' : 'none';
            span.style.whiteSpace = 'nowrap';
            span.style.overflow = 'hidden';
            span.style.textOverflow = 'ellipsis';
            container.appendChild(span);

            li.appendChild(container);
            ul.appendChild(li);

            // Add click event to the span
            span.addEventListener('click', function() {
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
                input.addEventListener('keydown', async function(event) {
                    if (event.keyCode === 13) {
                        await saveGoogleTaskChanges(input, span, li, tabId, task.id);
                    }
                });

            });

            taskListElement.appendChild(ul);
        });
        
        // Add event listener for checkboxes
        taskListElement.addEventListener('click', async function(e) {
            if (e.target && e.target.className === 'todo-checkbox') {
                const textElement = e.target.nextSibling;
                textElement.style.textDecoration = e.target.checked ? 'line-through' : 'none';
                const taskId = e.target.dataset.taskId;  // Retrieve the task ID
                const token = await getAuthToken();
                await updateGoogleTaskStatus(token, tabId, taskId, e.target.checked);
                await updateClearButtonVisibility();
            }
        });

    }
    // Update the visibility of the "Clear Completed" button
    await updateClearButtonVisibility();   
}

function hideGoogleTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        if (tab.id !== 'local') {
            tab.style.display = 'none';
        }
    });
} 

// Event Listener to make sure tabs change when login status changes
window.addEventListener('storage', async function(event) {
    if (event.key === 'isLoggedIn') {
        // Reload the todo list based on the new login status
        await loadTodoList();
    }
});