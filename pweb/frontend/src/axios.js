import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://kalan88backend.netlify.app/.netlify/functions', 
});

export default instance;
