import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error(error));
  }, []);

  const addTodo = () => {
    if (task) {
      axios.post('http://localhost:5000/todos', { task })
        .then(response => setTodos([...todos, response.data]))
        .catch(error => console.error(error));
      setTask('');
    }
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(error => console.error(error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">

        <h1 className="text-xl font-bold mb-4">Todo List</h1>
        <div className="mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter a task"
          />
        </div>
        <button
          onClick={addTodo}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Add Todo
        </button>
        <ul className="mt-4">
          {todos.map(todo => (
            <li key={todo._id} className="flex items-center justify-between p-2">
              <span>{todo.task}</span>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
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
