import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getAuthStatus,
  getUser,
  registerUser
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { AppRoute } from '@constants/routes';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const user = useSelector(getUser);
  const isLoading = useSelector(getAuthStatus);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await dispatch(registerUser({ email, name: userName, password }));

    if (location.state?.from) {
      navigate(location.state.from.pathname, { replace: true });
    }
  };

  useEffect(() => {
    if (user) {
      navigate(AppRoute.HOME, { replace: true });
    }
  }, [user]);

  return isLoading ? (
    <Preloader />
  ) : (
    <RegisterUI
      errorText=''
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
