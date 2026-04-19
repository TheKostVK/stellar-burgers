import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const passwordError = useMemo(() => {
    if (!isSubmitted) return undefined;

    if (!password.trim()) return 'Укажите пароль';

    if (password.trim().length < 6) return 'Минимум 6 символов';

    return undefined;
  }, [isSubmitted, password]);

  const tokenError = useMemo(() => {
    if (!isSubmitted) return undefined;

    if (!token.trim()) return 'Введите код из письма';

    return undefined;
  }, [isSubmitted, token]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (passwordError || tokenError) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await resetPasswordApi({ password, token });
      localStorage.removeItem('resetPassword');
      navigate('/login');
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      passwordError={passwordError}
      tokenError={tokenError}
      isSubmitting={isSubmitting}
      submitLabel={isSubmitting ? 'Сохраняем...' : 'Сохранить'}
      isFormValid={!passwordError && !tokenError}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
