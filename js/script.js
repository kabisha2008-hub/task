/* =====================================
   DOM ELEMENTS
===================================== */

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyMessage = document.querySelector("#empty-message");
const filterButtons = document.querySelectorAll(".filter-btn");

/* =====================================
   APPLICATION STATE
===================================== */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

/* =====================================
   SAVE TASKS TO LOCAL STORAGE
===================================== */

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* =====================================
   CREATE TASK
===================================== */

function createTask(text) {
  const newTask = {
    id: Date.now(),

    text: text,

    completed: false,
  };

  tasks.push(newTask);

  saveTasks();

  renderTasks();
}

/* =====================================
   RENDER TASKS
===================================== */

function renderTasks() {
  taskList.innerHTML = "";

  /* FILTER TASKS */

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  /* EMPTY MESSAGE */

  if (filteredTasks.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  /* CREATE DOM ELEMENTS */

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");

    li.className = "task-item";

    li.dataset.id = task.id;

    if (task.completed) {
      li.classList.add("completed");
    }

    /* CHECKBOX */

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className = "task-checkbox";

    checkbox.checked = task.completed;

    checkbox.setAttribute("aria-label", `Mark ${task.text} as completed`);

    /* TASK TEXT */

    const span = document.createElement("span");

    span.className = "task-text";

    span.textContent = task.text;

    /* ACTION BUTTONS */

    const actions = document.createElement("div");

    actions.className = "task-actions";

    const editButton = document.createElement("button");

    editButton.type = "button";

    editButton.className = "edit-btn";

    editButton.dataset.action = "edit";

    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className = "delete-btn";

    deleteButton.dataset.action = "delete";

    deleteButton.textContent = "Delete";

    /* ADD BUTTONS */

    actions.appendChild(editButton);

    actions.appendChild(deleteButton);

    /* ADD EVERYTHING TO LI */

    li.appendChild(checkbox);

    li.appendChild(span);

    li.appendChild(actions);

    /* ADD LI TO LIST */

    taskList.appendChild(li);
  });

  updateTaskCount();
}

/* =====================================
   UPDATE TASK COUNT
===================================== */

function updateTaskCount() {
  const activeTasks = tasks.filter((task) => !task.completed).length;

  if (activeTasks === 1) {
    taskCount.textContent = "1 task remaining";
  } else {
    taskCount.textContent = `${activeTasks} tasks remaining`;
  }
}

/* =====================================
   COMPLETE / UNCOMPLETE TASK
===================================== */

function toggleTask(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return {
        ...task,
        completed: !task.completed,
      };
    }

    return task;
  });

  saveTasks();

  renderTasks();
}

/* =====================================
   DELETE TASK
===================================== */

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);

  saveTasks();

  renderTasks();
}

/* =====================================
   EDIT TASK
===================================== */

function editTask(taskId) {
  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return;
  }

  const newText = prompt("Edit your task:", task.text);

  if (newText === null) {
    return;
  }

  const trimmedText = newText.trim();

  if (trimmedText === "") {
    alert("Task cannot be empty.");

    return;
  }

  task.text = trimmedText;

  saveTasks();

  renderTasks();
}

/* =====================================
   ADD TASK FORM EVENT
===================================== */

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (text === "") {
    alert("Please enter a task.");

    return;
  }

  createTask(text);

  /* CLEAR INPUT */

  taskInput.value = "";

  taskInput.focus();
});

/* =====================================
   EVENT DELEGATION
===================================== */

taskList.addEventListener("click", function (event) {
  const taskItem = event.target.closest(".task-item");

  if (!taskItem) {
    return;
  }

  const taskId = Number(taskItem.dataset.id);

  const action = event.target.dataset.action;

  /* DELETE */

  if (action === "delete") {
    deleteTask(taskId);

    return;
  }

  /* EDIT */

  if (action === "edit") {
    editTask(taskId);

    return;
  }
});

/* =====================================
   CHECKBOX EVENT DELEGATION
===================================== */

taskList.addEventListener("change", function (event) {
  if (!event.target.classList.contains("task-checkbox")) {
    return;
  }

  const taskItem = event.target.closest(".task-item");

  const taskId = Number(taskItem.dataset.id);

  toggleTask(taskId);
});

/* =====================================
   FILTER BUTTONS
===================================== */

filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    currentFilter = this.dataset.filter;

    /* UPDATE ACTIVE BUTTON */

    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    this.classList.add("active");

    renderTasks();
  });
});

/* =====================================
   INITIAL RENDER
===================================== */

renderTasks();
