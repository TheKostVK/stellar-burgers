import { FC, SyntheticEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  const emailError = useMemo(() => {
    if (!isSubmitted) return undefined;

    if (!email.trim()) return 'Укажите email';

    if (!EMAIL_REGEX.test(email)) return 'Некорректный email';

    return undefined;
  }, [email, isSubmitted]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!email.trim() || !EMAIL_REGEX.test(email)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await forgotPasswordApi({ email });
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      emailError={emailError}
      email={email}
      setEmail={setEmail}
      isSubmitting={isSubmitting}
      isFormValid={!emailError}
      submitLabel={isSubmitting ? 'Отправляем...' : 'Восстановить'}
      handleSubmit={handleSubmit}
    />
  );
};
