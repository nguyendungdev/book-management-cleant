import useAuthStore from '@/stores/useAuthStore';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouterProps {
	children?: ReactNode;
}

const AdminPrivateRouter = ({ children }: PrivateRouterProps) => {
	const { authState } = useAuthStore();

	if (!authState) {
		return <Navigate to={'/'} replace />;
	}

	if (authState.user?.role && authState.user.role.name !== "Admin") {
		return <Navigate to={'/'} replace />;
	}

	return <>{children}</>;
};

export default AdminPrivateRouter;
