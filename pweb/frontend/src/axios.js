import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://personal-website-6pxg.onrender.com', 
});

export default instance;
