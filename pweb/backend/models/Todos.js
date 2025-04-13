const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  dueDate: { type: Date, required: true },
  userId: { type: String, required: true },
});

const Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;
