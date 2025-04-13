const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Todo Schema
const TodoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  dueDate: { type: Date, required: true },
  userId: { type: String, required: true },
});

const Todo = mongoose.model('Todo', TodoSchema);

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Routes
app.get('/todos', authenticateToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.userId }).sort({ dueDate: 1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
});

app.post('/todos', authenticateToken, async (req, res) => {
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
});

app.delete('/todos/:id', authenticateToken, async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
});

app.get('/new-session', (req, res) => {
  const userId = uuidv4();
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// ✅ Export app instead of listening
module.exports = app;
