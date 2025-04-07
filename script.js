let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
// i will adding the comment for remembering 
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskIndexInput = document.getElementById('task-index');
    const taskNameInput = document.getElementById('taskName');
    const taskTypeInput = document.getElementById('taskType');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskDueDateInput = document.getElementById('taskDueDate');
    const taskBgInput = document.getElementById('taskBg');
    const tasksContainer = document.getElementById('tasks-container');
    const searchInput = document.getElementById('searchInput');

    // Save tasks to LocalStorage
    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Return icon based on task type
    function getTaskIcon(type) {
      switch(type) {
        case 'Personal': return '<i class="fas fa-user task-icon"></i>';
        case 'Work': return '<i class="fas fa-briefcase task-icon"></i>';
        case 'Study': return '<i class="fas fa-book task-icon"></i>';
        default: return '<i class="fas fa-tasks task-icon"></i>';
      }
    }

    // Sort tasks by due date (earliest first)
    function sortTasks() {
      tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    // Display tasks with optional filtering
    function displayTasks(filterText = "") {
      sortTasks();
      tasksContainer.innerHTML = "";
      tasks.forEach((task, index) => {
        // Filter if filterText is provided
        if(filterText && !task.name.toLowerCase().includes(filterText.toLowerCase()) &&
           !task.type.toLowerCase().includes(filterText.toLowerCase())) {
          return;
        }
        const card = document.createElement('div');
        card.classList.add('task-card');
        // Set the background color dynamically
        card.style.backgroundColor = task.bgColor;
        card.innerHTML = `
          <div class="task-header">
            ${getTaskIcon(task.type)}
            <h3>${task.name}</h3>
          </div>
          <p><strong>Type:</strong> ${task.type}</p>
          <p>${task.description}</p>
          <div class="task-footer">
            <p><strong>Due:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
          </div>
          <div class="btn-group">
            <button class="btn-edit" onclick="editTask(${index})"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn-delete" onclick="deleteTask(${index})"><i class="fas fa-trash-alt"></i> Delete</button>
          </div>
        `;
        tasksContainer.appendChild(card);
      });
    }

    // Create or update a task on form submit
    taskForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = taskNameInput.value;
      const type = taskTypeInput.value;
      const description = taskDescriptionInput.value;
      const dueDate = taskDueDateInput.value;
      const bgColor = taskBgInput.value;
      const index = parseInt(taskIndexInput.value);

      const taskData = { name, type, description, dueDate, bgColor };

      if(index === -1) {
        // New task
        tasks.push(taskData);
      } else {
        // Update task
        tasks[index] = taskData;
      }
      saveTasks();
      displayTasks(searchInput.value);
      taskForm.reset();
      taskIndexInput.value = -1;
    });

    // Edit task: fill form with task data
    function editTask(index) {
      const task = tasks[index];
      taskNameInput.value = task.name;
      taskTypeInput.value = task.type;
      taskDescriptionInput.value = task.description;
      taskDueDateInput.value = task.dueDate;
      taskBgInput.value = task.bgColor;
      taskIndexInput.value = index;
    }
    window.editTask = editTask;

    // Delete a task
    function deleteTask(index) {
      if(confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        displayTasks(searchInput.value);
      }
    }
    window.deleteTask = deleteTask;

    // Clear all tasks
    function clearAllTasks() {
      if(confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        saveTasks();
        displayTasks();
      }
    }
    window.clearAllTasks = clearAllTasks;

    // Filter tasks based on search input
    function filterTasks() {
      const filterText = searchInput.value;
      displayTasks(filterText);
    }
    window.filterTasks = filterTasks;

    // Initial display on page load
    displayTasks();
