import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'src/services/store';
import { userDataSelector } from 'src/services/slices/userSlice';

export const AppHeader: FC = () => {
  const user = useSelector(userDataSelector);
  const userName = localStorage.getItem('userName') || user?.name || '';
  return <AppHeaderUI userName={userName} />;
};
