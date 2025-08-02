import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { type ProtectedRouteProps } from '../types';

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 