import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getAuthError,
  getAuthStatus,
  getUser,
  updateUser
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const isSubmitting = useSelector(getAuthStatus);
  const updateUserError = useSelector(getAuthError);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!user || !isFormChanged) return;

    const updatedData: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (formValue.name !== user.name) {
      updatedData.name = formValue.name.trim();
    }

    if (formValue.email !== user.email) {
      updatedData.email = formValue.email.trim();
    }

    if (formValue.password) {
      updatedData.password = formValue.password;
    }

    dispatch(updateUser(updatedData))
      .unwrap()
      .then(() => {
        setFormValue((prevState) => ({
          ...prevState,
          password: ''
        }));
      })
      .catch((error) => {
        console.error('Ошибка обновления профиля', error);
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!user) return;

    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      isSubmitting={isSubmitting}
      updateUserError={updateUserError || undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
