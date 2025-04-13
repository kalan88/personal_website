import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Navbar from './components/navbar';
import Home from './pages/Home'
import WebVulture from './pages/WebVulture'
import About from './pages/About'

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render( 
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<App /> } />
        <Route path="/WebVulture" element={<WebVulture />} />
        <Route path="/about" element={<About />} />
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
