{
  "use strict";
  // Define UI vars.
  const form = document.querySelector("#task-form");
  const taskList = document.querySelector(".collection");
  const clearBtn = document.querySelector(".clear-tasks");
  const filter = document.querySelector("#filter");
  const taskInput = document.querySelector("#task");
  const cardAction = document.querySelector(".card-action");

  // Load all event listeners.
  loadEventlinsters();

  function loadEventlinsters() {
    // DOM Load event.
    document.addEventListener("DOMContentLoaded", getTasks);
    // Add task event.
    form.addEventListener("submit", addTask);
    // Remove task event.
    taskList.addEventListener("click", removeTask);
    // Clear task event.
    clearBtn.addEventListener("click", clearTasks);
    // Filter task event.
    filter.addEventListener("keyup", filterTasks);
  }

  // Get tasks from LS.
  function getTasks() {
    let tasks;
    if (localStorage.getItem("tasks") === null || localStorage.getItem("tasks").length === 0) {
      tasks = [];
      cardAction.style.display = "none";
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.forEach(function(task) {
      taskList.innerHTML += renderTask(task);
      cardAction.style.display = "block";
    });
  }

  function renderTask(value) {
    return "<li class='collection-item'>" +
      "<i class='fa fa-thumb-tack' aria-hidden='true'></i>" +
      value +
      "<a href='#' class='delete-item secondary-content'>" +
      "<i class='fa fa-remove' aria-hidden='true'></i>" +
      "</a>" +
      "</li>"
  }

  // Add Task.
  function addTask(event) {
    event.preventDefault();
    if (taskInput.value === "") {
      Materialize.toast("The input field is empty, please fill the Task name.", 3000, "red rounded");
      return;
    }
    if (taskInput.value.length < 6) {
      Materialize.toast("Task length should be more than 6 characters long.", 3000, "red rounded");
      return;
    }

    taskList.innerHTML += renderTask(taskInput.value.trim());
    // Store in LS.
    storeTaskInLocalStorage(taskInput.value);
    taskInput.value = "";
    cardAction.style.display = "block";
    Materialize.toast("Task successfully added!", 3000, "green rounded");
  }

  // Store single task in LS.
  function storeTaskInLocalStorage(task) {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Remove Task.
  function removeTask(event) {
    if (event.target.parentElement.classList.contains("delete-item")) {
      const allItems = document.querySelectorAll(".collection-item");
      if (confirm("Are you sure?")) {
        let itemTextContent;
        let itemToRemove = event.target.parentElement.parentElement;
        itemToRemove.remove();

        // Check is text content to long, it will break the UI message.
        if (itemToRemove.textContent.length < 20) {
          itemTextContent = itemToRemove.textContent.trim();
        } else {
          itemTextContent = itemToRemove.textContent.trim().substr(0, 18) + "...";
        }
        // Remove from LS.
        removeTaskFromLocalStorage(event.target.parentElement.parentElement);
        filter.value = "";

        // Set display block to all items after searched delete.
        allItems.forEach(function(item) {
          item.style.display = "block";
        });

        Materialize.toast("Task " + itemTextContent + " successfully deleted.", 3000, "green rounded");
      }
    }
    return;
  }

  // Remove single task from LS.
  function removeTaskFromLocalStorage(taskItem) {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.forEach(function(task, i) {
      if (taskItem.textContent === task) {
        tasks.splice(i, 1);
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    if (JSON.parse(localStorage.getItem("tasks")).length === 0) {
      localStorage.clear("tasks");
      cardAction.style.display = "none";
    }
  }

  // Clear Tasks.
  function clearTasks() {
    if (taskList.children.length) {
      while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
      }
      localStorage.clear("tasks");
      cardAction.style.display = "none";
      Materialize.toast("Successfully cleared all Tasks.", 3000, "green rounded");
    }
  }

  // Filter Tasks
  function filterTasks(e) {
    const text = e.target.value.toLowerCase();
    const elements = document.querySelectorAll(".collection-item");
    const notFound = document.querySelector(".collection-not-found");
    elements.forEach(function(task) {
      const item = task.textContent;
      if (item.toLowerCase().indexOf(text) != -1) {
        task.style.display = "block";
        if (!notFound.classList.contains("hide")) {
          notFound.classList.add("hide");
        }
      } else {
        task.style.display = "none";
        notFound.classList.remove("hide");
      }
    });
  }
}