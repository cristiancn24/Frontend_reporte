"use client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Otras rutas */}
      </Routes>
    </Router>
  );
}