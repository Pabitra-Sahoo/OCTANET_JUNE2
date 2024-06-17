const taskList = document.getElementById('tasks');
const filterButtons = document.querySelectorAll('.filter-btn');
const newTaskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task');

// Function to create a new task list item
function createTask(taskText, isStarred = false, isCompleted = false) {
  const listItem = document.createElement('li');
  listItem.classList.add('task-item');
  if (isStarred) listItem.classList.add('starred');
  if (isCompleted) listItem.classList.add('completed');

  const taskLabel = document.createElement('span');
  taskLabel.innerText = taskText;
  listItem.appendChild(taskLabel);

  const starButton = document.createElement('button');
  starButton.classList.add('star-btn');
  starButton.innerHTML = isStarred ? '★' : '☆';
  listItem.appendChild(starButton);

  const completeButton = document.createElement('button');
  completeButton.classList.add('complete-btn');
  completeButton.innerHTML = isCompleted ? '✔' : '✔';
  listItem.appendChild(completeButton);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-btn');
  deleteButton.innerHTML = '✖';
  listItem.appendChild(deleteButton);

  // Add event listeners for star, complete, and delete buttons
  starButton.addEventListener('click', function (event) {
    toggleStar(event);
    saveTasks();
  });

  completeButton.addEventListener('click', function (event) {
    toggleComplete(event);
    saveTasks();
  });

  deleteButton.addEventListener('click', function (event) {
    deleteTask(event);
    saveTasks();
  });

  return listItem;
}

// Function to add a new task to the list
function addTask(taskText, isStarred, isCompleted) {
  const newTaskItem = createTask(taskText, isStarred, isCompleted);
  taskList.appendChild(newTaskItem);

  // Clear the input field
  newTaskInput.value = '';

  saveTasks();
}

// Function to toggle star icon and starred state
function toggleStar(event) {
  const starButton = event.currentTarget;
  const listItem = starButton.parentElement;

  listItem.classList.toggle('starred');

  starButton.innerHTML = listItem.classList.contains('starred') ? '★' : '☆';
}

// Function to toggle checkmark icon and completed state
function toggleComplete(event) {
  const completeButton = event.currentTarget;
  const listItem = completeButton.parentElement;

  listItem.classList.toggle('completed');

  completeButton.innerHTML = listItem.classList.contains('completed') ? '✔' : '✖';
}

// Function to delete a task
function deleteTask(event) {
  const deleteButton = event.currentTarget;
  const listItem = deleteButton.parentElement;
  taskList.removeChild(listItem);
}

// Function to save tasks to local storage
function saveTasks() {
  const tasksArray = [];
  taskList.querySelectorAll('.task-item').forEach(task => {
    tasksArray.push({
      text: task.querySelector('span').innerText,
      starred: task.classList.contains('starred'),
      completed: task.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

// Function to load tasks from local storage
function loadTasks() {
  const tasksArray = JSON.parse(localStorage.getItem('tasks'));
  if (tasksArray) {
    tasksArray.forEach(task => addTask(task.text, task.starred, task.completed));
  }
}

// Function to filter tasks based on selected button
function filterTasks(filter) {

  const tasks = taskList.querySelectorAll('.task-item');

  tasks.forEach(task => {
    let shouldBeVisible = false;

    if (filter === 'all') {
      shouldBeVisible = true;
    } else if (filter === 'completed') {
      shouldBeVisible = task.classList.contains('completed');
    } else if (filter === 'pending') {
      shouldBeVisible = !task.classList.contains('completed');
    } else if (filter === 'starred') {
      shouldBeVisible = task.classList.contains('starred');
    }

    task.style.display = shouldBeVisible ? 'flex' : 'none';
  });
}

// Add event listener to the "Add Task" button
addTaskButton.addEventListener('click', () => {
  const newTaskText = newTaskInput.value.trim();
  if (newTaskText) {
    addTask(newTaskText);
  }
});

// Add event listeners to filter buttons
filterButtons.forEach(button => {
  button.addEventListener('click', () => {

    const filter = button.dataset.filter;
    filterButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    filterTasks(filter);
  });
});

// Load tasks from local storage on page load
window.addEventListener('DOMContentLoaded', loadTasks);

// Initial filter (show all tasks)
filterTasks('all');
