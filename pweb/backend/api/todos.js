const mongoose = require('mongoose');
const Todo = require('../models/Todo');
const authenticateToken = require('../middleware/authenticateToken');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return getTodos(req, res);
  } else if (req.method === 'POST') {
    return createTodo(req, res);
  } else if (req.method === 'DELETE') {
    return deleteTodo(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.userId }).sort({ dueDate: 1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
};

const createTodo = async (req, res) => {
  try {
    const { task, dueDate } = req.body;
    if (!task || !dueDate) {
      return res.status(400).json({ message: 'Task and due date are required' });
    }

    const dueDateUTC = new Date(dueDate).toISOString();
    const newTodo = new Todo({
      task,
      completed: false,
      dueDate: dueDateUTC,
      userId: req.user.userId,
    });

    await newTodo.save();
    res.json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error saving todo', error });
  }
};

const deleteTodo = async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
};
