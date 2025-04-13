
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/auth/Login';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default AuthRoutes;
