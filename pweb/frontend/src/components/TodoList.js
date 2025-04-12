import React, { useState, useEffect } from 'react';
import axios from '../axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Fetch todos from backend
  useEffect(() => {
    axios.get('/todos')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  }, []);

  // Handle creating a new todo
  const handleCreateTodo = () => {
    if (!newTodo) return;

    axios.post('/todos', { title: newTodo })
      .then(response => {
        setTodos([...todos, response.data]);
        setNewTodo('');
      })
      .catch(error => {
        console.error('Error creating todo:', error);
      });
  };

  // Handle editing a todo
  const handleEditTodo = (id, title) => {
    setEditingTodo(id);
    setEditTitle(title);
  };

  // Save edited todo
  const handleSaveEdit = () => {
    if (!editTitle) return;

    axios.put(`/todos/${editingTodo}`, { title: editTitle })
      .then(response => {
        const updatedTodos = todos.map(todo =>
          todo.id === editingTodo ? response.data : todo
        );
        setTodos(updatedTodos);
        setEditingTodo(null);
        setEditTitle('');
      })
      .catch(error => {
        console.error('Error editing todo:', error);
      });
  };

  // Handle deleting a todo
  const handleDeleteTodo = (id) => {
    axios.delete(`/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  };

  return (
    <div className="todo-list">
      <h1>Todo List</h1>

      {/* Create Todo */}
      <div>
        <input
          type="text"
          placeholder="Enter new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleCreateTodo}>Add Todo</button>
      </div>

      {/* List Todos */}
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {editingTodo === todo.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={() => setEditingTodo(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span style={{ textDecoration: todo.completed ? 'line-through' : '' }}>
                  {todo.title}
                </span>
                <button onClick={() => handleEditTodo(todo.id, todo.title)}>Edit</button>
                <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
