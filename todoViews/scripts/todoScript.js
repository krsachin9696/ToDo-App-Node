// const submitTodoNode = document.getElementById("submitTodo");
const userInputNode = document.getElementById("userInput");
const prioritySelectorNode = document.getElementById("prioritySelector");
const todoListNode = document.getElementById("todo-item");

const image = document.getElementById("image"); // The variable imageture will store a reference to the input element that allows users to select and upload a file. 
                                            // However, it does not directly store the image itself. Instead, it stores a reference to the input element.

const todoForm = document.getElementById("todo-container");
// console.log(todoForm);

// submitTodoNode.addEventListener("click", function (event) {
todoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData();

    const todoText = userInputNode.value;
    userInputNode.value = "";
    const priority = prioritySelectorNode.value;
    prioritySelectorNode.value = "";
    const image = image.files[0];

    formData.append('todoText', todoText);
    formData.append('priority', priority);
    formData.append('checked', false);
    formData.append('image', image);
    
    
    // console.log(image);
    
    if(!todoText || !priority){
        alert("please enter a todo & select its priority");
        return;
    }

    const todo = {
        todoText,   // it is actually written as todoText: todoText, but 
        priority,   // if the key & value name is same then it can also be written as it is written 
        checked: false, // Set the initial checked status to false
        image,
    };

    console.log(todo);

    fetch("/todo", {       // The fetch function is a modern way to make network requests, 
        // method: "POST",    // and in this case, it's used to send the todo object to the server.
        // headers: {
        //     "Content-Type": "application/json",
        // },
        // body: JSON.stringify(todo),
        body: formData,
    })
    .then(function (response) {
        if(response.status === 200){
            showTodoInUI(todo);
            // showTodoInUI(formData);
        }
        else{
            alert("something went wrong");
        }
    });
    // .then(function (response) {
    //     if (response.status === 200) {
    //       return response.json();
    //     } else {
    //       throw new Error("Something went wrong");
    //     }
    //   })
    //   .then(function (data) {
    //     // Handle successful response here
    //     showTodoInUI(data);
    //   })
    //   .catch(function (error) {
    //     // Handle error here
    //     console.error(error);
    //     alert("Something went wrong");
    //   });
});


function showTodoInUI(todo) {
    const todoItemNode = document.createElement("div");
    todoItemNode.classList.add("todo-item");
  
    const checkboxNode = document.createElement("input");
    checkboxNode.type = "checkbox";
    checkboxNode.classList.add("checkbox");
    checkboxNode.checked = todo.checked; // Set the initial checked status of the checkbox
    if(checkboxNode.checked){
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
    
  
    todoItemNode.appendChild(checkboxNode);
    todoItemNode.appendChild(todoTextNode);
    todoItemNode.appendChild(priorityNode);
    todoItemNode.appendChild(deleteButtonNode);

    checkboxNode.classList.add("todo-checkbox");
    todoTextNode.classList.add("todo-task");
    priorityNode.classList.add("todo-priority");
    deleteButtonNode.classList.add("todo-delete");

    todoListNode.appendChild(todoItemNode);

    // Add the custom data attribute to the task container
  todoItemNode.dataset.todo = todo.todoText;

  todoListNode.appendChild(todoItemNode);
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
  