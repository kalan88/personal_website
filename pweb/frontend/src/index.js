import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Navbar from './components/navbar';
import Home from './pages/Home'

const About = () => (
  <div className="p-6 text-lg">
    <h2 className="text-2xl font-bold mb-2">About</h2>
    <p>This is a simple Todo app built with React and Tailwind CSS.</p>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<App /> } />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
