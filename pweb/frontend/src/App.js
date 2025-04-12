import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');  // New state for due date

  useEffect(() => { 
    axios.get('http://localhost:5000/todos')
      .then(response => {
        const sortedTodos = response.data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setTodos(sortedTodos);
      })
      .catch(error => console.error(error));
  }, []);

  const addTodo = () => {
    if (!task.trim() || !dueDate) return;   
    if (task) {
      axios.post('http://localhost:5000/todos', { task, dueDate })
        .then(response => {
          const updatedTodos = [...todos, response.data];
          updatedTodos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort after adding
          setTodos(updatedTodos);
        })
        .catch(error => console.error(error));
      setTask('');
      setDueDate('');  // Reset the date after adding the todo
    }
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/todos/${id}`)
      .then(() => {
        const updatedTodos = todos.filter(todo => todo._id !== id);
        updatedTodos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort after deleting
        setTodos(updatedTodos);
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center space-x-8"> {/* Flex container with space between */}
    {/* Input Section */}
    <div className="w-1/4 bg-gray-900 p-6 rounded-lg shadow-md">
      <h1 className="text-xl text-amber-500 font-bold font-serif mb-4">Add Task</h1>

      <div className="mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full p-2 border bg-gray-800 border-gray-900 rounded text-amber-300 placeholder-amber-300  
          focus:outline-none focus:ring-0 focus:border-amber-400"
          placeholder="Enter a task"
        />
      </div>

      <div className="mb-4">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="w-full p-2 border bg-gray-800 border-gray-900 rounded text-amber-300
           focus:outline-none focus:ring-0 focus:border-amber-400"
        />
      </div>

      <button
        onClick={addTodo}
        className="w-full bg-amber-400 text-gray-800 p-2 rounded font-bold font-serif hover:bg-amber-500"
      >
        Add Todo
      </button>
    </div>

    {/* List Section */}
    <div className="w-2/4 bg-gray-900 p-6 rounded-lg shadow-md m-4">
      <h2 className="text-xl text-amber-500 font-bold font-serif mb-4">To-do List</h2>
      <ul className="mt-4">
        {todos.map(todo => (
          <li key={todo._id} className="flex items-center justify-between p-2">
            <div>
              <span className="text-amber-400">{todo.task}</span>
              {todo.dueDate && (
                <span className="ml-2 text-gray-400">Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
              )}
            </div>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="w-15 bg-amber-400 hover:bg-amber-500 text-gray-800 font-serif font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
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
