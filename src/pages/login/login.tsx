import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from 'src/services/store';
import {
  login,
  userErrorSelector,
  userStatusSelector
} from 'src/services/slices/userSlice';
import { RequestStatus } from '@utils-types';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(userStatusSelector) === RequestStatus.Loading;
  const error = useSelector(userErrorSelector);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;
    try {
      await dispatch(login({ email, password })).unwrap();
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      console.error('Ошибка входа:', err);
    }
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
