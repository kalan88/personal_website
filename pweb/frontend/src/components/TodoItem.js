import React from 'react';

const TodoItem = ({ todo }) => {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg">
      <span>{todo.title}</span>
      <button className="bg-red-500 text-white px-3 py-1 rounded-md">
        Delete
      </button>
    </div>
  );
};

export default TodoItem;
