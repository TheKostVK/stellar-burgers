import { FC, SyntheticEvent, useMemo, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import {
  getAuthError,
  getAuthStatus,
  registerUser
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { AppRoute } from '@constants/routes';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Register: FC = () => {
  const isLoading = useSelector(getAuthStatus);
  const authError = useSelector(getAuthError);

  const [userName, setUserName] = useState('');
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

  const userNameError = useMemo(() => {
    if (!isSubmitted) return undefined;

    if (!userName.trim()) return 'Укажите имя';

    if (userName.trim().length < 2) return 'Минимум 2 символа';

    return undefined;
  }, [isSubmitted, userName]);

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

  const isFormValid = !userNameError && !emailError && !passwordError;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const hasUserNameError = !userName.trim() || userName.trim().length < 2;
    const hasEmailError = !email.trim() || !EMAIL_REGEX.test(email);
    const hasPasswordError = !password.trim() || password.trim().length < 6;

    if (hasUserNameError || hasEmailError || hasPasswordError) {
      return;
    }

    try {
      await dispatch(
        registerUser({ email, name: userName.trim(), password })
      ).unwrap();
      navigate(navigateTo, { replace: true });
    } catch (error) {
      console.error('Ошибка регистрации', error);
    }
  };

  return (
    <RegisterUI
      errorText={authError || undefined}
      emailError={emailError}
      userNameError={userNameError}
      passwordError={passwordError}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      isSubmitting={isLoading}
      submitLabel={isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
      isFormValid={Boolean(isFormValid)}
      handleSubmit={handleSubmit}
    />
  );
};
