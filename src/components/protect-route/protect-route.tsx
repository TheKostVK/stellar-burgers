import { ReactNode } from 'react';
import { useSelector } from '../../services/store';
import { getIsAuthInit, getUser } from '../../services/slices/userSlice';
import { Location, Navigate, useLocation } from 'react-router-dom';
import { AppRoute } from '@constants/routes';
import { Preloader } from '@ui';

interface ProtectRouteProps {
  onlyUnAuth?: boolean;
  children?: ReactNode;
}

type TRouteLocationState = {
  from?: Location;
};

const PrivateRoute = ({ children, onlyUnAuth = false }: ProtectRouteProps) => {
  const user = useSelector(getUser);
  const isInit = useSelector(getIsAuthInit);
  const location = useLocation();
  const from = (location.state as TRouteLocationState | null)?.from;
  const fromPath = from
    ? `${from.pathname}${from.search}${from.hash}`
    : AppRoute.HOME;

  if (!isInit) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to={AppRoute.LOGIN} state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={fromPath} replace />;
  }

  return children;
};

export default PrivateRoute;
