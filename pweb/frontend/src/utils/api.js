const API_URL = 'https://personal-website-6pxg.onrender.com/todos';

export const getTodos = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const addTodo = async (todo) => {
  await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
};
