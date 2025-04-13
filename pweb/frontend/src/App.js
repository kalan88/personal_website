import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');

  const BASE_URL = 'https://kalan88backend.netlify.app/.netlify/functions';

  // Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/todos`);
        const sortedTodos = response.data.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
        setTodos(sortedTodos);
      } catch (error) {
        console.error('Error fetching todos', error);
      }
    };

    fetchTodos();
  }, []); // Fetch todos once on component mount

  const addTodo = () => {
    if (!task.trim() || !dueDate) return;

    const dueDateISO = new Date(dueDate).toISOString();

    axios
      .post(
        `${BASE_URL}/todos`,
        { task, dueDate: dueDateISO }
      )
      .then((response) => {
        setTodos((prevTodos) => {
          const updatedTodos = [...prevTodos, response.data];
          return updatedTodos.sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
          );
        });
      })
      .catch((error) => console.error('Error adding todo', error));

    setTask('');
    setDueDate('');
  };

  const deleteTodo = (id) => {
    axios
      .delete(`${BASE_URL}/todos/${id}`)  // Pass the todoId in the URL path
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        updatedTodos.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
        setTodos(updatedTodos);
      })
      .catch((error) => console.error('Error deleting todo', error));
  };
  

  const formatDueDate = (date) => {
    return new Date(date).toISOString().slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-amber-400 flex items-start justify-center space-x-8 p-8">
      {/* Input Section */}
      <div className="w-1/3 bg-gray-700 text-white shadow-md border-2 border-amber-300 p-6 rounded-xl hover:bg-opacity-20 transition-all duration-300">
        <h1 className="text-2xl font-semibold mb-4 text-amber-200 font-serif">Add Task</h1>

        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full mb-4 p-2 border bg-gray-800 border-gray-900 font-serif rounded text-amber-200 placeholder-amber-200  
            focus:outline-none focus:ring-0 focus:border-amber-400"
          placeholder="Enter a task"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full mb-4 p-2 border bg-gray-800 font-serif border-gray-900 rounded text-amber-200
            focus:outline-none focus:ring-0 focus:border-amber-400"
        />

        <button
          onClick={addTodo}
          className="w-full bg-amber-400 text-gray-800 p-2 rounded font-bold font-serif hover:bg-amber-500 transition-all"
        >
          Add Todo
        </button>
      </div>

      {/* List Section */}
      <div className="w-2/3 bg-gray-700 text-white shadow-md border-2 border-amber-300 p-6 rounded-xl hover:bg-opacity-20 transition-all duration-300">
        <h2 className="text-2xl font-semibold mb-4 text-amber-200 font-serif">To-do List</h2>

        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div className="flex space-x-4 items-center">
                <span className="text-xl text-amber-300 font-serif">{todo.task}</span>
                <span className="ml-3 text-gray-400 text-sm font-serif">
                  Due: {formatDueDate(todo.dueDate)}
                </span>
              </div>

              <button
                onClick={() => deleteTodo(todo._id)}
                className="w-15 bg-amber-400 text-gray-800 p-2 rounded font-bold font-serif hover:bg-amber-500 transition-all"
              >
                Completed
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
