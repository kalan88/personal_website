const mongoose = require('mongoose');
const { Handler } = require('@netlify/functions');
const dotenv = require('dotenv');

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
});

const Todo = mongoose.model('Todo', TodoSchema);

// Define a handler for the to-do API
exports.handler = async function (event, context) {
  const { httpMethod, path, body, queryStringParameters } = event;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
  };

  // Handle preflight CORS request
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: 'Preflight OK',
    };
  }

  // Handle GET request to fetch all todos
  if (httpMethod === 'GET' && path === '/todos') {
    try {
      const todos = await Todo.find().sort({ dueDate: 1 });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(todos),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Error fetching todos', error }),
      };
    }
  }

  // Handle POST request to create a new todo
  if (httpMethod === 'POST' && path === '/todos') {
    try {
      const { task, dueDate } = JSON.parse(body);
      if (!task || !dueDate) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Task and due date are required' }),
        };
      }

      const dueDateUTC = new Date(dueDate).toISOString();  // Convert to UTC

      const newTodo = new Todo({
        task,
        completed: false,
        dueDate: dueDateUTC,
      });

      await newTodo.save();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(newTodo),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Error saving todo', error }),
      };
    }
  }

  // Handle DELETE request to remove a todo
  if (httpMethod === 'DELETE' && path.startsWith('/todos/')) {
    const todoId = path.split('/')[2];  // Extract todo ID from URL
    try {
      await Todo.findByIdAndDelete(todoId);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Todo deleted' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Error deleting todo', error }),
      };
    }
  }

  // Return error for unsupported HTTP methods
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
  };
};
