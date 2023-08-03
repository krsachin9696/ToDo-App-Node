const submitTodoNode = document.getElementById("todo-container");
const userInputNode = document.getElementById("userInput");
const prioritySelectorNode = document.getElementById("prioritySelector");
const picInputNode = document.getElementById("pic");
const todoListNode = document.getElementById("todo-item");

submitTodoNode.addEventListener("submit", function (event) {
    event.preventDefault();
    const todoText = userInputNode.value;
    userInputNode.value = "";
    const priority = prioritySelectorNode.value;
    prioritySelectorNode.value = "";

    const imageFile = picInputNode.files[0];
    console.log(imageFile);
    
    if(!todoText || !priority || !imageFile){
        alert("please enter a todo & select its priority and choose an image");
        return;
    }

    const todo = {
        todoText,   // it is actually written as todoText: todoText, but 
        priority,   // if the key & value name is same then it can also be written as it is written 
        checked: false, // Set the initial checked status to false
        imageFile,
    };
    // console.log(todo, "ye todo hai");

    const formData = new FormData(); // Create a new FormData object
    formData.append("todoText", todoText); // Append form fields to the FormData object
    formData.append("priority", priority);
    formData.append("pic", imageFile);
    // console.log(formData, "aur ye formData h");

    fetch("/todo", {       // The fetch function is a modern way to make network requests, 
        method: "POST",    // and in this case, it's used to send the todo object to the server.

        body: formData, // Use the FormData object as the request body
    }).then(function (response) {
        if(response.status === 200){
            showTodoInUI(todo);
            // showTodoInUI(formData); // Pass the formData object to the UI function
        }
        else{
            alert("something went wrong");
        }
    });
});

function showTodoInUI(todo) {

    const todoItemNode = document.createElement("div");
    todoItemNode.classList.add("todo-item");

    const checkboxNode = document.createElement("input");
    checkboxNode.type = "checkbox";
    checkboxNode.classList.add("checkbox");
    checkboxNode.checked = todo.checked; // Set the initial checked status of the checkbox
    if (checkboxNode.checked) {
        todoItemNode.classList.toggle("done", checkboxNode.checked);
    }

    checkboxNode.addEventListener("change", function () {
        // Mark the task as done when the checkbox is checked
        todoItemNode.classList.toggle("done", checkboxNode.checked);
        // Update the checked status on the server when the checkbox is changed
        updateCheckedStatusOnServer(todo.todoText, checkboxNode.checked);
    });

    const todoTextNode = document.createElement("div");
    todoTextNode.innerText = todo.todoText;
    todoTextNode.classList.add("task");

    const priorityNode = document.createElement("div");
    priorityNode.innerText = todo.priority;
    priorityNode.classList.add("priority");

    const deleteButtonNode = document.createElement("div");
    deleteButtonNode.innerText = "Delete";
    deleteButtonNode.classList.add("delete-button");

    deleteButtonNode.addEventListener("click", function () {
        deleteTodoOnServer(todo); // Call the function to delete the task on the server
        todoItemNode.remove(); // Remove the task from the UI
    });

    // Image Display
    const img = document.createElement("img");
    img.setAttribute("src", todo.imageFile);
    img.alt = "Task Image";
    img.classList.add("task-image");

    todoItemNode.appendChild(checkboxNode);
    todoItemNode.appendChild(todoTextNode);
    todoItemNode.appendChild(priorityNode);
    todoItemNode.appendChild(img);
    todoItemNode.appendChild(deleteButtonNode);

    checkboxNode.classList.add("todo-checkbox");
    todoTextNode.classList.add("todo-task");
    priorityNode.classList.add("todo-priority");
    img.classList.add("todo-image");
    deleteButtonNode.classList.add("todo-delete");

    todoListNode.appendChild(todoItemNode);

    // Add the custom data attribute to the task container
    todoItemNode.dataset.todo = todo.todoText;
}

  

fetch("/todo-data")
.then(function (response) {
    if(response.status === 200) {
        return response.json();
    }
    else{
        alert("something went wrong");
    }
})
.then(function(todos){
    todos.forEach(function(todo){
        showTodoInUI(todo);
    });
});

function deleteTodoOnServer(todo) {
    fetch("/delete-todo", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    })
    .then(function (response) {
        if (response.status === 200) {
            // Task deleted successfully on the server, do any additional handling if needed
        } else {
            alert("Failed to delete the task.");
        }
    });
}


function updateCheckedStatusOnServer(todoText, checkedStatus) {
    fetch("/update-todo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todoText, checked: checkedStatus }),
    })
      .then(function (response) {
        if (response.status === 200) {
          // Task checked status updated successfully on the server
          // You can perform additional handling here if needed
        } else {
          alert("Failed to update the task's checked status.");
        }
      });
  }
  