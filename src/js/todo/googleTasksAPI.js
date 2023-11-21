// SECTION - Google Auth and Login Check Functions

// Get Auth Token
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

// Function to check if local storage has a isLoggedIn marker
async function checkLoginStatusWithoutLogin() {
    const savedState = localStorage.getItem('isLoggedIn');
    return savedState === 'true';
}

// SECTION - Google API functions
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

// Function to create a new Google Task List
async function createNewGoogleTaskList(token, listName) {
    try {
        const response = await fetch(`https://tasks.googleapis.com/tasks/v1/users/@me/lists`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: listName })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Refresh the task lists to show the new list
        await displayGoogleTaskLists();
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }

}

// Function to add a new task to a list
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
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

// Function to update the task status between completed and uncompleted
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

// Function to update the task title
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

// Function to save changes done to the task
async function saveGoogleTaskChanges(input, span, li, taskListId, taskId) {
    if (input.value.trim() === '') {
        li.remove();
    } else {
        span.textContent = input.value;
        input.parentNode.replaceChild(span, input);

        // Update the task title in Google Tasks
        const token = await getAuthToken();
        await updateGoogleTaskTitle(token, taskListId, taskId, input.value);
    }
}


// Function to clear and delete any tasks that are marked as completed
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

// Function to delete a task list
async function deleteGoogleTaskList(token, taskListId) {
    try {
      const response = await fetch(`https://tasks.googleapis.com/tasks/v1/users/@me/lists/${taskListId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      return false;
    }
}

