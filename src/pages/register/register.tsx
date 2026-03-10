import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from 'src/services/store';
import {
  register,
  userErrorSelector,
  userStatusSelector
} from 'src/services/slices/userSlice';
import { RequestStatus } from '@utils-types';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(userStatusSelector) === RequestStatus.Loading;
  const error = useSelector(userErrorSelector);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!userName || !email || !password || isLoading) return;

    try {
      await dispatch(
        register({
          name: userName,
          email,
          password
        })
      ).unwrap();
      setUserName('');
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      console.error('Ошибка регистрации:', err);
    }
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
