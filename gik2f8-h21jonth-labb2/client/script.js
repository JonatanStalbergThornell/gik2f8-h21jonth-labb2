"use strict";

const api = new Api("http://localhost:5000/tasks");

todoForm.title.addEventListener("input", (e) => validateField(e.target));
todoForm.title.addEventListener("blur", (e) => validateField(e.target));
todoForm.description.addEventListener("input", (e) => validateField(e.target));
todoForm.description.addEventListener("blur", (e) => validateField(e.target));
todoForm.dueDate.addEventListener("input", (e) => validateField(e.target));
todoForm.dueDate.addEventListener("blur", (e) => validateField(e.target));
todoForm.addEventListener("submit", onSubmit);

const todoListElement = document.getElementById("todoList");

let titleValid = false;
let descriptionValid = false;
let dueDateValid = false;

function validateField(field) {
  const { name, value } = field;

  let validationMessage = "";
  switch (name) {
    case "title": {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste vara minst 2 tecken";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken ";
      } else {
        titleValid = true;
      }
      break;
    }
    case "description": {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrivning' får ej innehålla mer än 500 tecken";
      } else {
        descriptionValid = true;
      }
      break;
    }
    case "dueDate": {
      if (value.length === 0) {
        dueDate = false;
        validationMessage = "Fältet 'Slutförd' är obligatorisk";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }
  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove("hidden");
}

function onSubmit(e) {
  e.preventDefault();

  if (titleValid && descriptionValid && dueDateValid) {
    //console.log("Submittsky");
    saveTask();
  }

  function saveTask() {
    const task = {
      title: todoForm.title.value,
      description: todoForm.description.value,
      dueDate: todoForm.dueDate.value,
      completed: false,
    };

    api.create(task).then((task) => {
      if (task) {
        renderList();
      }
    });
  }
}

function renderList() {
  api.getAll().then((tasks) => {
    tasks.sort((a, b) => {
      if (a.completed && !b.completed) {
        return 1;
      }
      if (!a.completed && b.completed) {
        return -1;
      }
      if (a.dueDate < b.dueDate) {
        return -1;
      }
      if (a.dueDate > b.dueDate) {
        return 1;
      }
      return 0;
    });
    todoListElement.innerHTML = "";
    tasks.forEach((task) => {
      if (tasks && tasks.length > 0) {
        todoListElement.insertAdjacentHTML(
          "beforeend",
          renderTask(task, tasks)
        );

        const checkboxes = document.querySelectorAll(".checkbox");
        checkboxes.forEach(editTasks);
      }
    });
  });
}

function renderTask({ id, title, description, dueDate, completed }, tasks) {
  //console.log(tasks);

  let html = `
  <li  class="select-none mt-2 py-2 border-b border-amber-300">
    <div class="flex items-center">
      <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">`;
  if (completed) {
    html += `<s>`;
  }

  html += ` ${title}`;
  if (completed) {
    html += `</s>`;
  }
  html += `
   </h3>
      <div>
      
        <span>${dueDate}</span>
        <input type="checkbox" id="${id}" class="checkbox inline-block m-2 bg-white"
        ${completed ? "checked" : ""} 
      />
        <button onclick="deleteTask(${id})" onclick="deleteTask(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
      </div>
    </div>`;
  description &&
    (html += `
    <p class="ml-8 mt-2 text-xs italic">${description}</p>
`);
  html += `
  </li>`;

  return html;
}

function editTasks(checkbox) {
  checkbox.addEventListener("change", (e) => {
    if (checkbox.checked) {
      const completed = {
        completed: true,
      };
      api.patch(checkbox.id, completed).then((result) => {
        console.log(result);
        renderList();
      });
    } else {
      const completed = {
        completed: false,
      };
      api.patch(checkbox.id, completed).then((result) => {
        console.log(result);
        renderList();
      });
    }
  });
}

function deleteTask(id) {
  api.remove(id).then((result) => {
    console.log(result);
    renderList();
  });
}

renderList();
