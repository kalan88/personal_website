const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Create a Todo Schema
const TodoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  dueDate: { type: Date, required: true },
});

const Todo = mongoose.model('Todo', TodoSchema);

// Routes for handling to-do items
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ dueDate: 1 }); // Sorting by due date (ascending)
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { task, dueDate } = req.body;
    if (!task || !dueDate) {
      return res.status(400).json({ message: 'Task and due date are required' });
    }

    const newTodo = new Todo({
      task,
      completed: false,
      dueDate,
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error saving todo', error });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
