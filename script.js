const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

// This array will store all the tasks along with their associated data, including title, due date, and description. This storage will enable you to keep track of tasks, display them on the page, and save them to localStorage.
const taskData = JSON.parse(localStorage.getItem("data")) || [];

// This variable will be used to track the state when editing and discarding tasks.
let currentTask = {};

const addOrUpdateTask = () => {
  // Find the index of the current task in the taskData array
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);

  // Create a taskObj with values from the input fields
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

  // If the task is not in the array, add it to the beginning
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }
  // this will enable you to save the tasks to localStorage
  localStorage.setItem("data", JSON.stringify(taskData));

  updateTaskContainer();
  reset();
};

const updateTaskContainer = () => {
  // Clear the tasksContainer. If this is not done, the tasks will be duplicated every time you add a new task.
  tasksContainer.innerHTML = "";
  // Display tasks in the tasksContainer
  taskData.forEach(({ id, title, date, description }) => {
    tasksContainer.innerHTML += `
    <div class="task" id="${id}"> 
    <p><strong>Title:</strong>${title}</p>
    <p><strong>Date:</strong>${date}</p>
    <p><strong>Description:</strong>${description}</p>
    <button onclick="editTask(this)" type="button" class="btn">Edit</button>
    <button onclick="deleteTask(this)" type="button" class="btn">Delete</button>
    </div> `;
  });
};

const deleteTask = (buttonEl) => {
  // You need to find the index of the task you want to delete first.
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );
  // You need to remove the task from the DOM using remove() and from the taskData array using splice().
  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);

  // You need to save the updated taskData array to localStorage.
  localStorage.setItem("data", JSON.stringify(taskData));
};

const editTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );
  // You need to set the currentTask object to the task you want to edit. This will enable you to track the state of the task when you discard the changes.
  currentTask = taskData[dataArrIndex];
  // You need to set the input values to the values of the currentTask object.
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  addOrUpdateTaskBtn.innerText = "Update Task";
  taskForm.classList.toggle("hidden");
};

// Reset function to clear input fields and hide the task form
const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
};

// this will enable you to display the tasks on the page when the page loads. if its not done, the tasks will not be displayed on the page when you refresh the page.
if (taskData.length) {
  updateTaskContainer();
}

openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

closeTaskFormBtn.addEventListener("click", () => {
  // Check if form inputs have values before showing the confirm dialog
  const formInputsContainValues =
    titleInput.value || dateInput.value || descriptionInput.value;

  const formInputValuesUpdated =
    titleInput.value !== currentTask.title ||
    dateInput.value !== currentTask.date ||
    descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrUpdateTask();
});

// You need to determine whether the task being added already exists or not. If it doesn't exist, you will add it, and if it already exists, you will set it up for editing.
