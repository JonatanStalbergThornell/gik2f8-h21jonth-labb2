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
        checkboxes.forEach(updateTask);
      }
    });
  });
}

function renderTask({ id, title, description, dueDate, completed }) {
  /* Baserat på inskickade egenskaper hos task-objektet skapas HTML-kod med styling med hjälp av tailwind-klasser. Detta görs inuti en templatestring  (inom`` för att man ska kunna använda variabler inuti. Dessa skrivs inom ${}) */

  /*
  Det som skrivs inom `` är vanlig HTML, men det kan vara lite svårt att se att det är så. Om man enklare vill se hur denna kod fungerar kan man klistra in det i ett HTML-dokument, för då får man färgkodning och annat som kan underlätta. Om man gör det kommer dock ${...} inte innehålla texten i variabeln utan bara skrivas ut som det är. Men det är lättare att felsöka just HTML-koden på det sättet i alla fall. 
  */

  /* Lite kort om vad HTML-koden innehåller. Det mesta är bara struktur och Tailwind-styling enligt eget tycke och smak. Värd att nämna extra är dock knappen, <button>-elementet, en bit ned. Där finns ett onclick-attribut som kopplar en eventlyssnare till klickeventet. Eventlyssnaren här heter onDelete och den får med sig egenskapen id, som vi fått med oss från task-objektet. Notera här att det går bra att sätta parenteser och skicka in id på detta viset här, men man fick inte sätta parenteser på eventlyssnare när de kopplades med addEventListener (som för formulärfälten högre upp i koden). En stor del av föreläsning 3 rörande funktioner och event förklarar varför man inte får sätta parenteser på callbackfunktioner i JavaScriptkod. 
  
  När eventlyssnaren kopplas till knappen här nedanför, görs det däremot i HTML-kod och inte JavaScript. Man sätter ett HTML-attribut och refererar till eventlyssnarfunktionen istället. Då fungerar det annorlunda och parenteser är tillåtna. */
  let html = "";
  if (completed) {
    html = `
    <li class="select-none mt-2 py-2 border-b border-blue-300">
      <div class="flex items-center">
        <h3 class="mb-3 flex-1 text-medium font-bold text-green-400 uppercase">${title} (Avklarad)  </h3>
        <div>
          <span>${dueDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block hover:drop-shadow-md bg-green-300 text-xs text-green-900 border border-black px-3 py-1 rounded-md ml-2">Klar! Ta bort från lista</button>
        </div>
      </div>`;
  } else {
    html = `
      <li class="select-none mt-2 py-2 border-b border-blue-300">
        <div class="flex items-center">
          <h3 class="mb-3 flex-1 text-medium font-bold text-red-300 uppercase">${title}</h3>
          <div>
            <span>${dueDate}</span>
            <button onclick="deleteTask(${id})" class="inline-block hover:drop-shadow-md bg-gray-300 text-xs text-black-900 border border-black px-3 py-1 rounded-md ml-2">Ta bort</button>
          </div>
        </div>`;
  }

  /* Här har templatesträngen avslutats tillfälligt för att jag bara vill skriva ut kommande del av koden om description faktiskt finns */

  description &&
    /* Med hjälp av && kan jag välja att det som står på andra sidan && bara ska utföras om description faktiskt finns.  */

    /* Det som ska göras om description finns är att html-variabeln ska byggas på med HTML-kod som visar det som finns i description-egenskapen hos task-objektet. */
    (html += `
      <p class="ml-8 mt-2 text-xs italic">${description}</p>
  `);

  /* När html-strängen eventuellt har byggts på med HTML-kod för description-egenskapen läggs till sist en sträng motsvarande sluttaggen för <li>-elementet dit. */
  html += `
        <input id="default-checkbox" ${
          completed ? "checked" : ""
        } onclick="updateTask(${id}, event)" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-blue-900 rounded border-blue-300 focus:ring-blue-500 dark:focus:ring-pink-600 dark:ring-offset-pink-800 focus:ring-2 dark:bg-blue-700 dark:border-blue-600">
        <label for="default-checkbox" class="ml-2 text-sm font-medium dark:text-gray-800">Uppgift avklarad</label>
    </li>`;
  /***********************Labb 2 ***********************/
  /* I ovanstående template-sträng skulle det vara lämpligt att sätta en checkbox, eller ett annat element som någon kan klicka på för att markera en uppgift som färdig. Det elementet bör, likt knappen för delete, också lyssna efter ett event (om du använder en checkbox, kolla på exempelvis w3schools vilket element som triggas hos en checkbox när dess värde förändras.). Skapa en eventlyssnare till det event du finner lämpligt. Funktionen behöver nog ta emot ett id, så den vet vilken uppgift som ska markeras som färdig. Det skulle kunna vara ett checkbox-element som har attributet on[event]="updateTask(id)". */
  /***********************Labb 2 ***********************/

  /* html-variabeln returneras ur funktionen och kommer att vara den som sätts som andra argument i todoListElement.insertAdjacentHTML("beforeend", renderTask(task)) */
  return html;
}

function updateTask(id, event) {
  let completed = event.target.checked;
  console.log("är checkad", completed);
  const checked = {
    completed: completed,
  };
  console.log(checked);
  api.update(id, checked).then((result) => renderList());
}

function deleteTask(id) {
  api.remove(id).then((result) => {
    console.log(result);
    renderList();
  });
}

renderList();
