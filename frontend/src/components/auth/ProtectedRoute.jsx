import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user } = useSelector((s) => s.auth);

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !(user.isAdmin || user.role === 'admin')) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
