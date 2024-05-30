import useAuthStore from '@/stores/useAuthStore';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouterProps {
  children?: ReactNode;
}

const PrivateRouter = ({ children }: PrivateRouterProps) => {
  const { authState } = useAuthStore();

  if (!authState) {
    return <Navigate to={'/'} replace />;
  }

  return <>{children}</>;
};

export default PrivateRouter;
