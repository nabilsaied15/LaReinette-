import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { shouldAllowAdminRoute } from '../utils/adminAuth';

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useSettings();

  if (!shouldAllowAdminRoute(isAdmin, import.meta.env.DEV)) {
    // Redirect to login if not authenticated
    return <Navigate to="/direction/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
