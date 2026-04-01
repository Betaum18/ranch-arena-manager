import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center font-heading text-xl text-primary">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
