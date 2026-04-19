import { FC, SyntheticEvent, useMemo, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getAuthError,
  getAuthStatus,
  loginUser
} from '../../services/slices/userSlice';
import { AppRoute } from '@constants/routes';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Login: FC = () => {
  const isLoading = useSelector(getAuthStatus);
  const authError = useSelector(getAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const from = (location.state as { from?: Location } | null)?.from;

  const navigateTo = useMemo(() => {
    if (!from) {
      return AppRoute.HOME;
    }

    return `${from.pathname}${from.search}${from.hash}`;
  }, [from]);

  const emailError = useMemo(() => {
    if (!isSubmitted) return undefined;

    if (!email.trim()) return 'Укажите email';

    if (!EMAIL_REGEX.test(email)) return 'Некорректный email';

    return undefined;
  }, [email, isSubmitted]);

  const passwordError = useMemo(() => {
    if (!isSubmitted) return undefined;

    if (!password.trim()) return 'Укажите пароль';

    if (password.trim().length < 6) return 'Минимум 6 символов';

    return undefined;
  }, [isSubmitted, password]);

  const isFormValid = !emailError && !passwordError;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const hasEmailError = !email.trim() || !EMAIL_REGEX.test(email);
    const hasPasswordError = !password.trim() || password.trim().length < 6;

    if (hasEmailError || hasPasswordError) {
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate(navigateTo, { replace: true });
    } catch (error) {
      console.error('Ошибка входа', error);
    }
  };

  return (
    <LoginUI
      errorText={authError || undefined}
      emailError={emailError}
      passwordError={passwordError}
      email={email}
      setEmail={setEmail}
      isSubmitting={isLoading}
      submitLabel={isLoading ? 'Входим...' : 'Войти'}
      isFormValid={Boolean(isFormValid)}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
