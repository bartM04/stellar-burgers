import { Preloader } from '@ui';
import { useLocation, Navigate } from 'react-router-dom';

import { selectUser, selectIsAuthChecked } from '../../services/selectors';
import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  children: React.JSX.Element;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element | null => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const state = location.state as { from?: { pathname: string } } | null;
    const from = state?.from ?? { pathname: '/' };
    return <Navigate to={from.pathname} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
