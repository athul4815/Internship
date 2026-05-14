const addBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");

const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

let currentFilter = "all";

addBtn.addEventListener("click", addTask);
clearCompletedBtn.addEventListener("click", clearCompleted);


function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (text === "") {
    alert("Task Empty!!!!!\nEnter a task!!!");
    return;
  }

  const li = document.createElement("li");

  const taskLeft = document.createElement("div");
  taskLeft.className = "task-left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const span = document.createElement("span");
  span.textContent = text;

  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed");
    updateCounters();
    applyFilter();
  });

  taskLeft.appendChild(checkbox);
  taskLeft.appendChild(span);

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Delete task";
  removeBtn.className = "remove-btn";

  removeBtn.onclick = () => {
    li.remove();
    updateCounters();
  };

  li.appendChild(taskLeft);
  li.appendChild(removeBtn);

  taskList.appendChild(li);

  input.value = "";

  updateCounters();
  applyFilter();
}


function updateCounters() {
  const tasks = taskList.querySelectorAll("li");
  const completed = taskList.querySelectorAll("li.completed");

  totalCount.textContent = `Total: ${tasks.length}`;
  completedCount.textContent = `Completed: ${completed.length}`;
}


filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    applyFilter();
  });
});

function applyFilter() {
  const tasks = taskList.querySelectorAll("li");

  tasks.forEach(task => {
    switch (currentFilter) {
      case "active":
        task.style.display = task.classList.contains("completed") ? "none" : "flex";
        break;
      case "completed":
        task.style.display = task.classList.contains("completed") ? "flex" : "none";
        break;
      default:
        task.style.display = "flex";
    }
  });
}


function clearCompleted() {
  const completedTasks = taskList.querySelectorAll("li.completed");
  completedTasks.forEach(task => task.remove());

  updateCounters();
}