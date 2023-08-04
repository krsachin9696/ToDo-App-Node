// const mongoose = require('mongoose');


// const todos = new mongoose.Schema({
//     todoText: String,
//     priority: String,
//     checked: String,
//     imageFile: String,
// });

// const todo=mongoose.model("todoTable",todos);
// module.exports=todo;

const mongoose = require('mongoose');

const todosSchema = new mongoose.Schema({
    todoText: String,
    priority: String,
    checked: Boolean,
    imageFile: String,
});

const Todo = mongoose.model("Todo", todosSchema);

module.exports = Todo;
