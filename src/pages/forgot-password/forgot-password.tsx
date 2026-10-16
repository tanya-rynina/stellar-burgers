import { useDispatch, useSelector } from '@/services/store';
import { clearError, forgotPasswordThunk, selectUserError } from '@/services/userSlice';
import { ForgotPasswordUI } from '@ui-pages';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { SyntheticEvent } from 'react';

export const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectUserError);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(forgotPasswordThunk({ email }))
      .unwrap()
      .then(() => {
        void navigate('/reset-password', { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <ForgotPasswordUI
      errorText={error ?? undefined}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
