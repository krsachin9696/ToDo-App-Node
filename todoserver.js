const express = require('express');
const fs = require('fs');
var session = require('express-session')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))

app.use(express.json());
app.use(express.urlencoded({extended: true }));

app.use(express.static("todoViews"));
app.use(express.static("uploads"));

app.use(upload.single("pic"));

app.get("/", function(req, res) {
    if(!req.session.isLoggedIn) {
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname + "/todoViews/index.html");
});

app.post("/todo", function (req, res) {
    const todo = {
        todoText: req.body.todoText,
        priority: req.body.priority,
        checked: false,
        imageFile: req.file.filename, // Save the image file in the todo object
    };
    // console.log(todo);
    saveTodoInFile(todo, function (err) {
        if(err){
            res.status(500).send("error");
            return; 
        }
        // res.status(200).send("success");
        res.status(200).json(todo);
    })
});

app.get("/todo-data", function (req, res) {
    // console.log(req.body);
    readAllTodos(function (err, data) {
        if(err) {
            res.status(500).send("error");
            return;
        }

        // res.status(200).send(data);
        res.status(200).json(data);
    });
});

app.delete("/delete-todo", function (req, res) {
    const todoToDelete = req.body;

    // Implement the logic to delete the task from the file
    deleteTodoFromFile(todoToDelete, function (err) {
        if (err) {
            console.error("Error deleting task:", err);
            res.status(500).send("Error deleting task.");
        } else {
            res.status(200).send("Task deleted successfully.");
        }
    });
});

app.put("/update-todo", function (req, res) {
    const todoToUpdate = req.body;
  
    // Implement the logic to update the checked status of the task in the local file
    updateTodoCheckedStatusInFile(todoToUpdate.todoText, todoToUpdate.checked, function (err) {
      if (err) {
        console.error("Error updating task checked status:", err);
        res.status(500).send("Error updating task checked status.");
      } else {
        res.status(200).send("Task checked status updated successfully.");
      }
    });
  });


app.get("/about", function(req,res) {
    if(!req.session.isLoggedIn) {
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname + "/todoViews/about.html");
});

app.get("/contact", function (req, res) {
    if(!req.session.isLoggedIn) {
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname + "/todoViews/contact.html");
});

app.get("/todo", function (req, res) {
    if(!req.session.isLoggedIn) {
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname + "/todoViews/todo.html");
});

// app.get("/scripts/todoScript.js", function (req, res) {
//     res.sendFile(__dirname + "/todoViews/scripts/todoScript.js");
// });

app.get("/login", function(req, res) {
    res.sendFile(__dirname + "/todoViews/login.html");
});

app.post("/login", function(req, res) {
    
    const username = req.body.username;
    const password = req.body.password;

    // console.log(username, password);
    if(username === password) {
        // res.status(200).send("success");
        req.session.isLoggedIn = true;
        req.session.username = username;
        res.redirect("/");
        return;
    }

    res.status(401).send("error");
});


app.listen(3000, function () {
    console.log("connection brabar chhe");
});


function readAllTodos(callback){
    fs.readFile("./treasure.txt", "utf-8", function (err, data) {
        if (err){
            callback(err);
            return;
        }
        
        if (data.length === 0){
            data = "[]";
        }

        try{
            data = JSON.parse(data);
            callback(null, data);
        } catch (err) {
            callback([]);
        }
    });
}

function saveTodoInFile(todo, callback){
    
    readAllTodos(function (err, data) {
        if(err){
            callback(err);
            return;
        }

        data.push(todo);

        fs.writeFile("./treasure.txt", JSON.stringify(data), function (err) {
            if(err) {
                callback(err);
                return;
            }

            callback(null);
        });
    });
}


function deleteTodoFromFile(todo, callback) {
    readAllTodos(function (err, data) {
        if (err) {
            callback(err);
            return;
        }

        // Find and remove the task with matching todoText
        data = data.filter((item) => item.todoText !== todo.todoText);

        fs.writeFile("./treasure.txt", JSON.stringify(data), function (err) {
            if (err) {
                callback(err);
                return;
            }

            callback(null);
        });
    });
}



function updateTodoCheckedStatusInFile(todoText, checkedStatus, callback) {
    readAllTodos(function (err, data) {
      if (err) {
        callback(err);
        return;
      }
  
      // Find the task with the matching todoText
      const taskToUpdate = data.find((task) => task.todoText === todoText);
      if (taskToUpdate) {
        taskToUpdate.checked = checkedStatus;
      }
  
      fs.writeFile("./treasure.txt", JSON.stringify(data), function (err) {
        if (err) {
          callback(err);
          return;
        }
  
        callback(null);
      });
    });
  }