import React, { useState } from 'react';
import { addTodo } from '../utils/api';

const TodoForm = ({ fetchTodos }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim()) {
      await addTodo({ title });
      fetchTodos();  // To refresh the todo list
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border rounded-md"
        placeholder="Add a new todo"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;
