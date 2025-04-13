// netlify/functions/todos.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

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

// Middleware to authenticate using JWT
const authenticateToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
};

// Main handler
exports.handler = async (event, context) => {
  const method = event.httpMethod;

  if (method === 'GET') {
    // Handle GET request to fetch todos
    const token = event.headers.authorization && event.headers.authorization.split(' ')[1];
    if (!token) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Access denied, no token provided' }),
      };
    }

    const user = authenticateToken(token);
    try {
      const todos = await Todo.find({ userId: user.userId }).sort({ dueDate: 1 });
      return {
        statusCode: 200,
        body: JSON.stringify(todos),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching todos', error }),
      };
    }
  }

  if (method === 'POST') {
    // Handle POST request to add a todo
    const token = event.headers.authorization && event.headers.authorization.split(' ')[1];
    if (!token) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Access denied, no token provided' }),
      };
    }

    const user = authenticateToken(token);
    const { task, dueDate } = JSON.parse(event.body);
    if (!task || !dueDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Task and due date are required' }),
      };
    }

    const dueDateUTC = new Date(dueDate).toISOString();

    try {
      const newTodo = new Todo({
        task,
        completed: false,
        dueDate: dueDateUTC,
        userId: user.userId,
      });

      await newTodo.save();
      return {
        statusCode: 200,
        body: JSON.stringify(newTodo),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error saving todo', error }),
      };
    }
  }

  if (method === 'DELETE') {
    // Handle DELETE request to remove a todo
    const token = event.headers.authorization && event.headers.authorization.split(' ')[1];
    if (!token) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Access denied, no token provided' }),
      };
    }

    const user = authenticateToken(token);
    const { id } = event.queryStringParameters;

    try {
      await Todo.findOneAndDelete({ _id: id, userId: user.userId });
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Todo deleted' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error deleting todo', error }),
      };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
