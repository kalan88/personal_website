import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');

  const BASE_URL = 'https://personal-website-6pxg.onrender.com';

  useEffect(() => {
    const initializeSession = async () => {
      let token = localStorage.getItem('jwtToken');

      if (!token) {
        try {
          const response = await axios.get(`${BASE_URL}/new-session`);
          token = response.data.token;
          if (token) {
            localStorage.setItem('jwtToken', token);
          } else {
            console.error('Token missing from /new-session response');
            return;
          }
        } catch (error) {
          console.error('Error creating session:', error);
          return;
        }
      }

      fetchTodos(token);
    };

    initializeSession();
  }, []);

  const fetchTodos = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedTodos = response.data.sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      );
      setTodos(sortedTodos);
    } catch (error) {
      console.error('Error fetching todos', error);
    }
  };

  const addTodo = () => {
    if (!task.trim() || !dueDate) return;

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.log('No token found, cannot add todo');
      return;
    }

    // Convert the dueDate to ISO format before sending to backend (UTC)
    const dueDateISO = new Date(dueDate).toISOString();  // Convert to UTC before sending to the backend

    axios
      .post(
        `${BASE_URL}/todos`,
        { task, dueDate: dueDateISO },
        { headers: { Authorization: `Bearer ${token}` } }
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
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.log('No token found, cannot delete todo');
      return;
    }

    axios
      .delete(`${BASE_URL}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        updatedTodos.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
        setTodos(updatedTodos);
      })
      .catch((error) => console.error('Error deleting todo', error));
  };

  // Adjust the date to the local time zone for display
  const formatDueDate = (date) => {
    const localDate = new Date(date);  // Convert the UTC date to local time
    return localDate.toLocaleDateString();  // Adjust to local time zone and return the formatted date string
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
          className="w-full mb-4 p-2 border bg-gray-800 border-gray-900 rounded text-amber-300 placeholder-amber-300  
            focus:outline-none focus:ring-0 focus:border-amber-400"
          placeholder="Enter a task"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full mb-4 p-2 border bg-gray-800 border-gray-900 rounded text-amber-300
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
                <span className="text-xl text-amber-300">{todo.task}</span>
                <span className="ml-3 text-gray-400 text-sm">
                  Due: {formatDueDate(todo.dueDate)} {/* Display local time */}
                </span>
              </div>

              <button
                onClick={() => deleteTodo(todo._id)}
                className="text-red-500 text-xl hover:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
