import { ProfileUI } from '@ui-pages';
import { RequestStatus } from '@utils-types';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import {
  updateUser,
  userDataSelector,
  userStatusSelector
} from 'src/services/slices/userSlice';
import { useDispatch, useSelector } from 'src/services/store';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(userDataSelector);
  const isLoading = useSelector(userStatusSelector) === RequestStatus.Loading;

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue((prevState) => ({
        ...prevState,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isFormChanged || isLoading) return;

    try {
      await dispatch(updateUser(formValue)).unwrap();
      setFormValue((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
