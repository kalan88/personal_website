const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Use UUID for unique user ID

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
  userId: { type: String, required: true }, // Associate each to-do with a user
});

const Todo = mongoose.model('Todo', TodoSchema);

// Middleware to authenticate using JWT (with random userID for each session)
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];  // Get the token from the header

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
    req.user = user;  // Attach the user info to the request
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Routes to handle to-do items
app.get('/todos', authenticateToken, async (req, res) => {
  try {
    // Fetch to-dos associated with the unique user ID
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

    const newTodo = new Todo({
      task,
      completed: false,
      dueDate,
      userId: req.user.userId,  // Associate with the unique user ID
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error saving todo', error });
  }
});

app.delete('/todos/:id', authenticateToken, async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });  // Delete todo for the specific user
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
});

// Route to generate JWT token (for a new user session)
app.get('/new-session', (req, res) => {
  const userId = uuidv4();  // Generate a new unique ID for the user
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });  // Issue a token with the unique user ID

  res.json({ token });  // Return the token to the frontend
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
