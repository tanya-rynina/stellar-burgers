import { Outlet } from 'react-router-dom';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  // TODO (Шаг 4): редирект авторизованных с /login, /register, /forgot-password, /reset-password
  void onlyUnAuth;
  return <Outlet />;
};
