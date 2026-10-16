import { useSelector } from '@/services/store';
import { selectIsAuthChecked, selectUser } from '@/services/userSlice';
import { Preloader } from '@ui';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import type { Location } from 'react-router-dom';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

type TLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as TLocationState | null)?.from;
    return <Navigate to={from ?? '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
