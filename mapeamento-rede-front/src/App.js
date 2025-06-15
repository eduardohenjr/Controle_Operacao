import React from 'react';
import Add from './pages/Add';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}