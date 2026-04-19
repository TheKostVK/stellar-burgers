import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getAuthStatus,
  getUser,
  loginUser
} from '../../services/slices/userSlice';
import { AppRoute } from '@constants/routes';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const user = useSelector(getUser);
  const isLoading = useSelector(getAuthStatus);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }));

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
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
