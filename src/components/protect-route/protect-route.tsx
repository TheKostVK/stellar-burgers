import { ReactNode } from 'react';
import { useSelector } from '../../services/store';
import {
  getAuthStatus,
  getIsAuthInit,
  getUser
} from '../../services/slices/userSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { AppRoute } from '@constants/routes';
import { Preloader } from '@ui';

interface ProtectRouteProps {
  children?: ReactNode;
}

const PrivateRoute = ({ children }: ProtectRouteProps) => {
  const user = useSelector(getUser);
  const isLoading = useSelector(getAuthStatus);
  const isInit = useSelector(getIsAuthInit);
  const location = useLocation();

  if (!isInit || isLoading) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate to={AppRoute.LOGIN} state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
