import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router';
import { Preloader } from '@ui';
import {
  isAuthCheckedSelector,
  userDataSelector,
  userStatusSelector
} from 'src/services/slices/userSlice';
import { RequestStatus } from '@utils-types';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userDataSelector);
  const status = useSelector(userStatusSelector);
  const location = useLocation();

  if (!isAuthChecked || status === RequestStatus.Loading) {
    return <Preloader />;
  }
  if (!onlyUnAuth && !user) {
    return (
      <Navigate
        replace
        to={'/login'}
        state={{
          from: {
            ...location,
            background: location.state?.background,
            state: null
          }
        }}
      />
    );
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    const backgroundLocation = location.state?.from?.background || null;
    return (
      <Navigate replace to={from} state={{ background: backgroundLocation }} />
    );
  }

  return children;
};
